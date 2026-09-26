/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_ROUTER_MODE?: 'browser' | 'hash';
  readonly VITE_PAYMENT_PUBLIC_KEY?: string;
  readonly VITE_SITE_URL?: string;
}
