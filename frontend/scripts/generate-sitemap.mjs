// Generates public/sitemap.xml. Run after content changes: `npm run sitemap`.
// In production, prefer serving /sitemap.xml from the API so new campaigns/stories appear automatically.
import { writeFileSync, readFileSync } from 'node:fs';

const site = process.env.VITE_SITE_URL || 'https://www.example.org';
const read = (f) => readFileSync(new URL(`../src/data/${f}`, import.meta.url), 'utf8');
const slugs = (src, re) => [...src.matchAll(re)].map((m) => m[1]);

const staticPaths = ['/', '/about', '/programmes', '/campaigns', '/impact', '/stories', '/events', '/gallery', '/get-involved', '/volunteer',
  '/fundraise', '/csr', '/get-involved/campus', '/careers', '/donate', '/contact', '/faq', '/transparency',
  '/legal/privacy', '/legal/terms', '/legal/donation-refund', '/legal/safeguarding'];
const programmes = slugs(read('programmes.ts'), /slug: '([a-z-]+)'/g).map((s) => `/programmes/${s}`);
const campaigns = slugs(read('campaigns.ts'), /slug: '([a-z0-9-]+)'/g).map((s) => `/campaigns/${s}`);
const content = read('content.ts');
const stories = slugs(content.split('/* ============================== EVENTS')[0], /slug: '([a-z0-9-]+)'/g).map((s) => `/stories/${s}`);
const events = slugs(content.split('/* ============================== EVENTS')[1].split('/* ============================== GALLERY')[0], /slug: '([a-z0-9-]+)'/g).map((s) => `/events/${s}`);

const today = new Date().toISOString().slice(0, 10);
const urls = [...staticPaths, ...programmes, ...campaigns, ...stories, ...events];
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
  .map((u) => `  <url><loc>${site}${u}</loc><lastmod>${today}</lastmod><changefreq>${u === '/' || u.startsWith('/campaigns') ? 'daily' : 'weekly'}</changefreq></url>`)
  .join('\n')}\n</urlset>\n`;
writeFileSync(new URL('../public/sitemap.xml', import.meta.url), xml);
console.log(`sitemap.xml written with ${urls.length} URLs`);
