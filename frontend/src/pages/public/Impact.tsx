import { useMemo, useState } from 'react';
import { Download, FileText } from 'lucide-react';
import { useSeo } from '@/hooks/useSeo';
import { useAsync } from '@/hooks/useAsync';
import { contentApi } from '@/services/api';
import { impactLocations, impactYears } from '@/data/impact';
import { programmes, programmeBySlug } from '@/data/programmes';
import { PageHero } from '@/components/layout/PageHero';
import { SelectField } from '@/components/ui/Field';
import { Alert } from '@/components/ui/Alert';
import { ErrorState, LoadingBlock, EmptyState } from '@/components/ui/States';
import { ColumnChart, BarList } from '@/components/charts/Charts';
import { ButtonLink, Button } from '@/components/ui/Button';
import { SectionHeader } from '@/components/ui/Section';
import type { ImpactRecord } from '@/types';
import { num } from '@/utils/format';

const metrics: { key: keyof ImpactRecord; label: string }[] = [
  { key: 'peopleSupported', label: 'People supported' },
  { key: 'childrenReached', label: 'Children reached' },
  { key: 'womenSupported', label: 'Women supported' },
  { key: 'animalsHelped', label: 'Animals helped' },
  { key: 'healthCamps', label: 'Health camps' },
  { key: 'volunteers', label: 'Volunteers' },
  { key: 'campaigns', label: 'Campaigns' },
  { key: 'communities', label: 'Communities reached' },
];

const sum = (rows: ImpactRecord[], k: keyof ImpactRecord) => rows.reduce((a, r) => a + (r[k] as number), 0);
const fy = (y: number) => `FY ${y - 1}–${String(y).slice(2)}`;

export default function Impact() {
  useSeo({ title: 'Impact', description: 'Impact dashboard showing people supported, children reached, women supported, animals helped and more, by year, programme and location.', path: '/impact' });
  const s = useAsync(() => contentApi.impact(), []);
  const [year, setYear] = useState<string>(String(impactYears[impactYears.length - 1]));
  const [prog, setProg] = useState('');
  const [loc, setLoc] = useState('');
  const [metric, setMetric] = useState<keyof ImpactRecord>('peopleSupported');

  const rows = useMemo(() => (s.status === 'success' ? s.data : []).filter((r) => (!prog || r.programme === prog) && (!loc || r.location === loc)), [s, prog, loc]);
  const yearRows = rows.filter((r) => !year || r.year === Number(year));
  const prevRows = rows.filter((r) => year && r.year === Number(year) - 1);
  const metricLabel = metrics.find((m) => m.key === metric)!.label;

  return (
    <>
      <PageHero crumbs={[{ label: 'Home', to: '/' }, { label: 'Impact' }]} eyebrow="Impact" theme="community" seed={33}
        title="Impact, measured honestly." text="Filter by year, programme and location. Every figure states its reporting period and will be replaced with verified data." />

      <section className="section pt-10">
        <div className="container-page">
          <Alert tone="warning" title="Sample data">These figures are generated sample data to demonstrate the dashboard. They are not the organisation&rsquo;s achievements. Connect the impact API to show verified, audited metrics.</Alert>

          <div className="sticky top-[4.5rem] z-20 -mx-4 mt-8 border-y border-line bg-bg/95 px-4 py-4 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border sm:px-5">
            <div className="grid gap-3 sm:grid-cols-3">
              <SelectField label="Reporting year" value={year} onChange={(e) => setYear(e.target.value)} options={[{ value: '', label: 'All years' }, ...impactYears.map((y) => ({ value: String(y), label: fy(y) }))]} />
              <SelectField label="Programme" value={prog} onChange={(e) => setProg(e.target.value)} options={[{ value: '', label: 'All programmes' }, ...programmes.filter((p) => p.slug !== 'marriage-assistance').map((p) => ({ value: p.slug, label: p.title }))]} />
              <SelectField label="Location" value={loc} onChange={(e) => setLoc(e.target.value)} options={[{ value: '', label: 'All locations' }, ...impactLocations.map((l) => ({ value: l, label: l }))]} />
            </div>
          </div>

          {s.status === 'loading' && <div className="mt-8"><LoadingBlock label="Loading impact data" /></div>}
          {s.status === 'error' && <div className="mt-8"><ErrorState message={s.error.message} onRetry={s.retry} /></div>}
          {s.status === 'success' && (rows.length === 0 ? <div className="mt-8"><EmptyState title="No data for this selection." text="Try a different programme or location." /></div> : (
            <>
              <p className="mt-8 text-sm text-muted">Reporting period: <strong className="text-fg">{year ? `${fy(Number(year))} (1 Apr ${Number(year) - 1} – 31 Mar ${year})` : `${fy(impactYears[0])} to ${fy(impactYears[impactYears.length - 1])}`}</strong> · Sample data</p>
              <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                {metrics.map((m) => {
                  const v = sum(yearRows, m.key); const pv = sum(prevRows, m.key);
                  const delta = year && pv ? Math.round(((v - pv) / pv) * 100) : null;
                  const on = metric === m.key;
                  return (
                    <button key={m.key} type="button" onClick={() => setMetric(m.key)} aria-pressed={on}
                      className={`rounded-2xl border p-4 text-left transition-colors sm:p-5 ${on ? 'border-brand bg-brand text-brand-fg' : 'border-line bg-surface hover:border-brand-text/40'}`}>
                      <p className={`text-xs font-semibold ${on ? 'text-brand-fg/80' : 'text-muted'}`}>{m.label}</p>
                      <p className="mt-1 font-display text-3xl tabular sm:text-4xl">{num(v)}</p>
                      {delta !== null && <p className={`mt-1 text-xs tabular ${on ? 'text-brand-fg/80' : delta >= 0 ? 'text-ok' : 'text-danger'}`}>{delta >= 0 ? '▲' : '▼'} {Math.abs(delta)}% vs previous year</p>}
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <div className="rounded-3xl border border-line bg-surface p-5 sm:p-6">
                  <h2 className="text-xl">{metricLabel} by year</h2>
                  <p className="mb-4 text-sm text-muted">Financial years, filtered by programme and location</p>
                  <ColumnChart unit={metricLabel.toLowerCase()} caption={`${metricLabel} by financial year`}
                    data={impactYears.map((y) => ({ label: fy(y).replace('FY ', ''), value: sum(rows.filter((r) => r.year === y), metric) }))} />
                </div>
                <div className="rounded-3xl border border-line bg-surface p-5 sm:p-6">
                  <h2 className="text-xl">{metricLabel} by {prog ? 'location' : 'programme'}</h2>
                  <p className="mb-5 text-sm text-muted">{year ? fy(Number(year)) : 'All years'}</p>
                  {prog ? (
                    <BarList unit={metricLabel.toLowerCase()} caption={`${metricLabel} by location`}
                      data={impactLocations.map((l) => ({ label: l, value: sum(yearRows.filter((r) => r.location === l), metric) })).sort((a, b) => b.value - a.value)} />
                  ) : (
                    <BarList unit={metricLabel.toLowerCase()} caption={`${metricLabel} by programme`}
                      data={[...new Set(yearRows.map((r) => r.programme))].map((p) => ({ label: programmeBySlug(p)?.title ?? p, value: sum(yearRows.filter((r) => r.programme === p), metric) })).filter((d) => d.value > 0).sort((a, b) => b.value - a.value)} />
                  )}
                </div>
              </div>
            </>
          ))}
        </div>
      </section>

      <section className="section bg-surface-2/60" aria-labelledby="reports">
        <div className="container-page">
          <SectionHeader id="reports" eyebrow="Reports" title="Impact and annual reports" text="Reports are published here after verification and board approval." />
          <div className="grid gap-4 md:grid-cols-3">
            {['Impact report FY 2025–26', 'Annual report FY 2025–26', 'Audited financials FY 2025–26'].map((r) => (
              <div key={r} className="flex items-start gap-4 rounded-2xl bg-surface p-5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand-text"><FileText className="h-5 w-5" aria-hidden="true" /></span>
                <div className="flex-1"><p className="font-semibold">{r}</p><p className="text-sm text-muted">Not yet published</p></div>
                <Button size="sm" variant="secondary" disabled aria-label={`Download ${r} (not available yet)`}><Download className="h-4 w-4" /></Button>
              </div>
            ))}
          </div>
          <ButtonLink to="/transparency" variant="ghost" className="mt-6 -ml-4">Go to the Transparency Centre →</ButtonLink>
        </div>
      </section>
    </>
  );
}
