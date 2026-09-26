const inrFmt = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
const numFmt = new Intl.NumberFormat('en-IN');

/** ₹ with Indian digit grouping, e.g. ₹3,18,500 */
export const inr = (n: number) => inrFmt.format(n);
export const num = (n: number) => numFmt.format(n);
/** Compact Indian units: ₹3.2 L, ₹1.4 Cr */
export const inrCompact = (n: number) => {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(n % 1e7 === 0 ? 0 : 1)} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(n % 1e5 === 0 ? 0 : 1)} L`;
  return inr(n);
};
export const pct = (raised: number, goal: number) => (goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0);

/** Today, pinned for demo data consistency when running without an API. */
export const today = () => new Date();

export const daysLeft = (end: string) => Math.max(0, Math.ceil((new Date(end + 'T23:59:59').getTime() - today().getTime()) / 86400000));

export const fmtDate = (iso: string, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }) =>
  new Date(iso.length === 10 ? iso + 'T00:00:00' : iso).toLocaleDateString('en-IN', opts);
export const fmtDateTime = (iso: string) =>
  new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' });
export const fmtTime = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  const d = new Date(); d.setHours(h, m);
  return d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
};

export const cn = (...xs: (string | false | null | undefined)[]) => xs.filter(Boolean).join(' ');
export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
