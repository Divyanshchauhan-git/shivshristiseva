import { createContext, useCallback, useContext, useMemo, useReducer, type ReactNode } from 'react';
import { campaigns } from '@/data/campaigns';
import { programmes } from '@/data/programmes';
import { albums, animals, documents, events, stories } from '@/data/content';
import { demoAudit, demoDonations, demoMessages, demoPartnerships, demoUsers, demoVolunteers, type AuditRow } from '@/data/admin';
import { useAuth } from './auth';

/**
 * Admin data layer. In demo mode, collections live in memory (reset on reload).
 * With the API connected, each action maps to the REST endpoint noted beside it
 * (see docs/API.md), and the server writes the audit log.
 */
export interface AnimalCase {
  id: string; caseNo: string; type: 'Rescue' | 'Veterinary support' | 'Vaccination drive' | 'Sterilisation drive' | 'Feeding drive' | 'Shelter partnership';
  title: string; area: string; date: string; animals: number; status: 'Open' | 'In treatment' | 'Closed'; notes?: string;
}
export interface ImpactMetricRow { id: string; metric: string; value: number; period: string; programme: string; location: string; verified: boolean }

const animalCases: AnimalCase[] = [
  { id: 'ac1', caseNo: 'RC-2026-118', type: 'Rescue', title: 'Injured dog near market', area: 'Central zone', date: '2026-09-24', animals: 1, status: 'In treatment' },
  { id: 'ac2', caseNo: 'VD-2026-09', type: 'Vaccination drive', title: 'Anti-rabies drive, 3 wards', area: 'North zone', date: '2026-10-11', animals: 120, status: 'Open' },
  { id: 'ac3', caseNo: 'SD-2026-04', type: 'Sterilisation drive', title: 'ABC drive with licensed partner', area: 'East zone', date: '2026-09-02', animals: 36, status: 'Closed' },
  { id: 'ac4', caseNo: 'FD-2026-W', type: 'Feeding drive', title: 'Weekend feeding route', area: 'South zone', date: '2026-09-20', animals: 85, status: 'Open' },
  { id: 'ac5', caseNo: 'SP-2026-02', type: 'Shelter partnership', title: 'Monthly supplies to partner shelter', area: 'Outskirts', date: '2026-09-01', animals: 60, status: 'Open' },
  { id: 'ac6', caseNo: 'VS-2026-33', type: 'Veterinary support', title: 'Cat with eye infection', area: 'Central zone', date: '2026-09-18', animals: 1, status: 'In treatment' },
];
const impactRows: ImpactMetricRow[] = [
  { id: 'im1', metric: 'People supported', value: 10000, period: 'FY 2025–26', programme: 'All', location: 'All', verified: false },
  { id: 'im2', metric: 'Children reached', value: 2500, period: 'FY 2025–26', programme: 'Education', location: 'All', verified: false },
  { id: 'im3', metric: 'Women supported', value: 1200, period: 'FY 2025–26', programme: 'Women Empowerment', location: 'All', verified: false },
  { id: 'im4', metric: 'Animals helped', value: 500, period: 'FY 2025–26', programme: 'Animal Welfare', location: 'All', verified: false },
  { id: 'im5', metric: 'Health camps', value: 48, period: 'FY 2025–26', programme: 'Healthcare', location: 'All', verified: false },
  { id: 'im6', metric: 'Volunteers', value: 1000, period: 'FY 2025–26', programme: 'All', location: 'All', verified: false },
];

const initial = {
  campaigns, programmes, stories, events, albums, animals, animalCases, impact: impactRows, documents,
  users: demoUsers, donations: demoDonations, volunteers: demoVolunteers, partnerships: demoPartnerships, messages: demoMessages, audit: demoAudit,
};
export type DataMap = typeof initial;
export type CollectionName = keyof DataMap;
type Row<K extends CollectionName> = DataMap[K][number];

type Action =
  | { type: 'upsert'; name: CollectionName; row: { id: string } }
  | { type: 'remove'; name: CollectionName; id: string }
  | { type: 'log'; row: AuditRow };

function reducer(state: DataMap, a: Action): DataMap {
  if (a.type === 'log') return { ...state, audit: [a.row, ...state.audit] };
  const list = state[a.name] as { id: string }[];
  if (a.type === 'remove') return { ...state, [a.name]: list.filter((r) => r.id !== a.id) };
  const exists = list.some((r) => r.id === a.row.id);
  return { ...state, [a.name]: exists ? list.map((r) => (r.id === a.row.id ? { ...r, ...a.row } : r)) : [a.row, ...list] };
}

const Ctx = createContext<{ data: DataMap; dispatch: (a: Action) => void } | null>(null);

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [data, dispatch] = useReducer(reducer, initial);
  return <Ctx.Provider value={{ data, dispatch }}>{children}</Ctx.Provider>;
}

export function useCollection<K extends CollectionName>(name: K) {
  const c = useContext(Ctx); if (!c) throw new Error('useCollection outside AdminDataProvider');
  const { user } = useAuth();
  const log = useCallback((action: string, entity: string) => c.dispatch({ type: 'log', row: { id: 'l' + Date.now() + Math.random(), at: new Date().toISOString(), actor: user?.email ?? 'unknown', action, entity } }), [c, user]);
  return useMemo(() => ({
    rows: c.data[name] as Row<K>[],
    /** PUT /api/admin/{name}/{id} or POST /api/admin/{name} */
    upsert: (row: Row<K>, action = 'Saved') => { c.dispatch({ type: 'upsert', name, row: row as { id: string } }); log(`${action} ${String(name).replace(/s$/, '')}`, (row as { title?: string; name?: string; id: string }).title ?? (row as { name?: string }).name ?? (row as { id: string }).id); },
    /** DELETE /api/admin/{name}/{id} (soft delete / archive server-side) */
    remove: (id: string, label: string) => { c.dispatch({ type: 'remove', name, id }); log(`Deleted ${String(name).replace(/s$/, '')}`, label); },
    log,
  }), [c, name, log]);
}

export function useAdminData() { const c = useContext(Ctx); if (!c) throw new Error('outside provider'); return c.data; }
