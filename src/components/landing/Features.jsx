import {
  Layers,
  Ruler,
  Camera,
  Library,
  BookmarkCheck,
  Smartphone,
} from 'lucide-react';
import Reveal from '../Reveal';

const FEATURES = [
  {
    icon: Layers,
    title: 'Module-wise answers',
    body: 'Every answer is tagged with its VTU module number so you know exactly where it fits in the syllabus.',
  },
  {
    icon: Ruler,
    title: 'Marks-aware length',
    body: 'Ask for a 5-mark or 10-mark answer and get a response sized to match what the exam expects.',
  },
  {
    icon: Camera,
    title: 'Photo to text',
    body: 'Snap a question from a book or paper and we extract the text so you can edit and solve it.',
  },
  {
    icon: Library,
    title: 'PYQ bank',
    body: 'Browse previous-year questions filtered by subject, module, year and marks, with worked answers.',
  },
  {
    icon: BookmarkCheck,
    title: 'Saved notes',
    body: 'Save any answer to your notes, grouped by subject, and export everything as a text file.',
  },
  {
    icon: Smartphone,
    title: 'Works on your phone',
    body: 'A fast, responsive interface with a bottom tab bar built for revising on the go.',
  },
];

export default function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20">
      <Reveal>
        <h2 className="text-center font-heading text-3xl font-bold md:text-4xl">
          Everything you need to revise
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted">
          Built around how VTU exams are actually marked.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <Reveal key={f.title} delay={(i % 3) * 0.08} className="h-full">
            <article className="card group h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-glow">
              <span className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-elevated text-accent-to transition-colors group-hover:border-accent-from/60">
                <f.icon size={22} aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-heading text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted">{f.body}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
