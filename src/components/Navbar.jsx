import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { APP_TABS } from './navConfig';

const LANDING_LINKS = [
  { href: '#how', label: 'How it works' },
  { href: '#features', label: 'Features' },
  { href: '#faq', label: 'FAQ' },
];

function Logo() {
  return (
    <Link
      to="/"
      className="flex items-center gap-2 font-heading text-lg font-bold"
      aria-label="VTU Solve home"
    >
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent-gradient font-mono text-background">
        V
      </span>
      <span>
        VTU<span className="text-gradient"> Solve</span>
      </span>
    </Link>
  );
}

// Desktop app tab with a shared-layout animated underline.
function AppTab({ to, label }) {
  return (
    <NavLink to={to} className="relative px-1 py-1 text-sm font-medium outline-none">
      {({ isActive }) => (
        <>
          <span className={isActive ? 'text-text' : 'text-muted hover:text-text'}>
            {label}
          </span>
          {isActive && (
            <motion.span
              layoutId="navbar-underline"
              className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-accent-gradient"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
        </>
      )}
    </NavLink>
  );
}

export default function Navbar() {
  const { pathname } = useLocation();
  const isLanding = pathname === '/';

  return (
    <header className="sticky top-0 z-40 glass">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Logo />

        {isLanding ? (
          <>
            <ul className="hidden items-center gap-8 md:flex">
              {LANDING_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-sm font-medium text-muted transition-colors hover:text-text"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <Link to="/login" className="btn-primary px-4 py-2 text-sm">
              Get started
            </Link>
          </>
        ) : (
          // Signed-in app tabs (hidden on mobile where BottomTabs takes over).
          <ul className="hidden items-center gap-8 md:flex">
            {APP_TABS.map((t) => (
              <li key={t.to}>
                <AppTab to={t.to} label={t.label} />
              </li>
            ))}
          </ul>
        )}
      </nav>
    </header>
  );
}
