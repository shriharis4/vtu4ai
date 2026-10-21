import Accordion from '../Accordion';
import Reveal from '../Reveal';

const FAQS = [
  {
    q: 'Is this for cheating?',
    a: 'No. VTU Solve is for exam preparation and revision, not for use during exams. It helps you understand how to structure answers and practise beforehand. Using it in an actual exam would be academic misconduct.',
  },
  {
    q: 'How accurate are the answers?',
    a: 'Answers are generated to match the VTU exam format and are a strong starting point for revision. Always cross-check against your textbook and official syllabus before relying on them.',
  },
  {
    q: 'Which schemes and branches are supported?',
    a: 'Schemes from 2015 through 2025 and 14 branches including CSE, ISE, AIML, ECE, Mechanical, Civil and more. Subject lists currently use placeholder codes while the full syllabus data is added.',
  },
  {
    q: 'Can I photograph a question instead of typing it?',
    a: 'Yes. Upload or drag in a photo of the question and VTU Solve extracts the text for you. You can edit the extracted text before solving if anything looks off.',
  },
  {
    q: 'Does it know the difference between 5-mark and 10-mark answers?',
    a: 'Yes. Every answer is tagged with a suggested marks type, and the length and depth are adjusted so a 10-mark answer is more detailed than a 5-mark one.',
  },
  {
    q: 'Is my data stored anywhere?',
    a: 'In this version your profile, saved notes and history stay in your browser only (localStorage). Nothing is sent to a server today.',
  },
];

export default function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 px-5 py-20">
      <Reveal>
        <h2 className="text-center font-heading text-3xl font-bold md:text-4xl">
          Frequently asked questions
        </h2>
      </Reveal>
      <div className="mt-10 space-y-3">
        {FAQS.map((f, i) => (
          <Reveal key={f.q} delay={i * 0.05}>
            <Accordion title={f.q} defaultOpen={i === 0}>
              <p className="text-sm leading-relaxed">{f.a}</p>
            </Accordion>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
