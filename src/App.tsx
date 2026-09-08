import React, { useRef, useCallback } from "react";
import { IDCard3D } from "./components/IDCard/IDCard3D";
import { Terminal } from "./components/Terminal/Terminal";
import { profile } from "./data/profile";
import "./App.css";

// ── Icon components ──
const GithubIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const EmailIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const PortfolioIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

// ── Logo ──
const HeaderLogo = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
    <polygon
      points="13,2 24,21 2,21"
      fill="none"
      stroke="#00d4ff"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <polygon
      points="13,7 20,18 6,18"
      fill="rgba(0,212,255,0.12)"
      stroke="rgba(0,212,255,0.25)"
      strokeWidth="0.5"
    />
    <circle cx="13" cy="13" r="2" fill="#00d4ff" />
  </svg>
);

export default function App() {
  const cardCommandRef = useRef<((cmd: string) => void) | null>(null);

  const handleCommand = useCallback((cmd: string) => {
    cardCommandRef.current?.(cmd);
  }, []);

  return (
    <div className="app-root">
      {/* Ambient glow orbs */}
      <div className="glow-orb glow-orb--cyan" />
      <div className="glow-orb glow-orb--purple" />
      <div className="glow-orb glow-orb--center" />

      {/* Grid */}
      <div className="grid-bg" />

      {/* ── Header ── */}
      <header className="header">
        <div className="header__brand">
          <HeaderLogo />
          <span className="header__name">{profile.name}</span>
          <span className="header__sep">•</span>
          <span className="header__role">{profile.role}</span>
        </div>
        <nav className="header__nav">
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link"
          >
            GitHub
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link"
          >
            LinkedIn
          </a>
          <a
            href={profile.portfolio}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link nav-link--accent"
          >
            Portfolio ↗
          </a>
        </nav>
      </header>

      {/* ── Main ── */}
      <main className="main">
        {/* Left — 3D Card */}
        <section className="card-col">
          <p className="hint-text">
            <span className="hint-dot">✦</span>
            Drag to rotate &nbsp;·&nbsp; Type commands below
          </p>
          <IDCard3D commandRef={cardCommandRef} />
          <p className="hint-text hint-text--small">
            Try: &nbsp;
            {["whoami", "card", "flip", "links"].map((cmd) => (
              <code key={cmd} className="hint-cmd">
                {cmd}
              </code>
            ))}
          </p>
        </section>

        {/* Right — Identity + Terminal */}
        <section className="info-col">
          {/* Verified badge */}
          <div className="badge">
            <span className="badge__dot" />
            DEVELOPER IDENTITY VERIFIED
          </div>

          {/* Name + role */}
          <h1 className="identity-name">{profile.name}</h1>
          <p className="identity-role">{profile.role}</p>
          <p className="identity-edu">
            {profile.education} &nbsp;·&nbsp; {profile.university}
          </p>
          <p className="identity-loc">
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ display: "inline", verticalAlign: "middle" }}
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            &nbsp;{profile.location}
          </p>

          {/* Divider */}
          <div className="divider" />

          {/* Terminal */}
          <Terminal onCommand={handleCommand} />

          {/* Quick links */}
          <div className="quick-links">
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="qlink"
            >
              <GithubIcon /> GitHub
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="qlink"
            >
              <LinkedinIcon /> LinkedIn
            </a>
            <a href={`mailto:${profile.email}`} className="qlink">
              <EmailIcon /> Email
            </a>
            <a
              href={profile.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="qlink qlink--accent"
            >
              <PortfolioIcon /> Portfolio
            </a>
          </div>

          {/* Dev ID footer */}
          <div className="dev-id-bar">
            <span>{profile.developerId}</span>
            <span className="dev-id-bar__sep" />
            <span>{profile.university}</span>
            <span className="dev-id-bar__sep" />
            <span>{profile.location}</span>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="footer">
        <span>{profile.name}</span>
        <span className="footer__sep">·</span>
        <span>{profile.developerId}</span>
        <span className="footer__sep">·</span>
        <span>{profile.location}</span>
        <span className="footer__sep">·</span>
        <span>
          Built with React + Physics
        </span>
      </footer>
    </div>
  );
}