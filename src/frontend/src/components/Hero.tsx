interface HeroProps {
  onNavigate: (section: string) => void;
}

const HERO_NOTES = [
  { symbol: "\u266a", top: "10%", left: "80%" },
  { symbol: "\u266b", top: "80%", left: "85%" },
  { symbol: "\u266c", top: "60%", left: "5%" },
  { symbol: "\u2726", top: "20%", left: "15%" },
];

export default function Hero({ onNavigate }: HeroProps) {
  return (
    <section className="relative pt-24 pb-16 px-4">
      <div
        className="hero-orb absolute top-10 right-10 w-64 h-64 rounded-full blur-3xl pointer-events-none"
        style={{ background: "oklch(0.65 0.27 320 / 20%)" }}
      />
      <div
        className="hero-orb absolute bottom-0 left-20 w-48 h-48 rounded-full blur-3xl pointer-events-none"
        style={{
          background: "oklch(0.58 0.24 290 / 25%)",
          animationDelay: "3s",
        }}
      />
      <div
        className="hero-orb absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{
          background: "oklch(0.82 0.14 200 / 8%)",
          animationDelay: "1.5s",
        }}
      />

      <div className="max-w-7xl mx-auto">
        <div className="glass rounded-2xl p-8 md:p-12 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1 animate-slide-up">
              <div
                className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
                style={{
                  background: "oklch(0.65 0.27 320 / 15%)",
                  color: "oklch(0.65 0.27 320)",
                  border: "1px solid oklch(0.65 0.27 320 / 30%)",
                }}
              >
                \u2728 Premium Music Experience
              </div>
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-black uppercase leading-tight mb-4"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.97 0.01 280) 0%, oklch(0.65 0.27 320) 50%, oklch(0.82 0.14 200) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Feel Every
                <br />
                Beat, Live
                <br />
                Every Moment
              </h1>
              <p
                className="text-sm md:text-base mb-8 leading-relaxed max-w-md"
                style={{ color: "oklch(0.73 0.04 290)" }}
              >
                Discover, upload, and share your favorite music with the
                community. A premium anime-inspired music platform built for
                true music lovers.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate("music")}
                  data-ocid="hero.primary_button"
                  className="play-btn px-6 py-2.5 rounded-full text-sm font-semibold text-white"
                >
                  \u25b6 Start Listening
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate("upload")}
                  data-ocid="hero.secondary_button"
                  className="px-6 py-2.5 rounded-full text-sm font-semibold transition-all"
                  style={{
                    background: "transparent",
                    color: "oklch(0.82 0.14 200)",
                    border: "1px solid oklch(0.82 0.14 200 / 50%)",
                  }}
                >
                  \u2191 Upload Song
                </button>
              </div>
            </div>

            <div className="flex-shrink-0 relative w-64 h-64 lg:w-80 lg:h-80">
              <div
                className="absolute inset-0 rounded-full blur-2xl"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.65 0.27 320 / 40%), oklch(0.58 0.24 290 / 40%))",
                }}
              />
              <div
                className="absolute inset-4 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.65 0.27 320 / 20%), oklch(0.58 0.24 290 / 20%))",
                  border: "2px solid oklch(0.65 0.27 320 / 30%)",
                }}
              >
                <div className="text-center">
                  <div
                    className="text-7xl mb-2"
                    style={{
                      filter: "drop-shadow(0 0 20px oklch(0.65 0.27 320))",
                      lineHeight: 1,
                    }}
                  >
                    \ud83c\udfa7
                  </div>
                  <div className="text-2xl">\u266a \u266b \u266c</div>
                </div>
              </div>
              <div
                className="absolute inset-0 rounded-full border animate-spin"
                style={{
                  borderColor: "oklch(0.65 0.27 320 / 20%)",
                  animationDuration: "8s",
                }}
              />
              <div
                className="absolute inset-3 rounded-full border animate-spin"
                style={{
                  borderColor: "oklch(0.82 0.14 200 / 15%)",
                  animationDuration: "12s",
                  animationDirection: "reverse",
                }}
              />
              {HERO_NOTES.map((note, i) => (
                <span
                  key={note.symbol}
                  className="absolute text-xl"
                  style={{
                    color:
                      i % 2 === 0
                        ? "oklch(0.65 0.27 320 / 80%)"
                        : "oklch(0.82 0.14 200 / 80%)",
                    top: note.top,
                    left: note.left,
                    animation: `float-up ${6 + i}s ease-in-out infinite`,
                    animationDelay: `${i * 1.2}s`,
                  }}
                >
                  {note.symbol}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
