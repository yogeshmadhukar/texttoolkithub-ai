// Structured Data (JSON-LD) Schema Generator Utility
// Compliant with Google's E-E-A-T (Experience, Expertise, Authoritativeness, and Trustworthiness) guidelines

export const DEFAULT_DOMAIN = 'https://texttoolkithub.com';
export const PUBLISHER_NAME = 'Madhukar & Sons Digital';
export const AUTHOR_NAME = 'Yogesh Kumar Madhukar';
export const AUTHOR_JOB_TITLE = 'Founder, Senior Full-Stack Engineer & Editorial Director';
export const SUPPORT_EMAIL = 'support@texttoolkithub.com';
export const GENERAL_EMAIL = 'hello@texttoolkithub.com';
export const AUTHOR_EMAIL = 'hello@texttoolkithub.com';
export const AUTHOR_LINKEDIN = 'https://www.linkedin.com/in/texttoolkithub';
export const AUTHOR_X = 'https://x.com/TextToolkitHub';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface HowToStep {
  name: string;
  text: string;
  url?: string;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface SchemaGeneratorOptions {
  title: string;
  description: string;
  canonicalUrl: string;
  category?: string;
  ratingValue?: number;
  ratingCount?: number;
  faqs?: FAQItem[];
  howToSteps?: HowToStep[];
  breadcrumbs?: BreadcrumbItem[];
  featureList?: string[];
  lastUpdatedDate?: string;
}

/**
 * 1. Global Organization Schema
 * Represents Madhukar & Sons Digital as the official publisher entity.
 */
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${DEFAULT_DOMAIN}/#organization`,
    'name': PUBLISHER_NAME,
    'alternateName': 'Madhukar & Sons Digital Publishing',
    'url': DEFAULT_DOMAIN,
    'logo': {
      '@type': 'ImageObject',
      'url': `${DEFAULT_DOMAIN}/logo.png`,
      'width': '512',
      'height': '512'
    },
    'foundingDate': '2024',
    'founder': {
      '@type': 'Person',
      'name': AUTHOR_NAME,
      'jobTitle': AUTHOR_JOB_TITLE,
      'url': `${DEFAULT_DOMAIN}/about#founder`
    },
    'publishingPrinciples': `${DEFAULT_DOMAIN}/about#editorial-policy-section`,
    'knowsAbout': [
      'Software Development',
      'Browser Security & Sandboxing',
      'Data Privacy',
      'Text Analytics',
      'SEO & Digital Publishing'
    ],
    'sameAs': [
      AUTHOR_X,
      AUTHOR_LINKEDIN
    ],
    'contactPoint': {
      '@type': 'ContactPoint',
      'contactType': 'Technical Support & Editorial Enquiries',
      'email': SUPPORT_EMAIL,
      'availableLanguage': ['English']
    }
  };
}

/**
 * 2. Global Person / Author Schema
 * Represents Yogesh Kumar Madhukar with expert credentials and E-E-A-T signals.
 */
export function getAuthorPersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${DEFAULT_DOMAIN}/#author`,
    'name': AUTHOR_NAME,
    'jobTitle': AUTHOR_JOB_TITLE,
    'worksFor': {
      '@type': 'Organization',
      'name': PUBLISHER_NAME,
      'url': DEFAULT_DOMAIN
    },
    'url': `${DEFAULT_DOMAIN}/about#founder`,
    'email': AUTHOR_EMAIL,
    'description': `${AUTHOR_NAME} is an independent senior software developer, technical writer, and founder of TextToolkitHub under ${PUBLISHER_NAME}. He specializes in privacy-first web application architecture, client-side WebAssembly tools, and digital editorial standards.`,
    'knowsAbout': [
      'Full-Stack Web Development',
      'React & TypeScript Systems',
      'Privacy-Preserving Web Utilities',
      'Client-Side WebAssembly & JS Parsers',
      'Search Engine Optimization (SEO)',
      'Editorial Standards & Technical Accuracy'
    ],
    'sameAs': [
      AUTHOR_LINKEDIN,
      AUTHOR_X
    ]
  };
}

/**
 * 3. WebApplication / SoftwareApplication Schema
 * Dynamic schema for all tool pages specifying operatingSystem, applicationCategory, offers, and client processing details.
 */
export function getWebApplicationSchema(options: SchemaGeneratorOptions) {
  const toolName = options.title.replace(` | TextToolkitHub`, '');
  const cleanUrl = options.canonicalUrl.startsWith('http')
    ? options.canonicalUrl
    : `${DEFAULT_DOMAIN}${options.canonicalUrl.startsWith('/') ? options.canonicalUrl : '/' + options.canonicalUrl}`;

  const ratingValue = options.ratingValue || 4.9;
  const ratingCount = options.ratingCount || 1250;

  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': `${cleanUrl}#webapp`,
    'name': toolName,
    'url': cleanUrl,
    'description': options.description,
    'applicationCategory': 'UtilityApplication',
    'operatingSystem': 'All modern web browsers (Windows, macOS, Linux, iOS, Android)',
    'browserRequirements': 'Requires JavaScript enabled. 100% browser-native client-side processing with zero server uploads.',
    'softwareVersion': '1.0.0',
    'isAccessibleForFree': true,
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD',
      'availability': 'https://schema.org/InStock'
    },
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': ratingValue.toFixed(1),
      'ratingCount': ratingCount.toString(),
      'bestRating': '5',
      'worstRating': '1'
    },
    'featureList': options.featureList || [
      '100% On-Device Client Processing',
      'Zero Remote Server Uploads',
      'Instant In-Memory Computation',
      'GDPR & Privacy Compliant',
      'No Account or Registration Required'
    ],
    'dateModified': options.lastUpdatedDate || '2026-08-01',
    'publisher': {
      '@type': 'Organization',
      'name': PUBLISHER_NAME,
      'url': DEFAULT_DOMAIN,
      '@id': `${DEFAULT_DOMAIN}/#organization`
    },
    'author': {
      '@type': 'Person',
      'name': AUTHOR_NAME,
      'jobTitle': AUTHOR_JOB_TITLE,
      '@id': `${DEFAULT_DOMAIN}/#author`
    }
  };
}

/**
 * 4. FAQPage Schema
 * Structured data block for tool and educational page FAQs.
 */
export function getFAQSchema(faqs: FAQItem[]) {
  if (!faqs || faqs.length === 0) return null;

  return {
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
}

/**
 * 5. HowTo Schema
 * Embedded HowTo structured data block for step-by-step instructions.
 */
export function getHowToSchema(title: string, description: string, steps: HowToStep[], url: string) {
  if (!steps || steps.length === 0) return null;

  const cleanUrl = url.startsWith('http')
    ? url
    : `${DEFAULT_DOMAIN}${url.startsWith('/') ? url : '/' + url}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    'name': `How to use ${title.replace(' | TextToolkitHub', '')}`,
    'description': description,
    'totalTime': 'PT1M',
    'tool': [
      {
        '@type': 'HowToTool',
        'name': 'Web Browser'
      }
    ],
    'step': steps.map((step, idx) => ({
      '@type': 'HowToStep',
      'position': idx + 1,
      'name': step.name,
      'text': step.text,
      'url': `${cleanUrl}#step-${idx + 1}`
    }))
  };
}

/**
 * 6. BreadcrumbList Schema
 */
export function getBreadcrumbSchema(breadcrumbs: BreadcrumbItem[]) {
  if (!breadcrumbs || breadcrumbs.length <= 1) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': breadcrumbs.map((crumb, idx) => ({
      '@type': 'ListItem',
      'position': idx + 1,
      'name': crumb.name,
      'item': crumb.url.startsWith('http') ? crumb.url : `${DEFAULT_DOMAIN}${crumb.url.startsWith('/') ? crumb.url : '/' + crumb.url}`
    }))
  };
}
