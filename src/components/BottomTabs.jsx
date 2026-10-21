import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { APP_TABS } from './navConfig';

// Fixed bottom tab bar for mobile (hidden on md+). Each tab is >= 44px tall.
export default function BottomTabs() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 glass md:hidden"
      aria-label="Primary"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around">
        {APP_TABS.map(({ to, label, icon: Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              className="tap-target relative flex flex-col items-center justify-center gap-0.5 py-2 outline-none"
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="bottomtabs-underline"
                      className="absolute top-0 h-0.5 w-8 rounded-full bg-accent-gradient"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon
                    size={20}
                    aria-hidden="true"
                    className={isActive ? 'text-accent-to' : 'text-muted'}
                  />
                  <span
                    className={`text-[11px] font-medium ${
                      isActive ? 'text-text' : 'text-muted'
                    }`}
                  >
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
