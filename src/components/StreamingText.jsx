import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * Typewriter text. Accessibility approach (per ARIA live-region guidance):
 *  - The real, complete text is rendered immediately in a visually-hidden span
 *    so screen readers announce the whole answer at once, not character by
 *    character.
 *  - The animated, growing text is aria-hidden and purely visual.
 *  - Under prefers-reduced-motion the full text shows instantly.
 *
 * Calls `onDone` once when the animation finishes (or immediately if reduced).
 */
export default function StreamingText({
  text = '',
  speed = 12,
  startDelay = 0,
  onDone,
  className = '',
  showCaret = true,
}) {
  const reduced = useReducedMotion();
  const [count, setCount] = useState(reduced ? text.length : 0);
  const doneRef = useRef(false);

  useEffect(() => {
    doneRef.current = false;
    if (reduced) {
      setCount(text.length);
      onDone?.();
      return undefined;
    }
    setCount(0);
    let i = 0;
    let intervalId;
    const startId = setTimeout(() => {
      intervalId = setInterval(() => {
        i += 1;
        setCount(i);
        if (i >= text.length) {
          clearInterval(intervalId);
          if (!doneRef.current) {
            doneRef.current = true;
            onDone?.();
          }
        }
      }, speed);
    }, startDelay);
    return () => {
      clearTimeout(startId);
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, speed, startDelay, reduced]);

  const streaming = count < text.length;

  return (
    <span className={className}>
      {/* Full text for assistive tech — present immediately, visually hidden. */}
      <span className="sr-only">{text}</span>
      {/* Visual typewriter layer. */}
      <span aria-hidden="true">
        {text.slice(0, count)}
        {showCaret && streaming && (
          <span className="ml-0.5 inline-block w-[2px] animate-caret bg-accent-to align-middle">
            &nbsp;
          </span>
        )}
      </span>
    </span>
  );
}
