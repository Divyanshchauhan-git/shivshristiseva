import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Check, Copy, Heart, Share2 } from 'lucide-react';
import { useSeo } from '@/hooks/useSeo';
import { useAsync } from '@/hooks/useAsync';
import { contentApi } from '@/services/api';
import { campaignCategories } from '@/data/campaigns';
import { brand } from '@/config/brand';
import { PageHero } from '@/components/layout/PageHero';
import { FilterChips, SearchInput } from '@/components/ui/Controls';
import { AsyncView, EmptyState, ErrorState, LoadingBlock } from '@/components/ui/States';
import { CampaignCard, CampaignMeta } from '@/components/cards/CampaignCard';
import { ButtonLink, Button } from '@/components/ui/Button';
import { DemoNote } from '@/components/ui/Section';
import { Media } from '@/components/media/Media';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { programmeBySlug } from '@/data/programmes';
import type { Campaign, CampaignCategory } from '@/types';
import { fmtDate } from '@/utils/format';
import NotFound from './NotFound';

export function Campaigns() {
  useSeo({ title: 'Campaigns', description: 'Support active fundraising campaigns for education, women, healthcare, animals, food, emergency relief and the environment.', path: '/campaigns' });
  const s = useAsync(() => contentApi.campaigns(), []);
  const [cat, setCat] = useState<CampaignCategory | 'All'>('All');
  const [q, setQ] = useState('');
  const [showClosed, setShowClosed] = useState(false);
  const filter = (d: Campaign[]) => d
    .filter((c) => (showClosed ? true : c.status === 'active'))
    .filter((c) => cat === 'All' || c.category === cat)
    .filter((c) => !q || (c.title + c.description).toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => Number(!!b.urgent) - Number(!!a.urgent));
  const counts = useMemo(() => {
    if (s.status !== 'success') return undefined;
    const active = s.data.filter((c) => showClosed || c.status === 'active');
    const o: Partial<Record<CampaignCategory | 'All', number>> = { All: active.length };
    campaignCategories.forEach((k) => (o[k] = active.filter((c) => c.category === k).length));
    return o;
  }, [s, showClosed]);
  return (
    <>
      <PageHero crumbs={[{ label: 'Home', to: '/' }, { label: 'Campaigns' }]} eyebrow="Campaigns" theme="education" seed={21}
        title="Campaigns you can support today." text="Each campaign has a clear goal, a deadline and regular updates, so you can see what your gift is doing." />
      <section className="section pt-10">
        <div className="container-page">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <FilterChips label="Filter campaigns by category" options={campaignCategories} value={cat} onChange={(v) => setCat(v as CampaignCategory | 'All')} counts={counts} />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <SearchInput value={q} onChange={setQ} placeholder="Search campaigns" label="Search campaigns" />
              <label className="flex shrink-0 items-center gap-2 text-sm"><input type="checkbox" checked={showClosed} onChange={(e) => setShowClosed(e.target.checked)} className="h-4 w-4 accent-[rgb(var(--brand))]" />Show completed</label>
            </div>
          </div>
          <AsyncView state={s} retry={s.retry} isEmpty={(d) => filter(d).length === 0}
            empty={<EmptyState title="No campaigns available right now." text={cat !== 'All' || q ? 'Try another category or clear your search.' : 'Please check back soon.'} action={<ButtonLink to="/donate" variant="donate">Give to the General Fund</ButtonLink>} />}>
            {(d) => <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{filter(d).map((c, i) => <CampaignCard key={c.id} c={c} index={i} />)}</div>}
          </AsyncView>
          <DemoNote className="mt-8">All campaigns, amounts and supporter counts shown are demo data.</DemoNote>
        </div>
      </section>
    </>
  );
}

function ShareBox({ c }: { c: Campaign }) {
  const toast = useToast();
  const [copied, setCopied] = useState(false);
  const url = `${brand.siteUrl}/campaigns/${c.slug}`;
  const text = encodeURIComponent(`Support "${c.title}" with ${brand.name}: ${url}`);
  const copy = async () => {
    try { await navigator.clipboard.writeText(url); setCopied(true); toast('Link copied'); setTimeout(() => setCopied(false), 2000); }
    catch { const el = document.getElementById('share-url') as HTMLInputElement | null; el?.select(); toast('Press Ctrl+C to copy the selected link', 'info'); }
  };
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <h3 className="flex items-center gap-2 font-sans text-base font-semibold"><Share2 className="h-4 w-4" aria-hidden="true" />Share this campaign</h3>
      <div className="mt-3 flex gap-2">
        <label htmlFor="share-url" className="sr-only">Campaign link</label>
        <input id="share-url" readOnly value={url} className="h-10 min-w-0 flex-1 rounded-lg border border-line bg-surface-2 px-3 text-xs" onFocus={(e) => e.target.select()} />
        <Button size="sm" variant="secondary" onClick={copy} aria-label="Copy link">{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}</Button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-sm">
        <a className="link" href={`https://wa.me/?text=${text}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
        <a className="link" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer">Facebook</a>
        <a className="link" href={`https://x.com/intent/tweet?text=${text}`} target="_blank" rel="noopener noreferrer">X</a>
        <a className="link" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer">LinkedIn</a>
      </div>
    </div>
  );
}

export function CampaignDetail() {
  const { slug = '' } = useParams();
  const s = useAsync(() => contentApi.campaign(slug), [slug]);
  const c = s.status === 'success' ? s.data : undefined;
  useSeo({ title: c?.title ?? 'Campaign', description: c?.description, path: `/campaigns/${slug}`,
    jsonLd: c ? { '@context': 'https://schema.org', '@type': 'DonateAction', name: c.title, description: c.description, recipient: { '@type': 'NGO', name: brand.name } } : undefined });
  if (s.status === 'loading') return <div className="container-page py-16"><LoadingBlock /></div>;
  if (s.status === 'error') return (s.error as { status?: number }).status === 404 ? <NotFound /> : <div className="container-page py-16"><ErrorState message={s.error.message} onRetry={s.retry} /></div>;
  const camp = s.data;
  const active = camp.status === 'active';
  return (
    <>
      <PageHero crumbs={[{ label: 'Home', to: '/' }, { label: 'Campaigns', to: '/campaigns' }, { label: camp.title }]} eyebrow={`${camp.category} campaign`} theme={camp.theme} seed={31}
        title={camp.title} text={camp.description} />
      <section className="section pt-10">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_24rem]">
          <article>
            <Media theme={camp.theme} seed={31} alt={`Illustration for ${camp.title}`} ratio="aspect-[16/9]" className="rounded-3xl" priority />
            <div className="prose-body mt-10">
              <h2>The story</h2>
              {camp.story.map((p, i) => <p key={i}>{p}</p>)}
              <h2>Why your support is needed</h2>
              <ul>{camp.whyNeeded.map((w) => <li key={w}>{w}</li>)}</ul>
            </div>
            <h2 className="mt-12 text-2xl">Updates</h2>
            {camp.updates.length ? (
              <ol className="mt-5 space-y-5 border-l-2 border-line pl-6">
                {camp.updates.map((u) => (
                  <li key={u.date + u.title} className="relative">
                    <span className="absolute -left-[1.93rem] top-1.5 h-3.5 w-3.5 rounded-full border-[3px] border-bg bg-marigold" aria-hidden="true" />
                    <p className="text-sm text-muted"><time dateTime={u.date}>{fmtDate(u.date)}</time></p>
                    <h3 className="mt-1 font-sans text-lg font-semibold">{u.title}</h3>
                    <p className="text-muted">{u.text}</p>
                  </li>
                ))}
              </ol>
            ) : <p className="mt-3 text-muted">The first update will be posted here soon.</p>}
            <h2 className="mt-12 text-2xl">Gallery</h2>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => <Media key={i} theme={camp.theme} seed={i * 17} alt={`Campaign gallery illustration ${i}`} ratio="aspect-square" className="rounded-2xl" />)}
            </div>
          </article>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-line bg-surface p-6 shadow-soft">
              <div className="mb-4 flex flex-wrap gap-2">
                {camp.urgent && <Badge tone="hibiscus" dot>Urgent</Badge>}
                <Badge tone="brand">{programmeBySlug(camp.programme)?.title}</Badge>
              </div>
              <CampaignMeta c={camp} large />
              <p className="mt-3 text-xs text-muted">Runs {fmtDate(camp.startDate)} – {fmtDate(camp.endDate)}</p>
              {active ? (
                <ButtonLink to={`/donate?campaign=${camp.slug}`} variant="donate" size="lg" className="mt-6 w-full" icon={<Heart className="h-4 w-4 fill-current" />}>Donate now</ButtonLink>
              ) : (
                <div className="mt-6"><p className="text-sm text-muted">This campaign is closed. Thank you to everyone who gave.</p><ButtonLink to={`/campaigns`} variant="secondary" className="mt-3 w-full">See active campaigns</ButtonLink></div>
              )}
              <DemoNote className="mt-4">Demo figures.</DemoNote>
            </div>
            <ShareBox c={camp} />
          </aside>
        </div>
      </section>
    </>
  );
}

