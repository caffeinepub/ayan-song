import { useState } from "react";

interface HeaderProps {
  isAdmin: boolean;
  onAdminLogin: () => void;
  onAdminLogout: () => void;
  onCopyPrompt: () => void;
  copied: boolean;
  activeSection: string;
  onNavigate: (section: string) => void;
}

export default function Header({
  isAdmin,
  onAdminLogin,
  onAdminLogout,
  onCopyPrompt,
  copied,
  activeSection,
  onNavigate,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { id: "music", label: "Music" },
    { id: "upload", label: "Upload" },
    { id: "community", label: "Community" },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 glass"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            type="button"
            className="flex items-center gap-2.5 group"
            onClick={() => onNavigate("top")}
            data-ocid="nav.link"
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black text-white"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.65 0.27 320), oklch(0.58 0.24 290))",
                boxShadow: "0 0 12px oklch(0.65 0.27 320 / 50%)",
              }}
            >
              A
            </div>
            <span
              className="text-lg font-bold tracking-tight"
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.65 0.27 320), oklch(0.82 0.14 200))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Ayan Song
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => onNavigate(link.id)}
                data-ocid="nav.link"
                className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
                style={{
                  color:
                    activeSection === link.id
                      ? "oklch(0.65 0.27 320)"
                      : "oklch(0.73 0.04 290)",
                  background:
                    activeSection === link.id
                      ? "oklch(0.65 0.27 320 / 12%)"
                      : "transparent",
                }}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCopyPrompt}
              data-ocid="header.copy_prompt_button"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
              style={{
                background: "oklch(0.82 0.14 200 / 15%)",
                color: "oklch(0.82 0.14 200)",
                border: "1px solid oklch(0.82 0.14 200 / 30%)",
              }}
            >
              {copied ? "\u2713 Copied!" : "\u29c9 Copy Prompt"}
            </button>

            {isAdmin ? (
              <button
                type="button"
                onClick={onAdminLogout}
                data-ocid="header.admin_logout_button"
                className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                style={{
                  background: "oklch(0.62 0.22 25 / 20%)",
                  color: "oklch(0.75 0.18 25)",
                  border: "1px solid oklch(0.62 0.22 25 / 40%)",
                }}
              >
                Logout Admin
              </button>
            ) : (
              <button
                type="button"
                onClick={onAdminLogin}
                data-ocid="header.admin_login_button"
                className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                style={{
                  background: "oklch(0.65 0.27 320 / 15%)",
                  color: "oklch(0.65 0.27 320)",
                  border: "1px solid oklch(0.65 0.27 320 / 30%)",
                }}
              >
                Admin
              </button>
            )}

            <button
              type="button"
              className="md:hidden p-2 rounded-lg"
              onClick={() => setMenuOpen(!menuOpen)}
              data-ocid="header.mobile_menu_button"
              style={{ color: "oklch(0.73 0.04 290)" }}
            >
              {menuOpen ? "\u2715" : "\u2630"}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div
            className="md:hidden pb-4 pt-2"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => {
                  onNavigate(link.id);
                  setMenuOpen(false);
                }}
                data-ocid="nav.link"
                className="block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
                style={{ color: "oklch(0.73 0.04 290)" }}
              >
                {link.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                onCopyPrompt();
                setMenuOpen(false);
              }}
              data-ocid="header.copy_prompt_button"
              className="block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={{ color: "oklch(0.82 0.14 200)" }}
            >
              {copied ? "\u2713 Copied!" : "\u29c9 Copy Prompt"}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
