import { useState } from 'react';
import { Check, FileBarChart, KeyRound, Mail, MailCheck, ShieldCheck, X } from 'lucide-react';
import { useAdminData, useCollection } from '../store';
import { useAuth } from '../auth';
import { AdminHeader, Forbidden } from '../AdminLayout';
import { ResourceManager } from '../ResourceManager';
import { DataTable } from '../DataTable';
import { roleLabel, rolePermissions } from '../permissions';
import { StatusBadge, Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Checkbox, SelectField, TextField } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { Alert } from '@/components/ui/Alert';
import { BarList } from '@/components/charts/Charts';
import { programmes } from '@/data/programmes';
import { brand } from '@/config/brand';
import type { AdminUser, MessageRow, PartnershipRow, Role, VolunteerRow, VolunteerStatus, CsrStatus } from '@/data/admin';
import { fmtDate, fmtDateTime, inr } from '@/utils/format';
import { downloadCSV, toCSV } from '@/utils/csv';
import { email } from '@/utils/validate';

const vStatuses: VolunteerStatus[] = ['New', 'Reviewed', 'Shortlisted', 'Approved', 'Rejected', 'Completed'];
const csrStatuses: CsrStatus[] = ['New', 'Contacted', 'Proposal', 'Discussion', 'Active', 'Closed'];

/* ============================ VOLUNTEERS ============================ */
export function VolunteersAdmin() {
  const { can } = useAuth();
  const { rows, upsert, remove } = useCollection('volunteers');
  const toast = useToast();
  if (!can('volunteers:manage')) return <Forbidden />;
  const move = (v: VolunteerRow, status: VolunteerStatus) => { upsert({ ...v, status }, status); toast(`${v.name}: ${status.toLowerCase()}`); };
  return (
    <ResourceManager<VolunteerRow> title="Volunteers" singular="Volunteer" text="Review applications, move them through the pipeline, assign programmes and roles, and keep notes." rows={rows} canWrite
      searchKeys={['name', 'email', 'city', 'skills']} filters={[{ key: 'status', label: 'Status', options: vStatuses }, { key: 'programme', label: 'Programme', options: [...new Set(rows.map((r) => r.programme))] }]}
      fields={[
        { key: 'name', label: 'Name', type: 'text', required: true },
        { key: 'email', label: 'Email', type: 'text', required: true, rules: [email] },
        { key: 'phone', label: 'Phone', type: 'text' },
        { key: 'city', label: 'City', type: 'text' },
        { key: 'skills', label: 'Skills', type: 'text', full: true },
        { key: 'availability', label: 'Availability', type: 'text' },
        { key: 'status', label: 'Status', type: 'select', options: vStatuses, required: true },
        { key: 'programme', label: 'Assign programme', type: 'select', options: [...programmes.map((p) => p.title), 'Anywhere I am needed'] },
        { key: 'role', label: 'Assign role', type: 'text', hint: 'e.g. Tutor, Camp coordinator' },
        { key: 'notes', label: 'Internal notes', type: 'textarea', hint: 'Visible to staff only' },
      ]}
      columns={[
        { key: 'name', header: 'Applicant', render: (v) => <div><p className="font-medium">{v.name}</p><p className="text-xs text-muted">{v.city} · {v.availability}</p></div> },
        { key: 'skills', header: 'Skills', hideOnMobile: true, render: (v) => <span className="line-clamp-1 max-w-[12rem]">{v.skills}</span> },
        { key: 'programme', header: 'Programme', hideOnMobile: true, render: (v) => <div><p>{v.programme}</p>{v.role && <p className="text-xs text-muted">{v.role}</p>}</div> },
        { key: 'appliedOn', header: 'Applied', hideOnMobile: true, sortValue: (v) => v.appliedOn, render: (v) => fmtDate(v.appliedOn) },
        { key: 'status', header: 'Status', render: (v) => <StatusBadge status={v.status} /> },
      ]}
      extraActions={(v) => (
        <>
          {!['Approved', 'Rejected', 'Completed'].includes(v.status) && <Button size="sm" variant="ghost" aria-label="Approve" onClick={() => move(v, 'Approved')} className="text-ok"><Check className="h-4 w-4" /></Button>}
          {!['Approved', 'Rejected', 'Completed'].includes(v.status) && <Button size="sm" variant="ghost" aria-label="Reject" onClick={() => move(v, 'Rejected')} className="text-danger"><X className="h-4 w-4" /></Button>}
        </>
      )}
      onSave={(r, isNew) => upsert(r, isNew ? 'Created' : 'Updated')} onDelete={(r) => remove(r.id, r.name)}
      newRow={() => ({ id: 'vol_' + Date.now(), name: '', email: '', phone: '', city: '', skills: '', programme: 'Education', availability: '', status: 'New', appliedOn: new Date().toISOString() })}>
      <div className="mb-5 flex flex-wrap gap-2">
        {vStatuses.map((s) => <span key={s} className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-sm">{s}<span className="font-semibold tabular">{rows.filter((r) => r.status === s).length}</span></span>)}
      </div>
    </ResourceManager>
  );
}

/* ============================ CSR ============================ */
export function CsrAdmin() {
  const { can } = useAuth();
  const { rows, upsert, remove } = useCollection('partnerships');
  if (!can('csr:manage')) return <Forbidden />;
  return (
    <ResourceManager<PartnershipRow> title="CSR / Partners" singular="Enquiry" text="Track CSR and partnership enquiries from first contact to active partnership." rows={rows} searchKeys={['company', 'contactPerson', 'interest']}
      filters={[{ key: 'status', label: 'Status', options: csrStatuses }]}
      fields={[
        { key: 'company', label: 'Company', type: 'text', required: true },
        { key: 'contactPerson', label: 'Contact person', type: 'text', required: true },
        { key: 'email', label: 'Email', type: 'text', required: true, rules: [email] },
        { key: 'phone', label: 'Phone', type: 'text' },
        { key: 'interest', label: 'Interest', type: 'text' },
        { key: 'budget', label: 'Budget range', type: 'select', options: ['Under ₹5 lakh', '₹5–10 lakh', '₹10–25 lakh', '₹25 lakh+', 'Prefer to discuss'] },
        { key: 'status', label: 'Status', type: 'select', options: csrStatuses, required: true },
        { key: 'notes', label: 'Notes', type: 'textarea' },
      ]}
      columns={[
        { key: 'company', header: 'Company', render: (p) => <div><p className="font-medium">{p.company}</p><p className="text-xs text-muted">{p.contactPerson}</p></div> },
        { key: 'interest', header: 'Interest', hideOnMobile: true },
        { key: 'budget', header: 'Budget', hideOnMobile: true },
        { key: 'receivedOn', header: 'Received', hideOnMobile: true, render: (p) => fmtDate(p.receivedOn) },
        { key: 'status', header: 'Status', render: (p) => <StatusBadge status={p.status} /> },
      ]}
      onSave={(r, isNew) => upsert(r, isNew ? 'Created' : 'Updated')} onDelete={(r) => remove(r.id, r.company)}
      newRow={() => ({ id: 'csr' + Date.now(), company: '', contactPerson: '', email: '', phone: '', interest: '', budget: 'Prefer to discuss', status: 'New', receivedOn: new Date().toISOString() })} />
  );
}

/* ============================ MESSAGES ============================ */
export function MessagesAdmin() {
  const { can } = useAuth();
  const { rows, upsert } = useCollection('messages');
  const [open, setOpen] = useState<MessageRow | null>(null);
  const [filter, setFilter] = useState('');
  const toast = useToast();
  if (!can('messages:read')) return <Forbidden />;
  const list = rows.filter((r) => !filter || r.status === filter);
  return (
    <div>
      <AdminHeader title="Contact messages" text="Messages from the contact form. Replies are sent from the shared inbox." />
      <SelectField label="Status" className="mb-4 w-48" value={filter} onChange={(e) => setFilter(e.target.value)} options={[{ value: '', label: 'All' }, 'New', 'Replied', 'Closed'].map((o) => typeof o === 'string' ? { value: o, label: o } : o)} />
      <DataTable caption="Contact messages" rows={list} onRowClick={setOpen} columns={[
        { key: 'name', header: 'From', render: (m) => <div><p className="font-medium">{m.name}</p><p className="text-xs text-muted">{m.email}</p></div> },
        { key: 'subject', header: 'Subject', render: (m) => <span className="line-clamp-1 max-w-[16rem]">{m.subject}</span> },
        { key: 'receivedOn', header: 'Received', hideOnMobile: true, render: (m) => fmtDateTime(m.receivedOn) },
        { key: 'status', header: 'Status', render: (m) => <StatusBadge status={m.status} /> },
      ]} />
      <Modal open={!!open} onClose={() => setOpen(null)} title={open?.subject ?? ''} description={open ? `${open.name} · ${open.email}` : ''}
        footer={open && <>
          <Button variant="secondary" onClick={() => { upsert({ ...open, status: 'Closed' }, 'Closed'); setOpen(null); }}>Close</Button>
          <Button icon={<MailCheck className="h-4 w-4" />} onClick={() => { upsert({ ...open, status: 'Replied' }, 'Marked replied'); toast('Marked as replied'); setOpen(null); }}>Mark as replied</Button>
        </>}>
        {open && <><p className="whitespace-pre-line">{open.message}</p><p className="mt-4 text-xs text-muted">Received {fmtDateTime(open.receivedOn)}</p>
          <p className="mt-4 flex items-center gap-2 text-sm"><Mail className="h-4 w-4 text-muted" aria-hidden="true" />Reply to <span className="select-all font-medium">{open.email}</span></p></>}
      </Modal>
    </div>
  );
}

/* ============================ REPORTS ============================ */
export function ReportsAdmin() {
  const { can } = useAuth();
  const d = useAdminData();
  const [msg, setMsg] = useState<string | null>(null);
  if (!can('reports:read')) return <Forbidden />;
  const ok = d.donations.filter((x) => x.status === 'success');
  const byCause = [...new Set(ok.map((x) => x.cause))].map((c) => ({ label: c, value: ok.filter((x) => x.cause === c).reduce((a, x) => a + x.amount, 0) })).sort((a, b) => b.value - a.value);
  const byMethod = [...new Set(d.donations.map((x) => x.method))].map((m) => ({ label: m.toUpperCase(), value: ok.filter((x) => x.method === m).length })).sort((a, b) => b.value - a.value);
  const reports = [
    { t: 'Donations summary', d: 'All payments with status, method and campaign', rows: d.donations, cols: [{ key: 'reference', label: 'Reference' }, { key: 'amount', label: 'Amount' }, { key: 'status', label: 'Status' }, { key: 'date', label: 'Date' }] },
    { t: 'Receipts register', d: 'Successful donations and receipt status', rows: ok, cols: [{ key: 'reference', label: 'Reference' }, { key: 'donor', label: 'Donor' }, { key: 'amount', label: 'Amount' }, { key: 'receipt', label: 'Receipt' }] },
    { t: 'Volunteer pipeline', d: 'Applications by status and programme', rows: d.volunteers, cols: [{ key: 'name', label: 'Name' }, { key: 'programme', label: 'Programme' }, { key: 'status', label: 'Status' }] },
    { t: 'Campaign performance', d: 'Goal, raised and supporters per campaign', rows: d.campaigns, cols: [{ key: 'title', label: 'Campaign' }, { key: 'goal', label: 'Goal' }, { key: 'raised', label: 'Raised' }, { key: 'supporters', label: 'Supporters' }] },
  ] as const;
  return (
    <div>
      <AdminHeader title="Reports" text="Download operational reports as CSV. Tax filings (e.g. Form 10BD) are generated by the backend from verified data." />
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-line bg-surface p-5"><h2 className="text-xl">Donations by cause</h2><p className="mb-4 text-sm text-muted">Successful payments, ₹</p><BarList data={byCause} unit="rupees" caption="Donations by cause" /></section>
        <section className="rounded-2xl border border-line bg-surface p-5"><h2 className="text-xl">Payments by method</h2><p className="mb-4 text-sm text-muted">Count of successful payments</p><BarList data={byMethod} unit="payments" caption="Payments by method" /></section>
      </div>
      <ul className="mt-6 grid gap-4 md:grid-cols-2">
        {reports.map((r) => (
          <li key={r.t} className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand-text"><FileBarChart className="h-5 w-5" aria-hidden="true" /></span>
            <div className="flex-1"><p className="font-semibold">{r.t}</p><p className="text-sm text-muted">{r.d} · {r.rows.length} rows</p></div>
            <Button size="sm" variant="secondary" onClick={() => { try { downloadCSV(`${r.t.toLowerCase().replace(/\s/g, '-')}.csv`, toCSV(r.rows as never[], r.cols as never)); } catch { /* blocked */ } setMsg(`${r.t} exported.`); }}>CSV</Button>
          </li>
        ))}
      </ul>
      {msg && <Alert tone="success" className="mt-4">{msg} If your browser blocked the download, use Donations → Export CSV to copy the data.</Alert>}
      <p className="mt-6 text-sm text-muted">Total successful in demo data: <strong className="tabular text-fg">{inr(ok.reduce((a, x) => a + x.amount, 0))}</strong></p>
    </div>
  );
}

/* ============================ USERS ============================ */
export function UsersAdmin() {
  const { can, user: me } = useAuth();
  const { rows, upsert } = useCollection('users');
  const audit = useAdminData().audit;
  if (!can('users:manage')) return <Forbidden />;
  const roles = Object.keys(roleLabel) as Role[];
  return (
    <ResourceManager<AdminUser> title="Users & roles" singular="User" text="Invite staff and assign roles. New users receive an email invite to set their password and two-factor authentication." rows={rows} searchKeys={['name', 'email']}
      filters={[{ key: 'role', label: 'Role', options: roles }]}
      fields={[
        { key: 'name', label: 'Name', type: 'text', required: true },
        { key: 'email', label: 'Email', type: 'text', required: true, rules: [email] },
        { key: 'role', label: 'Role', type: 'select', options: roles, required: true, hint: roles.map((r) => `${r} = ${roleLabel[r]}`).join(' · ') },
        { key: 'active', label: 'Active', type: 'checkbox' },
        { key: 'mfa', label: 'Require two-factor authentication', type: 'checkbox' },
      ]}
      columns={[
        { key: 'name', header: 'User', render: (u) => <div><p className="font-medium">{u.name}{u.id === me?.id && <span className="ml-2 text-xs text-muted">(you)</span>}</p><p className="text-xs text-muted">{u.email}</p></div> },
        { key: 'role', header: 'Role', render: (u) => <Badge tone="brand">{roleLabel[u.role]}</Badge> },
        { key: 'mfa', header: '2FA', hideOnMobile: true, render: (u) => u.mfa ? <ShieldCheck className="h-4 w-4 text-ok" aria-label="Enabled" /> : <span className="text-xs text-muted">Off</span> },
        { key: 'lastLogin', header: 'Last sign-in', hideOnMobile: true, render: (u) => fmtDateTime(u.lastLogin) },
        { key: 'active', header: 'Status', render: (u) => <StatusBadge status={u.active ? 'active' : 'closed'} /> },
      ]}
      onSave={(r, isNew) => upsert(r, isNew ? 'Invited' : 'Updated')}
      newRow={() => ({ id: 'u' + Date.now(), name: '', email: '', role: 'content_manager', active: true, lastLogin: new Date().toISOString(), mfa: true })}>
      <details className="mb-5 rounded-2xl border border-line bg-surface p-5">
        <summary className="cursor-pointer font-semibold">Role permissions</summary>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[40rem] text-sm">
            <thead><tr className="text-left text-xs text-muted"><th className="py-2 pr-3">Permission</th>{roles.map((r) => <th key={r} className="px-2 py-2 text-center">{roleLabel[r]}</th>)}</tr></thead>
            <tbody className="divide-y divide-line">
              {rolePermissions.super_admin.map((p) => (
                <tr key={p}><td className="py-1.5 pr-3 font-mono text-xs">{p}</td>{roles.map((r) => <td key={r} className="text-center">{rolePermissions[r].includes(p) ? <Check className="mx-auto h-4 w-4 text-ok" aria-label="Allowed" /> : <span className="text-muted" aria-label="Not allowed">·</span>}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
      {can('audit:read') && (
        <details className="mb-5 rounded-2xl border border-line bg-surface p-5">
          <summary className="cursor-pointer font-semibold">Audit log ({audit.length})</summary>
          <ul className="mt-3 divide-y divide-line text-sm">{audit.slice(0, 20).map((a) => <li key={a.id} className="flex flex-wrap justify-between gap-2 py-2"><span><strong>{a.action}</strong> · {a.entity}</span><span className="text-xs text-muted">{a.actor} · {fmtDateTime(a.at)}</span></li>)}</ul>
        </details>
      )}
    </ResourceManager>
  );
}

/* ============================ SETTINGS ============================ */
export function SettingsAdmin() {
  const { can } = useAuth();
  const toast = useToast();
  const [s, setS] = useState<{ name: string; tagline: string; announcement: string; email: string; phone: string; emergency: boolean; receipts: boolean; gateway: string }>({ name: brand.name, tagline: brand.tagline, announcement: brand.announcement, email: brand.contact.email, phone: brand.contact.phone, emergency: false, receipts: true, gateway: 'Razorpay' });
  if (!can('settings:manage')) return <Forbidden />;
  return (
    <div className="max-w-3xl">
      <AdminHeader title="Settings" text="Organisation details, announcement bar, payments and security." />
      <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); toast('Settings saved (demo). In production these write to the site_settings table.'); }}>
        <section className="rounded-2xl border border-line bg-surface p-6">
          <h2 className="text-xl">Organisation</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <TextField label="Organisation name" value={s.name} onChange={(e) => setS({ ...s, name: e.target.value })} />
            <TextField label="Public email" value={s.email} onChange={(e) => setS({ ...s, email: e.target.value })} />
            <TextField label="Tagline" className="sm:col-span-2" value={s.tagline} onChange={(e) => setS({ ...s, tagline: e.target.value })} />
            <TextField label="Phone" value={s.phone} onChange={(e) => setS({ ...s, phone: e.target.value })} />
          </div>
        </section>
        <section className="rounded-2xl border border-line bg-surface p-6">
          <h2 className="text-xl">Announcement bar</h2>
          <TextField label="Message" className="mt-4" value={s.announcement} onChange={(e) => setS({ ...s, announcement: e.target.value })} />
          <div className="mt-4"><Checkbox checked={s.emergency} onChange={(v) => setS({ ...s, emergency: v })} label="Switch to emergency appeal mode" description="Shows a red bar linking to an urgent campaign" /></div>
        </section>
        <section className="rounded-2xl border border-line bg-surface p-6">
          <h2 className="text-xl">Payments</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <SelectField label="Payment gateway" value={s.gateway} onChange={(e) => setS({ ...s, gateway: e.target.value })} options={['Razorpay', 'Cashfree', 'PayU']} />
            <TextField label="Public key" value="Configured on the server" readOnly hint="Secret keys are set as server environment variables and are never shown here." />
          </div>
          <div className="mt-4"><Checkbox checked={s.receipts} onChange={(v) => setS({ ...s, receipts: v })} label="Email receipts automatically after verified payment" /></div>
        </section>
        <section className="rounded-2xl border border-line bg-surface p-6">
          <h2 className="flex items-center gap-2 text-xl"><KeyRound className="h-5 w-5" aria-hidden="true" />Security</h2>
          <ul className="mt-3 space-y-1.5 text-sm text-muted">
            <li>Sessions expire after 8 hours of inactivity; refresh tokens rotate on use.</li>
            <li>Login is rate-limited and locked after repeated failures.</li>
            <li>All admin actions are written to the audit log.</li>
          </ul>
        </section>
        <Button type="submit" size="lg">Save settings</Button>
      </form>
    </div>
  );
}
