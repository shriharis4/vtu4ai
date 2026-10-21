import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, GraduationCap } from 'lucide-react';
import { SCHEMES, BRANCHES, SEMESTERS } from '../data/academics';
import { useProfile } from '../context/ProfileContext';

const STEP_LABELS = ['Scheme', 'Branch', 'Semester'];

export default function Onboarding() {
  const navigate = useNavigate();
  const { saveProfile } = useProfile();
  const [step, setStep] = useState(0);
  const [scheme, setScheme] = useState(null);
  const [branch, setBranch] = useState(null);
  const [semester, setSemester] = useState(null);

  const canProceed = [scheme, branch, semester][step] != null;
  const progress = ((step + (canProceed ? 1 : 0)) / STEP_LABELS.length) * 100;

  const next = () => {
    if (!canProceed) return;
    if (step < STEP_LABELS.length - 1) {
      setStep((s) => s + 1);
    } else {
      saveProfile({ scheme, branch, semester, subjectCode: null });
      navigate('/solve');
    }
  };
  const back = () => setStep((s) => Math.max(0, s - 1));

  return (
    <section className="mx-auto max-w-2xl px-5 py-12">
      <header className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-gradient text-background">
          <GraduationCap size={22} aria-hidden="true" />
        </span>
        <div>
          <h1 className="font-heading text-2xl font-bold">Set up your profile</h1>
          <p className="text-sm text-muted">
            Step {step + 1} of {STEP_LABELS.length} · {STEP_LABELS[step]}
          </p>
        </div>
      </header>

      {/* Animated progress bar */}
      <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-elevated">
        <motion.div
          className="h-full rounded-full bg-accent-gradient"
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      </div>

      <div className="mt-8 min-h-[18rem]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {step === 0 && (
              <fieldset>
                <legend className="mb-3 font-heading text-lg font-semibold">
                  Which scheme are you on?
                </legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {SCHEMES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setScheme(s.id)}
                      aria-pressed={scheme === s.id}
                      className={`rounded-card border p-4 text-left outline-none transition-colors ${
                        scheme === s.id
                          ? 'border-accent-from bg-elevated shadow-glow'
                          : 'border-border bg-surface hover:border-accent-from/50'
                      }`}
                    >
                      <span className="font-heading text-xl font-bold">{s.label}</span>
                      <span className="mt-1 block text-xs text-muted">{s.years}</span>
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            {step === 1 && (
              <fieldset>
                <legend className="mb-3 font-heading text-lg font-semibold">
                  Pick your branch
                </legend>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {BRANCHES.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setBranch(b.id)}
                      aria-pressed={branch === b.id}
                      title={b.name}
                      className={`flex flex-col items-center gap-1 rounded-card border p-3 text-center outline-none transition-colors ${
                        branch === b.id
                          ? 'border-accent-from bg-elevated shadow-glow'
                          : 'border-border bg-surface hover:border-accent-from/50'
                      }`}
                    >
                      <span className="font-mono text-sm font-semibold">{b.id}</span>
                      <span className="line-clamp-2 text-[11px] leading-tight text-muted">
                        {b.name}
                      </span>
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            {step === 2 && (
              <fieldset>
                <legend className="mb-3 font-heading text-lg font-semibold">
                  Which semester?
                </legend>
                <div className="flex flex-wrap gap-2">
                  {SEMESTERS.map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setSemester(n)}
                      aria-pressed={semester === n}
                      className={`tap-target grid w-14 place-items-center rounded-card border text-lg font-semibold outline-none transition-colors ${
                        semester === n
                          ? 'border-transparent bg-accent-gradient text-background'
                          : 'border-border bg-surface text-text hover:border-accent-from/50'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={back}
          disabled={step === 0}
          className="btn-secondary disabled:invisible"
        >
          <ArrowLeft size={18} aria-hidden="true" />
          Back
        </button>
        <button type="button" onClick={next} disabled={!canProceed} className="btn-primary">
          {step === STEP_LABELS.length - 1 ? (
            <>
              <Check size={18} aria-hidden="true" />
              Finish
            </>
          ) : (
            <>
              Next
              <ArrowRight size={18} aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </section>
  );
}
