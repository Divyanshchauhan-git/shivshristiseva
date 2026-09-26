import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { CheckCircle2, Info, XCircle, X } from 'lucide-react';
import { cn } from '@/utils/format';

type ToastTone = 'success' | 'error' | 'info';
interface ToastItem { id: number; tone: ToastTone; message: string }
const Ctx = createContext<(message: string, tone?: ToastTone) => void>(() => {});
export const useToast = () => useContext(Ctx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const dismiss = (id: number) => setItems((xs) => xs.filter((x) => x.id !== id));
  const push = useCallback((message: string, tone: ToastTone = 'success') => {
    const id = Date.now() + Math.random();
    setItems((xs) => [...xs.slice(-2), { id, tone, message }]);
    setTimeout(() => dismiss(id), 4500);
  }, []);
  return (
    <Ctx.Provider value={push}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] z-[90] flex flex-col items-center gap-2 px-4">
        {items.map((t) => {
          const I = t.tone === 'success' ? CheckCircle2 : t.tone === 'error' ? XCircle : Info;
          return (
            <div key={t.id} role={t.tone === 'error' ? 'alert' : 'status'} className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl bg-[#0F2B30] px-4 py-3 text-sm text-white shadow-lift animate-rise">
              <I className={cn('mt-0.5 h-5 w-5 shrink-0', t.tone === 'success' ? 'text-[#7fd6a6]' : t.tone === 'error' ? 'text-[#ff9b8c]' : 'text-[#F4B154]')} aria-hidden="true" />
              <p className="flex-1">{t.message}</p>
              <button onClick={() => dismiss(t.id)} className="-m-1 rounded-full p-1 text-white/70 hover:text-white" aria-label="Dismiss notification"><X className="h-4 w-4" /></button>
            </div>
          );
        })}
      </div>
    </Ctx.Provider>
  );
}
