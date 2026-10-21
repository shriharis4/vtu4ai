import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, UploadCloud, X } from 'lucide-react';
import { runOcr } from '../api/client';
import OcrPreview from './OcrPreview';

const PHASE = { EMPTY: 'empty', SCANNING: 'scanning', DONE: 'done' };

/**
 * Photo tab: drag-and-drop or pick an image, show a thumbnail, run a fake OCR
 * scan (1.5s) with a scanning-line animation, then expose an editable preview.
 * The edited text is lifted up via onText so the Solver can submit it.
 */
export default function PhotoInput({ onText }) {
  const inputRef = useRef(null);
  const [phase, setPhase] = useState(PHASE.EMPTY);
  const [dragging, setDragging] = useState(false);
  const [thumb, setThumb] = useState(null);
  const [ocr, setOcr] = useState({ text: '', confidence: 0 });

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setThumb(URL.createObjectURL(file));
    setPhase(PHASE.SCANNING);
    const result = await runOcr(file);
    setOcr(result);
    onText(result.text);
    setPhase(PHASE.DONE);
  };

  const reset = () => {
    if (thumb) URL.revokeObjectURL(thumb);
    setThumb(null);
    setOcr({ text: '', confidence: 0 });
    setPhase(PHASE.EMPTY);
    onText('');
  };

  if (phase === PHASE.EMPTY) {
    return (
      <div>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            handleFile(e.dataTransfer.files?.[0]);
          }}
          className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 text-center transition-colors ${
            dragging ? 'border-accent-from bg-elevated' : 'border-border bg-background'
          }`}
        >
          <UploadCloud size={32} className="text-muted" aria-hidden="true" />
          <p className="text-sm text-text">Drag & drop a photo of your question</p>
          <p className="text-xs text-muted">PNG or JPG, up to ~5 MB</p>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="btn-secondary mt-1"
          >
            <Camera size={18} aria-hidden="true" />
            Choose image
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="relative overflow-hidden rounded-xl border border-border">
        <img
          src={thumb}
          alt="Uploaded question"
          className="max-h-48 w-full object-cover"
        />
        {phase === PHASE.SCANNING && (
          <>
            <div className="absolute inset-0 bg-background/40" />
            <motion.div
              className="absolute inset-x-0 h-0.5 bg-accent-to shadow-glow-cyan"
              style={{ top: 0 }}
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              aria-hidden="true"
            />
            <p className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-elevated px-3 py-1 text-xs text-text">
              Reading text…
            </p>
          </>
        )}
        <button
          type="button"
          onClick={reset}
          aria-label="Remove image"
          className="tap-target absolute right-2 top-2 grid place-items-center rounded-full bg-elevated/90 text-text outline-none hover:bg-elevated"
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>

      {phase === PHASE.DONE && (
        <div className="mt-4">
          <OcrPreview
            text={ocr.text}
            confidence={ocr.confidence}
            onChange={(t) => {
              setOcr((p) => ({ ...p, text: t }));
              onText(t);
            }}
          />
        </div>
      )}
    </div>
  );
}
