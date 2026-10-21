import { motion } from 'framer-motion';

/**
 * Accessible tablist with a shared-layout animated underline.
 * tabs: [{ id, label, icon? }]; value/onChange control the active tab.
 * `layoutId` must be unique per mounted TabSwitch instance.
 */
export default function TabSwitch({ tabs, value, onChange, layoutId = 'tab-underline' }) {
  return (
    <div role="tablist" className="flex gap-1 rounded-xl border border-border bg-background p-1">
      {tabs.map((t) => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(t.id)}
            className="relative flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium outline-none"
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-lg bg-accent-gradient"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <span
              className={`relative z-10 inline-flex items-center gap-2 ${
                active ? 'text-background' : 'text-muted'
              }`}
            >
              {t.icon && <t.icon size={16} aria-hidden="true" />}
              {t.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
