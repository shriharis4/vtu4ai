import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, X, Undo2 } from 'lucide-react';

const ToastContext = createContext(null);

const ICONS = {
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Info,
};
const ICON_COLOR = {
  success: 'text-success',
  warning: 'text-warning',
  info: 'text-accent-to',
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  // toast({ message, type, duration, action: { label, onClick } })
  const toast = useCallback(
    ({ message, type = 'info', duration = 4000, action } = {}) => {
      const id = `t_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev, { id, message, type, action }]);
      timers.current[id] = setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
        delete timers.current[id];
      }, duration);
      return id;
    },
    []
  );

  useEffect(() => () => Object.values(timers.current).forEach(clearTimeout), []);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      {createPortal(
        <div
          className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4 md:bottom-6"
          aria-live="polite"
          aria-atomic="false"
        >
          <AnimatePresence>
            {toasts.map((t) => {
              const Icon = ICONS[t.type] || Info;
              return (
                <motion.div
                  key={t.id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-card border border-border bg-elevated px-4 py-3 shadow-glow"
                  role="status"
                >
                  <Icon size={18} className={ICON_COLOR[t.type]} aria-hidden="true" />
                  <span className="flex-1 text-sm text-text">{t.message}</span>
                  {t.action && (
                    <button
                      type="button"
                      onClick={() => {
                        t.action.onClick();
                        dismiss(t.id);
                      }}
                      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold text-accent-to outline-none hover:underline"
                    >
                      <Undo2 size={15} aria-hidden="true" />
                      {t.action.label}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => dismiss(t.id)}
                    aria-label="Dismiss notification"
                    className="tap-target -mr-2 grid place-items-center rounded-lg text-muted outline-none hover:text-text"
                  >
                    <X size={16} aria-hidden="true" />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
