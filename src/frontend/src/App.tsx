import { useCallback, useEffect, useRef, useState } from "react";
import CommunityMessages from "./components/CommunityMessages";
import FloatingParticles from "./components/FloatingParticles";
import Header from "./components/Header";
import Hero from "./components/Hero";
import MiniPlayer from "./components/MiniPlayer";
import SongCard from "./components/SongCard";
import UploadForm from "./components/UploadForm";
import type { Comment, Message, Song } from "./types";

const LS_SONGS = "ayan_songs";
const LS_MESSAGES = "ayan_messages";
const SS_ADMIN = "ayan_admin";

const SAMPLE_SONGS: Song[] = [
  {
    id: "sample_1",
    title: "Neon Dreamscape",
    artist: "Yuki Tanaka",
    audioBase64: "",
    uploadedAt: Date.now() - 86400000 * 3,
    gradient: ["oklch(0.65 0.27 320)", "oklch(0.58 0.24 290)"],
  },
  {
    id: "sample_2",
    title: "Sakura Rain",
    artist: "Hana Miyamoto",
    audioBase64: "",
    uploadedAt: Date.now() - 86400000 * 2,
    gradient: ["oklch(0.82 0.14 200)", "oklch(0.65 0.27 320)"],
  },
  {
    id: "sample_3",
    title: "Cyber Sunset",
    artist: "Ren Okabe",
    audioBase64: "",
    uploadedAt: Date.now() - 86400000,
    gradient: ["oklch(0.58 0.24 290)", "oklch(0.82 0.14 200)"],
  },
  {
    id: "sample_4",
    title: "Tokyo Midnight",
    artist: "Akira Sato",
    audioBase64: "",
    uploadedAt: Date.now() - 86400000 * 5,
    gradient: ["oklch(0.70 0.22 260)", "oklch(0.65 0.27 320)"],
  },
  {
    id: "sample_5",
    title: "Violet Horizon",
    artist: "Mei Suzuki",
    audioBase64: "",
    uploadedAt: Date.now() - 86400000 * 4,
    gradient: ["oklch(0.75 0.18 340)", "oklch(0.58 0.24 290)"],
  },
  {
    id: "sample_6",
    title: "Starfall Lullaby",
    artist: "Kaito Nakamura",
    audioBase64: "",
    uploadedAt: Date.now() - 86400000 * 6,
    gradient: ["oklch(0.65 0.27 320)", "oklch(0.82 0.14 200)"],
  },
];

const SAMPLE_MESSAGES: Message[] = [
  {
    id: "msg_sample_1",
    name: "Ayan Bhai",
    dob: "2007-06-15",
    text: "This music platform is absolutely amazing! The vibes are immaculate \ud83c\udfb5\u2728",
    likes: 24,
    comments: [
      {
        id: "c1",
        name: "Sakura",
        text: "Totally agree! Best music app ever!",
        createdAt: Date.now() - 3600000,
      },
    ],
    createdAt: Date.now() - 86400000,
  },
  {
    id: "msg_sample_2",
    name: "Yuki",
    dob: "",
    text: "Just uploaded my first track. Feeling so blessed to be part of this community \ud83c\udf38",
    likes: 18,
    comments: [],
    createdAt: Date.now() - 43200000,
  },
  {
    id: "msg_sample_3",
    name: "Ryu",
    dob: "2000-03-22",
    text: "Neon Dreamscape just hits different at midnight. Pure anime energy \ud83c\udf19",
    likes: 31,
    comments: [
      {
        id: "c2",
        name: "Hana",
        text: "Facts! That intro is everything.",
        createdAt: Date.now() - 1800000,
      },
      {
        id: "c3",
        name: "Mei",
        text: "Listening to it right now \ud83c\udfa7",
        createdAt: Date.now() - 900000,
      },
    ],
    createdAt: Date.now() - 21600000,
  },
];

const PROMPT_TEXT = `Create a complete single-file HTML/CSS/JS web app called "Ayan Song" with a premium Spotify-like dark theme, smooth animations, and an anime-inspired visual style.

Features:
1. Music Player - Display all songs in a responsive grid. Each song card shows title, artist, play button, pause button. Only one song plays at a time; playback continues while scrolling. Use a hidden audio element to manage playback.
2. Song Upload (Everyone) - Any visitor can upload a song: title, artist, audio file (MP3/WAV, max 20MB). Audio files are stored as base64 in localStorage. Songs persist after page reload.
3. Community Messages - A section where anyone can post a message with name, date of birth (optional), and text. Each message shows: name, age (calculated from DOB if provided), message text, like count, and a comment section. Anyone can like a message (increment like count) and add comments (name + comment text). All messages, likes, and comments are stored in localStorage.
4. Admin Control - Admin password: ayanbhai07682. A login button opens a password prompt. If correct, admin mode is enabled (stored in sessionStorage). Admin sees delete buttons on every song, message, and comment. Admin can delete any content. A logout button appears when admin is logged in.
5. Premium Look & Extra - Dark background with glowing accents, glassmorphism cards, floating particles or gradient animation. A sticky mini-player showing currently playing song. A "Copy Prompt" button that copies the current prompt text to clipboard. Responsive design (mobile, tablet, desktop).`;

export default function App() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSection, setActiveSection] = useState("music");
  const [copied, setCopied] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    try {
      const savedSongs = localStorage.getItem(LS_SONGS);
      const parsed: Song[] = savedSongs ? JSON.parse(savedSongs) : [];
      const userIds = new Set(parsed.map((s) => s.id));
      setSongs([...SAMPLE_SONGS.filter((s) => !userIds.has(s.id)), ...parsed]);
    } catch {
      setSongs(SAMPLE_SONGS);
    }
    try {
      const savedMessages = localStorage.getItem(LS_MESSAGES);
      const parsed: Message[] = savedMessages ? JSON.parse(savedMessages) : [];
      setMessages(parsed.length > 0 ? parsed : SAMPLE_MESSAGES);
    } catch {
      setMessages(SAMPLE_MESSAGES);
    }
    if (sessionStorage.getItem(SS_ADMIN) === "true") setIsAdmin(true);
  }, []);

  const saveSongs = useCallback((updated: Song[]) => {
    localStorage.setItem(
      LS_SONGS,
      JSON.stringify(updated.filter((s) => !s.id.startsWith("sample_"))),
    );
  }, []);

  const saveMessages = useCallback((updated: Message[]) => {
    localStorage.setItem(LS_MESSAGES, JSON.stringify(updated));
  }, []);

  const playSong = useCallback(
    (song: Song) => {
      if (!song.audioBase64) {
        alert(
          `"${song.title}" is a sample track. Upload real audio files to play music!`,
        );
        return;
      }
      const audio = audioRef.current;
      if (!audio) return;
      if (currentSong?.id === song.id) {
        audio
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
        return;
      }
      audio.src = song.audioBase64;
      audio.load();
      audio
        .play()
        .then(() => {
          setCurrentSong(song);
          setIsPlaying(true);
        })
        .catch(() => {
          setCurrentSong(song);
          setIsPlaying(false);
        });
    },
    [currentSong],
  );

  const pauseSong = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
  }, []);
  const resumeSong = useCallback(() => {
    audioRef.current
      ?.play()
      .then(() => setIsPlaying(true))
      .catch(() => {});
  }, []);

  const nextSong = useCallback(() => {
    if (!currentSong) return;
    const idx = songs.findIndex((s) => s.id === currentSong.id);
    playSong(songs[(idx + 1) % songs.length]);
  }, [currentSong, songs, playSong]);

  const prevSong = useCallback(() => {
    if (!currentSong) return;
    const idx = songs.findIndex((s) => s.id === currentSong.id);
    playSong(songs[(idx - 1 + songs.length) % songs.length]);
  }, [currentSong, songs, playSong]);

  const handleAdminLogin = () => {
    const pwd = window.prompt("Enter admin password:");
    if (pwd === "ayanbhai07682") {
      sessionStorage.setItem(SS_ADMIN, "true");
      setIsAdmin(true);
      alert("\u2705 Admin mode activated!");
    } else if (pwd !== null) {
      alert("\u274c Incorrect password.");
    }
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem(SS_ADMIN);
    setIsAdmin(false);
  };

  const handleUpload = (song: Song) => {
    const updated = [...songs, song];
    setSongs(updated);
    saveSongs(updated);
  };

  const handleDeleteSong = (id: string) => {
    const updated = songs.filter((s) => s.id !== id);
    setSongs(updated);
    saveSongs(updated);
    if (currentSong?.id === id) {
      audioRef.current?.pause();
      setCurrentSong(null);
      setIsPlaying(false);
    }
  };

  const handlePostMessage = (name: string, dob: string, text: string) => {
    const msg: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      name,
      dob,
      text,
      likes: 0,
      comments: [],
      createdAt: Date.now(),
    };
    const updated = [msg, ...messages];
    setMessages(updated);
    saveMessages(updated);
  };

  const handleLike = (id: string) => {
    const updated = messages.map((m) =>
      m.id === id ? { ...m, likes: m.likes + 1 } : m,
    );
    setMessages(updated);
    saveMessages(updated);
  };

  const handleComment = (msgId: string, name: string, text: string) => {
    const comment: Comment = {
      id: `c_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      name,
      text,
      createdAt: Date.now(),
    };
    const updated = messages.map((m) =>
      m.id === msgId ? { ...m, comments: [...m.comments, comment] } : m,
    );
    setMessages(updated);
    saveMessages(updated);
  };

  const handleDeleteMessage = (id: string) => {
    const updated = messages.filter((m) => m.id !== id);
    setMessages(updated);
    saveMessages(updated);
  };

  const handleDeleteComment = (msgId: string, commentId: string) => {
    const updated = messages.map((m) =>
      m.id === msgId
        ? { ...m, comments: m.comments.filter((c) => c.id !== commentId) }
        : m,
    );
    setMessages(updated);
    saveMessages(updated);
  };

  const handleNavigate = (section: string) => {
    setActiveSection(section);
    if (section === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    document
      .getElementById(section)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleCopyPrompt = () => {
    navigator.clipboard
      .writeText(PROMPT_TEXT)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        const ta = document.createElement("textarea");
        ta.value = PROMPT_TEXT;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnd = () => nextSong();
    audio.addEventListener("ended", onEnd);
    return () => audio.removeEventListener("ended", onEnd);
  }, [nextSong]);

  const userSongs = songs.filter((s) => !s.id.startsWith("sample_"));
  const sampleSongs = songs.filter((s) => s.id.startsWith("sample_"));

  return (
    <div className="min-h-screen bg-anime relative">
      {/* biome-ignore lint/a11y/useMediaCaption: background music player with no captions needed */}
      <audio ref={audioRef} style={{ display: "none" }} />

      <FloatingParticles />

      <div className="relative" style={{ zIndex: 1 }}>
        <Header
          isAdmin={isAdmin}
          onAdminLogin={handleAdminLogin}
          onAdminLogout={handleAdminLogout}
          onCopyPrompt={handleCopyPrompt}
          copied={copied}
          activeSection={activeSection}
          onNavigate={handleNavigate}
        />

        <main>
          <Hero onNavigate={handleNavigate} />

          {/* Music Library */}
          <section id="music" className="py-12 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="mb-6">
                <h2
                  className="text-xl font-bold uppercase tracking-widest"
                  style={{
                    background:
                      "linear-gradient(90deg, oklch(0.65 0.27 320), oklch(0.82 0.14 200))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  \ud83c\udfb5 Music Library
                </h2>
                <p
                  className="text-xs mt-1"
                  style={{ color: "oklch(0.73 0.04 290)" }}
                >
                  {songs.length} tracks available
                </p>
              </div>

              {userSongs.length > 0 && (
                <>
                  <h3
                    className="text-sm font-semibold uppercase tracking-widest mb-3"
                    style={{ color: "oklch(0.82 0.14 200)" }}
                  >
                    \u2726 Community Uploads
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
                    {userSongs.map((song, i) => (
                      <SongCard
                        key={song.id}
                        song={song}
                        index={i}
                        isPlaying={isPlaying}
                        isCurrent={currentSong?.id === song.id}
                        onPlay={playSong}
                        onPause={pauseSong}
                        isAdmin={isAdmin}
                        onDelete={handleDeleteSong}
                      />
                    ))}
                  </div>
                </>
              )}

              <h3
                className="text-sm font-semibold uppercase tracking-widest mb-3"
                style={{ color: "oklch(0.65 0.27 320)" }}
              >
                \u2726 Recommended For You
              </h3>
              {sampleSongs.length === 0 ? (
                <div
                  className="text-center py-12"
                  data-ocid="music.empty_state"
                  style={{ color: "oklch(0.73 0.04 290)" }}
                >
                  <div className="text-4xl mb-3">\ud83c\udfb5</div>
                  <p className="text-sm">No songs yet. Upload the first one!</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {sampleSongs.map((song, i) => (
                    <SongCard
                      key={song.id}
                      song={song}
                      index={userSongs.length + i}
                      isPlaying={isPlaying}
                      isCurrent={currentSong?.id === song.id}
                      onPlay={playSong}
                      onPause={pauseSong}
                      isAdmin={isAdmin}
                      onDelete={handleDeleteSong}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Upload */}
          <section id="upload" className="py-12 px-4">
            <div className="max-w-2xl mx-auto">
              <div className="mb-6">
                <h2
                  className="text-xl font-bold uppercase tracking-widest"
                  style={{
                    background:
                      "linear-gradient(90deg, oklch(0.82 0.14 200), oklch(0.65 0.27 320))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  \u2191 Upload a Song
                </h2>
                <p
                  className="text-xs mt-1"
                  style={{ color: "oklch(0.73 0.04 290)" }}
                >
                  Share your music with the community. MP3 or WAV, max 20MB.
                </p>
              </div>
              <div
                className="glass rounded-2xl p-6"
                style={{ border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <UploadForm onUpload={handleUpload} />
              </div>
            </div>
          </section>

          {/* Community */}
          <section id="community" className="py-12 px-4 pb-32">
            <div className="max-w-3xl mx-auto">
              <div className="mb-6">
                <h2
                  className="text-xl font-bold uppercase tracking-widest"
                  style={{
                    background:
                      "linear-gradient(90deg, oklch(0.65 0.27 320), oklch(0.82 0.14 200))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  \ud83d\udcac Community
                </h2>
                <p
                  className="text-xs mt-1"
                  style={{ color: "oklch(0.73 0.04 290)" }}
                >
                  Share your thoughts, connect with fellow music lovers.
                </p>
              </div>
              <CommunityMessages
                messages={messages}
                isAdmin={isAdmin}
                onPostMessage={handlePostMessage}
                onLike={handleLike}
                onComment={handleComment}
                onDeleteMessage={handleDeleteMessage}
                onDeleteComment={handleDeleteComment}
              />
            </div>
          </section>
        </main>

        <footer
          className="glass py-8 px-4"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            marginBottom: currentSong ? "80px" : "0",
          }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.65 0.27 320), oklch(0.58 0.24 290))",
                  }}
                >
                  A
                </div>
                <span
                  className="font-bold text-sm"
                  style={{
                    background:
                      "linear-gradient(90deg, oklch(0.65 0.27 320), oklch(0.82 0.14 200))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Ayan Song
                </span>
              </div>
              <div
                className="flex gap-6 text-xs"
                style={{ color: "oklch(0.73 0.04 290)" }}
              >
                <button
                  type="button"
                  onClick={() => handleNavigate("music")}
                  data-ocid="footer.music_link"
                  className="hover:text-white transition-colors"
                >
                  Music
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigate("upload")}
                  data-ocid="footer.upload_link"
                  className="hover:text-white transition-colors"
                >
                  Upload
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigate("community")}
                  data-ocid="footer.community_link"
                  className="hover:text-white transition-colors"
                >
                  Community
                </button>
              </div>
              <p
                className="text-xs"
                style={{ color: "oklch(0.73 0.04 290 / 60%)" }}
              >
                \u00a9 {new Date().getFullYear()}. Built with{" "}
                <span style={{ color: "oklch(0.65 0.27 320)" }}>\u2665</span>{" "}
                using{" "}
                <a
                  href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                  style={{ color: "oklch(0.73 0.04 290)" }}
                >
                  caffeine.ai
                </a>
              </p>
            </div>
          </div>
        </footer>
      </div>

      <MiniPlayer
        currentSong={currentSong}
        isPlaying={isPlaying}
        audioRef={audioRef}
        onPlay={resumeSong}
        onPause={pauseSong}
        onNext={nextSong}
        onPrev={prevSong}
      />

      <style>{`
        @keyframes bounce {
          from { transform: scaleY(0.4); }
          to   { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}
