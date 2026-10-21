// Soft, slowly drifting gradient orbs behind the hero. Purely decorative, so
// it is aria-hidden and sits behind content with negative z-index. Animation is
// CSS-driven (float keyframes) and auto-stilled under reduced-motion.
export default function AnimatedBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-accent-from/30 blur-3xl animate-float-slow" />
      <div className="absolute right-0 top-20 h-80 w-80 rounded-full bg-accent-to/20 blur-3xl animate-float-slower" />
      <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-accent-from/20 blur-3xl animate-float-slow" />
      {/* Faint grid overlay for structure. */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(#E6E8EE 1px, transparent 1px), linear-gradient(90deg, #E6E8EE 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
    </div>
  );
}
