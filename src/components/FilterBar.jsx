import { SCHEMES, BRANCHES, SEMESTERS, getSubjects } from '../data/academics';
import { PYQ_YEARS, PYQ_MODULES, PYQ_MARKS } from '../data/mockPyqs';
import { X } from 'lucide-react';

// A single labelled select.
function Select({ label, value, onChange, children }) {
  return (
    <label className="flex flex-col gap-1 text-xs">
      <span className="text-muted">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="tap-target rounded-xl border border-border bg-background px-3 py-2 text-sm text-text outline-none focus:border-accent-from"
      >
        {children}
      </select>
    </label>
  );
}

/**
 * Filter controls for the PYQ bank. `filters` is the current state object and
 * `onChange(key, value)` updates one field. Subjects cascade from the current
 * scheme/branch/semester when all three are set.
 */
export default function FilterBar({ filters, onChange, onClear }) {
  const { scheme, branch, semester } = filters;
  const subjects =
    scheme && branch && semester ? getSubjects(scheme, branch, semester) : [];
  const hasAny = Object.values(filters).some(Boolean);

  return (
    <div className="card">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <Select label="Scheme" value={scheme} onChange={(v) => onChange('scheme', v)}>
          <option value="">Any</option>
          {SCHEMES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </Select>

        <Select label="Branch" value={branch} onChange={(v) => onChange('branch', v)}>
          <option value="">Any</option>
          {BRANCHES.map((b) => (
            <option key={b.id} value={b.id}>
              {b.id}
            </option>
          ))}
        </Select>

        <Select label="Semester" value={semester} onChange={(v) => onChange('semester', v)}>
          <option value="">Any</option>
          {SEMESTERS.map((n) => (
            <option key={n} value={n}>
              Sem {n}
            </option>
          ))}
        </Select>

        <Select label="Subject" value={filters.subject} onChange={(v) => onChange('subject', v)}>
          <option value="">Any</option>
          {subjects.map((s) => (
            <option key={s.code} value={s.code}>
              {s.code}
            </option>
          ))}
        </Select>

        <Select label="Year" value={filters.year} onChange={(v) => onChange('year', v)}>
          <option value="">Any</option>
          {PYQ_YEARS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </Select>

        <Select label="Module" value={filters.module} onChange={(v) => onChange('module', v)}>
          <option value="">Any</option>
          {PYQ_MODULES.map((m) => (
            <option key={m} value={m}>
              Module {m}
            </option>
          ))}
        </Select>

        <Select label="Marks" value={filters.marks} onChange={(v) => onChange('marks', v)}>
          <option value="">Any</option>
          {PYQ_MARKS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </Select>

        <div className="flex items-end">
          <button
            type="button"
            onClick={onClear}
            disabled={!hasAny}
            className="btn-secondary w-full px-3 py-2 text-sm disabled:opacity-40"
          >
            <X size={16} aria-hidden="true" />
            Clear all
          </button>
        </div>
      </div>
    </div>
  );
}
