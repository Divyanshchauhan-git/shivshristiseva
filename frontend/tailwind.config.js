/** @type {import('tailwindcss').Config} */
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`;
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['variant', ['@media (prefers-color-scheme: dark) { &:is(:root:not([data-theme="light"]) *) }', '&:is([data-theme="dark"] *)']],
  theme: {
    extend: {
      colors: {
        bg: v('bg'),
        surface: v('surface'),
        'surface-2': v('surface-2'),
        line: v('line'),
        fg: v('fg'),
        muted: v('muted'),
        brand: { DEFAULT: v('brand'), fg: v('brand-fg'), soft: v('brand-soft'), text: v('brand-text') },
        marigold: { DEFAULT: v('marigold'), fg: v('marigold-fg'), soft: v('marigold-soft') },
        leaf: { DEFAULT: v('leaf'), soft: v('leaf-soft') },
        hibiscus: { DEFAULT: v('hibiscus'), soft: v('hibiscus-soft') },
        ok: v('ok'),
        warn: v('warn'),
        danger: v('danger'),
      },
      fontFamily: {
        display: ['"Young Serif"', 'Georgia', '"Times New Roman"', 'serif'],
        sans: ['Figtree', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        deva: ['"Tiro Devanagari Hindi"', '"Noto Serif Devanagari"', 'serif'],
      },
      borderRadius: { xl: '1rem', '2xl': '1.35rem', '3xl': '1.85rem' },
      boxShadow: {
        soft: '0 2px 8px -2px rgba(11, 59, 60, 0.05), 0 10px 24px -6px rgba(11, 59, 60, 0.08)',
        lift: '0 8px 16px -4px rgba(11, 59, 60, 0.08), 0 24px 48px -12px rgba(11, 59, 60, 0.18)',
        glow: '0 0 25px -4px rgba(245, 158, 11, 0.45)',
        'emerald-glow': '0 0 25px -4px rgba(16, 149, 89, 0.35)',
      },
      maxWidth: { page: '78rem', prose: '44rem' },
      keyframes: {
        rise: { from: { transform: 'translateY(14px)', opacity: '0.001' }, to: { transform: 'none', opacity: '1' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
        shimmer: { from: { backgroundPosition: '-400px 0' }, to: { backgroundPosition: '400px 0' } },
        pulseSlow: { '0%, 100%': { opacity: '1', transform: 'scale(1)' }, '50%': { opacity: '0.85', transform: 'scale(1.03)' } },
      },
      animation: {
        rise: 'rise .7s cubic-bezier(.2,.7,.2,1) both',
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 1.4s linear infinite',
        pulseSlow: 'pulseSlow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
