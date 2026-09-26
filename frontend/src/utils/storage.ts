/** Storage wrappers that never throw (private mode, blocked storage, sandboxed frames). */
export const safeSession = {
  get(key: string) { try { return window.sessionStorage.getItem(key); } catch { return null; } },
  set(key: string, v: string) { try { window.sessionStorage.setItem(key, v); } catch { /* ignore */ } },
  remove(key: string) { try { window.sessionStorage.removeItem(key); } catch { /* ignore */ } },
};
