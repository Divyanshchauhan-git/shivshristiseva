import { forwardRef, useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/utils/format';

const control = 'block w-full rounded-xl border bg-surface px-3.5 py-2.5 text-[0.95rem] text-fg placeholder:text-muted/70 transition-colors focus:outline-none focus:ring-4 focus:ring-marigold/30 focus:border-brand-text disabled:opacity-60';
const ctl = (err?: string) => cn(control, err ? 'border-danger' : 'border-line hover:border-muted/50');

interface Base { label: string; error?: string; hint?: ReactNode; optional?: boolean; className?: string }

function Wrap({ id, label, error, hint, optional, className, children }: Base & { id: string; children: ReactNode }) {
  return (
    <div className={cn('min-w-0', className)}>
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between gap-2 text-sm font-semibold text-fg">
        <span>{label}</span>{optional && <span className="text-xs font-normal text-muted">Optional</span>}
      </label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted">{hint}</p>}
      {error && <p id={`${id}-err`} className="mt-1.5 text-xs font-medium text-danger">{error}</p>}
    </div>
  );
}

const aria = (id: string, error?: string, hint?: ReactNode) => ({
  'aria-invalid': error ? true : undefined,
  'aria-describedby': error ? `${id}-err` : hint ? `${id}-hint` : undefined,
});

export const TextField = forwardRef<HTMLInputElement, Base & InputHTMLAttributes<HTMLInputElement>>(function TextField({ label, error, hint, optional, className, id, ...rest }, ref) {
  const auto = useId(); const fid = id ?? auto;
  return <Wrap id={fid} label={label} error={error} hint={hint} optional={optional} className={className}><input ref={ref} id={fid} className={ctl(error)} {...aria(fid, error, hint)} {...rest} /></Wrap>;
});

export const TextArea = forwardRef<HTMLTextAreaElement, Base & TextareaHTMLAttributes<HTMLTextAreaElement>>(function TextArea({ label, error, hint, optional, className, id, rows = 4, ...rest }, ref) {
  const auto = useId(); const fid = id ?? auto;
  return <Wrap id={fid} label={label} error={error} hint={hint} optional={optional} className={className}><textarea ref={ref} id={fid} rows={rows} className={cn(ctl(error), 'resize-y')} {...aria(fid, error, hint)} {...rest} /></Wrap>;
});

export const SelectField = forwardRef<HTMLSelectElement, Base & SelectHTMLAttributes<HTMLSelectElement> & { options: (string | { value: string; label: string })[]; placeholder?: string }>(
  function SelectField({ label, error, hint, optional, className, id, options, placeholder, ...rest }, ref) {
    const auto = useId(); const fid = id ?? auto;
    return (
      <Wrap id={fid} label={label} error={error} hint={hint} optional={optional} className={className}>
        <select ref={ref} id={fid} className={cn(ctl(error), 'appearance-none bg-[length:1.1rem] bg-[right_0.8rem_center] bg-no-repeat pr-10')}
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b7f82' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")" }}
          {...aria(fid, error, hint)} {...rest}>
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => typeof o === 'string' ? <option key={o} value={o}>{o}</option> : <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </Wrap>
    );
  });

export function Checkbox({ label, checked, onChange, error, id, description }: { label: ReactNode; checked: boolean; onChange: (v: boolean) => void; error?: string; id?: string; description?: string }) {
  const auto = useId(); const fid = id ?? auto;
  return (
    <div>
      <label htmlFor={fid} className="flex cursor-pointer items-start gap-3 text-sm">
        <input id={fid} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} {...aria(fid, error)}
          className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-line accent-[rgb(var(--brand))]" />
        <span><span className="text-fg">{label}</span>{description && <span className="block text-xs text-muted">{description}</span>}</span>
      </label>
      {error && <p id={`${fid}-err`} className="mt-1.5 pl-8 text-xs font-medium text-danger">{error}</p>}
    </div>
  );
}

/** Multi-select as toggle chips (keyboard accessible checkboxes). */
export function ChipGroup({ legend, options, value, onChange, error }: { legend: string; options: string[]; value: string[]; onChange: (v: string[]) => void; error?: string }) {
  const gid = useId();
  return (
    <fieldset aria-describedby={error ? `${gid}-err` : undefined}>
      <legend className="mb-2 text-sm font-semibold">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = value.includes(o);
          return (
            <label key={o} className={cn('cursor-pointer rounded-full border px-3.5 py-1.5 text-sm transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-marigold/40',
              on ? 'border-brand bg-brand text-brand-fg' : 'border-line bg-surface hover:border-brand-text/40')}>
              <input type="checkbox" className="sr-only" checked={on} onChange={() => onChange(on ? value.filter((x) => x !== o) : [...value, o])} />
              {o}
            </label>
          );
        })}
      </div>
      {error && <p id={`${gid}-err`} className="mt-1.5 text-xs font-medium text-danger">{error}</p>}
    </fieldset>
  );
}
