import { useEffect, useRef, useState } from "react";
import type { Song } from "../types";

interface MiniPlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function MiniPlayer({
  currentSong,
  isPlaying,
  audioRef,
  onPlay,
  onPause,
  onNext,
  onPrev,
}: MiniPlayerProps) {
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const progressRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
        setDuration(audio.duration);
      }
    };
    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", updateProgress);
    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", updateProgress);
    };
  }, [audioRef]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const val = Number.parseFloat(e.target.value);
    audio.currentTime = (val / 100) * audio.duration;
    setProgress(val);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number.parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) audioRef.current.volume = val;
  };

  const fmt = (s: number) => {
    if (!s || Number.isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  if (!currentSong) return null;

  return (
    <div
      className="fixed bottom-4 z-50"
      style={{
        left: "50%",
        transform: "translateX(-50%)",
        width: "calc(100% - 2rem)",
        maxWidth: "900px",
      }}
      data-ocid="mini_player.panel"
    >
      <div
        className="glass-strong rounded-2xl px-4 py-3"
        style={{
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.4), 0 0 20px oklch(0.65 0.27 320 / 15%)",
        }}
      >
        <div className="mb-2">
          <input
            type="range"
            min={0}
            max={100}
            value={progress}
            onChange={handleSeek}
            ref={progressRef}
            className="progress-bar w-full"
            data-ocid="mini_player.progress_bar"
            aria-label="Song progress"
            style={{
              background: `linear-gradient(to right, oklch(0.65 0.27 320) ${progress}%, rgba(255,255,255,0.15) ${progress}%)`,
            }}
          />
        </div>

        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-lg"
            style={{
              background: `linear-gradient(135deg, ${currentSong.gradient[0]}, ${currentSong.gradient[1]})`,
            }}
          >
            \ud83c\udfb5
          </div>

          <div className="flex-1 min-w-0">
            <p
              className="text-sm font-semibold truncate"
              style={{ color: "oklch(0.97 0.01 280)" }}
            >
              {currentSong.title}
            </p>
            <p
              className="text-xs truncate"
              style={{ color: "oklch(0.73 0.04 290)" }}
            >
              {currentSong.artist}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onPrev}
              data-ocid="mini_player.prev_button"
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all hover:scale-110"
              style={{
                color: "oklch(0.73 0.04 290)",
                background: "rgba(255,255,255,0.06)",
              }}
            >
              \u23ee
            </button>
            <button
              type="button"
              onClick={isPlaying ? onPause : onPlay}
              data-ocid="mini_player.play_button"
              className="play-btn w-10 h-10 rounded-full flex items-center justify-center text-white text-sm"
            >
              {isPlaying ? "\u23f8" : "\u25b6"}
            </button>
            <button
              type="button"
              onClick={onNext}
              data-ocid="mini_player.next_button"
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all hover:scale-110"
              style={{
                color: "oklch(0.73 0.04 290)",
                background: "rgba(255,255,255,0.06)",
              }}
            >
              \u23ed
            </button>
          </div>

          <div
            className="hidden sm:block text-xs"
            style={{ color: "oklch(0.73 0.04 290)" }}
          >
            {fmt((progress / 100) * duration)} / {fmt(duration)}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <span className="text-sm" style={{ color: "oklch(0.73 0.04 290)" }}>
              \ud83d\udd0a
            </span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={handleVolume}
              className="volume-slider"
              data-ocid="mini_player.volume_slider"
              aria-label="Volume"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
