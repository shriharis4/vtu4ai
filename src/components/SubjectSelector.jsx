import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { SCHEMES, BRANCHES, SEMESTERS, getSubjects } from '../data/academics';
import { useProfile } from '../context/ProfileContext';

// A single editable pill with a popover list of options.
function Pill({ label, value, options, onSelect }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDocClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onEsc = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="tap-target flex items-center gap-2 rounded-full border border-border bg-elevated px-3 py-1.5 text-sm outline-none hover:border-accent-from/60"
      >
        <span className="text-muted">{label}</span>
        <span className="font-medium text-text">{value ?? '—'}</span>
        <ChevronDown size={14} className="text-muted" aria-hidden="true" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute left-0 top-full z-30 mt-2 max-h-64 w-56 overflow-auto rounded-xl border border-border bg-elevated p-1 shadow-glow"
          >
            {options.map((o) => (
              <li key={o.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={o.id === value}
                  onClick={() => {
                    onSelect(o.id);
                    setOpen(false);
                  }}
                  className={`block w-full truncate rounded-lg px-3 py-2 text-left text-sm outline-none hover:bg-surface ${
                    o.id === value ? 'text-accent-to' : 'text-text'
                  }`}
                  title={o.label}
                >
                  {o.label}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Pill bar showing Scheme · Branch · Sem · Subject. Each pill edits the profile.
 * Subjects cascade from the current scheme/branch/semester selection.
 */
export default function SubjectSelector() {
  const { profile, updateProfile } = useProfile();
  const { scheme, branch, semester, subjectCode } = profile || {};
  const subjects = scheme && branch && semester ? getSubjects(scheme, branch, semester) : [];
  const activeSubject = subjects.find((s) => s.code === subjectCode);

  // Ensure a subject is always selected once the cascade is valid.
  useEffect(() => {
    if (subjects.length && !activeSubject) {
      updateProfile({ subjectCode: subjects[0].code });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheme, branch, semester]);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Pill
        label="Scheme"
        value={scheme}
        options={SCHEMES.map((s) => ({ id: s.id, label: s.label }))}
        onSelect={(id) => updateProfile({ scheme: id, subjectCode: null })}
      />
      <Pill
        label="Branch"
        value={branch}
        options={BRANCHES.map((b) => ({ id: b.id, label: b.id }))}
        onSelect={(id) => updateProfile({ branch: id, subjectCode: null })}
      />
      <Pill
        label="Sem"
        value={semester}
        options={SEMESTERS.map((n) => ({ id: n, label: `Sem ${n}` }))}
        onSelect={(id) => updateProfile({ semester: id, subjectCode: null })}
      />
      <Pill
        label="Subject"
        value={activeSubject ? activeSubject.code : '—'}
        options={subjects.map((s) => ({ id: s.code, label: `${s.code} · ${s.name}` }))}
        onSelect={(id) => updateProfile({ subjectCode: id })}
      />
      {activeSubject && (
        <span className="hidden text-sm text-muted sm:inline">{activeSubject.name}</span>
      )}
    </div>
  );
}
