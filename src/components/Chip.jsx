// A small pill. `active` gives it the accent gradient; `as` lets it render as a
// button (interactive) or span (static label). Mono variant for codes/key terms.
export default function Chip({
  children,
  active = false,
  mono = false,
  as = 'span',
  className = '',
  ...props
}) {
  const Tag = as;
  const interactive = as === 'button';
  return (
    <Tag
      className={[
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors',
        mono ? 'font-mono text-xs' : 'font-medium',
        active
          ? 'border-transparent bg-accent-gradient text-background'
          : 'border-border bg-elevated text-muted',
        interactive && !active ? 'hover:border-accent-from/60 hover:text-text' : '',
        interactive ? 'cursor-pointer outline-none' : '',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </Tag>
  );
}
