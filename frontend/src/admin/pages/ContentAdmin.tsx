import { useState } from 'react';
import { Archive, Eye, EyeOff, Pause, Play, Send } from 'lucide-react';
import { useCollection, type AnimalCase, type ImpactMetricRow } from '../store';
import { useAuth } from '../auth';
import { Forbidden } from '../AdminLayout';
import { ResourceManager, type FieldDef } from '../ResourceManager';
import { StatusBadge, Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useToast } from '@/components/ui/Toast';
import { programmes } from '@/data/programmes';
import type { Animal, Campaign, DocumentItem, GalleryAlbum, NGOEvent, Programme, Story } from '@/types';
import { fmtDate, inr, pct, slugify } from '@/utils/format';
import { range } from '@/utils/validate';

const progSlugs = programmes.map((p) => p.slug);
const today = () => new Date().toISOString().slice(0, 10);
const uid = (p: string) => p + Date.now().toString(36);

/* ============================ CAMPAIGNS ============================ */
export function CampaignsAdmin() {
  const { can } = useAuth();
  const { rows, upsert, remove } = useCollection('campaigns');
  const toast = useToast();
  if (!can('campaigns:write')) return <Forbidden />;
  const fields: FieldDef[] = [
    { key: 'title', label: 'Title', type: 'text', required: true, full: true },
    { key: 'description', label: 'Short description', type: 'textarea', required: true },
    { key: 'story', label: 'Story', type: 'lines' },
    { key: 'programme', label: 'Programme', type: 'select', options: progSlugs, required: true },
    { key: 'category', label: 'Category', type: 'select', options: ['Education', 'Women', 'Healthcare', 'Animals', 'Food', 'Emergency', 'Environment', 'Other'], required: true },
    { key: 'goal', label: 'Target (₹)', type: 'number', required: true, rules: [range(1000, 100000000, 'Target')] },
    { key: 'status', label: 'Status', type: 'select', options: ['draft', 'active', 'paused', 'completed', 'archived'], required: true },
    { key: 'startDate', label: 'Start date', type: 'date', required: true },
    { key: 'endDate', label: 'End date', type: 'date', required: true },
    { key: 'image', label: 'Cover image', type: 'image' },
    { key: 'urgent', label: 'Mark as urgent', type: 'checkbox', hint: 'Shown first, with an urgent badge' },
    { key: 'featured', label: 'Feature on home page', type: 'checkbox' },
  ];
  const setStatus = (c: Campaign, status: Campaign['status'], verb: string) => { upsert({ ...c, status }, verb); toast(`${c.title}: ${verb.toLowerCase()}`); };
  return (
    <ResourceManager<Campaign> title="Campaigns" singular="Campaign" text="Create, publish, pause and archive fundraising campaigns." rows={rows} fields={fields}
      searchKeys={['title', 'category']} filters={[{ key: 'status', label: 'Status', options: ['draft', 'active', 'paused', 'completed', 'archived'] }, { key: 'category', label: 'Category', options: ['Education', 'Women', 'Healthcare', 'Animals', 'Food', 'Emergency', 'Environment', 'Other'] }]}
      columns={[
        { key: 'title', header: 'Campaign', render: (c) => <div className="min-w-[12rem]"><p className="font-medium">{c.title}</p><p className="text-xs text-muted">{c.category}{c.urgent ? ' · Urgent' : ''}</p></div> },
        { key: 'raised', header: 'Progress', sortValue: (c) => pct(c.raised, c.goal), render: (c) => <div className="w-36"><ProgressBar value={pct(c.raised, c.goal)} label="progress" size="sm" /><p className="mt-1 text-xs tabular text-muted">{inr(c.raised)} of {inr(c.goal)}</p></div> },
        { key: 'supporters', header: 'Supporters', align: 'right', hideOnMobile: true, sortValue: (c) => c.supporters },
        { key: 'endDate', header: 'Ends', hideOnMobile: true, render: (c) => fmtDate(c.endDate) },
        { key: 'status', header: 'Status', render: (c) => <StatusBadge status={c.status} /> },
      ]}
      extraActions={(c) => (
        <>
          {(c.status === 'draft' || c.status === 'paused') && <Button size="sm" variant="ghost" onClick={() => setStatus(c, 'active', c.status === 'draft' ? 'Published' : 'Resumed')} aria-label="Publish or resume"><Play className="h-4 w-4" /></Button>}
          {c.status === 'active' && <Button size="sm" variant="ghost" onClick={() => setStatus(c, 'paused', 'Paused')} aria-label="Pause"><Pause className="h-4 w-4" /></Button>}
          {c.status !== 'archived' && <Button size="sm" variant="ghost" onClick={() => setStatus(c, 'archived', 'Archived')} aria-label="Archive"><Archive className="h-4 w-4" /></Button>}
        </>
      )}
      onSave={(r, isNew) => upsert({ ...r, slug: r.slug || slugify(r.title), theme: programmes.find((p) => p.slug === r.programme)?.theme ?? 'community' }, isNew ? 'Created' : 'Updated')}
      onDelete={(r) => remove(r.id, r.title)}
      newRow={() => ({ id: uid('c'), slug: '', title: '', description: '', story: [], whyNeeded: [], programme: 'education', category: 'Education', theme: 'education', goal: 100000, raised: 0, supporters: 0, startDate: today(), endDate: today(), status: 'draft', updates: [] })} />
  );
}

/* ============================ PROGRAMMES ============================ */
export function ProgrammesAdmin() {
  const { can } = useAuth();
  const { rows, upsert, remove } = useCollection('programmes');
  if (!can('programmes:write')) return <Forbidden />;
  return (
    <ResourceManager<Programme> title="Programmes" singular="Programme" text="Programme pages shown under Our Work." rows={rows} searchKeys={['title', 'short']}
      filters={[{ key: 'status', label: 'Status', options: ['draft', 'published', 'archived'] }]}
      fields={[
        { key: 'title', label: 'Title', type: 'text', required: true },
        { key: 'short', label: 'One-line description', type: 'text', required: true },
        { key: 'summary', label: 'Summary', type: 'textarea', required: true },
        { key: 'problem', label: 'Problem statement', type: 'textarea', required: true },
        { key: 'approach', label: 'Our approach', type: 'lines' },
        { key: 'whoWeSupport', label: 'Who we support', type: 'tags' },
        { key: 'activities', label: 'Activities', type: 'tags' },
        { key: 'locations', label: 'Locations', type: 'tags' },
        { key: 'sensitive', label: 'Privacy / safeguarding note', type: 'textarea' },
        { key: 'status', label: 'Status', type: 'select', options: ['draft', 'published', 'archived'], required: true },
        { key: 'image', label: 'Hero image', type: 'image' },
      ]}
      columns={[
        { key: 'title', header: 'Programme', render: (p) => <div><p className="font-medium">{p.title}</p><p className="text-xs text-muted">/programmes/{p.slug}</p></div> },
        { key: 'short', header: 'Description', hideOnMobile: true, render: (p) => <span className="line-clamp-1 max-w-sm text-muted">{p.short}</span> },
        { key: 'status', header: 'Status', render: (p) => <StatusBadge status={p.status} /> },
      ]}
      onSave={(r, isNew) => upsert({ ...r, slug: r.slug || (slugify(r.title) as Programme['slug']) }, isNew ? 'Created' : 'Updated')}
      onDelete={(r) => remove(r.id, r.title)}
      newRow={() => ({ id: uid('p'), slug: '' as Programme['slug'], title: '', short: '', theme: 'community', icon: 'Users', summary: '', problem: '', approach: [], whatWeDo: [], whoWeSupport: [], activities: [], locations: [], metrics: [], status: 'draft' })} />
  );
}

/* ============================ STORIES ============================ */
export function StoriesAdmin() {
  const { can } = useAuth();
  const { rows, upsert, remove } = useCollection('stories');
  const toast = useToast();
  if (!can('stories:write')) return <Forbidden />;
  return (
    <ResourceManager<Story> title="Stories" singular="Story" text="Draft, schedule and publish stories. Consent must be recorded before publishing." rows={rows} searchKeys={['title', 'author']}
      filters={[{ key: 'status', label: 'Status', options: ['draft', 'scheduled', 'published', 'archived'] }, { key: 'category', label: 'Category', options: ['Education', 'Women', 'Animals', 'Healthcare', 'Community', 'Volunteer'] }]}
      fields={[
        { key: 'title', label: 'Title', type: 'text', required: true, full: true },
        { key: 'category', label: 'Category', type: 'select', options: ['Education', 'Women', 'Animals', 'Healthcare', 'Community', 'Volunteer'], required: true },
        { key: 'kind', label: 'Story type', type: 'select', options: ['success', 'animal', 'volunteer', 'field'], required: true },
        { key: 'programme', label: 'Programme', type: 'select', options: progSlugs, required: true },
        { key: 'author', label: 'Author', type: 'text', required: true },
        { key: 'date', label: 'Publish date', type: 'date', required: true, hint: 'A future date with status "scheduled" publishes automatically' },
        { key: 'location', label: 'Location (general area only)', type: 'text' },
        { key: 'excerpt', label: 'Excerpt', type: 'textarea', required: true },
        { key: 'body', label: 'Content', type: 'lines', required: true },
        { key: 'impact', label: 'Impact summary', type: 'text', full: true },
        { key: 'tags', label: 'Tags', type: 'tags' },
        { key: 'consent', label: 'Consent', type: 'select', options: ['recorded', 'anonymised'], required: true },
        { key: 'status', label: 'Status', type: 'select', options: ['draft', 'scheduled', 'published', 'archived'], required: true },
        { key: 'image', label: 'Image', type: 'image' },
      ]}
      columns={[
        { key: 'title', header: 'Title', render: (s) => <div className="min-w-[14rem]"><p className="font-medium">{s.title}</p><p className="text-xs text-muted">{s.author}</p></div> },
        { key: 'category', header: 'Category', hideOnMobile: true },
        { key: 'consent', header: 'Consent', hideOnMobile: true, render: (s) => <Badge tone={s.consent === 'recorded' ? 'ok' : 'brand'}>{s.consent}</Badge> },
        { key: 'date', header: 'Date', render: (s) => fmtDate(s.date) },
        { key: 'status', header: 'Status', render: (s) => <StatusBadge status={s.status} /> },
      ]}
      extraActions={(s) => can('stories:publish') && s.status !== 'published' ? <Button size="sm" variant="ghost" aria-label="Publish" onClick={() => { upsert({ ...s, status: 'published' }, 'Published'); toast('Story published'); }}><Send className="h-4 w-4" /></Button> : null}
      onSave={(r, isNew) => upsert({ ...r, slug: r.slug || slugify(r.title), theme: programmes.find((p) => p.slug === r.programme)?.theme ?? 'community' }, isNew ? 'Created' : 'Updated')}
      onDelete={(r) => remove(r.id, r.title)}
      newRow={() => ({ id: uid('s'), slug: '', title: '', excerpt: '', body: [], impact: '', category: 'Education', kind: 'success', programme: 'education', theme: 'education', location: '', date: today(), author: '', tags: [], consent: 'anonymised', status: 'draft' })} />
  );
}

/* ============================ EVENTS ============================ */
export function EventsAdmin() {
  const { can } = useAuth();
  const { rows, upsert, remove } = useCollection('events');
  if (!can('events:write')) return <Forbidden />;
  const cats = ['Health camp', 'Education drive', 'Vaccination drive', 'Food distribution', 'Tree plantation', 'Volunteer meetup', 'Awareness'];
  return (
    <ResourceManager<NGOEvent> title="Events" singular="Event" rows={rows} searchKeys={['title', 'location']} filters={[{ key: 'category', label: 'Type', options: cats }]}
      fields={[
        { key: 'title', label: 'Title', type: 'text', required: true, full: true },
        { key: 'category', label: 'Type', type: 'select', options: cats, required: true },
        { key: 'date', label: 'Date', type: 'date', required: true },
        { key: 'startTime', label: 'Start time', type: 'text', required: true, hint: '24h, e.g. 09:00' },
        { key: 'endTime', label: 'End time', type: 'text', required: true },
        { key: 'location', label: 'Location', type: 'text', required: true, full: true },
        { key: 'description', label: 'Description', type: 'textarea', required: true },
        { key: 'volunteersNeeded', label: 'Volunteers needed', type: 'number' },
        { key: 'registrationOpen', label: 'Registration open', type: 'checkbox' },
      ]}
      columns={[
        { key: 'title', header: 'Event', render: (e) => <div><p className="font-medium">{e.title}</p><p className="text-xs text-muted">{e.category}</p></div> },
        { key: 'date', header: 'Date', render: (e) => `${fmtDate(e.date)} · ${e.startTime}` },
        { key: 'location', header: 'Location', hideOnMobile: true, render: (e) => <span className="line-clamp-1 max-w-[14rem]">{e.location}</span> },
        { key: 'registrationOpen', header: 'Registration', render: (e) => <StatusBadge status={e.registrationOpen ? 'active' : 'closed'} /> },
      ]}
      onSave={(r, isNew) => upsert({ ...r, slug: r.slug || slugify(r.title) }, isNew ? 'Created' : 'Updated')}
      onDelete={(r) => remove(r.id, r.title)}
      newRow={() => ({ id: uid('e'), slug: '', title: '', category: 'Health camp', theme: 'health', date: today(), startTime: '09:00', endTime: '13:00', location: '', description: '', registrationOpen: true, status: 'published' })} />
  );
}

/* ============================ GALLERY ============================ */
export function GalleryAdmin() {
  const { can } = useAuth();
  const { rows, upsert, remove } = useCollection('albums');
  if (!can('gallery:write')) return <Forbidden />;
  return (
    <ResourceManager<GalleryAlbum> title="Gallery" singular="Album" text="Create albums, upload media, add captions and publish. Only upload images with recorded consent." rows={rows} searchKeys={['title']}
      filters={[{ key: 'kind', label: 'Type', options: ['photo', 'video'] }]}
      fields={[
        { key: 'title', label: 'Album title', type: 'text', required: true, full: true },
        { key: 'programme', label: 'Programme', type: 'select', options: progSlugs, required: true },
        { key: 'kind', label: 'Type', type: 'select', options: ['photo', 'video'], required: true },
        { key: 'date', label: 'Date', type: 'date', required: true },
        { key: 'media', label: 'Upload media', type: 'image', hint: 'Images are resized and converted to WebP/AVIF on upload' },
        { key: 'published', label: 'Published', type: 'checkbox' },
      ]}
      columns={[
        { key: 'title', header: 'Album', render: (a) => <p className="font-medium">{a.title}</p> },
        { key: 'kind', header: 'Type', render: (a) => <Badge>{a.kind}</Badge> },
        { key: 'items', header: 'Items', align: 'right', sortValue: (a) => a.items.length, render: (a) => a.items.length },
        { key: 'date', header: 'Date', hideOnMobile: true, render: (a) => fmtDate(a.date) },
        { key: 'published', header: 'Visibility', render: (a) => <StatusBadge status={a.published ? 'published' : 'draft'} /> },
      ]}
      extraActions={(a) => <Button size="sm" variant="ghost" aria-label={a.published ? 'Unpublish' : 'Publish'} onClick={() => upsert({ ...a, published: !a.published }, a.published ? 'Unpublished' : 'Published')}>{a.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</Button>}
      onSave={(r, isNew) => upsert({ ...r, theme: programmes.find((p) => p.slug === r.programme)?.theme ?? 'community' }, isNew ? 'Created' : 'Updated')}
      onDelete={(r) => remove(r.id, r.title)}
      newRow={() => ({ id: uid('g'), title: '', programme: 'education', theme: 'education', date: today(), kind: 'photo', items: [], published: false })} />
  );
}

/* ============================ ANIMALS ============================ */
export function AnimalsAdmin() {
  const { can } = useAuth();
  const listings = useCollection('animals');
  const cases = useCollection('animalCases');
  const [tab, setTab] = useState<'listings' | 'cases'>('listings');
  if (!can('animals:write')) return <Forbidden />;
  const tabs = (
    <div role="tablist" className="mb-6 inline-grid grid-cols-2 rounded-full bg-surface-2 p-1">
      {([['listings', 'Adoption & foster listings'], ['cases', 'Cases & drives']] as const).map(([k, l]) => (
        <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`rounded-full px-4 py-2 text-sm font-semibold ${tab === k ? 'bg-surface shadow-soft' : 'text-muted'}`}>{l}</button>
      ))}
    </div>
  );
  if (tab === 'cases') return (
    <ResourceManager<AnimalCase> title="Animal Welfare" singular="Case" text="Rescue cases, veterinary support, vaccination, sterilisation and feeding drives, and shelter partnerships." rows={cases.rows} searchKeys={['title', 'caseNo', 'area']}
      filters={[{ key: 'type', label: 'Type', options: ['Rescue', 'Veterinary support', 'Vaccination drive', 'Sterilisation drive', 'Feeding drive', 'Shelter partnership'] }, { key: 'status', label: 'Status', options: ['Open', 'In treatment', 'Closed'] }]}
      fields={[
        { key: 'caseNo', label: 'Case / drive number', type: 'text', required: true },
        { key: 'type', label: 'Type', type: 'select', options: ['Rescue', 'Veterinary support', 'Vaccination drive', 'Sterilisation drive', 'Feeding drive', 'Shelter partnership'], required: true },
        { key: 'title', label: 'Title', type: 'text', required: true, full: true },
        { key: 'area', label: 'Area', type: 'text', required: true },
        { key: 'date', label: 'Date', type: 'date', required: true },
        { key: 'animals', label: 'Animals covered', type: 'number', required: true },
        { key: 'status', label: 'Status', type: 'select', options: ['Open', 'In treatment', 'Closed'], required: true },
        { key: 'notes', label: 'Internal notes', type: 'textarea' },
      ]}
      columns={[
        { key: 'caseNo', header: 'No.', render: (c) => <span className="font-mono text-xs">{c.caseNo}</span> },
        { key: 'title', header: 'Case / drive', render: (c) => <div><p className="font-medium">{c.title}</p><p className="text-xs text-muted">{c.type}</p></div> },
        { key: 'animals', header: 'Animals', align: 'right', sortValue: (c) => c.animals },
        { key: 'date', header: 'Date', hideOnMobile: true, render: (c) => fmtDate(c.date) },
        { key: 'status', header: 'Status', render: (c) => <Badge tone={c.status === 'Closed' ? 'neutral' : c.status === 'Open' ? 'brand' : 'warn'} dot>{c.status}</Badge> },
      ]}
      onSave={(r, isNew) => cases.upsert(r, isNew ? 'Created' : 'Updated')} onDelete={(r) => cases.remove(r.id, r.title)}
      newRow={() => ({ id: uid('ac'), caseNo: '', type: 'Rescue', title: '', area: '', date: today(), animals: 1, status: 'Open' })}>{tabs}</ResourceManager>
  );
  return (
    <ResourceManager<Animal> title="Animal Welfare" singular="Animal" text="Adoption and foster listings. Show a general area only, never an exact location." rows={listings.rows} searchKeys={['name', 'code', 'area']}
      filters={[{ key: 'species', label: 'Species', options: ['Dog', 'Cat', 'Cow', 'Bird', 'Other'] }, { key: 'status', label: 'Status', options: ['Available for adoption', 'Needs foster', 'Under treatment', 'Adopted', 'Community animal'] }]}
      fields={[
        { key: 'code', label: 'Animal ID', type: 'text', required: true },
        { key: 'name', label: 'Name', type: 'text', required: true },
        { key: 'species', label: 'Species', type: 'select', options: ['Dog', 'Cat', 'Cow', 'Bird', 'Other'], required: true },
        { key: 'ageEstimate', label: 'Age (estimate)', type: 'text', required: true },
        { key: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Unknown'] },
        { key: 'area', label: 'General area', type: 'text', required: true, hint: 'e.g. North zone, not a street address' },
        { key: 'health', label: 'Health status', type: 'text', required: true, full: true },
        { key: 'vaccinated', label: 'Vaccinated', type: 'checkbox' },
        { key: 'sterilised', label: 'Sterilised', type: 'checkbox' },
        { key: 'status', label: 'Adoption status', type: 'select', options: ['Available for adoption', 'Needs foster', 'Under treatment', 'Adopted', 'Community animal'], required: true },
        { key: 'temperament', label: 'Temperament', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea', required: true },
        { key: 'photos', label: 'Images', type: 'image' },
      ]}
      columns={[
        { key: 'code', header: 'ID', render: (a) => <span className="font-mono text-xs">{a.code}</span> },
        { key: 'name', header: 'Animal', render: (a) => <div><p className="font-medium">{a.name}</p><p className="text-xs text-muted">{a.species} · {a.ageEstimate}</p></div> },
        { key: 'vaccinated', header: 'Vacc. / Steril.', hideOnMobile: true, render: (a) => <span className="text-xs">{a.vaccinated ? '✓' : '—'} / {a.sterilised ? '✓' : '—'}</span> },
        { key: 'area', header: 'Area', hideOnMobile: true },
        { key: 'status', header: 'Status', render: (a) => <StatusBadge status={a.status} /> },
      ]}
      onSave={(r, isNew) => listings.upsert(r, isNew ? 'Created' : 'Updated')} onDelete={(r) => listings.remove(r.id, r.name)}
      newRow={() => ({ id: uid('a'), code: '', name: '', species: 'Dog', ageEstimate: '', gender: 'Unknown', area: '', status: 'Under treatment', health: '', vaccinated: false, sterilised: false, temperament: '', description: '', seed: Math.floor(Math.random() * 90) })}>{tabs}</ResourceManager>
  );
}

/* ============================ IMPACT ============================ */
export function ImpactAdmin() {
  const { can } = useAuth();
  const { rows, upsert, remove } = useCollection('impact');
  if (!can('impact:write')) return <Forbidden />;
  return (
    <ResourceManager<ImpactMetricRow> title="Impact metrics" singular="Metric" text="Only metrics marked verified are shown publicly without a sample label." rows={rows} searchKeys={['metric', 'programme']}
      fields={[
        { key: 'metric', label: 'Metric', type: 'text', required: true },
        { key: 'value', label: 'Value', type: 'number', required: true },
        { key: 'period', label: 'Reporting period', type: 'text', required: true, hint: 'e.g. FY 2025–26' },
        { key: 'programme', label: 'Programme', type: 'text', required: true },
        { key: 'location', label: 'Location', type: 'text', required: true },
        { key: 'verified', label: 'Verified against source records', type: 'checkbox', hint: 'Requires supporting documents in the Documents section' },
      ]}
      columns={[
        { key: 'metric', header: 'Metric', render: (m) => <p className="font-medium">{m.metric}</p> },
        { key: 'value', header: 'Value', align: 'right', sortValue: (m) => m.value, render: (m) => m.value.toLocaleString('en-IN') },
        { key: 'period', header: 'Period' },
        { key: 'programme', header: 'Programme', hideOnMobile: true },
        { key: 'verified', header: 'Verification', render: (m) => <Badge tone={m.verified ? 'ok' : 'warn'} dot>{m.verified ? 'Verified' : 'Sample / unverified'}</Badge> },
      ]}
      onSave={(r, isNew) => upsert(r, isNew ? 'Created' : 'Updated')} onDelete={(r) => remove(r.id, r.metric)}
      newRow={() => ({ id: uid('im'), metric: '', value: 0, period: 'FY 2026–27', programme: 'All', location: 'All', verified: false })} />
  );
}

/* ============================ DOCUMENTS ============================ */
export function DocumentsAdmin() {
  const { can } = useAuth();
  const { rows, upsert, remove } = useCollection('documents');
  if (!can('documents:write')) return <Forbidden />;
  return (
    <ResourceManager<DocumentItem> title="Documents" singular="Document" text="Upload reports and policies. Only documents marked verified are downloadable on the Transparency page." rows={rows} searchKeys={['title']}
      filters={[{ key: 'category', label: 'Category', options: ['Registration', 'Tax', 'Annual report', 'Financial report', 'Impact report', 'Policy', 'Legal'] }]}
      fields={[
        { key: 'title', label: 'Title', type: 'text', required: true, full: true },
        { key: 'category', label: 'Category', type: 'select', options: ['Registration', 'Tax', 'Annual report', 'Financial report', 'Impact report', 'Policy', 'Legal'], required: true },
        { key: 'period', label: 'Period', type: 'text' },
        { key: 'file', label: 'PDF file', type: 'image', hint: 'PDF, stored in private object storage and served through signed links' },
        { key: 'note', label: 'Public note', type: 'text', full: true },
        { key: 'verified', label: 'Verified and approved for publication', type: 'checkbox' },
      ]}
      columns={[
        { key: 'title', header: 'Document', render: (d) => <div><p className="font-medium">{d.title}</p><p className="text-xs text-muted">{d.period ?? ''}</p></div> },
        { key: 'category', header: 'Category' },
        { key: 'verified', header: 'Status', render: (d) => <Badge tone={d.verified ? 'ok' : 'warn'} dot>{d.verified ? 'Published' : 'Pending verification'}</Badge> },
      ]}
      onSave={(r, isNew) => upsert(r, isNew ? 'Uploaded' : 'Updated')} onDelete={(r) => remove(r.id, r.title)}
      newRow={() => ({ id: uid('d'), title: '', category: 'Policy', verified: false })} />
  );
}
