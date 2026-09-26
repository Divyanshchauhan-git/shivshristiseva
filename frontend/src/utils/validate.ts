/** Small, dependency-free validators shared by every form. Backend re-validates everything. */
export type Rule<V = string> = (value: V, all: Record<string, unknown>) => string | null;

export const required = (label: string): Rule<unknown> => (v) =>
  v === undefined || v === null || (typeof v === 'string' && v.trim() === '') || (Array.isArray(v) && v.length === 0) || v === false
    ? `${label} is required.` : null;

export const email: Rule<unknown> = (v) =>
  typeof v === 'string' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? 'Enter a valid email address, like name@example.com.' : null;

/** Indian mobile numbers: optional +91 / 0 prefix, then 10 digits starting 6–9. */
export const phoneIN: Rule<unknown> = (v) => {
  if (typeof v !== 'string' || !v.trim()) return null;
  const d = v.replace(/[\s-]/g, '').replace(/^(\+91|0091|0)/, '');
  return /^[6-9]\d{9}$/.test(d) ? null : 'Enter a 10-digit Indian mobile number.';
};

export const pan: Rule<unknown> = (v) =>
  typeof v === 'string' && v && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(v.trim().toUpperCase()) ? 'PAN should look like ABCDE1234F.' : null;

export const pincode: Rule<unknown> = (v) =>
  typeof v === 'string' && v && !/^[1-9][0-9]{5}$/.test(v.trim()) ? 'Enter a 6-digit PIN code.' : null;

export const minLen = (n: number, label: string): Rule<unknown> => (v) =>
  typeof v === 'string' && v.trim() && v.trim().length < n ? `${label} should be at least ${n} characters.` : null;

export const maxLen = (n: number, label: string): Rule<unknown> => (v) =>
  typeof v === 'string' && v.length > n ? `${label} should be under ${n} characters.` : null;

export const range = (min: number, max: number, label: string): Rule<unknown> => (v) => {
  if (v === '' || v === undefined || v === null) return null;
  const n = Number(v);
  return Number.isFinite(n) && n >= min && n <= max ? null : `${label} should be between ${min} and ${max}.`;
};

export type Schema = Record<string, Rule<unknown>[]>;

export function validate(values: Record<string, unknown>, schema: Schema) {
  const errors: Record<string, string> = {};
  for (const [key, rules] of Object.entries(schema)) {
    for (const rule of rules) {
      const msg = rule(values[key], values);
      if (msg) { errors[key] = msg; break; }
    }
  }
  return errors;
}
