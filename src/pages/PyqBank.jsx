import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Library, SearchX } from 'lucide-react';
import FilterBar from '../components/FilterBar';
import PyqCard from '../components/PyqCard';
import Skeleton from '../components/Skeleton';
import { getPyqs } from '../api/client';

const EMPTY = {
  scheme: '',
  branch: '',
  semester: '',
  subject: '',
  year: '',
  module: '',
  marks: '',
};

// Build the initial filter state from URL query params (set by the solver's
// "Similar PYQs" link, e.g. /pyqs?subject=XXX501&module=3).
function fromParams(params) {
  const next = { ...EMPTY };
  Object.keys(EMPTY).forEach((k) => {
    const v = params.get(k);
    if (v) next[k] = v;
  });
  return next;
}

export default function PyqBank() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(() => fromParams(searchParams));
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);

  // Fetch whenever filters change; also keep the URL in sync.
  useEffect(() => {
    let active = true;
    setLoading(true);

    // Reflect non-empty filters in the URL.
    const sp = {};
    Object.entries(filters).forEach(([k, v]) => {
      if (v) sp[k] = v;
    });
    setSearchParams(sp, { replace: true });

    getPyqs(filters).then((data) => {
      if (active) {
        setResults(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const onChange = (key, value) => setFilters((f) => ({ ...f, [key]: value }));
  const onClear = () => setFilters(EMPTY);

  return (
    <section className="mx-auto max-w-6xl px-5 py-8">
      <header className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-gradient text-background">
          <Library size={22} aria-hidden="true" />
        </span>
        <div>
          <h1 className="font-heading text-2xl font-bold">PYQ bank</h1>
          <p className="text-sm text-muted">
            Previous-year questions with worked answers. Filter by subject, module and more.
          </p>
        </div>
      </header>

      <div className="mt-6">
        <FilterBar filters={filters} onChange={onChange} onClear={onClear} />
      </div>

      {/* Results */}
      <div className="mt-6">
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-14" />
                </div>
              </div>
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="card flex flex-col items-center py-14 text-center">
            <SearchX size={40} className="text-muted" aria-hidden="true" />
            <h2 className="mt-4 font-heading text-lg font-semibold">No questions found</h2>
            <p className="mt-1 max-w-sm text-sm text-muted">
              No previous-year questions match these filters. Try widening or clearing them.
            </p>
            <button type="button" onClick={onClear} className="btn-secondary mt-5">
              Reset filters
            </button>
          </div>
        ) : (
          <>
            <p className="mb-3 text-sm text-muted">
              {results.length} question{results.length === 1 ? '' : 's'}
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {results.map((pyq) => (
                <PyqCard key={pyq.id} pyq={pyq} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
