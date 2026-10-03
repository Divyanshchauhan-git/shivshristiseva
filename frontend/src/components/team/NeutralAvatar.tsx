import { useState } from 'react';
import { User } from 'lucide-react';
import { cn } from '@/utils/format';

interface NeutralAvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'rounded';
  className?: string;
  ringClass?: string;
  isSenior?: boolean;
}

const sizeClasses = {
  sm: 'h-14 w-14 text-sm',
  md: 'h-24 w-24 text-base',
  lg: 'h-32 w-32 sm:h-36 sm:w-36 text-lg',
  xl: 'h-40 w-40 sm:h-48 sm:w-48 text-xl',
};

const iconSizes = {
  sm: 'h-7 w-7',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
  xl: 'h-20 w-20',
};

/**
 * NeutralAvatar displays either a verified photograph or a dignified,
 * professional neutral silhouette/avatar with NGO brand styling.
 */
export function NeutralAvatar({
  src,
  name,
  size = 'md',
  shape = 'circle',
  className,
  ringClass,
  isSenior = false,
}: NeutralAvatarProps) {
  const [imageError, setImageError] = useState(false);
  const showImage = Boolean(src && !imageError);

  const roundedClass = shape === 'circle' ? 'rounded-full' : 'rounded-2xl sm:rounded-3xl';

  return (
    <div
      className={cn(
        'relative mx-auto flex shrink-0 items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]',
        sizeClasses[size],
        roundedClass,
        isSenior
          ? 'ring-4 ring-amber-400/40 shadow-glow bg-gradient-to-b from-[#0F3D44] via-[#0B3B3E] to-[#072427]'
          : 'ring-2 ring-line bg-surface-2 shadow-soft',
        ringClass,
        className
      )}
    >
      {showImage ? (
        <img
          src={src}
          alt={name}
          onError={() => setImageError(true)}
          className={cn('h-full w-full object-cover object-top', roundedClass)}
          loading="lazy"
        />
      ) : (
        <div className="relative flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-brand-soft/80 via-surface-2 to-surface p-2 text-center select-none">
          {/* Subtle decorative background pattern */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: 'radial-gradient(circle at 50% 40%, rgb(var(--brand)) 1.5px, transparent 1.5px)',
              backgroundSize: '12px 12px',
            }}
            aria-hidden="true"
          />

          {/* Neutral Professional Silhouette */}
          <div
            className={cn(
              'relative z-10 flex items-center justify-center rounded-full transition-transform',
              isSenior
                ? 'bg-amber-400/20 text-amber-300'
                : 'bg-brand/10 text-brand-text'
            )}
          >
            <User className={cn(iconSizes[size], 'stroke-[1.5]')} aria-hidden="true" />
          </div>

          {/* Discreet label for placeholders */}
          <span className="relative z-10 mt-1 block truncate text-[0.65rem] font-medium uppercase tracking-wider text-muted/80">
            Profile Photo
          </span>
        </div>
      )}
    </div>
  );
}
