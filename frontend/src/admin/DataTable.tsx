import { useMemo, useState, type ReactNode } from 'react';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import { Pagination } from '@/components/ui/Controls';
import { cn } from '@/utils/format';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  sortValue?: (row: T) => string | number;
  className?: string;
  /** Hide on small screens to keep the table readable */
  hideOnMobile?: boolean;
  align?: 'left' | 'right';
}

/** Sortable, paginated table. Scrolls horizontally inside its own container on narrow screens. */
export function DataTable<T extends { id: string }>({ rows, columns, pageSize = 10, empty, caption, onRowClick, rowActions, loading }: {
  rows: T[]; columns: Column<T>[]; pageSize?: number; empty?: ReactNode; caption: string; onRowClick?: (r: T) => void; rowActions?: (r: T) => ReactNode; loading?: boolean;
}) {
  const [sort, setSort] = useState<{ key: string; dir: 1 | -1 } | null>(null);
  const [page, setPage] = useState(1);
  const sorted = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    const get = col?.sortValue ?? ((r: T) => String((r as Record<string, unknown>)[sort.key] ?? ''));
    return [...rows].sort((a, b) => { const x = get(a), y = get(b); return (x > y ? 1 : x < y ? -1 : 0) * sort.dir; });
  }, [rows, sort, columns]);
  const pages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const p = Math.min(page, pages);
  const view = sorted.slice((p - 1) * pageSize, p * pageSize);

  return (
    <div>
      <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead className="border-b border-line bg-surface-2/60 text-xs uppercase tracking-wider text-muted">
            <tr>
              {columns.map((c) => {
                const active = sort?.key === c.key;
                return (
                  <th key={c.key} scope="col" aria-sort={active ? (sort!.dir === 1 ? 'ascending' : 'descending') : undefined}
                    className={cn('px-4 py-3 font-semibold', c.align === 'right' && 'text-right', c.hideOnMobile && 'hidden md:table-cell', c.className)}>
                    <button type="button" className="inline-flex items-center gap-1 uppercase hover:text-fg" onClick={() => setSort(active && sort!.dir === -1 ? null : { key: c.key, dir: active ? -1 : 1 })}>
                      {c.header}{active ? (sort!.dir === 1 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ChevronsUpDown className="h-3 w-3 opacity-40" />}
                    </button>
                  </th>
                );
              })}
              {rowActions && <th scope="col" className="px-4 py-3 text-right font-semibold">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {loading && Array.from({ length: 5 }, (_, i) => <tr key={i}><td colSpan={columns.length + 1} className="px-4 py-3"><div className="skeleton h-5" /></td></tr>)}
            {!loading && view.map((r) => (
              <tr key={r.id} className={cn('transition-colors hover:bg-surface-2/50', onRowClick && 'cursor-pointer')} onClick={onRowClick ? () => onRowClick(r) : undefined}>
                {columns.map((c) => (
                  <td key={c.key} className={cn('px-4 py-3 align-middle', c.align === 'right' && 'text-right tabular', c.hideOnMobile && 'hidden md:table-cell', c.className)}>
                    {c.render ? c.render(r) : String((r as Record<string, unknown>)[c.key] ?? '—')}
                  </td>
                ))}
                {rowActions && <td className="px-4 py-2 text-right" onClick={(e) => e.stopPropagation()}><div className="flex justify-end gap-1">{rowActions(r)}</div></td>}
              </tr>
            ))}
            {!loading && view.length === 0 && (
              <tr><td colSpan={columns.length + 1} className="px-4 py-12 text-center text-muted">{empty ?? 'No records match these filters.'}</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
        <p className="text-xs text-muted tabular">{sorted.length ? `Showing ${(p - 1) * pageSize + 1}–${Math.min(p * pageSize, sorted.length)} of ${sorted.length}` : '0 records'}</p>
        <Pagination page={p} pages={pages} onChange={setPage} />
      </div>
    </div>
  );
}
