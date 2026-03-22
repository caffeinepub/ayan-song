import { useRef, useState } from "react";
import type { Song } from "../types";

const GRADIENTS: [string, string][] = [
  ["oklch(0.65 0.27 320)", "oklch(0.58 0.24 290)"],
  ["oklch(0.58 0.24 290)", "oklch(0.82 0.14 200)"],
  ["oklch(0.82 0.14 200)", "oklch(0.65 0.27 320)"],
  ["oklch(0.70 0.22 260)", "oklch(0.65 0.27 320)"],
  ["oklch(0.60 0.25 310)", "oklch(0.55 0.20 270)"],
  ["oklch(0.75 0.18 340)", "oklch(0.65 0.27 320)"],
];

interface UploadFormProps {
  onUpload: (song: Song) => void;
}

export default function UploadForm({ onUpload }: UploadFormProps) {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      setError("File too large. Maximum size is 20MB.");
      setFileName("");
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    setError("");
    setFileName(file.name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const file = fileRef.current?.files?.[0];
    if (!title.trim()) {
      setError("Please enter a song title.");
      return;
    }
    if (!artist.trim()) {
      setError("Please enter an artist name.");
      return;
    }
    if (!file) {
      setError("Please select an audio file.");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError("File too large. Maximum 20MB.");
      return;
    }

    setUploading(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const song: Song = {
        id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
        title: title.trim(),
        artist: artist.trim(),
        audioBase64: base64,
        uploadedAt: Date.now(),
        gradient: GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)],
      };
      onUpload(song);
      setTitle("");
      setArtist("");
      setFileName("");
      if (fileRef.current) fileRef.current.value = "";
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Failed to read file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="upload-title"
            className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
            style={{ color: "oklch(0.73 0.04 290)" }}
          >
            Song Title
          </label>
          <input
            id="upload-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter song title"
            className="neon-input"
            data-ocid="upload.title_input"
          />
        </div>
        <div>
          <label
            htmlFor="upload-artist"
            className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
            style={{ color: "oklch(0.73 0.04 290)" }}
          >
            Artist Name
          </label>
          <input
            id="upload-artist"
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="Enter artist name"
            className="neon-input"
            data-ocid="upload.artist_input"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="upload-file"
          className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
          style={{ color: "oklch(0.73 0.04 290)" }}
        >
          Audio File (MP3/WAV, max 20MB)
        </label>
        <label
          htmlFor="upload-file"
          className="flex items-center gap-3 cursor-pointer group"
          data-ocid="upload.dropzone"
        >
          <input
            id="upload-file"
            type="file"
            accept=".mp3,.wav,audio/mpeg,audio/wav"
            ref={fileRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <div
            className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed transition-all"
            style={{
              borderColor: fileName
                ? "oklch(0.65 0.27 320 / 60%)"
                : "rgba(255,255,255,0.15)",
              background: fileName
                ? "oklch(0.65 0.27 320 / 8%)"
                : "rgba(255,255,255,0.03)",
            }}
          >
            <span className="text-xl">
              {fileName ? "\ud83c\udfb5" : "\ud83d\udcc1"}
            </span>
            <span
              className="text-sm truncate"
              style={{
                color: fileName
                  ? "oklch(0.97 0.01 280)"
                  : "oklch(0.73 0.04 290)",
              }}
            >
              {fileName || "Click to choose audio file"}
            </span>
          </div>
        </label>
      </div>

      {error && (
        <div
          className="text-sm px-4 py-2.5 rounded-xl"
          data-ocid="upload.error_state"
          style={{
            background: "oklch(0.62 0.22 25 / 15%)",
            color: "oklch(0.75 0.18 25)",
            border: "1px solid oklch(0.62 0.22 25 / 30%)",
          }}
        >
          \u26a0 {error}
        </div>
      )}

      {success && (
        <div
          className="text-sm px-4 py-2.5 rounded-xl"
          data-ocid="upload.success_state"
          style={{
            background: "oklch(0.65 0.18 145 / 15%)",
            color: "oklch(0.75 0.15 145)",
            border: "1px solid oklch(0.65 0.18 145 / 30%)",
          }}
        >
          \u2713 Song uploaded successfully!
        </div>
      )}

      <button
        type="submit"
        disabled={uploading}
        data-ocid="upload.submit_button"
        className="play-btn w-full py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? "\u23f3 Uploading..." : "\u2191 Upload Song"}
      </button>
    </form>
  );
}
