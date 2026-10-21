import { motion } from 'framer-motion';
import { useProfile } from '../context/ProfileContext';

// Slim animated daily usage bar. Display only — never blocks solving.
export default function UsageMeter() {
  const { usage, dailyLimit } = useProfile();
  const pct = Math.min((usage.count / dailyLimit) * 100, 100);

  return (
    <div className="card">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-text">Today’s usage</span>
        <span className="font-mono text-muted">
          {usage.count} / {dailyLimit}
        </span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-elevated">
        <motion.div
          className="h-full rounded-full bg-accent-gradient"
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      </div>
      <p className="mt-2 text-xs text-muted">Resets at midnight.</p>
    </div>
  );
}
