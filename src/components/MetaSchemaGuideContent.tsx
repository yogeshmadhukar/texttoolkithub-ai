import React from 'react';

export const MetaSchemaGuideContent: React.FC = () => {
  return (
    <>
      <div className="bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border border-indigo-100/25 dark:border-indigo-950/25 p-6 rounded-2xl mb-8 flex flex-col md:flex-row gap-6 items-center" id="introduction">
        <div className="space-y-2">
          <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">SEO & Schema Markup Standard</span>
          <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed">
            This advanced guide details the crawl pipelines of modern search engines, Open Graph specifications, and structured schema implementation for high-ranking Rich Results.
          </p>
        </div>
      </div>

      <p className="text-base text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
        Building a lightning-fast, highly functional web application is only the first step in digital publishing. For your platform to reach a global audience, search engine crawlers (such as Googlebot and Bingbot) must be able to discover, parse, categorize, and index your pages. Modern search engines are no longer simple keyword matching indexes; they are highly sophisticated semantic graphs that analyze metadata headers, verify canonical routing, and render structured JSON-LD schemas to serve immersive rich results.
      </p>

      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="seo-meta">The Core Pillars of SEO Metadata Headers</h2>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        When a crawler retrieves a webpage, the first segment it analyzes is the HTML <code>&lt;head&gt;</code> element. This block should contain descriptive, high-density tags defining the page's boundaries and presentation:
      </p>
      <ul className="list-disc pl-5 space-y-2 text-xs text-slate-650 dark:text-slate-350 my-4">
        <li><strong>Title Tag:</strong> The primary title of the page, displayed as the clickable headline in Search Engine Result Pages (SERPs). It should be between **50 to 60 characters** long to prevent being truncated.</li>
        <li><strong>Meta Description:</strong> A concise summary of the page's content, displayed as the description snippet in SERPs. Keep this between **120 to 160 characters** to ensure maximum visual impact across both desktop and mobile layouts.</li>
        <li><strong>Canonical URL (<code>&lt;link rel="canonical"&gt;</code>):</strong> Specifies the authoritative source URL of the page. This is critical for preventing duplicate content penalties when the same page can be accessed via multiple paths or parameters (e.g., HTTP vs HTTPS, or tracking parameters).</li>
        <li><strong>Open Graph (OG) Tags:</strong> Standardized by Facebook, OG tags define how your page renders when shared on social channels. <code>og:title</code>, <code>og:description</code>, and <code>og:image</code> guarantee your app maintains a highly professional, click-worthy visual card layout in chat threads and social timelines.</li>
      </ul>

      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="json-ld">The Architecture of Structured Schema Markup (JSON-LD)</h2>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        While meta tags describe page appearance, **Schema.org Structured Data** describes semantic meaning. Schema allows you to explicitly label the entities on your page—such as products, recipes, FAQ items, tech tutorials, or local businesses—using a vocabulary search engines understand natively.
      </p>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350 mt-3">
        Google's strongly preferred syntax for structured data is **JSON-LD (JavaScript Object Notation for Linked Data)**. This format serializes data as a standard JSON script block embedded directly in your HTML:
      </p>
      <div className="bg-slate-50 dark:bg-[#0c1019] p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 font-mono text-xs text-slate-700 dark:text-slate-300 my-4 whitespace-pre-wrap">
{`<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "SEO Meta Tag Generator",
  "operatingSystem": "All",
  "applicationCategory": "DeveloperApplication",
  "offers": {
    "@type": "Offer",
    "price": "0.00",
    "priceCurrency": "USD"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "ratingCount": "125"
  }
}
</script>`}
      </div>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350 mt-3">
        When Google parses this JSON-LD block, it immediately understands that the page is not just an arbitrary list of keywords, but a highly rated software tool available for free. This semantic confidence can trigger **Google Rich Results**—enhanced, highly prominent search result layouts featuring ratings, stars, system details, or interactive accordions that massively boost click-through rates.
      </p>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350 mt-3">
        Our browser-native, fully automated <a href="/tools/meta-generator" className="text-indigo-650 dark:text-indigo-400 font-semibold hover:underline">SEO Meta Tag Generator</a> builds these complex configurations instantly, helping you output fully compliant headers and structured JSON-LD schemas in seconds.
      </p>

      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="faqs">Frequently Asked Questions (FAQ)</h2>
      <div className="space-y-4 my-6">
        <div className="p-4 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">Q: How can I audit my website's structured data implementation?</h4>
          <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed">
            A: You should use Google's official **Rich Results Test** and the **Schema Markup Validator** (validator.org). These tools inspect your live URL or raw code, highlighting any syntax syntax errors, missing properties, or missing recommended fields in your JSON-LD blocks.
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">Q: Does adding custom meta keywords still improve search rankings?</h4>
          <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed">
            A: No. Google officially announced back in 2009 that they completely ignore the <code>&lt;meta name="keywords"&gt;</code> tag because it was widely abused for spammy keyword-stuffing. Focus instead on high-quality title headings, descriptive title tags, and rich, helpful educational content.
          </p>
        </div>
      </div>
    </>
  );
};
