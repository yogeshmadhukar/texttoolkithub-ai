import React, { useEffect } from 'react';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface SEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  category?: string;
  ratingValue?: number;
  ratingCount?: number;
  faqs?: FAQItem[];
  breadcrumbs?: BreadcrumbItem[];
  noindex?: boolean;
}

const DEFAULT_DOMAIN = 'https://texttoolkithub.com';
const DEFAULT_IMAGE = `${DEFAULT_DOMAIN}/og-image.png`;
const SITE_NAME = 'TextToolkitHub';

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonicalUrl,
  ogType = 'website',
  ogImage = DEFAULT_IMAGE,
  category = 'Utilities',
  ratingValue = 4.9,
  ratingCount = 1250,
  faqs = [],
  breadcrumbs = [],
  noindex = false,
}) => {
  // Format Title: Ensure "Tool Name | TextToolkitHub"
  const formattedTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  
  // Format Canonical
  const cleanPath = canonicalUrl ? (canonicalUrl.startsWith('/') ? canonicalUrl : `/${canonicalUrl}`) : '';
  const fullCanonical = canonicalUrl ? (canonicalUrl.startsWith('http') ? canonicalUrl : `${DEFAULT_DOMAIN}${cleanPath}`) : DEFAULT_DOMAIN;

  useEffect(() => {
    // 1. Update Document Title
    document.title = formattedTitle;

    // Helper to update or create meta tags
    const setMetaTag = (attrName: string, attrValue: string, content: string) => {
      let element = document.head.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper to update or create link tags
    const setLinkTag = (rel: string, href: string) => {
      let element = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // Helper to inject/update JSON-LD script tags
    const setJsonLdScript = (id: string, jsonObject: object) => {
      let script = document.head.querySelector(`script#${id}`) as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement('script');
        script.id = id;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonObject, null, 2);
    };

    // 2. Set Basic Meta Tags
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    setMetaTag('name', 'theme-color', '#4f46e5');

    // 3. Set Open Graph Tags
    setMetaTag('property', 'og:site_name', SITE_NAME);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:title', formattedTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', fullCanonical);
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:locale', 'en_US');

    // 4. Set Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:site', '@TextToolkitHub');
    setMetaTag('name', 'twitter:title', formattedTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', ogImage);

    // 5. Set Canonical URL
    setLinkTag('canonical', fullCanonical);

    // 6. Inject JSON-LD Structured Data
    // A) Website / Organization Schema (Global)
    const websiteSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': SITE_NAME,
      'url': DEFAULT_DOMAIN,
      'description': 'Free, browser-native developer, text, and PDF utilities with 100% client-side privacy.',
      'potentialAction': {
        '@type': 'SearchAction',
        'target': `${DEFAULT_DOMAIN}/?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    };
    setJsonLdScript('seo-website-schema', websiteSchema);

    // B) SoftwareApplication / WebApplication Schema for Tools
    if (fullCanonical !== DEFAULT_DOMAIN) {
      const toolName = title.replace(` | ${SITE_NAME}`, '');
      const appSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        'name': toolName,
        'url': fullCanonical,
        'description': description,
        'applicationCategory': 'UtilityApplication',
        'operatingSystem': 'All modern web browsers (Windows, macOS, Linux, iOS, Android)',
        'browserRequirements': 'Requires JavaScript. 100% browser-based with zero server file uploads.',
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'USD'
        },
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': ratingValue.toFixed(1),
          'ratingCount': ratingCount.toString(),
          'bestRating': '5',
          'worstRating': '1'
        },
        'publisher': {
          '@type': 'Organization',
          'name': SITE_NAME,
          'url': DEFAULT_DOMAIN,
          'logo': `${DEFAULT_DOMAIN}/logo.png`
        }
      };
      setJsonLdScript('seo-app-schema', appSchema);
    } else {
      const existingAppScript = document.head.querySelector('script#seo-app-schema');
      if (existingAppScript) existingAppScript.remove();
    }

    // C) FAQPage Schema if FAQs exist
    if (faqs && faqs.length > 0) {
      const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': faqs.map(faq => ({
          '@type': 'Question',
          'name': faq.question,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': faq.answer
          }
        }))
      };
      setJsonLdScript('seo-faq-schema', faqSchema);
    } else {
      const existingFaqScript = document.head.querySelector('script#seo-faq-schema');
      if (existingFaqScript) existingFaqScript.remove();
    }

    // D) BreadcrumbList Schema
    const breadcrumbList = breadcrumbs.length > 0 
      ? breadcrumbs 
      : [
          { name: 'Home', url: DEFAULT_DOMAIN },
          ...(fullCanonical !== DEFAULT_DOMAIN ? [{ name: category, url: `${DEFAULT_DOMAIN}/` }, { name: title.replace(` | ${SITE_NAME}`, ''), url: fullCanonical }] : [])
        ];

    if (breadcrumbList.length > 1) {
      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': breadcrumbList.map((crumb, idx) => ({
          '@type': 'ListItem',
          'position': idx + 1,
          'name': crumb.name,
          'item': crumb.url.startsWith('http') ? crumb.url : `${DEFAULT_DOMAIN}${crumb.url.startsWith('/') ? crumb.url : '/' + crumb.url}`
        }))
      };
      setJsonLdScript('seo-breadcrumb-schema', breadcrumbSchema);
    } else {
      const existingBcScript = document.head.querySelector('script#seo-breadcrumb-schema');
      if (existingBcScript) existingBcScript.remove();
    }

  }, [formattedTitle, description, fullCanonical, ogType, ogImage, category, ratingValue, ratingCount, faqs, breadcrumbs, noindex]);

  return null;
};

export default SEO;
