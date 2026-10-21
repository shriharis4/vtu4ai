import { useId, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Repeat2 } from 'lucide-react';
import Chip from './Chip';

// A single previous-year question. Click to expand the worked answer.
export default function PyqCard({ pyq }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <article className="card transition-shadow hover:shadow-glow">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-start justify-between gap-3 text-left outline-none"
      >
        <span className="text-sm font-medium text-text">{pyq.question}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="mt-0.5 shrink-0 text-muted"
        >
          <ChevronDown size={18} aria-hidden="true" />
        </motion.span>
      </button>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Chip mono>{pyq.subjectCode}</Chip>
        <Chip>Module {pyq.module}</Chip>
        <Chip>{pyq.marks}</Chip>
        <span className="rounded-full border border-border bg-background px-2.5 py-0.5 text-xs text-muted">
          {pyq.year}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-accent-from/40 bg-elevated px-2.5 py-0.5 text-xs text-accent-to">
          <Repeat2 size={12} aria-hidden="true" />
          asked {pyq.askedCount}×
        </span>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="overflow-hidden"
          >
            <ol className="mt-4 space-y-2 border-t border-border pt-4">
              {pyq.answerPoints.map((p, i) => (
                <li key={i} className="flex gap-2 text-sm text-muted">
                  <span className="font-mono text-xs text-accent-to">{i + 1}.</span>
                  {p}
                </li>
              ))}
            </ol>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}
