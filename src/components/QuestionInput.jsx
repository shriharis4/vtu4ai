import Chip from './Chip';

const MAX = 300;

// Example questions that match the canned answers so the demo always "works".
const EXAMPLES = [
  'Explain the three normal forms (1NF, 2NF, 3NF) with examples.',
  'What is a deadlock? List the four Coffman conditions.',
  'Describe the TCP three-way handshake.',
  'Explain stack operations with applications.',
];

/**
 * Controlled question textarea with a live character counter, example chips
 * that fill the box, and Ctrl/Cmd+Enter to submit.
 */
export default function QuestionInput({ value, onChange, onSubmit }) {
  const count = value.length;
  const near = count > MAX * 0.9;

  const onKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      onSubmit?.();
    }
  };

  return (
    <div>
      <label htmlFor="question" className="sr-only">
        Your question
      </label>
      <textarea
        id="question"
        value={value}
        maxLength={MAX}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        rows={5}
        placeholder="Type your exam question here… e.g. Explain normalization with examples."
        className="w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-text outline-none focus:border-accent-from"
      />

      <div className="mt-2 flex items-center justify-between text-xs">
        <span className="text-muted">
          <kbd className="rounded border border-border bg-elevated px-1.5 py-0.5 font-mono">
            Ctrl/⌘ + Enter
          </kbd>{' '}
          to solve
        </span>
        <span className={near ? 'text-warning' : 'text-muted'}>
          {count}/{MAX}
        </span>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-xs font-medium text-muted">Try an example</p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <Chip
              key={ex}
              as="button"
              type="button"
              onClick={() => onChange(ex)}
              className="max-w-full truncate"
              title={ex}
            >
              {ex.length > 42 ? `${ex.slice(0, 42)}…` : ex}
            </Chip>
          ))}
        </div>
      </div>
    </div>
  );
}
