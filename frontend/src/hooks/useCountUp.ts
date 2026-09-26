import { useEffect, useState } from 'react';
import { prefersReducedMotion } from './useInView';

/** Animates 0 → target once `start` becomes true. Shows the final value immediately with reduced motion. */
export function useCountUp(target: number, start: boolean, duration = 1400) {
  const [value, setValue] = useState(target);
  useEffect(() => {
    if (!start || prefersReducedMotion()) { setValue(target); return; }
    let raf = 0; const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    setValue(0); raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, start, duration]);
  return value;
}
