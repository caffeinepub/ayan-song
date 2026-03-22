import { useState } from "react";
import type { Comment, Message } from "../types";

function calcAge(dob: string): number | null {
  if (!dob) return null;
  const birth = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age >= 0 ? age : null;
}

const AVATAR_COLORS = [
  "linear-gradient(135deg, oklch(0.65 0.27 320), oklch(0.58 0.24 290))",
  "linear-gradient(135deg, oklch(0.58 0.24 290), oklch(0.82 0.14 200))",
  "linear-gradient(135deg, oklch(0.82 0.14 200), oklch(0.70 0.22 260))",
  "linear-gradient(135deg, oklch(0.70 0.22 260), oklch(0.65 0.27 320))",
];

interface MessageCardProps {
  message: Message;
  index: number;
  isAdmin: boolean;
  onLike: (id: string) => void;
  onComment: (msgId: string, name: string, text: string) => void;
  onDeleteMessage: (id: string) => void;
  onDeleteComment: (msgId: string, commentId: string) => void;
}

function MessageCard({
  message,
  index,
  isAdmin,
  onLike,
  onComment,
  onDeleteMessage,
  onDeleteComment,
}: MessageCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [likeAnim, setLikeAnim] = useState(false);

  const age = message.dob ? calcAge(message.dob) : null;
  const avatarGrad = AVATAR_COLORS[index % AVATAR_COLORS.length];

  const handleLike = () => {
    setLikeAnim(true);
    onLike(message.id);
    setTimeout(() => setLikeAnim(false), 400);
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim()) return;
    onComment(message.id, commentName.trim(), commentText.trim());
    setCommentName("");
    setCommentText("");
  };

  return (
    <div
      className="message-card glass rounded-xl p-4"
      data-ocid={`message.item.${index + 1}`}
      style={{ border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
            style={{ background: avatarGrad }}
          >
            {message.name[0]?.toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className="text-sm font-semibold"
                style={{ color: "oklch(0.97 0.01 280)" }}
              >
                {message.name}
              </span>
              {age !== null && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background: "oklch(0.65 0.27 320 / 15%)",
                    color: "oklch(0.65 0.27 320)",
                  }}
                >
                  {age}y
                </span>
              )}
            </div>
            <div className="text-xs" style={{ color: "oklch(0.73 0.04 290)" }}>
              {new Date(message.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
        {isAdmin && (
          <button
            type="button"
            onClick={() => onDeleteMessage(message.id)}
            data-ocid={`message.delete_button.${index + 1}`}
            className="text-xs px-2 py-1 rounded-lg transition-all"
            style={{
              background: "oklch(0.62 0.22 25 / 20%)",
              color: "oklch(0.75 0.18 25)",
              border: "1px solid oklch(0.62 0.22 25 / 30%)",
            }}
          >
            \u2715 Delete
          </button>
        )}
      </div>

      <p
        className="text-sm leading-relaxed mb-3"
        style={{ color: "oklch(0.90 0.01 280)" }}
      >
        {message.text}
      </p>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleLike}
          data-ocid={`message.like_button.${index + 1}`}
          className="flex items-center gap-1.5 text-sm transition-all"
          style={{ color: "oklch(0.65 0.27 320)" }}
        >
          <span className={likeAnim ? "like-pop" : ""}>\u2665</span>
          <span className="font-semibold">{message.likes}</span>
        </button>
        <button
          type="button"
          onClick={() => setShowComments(!showComments)}
          data-ocid={`message.comments_toggle.${index + 1}`}
          className="flex items-center gap-1.5 text-xs transition-all"
          style={{ color: "oklch(0.73 0.04 290)" }}
        >
          \ud83d\udcac {message.comments.length} comment
          {message.comments.length !== 1 ? "s" : ""}
        </button>
      </div>

      {showComments && (
        <div
          className="mt-3 pt-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          {message.comments.length === 0 ? (
            <p
              className="text-xs mb-3"
              style={{ color: "oklch(0.73 0.04 290)" }}
            >
              No comments yet. Be the first!
            </p>
          ) : (
            <div className="space-y-2 mb-3">
              {message.comments.map((c, ci) => (
                <div key={c.id} className="flex items-start gap-2">
                  <div
                    className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
                    style={{
                      background:
                        AVATAR_COLORS[(ci + 1) % AVATAR_COLORS.length],
                    }}
                  >
                    {c.name[0]?.toUpperCase()}
                  </div>
                  <div
                    className="flex-1 px-3 py-2 rounded-lg text-xs"
                    data-ocid={`message.comment.${index + 1}`}
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <span
                      className="font-semibold mr-2"
                      style={{ color: "oklch(0.82 0.14 200)" }}
                    >
                      {c.name}
                    </span>
                    <span style={{ color: "oklch(0.90 0.01 280)" }}>
                      {c.text}
                    </span>
                  </div>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => onDeleteComment(message.id, c.id)}
                      data-ocid={`message.comment_delete_button.${index + 1}`}
                      className="text-xs w-5 h-5 flex items-center justify-center rounded flex-shrink-0"
                      style={{
                        color: "oklch(0.75 0.18 25)",
                        background: "oklch(0.62 0.22 25 / 20%)",
                      }}
                      title="Delete comment"
                    >
                      \u2715
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleComment} className="flex gap-2">
            <input
              id={`comment-name-${message.id}`}
              type="text"
              value={commentName}
              onChange={(e) => setCommentName(e.target.value)}
              placeholder="Name"
              className="neon-input"
              data-ocid="message.comment_name_input"
              style={{
                flex: "0 0 90px",
                fontSize: "12px",
                padding: "6px 10px",
              }}
            />
            <input
              id={`comment-text-${message.id}`}
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment\u2026"
              className="neon-input"
              data-ocid="message.comment_text_input"
              style={{ fontSize: "12px", padding: "6px 10px" }}
            />
            <button
              type="submit"
              data-ocid="message.comment_submit_button"
              className="play-btn flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

interface CommunityMessagesProps {
  messages: Message[];
  isAdmin: boolean;
  onPostMessage: (name: string, dob: string, text: string) => void;
  onLike: (id: string) => void;
  onComment: (msgId: string, name: string, text: string) => void;
  onDeleteMessage: (id: string) => void;
  onDeleteComment: (msgId: string, commentId: string) => void;
}

export default function CommunityMessages({
  messages,
  isAdmin,
  onPostMessage,
  onLike,
  onComment,
  onDeleteMessage,
  onDeleteComment,
}: CommunityMessagesProps) {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!text.trim()) {
      setError("Please enter a message.");
      return;
    }
    onPostMessage(name.trim(), dob, text.trim());
    setName("");
    setDob("");
    setText("");
    setError("");
  };

  return (
    <div className="space-y-6">
      <div
        className="glass rounded-2xl p-6"
        style={{ border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <h3
          className="text-sm font-bold uppercase tracking-widest mb-4"
          style={{ color: "oklch(0.65 0.27 320)" }}
        >
          \ud83d\udcac Share Your Thoughts
        </h3>
        <form onSubmit={handlePost} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="community-name"
                className="block text-xs font-semibold mb-1 uppercase tracking-wider"
                style={{ color: "oklch(0.73 0.04 290)" }}
              >
                Name
              </label>
              <input
                id="community-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="neon-input"
                data-ocid="community.name_input"
              />
            </div>
            <div>
              <label
                htmlFor="community-dob"
                className="block text-xs font-semibold mb-1 uppercase tracking-wider"
                style={{ color: "oklch(0.73 0.04 290)" }}
              >
                Date of Birth{" "}
                <span style={{ color: "oklch(0.73 0.04 290 / 50%)" }}>
                  (optional)
                </span>
              </label>
              <input
                id="community-dob"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="neon-input"
                data-ocid="community.dob_input"
                style={{ colorScheme: "dark" }}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="community-message"
              className="block text-xs font-semibold mb-1 uppercase tracking-wider"
              style={{ color: "oklch(0.73 0.04 290)" }}
            >
              Message
            </label>
            <textarea
              id="community-message"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What's on your mind?"
              rows={3}
              className="neon-input resize-none"
              data-ocid="community.message_textarea"
            />
          </div>
          {error && (
            <div
              className="text-xs px-3 py-2 rounded-lg"
              data-ocid="community.error_state"
              style={{
                background: "oklch(0.62 0.22 25 / 15%)",
                color: "oklch(0.75 0.18 25)",
                border: "1px solid oklch(0.62 0.22 25 / 30%)",
              }}
            >
              \u26a0 {error}
            </div>
          )}
          <button
            type="submit"
            data-ocid="community.submit_button"
            className="play-btn w-full py-2.5 rounded-xl text-sm font-semibold text-white"
          >
            Post Message
          </button>
        </form>
      </div>

      {messages.length === 0 ? (
        <div
          className="text-center py-12"
          data-ocid="community.empty_state"
          style={{ color: "oklch(0.73 0.04 290)" }}
        >
          <div className="text-4xl mb-3">\ud83d\udcac</div>
          <p className="text-sm">No messages yet. Be the first to share!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg, i) => (
            <MessageCard
              key={msg.id}
              message={msg}
              index={i}
              isAdmin={isAdmin}
              onLike={onLike}
              onComment={onComment}
              onDeleteMessage={onDeleteMessage}
              onDeleteComment={onDeleteComment}
            />
          ))}
        </div>
      )}
    </div>
  );
}
