import { motion } from 'framer-motion';

// Fades + lifts its children into view once, when scrolled into the viewport.
// Framer Motion automatically disables transforms under reduced-motion settings
// at the OS level via our global CSS; this still animates opacity gently.
export default function Reveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30, delay }}
    >
      {children}
    </motion.div>
  );
}
