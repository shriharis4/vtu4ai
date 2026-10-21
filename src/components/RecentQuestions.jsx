import { Clock, RotateCcw } from 'lucide-react';
import { useProfile } from '../context/ProfileContext';

// Last 5 solved questions. Clicking re-runs one via the onRerun callback.
export default function RecentQuestions({ onRerun }) {
  const { history } = useProfile();
  const recent = history.slice(0, 5);

  return (
    <div className="card">
      <h2 className="flex items-center gap-2 font-heading text-base font-semibold">
        <Clock size={16} className="text-accent-to" aria-hidden="true" />
        Recent questions
      </h2>

      {recent.length === 0 ? (
        <p className="mt-3 text-sm text-muted">
          Your recent questions will appear here once you solve one.
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {recent.map((h) => (
            <li key={h.id}>
              <button
                type="button"
                onClick={() => onRerun?.(h)}
                className="group flex w-full items-start gap-2 rounded-lg border border-border bg-background px-3 py-2 text-left outline-none hover:border-accent-from/50"
              >
                <RotateCcw
                  size={14}
                  className="mt-0.5 shrink-0 text-muted group-hover:text-accent-to"
                  aria-hidden="true"
                />
                <span className="line-clamp-2 text-xs text-text">{h.question}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
