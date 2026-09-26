import { useEffect } from 'react';
import { brand } from '@/config/brand';

interface Seo { title: string; description?: string; path?: string; image?: string; jsonLd?: object; noindex?: boolean }

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el); }
  el.content = content;
}

/** Sets title, description, canonical, Open Graph / Twitter tags and optional JSON-LD for the current page.
 *  For crawlers that do not run JS, pair this with prerendering (see docs/SEO.md). */
export function useSeo({ title, description, path, image, jsonLd, noindex }: Seo) {
  useEffect(() => {
    const full = title === brand.name ? `${brand.name} · ${brand.tagline}` : `${title} · ${brand.name}`;
    document.title = full;
    const desc = description || brand.tagline;
    setMeta('name', 'description', desc);
    setMeta('property', 'og:title', full);
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:type', 'website');
    if (path) setMeta('property', 'og:url', brand.siteUrl + path);
    if (image) setMeta('property', 'og:image', image);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (path) {
      if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
      canonical.href = brand.siteUrl + path;
    }
    let script = document.getElementById('page-jsonld');
    if (jsonLd) {
      if (!script) { script = document.createElement('script'); script.id = 'page-jsonld'; script.setAttribute('type', 'application/ld+json'); document.head.appendChild(script); }
      script.textContent = JSON.stringify(jsonLd);
    } else script?.remove();
  }, [title, description, path, image, jsonLd, noindex]);
}
