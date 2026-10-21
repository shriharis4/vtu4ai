import { motion } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';

export const SOLVE_STEPS = ['Reading question', 'Finding notes', 'Writing answer'];

/**
 * Horizontal 3-step progress strip.
 * `current` is the index of the in-progress step; steps before it are done.
 * When `current >= steps.length` all steps are complete.
 */
export default function ProgressSteps({ steps = SOLVE_STEPS, current = 0 }) {
  return (
    <ol className="flex items-center gap-2" aria-label="Progress">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex flex-1 items-center gap-2">
            <span
              className={[
                'grid h-6 w-6 shrink-0 place-items-center rounded-full border text-xs',
                done
                  ? 'border-transparent bg-accent-gradient text-background'
                  : active
                    ? 'border-accent-from text-accent-to'
                    : 'border-border text-muted',
              ].join(' ')}
            >
              {done ? (
                <Check size={14} aria-hidden="true" />
              ) : active ? (
                <Loader2 size={14} className="animate-spin" aria-hidden="true" />
              ) : (
                i + 1
              )}
            </span>
            <span
              className={`hidden text-xs sm:inline ${
                done || active ? 'text-text' : 'text-muted'
              }`}
            >
              {label}
            </span>
            {i < steps.length - 1 && (
              <span className="relative mx-1 h-0.5 flex-1 rounded bg-border">
                <motion.span
                  className="absolute inset-y-0 left-0 rounded bg-accent-gradient"
                  initial={{ width: '0%' }}
                  animate={{ width: done ? '100%' : '0%' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
