'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

export interface ToastMethods {
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

interface ToastContextValue {
  toast: ToastMethods;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (type: ToastType, title: string, description?: string) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev, { id, type, title, description }]);

      // Auto dismiss after 4 seconds
      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast],
  );

  const toast = useMemo(
    () => ({
      success: (title: string, description?: string) => addToast('success', title, description),
      error: (title: string, description?: string) => addToast('error', title, description),
      info: (title: string, description?: string) => addToast('info', title, description),
    }),
    [addToast],
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast Notification Container */}
      <div
        aria-live="polite"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        {toasts.map((item) => (
          <div
            key={item.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-lg transition-all animate-in fade-in slide-in-from-bottom-2 duration-200 ${
              item.type === 'success'
                ? 'bg-white border-emerald-200 text-slate-900 shadow-emerald-500/10'
                : item.type === 'error'
                ? 'bg-white border-rose-200 text-slate-900 shadow-rose-500/10'
                : 'bg-white border-sky-200 text-slate-900 shadow-sky-500/10'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {item.type === 'success' && (
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              )}
              {item.type === 'error' && (
                <AlertCircle className="h-5 w-5 text-rose-600" />
              )}
              {item.type === 'info' && <Info className="h-5 w-5 text-sky-600" />}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold leading-tight text-slate-900">{item.title}</p>
              {item.description && (
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>

            <button
              onClick={() => removeToast(item.id)}
              className="shrink-0 text-slate-400 hover:text-slate-600 transition p-0.5 rounded cursor-pointer"
              title="Dismiss notification"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a <ToastProvider>');
  }
  return {
    ...context.toast,
    toast: context.toast,
  };
}
