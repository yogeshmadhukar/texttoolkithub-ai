/**
 * Security utilities to secure user input rendering against injection vectors and XSS.
 */

export function sanitizeHtml(html: string): string {
  if (!html) return '';

  // Fallback regex-based cleaning if DOMParser is unavailable or during SSR compilation
  const fallbackClean = (rawHtml: string): string => {
    return rawHtml
      // Strip dangerous blocks completely
      .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '')
      .replace(/<iframe[^>]*>([\s\S]*?)<\/iframe>/gi, '')
      .replace(/<object[^>]*>([\s\S]*?)<\/object>/gi, '')
      .replace(/<embed[^>]*>/gi, '')
      .replace(/<link[^>]*>/gi, '')
      .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, '')
      .replace(/<form[^>]*>([\s\S]*?)<\/form>/gi, '')
      // Strip dynamic triggers and events
      .replace(/\s+on\w+\s*=\s*"[^"]*"/gi, '')
      .replace(/\s+on\w+\s*=\s*'[^']*'/gi, '')
      .replace(/\s+on\w+\s*=\s*[^\s>]+/gi, '')
      // Strip script links
      .replace(/href\s*=\s*["']\s*javascript:[\s\S]*?["']/gi, 'href="#"')
      .replace(/src\s*=\s*["']\s*javascript:[\s\S]*?["']/gi, 'src="#"')
      .replace(/href\s*=\s*["']\s*data:(?!image\/(png|jpeg|jpg|gif|webp))[\s\S]*?["']/gi, 'href="#"')
      .replace(/src\s*=\s*["']\s*data:(?!image\/(png|jpeg|jpg|gif|webp))[\s\S]*?["']/gi, 'src="#"');
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

        // 1. Remove dangerous CSS/HTML tags entirely
        const blockedTags = [
          'script', 'iframe', 'object', 'embed', 'link', 'style', 
          'form', 'input', 'button', 'textarea', 'select', 'meta',
          'applet', 'base', 'frame', 'frameset', 'noscript'
        ];
        if (blockedTags.includes(tagName)) {
          el.parentNode?.removeChild(el);
          return;
        }

        // 2. Clean attributes to strip javascript href tags, non-image data URIs, and event handler triggers
        const attrs = Array.from(el.attributes);
        for (const attr of attrs) {
          const attrName = attr.name.toLowerCase();
          const attrValRaw = attr.value;
          
          // Force normalize the attribute value for strict protocol check:
          // Strip white-space and all invisible control characters (NULL, CR, LF, VT, Tab, Zero-width spacing etc.)
          const normalizedVal = attrValRaw
            .toLowerCase()
            .replace(/[\s\x00-\x1F\x7F-\x9F\xAD\u200B-\u200D\uFEFF]/g, '');

          // Block all inline javascript state event handlers (starts with 'on' like onload, onerror, onclick)
          if (attrName.startsWith('on')) {
            el.removeAttribute(attr.name);
            continue;
          }

          // Protect active executable components (href, src, action)
          if (attrName === 'href' || attrName === 'src' || attrName === 'action') {
            // Block javascript executable URLs
            if (normalizedVal.startsWith('javascript:') || normalizedVal.startsWith('vbscript:')) {
              el.setAttribute(attr.name, '#');
            } 
            // Block SVG/HTML data-URIs or code-containing formats, allowing only safe static images
            else if (normalizedVal.startsWith('data:')) {
              const allowedImgTypes = [
                'data:image/png',
                'data:image/jpeg',
                'data:image/jpg',
                'data:image/gif',
                'data:image/webp'
              ];
              const isAllowedImage = allowedImgTypes.some(prefix => normalizedVal.startsWith(prefix));
              if (!isAllowedImage) {
                if (attrName === 'src') {
                  // Put a safe blank transparent image source or remove
                  el.removeAttribute(attr.name);
                } else {
                  el.setAttribute(attr.name, '#');
                }
              }
            }
          }
        }

        // 3. Prevent reverse tabnabbing and secure target=_blank hyperlinks
        if (tagName === 'a') {
          const href = el.getAttribute('href') || '';
          const isExternal = href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//');
          
          if (isExternal) {
            el.setAttribute('rel', 'noopener noreferrer');
            // If it opens a new window, enforce noopener target safely
            const target = el.getAttribute('target');
            if (target && target.toLowerCase() === '_blank') {
              el.setAttribute('target', '_blank');
            }
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
