import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookmarkCheck, Search, Download, Trash2 } from 'lucide-react';
import Accordion from '../components/Accordion';
import Chip from '../components/Chip';
import { useProfile } from '../context/ProfileContext';
import { useToast } from '../components/Toast';

// Serialise all notes to a plain-text document for download.
function buildExport(notes) {
  return notes
    .map(
      (n) =>
        `${n.subject.name} (${n.subject.code}) — Module ${n.module}, ${n.marks}\n` +
        n.answerPoints.map((p, i) => `  ${i + 1}. ${p}`).join('\n')
    )
    .join('\n\n----------------------------------------\n\n');
}

export default function Notes() {
  const { notes, removeNote, restoreNote } = useProfile();
  const { toast } = useToast();
  const [query, setQuery] = useState('');

  // Filter by subject name/code or answer text, then group by subject code.
  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = notes.filter((n) => {
      if (!q) return true;
      return (
        n.subject.name.toLowerCase().includes(q) ||
        n.subject.code.toLowerCase().includes(q) ||
        n.answerPoints.some((p) => p.toLowerCase().includes(q))
      );
    });
    const map = new Map();
    filtered.forEach((n) => {
      const key = n.subject.code;
      if (!map.has(key)) map.set(key, { subject: n.subject, items: [] });
      map.get(key).items.push(n);
    });
    return [...map.values()];
  }, [notes, query]);

  const handleDelete = (note) => {
    removeNote(note.id);
    toast({
      message: 'Note deleted',
      type: 'info',
      action: { label: 'Undo', onClick: () => restoreNote(note) },
    });
  };

  const handleExport = () => {
    const blob = new Blob([buildExport(notes)], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vtu-solve-notes.txt';
    a.click();
    URL.revokeObjectURL(url);
    toast({ message: 'Notes exported', type: 'success' });
  };

  return (
    <section className="mx-auto max-w-4xl px-5 py-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-gradient text-background">
            <BookmarkCheck size={22} aria-hidden="true" />
          </span>
          <div>
            <h1 className="font-heading text-2xl font-bold">My notes</h1>
            <p className="text-sm text-muted">Answers you’ve saved, grouped by subject.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleExport}
          disabled={notes.length === 0}
          className="btn-secondary disabled:opacity-40"
        >
          <Download size={18} aria-hidden="true" />
          Export all
        </button>
      </header>

      {/* Search */}
      <div className="relative mt-6">
        <Search
          size={18}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
        <label htmlFor="note-search" className="sr-only">
          Search notes
        </label>
        <input
          id="note-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your notes…"
          className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-text outline-none focus:border-accent-from"
        />
      </div>

      {/* Content */}
      <div className="mt-6 space-y-3">
        {notes.length === 0 ? (
          <div className="card flex flex-col items-center py-14 text-center">
            <BookmarkCheck size={40} className="text-muted" aria-hidden="true" />
            <h2 className="mt-4 font-heading text-lg font-semibold">No saved notes yet</h2>
            <p className="mt-1 max-w-sm text-sm text-muted">
              Solve a question and tap “Save to notes” to keep it here for revision.
            </p>
            <Link to="/solve" className="btn-primary mt-5">
              Go to solver
            </Link>
          </div>
        ) : groups.length === 0 ? (
          <p className="card text-center text-sm text-muted">
            No notes match “{query}”.
          </p>
        ) : (
          groups.map((g) => (
            <Accordion
              key={g.subject.code}
              title={`${g.subject.name} (${g.items.length})`}
              defaultOpen
            >
              <ul className="space-y-3">
                {g.items.map((n) => (
                  <li key={n.id} className="rounded-xl border border-border bg-background p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Chip>Module {n.module}</Chip>
                        <Chip>{n.marks}</Chip>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDelete(n)}
                        aria-label="Delete note"
                        className="tap-target grid place-items-center rounded-lg text-muted outline-none hover:text-danger"
                      >
                        <Trash2 size={16} aria-hidden="true" />
                      </button>
                    </div>
                    <ol className="mt-3 space-y-1.5">
                      {n.answerPoints.map((p, i) => (
                        <li key={i} className="flex gap-2 text-sm text-text">
                          <span className="font-mono text-xs text-accent-to">{i + 1}.</span>
                          {p}
                        </li>
                      ))}
                    </ol>
                  </li>
                ))}
              </ul>
            </Accordion>
          ))
        )}
      </div>
    </section>
  );
}
