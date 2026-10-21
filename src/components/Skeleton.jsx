// Shimmering placeholder block used in loading states.
export default function Skeleton({ className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-lg bg-elevated/80 ${className}`}
    />
  );
}
