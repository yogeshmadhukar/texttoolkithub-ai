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
    { loc: '/#/about', changefreq: 'monthly', priority: '0.5' },
    { loc: '/#/contact', changefreq: 'monthly', priority: '0.5' },
    { loc: '/#/privacy', changefreq: 'monthly', priority: '0.3' },
    { loc: '/#/terms', changefreq: 'monthly', priority: '0.3' },
  ];

  const toolPages = TOOLS.map((tool) => ({
    loc: `/#/${tool.id}`,
    changefreq: 'weekly',
    priority: '0.8',
  }));

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

  const outputPath = path.resolve(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(outputPath, xml, 'utf8');
  console.log(`\x1b[32m✔ Dynamic sitemap.xml generated successfully in /public at ${currentDate}!\x1b[0m`);
}

generateSitemap();
