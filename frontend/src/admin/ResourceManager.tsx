import { useMemo, useState, type ReactNode } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Checkbox, SelectField, TextArea, TextField } from '@/components/ui/Field';
import { SearchInput } from '@/components/ui/Controls';
import { useToast } from '@/components/ui/Toast';
import { validate, required, type Rule } from '@/utils/validate';
import { DataTable, type Column } from './DataTable';
import { AdminHeader } from './AdminLayout';

export type FieldDef = {
  key: string; label: string;
  type: 'text' | 'textarea' | 'number' | 'date' | 'select' | 'checkbox' | 'tags' | 'lines' | 'image';
  options?: string[]; required?: boolean; hint?: string; full?: boolean; rules?: Rule<unknown>[];
};

/** Converts between row values and form strings for list-type fields. */
const toForm = (f: FieldDef, v: unknown) =>
  f.type === 'tags' ? (Array.isArray(v) ? v.join(', ') : '') : f.type === 'lines' ? (Array.isArray(v) ? v.join('\n\n') : '') : f.type === 'checkbox' ? !!v : v ?? '';
const fromForm = (f: FieldDef, v: unknown) =>
  f.type === 'tags' ? String(v).split(',').map((s) => s.trim()).filter(Boolean)
    : f.type === 'lines' ? String(v).split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean)
      : f.type === 'number' ? Number(v) : v;

/**
 * Generic list + create/edit/delete screen used by most admin modules.
 * `filters` render as selects above the table; `extraActions` add row buttons (publish, pause...).
 */
export function ResourceManager<T extends { id: string }>({
  title, text, singular, rows, columns, fields, onSave, onDelete, newRow, searchKeys, filters = [], extraActions, headerActions, canWrite = true, children,
}: {
  title: string; text?: string; singular: string; rows: T[]; columns: Column<T>[]; fields: FieldDef[];
  onSave: (row: T, isNew: boolean) => void; onDelete?: (row: T) => void; newRow: () => T; searchKeys: (keyof T)[];
  filters?: { key: keyof T; label: string; options: string[] }[]; extraActions?: (row: T) => ReactNode; headerActions?: ReactNode; canWrite?: boolean; children?: ReactNode;
}) {
  const toast = useToast();
  const [q, setQ] = useState('');
  const [fv, setFv] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<{ row: T; isNew: boolean } | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirm, setConfirm] = useState<T | null>(null);

  const filtered = useMemo(() => rows.filter((r) =>
    (!q || searchKeys.some((k) => String(r[k] ?? '').toLowerCase().includes(q.toLowerCase()))) &&
    filters.every((f) => !fv[f.key as string] || String(r[f.key]) === fv[f.key as string]),
  ), [rows, q, fv, filters, searchKeys]);

  const open = (row: T, isNew: boolean) => {
    setEditing({ row, isNew });
    setForm(Object.fromEntries(fields.map((f) => [f.key, toForm(f, (row as Record<string, unknown>)[f.key])])));
    setErrors({});
  };
  const save = () => {
    const schema = Object.fromEntries(fields.map((f) => [f.key, [...(f.required ? [required(f.label)] : []), ...(f.rules ?? [])]]));
    const e = validate(form, schema);
    setErrors(e);
    if (Object.keys(e).length) return;
    const row = { ...editing!.row, ...Object.fromEntries(fields.map((f) => [f.key, fromForm(f, form[f.key])])) } as T;
    onSave(row, editing!.isNew);
    toast(`${singular} ${editing!.isNew ? 'created' : 'saved'}`);
    setEditing(null);
  };

  const cols: Column<T>[] = columns;
  return (
    <div>
      <AdminHeader title={title} text={text} actions={<>{headerActions}{canWrite && <Button onClick={() => open(newRow(), true)} icon={<Plus className="h-4 w-4" />}>New {singular.toLowerCase()}</Button>}</>} />
      {children}
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end">
        <SearchInput value={q} onChange={setQ} placeholder={`Search ${title.toLowerCase()}`} label={`Search ${title}`} />
        {filters.map((f) => (
          <SelectField key={String(f.key)} label={f.label} className="md:w-52" value={fv[f.key as string] ?? ''} onChange={(e) => setFv((s) => ({ ...s, [f.key as string]: e.target.value }))}
            options={[{ value: '', label: `All` }, ...f.options.map((o) => ({ value: o, label: o }))]} />
        ))}
      </div>
      <DataTable caption={title} rows={filtered} columns={cols} onRowClick={canWrite ? (r) => open(r, false) : undefined}
        rowActions={(r) => (
          <>
            {extraActions?.(r)}
            {canWrite && <Button size="sm" variant="ghost" onClick={() => open(r, false)} aria-label={`Edit ${singular}`}><Pencil className="h-4 w-4" /></Button>}
            {canWrite && onDelete && <Button size="sm" variant="ghost" onClick={() => setConfirm(r)} aria-label={`Delete ${singular}`} className="text-danger hover:bg-hibiscus-soft"><Trash2 className="h-4 w-4" /></Button>}
          </>
        )} />

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.isNew ? `New ${singular.toLowerCase()}` : `Edit ${singular.toLowerCase()}`} size="lg"
        footer={<><Button variant="secondary" onClick={() => setEditing(null)}>Cancel</Button><Button onClick={save}>Save</Button></>}>
        <form noValidate onSubmit={(e) => { e.preventDefault(); save(); }} className="grid gap-4 sm:grid-cols-2">
          {fields.map((f) => {
            const common = { label: f.label, error: errors[f.key], hint: f.hint, className: f.full || f.type === 'textarea' || f.type === 'lines' ? 'sm:col-span-2' : undefined };
            const val = form[f.key] as string;
            const on = (v: unknown) => { setForm((s) => ({ ...s, [f.key]: v })); setErrors((e) => { const n = { ...e }; delete n[f.key]; return n; }); };
            if (f.type === 'textarea' || f.type === 'lines') return <TextArea key={f.key} {...common} rows={f.type === 'lines' ? 6 : 3} value={val} onChange={(e) => on(e.target.value)} hint={f.type === 'lines' ? 'Separate paragraphs with a blank line' : f.hint} />;
            if (f.type === 'select') return <SelectField key={f.key} {...common} value={val} onChange={(e) => on(e.target.value)} placeholder="Choose…" options={f.options ?? []} />;
            if (f.type === 'checkbox') return <div key={f.key} className="sm:col-span-2"><Checkbox checked={!!form[f.key]} onChange={on} label={f.label} description={f.hint} /></div>;
            if (f.type === 'image') return <TextField key={f.key} {...common} type="file" accept="image/*" value="" onChange={() => on('uploaded')} hint={f.hint ?? 'Uploaded to object storage via a signed URL (POST /api/admin/uploads/sign)'} />;
            return <TextField key={f.key} {...common} type={f.type === 'tags' ? 'text' : f.type} value={val} onChange={(e) => on(e.target.value)} hint={f.type === 'tags' ? 'Comma separated' : f.hint} />;
          })}
          <button type="submit" hidden />
        </form>
      </Modal>

      <Modal open={!!confirm} onClose={() => setConfirm(null)} title={`Delete this ${singular.toLowerCase()}?`} size="sm"
        footer={<><Button variant="secondary" onClick={() => setConfirm(null)}>Keep it</Button><Button variant="danger" onClick={() => { onDelete!(confirm!); toast(`${singular} deleted`); setConfirm(null); }}>Delete</Button></>}>
        <p className="text-muted">This removes it from the site. On the live system, records are archived and kept in the audit log.</p>
      </Modal>
    </div>
  );
}
