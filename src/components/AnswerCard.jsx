import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Copy,
  Check,
  BookmarkPlus,
  MessageCirclePlus,
  Library,
  ThumbsUp,
  CircleHelp,
  ThumbsDown,
  PencilRuler,
} from 'lucide-react';
import Chip from './Chip';
import StreamingText from './StreamingText';
import { useToast } from './Toast';
import { sendFeedback } from '../api/client';

const RATINGS = [
  { id: 'perfect', label: 'Perfect', icon: ThumbsUp },
  { id: 'partly', label: 'Partly right', icon: CircleHelp },
  { id: 'wrong', label: 'Wrong', icon: ThumbsDown },
];

export default function AnswerCard({ answer, onSave }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [revealed, setRevealed] = useState(0); // points streamed so far
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [rating, setRating] = useState(null);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [followUp, setFollowUp] = useState('');
  const [showWrongBox, setShowWrongBox] = useState(false);
  const [wrongText, setWrongText] = useState('');

  const asText = () =>
    `${answer.subject.name} (${answer.subject.code}) — Module ${answer.module}, ${answer.marks}\n\n` +
    answer.answerPoints.map((p, i) => `${i + 1}. ${p}`).join('\n') +
    (answer.keyTerms?.length ? `\n\nKey terms: ${answer.keyTerms.join(', ')}` : '');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(asText());
      setCopied(true);
      toast({ message: 'Answer copied to clipboard', type: 'success' });
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast({ message: 'Could not copy — select and copy manually', type: 'warning' });
    }
  };

  const handleSave = () => {
    if (saved) return;
    onSave?.(answer);
    setSaved(true);
    toast({ message: 'Saved to your notes', type: 'success' });
  };

  const handleRating = async (id) => {
    setRating(id);
    setShowWrongBox(id === 'wrong');
    if (id !== 'wrong') {
      await sendFeedback({ answerId: answer.id, rating: id });
      toast({ message: 'Thanks for the feedback', type: 'info' });
    }
  };

  const submitWrong = async () => {
    await sendFeedback({ answerId: answer.id, rating: 'wrong', comment: wrongText });
    setShowWrongBox(false);
    setWrongText('');
    toast({ message: 'Feedback sent — we’ll improve this answer', type: 'info' });
  };

  const goSimilarPyqs = () => {
    navigate(`/pyqs?subject=${answer.subject.code}&module=${answer.module}`);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="card"
    >
      {/* Header pills */}
      <header className="flex flex-wrap items-center gap-2">
        <Chip active>Module {answer.module}</Chip>
        <Chip active>{answer.marks}</Chip>
        <Chip mono>{answer.subject.code}</Chip>
        <span className="text-sm font-medium text-text">{answer.subject.name}</span>
      </header>

      {/* Streaming numbered points, revealed one row at a time. */}
      <ol className="mt-5 space-y-3">
        {answer.answerPoints.map((point, i) =>
          i <= revealed ? (
            <motion.li
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="flex gap-3"
            >
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-border font-mono text-xs text-accent-to">
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed text-text">
                <StreamingText
                  text={point}
                  speed={10}
                  onDone={() => setRevealed((r) => Math.max(r, i + 1))}
                />
              </p>
            </motion.li>
          ) : null
        )}
      </ol>

      {/* Diagram hint */}
      {answer.diagramHint && revealed >= answer.answerPoints.length - 1 && (
        <p className="mt-4 inline-flex items-start gap-2 rounded-xl border border-border bg-background px-3 py-2 text-xs text-muted">
          <PencilRuler size={14} className="mt-0.5 text-accent-to" aria-hidden="true" />
          {answer.diagramHint}
        </p>
      )}

      {/* Key terms */}
      {answer.keyTerms?.length > 0 && (
        <div className="mt-5">
          <p className="mb-2 text-xs font-medium text-muted">Key terms</p>
          <div className="flex flex-wrap gap-2">
            {answer.keyTerms.map((k) => (
              <Chip key={k} mono>
                {k}
              </Chip>
            ))}
          </div>
        </div>
      )}

      {/* Footer actions */}
      <footer className="mt-6 border-t border-border pt-4">
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={handleCopy} className="btn-secondary px-3 py-2 text-sm">
            {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button type="button" onClick={handleSave} className="btn-secondary px-3 py-2 text-sm">
            <BookmarkPlus size={16} aria-hidden="true" />
            {saved ? 'Saved' : 'Save to notes'}
          </button>
          <button
            type="button"
            onClick={() => setShowFollowUp((s) => !s)}
            aria-expanded={showFollowUp}
            className="btn-secondary px-3 py-2 text-sm"
          >
            <MessageCirclePlus size={16} aria-hidden="true" />
            Ask follow-up
          </button>
          <button type="button" onClick={goSimilarPyqs} className="btn-secondary px-3 py-2 text-sm">
            <Library size={16} aria-hidden="true" />
            Similar PYQs
          </button>
        </div>

        {showFollowUp && (
          <div className="mt-3 flex gap-2">
            <input
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
              placeholder="Ask a follow-up about this answer…"
              className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent-from"
            />
            <button
              type="button"
              className="btn-primary px-4 py-2 text-sm"
              onClick={() => {
                toast({ message: 'Follow-up noted (demo)', type: 'info' });
                setFollowUp('');
                setShowFollowUp(false);
              }}
            >
              Send
            </button>
          </div>
        )}

        {/* Rating */}
        <div className="mt-4">
          <p className="mb-2 text-xs font-medium text-muted">Was this helpful?</p>
          <div className="flex flex-wrap gap-2">
            {RATINGS.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => handleRating(r.id)}
                aria-pressed={rating === r.id}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm outline-none transition-colors ${
                  rating === r.id
                    ? 'border-accent-from bg-elevated text-text'
                    : 'border-border text-muted hover:text-text'
                }`}
              >
                <r.icon size={15} aria-hidden="true" />
                {r.label}
              </button>
            ))}
          </div>

          {showWrongBox && (
            <div className="mt-3 flex gap-2">
              <input
                value={wrongText}
                onChange={(e) => setWrongText(e.target.value)}
                placeholder="What was wrong? (optional)"
                className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent-from"
              />
              <button type="button" onClick={submitWrong} className="btn-primary px-4 py-2 text-sm">
                Submit
              </button>
            </div>
          )}
        </div>
      </footer>
    </motion.article>
  );
}
