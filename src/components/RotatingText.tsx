import { useEffect, useState, useRef } from 'react';

interface RotatingTextProps {
  texts: string[];
  interval?: number;
  className?: string;
}

const chars = '!<>-_\\/[]{}—=+*^?#________';

export default function RotatingText({ texts, interval = 2000, className = '' }: RotatingTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState(texts[0]);
  const [isGlitching, setIsGlitching] = useState(false);
  const rafRef = useRef<number>();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const currentTextRef = useRef(texts[0]);

  useEffect(() => {
    currentTextRef.current = texts[currentIndex];
    setDisplayText(texts[currentIndex]);
  }, [currentIndex, texts]);

  useEffect(() => {
    const rotateText = () => {
      setIsGlitching(true);

      const nextIndex = (currentIndex + 1) % texts.length;
      const targetText = texts[nextIndex];
      const fromText = currentTextRef.current;

      let frame = 0;
      const queue: Array<{ from: string; to: string; start: number; end: number; char?: string }> = [];
      const length = Math.max(fromText.length, targetText.length);

      for (let i = 0; i < length; i++) {
        const from = fromText[i] || '';
        const to = targetText[i] || '';
        const start = Math.floor(Math.random() * 5);
        const end = start + 15 + Math.floor(Math.random() * 10);
        queue.push({ from, to, start, end });
      }

      const update = () => {
        let output = '';
        let complete = 0;

        for (let i = 0, n = queue.length; i < n; i++) {
          let { from, to, start, end, char } = queue[i];

          if (frame >= end) {
            complete++;
            output += to;
          } else if (frame >= start) {
            if (!char || Math.random() < 0.5) {
              char = chars[Math.floor(Math.random() * chars.length)];
              queue[i].char = char;
            }
            output += char;
          } else {
            output += from;
          }
        }

        setDisplayText(output);

        if (complete === queue.length) {
          if (rafRef.current) cancelAnimationFrame(rafRef.current);
          setDisplayText(targetText);
          currentTextRef.current = targetText;
          setIsGlitching(false);
          setCurrentIndex(nextIndex);
        } else {
          frame++;
          rafRef.current = requestAnimationFrame(update);
        }
      };

      rafRef.current = requestAnimationFrame(update);
    };

    timeoutRef.current = setTimeout(rotateText, interval);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentIndex, texts, interval]);

  return (
    <span
      className={`rotating-text inline-block ${isGlitching ? 'glitching' : ''} ${className}`}
      style={{
        minWidth: '200px',
        textAlign: 'left'
      }}
    >
      {displayText}
    </span>
  );
}
