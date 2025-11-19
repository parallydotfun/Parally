import { useEffect, useState, useRef } from 'react';

interface TextScrambleProps {
  text: string;
  speed?: number;
}

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export default function TextScramble({ text, speed = 50 }: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(text);
  const rafRef = useRef<number>();
  const frameRef = useRef(0);

  useEffect(() => {
    let frame = 0;
    const queue: Array<{ from: string; to: string; start: number; end: number; char?: string }> = [];
    const length = text.length;

    for (let i = 0; i < length; i++) {
      const from = displayText[i] || '';
      const to = text[i];
      const start = Math.floor(Math.random() * 20);
      const end = start + Math.floor(Math.random() * 20);
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
          if (!char || Math.random() < 0.28) {
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
      } else {
        frameRef.current = frame;
        frame++;
        rafRef.current = requestAnimationFrame(update);
      }
    };

    rafRef.current = requestAnimationFrame(update);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [text]);

  return (
    <span className="text-scramble">
      {displayText.split('').map((char, i) => (
        <span key={i} className="text-scramble__symbol">{char}</span>
      ))}
    </span>
  );
}
