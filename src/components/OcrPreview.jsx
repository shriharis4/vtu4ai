import { AlertTriangle, ScanLine } from 'lucide-react';

const THRESHOLD = 0.7;

// Shows the OCR-extracted text (editable) with a confidence badge. Below 70%
// it surfaces an amber "please check the text" warning.
export default function OcrPreview({ text, confidence, onChange }) {
  const pct = Math.round(confidence * 100);
  const low = confidence < THRESHOLD;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-sm text-muted">
          <ScanLine size={16} className="text-accent-to" aria-hidden="true" />
          Extracted text
        </span>
        <span
          className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${
            low
              ? 'border-warning/40 bg-warning/10 text-warning'
              : 'border-success/40 bg-success/10 text-success'
          }`}
        >
          {pct}% confidence
        </span>
      </div>

      <label htmlFor="ocr-text" className="sr-only">
        Edit extracted text
      </label>
      <textarea
        id="ocr-text"
        value={text}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-text outline-none focus:border-accent-from"
      />

      {low && (
        <p
          role="alert"
          className="mt-2 inline-flex items-center gap-1.5 text-xs text-warning"
        >
          <AlertTriangle size={14} aria-hidden="true" />
          Low confidence — please check the text before solving.
        </p>
      )}
    </div>
  );
}
