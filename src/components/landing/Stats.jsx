import { useCountUp } from '../../hooks/useCountUp';

const STATS = [
  { target: 6, suffix: '', label: 'Schemes supported' },
  { target: 14, suffix: '', label: 'Branches covered' },
  { target: 8, suffix: '', label: 'Semesters' },
];

function Stat({ target, suffix, label }) {
  const { ref, value } = useCountUp(target);
  return (
    <div ref={ref} className="text-center">
      <p className="font-heading text-4xl font-bold text-gradient md:text-5xl">
        {value}
        {suffix}
      </p>
      <p className="mt-1 text-sm text-muted">{label}</p>
    </div>
  );
}

export default function Stats() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-12">
      <div className="card grid grid-cols-3 gap-4 py-8">
        {STATS.map((s) => (
          <Stat key={s.label} {...s} />
        ))}
      </div>
    </section>
  );
}
