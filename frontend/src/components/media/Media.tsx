import type { Theme } from '@/types';
import { cn } from '@/utils/format';
import { Scene } from './Scene';
import { themeIcon } from './Icon';
import { getThemeImage } from './themeImages';

interface MediaProps {
  theme: Theme;
  seed?: number;
  /** Real image URL (from object storage / CDN). When absent, theme photo is shown. */
  src?: string;
  alt: string;
  className?: string;
  ratio?: string;
  badge?: boolean;
  priority?: boolean;
}

/**
 * Image slot. Uses authentic Indian NGO photography with subtle hover zoom and accessible fallback.
 */
export function Media({ theme, seed = 1, src, alt, className, ratio = 'aspect-[4/3]', badge = false, priority }: MediaProps) {
  const I = themeIcon[theme];
  const photo = src || getThemeImage(theme, seed);

  return (
    <div className={cn('group relative w-full max-w-full overflow-hidden bg-surface-2', ratio, className)}>
      {photo ? (
        <img
          src={photo}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      ) : (
        <>
          <Scene theme={theme} seed={seed} className="absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-105" />
          <span className="sr-only">{alt}</span>
        </>
      )}
      {badge && (
        <span className="absolute left-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/95 text-[#0B3B3E] shadow-soft backdrop-blur-md">
          <I className="h-5 w-5" aria-hidden="true" />
        </span>
      )}
    </div>
  );
}
