import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, IdCard, Loader2, CheckCircle2, Send } from 'lucide-react';
import TabSwitch from '../components/TabSwitch';
import { useAuth } from '../context/AuthContext';
import { login } from '../api/client';

// Placeholder structure for future college-domain enforcement. Not enforced
// today — any valid email format is accepted. Shown to the user as guidance.
const ALLOWED_DOMAINS = ['vtu.ac.in', 'bmsce.ac.in', 'rvce.edu.in', 'sit.ac.in'];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Example USN: 1AB22CS001 -> digit, 2 letters (college), 2 digits (year),
// 2 letters (branch), 3 digits (roll).
const USN_RE = /^[0-9][A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{3}$/;

const TABS = [
  { id: 'email', label: 'College email', icon: Mail },
  { id: 'usn', label: 'USN', icon: IdCard },
];

export default function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [tab, setTab] = useState('email');
  const [email, setEmail] = useState('');
  const [usn, setUsn] = useState('');
  const [touched, setTouched] = useState(false);
  const [shake, setShake] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | sending | sent

  const value = tab === 'email' ? email : usn;
  const valid = tab === 'email' ? EMAIL_RE.test(email.trim()) : USN_RE.test(usn.trim());

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);
    if (!valid) {
      triggerShake();
      return;
    }
    setStatus('sending');
    const res = await login({ method: tab, value: value.trim() });
    if (res.ok) {
      setStatus('sent');
      signIn({ method: tab, value: value.trim() });
      // Every login routes to onboarding in this mock phase.
      setTimeout(() => navigate('/onboarding'), 900);
    }
  };

  const showError = touched && value.length > 0 && !valid;

  return (
    <section className="mx-auto flex max-w-md flex-col px-5 py-16">
      <motion.div
        className={`glass rounded-card p-6 ${shake ? 'animate-shake' : ''}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <h1 className="font-heading text-2xl font-bold">Welcome to VTU Solve</h1>
        <p className="mt-1 text-sm text-muted">
          Sign in to set up your subjects and start solving.
        </p>

        <div className="mt-6">
          <TabSwitch
            tabs={TABS}
            value={tab}
            onChange={(id) => {
              setTab(id);
              setTouched(false);
            }}
            layoutId="login-tab"
          />
        </div>

        <form onSubmit={handleSubmit} className="mt-6" noValidate>
          {tab === 'email' ? (
            <label className="block">
              <span className="text-sm font-medium">College email</span>
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched(true)}
                placeholder="you@college.ac.in"
                aria-invalid={showError}
                aria-describedby="email-help"
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-text outline-none focus:border-accent-from"
              />
            </label>
          ) : (
            <label className="block">
              <span className="text-sm font-medium">University Seat Number</span>
              <input
                type="text"
                value={usn}
                onChange={(e) => setUsn(e.target.value.toUpperCase())}
                onBlur={() => setTouched(true)}
                placeholder="1AB22CS001"
                maxLength={10}
                aria-invalid={showError}
                aria-describedby="usn-help"
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 font-mono tracking-wider text-text outline-none focus:border-accent-from"
              />
            </label>
          )}

          {/* Live help / error text */}
          {tab === 'email' ? (
            <p
              id="email-help"
              className={`mt-2 text-xs ${showError ? 'text-danger' : 'text-muted'}`}
            >
              {showError
                ? 'Enter a valid email address.'
                : 'Any email works for now.'}
              <span className="mt-1 block text-muted">
                College domains (coming soon): {ALLOWED_DOMAINS.join(', ')}
              </span>
            </p>
          ) : (
            <p
              id="usn-help"
              className={`mt-2 text-xs ${showError ? 'text-danger' : 'text-muted'}`}
            >
              {showError
                ? 'USN must be 10 characters, e.g. 1AB22CS001.'
                : 'Format: 1AB22CS001 (10 characters).'}
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'sending' || status === 'sent'}
            className="btn-primary mt-6 w-full"
          >
            {status === 'sending' && (
              <>
                <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                Sending…
              </>
            )}
            {status === 'sent' && (
              <>
                <CheckCircle2 size={18} aria-hidden="true" />
                Link sent — redirecting…
              </>
            )}
            {status === 'idle' && (
              <>
                <Send size={18} aria-hidden="true" />
                {tab === 'email' ? 'Send magic link' : 'Continue'}
              </>
            )}
          </button>

          {status === 'sent' && (
            <p className="mt-3 text-center text-xs text-success">
              Check your inbox (simulated). Taking you to setup…
            </p>
          )}
        </form>
      </motion.div>
    </section>
  );
}
