import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { TOOLS } from '../src/data';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generateSitemap() {
  const domain = 'https://texttoolkithub.com';
  const currentDate = new Date().toISOString().split('T')[0];

  const staticPages = [
    { loc: '/', changefreq: 'daily', priority: '1.0' },
    { loc: '/tools', changefreq: 'daily', priority: '0.9' },
    { loc: '/guides', changefreq: 'weekly', priority: '0.8' },
    { loc: '/guides/guide-client-side-pdf-privacy', changefreq: 'monthly', priority: '0.8' },
    { loc: '/about', changefreq: 'monthly', priority: '0.8' },
    { loc: '/faq', changefreq: 'weekly', priority: '0.8' },
    { loc: '/security-faq', changefreq: 'monthly', priority: '0.8' },
    { loc: '/contact', changefreq: 'monthly', priority: '0.6' },
    { loc: '/privacy', changefreq: 'monthly', priority: '0.4' },
    { loc: '/terms', changefreq: 'monthly', priority: '0.4' },
    { loc: '/cookie-policy', changefreq: 'monthly', priority: '0.4' },
    { loc: '/dmca', changefreq: 'monthly', priority: '0.4' },
    { loc: '/disclaimer', changefreq: 'monthly', priority: '0.4' },
  ];

  const toolPages = TOOLS.map((tool) => {
    // Strip "tools/" prefix from the tool ID to form the clean URL path
    const cleanPath = tool.id.replace(/^tools\//, '');
    return {
      loc: `/${cleanPath}`,
      changefreq: 'weekly',
      priority: '0.8',
    };
  });

  const allPages = [...staticPages, ...toolPages];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  allPages.forEach((page) => {
    xml += `
  <url>
    <loc>${domain}${page.loc}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  });

  xml += '\n</urlset>\n';

  const publicOutputPath = path.resolve(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(publicOutputPath, xml, 'utf8');

  const distDir = path.resolve(__dirname, '../dist');
  if (fs.existsSync(distDir)) {
    const distOutputPath = path.resolve(distDir, 'sitemap.xml');
    fs.writeFileSync(distOutputPath, xml, 'utf8');
  }

  console.log(`\x1b[32m✔ Dynamic sitemap.xml generated successfully in /public and /dist at ${currentDate}!\x1b[0m`);
}

generateSitemap();
