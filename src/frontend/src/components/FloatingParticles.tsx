import { useMemo } from "react";

const MUSIC_SYMBOLS = ["♪", "♫", "♬", "♩", "✦", "★", "✧", "·"];

interface Particle {
  id: number;
  symbol: string;
  left: string;
  size: string;
  duration: string;
  delay: string;
  swayDuration: string;
  color: string;
}

const COLORS = [
  "oklch(0.65 0.27 320 / 50%)",
  "oklch(0.58 0.24 290 / 50%)",
  "oklch(0.82 0.14 200 / 40%)",
  "oklch(0.97 0.01 280 / 30%)",
];

export default function FloatingParticles() {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      symbol: MUSIC_SYMBOLS[i % MUSIC_SYMBOLS.length],
      left: `${(i * 4.8 + Math.sin(i) * 8) % 100}%`,
      size: `${10 + (i % 3) * 6}px`,
      duration: `${12 + (i % 7) * 3}s`,
      delay: `${(i * 1.3) % 10}s`,
      swayDuration: `${5 + (i % 4) * 2}s`,
      color: COLORS[i % COLORS.length],
    }));
  }, []);

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="particle select-none"
          style={{
            left: p.left,
            bottom: "-20px",
            fontSize: p.size,
            color: p.color,
            animationDuration: `${p.duration}, ${p.swayDuration}`,
            animationDelay: `${p.delay}, ${p.delay}`,
          }}
        >
          {p.symbol}
        </span>
      ))}
    </div>
  );
}
