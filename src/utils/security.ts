/**
 * Security utilities to secure user input rendering against injection vectors and XSS.
 */

export function sanitizeHtml(html: string): string {
  if (!html) return '';

  // Fallback regex-based cleaning if DOMParser is unavailable or during SSR compilation
  const fallbackClean = (rawHtml: string): string => {
    return rawHtml
      .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '')
      .replace(/<iframe[^>]*>([\s\S]*?)<\/iframe>/gi, '')
      .replace(/<object[^>]*>([\s\S]*?)<\/object>/gi, '')
      .replace(/<embed[^>]*>/gi, '')
      .replace(/<link[^>]*>/gi, '')
      .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, '')
      .replace(/on\w+\s*=\s*"[^"]*"/gi, '')
      .replace(/on\w+\s*=\s*'[^']*'/gi, '')
      .replace(/on\w+\s*=\s*[^\s>]+/gi, '')
      .replace(/href\s*=\s*"javascript:[^"]*"/gi, '')
      .replace(/href\s*=\s*'javascript:[^']*'/gi, '')
      .replace(/src\s*=\s*"javascript:[^"]*"/gi, '')
      .replace(/src\s*=\s*'javascript:[^']*'/gi, '');
  };

  if (typeof window === 'undefined' || !window.DOMParser) {
    return fallbackClean(html);
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Recursive traversal to safely sanitize elements and attributes
    const cleanNode = (node: Node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        const tagName = el.tagName.toLowerCase();

        // 1. Remove dangerous HTML tags entirely
        const blockedTags = [
          'script', 'iframe', 'object', 'embed', 'link', 'style', 
          'form', 'input', 'button', 'textarea', 'select', 'meta',
          'applet', 'base', 'frame', 'frameset', 'noscript'
        ];
        if (blockedTags.includes(tagName)) {
          el.parentNode?.removeChild(el);
          return;
        }

        // 2. Clean attributes to strip javascript href tags and event handler triggers
        const attrs = Array.from(el.attributes);
        for (const attr of attrs) {
          const attrName = attr.name.toLowerCase();
          const attrVal = attr.value.toLowerCase().trim();

          // Block all inline javascript state events (e.g., onerror, onload, onclick, etc.)
          if (attrName.startsWith('on')) {
            el.removeAttribute(attr.name);
          }
          // Block javascript: executable urls
          else if ((attrName === 'href' || attrName === 'src' || attrName === 'action') && attrVal.startsWith('javascript:')) {
            el.setAttribute(attr.name, '#');
          }
          // Block VB scripts and malicious data-uri structures
          else if ((attrName === 'href' || attrName === 'src') && (attrVal.includes('data:text/html') || attrVal.startsWith('vbscript:'))) {
            el.removeAttribute(attr.name);
          }
        }
      }

      // Process all child nodes recursively
      const children = Array.from(node.childNodes);
      children.forEach(cleanNode);
    };

    // Sanitize elements starting inside standard HTML body tag
    const bodyChildren = Array.from(doc.body.childNodes);
    bodyChildren.forEach(cleanNode);

    return doc.body.innerHTML;
  } catch (err) {
    console.warn("[Security] DOMParser sanitization error, reverting to clean regex safety layer:", err);
    return fallbackClean(html);
  }
}
