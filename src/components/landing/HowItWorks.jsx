import { MousePointerClick, MessageSquareText, FileCheck2 } from 'lucide-react';
import Reveal from '../Reveal';

const STEPS = [
  {
    icon: MousePointerClick,
    title: 'Pick your subject',
    body: 'Set your scheme, branch and semester once. Your subjects load automatically from there.',
  },
  {
    icon: MessageSquareText,
    title: 'Ask or snap a question',
    body: 'Type a question or photograph it from your textbook or question paper. We read it for you.',
  },
  {
    icon: FileCheck2,
    title: 'Get an exam-format answer',
    body: 'Receive a structured answer tagged with the module number and the marks it suits.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20">
      <Reveal>
        <h2 className="text-center font-heading text-3xl font-bold md:text-4xl">
          How it works
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted">
          Three steps from a blank page to an answer you can actually write in the exam.
        </p>
      </Reveal>

      <ol className="mt-12 grid gap-6 md:grid-cols-3">
        {STEPS.map((s, i) => (
          <li key={s.title}>
            <Reveal delay={i * 0.1} className="h-full">
              <div className="card h-full transition-shadow hover:shadow-glow">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent-gradient text-background">
                    <s.icon size={22} aria-hidden="true" />
                  </span>
                  <span className="font-mono text-sm text-muted">Step {i + 1}</span>
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted">{s.body}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
