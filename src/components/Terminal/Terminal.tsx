import React, {
  useState, useRef, useEffect,
  useCallback, KeyboardEvent, FormEvent,
} from "react";
import { profile } from "../../data/profile";

// ─────────────────────────────────────
//  Types
// ─────────────────────────────────────
interface Line {
  id:   number;
  type: "prompt" | "output" | "error" | "system" | "gap" | "visual";
  text: string;
  jsx?: React.ReactNode;
}
type Handler = (p: typeof profile) => string | React.ReactNode;

// ─────────────────────────────────────
//  Glitch Banner
// ─────────────────────────────────────
const ART_LINES = [
  " ██████╗ ███████╗██╗   ██╗",
  " ██╔══██╗██╔════╝██║   ██║",
  " ██║  ██║█████╗  ██║   ██║",
  " ██║  ██║██╔══╝   ╚██╗██╔╝",
  " ██████╔╝███████╗  ╚████╔╝ ",
  " ╚═════╝ ╚══════╝   ╚═══╝  ",
];
const GLITCH_CHARS = "!@#$%*\\/█▓▒░<>{}";

const GlitchBanner: React.FC = () => {
  const [html, setHtml] = useState("");

  useEffect(() => {
    const render = () => {
      const out = ART_LINES.map(line =>
        line.split("").map(c => {
          if (c === " ") return " ";
          const r = Math.random();
          if (r < 0.022) {
            const g = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
            return `<span style="color:#ff2255">${g}</span>`;
          }
          if (r < 0.055) return `<span style="color:#00ffaa">${c}</span>`;
          if (r < 0.075) {
            const g = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
            return `<span style="color:#ffffff">${g}</span>`;
          }
          return `<span style="color:#2ecc71">${c}</span>`;
        }).join("")
      ).join("\n");
      setHtml(out);
    };
    render();
    const iv = setInterval(render, 80);
    return () => clearInterval(iv);
  }, []);

  return (
    <pre
      dangerouslySetInnerHTML={{ __html: html }}
      style={{
        fontSize:     "11px",
        lineHeight:   "1.28",
        letterSpacing:"0.02em",
        fontFamily:   "inherit",
        userSelect:   "none",
        margin:       0,
        padding:      "4px 14px",
      }}
    />
  );
};

// ─────────────────────────────────────
//  Terminal-style flickering bar
// ─────────────────────────────────────
const TermBar: React.FC<{
  name:    string;
  percent: number;
  delay?:  number;
  width?:  number;  // total bar width in chars
}> = ({ name, percent, delay = 0, width = 20 }) => {
  const [displayed, setDisplayed] = useState(0);
  const [flicker,   setFlicker]   = useState(false);

  // Animate fill
  useEffect(() => {
    const t = setTimeout(() => {
      let cur = 0;
      const step = setInterval(() => {
        cur += Math.ceil(percent / 18);
        if (cur >= percent) {
          cur = percent;
          clearInterval(step);
        }
        setDisplayed(cur);
      }, 28);
      return () => clearInterval(step);
    }, delay);
    return () => clearTimeout(t);
  }, [percent, delay]);

  // Random flicker
  useEffect(() => {
    const iv = setInterval(() => {
      if (Math.random() < 0.06) {
        setFlicker(true);
        setTimeout(() => setFlicker(false), 60 + Math.random() * 80);
      }
    }, 120);
    return () => clearInterval(iv);
  }, []);

  const filled = Math.round((displayed / 100) * width);
  const empty  = width - filled;

  // Colour by value
  const col =
    displayed >= 80 ? "#3fb950" :
    displayed >= 60 ? "#58a6ff" :
    displayed >= 40 ? "#d29922" :
    "#f85149";

  const bar = "█".repeat(filled) + "░".repeat(empty);

  return (
    <div style={{
      display:    "flex",
      alignItems: "center",
      gap:        "8px",
      fontFamily: "inherit",
      fontSize:   "11px",
      opacity:    flicker ? 0.55 : 1,
      transition: "opacity 0.04s",
      padding:    "1px 0",
    }}>
      {/* Name */}
      <span style={{
        color:     "#6e7681",
        width:     "82px",
        flexShrink:0,
        fontSize:  "10px",
      }}>
        {name}
      </span>

      {/* Bar */}
      <span style={{
        color:        col,
        letterSpacing:"1px",
        fontFamily:   "inherit",
        textShadow:   `0 0 6px ${col}66`,
      }}>
        [{bar}]
      </span>

      {/* Percent */}
      <span style={{
        color:     col,
        width:     "36px",
        textAlign: "right",
        fontSize:  "10px",
        flexShrink:0,
      }}>
        {displayed}%
      </span>
    </div>
  );
};

// ─────────────────────────────────────
//  Visual sections
// ─────────────────────────────────────

const ProjectsVisual: React.FC<{ p: typeof profile }> = ({ p }) => (
  <div style={{ padding: "6px 14px" }}>
    {p.projects.map((proj, pi) => (
      <div key={pi} style={{
        marginBottom: "14px",
        padding:      "10px 12px",
        background:   "#080b10",
        border:       "1px solid #1c2128",
        borderRadius: "4px",
        borderLeft:   "2px solid #58a6ff",
      }}>
        {/* Header */}
        <div style={{
          display:        "flex",
          justifyContent: "space-between",
          alignItems:     "center",
          marginBottom:   "5px",
        }}>
          <span style={{
            fontSize:   "11px",
            color:      "#e6edf3",
            fontWeight: "600",
            fontFamily: "inherit",
          }}>
            {proj.name}
          </span>
          <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
            <span style={{
              fontSize:  "9px",
              color:     proj.status === "Live"
                ? "#3fb950"
                : proj.status === "In Progress"
                ? "#d29922"
                : "#6e7681",
              fontFamily:"inherit",
            }}>
              [{proj.status}]
            </span>
            <span style={{ fontSize:"9px", color:"#484f58", fontFamily:"inherit" }}>
              {proj.year}
            </span>
          </div>
        </div>

        {/* Description */}
        <div style={{
          fontSize:    "10px",
          color:       "#6e7681",
          marginBottom:"8px",
          lineHeight:  "1.5",
          fontFamily:  "inherit",
        }}>
          {proj.description}
        </div>

        {/* Terminal bars */}
        <div style={{
          background:   "#030507",
          border:       "1px solid #161b22",
          borderRadius: "3px",
          padding:      "7px 10px",
          marginBottom: "6px",
        }}>
          <div style={{
            fontSize:     "9px",
            color:        "#484f58",
            marginBottom: "5px",
            fontFamily:   "inherit",
            letterSpacing:"0.5px",
          }}>
            $ tech-stack --percentages
          </div>
          {proj.tech.map((t, ti) => (
            <TermBar
              key={ti}
              name={t.name}
              percent={t.percent}
              delay={pi * 120 + ti * 80}
              width={20}
            />
          ))}
        </div>

        {/* Link */}
        <div style={{
          fontSize:  "9px",
          color:     "#484f58",
          fontFamily:"inherit",
        }}>
          ↗ {proj.link}
        </div>
      </div>
    ))}
  </div>
);

const ExperienceVisual: React.FC<{ p: typeof profile }> = ({ p }) => (
  <div style={{ padding: "6px 14px" }}>
    {p.experience.map((exp, ei) => (
      <div key={ei} style={{
        marginBottom: "12px",
        padding:      "10px 12px",
        background:   "#080b10",
        border:       "1px solid #1c2128",
        borderRadius: "4px",
        borderLeft:   "2px solid #3fb950",
      }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"3px" }}>
          <span style={{ fontSize:"11px", color:"#e6edf3", fontWeight:"600", fontFamily:"inherit" }}>
            {exp.role}
          </span>
          <span style={{ fontSize:"9px", color:"#484f58", fontFamily:"inherit" }}>
            {exp.duration}
          </span>
        </div>
        <div style={{ fontSize:"10px", color:"#58a6ff", marginBottom:"7px", fontFamily:"inherit" }}>
          {exp.company}
        </div>
        {exp.points.map((pt, pti) => (
          <div key={pti} style={{
            fontSize:    "10px",
            color:       "#6e7681",
            marginBottom:"3px",
            lineHeight:  "1.5",
            fontFamily:  "inherit",
            paddingLeft: "10px",
            position:    "relative",
          }}>
            <span style={{ position:"absolute", left:0, color:"#30363d" }}>▸</span>
            {pt}
          </div>
        ))}
      </div>
    ))}
  </div>
);

const CertificatesVisual: React.FC<{ p: typeof profile }> = ({ p }) => (
  <div style={{ padding: "6px 14px" }}>
    {p.certificates.map((cert, ci) => (
      <div key={ci} style={{
        marginBottom: "8px",
        padding:      "9px 12px",
        background:   "#080b10",
        border:       "1px solid #1c2128",
        borderRadius: "4px",
        borderLeft:   "2px solid #d29922",
        display:      "flex",
        alignItems:   "center",
        gap:          "10px",
      }}>
        <span style={{ fontSize:"16px", flexShrink:0 }}>🏅</span>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:"11px", color:"#e6edf3", fontWeight:"600", fontFamily:"inherit" }}>
            {cert.name}
          </div>
          <div style={{ fontSize:"9px", color:"#6e7681", fontFamily:"inherit", marginTop:"2px" }}>
            {cert.issuer} · {cert.date}
          </div>
          <div style={{ fontSize:"8px", color:"#30363d", fontFamily:"inherit", marginTop:"1px", letterSpacing:"0.5px" }}>
            ID: {cert.id}
          </div>
        </div>
      </div>
    ))}
  </div>
);

const AchievementsVisual: React.FC<{ p: typeof profile }> = ({ p }) => (
  <div style={{ padding: "6px 14px" }}>
    {p.achievements.map((ach, ai) => (
      <div key={ai} style={{
        marginBottom: "8px",
        padding:      "9px 12px",
        background:   "#080b10",
        border:       "1px solid #1c2128",
        borderRadius: "4px",
        borderLeft:   "2px solid #bc8cff",
        display:      "flex",
        gap:          "10px",
        alignItems:   "flex-start",
      }}>
        <span style={{ fontSize:"16px", flexShrink:0 }}>{ach.icon}</span>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", justifyContent:"space-between" }}>
            <span style={{ fontSize:"11px", color:"#e6edf3", fontWeight:"600", fontFamily:"inherit" }}>
              {ach.title}
            </span>
            <span style={{ fontSize:"9px", color:"#484f58", fontFamily:"inherit" }}>
              {ach.date}
            </span>
          </div>
          <div style={{ fontSize:"10px", color:"#6e7681", marginTop:"3px", lineHeight:"1.4", fontFamily:"inherit" }}>
            {ach.description}
          </div>
        </div>
      </div>
    ))}
  </div>
);

// ─────────────────────────────────────
//  Command map
// ─────────────────────────────────────
const COMMANDS: Record<string, Handler> = {
  whoami: (p) => [
    `  ${p.name}`,
    `  ${p.role}`,
    `  ${p.education} — ${p.university}`,
    `  📍 ${p.location}`,
  ].join("\n"),

  help: () => [
    "  ┌───────────────────────────────────────────────┐",
    "  │               AVAILABLE COMMANDS             │",
    "  ├──────────────────┬────────────────────────────┤",
    "  │  whoami          │  Show identity             │",
    "  │  info            │  Full profile              │",
    "  │  about           │  About me                  │",
    "  │  projects        │  Projects + tech bars      │",
    "  │  experience      │  Work experience           │",
    "  │  certificates    │  My certificates           │",
    "  │  achievements    │  My achievements           │",
    "  │  skills          │  Tech stack                │",
    "  │  links           │  All links                 │",
    "  │  contact         │  Contact info              │",
    "  │  card            │  Shake ID card             │",
    "  │  flip            │  Flip ID card (back/front) │",
    "  │  banner          │  Show ASCII banner         │",
    "  │  clear           │  Clear terminal            │",
    "  │  help            │  This menu                 │",
    "  └──────────────────┴────────────────────────────┘",
  ].join("\n"),

  info: (p) => [
    `  Name       :  ${p.name}`,
    `  Role       :  ${p.role}`,
    `  Education  :  ${p.education}`,
    `  University :  ${p.university}`,
    `  Location   :  ${p.location}`,
    `  Dev ID     :  ${p.developerId}`,
    `  Serial     :  ${p.cardSerial}`,
    `  Issued     :  ${p.issueDate}`,
    `  Expires    :  ${p.expiryDate}`,
  ].join("\n"),

  about: (p) => [
    `  ${p.name}`,
    `  ${"─".repeat(Math.min(p.name.length + 2, 38))}`,
    `  A passionate ${p.role} pursuing`,
    `  ${p.education} at ${p.university}.`,
    ``,
    `  Building modern digital experiences`,
    `  with clean code and thoughtful design.`,
    ``,
    `  Currently based in ${p.location}.`,
  ].join("\n"),

  projects:     (p) => <ProjectsVisual p={p} />,
  experience:   (p) => <ExperienceVisual p={p} />,
  certificates: (p) => <CertificatesVisual p={p} />,
  achievements: (p) => <AchievementsVisual p={p} />,

  skills: () => [
    "  Languages  ──  TypeScript  JavaScript  Python  Java",
    "  Frontend   ──  React  Next.js  Tailwind  CSS",
    "  Backend    ──  Node.js  Express  FastAPI",
    "  Database   ──  PostgreSQL  MongoDB  Redis",
    "  DevOps     ──  Docker  Git  AWS  Vercel  Linux",
    "  Tools      ──  VS Code  Figma  Postman  Vim",
  ].join("\n"),

  links: (p) => [
    `  ╭──────────────────────────────────────────╮`,
    `  │  github     ${p.github.replace("https://","").padEnd(30)}│`,
    `  │  linkedin   ${p.linkedin.replace("https://","").slice(0,30).padEnd(30)}│`,
    `  │  portfolio  ${p.portfolio.replace("https://","").padEnd(30)}│`,
    `  │  email      ${p.email.padEnd(30)}│`,
    `  ╰──────────────────────────────────────────╯`,
  ].join("\n"),

  contact: (p) => [
    `  Email     :  ${p.email}`,
    `  GitHub    :  ${p.github}`,
    `  LinkedIn  :  ${p.linkedin}`,
  ].join("\n"),

  card:   () => "  ↻  ID card physics activated...",
  flip:   () => "  ↺  Flipping ID card — showing back side...",
  banner: () => "__BANNER__",
  clear:  () => "__CLEAR__",
};

const ALL_CMDS = Object.keys(COMMANDS);
const PROMPT_USER = profile.name.toLowerCase().split(" ")[0];
const PROMPT_HOST = "portfolio";

let uid = 0;
const mkLine = (
  type: Line["type"],
  text: string,
  jsx?: React.ReactNode,
): Line => ({ id: uid++, type, text, jsx });

// ─────────────────────────────────────
//  Terminal component
// ─────────────────────────────────────
export const Terminal: React.FC<{ onCommand: (cmd: string) => void }> = ({
  onCommand,
}) => {
  const [lines, setLines] = useState<Line[]>([
    mkLine("visual", "", <GlitchBanner />),
    mkLine("gap",    ""),
    mkLine("system", `  Initializing portfolio system...`),
    mkLine("system", `  Logged in as: guest@${PROMPT_HOST}`),
    mkLine("gap",    ""),
    mkLine("output", `  Type 'help' to see all commands.`),
    mkLine("output", `  Try: whoami  projects  experience  flip`),
    mkLine("gap",    ""),
  ]);

  const [input,   setInput]   = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [blink,   setBlink]   = useState(true);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setInterval(() => setBlink(b => !b), 520);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const submit = useCallback((e: FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    const handler = COMMANDS[cmd];

    if (!handler) {
      setLines(prev => [
        ...prev,
        mkLine("prompt", cmd),
        mkLine("error",  `  bash: ${cmd}: command not found`),
        mkLine("error",  `  Type 'help' for available commands.`),
        mkLine("gap",    ""),
      ]);
    } else {
      const out = handler(profile);

      if (out === "__CLEAR__") {
        setLines([
          mkLine("system", "  Terminal cleared."),
          mkLine("gap",    ""),
        ]);
      } else if (out === "__BANNER__") {
        setLines(prev => [
          ...prev,
          mkLine("prompt", cmd),
          mkLine("visual", "", <GlitchBanner />),
          mkLine("gap",    ""),
        ]);
      } else if (typeof out === "string") {
        setLines(prev => [
          ...prev,
          mkLine("prompt", cmd),
          mkLine("output", out),
          mkLine("gap",    ""),
        ]);
      } else {
        setLines(prev => [
          ...prev,
          mkLine("prompt", cmd),
          mkLine("visual", "", out as React.ReactNode),
          mkLine("gap",    ""),
        ]);
      }
      onCommand(cmd);
    }

    setHistory(h => [cmd, ...h.slice(0, 99)]);
    setHistIdx(-1);
    setInput("");
  }, [input, onCommand]);

  const onKey = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const i = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(i);
      setInput(history[i] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const i = Math.max(histIdx - 1, -1);
      setHistIdx(i);
      setInput(i === -1 ? "" : (history[i] ?? ""));
    } else if (e.key === "Tab") {
      e.preventDefault();
      const match = ALL_CMDS.find(c => c.startsWith(input.toLowerCase()));
      if (match) setInput(match);
    }
  }, [histIdx, history, input]);

  const lineColour = (t: Line["type"]) => {
    switch (t) {
      case "output": return "#c9d1d9";
      case "error":  return "#f85149";
      case "system": return "#484f58";
      default:       return "#c9d1d9";
    }
  };

  return (
    <div
      style={{
        width:         "100%",
        height:        "100%",
        display:       "flex",
        flexDirection: "column",
        background:    "#0d1117",
        fontFamily:    "'JetBrains Mono','Fira Code','Cascadia Code','Courier New',monospace",
        overflow:      "hidden",
      }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* ── Title bar ── */}
      <div style={{
        display:      "flex",
        alignItems:   "center",
        padding:      "9px 14px",
        background:   "#010409",
        borderBottom: "1px solid #1c2128",
        flexShrink:   0,
        gap:          "10px",
      }}>
        <div style={{ display:"flex", gap:"6px" }}>
          {["#ff5f57","#ffbd2e","#28c940"].map((c, i) => (
            <div key={i} style={{
              width:     11,
              height:    11,
              borderRadius:"50%",
              background: c,
              boxShadow: "0 0 0 0.5px rgba(0,0,0,0.5)",
            }} />
          ))}
        </div>
        <div style={{ flex:1, display:"flex", justifyContent:"center" }}>
          <span style={{ fontSize:"11px", color:"#484f58", letterSpacing:"0.2px" }}>
            {PROMPT_USER}@{PROMPT_HOST}: ~
          </span>
        </div>
        <span style={{ fontSize:"9px", color:"#2ecc71", letterSpacing:"0.8px",
          border:"1px solid #1a5c34", padding:"1px 7px", borderRadius:"3px",
          background:"#050f07" }}>
          bash
        </span>
      </div>

      {/* ── Output ── */}
      <div style={{
        flex:          1,
        overflowY:     "auto",
        padding:       "12px 0 6px",
        scrollbarWidth:"thin",
        scrollbarColor:"#1c2128 transparent",
        background:    "#0d1117",
      }}>
        {lines.map(l => {
          if (l.type === "gap") return <div key={l.id} style={{ height:"5px" }} />;

          if (l.type === "visual") return (
            <div key={l.id} style={{ margin:"3px 0" }}>{l.jsx}</div>
          );

          if (l.type === "prompt") return (
            <div key={l.id} style={{
              display:    "flex",
              alignItems: "center",
              padding:    "1px 0",
              lineHeight: "1.5",
            }}>
              <span style={{ color:"#2ecc71", fontSize:"12px", paddingLeft:"14px", flexShrink:0 }}>
                {PROMPT_USER}
              </span>
              <span style={{ color:"#484f58", fontSize:"12px" }}>@</span>
              <span style={{ color:"#58a6ff", fontSize:"12px" }}>{PROMPT_HOST}</span>
              <span style={{ color:"#484f58", fontSize:"12px" }}>:~$&nbsp;</span>
              <span style={{ color:"#e6edf3", fontSize:"12px" }}>{l.text}</span>
            </div>
          );

          return (
            <pre key={l.id} style={{
              margin:    0,
              padding:   "0.5px 14px",
              fontSize:  "12px",
              lineHeight:"1.65",
              color:     lineColour(l.type),
              whiteSpace:"pre",
              fontFamily:"inherit",
              overflowX: "auto",
            }}>
              {l.text}
            </pre>
          );
        })}

        {/* Live prompt */}
        <div style={{ display:"flex", alignItems:"center", padding:"1px 0", lineHeight:"1.5" }}>
          <span style={{ color:"#2ecc71", fontSize:"12px", paddingLeft:"14px", flexShrink:0 }}>
            {PROMPT_USER}
          </span>
          <span style={{ color:"#484f58", fontSize:"12px" }}>@</span>
          <span style={{ color:"#58a6ff", fontSize:"12px" }}>{PROMPT_HOST}</span>
          <span style={{ color:"#484f58", fontSize:"12px" }}>:~$&nbsp;</span>
          <span style={{ color:"#e6edf3", fontSize:"12px" }}>{input}</span>
          <span style={{
            display:       "inline-block",
            width:         "7px",
            height:        "14px",
            background:    blink ? "#e6edf3" : "transparent",
            verticalAlign: "middle",
            marginLeft:    "1px",
          }} />
        </div>

        <div ref={bottomRef} />
      </div>

      {/* Hidden input */}
      <form
        onSubmit={submit}
        style={{ position:"absolute", opacity:0, pointerEvents:"none", bottom:30 }}
      >
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKey}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          style={{ position:"absolute", opacity:0, width:1 }}
        />
      </form>

      {/* ── Status bar ── */}
      <div style={{
        display:        "flex",
        alignItems:     "center",
        justifyContent: "space-between",
        padding:        "5px 14px",
        background:     "#010409",
        borderTop:      "1px solid #1c2128",
        flexShrink:     0,
      }}>
        <div style={{ display:"flex", gap:"14px" }}>
          <Stat dot="#2ecc71" label="READY" />
          <Stat dot="#58a6ff" label={profile.role.toUpperCase()} />
        </div>
        <div style={{ display:"flex", gap:"14px" }}>
          <Stat dot="#30363d" label="UTF-8" />
          <Stat dot="#30363d" label="bash" />
          <Stat dot="#30363d" label={profile.location} />
        </div>
      </div>
    </div>
  );
};

const Stat: React.FC<{ dot: string; label: string }> = ({ dot, label }) => (
  <div style={{ display:"flex", alignItems:"center", gap:"5px" }}>
    <div style={{ width:6, height:6, borderRadius:"50%", background:dot }} />
    <span style={{ fontSize:"9px", color:"#30363d", letterSpacing:"0.6px" }}>{label}</span>
  </div>
);