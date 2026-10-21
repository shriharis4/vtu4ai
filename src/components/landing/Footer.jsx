import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-10 text-sm text-muted md:flex-row">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-accent-gradient font-mono text-background">
            V
          </span>
          <span className="font-heading font-semibold text-text">VTU Solve</span>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-5" aria-label="Footer">
          <a href="#how" className="hover:text-text">How it works</a>
          <a href="#features" className="hover:text-text">Features</a>
          <a href="#faq" className="hover:text-text">FAQ</a>
          <Link to="/login" className="hover:text-text">Get started</Link>
        </nav>

        <p>For exam prep, not exams. Built for VTU students.</p>
      </div>
    </footer>
  );
}
