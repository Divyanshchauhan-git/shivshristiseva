import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/format';

export type ButtonVariant = 'primary' | 'donate' | 'secondary' | 'ghost' | 'danger' | 'light';
export type ButtonSize = 'sm' | 'md' | 'lg';

const base = 'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 active:translate-y-px whitespace-nowrap tracking-wide';
const variants: Record<ButtonVariant, string> = {
  primary: 'bg-gradient-to-r from-[#0B3B3E] to-[#14565C] text-white hover:brightness-110 shadow-soft hover:shadow-lift',
  donate: 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-stone-950 font-bold shadow-glow hover:brightness-105 hover:shadow-lift hover:-translate-y-0.5 btn-donate-pulse',
  secondary: 'border border-line bg-surface text-fg hover:border-brand-text/40 hover:bg-brand-soft/50 shadow-sm hover:shadow-soft',
  ghost: 'text-brand-text hover:bg-brand-soft/70',
  danger: 'bg-gradient-to-r from-rose-600 to-red-600 text-white hover:brightness-110 shadow-soft',
  light: 'bg-white text-[#0B3B3E] font-semibold hover:bg-white/95 shadow-soft hover:shadow-lift',
};
const sizes: Record<ButtonSize, string> = { sm: 'h-9 px-4 text-xs', md: 'h-11 px-5 text-[0.92rem]', lg: 'h-12 px-7 text-sm sm:text-base' };

export const buttonClass = (variant: ButtonVariant = 'primary', size: ButtonSize = 'md', extra?: string) => cn(base, variants[variant], sizes[size], extra);

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> { variant?: ButtonVariant; size?: ButtonSize; loading?: boolean; icon?: ReactNode }

export const Button = forwardRef<HTMLButtonElement, Props>(function Button({ variant = 'primary', size = 'md', loading, icon, className, children, disabled, type = 'button', ...rest }, ref) {
  return (
    <button ref={ref} type={type} className={buttonClass(variant, size, className)} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : icon}
      {children}
    </button>
  );
});

export function ButtonLink({ variant = 'primary', size = 'md', className, icon, children, ...rest }: LinkProps & { variant?: ButtonVariant; size?: ButtonSize; icon?: ReactNode }) {
  return (
    <Link className={buttonClass(variant, size, className)} {...rest}>
      {icon}{children}
    </Link>
  );
}
