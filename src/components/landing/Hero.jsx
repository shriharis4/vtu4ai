import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle } from 'lucide-react';
import AnimatedBackground from './AnimatedBackground';
import DemoCard from './DemoCard';

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <AnimatedBackground />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 md:py-28 lg:grid-cols-2">
        {/* Left: copy + CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-elevated px-3 py-1 text-xs font-medium text-muted">
            <span className="h-2 w-2 rounded-full bg-success" />
            Built for VTU · Mock preview
          </span>

          <h1 className="mt-5 font-heading text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            Exam-ready <span className="text-gradient">VTU answers</span> in seconds
          </h1>

          <p className="mt-5 max-w-md text-lg text-muted">
            Pick your subject, type or photograph a question, and get a structured
            answer tagged with its module and marks type.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/login" className="btn-primary">
              Try it free
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <a href="#how" className="btn-secondary">
              <PlayCircle size={18} aria-hidden="true" />
              See how it works
            </a>
          </div>
        </motion.div>

        {/* Right: self-running live demo card (Task 7). */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.1 }}
        >
          <DemoCard />
        </motion.div>
      </div>
    </section>
  );
}
