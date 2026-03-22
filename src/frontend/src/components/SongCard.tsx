import type { Song } from "../types";

interface SongCardProps {
  song: Song;
  index: number;
  isPlaying: boolean;
  isCurrent: boolean;
  onPlay: (song: Song) => void;
  onPause: () => void;
  isAdmin: boolean;
  onDelete: (id: string) => void;
}

export default function SongCard({
  song,
  index,
  isPlaying,
  isCurrent,
  onPlay,
  onPause,
  isAdmin,
  onDelete,
}: SongCardProps) {
  const isCurrentlyPlaying = isCurrent && isPlaying;

  return (
    <div
      className={`song-card glass rounded-2xl overflow-hidden ${isCurrent ? "playing" : ""}`}
      data-ocid={`song.item.${index + 1}`}
      style={{ border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <div
        className="relative h-40 flex items-center justify-center overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${song.gradient[0]}, ${song.gradient[1]})`,
        }}
      >
        <div className="text-5xl opacity-60">\ud83c\udfb5</div>
        {isCurrent && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex gap-1 items-end" style={{ height: "32px" }}>
              {[1, 2, 3, 4].map((bar) => (
                <div
                  key={bar}
                  className="w-1.5 rounded-full"
                  style={{
                    background: "oklch(0.65 0.27 320)",
                    height: isCurrentlyPlaying ? `${20 + bar * 5}px` : "8px",
                    transition: "height 0.3s ease",
                    animation: isCurrentlyPlaying
                      ? `bounce ${0.4 + bar * 0.1}s ease-in-out infinite alternate`
                      : "none",
                    boxShadow: "0 0 6px oklch(0.65 0.27 320)",
                  }}
                />
              ))}
            </div>
          </div>
        )}
        {isAdmin && (
          <button
            type="button"
            onClick={() => onDelete(song.id)}
            data-ocid={`song.delete_button.${index + 1}`}
            className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
            style={{
              background: "oklch(0.62 0.22 25 / 80%)",
              color: "white",
              border: "1px solid oklch(0.62 0.22 25)",
            }}
            title="Delete song"
          >
            \u2715
          </button>
        )}
      </div>

      <div className="p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p
              className="text-sm font-semibold truncate"
              style={{ color: "oklch(0.97 0.01 280)" }}
            >
              {song.title}
            </p>
            <p
              className="text-xs truncate mt-0.5"
              style={{ color: "oklch(0.73 0.04 290)" }}
            >
              {song.artist}
            </p>
          </div>
          <button
            type="button"
            onClick={() => (isCurrentlyPlaying ? onPause() : onPlay(song))}
            data-ocid={`song.play_button.${index + 1}`}
            className={`play-btn flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white text-xs ${
              isCurrent ? "playing-pulse" : ""
            }`}
            title={isCurrentlyPlaying ? "Pause" : "Play"}
          >
            {isCurrentlyPlaying ? "\u23f8" : "\u25b6"}
          </button>
        </div>
      </div>
    </div>
  );
}
