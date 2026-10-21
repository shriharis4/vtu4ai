import { Link, useNavigate } from 'react-router-dom';
import { History as HistoryIcon, RotateCcw } from 'lucide-react';
import Chip from '../components/Chip';
import { useProfile } from '../context/ProfileContext';

// Human-friendly relative time, e.g. "5m ago", "2h ago", "3d ago".
function relativeTime(ts) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export default function History() {
  const { history } = useProfile();
  const navigate = useNavigate();

  const rerun = (q) => navigate(`/solve?q=${encodeURIComponent(q)}`);

  return (
    <section className="mx-auto max-w-4xl px-5 py-8">
      <header className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-gradient text-background">
          <HistoryIcon size={22} aria-hidden="true" />
        </span>
        <div>
          <h1 className="font-heading text-2xl font-bold">History</h1>
          <p className="text-sm text-muted">Every question you’ve solved, most recent first.</p>
        </div>
      </header>

      <div className="mt-6">
        {history.length === 0 ? (
          <div className="card flex flex-col items-center py-14 text-center">
            <HistoryIcon size={40} className="text-muted" aria-hidden="true" />
            <h2 className="mt-4 font-heading text-lg font-semibold">No history yet</h2>
            <p className="mt-1 max-w-sm text-sm text-muted">
              Questions you solve will show up here so you can revisit or re-run them.
            </p>
            <Link to="/solve" className="btn-primary mt-5">
              Solve your first question
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {history.map((h) => (
              <li
                key={`${h.id}-${h.at}`}
                className="card flex items-start justify-between gap-4"
              >
                <div className="min-w-0">
                  <p className="text-sm text-text">{h.question}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Chip mono>{h.subject.code}</Chip>
                    <Chip>Module {h.module}</Chip>
                    <Chip>{h.marks}</Chip>
                    <span className="text-xs text-muted">{relativeTime(h.at)}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => rerun(h.question)}
                  className="btn-secondary shrink-0 px-3 py-2 text-sm"
                >
                  <RotateCcw size={16} aria-hidden="true" />
                  Re-run
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
