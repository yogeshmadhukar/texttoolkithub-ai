import fs from 'fs';
import path from 'path';
import { TOOLS } from '../src/data.ts';

function generateSitemap() {
  const baseUrl = 'https://texttoolkithub.com';
  const lastmod = new Date().toISOString().split('T')[0];

  const staticRoutes = [
    { url: '', priority: '1.0', changefreq: 'daily' },
    { url: '/tools', priority: '0.9', changefreq: 'daily' },
    { url: '/guides', priority: '0.8', changefreq: 'weekly' },
    { url: '/guides/guide-client-side-pdf-privacy', priority: '0.8', changefreq: 'monthly' },
    { url: '/about', priority: '0.8', changefreq: 'monthly' },
    { url: '/faq', priority: '0.8', changefreq: 'weekly' },
    { url: '/security-faq', priority: '0.8', changefreq: 'monthly' },
    { url: '/contact', priority: '0.6', changefreq: 'monthly' },
    { url: '/privacy', priority: '0.4', changefreq: 'monthly' },
    { url: '/terms', priority: '0.4', changefreq: 'monthly' },
    { url: '/cookie-policy', priority: '0.4', changefreq: 'monthly' },
    { url: '/dmca', priority: '0.4', changefreq: 'monthly' },
    { url: '/disclaimer', priority: '0.4', changefreq: 'monthly' },
  ];

  const toolRoutes = TOOLS.map(tool => {
    const cleanId = tool.id.replace(/^tools\//, '');
    return [
      { url: `/${cleanId}`, priority: '0.8', changefreq: 'weekly' },
      { url: `/tools/${cleanId}`, priority: '0.8', changefreq: 'weekly' }
    ];
  }).flat();

  // Combine and deduplicate
  const allRoutesMap = new Map<string, { url: string; priority: string; changefreq: string }>();
  
  [...staticRoutes, ...toolRoutes].forEach(r => {
    if (!allRoutesMap.has(r.url)) {
      allRoutesMap.set(r.url, r);
    }
  });

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  for (const item of allRoutesMap.values()) {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}${item.url}</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += `    <changefreq>${item.changefreq}</changefreq>\n`;
    xml += `    <priority>${item.priority}</priority>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>\n`;

  const outputPath = path.resolve('./public/sitemap.xml');
  fs.writeFileSync(outputPath, xml, 'utf8');
  console.log(`Successfully generated public/sitemap.xml with ${allRoutesMap.size} URLs.`);
}

generateSitemap();
