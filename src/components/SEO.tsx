import React, { useEffect } from 'react';
import {
  DEFAULT_DOMAIN,
  FAQItem,
  HowToStep,
  BreadcrumbItem,
  getOrganizationSchema,
  getAuthorPersonSchema,
  getWebApplicationSchema,
  getFAQSchema,
  getHowToSchema,
  getBreadcrumbSchema,
} from '../utils/schemaGenerator.ts';

export type { FAQItem, HowToStep, BreadcrumbItem };

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
  howToSteps?: HowToStep[];
  breadcrumbs?: BreadcrumbItem[];
  featureList?: string[];
  lastUpdatedDate?: string;
  noindex?: boolean;
}

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
  howToSteps = [],
  breadcrumbs = [],
  featureList,
  lastUpdatedDate = 'August 2026',
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
    const setJsonLdScript = (id: string, jsonObject: object | null) => {
      let script = document.head.querySelector(`script#${id}`) as HTMLScriptElement | null;
      if (!jsonObject) {
        if (script) script.remove();
        return;
      }
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
    setMetaTag('name', 'author', 'Yogesh Kumar Madhukar');
    setMetaTag('name', 'publisher', 'Madhukar & Sons Digital');

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

    // 6. Inject E-E-A-T Structured Data Schemas
    // A) Global Organization Schema (Madhukar & Sons Digital)
    setJsonLdScript('seo-organization-schema', getOrganizationSchema());

    // B) Global Person / Author Schema (Yogesh Kumar Madhukar)
    setJsonLdScript('seo-author-schema', getAuthorPersonSchema());

    // C) SoftwareApplication / WebApplication Schema for Tools
    if (fullCanonical !== DEFAULT_DOMAIN) {
      const appSchema = getWebApplicationSchema({
        title: formattedTitle,
        description,
        canonicalUrl: fullCanonical,
        category,
        ratingValue,
        ratingCount,
        featureList,
        lastUpdatedDate,
      });
      setJsonLdScript('seo-app-schema', appSchema);
    } else {
      setJsonLdScript('seo-app-schema', null);
    }

    // D) FAQPage Schema if FAQs exist
    const faqSchema = getFAQSchema(faqs);
    setJsonLdScript('seo-faq-schema', faqSchema);

    // E) HowTo Schema if howToSteps exist
    if (howToSteps && howToSteps.length > 0) {
      const howToSchema = getHowToSchema(title, description, howToSteps, fullCanonical);
      setJsonLdScript('seo-howto-schema', howToSchema);
    } else {
      setJsonLdScript('seo-howto-schema', null);
    }

    // F) BreadcrumbList Schema
    const breadcrumbList = breadcrumbs.length > 0 
      ? breadcrumbs 
      : [
          { name: 'Home', url: DEFAULT_DOMAIN },
          ...(fullCanonical !== DEFAULT_DOMAIN ? [{ name: category, url: `${DEFAULT_DOMAIN}/tools` }, { name: title.replace(` | ${SITE_NAME}`, ''), url: fullCanonical }] : [])
        ];

    const breadcrumbSchema = getBreadcrumbSchema(breadcrumbList);
    setJsonLdScript('seo-breadcrumb-schema', breadcrumbSchema);

  }, [
    formattedTitle,
    description,
    fullCanonical,
    ogType,
    ogImage,
    category,
    ratingValue,
    ratingCount,
    faqs,
    howToSteps,
    breadcrumbs,
    featureList,
    lastUpdatedDate,
    noindex,
  ]);

  return null;
};

export default SEO;
