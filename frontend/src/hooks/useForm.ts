import { useState, type FormEvent } from 'react';
import { validate, type Schema } from '@/utils/validate';
import { ApiError } from '@/services/api';

export type SubmitState = { status: 'idle' | 'submitting' | 'success' | 'error'; message?: string; reference?: string };

/** Controlled form state + validation + submit lifecycle. Focuses the first invalid field. */
export function useForm<T extends Record<string, unknown>>(initial: T, schema: Schema) {
  const [values, setValues] = useState<T>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submit, setSubmit] = useState<SubmitState>({ status: 'idle' });

  const set = <K extends keyof T>(key: K, value: T[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key as string]) setErrors((e) => { const n = { ...e }; delete n[key as string]; return n; });
  };
  const bind = (key: keyof T & string) => ({
    name: key,
    value: (values[key] as string | number | undefined) ?? '',
    error: errors[key],
    onChange: (e: { target: { value: string } }) => set(key, e.target.value as T[typeof key]),
    onBlur: () => { const err = validate(values, { [key]: schema[key] ?? [] })[key]; setErrors((e) => { const n = { ...e }; if (err) n[key] = err; else delete n[key]; return n; }); },
  });

  const handleSubmit = (fn: (v: T) => Promise<{ reference?: string } | void>) => async (e: FormEvent) => {
    e.preventDefault();
    const errs = validate(values, schema);
    setErrors(errs);
    if (Object.keys(errs).length) {
      setSubmit({ status: 'error', message: `Please fix ${Object.keys(errs).length === 1 ? 'the highlighted field' : `the ${Object.keys(errs).length} highlighted fields`}.` });
      requestAnimationFrame(() => (document.querySelector<HTMLElement>('[aria-invalid="true"]'))?.focus());
      return;
    }
    setSubmit({ status: 'submitting' });
    try {
      const r = await fn(values);
      setSubmit({ status: 'success', reference: r && 'reference' in r ? r.reference : undefined });
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors) setErrors(err.fieldErrors);
      setSubmit({ status: 'error', message: err instanceof Error ? err.message : 'Something went wrong. Please try again.' });
    }
  };
  const reset = () => { setValues(initial); setErrors({}); setSubmit({ status: 'idle' }); };
  return { values, errors, set, bind, handleSubmit, submit, reset, setErrors };
}
