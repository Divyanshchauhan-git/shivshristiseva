import { memo, useId } from 'react';
import type { Theme } from '@/types';
import { cn } from '@/utils/format';
import { getThemeImage } from './themeImages';

/**
 * Paper-cut landscape illustrations used in place of photographs until the NGO
 * uploads real, consented images. Deterministic per (theme, seed), so the same
 * card always shows the same scene. Pass `src` to <Media> to use a real photo.
 */
export const themePalette: Record<Theme, { sky: [string, string]; sun: string; hills: [string, string, string]; motif: 'houses' | 'trees' | 'paws' | 'rain' | 'none' }> = {
  education: { sky: ['#FDEBC8', '#F5C46E'], sun: '#EE8F2F', hills: ['#4A9A82', '#2C6E63', '#173F3E'], motif: 'houses' },
  women: { sky: ['#FBE0D5', '#F0A48C'], sun: '#FFF3DC', hills: ['#C85E45', '#923D37', '#5A2833'], motif: 'houses' },
  marriage: { sky: ['#FCE6EA', '#EDB2BD'], sun: '#F6C35B', hills: ['#C7788A', '#9A546F', '#633654'], motif: 'houses' },
  health: { sky: ['#E0F3F1', '#A5D8D3'], sun: '#FFFFFF', hills: ['#44A19C', '#2A7778', '#194E54'], motif: 'houses' },
  food: { sky: ['#FDEAC0', '#F2C265'], sun: '#D8612A', hills: ['#BE8A2F', '#8A5B24', '#553719'], motif: 'trees' },
  livelihood: { sky: ['#E6E8F7', '#B5BDE6'], sun: '#F2A541', hills: ['#5C6BB8', '#3E4A8C', '#262E58'], motif: 'houses' },
  child: { sky: ['#E6F3FB', '#ABD4EF'], sun: '#F7D35C', hills: ['#4F9DD2', '#2F74A8', '#1B4970'], motif: 'trees' },
  elderly: { sky: ['#F6E9DC', '#E2BF9E'], sun: '#FBEFD6', hills: ['#A97C57', '#7C5840', '#4E3528'], motif: 'houses' },
  animals: { sky: ['#FFE7CD', '#F7B476'], sun: '#FFF4E0', hills: ['#D27B3C', '#9A5228', '#5A301A'], motif: 'paws' },
  emergency: { sky: ['#E8EDF3', '#A9B7C6'], sun: '#F0A43A', hills: ['#667A8E', '#465668', '#29343F'], motif: 'rain' },
  environment: { sky: ['#E8F4DC', '#B5DC95'], sun: '#F7D35C', hills: ['#62A454', '#3E7D3C', '#224F27'], motif: 'trees' },
  community: { sky: ['#DDF0EB', '#9CCEC4'], sun: '#F2A541', hills: ['#328580', '#1F5F5E', '#0F3D44'], motif: 'houses' },
  volunteer: { sky: ['#FFF1D2', '#F8CF76'], sun: '#FFFFFF', hills: ['#EBA03A', '#B96F1E', '#0F3D44'], motif: 'trees' },
};

function rng(seed: number) {
  let s = (seed * 9301 + 49297) % 233280 || 1;
  return () => ((s = (s * 9301 + 49297) % 233280) / 233280);
}

function hillPath(r: () => number, base: number, amp: number, w = 400, h = 300) {
  const f1 = 0.6 + r() * 1.4, f2 = 1.8 + r() * 2.2, p1 = r() * 6.28, p2 = r() * 6.28;
  const pts: string[] = [];
  for (let x = 0; x <= w; x += 10) {
    const t = x / w;
    const y = base - amp * (0.65 * Math.sin(t * Math.PI * f1 + p1) + 0.35 * Math.sin(t * Math.PI * f2 + p2));
    pts.push(`${x},${y.toFixed(1)}`);
  }
  return { d: `M0,${h} L${pts.join(' L')} L${w},${h} Z`, yAt: (x: number) => {
    const t = x / w; return base - amp * (0.65 * Math.sin(t * Math.PI * f1 + p1) + 0.35 * Math.sin(t * Math.PI * f2 + p2));
  } };
}

interface SceneProps { theme: Theme; seed?: number; className?: string; birds?: boolean }

export const Scene = memo(function Scene({ theme, seed = 1, className, birds = true }: SceneProps) {
  const photo = getThemeImage(theme, seed);
  if (photo) {
    return (
      <img
        src={photo}
        alt=""
        loading="lazy"
        decoding="async"
        className={cn('h-full w-full object-cover', className)}
        aria-hidden="true"
      />
    );
  }

  const uid = useId().replace(/:/g, '');
  const pal = themePalette[theme];
  const r = rng(seed * 31 + theme.length * 7);
  const sunX = 70 + r() * 260, sunY = 70 + r() * 50, sunR = 34 + r() * 22;
  const back = hillPath(r, 175 + r() * 20, 26 + r() * 16);
  const mid = hillPath(r, 215 + r() * 15, 20 + r() * 14);
  const front = hillPath(r, 258 + r() * 10, 14 + r() * 10);
  const motifs = Array.from({ length: 4 + Math.floor(r() * 3) }, () => 20 + r() * 360).sort((a, b) => a - b);
  const birdList = birds ? Array.from({ length: 3 }, (_, i) => ({ x: 40 + r() * 320, y: 30 + r() * 60, s: 0.6 + r() * 0.6, i })) : [];

  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`sky${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={pal.sky[0]} />
          <stop offset="1" stopColor={pal.sky[1]} />
        </linearGradient>
        <radialGradient id={`glow${uid}`}>
          <stop offset="0" stopColor={pal.sun} stopOpacity="0.55" />
          <stop offset="1" stopColor={pal.sun} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#sky${uid})`} />
      <circle cx={sunX} cy={sunY} r={sunR * 2.4} fill={`url(#glow${uid})`} />
      <circle cx={sunX} cy={sunY} r={sunR} fill={pal.sun} />
      <circle cx={sunX} cy={sunY} r={sunR + 10} fill="none" stroke={pal.sun} strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="2 6" />
      {birdList.map((b) => (
        <path key={b.i} d={`M${b.x - 10 * b.s},${b.y} q${5 * b.s},${-6 * b.s} ${10 * b.s},0 q${5 * b.s},${-6 * b.s} ${10 * b.s},0`} fill="none" stroke={pal.hills[2]} strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" />
      ))}
      <path d={back.d} fill={pal.hills[0]} />
      <path d={back.d} fill="none" stroke="#fff" strokeOpacity="0.25" strokeWidth="1.5" transform="translate(0,-1)" />
      <path d={mid.d} fill={pal.hills[1]} />
      {pal.motif === 'houses' && motifs.map((x, i) => {
        const y = mid.yAt(x); const w = 14 + (i % 3) * 4; const h = 10 + (i % 2) * 5;
        return (
          <g key={i} transform={`translate(${x},${y - h + 3})`}>
            <rect width={w} height={h} fill={pal.sky[0]} opacity="0.9" />
            <path d={`M-3,0 L${w / 2},${-8 - (i % 2) * 3} L${w + 3},0 Z`} fill={pal.hills[2]} />
            <rect x={w / 2 - 2} y={h - 6} width="4" height="6" fill={pal.sun} />
          </g>
        );
      })}
      {pal.motif === 'trees' && motifs.map((x, i) => {
        const y = mid.yAt(x); const s = 0.8 + (i % 3) * 0.25;
        return (
          <g key={i} transform={`translate(${x},${y + 2}) scale(${s})`}>
            <rect x="-1.5" y="-14" width="3" height="14" fill={pal.hills[2]} />
            <circle cx="0" cy="-19" r="9" fill={pal.hills[0]} />
            <circle cx="-3" cy="-22" r="3" fill="#fff" fillOpacity="0.18" />
          </g>
        );
      })}
      {pal.motif === 'rain' && Array.from({ length: 28 }, (_, i) => (
        <line key={i} x1={(i * 53) % 400} y1={(i * 37) % 140} x2={((i * 53) % 400) - 6} y2={((i * 37) % 140) + 14} stroke={pal.hills[2]} strokeOpacity="0.35" strokeWidth="1.4" strokeLinecap="round" />
      ))}
      <path d={front.d} fill={pal.hills[2]} />
      <path d={front.d} fill="none" stroke="#fff" strokeOpacity="0.15" strokeWidth="1.2" transform="translate(0,-1)" />
      {pal.motif === 'paws' && motifs.slice(0, 5).map((x, i) => {
        const y = front.yAt(x) + 18 + (i % 2) * 6;
        return (
          <g key={i} transform={`translate(${x},${y}) rotate(${-20 + i * 9})`} fill={pal.sky[0]} fillOpacity="0.55">
            <ellipse cx="0" cy="3" rx="5" ry="4" />
            <circle cx="-5" cy="-3" r="1.8" /><circle cx="-1.8" cy="-6" r="1.8" /><circle cx="1.8" cy="-6" r="1.8" /><circle cx="5" cy="-3" r="1.8" />
          </g>
        );
      })}
    </svg>
  );
});
