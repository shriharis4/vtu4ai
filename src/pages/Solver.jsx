import { useEffect, useRef, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Type, Image, Sparkles, Loader2 } from 'lucide-react';
import SubjectSelector from '../components/SubjectSelector';
import TabSwitch from '../components/TabSwitch';
import QuestionInput from '../components/QuestionInput';
import PhotoInput from '../components/PhotoInput';
import ProgressSteps, { SOLVE_STEPS } from '../components/ProgressSteps';
import AnswerCard from '../components/AnswerCard';
import RecentQuestions from '../components/RecentQuestions';
import UsageMeter from '../components/UsageMeter';
import { useProfile } from '../context/ProfileContext';
import { solveQuestion } from '../api/client';

const TABS = [
  { id: 'type', label: 'Type', icon: Type },
  { id: 'photo', label: 'Photo', icon: Image },
];

// idle | solving | answered | error
export default function Solver() {
  const { profile, hasProfile, addNote, addHistory, incrementUsage } = useProfile();
  const [tab, setTab] = useState('type');
  const [typed, setTyped] = useState('');
  const [ocrText, setOcrText] = useState('');
  const [status, setStatus] = useState('idle');
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState(null);
  const stepTimers = useRef([]);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => () => stepTimers.current.forEach(clearTimeout), []);

  // Prefill the Type tab from a ?q= param (used by History "re-run"), once.
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setTab('type');
      setTyped(q);
      setStatus('idle');
      setAnswer(null);
      searchParams.delete('q');
      setSearchParams(searchParams, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Redirect to onboarding if the profile isn't set up yet.
  if (!hasProfile) return <Navigate to="/onboarding" replace />;

  const question = (tab === 'type' ? typed : ocrText).trim();
  const canSolve = question.length > 0 && status !== 'solving';

  const runSteps = () => {
    setStep(0);
    stepTimers.current.push(setTimeout(() => setStep(1), 300));
    stepTimers.current.push(setTimeout(() => setStep(2), 650));
  };

  const handleSolve = async () => {
    if (!canSolve) return;
    setStatus('solving');
    setAnswer(null);
    runSteps();
    try {
      const result = await solveQuestion({
        scheme: profile.scheme,
        branch: profile.branch,
        semester: profile.semester,
        subjectCode: profile.subjectCode,
        question,
      });
      setStep(3);
      setAnswer(result);
      setStatus('answered');
      incrementUsage();
      addHistory({
        id: result.id,
        question,
        subject: result.subject,
        module: result.module,
        marks: result.marks,
      });
    } catch {
      setStatus('error');
    }
  };

  const handleRerun = (item) => {
    setTab('type');
    setTyped(item.question);
    setStatus('idle');
    setAnswer(null);
  };

  return (
    <section className="mx-auto max-w-6xl px-5 py-8">
      {/* Milestone announcements for screen readers (not the streaming text). */}
      <p className="sr-only" role="status" aria-live="polite">
        {status === 'solving'
          ? 'Solving your question.'
          : status === 'answered'
            ? 'Answer ready.'
            : status === 'error'
              ? 'Something went wrong.'
              : ''}
      </p>

      <h1 className="font-heading text-2xl font-bold">Solve a question</h1>
      <p className="mt-1 text-sm text-muted">
        Pick a subject, then type or photograph your question.
      </p>

      <div className="mt-5">
        <SubjectSelector />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_20rem]">
        {/* Main column */}
        <div className="space-y-6">
          <div className="card">
            <TabSwitch tabs={TABS} value={tab} onChange={setTab} layoutId="solve-tab" />

            <div className="mt-5">
              {tab === 'type' ? (
                <QuestionInput value={typed} onChange={setTyped} onSubmit={handleSolve} />
              ) : (
                <PhotoInput onText={setOcrText} />
              )}
            </div>

            <button
              type="button"
              onClick={handleSolve}
              disabled={!canSolve}
              className="btn-primary mt-5 w-full sm:w-auto"
            >
              {status === 'solving' ? (
                <>
                  <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                  Solving…
                </>
              ) : (
                <>
                  <Sparkles size={18} aria-hidden="true" />
                  Get answer
                </>
              )}
            </button>
          </div>

          {/* Progress / answer / error */}
          <AnimatePresence mode="wait">
            {status === 'solving' && (
              <motion.div
                key="progress"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="card"
              >
                <ProgressSteps steps={SOLVE_STEPS} current={step} />
                <p className="mt-3 text-xs text-muted">Working through your question…</p>
              </motion.div>
            )}

            {status === 'answered' && answer && (
              <AnswerCard key="answer" answer={answer} onSave={addNote} />
            )}

            {status === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="card border-danger/40"
              >
                <p className="text-sm text-danger">
                  Something went wrong solving that question. Please try again.
                </p>
                <button type="button" onClick={handleSolve} className="btn-secondary mt-3">
                  Retry
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right column (stacks below on mobile) */}
        <aside className="space-y-6">
          <UsageMeter />
          <RecentQuestions onRerun={handleRerun} />
        </aside>
      </div>
    </section>
  );
}
