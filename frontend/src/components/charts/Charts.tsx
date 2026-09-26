import { useState } from 'react';
import { num } from '@/utils/format';

/**
 * Lightweight, dependency-free SVG charts. Single-series by design (the title
 * names the series), one scale per chart, recessive grid, per-mark hover/focus
 * tooltip, and a visually hidden data table for screen readers.
 */
interface Datum { label: string; value: number }

function niceMax(v: number) {
  if (v <= 0) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p;
}

function SrTable({ data, caption, unit }: { data: Datum[]; caption: string; unit: string }) {
  return (
    <div className="sr-only"><table><caption>{caption}</caption>
      <thead><tr><th scope="col">Category</th><th scope="col">{unit}</th></tr></thead>
      <tbody>{data.map((d) => <tr key={d.label}><th scope="row">{d.label}</th><td>{d.value}</td></tr>)}</tbody>
    </table></div>
  );
}

/** Vertical columns, e.g. a metric by year. */
export function ColumnChart({ data, caption, unit }: { data: Datum[]; caption: string; unit: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 560, H = 260, L = 48, R = 12, T = 16, B = 32;
  const max = niceMax(Math.max(...data.map((d) => d.value)));
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * max);
  const bw = (W - L - R) / data.length;
  const barW = Math.min(56, bw * 0.56);
  const y = (v: number) => T + (H - T - B) * (1 - v / max);
  return (
    <figure className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full overflow-visible" role="img" aria-label={caption}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={L} x2={W - R} y1={y(t)} y2={y(t)} stroke="rgb(var(--line))" strokeWidth={t === 0 ? 1.5 : 1} strokeDasharray={t === 0 ? undefined : '3 4'} />
            <text x={L - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill="rgb(var(--muted))" className="tabular">{num(Math.round(t))}</text>
          </g>
        ))}
        {data.map((d, i) => {
          const x = L + bw * i + (bw - barW) / 2, top = y(d.value), h = y(0) - top;
          const r = Math.min(4, h / 2);
          return (
            <g key={d.label} tabIndex={0} role="img" aria-label={`${d.label}: ${num(d.value)} ${unit}`}
              onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(i)} onBlur={() => setHover(null)} className="outline-none">
              <rect x={L + bw * i} y={T} width={bw} height={H - T - B} fill="transparent" />
              <path d={`M${x},${y(0)} V${top + r} Q${x},${top} ${x + r},${top} H${x + barW - r} Q${x + barW},${top} ${x + barW},${top + r} V${y(0)} Z`}
                fill={i === data.length - 1 ? 'rgb(var(--marigold))' : 'rgb(var(--brand-text))'} opacity={hover === null || hover === i ? 1 : 0.45} className="transition-opacity" />
              <text x={x + barW / 2} y={H - 10} textAnchor="middle" fontSize="12" fill="rgb(var(--muted))">{d.label}</text>
            </g>
          );
        })}
      </svg>
      {hover !== null && (
        <div className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-lg border border-line bg-surface px-3 py-1.5 text-xs shadow-lift"
          style={{ left: `${((L + bw * hover + bw / 2) / W) * 100}%`, top: `${(y(data[hover].value) / H) * 100}%`, marginTop: -8 }}>
          <span className="font-semibold">{data[hover].label}</span> · <span className="tabular">{num(data[hover].value)}</span> {unit}
        </div>
      )}
      <SrTable data={data} caption={caption} unit={unit} />
    </figure>
  );
}

/** Horizontal bars, sorted, with direct value labels. Good for category comparisons. */
export function BarList({ data, caption, unit }: { data: Datum[]; caption: string; unit: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <figure>
      <ul className="space-y-3" aria-label={caption}>
        {data.map((d) => (
          <li key={d.label} className="grid grid-cols-[minmax(0,9.5rem)_1fr_auto] items-center gap-3 text-sm sm:grid-cols-[minmax(0,12rem)_1fr_auto]">
            <span className="truncate text-muted" title={d.label}>{d.label}</span>
            <span className="h-3 rounded-full bg-surface-2" aria-hidden="true">
              <span className="block h-full rounded-full bg-brand-text transition-[width] duration-700" style={{ width: `${(d.value / max) * 100}%` }} />
            </span>
            <span className="w-16 text-right font-semibold tabular">{num(d.value)}</span>
          </li>
        ))}
      </ul>
      <SrTable data={data} caption={caption} unit={unit} />
    </figure>
  );
}

/** Mini area sparkline for dashboard tiles. */
export function Sparkline({ values, label }: { values: number[]; label: string }) {
  const W = 120, H = 36, max = Math.max(...values), min = Math.min(...values);
  const pts = values.map((v, i) => [(i / (values.length - 1)) * W, H - 4 - ((v - min) / (max - min || 1)) * (H - 8)]);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const last = pts[pts.length - 1];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-9 w-28" role="img" aria-label={label}>
      <path d={`${line} L${W},${H} L0,${H} Z`} fill="rgb(var(--brand-text) / 0.12)" />
      <path d={line} fill="none" stroke="rgb(var(--brand-text))" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={last[0]} cy={last[1]} r="3.5" fill="rgb(var(--marigold))" stroke="rgb(var(--surface))" strokeWidth="2" />
    </svg>
  );
}
