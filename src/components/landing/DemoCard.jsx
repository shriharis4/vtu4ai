import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { solveQuestion } from '../../api/client';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import ProgressSteps, { SOLVE_STEPS } from '../ProgressSteps';
import StreamingText from '../StreamingText';
import Chip from '../Chip';

// Fixed sample used by the looping demo. Keyword matches the DBMS canned answer.
const DEMO_QUESTION =
  'Explain the three normal forms (1NF, 2NF, 3NF) with examples.';
const DEMO_CONTEXT = {
  scheme: '2022',
  branch: 'CSE',
  semester: 5,
  subjectCode: 'XXX501',
  question: DEMO_QUESTION,
};

// Phases of the loop.
const PHASE = { TYPING: 'typing', SOLVING: 'solving', ANSWER: 'answer' };

export default function DemoCard() {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState(PHASE.TYPING);
  const [typed, setTyped] = useState('');
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState(null);
  const pausedRef = useRef(false);
  const timers = useRef([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  const after = (ms, fn) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
  };

  // Drives one full loop: type -> solve (progress) -> stream answer -> restart.
  useEffect(() => {
    let cancelled = false;

    async function runLoop() {
      if (cancelled) return;
      // Reset
      setPhase(PHASE.TYPING);
      setTyped('');
      setStep(0);
      setAnswer(null);

      // 1) Type the question character by character.
      const chars = DEMO_QUESTION.split('');
      for (let i = 0; i < chars.length; i += 1) {
        // Respect hover-pause.
        // eslint-disable-next-line no-await-in-loop
        while (pausedRef.current && !cancelled) await wait(120);
        if (cancelled) return;
        setTyped(DEMO_QUESTION.slice(0, i + 1));
        // eslint-disable-next-line no-await-in-loop
        await wait(reduced ? 2 : 28);
      }

      await wait(500);
      if (cancelled) return;

      // 2) Progress steps while the mock client "thinks".
      setPhase(PHASE.SOLVING);
      const solvePromise = solveQuestion(DEMO_CONTEXT);
      setStep(0);
      await wait(350);
      setStep(1);
      await wait(350);
      setStep(2);
      const result = await solvePromise;
      if (cancelled) return;
      await wait(300);
      setStep(3);

      // 3) Show the answer and stream it.
      setAnswer(result);
      setPhase(PHASE.ANSWER);

      // 4) Hold, then loop.
      await wait(reduced ? 2600 : 5200);
      if (cancelled) return;
      // Pause-aware hold before restarting.
      while (pausedRef.current && !cancelled) await wait(200);
      if (!cancelled) runLoop();
    }

    function wait(ms) {
      return new Promise((resolve) => {
        const id = setTimeout(resolve, ms);
        timers.current.push(id);
      });
    }

    runLoop();
    return () => {
      cancelled = true;
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  return (
    <div
      className="card relative overflow-hidden shadow-glow"
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
      role="img"
      aria-label="Live demo: VTU Solve answering a sample database question."
    >
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-xs font-medium text-muted">
          <Sparkles size={14} className="text-accent-to" aria-hidden="true" />
          Live demo
        </span>
        <Chip mono>XXX501 · DBMS</Chip>
      </div>

      {/* Question box */}
      <div className="mt-4 rounded-xl border border-border bg-background p-4">
        <p className="text-xs text-muted">Question</p>
        <p className="mt-1 min-h-[2.5rem] text-sm text-text">
          {typed}
          {phase === PHASE.TYPING && (
            <span className="ml-0.5 inline-block w-[2px] animate-caret bg-accent-to align-middle">
              &nbsp;
            </span>
          )}
        </p>
      </div>

      {/* Progress / answer area */}
      <div className="mt-4 min-h-[9rem]">
        <AnimatePresence mode="wait">
          {phase === PHASE.SOLVING && (
            <motion.div
              key="solving"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ProgressSteps steps={SOLVE_STEPS} current={step} />
            </motion.div>
          )}

          {phase === PHASE.ANSWER && answer && (
            <motion.div
              key="answer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="flex flex-wrap items-center gap-2">
                <Chip active>Module {answer.module}</Chip>
                <Chip active>{answer.marks}</Chip>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-text">
                <StreamingText text={answer.answerPoints[0]} speed={14} />
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
