import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Download, HandCoins, Mail, Megaphone, TrendingUp, Users, Copy } from 'lucide-react';
import { useAdminData, useCollection } from '../store';
import { useAuth } from '../auth';
import { AdminHeader, DashboardCard, Forbidden } from '../AdminLayout';
import { DataTable, type Column } from '../DataTable';
import { StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SelectField, TextField } from '@/components/ui/Field';
import { SearchInput } from '@/components/ui/Controls';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { ColumnChart, Sparkline } from '@/components/charts/Charts';
import { ProgressBar } from '@/components/ui/ProgressBar';
import type { DonationRow } from '@/data/admin';
import { downloadCSV, toCSV } from '@/utils/csv';
import { fmtDate, fmtDateTime, inr, inrCompact, num, pct } from '@/utils/format';

const monthKey = (iso: string) => iso.slice(0, 7);

export function Dashboard() {
  const d = useAdminData();
  const { can, user } = useAuth();
  const ok = d.donations.filter((x) => x.status === 'success');
  const thisMonth = monthKey(new Date().toISOString());
  const monthTotal = ok.filter((x) => monthKey(x.date) === thisMonth).reduce((a, x) => a + x.amount, 0);
  const months = [...new Set(ok.map((x) => monthKey(x.date)))].sort().slice(-5);
  const byMonth = months.map((m) => ({ label: new Date(m + '-01').toLocaleDateString('en-IN', { month: 'short' }), value: ok.filter((x) => monthKey(x.date) === m).reduce((a, x) => a + x.amount, 0) }));
  const active = d.campaigns.filter((c) => c.status === 'active');
  return (
    <div>
      <AdminHeader title={`Welcome back, ${user?.name.split(' ')[0]}`} text="Here is what's happening across the foundation." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {can('donations:read') && <DashboardCard label="Total donations" value={inrCompact(ok.reduce((a, x) => a + x.amount, 0))} hint={`${num(ok.length)} successful payments`} icon={HandCoins}><Sparkline values={byMonth.map((b) => b.value)} label="Donations trend, last 5 months" /></DashboardCard>}
        {can('donations:read') && <DashboardCard label="This month's donations" value={inr(monthTotal)} hint={new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })} icon={TrendingUp} tone="leaf" />}
        <DashboardCard label="Active campaigns" value={active.length} hint={`${d.campaigns.filter((c) => c.status === 'paused').length} paused`} icon={Megaphone} tone="marigold" />
        {can('volunteers:manage') && <DashboardCard label="Volunteer applications" value={d.volunteers.length} hint={`${d.volunteers.filter((v) => v.status === 'New').length} new to review`} icon={Users} tone="hibiscus" />}
        {can('messages:read') && <DashboardCard label="Contact enquiries" value={d.messages.length} hint={`${d.messages.filter((m) => m.status === 'New').length} awaiting reply`} icon={Mail} />}
        {can('csr:manage') && <DashboardCard label="CSR enquiries" value={d.partnerships.length} hint={`${d.partnerships.filter((p) => p.status === 'Active').length} active partnerships`} icon={Building2} tone="leaf" />}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        {can('donations:read') ? (
          <section className="rounded-2xl border border-line bg-surface p-5" aria-labelledby="dm">
            <div className="flex items-baseline justify-between"><h2 id="dm" className="text-xl">Donations by month</h2><Link to="/admin/donations" className="link text-sm">View all</Link></div>
            <p className="mb-3 text-sm text-muted">Successful payments, ₹</p>
            <ColumnChart data={byMonth} unit="rupees" caption="Donations by month" />
          </section>
        ) : (
          <section className="rounded-2xl border border-line bg-surface p-5"><h2 className="text-xl">Campaign progress</h2>
            <ul className="mt-4 space-y-4">{active.slice(0, 5).map((c) => <li key={c.id}><div className="mb-1 flex justify-between text-sm"><span className="font-medium">{c.title}</span><span className="tabular text-muted">{pct(c.raised, c.goal)}%</span></div><ProgressBar value={pct(c.raised, c.goal)} label={c.title} size="sm" /></li>)}</ul>
          </section>
        )}
        <section className="rounded-2xl border border-line bg-surface p-5" aria-labelledby="ra">
          <h2 id="ra" className="text-xl">Recent activity</h2>
          <ol className="mt-4 space-y-4">
            {d.audit.slice(0, 7).map((a) => (
              <li key={a.id} className="flex gap-3 text-sm">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-marigold" aria-hidden="true" />
                <div className="min-w-0"><p><span className="font-medium">{a.action}</span> · <span className="text-muted">{a.entity}</span></p><p className="text-xs text-muted">{a.actor} · {fmtDateTime(a.at)}</p></div>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-line bg-surface p-5">
          <h2 className="text-xl">Active campaigns</h2>
          <ul className="mt-4 space-y-4">
            {active.slice(0, 5).map((c) => (
              <li key={c.id}>
                <div className="mb-1 flex justify-between gap-2 text-sm"><span className="truncate font-medium">{c.title}</span><span className="shrink-0 tabular text-muted">{inrCompact(c.raised)} / {inrCompact(c.goal)}</span></div>
                <ProgressBar value={pct(c.raised, c.goal)} label={`${c.title} progress`} size="sm" tone={c.urgent ? 'hibiscus' : 'marigold'} />
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-2xl border border-line bg-surface p-5">
          <div className="flex items-baseline justify-between"><h2 className="text-xl">Impact metrics</h2><span className="text-xs text-muted">Sample · unverified</span></div>
          <dl className="mt-4 grid grid-cols-2 gap-3">
            {d.impact.slice(0, 6).map((m) => <div key={m.id} className="rounded-xl bg-surface-2/70 p-3"><dt className="text-xs text-muted">{m.metric}</dt><dd className="font-display text-2xl tabular">{num(m.value)}</dd></div>)}
          </dl>
        </section>
      </div>
    </div>
  );
}

export function Donations() {
  const { can } = useAuth();
  const { rows, upsert, log } = useCollection('donations');
  const toast = useToast();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [campaign, setCampaign] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [min, setMin] = useState('');
  const [view, setView] = useState<DonationRow | null>(null);
  const [csvText, setCsvText] = useState<string | null>(null);

  const filtered = useMemo(() => rows.filter((r) =>
    (!q || (r.donor + r.reference + r.email).toLowerCase().includes(q.toLowerCase())) && (!status || r.status === status) && (!campaign || r.campaign === campaign)
    && (!from || r.date.slice(0, 10) >= from) && (!to || r.date.slice(0, 10) <= to) && (!min || r.amount >= Number(min))), [rows, q, status, campaign, from, to, min]);

  if (!can('donations:read')) return <Forbidden />;
  const total = filtered.filter((r) => r.status === 'success').reduce((a, r) => a + r.amount, 0);
  const cols: Column<DonationRow>[] = [
    { key: 'reference', header: 'Donation ID', render: (r) => <span className="font-mono text-xs">{r.reference}</span> },
    { key: 'donor', header: 'Donor', render: (r) => <div><p className="font-medium">{r.donor}</p><p className="text-xs text-muted">{r.frequency === 'monthly' ? 'Monthly' : 'One-time'}</p></div> },
    { key: 'amount', header: 'Amount', align: 'right', sortValue: (r) => r.amount, render: (r) => inr(r.amount) },
    { key: 'campaign', header: 'Campaign', hideOnMobile: true, render: (r) => <span className="line-clamp-1 max-w-[12rem]">{r.campaign === '—' ? r.cause : r.campaign}</span> },
    { key: 'method', header: 'Method', hideOnMobile: true, render: (r) => <span className="uppercase text-xs font-semibold text-muted">{r.method}</span> },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'date', header: 'Date', sortValue: (r) => r.date, render: (r) => fmtDate(r.date) },
    { key: 'receipt', header: 'Receipt', hideOnMobile: true, render: (r) => <StatusBadge status={r.receipt} /> },
  ];
  const exportCsv = () => {
    const csv = toCSV(filtered, [
      { key: 'reference', label: 'Donation ID' }, { key: 'donor', label: 'Donor' }, { key: 'email', label: 'Email' }, { key: 'amount', label: 'Amount (INR)' },
      { key: 'campaign', label: 'Campaign' }, { key: 'cause', label: 'Cause' }, { key: 'method', label: 'Payment method' }, { key: 'status', label: 'Payment status' },
      { key: 'date', label: 'Date' }, { key: 'receipt', label: 'Receipt status' }, { key: 'frequency', label: 'Frequency' },
    ]);
    try { downloadCSV(`donations-${new Date().toISOString().slice(0, 10)}.csv`, csv); } catch { /* sandboxed viewers block downloads */ }
    setCsvText(csv);
    log('Exported donations CSV', `${filtered.length} rows`);
  };
  const campaigns = [...new Set(rows.map((r) => r.campaign).filter((c) => c !== '—'))];
  return (
    <div>
      <AdminHeader title="Donations" text="Payment status is set by verified gateway webhooks, not by the browser."
        actions={can('donations:export') && <Button variant="secondary" onClick={exportCsv} icon={<Download className="h-4 w-4" />}>Export CSV</Button>} />
      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <div className="sm:col-span-2 flex items-end"><SearchInput value={q} onChange={setQ} placeholder="Donor, email or ID" label="Search donations" /></div>
        <SelectField label="Status" value={status} onChange={(e) => setStatus(e.target.value)} options={[{ value: '', label: 'All' }, ...['success', 'pending', 'failed', 'cancelled', 'refunded'].map((s) => ({ value: s, label: s[0].toUpperCase() + s.slice(1) }))]} />
        <SelectField label="Campaign" value={campaign} onChange={(e) => setCampaign(e.target.value)} options={[{ value: '', label: 'All' }, ...campaigns.map((c) => ({ value: c, label: c }))]} />
        <TextField label="From" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        <TextField label="To" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
      </div>
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <TextField label="Minimum amount (₹)" type="number" className="w-44" value={min} onChange={(e) => setMin(e.target.value)} />
        <p className="pb-2 text-sm text-muted">Successful total for filter: <strong className="tabular text-fg">{inr(total)}</strong></p>
      </div>
      <DataTable caption="Donations" rows={filtered} columns={cols} onRowClick={setView} />

      <Modal open={!!view} onClose={() => setView(null)} title={view?.reference ?? ''} description="Donation details"
        footer={view && can('donations:refund') && view.status === 'success' ? <Button variant="danger" onClick={() => { upsert({ ...view, status: 'refunded', receipt: 'not applicable' }, 'Refunded'); toast('Refund recorded. On the live system this calls the gateway refund API.'); setView(null); }}>Record refund</Button> : undefined}>
        {view && (
          <dl className="grid grid-cols-2 gap-4 text-sm">
            {[['Donor', view.donor], ['Email', view.email], ['Amount', inr(view.amount)], ['Frequency', view.frequency], ['Cause', view.cause], ['Campaign', view.campaign], ['Method', view.method.toUpperCase()], ['Date', fmtDateTime(view.date)]].map(([k, v]) => (
              <div key={k}><dt className="text-muted">{k}</dt><dd className="font-medium break-words">{v}</dd></div>
            ))}
            <div><dt className="text-muted">Status</dt><dd><StatusBadge status={view.status} /></dd></div>
            <div><dt className="text-muted">Receipt</dt><dd><StatusBadge status={view.receipt} /></dd></div>
          </dl>
        )}
      </Modal>
      <Modal open={!!csvText} onClose={() => setCsvText(null)} title="CSV export ready" description="Your browser should have downloaded the file. If not, copy the data below.">
        <textarea readOnly value={csvText ?? ''} className="h-60 w-full rounded-xl border border-line bg-surface-2 p-3 font-mono text-xs" aria-label="CSV data" />
        <Button variant="secondary" className="mt-3" icon={<Copy className="h-4 w-4" />} onClick={async () => { try { await navigator.clipboard.writeText(csvText ?? ''); toast('Copied'); } catch { toast('Select the text and copy it manually', 'info'); } }}>Copy CSV</Button>
      </Modal>
    </div>
  );
}
