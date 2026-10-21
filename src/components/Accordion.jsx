import { useId, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

/**
 * Accessible single accordion item with an animated height reveal.
 * Controlled or uncontrolled via `defaultOpen`.
 */
export default function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  const btnId = useId();

  return (
    <div className="overflow-hidden rounded-card border border-border bg-surface">
      <h3 className="m-0">
        <button
          id={btnId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left outline-none"
        >
          <span className="font-heading text-base font-semibold text-text">{title}</span>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="shrink-0 text-muted"
          >
            <ChevronDown size={20} aria-hidden="true" />
          </motion.span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={btnId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-0 text-muted">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
