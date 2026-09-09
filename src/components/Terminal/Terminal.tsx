import React, {
  useState, useRef, useEffect,
  useCallback, KeyboardEvent, FormEvent,
} from "react";
import { profile } from "../../data/profile";

interface Line {
  id:   number;
  type: "prompt" | "output" | "error" | "system" | "gap";
  text: string;
}

type Handler = (p: typeof profile) => string;

const BANNER = [
  "  ██████╗ ███████╗██╗   ██╗",
  "  ██╔══██╗██╔════╝██║   ██║",
  "  ██║  ██║█████╗  ██║   ██║",
  "  ██║  ██║██╔══╝  ╚██╗ ██╔╝",
  "  ██████╔╝███████╗ ╚████╔╝ ",
  "  ╚═════╝ ╚══════╝  ╚═══╝  ",
].join("\n");

const COMMANDS: Record<string, Handler> = {
  whoami: (p) => [
    `  ${p.name}`,
    `  ${p.role}`,
    `  ${p.education} — ${p.university}`,
    `  📍 ${p.location}`,
  ].join("\n"),

  help: () => [
    "  ┌─────────────────────────────────────────┐",
    "  │           AVAILABLE COMMANDS            │",
    "  ├─────────────────┬───────────────────────┤",
    "  │  whoami         │  Show identity        │",
    "  │  info           │  Full profile         │",
    "  │  about          │  About me             │",
    "  │  card           │  Shake ID card        │",
    "  │  flip           │  Flip ID card         │",
    "  │  links          │  All links            │",
    "  │  skills         │  Tech stack           │",
    "  │  contact        │  Contact info         │",
    "  │  banner         │  ASCII art            │",
    "  │  clear          │  Clear terminal       │",
    "  │  help           │  This menu            │",
    "  └─────────────────┴───────────────────────┘",
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
    `  ${"─".repeat(Math.min(p.name.length + 2, 36))}`,
    `  A passionate ${p.role} pursuing`,
    `  ${p.education} at`,
    `  ${p.university}.`,
    ``,
    `  Building modern digital experiences`,
    `  with clean code and thoughtful design.`,
    ``,
    `  Currently based in ${p.location}.`,
  ].join("\n"),

  banner: () => BANNER,

  card:    () => "  ↻  ID card physics activated...",
  flip:    () => "  ↺  Flipping ID card...",

  links: (p) => [
    `  ╭──────────────────────────────────────────╮`,
    `  │  github     ${p.github.padEnd(30)}│`,
    `  │  linkedin   ${(p.linkedin.length > 30 ? p.linkedin.slice(0, 30) : p.linkedin).padEnd(30)}│`,
    `  │  portfolio  ${p.portfolio.padEnd(30)}│`,
    `  │  email      ${p.email.padEnd(30)}│`,
    `  ╰──────────────────────────────────────────╯`,
  ].join("\n"),

  skills: () => [
    `  Languages  ──  TypeScript  JavaScript  Python  Java`,
    `  Frontend   ──  React  Next.js  Tailwind  CSS`,
    `  Backend    ──  Node.js  Express  FastAPI`,
    `  Database   ──  PostgreSQL  MongoDB  Redis`,
    `  DevOps     ──  Docker  Git  AWS  Vercel  Linux`,
    `  Tools      ──  VS Code  Figma  Postman  Vim`,
  ].join("\n"),

  contact: (p) => [
    `  Email     :  ${p.email}`,
    `  GitHub    :  ${p.github}`,
    `  LinkedIn  :  ${p.linkedin}`,
  ].join("\n"),

  clear: () => "__CLEAR__",
};

const ALL_CMDS = Object.keys(COMMANDS);

let uid = 0;
const line = (type: Line["type"], text: string): Line =>
  ({ id: uid++, type, text });

const PROMPT_USER  = profile.name.toLowerCase().split(" ")[0];
const PROMPT_HOST  = "portfolio";

export const Terminal: React.FC<{ onCommand: (cmd: string) => void }> = ({
  onCommand,
}) => {
  const [lines, setLines] = useState<Line[]>([
    line("system", BANNER),
    line("gap",    ""),
    line("system", `  Initializing portfolio system...`),
    line("system", `  Logged in as: guest@${PROMPT_HOST}`),
    line("gap",    ""),
    line("output", `  Type 'help' to see all commands.`),
    line("output", `  Try: whoami  skills  links  flip`),
    line("gap",    ""),
  ]);

  const [input,      setInput]      = useState("");
  const [history,    setHistory]    = useState<string[]>([]);
  const [histIdx,    setHistIdx]    = useState(-1);
  const [blink,      setBlink]      = useState(true);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  // Cursor blink
  useEffect(() => {
    const t = setInterval(() => setBlink(b => !b), 520);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = useCallback((e: FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    const handler = COMMANDS[cmd];
    if (!handler) {
      setLines(prev => [
        ...prev,
        line("prompt", cmd),
        line("error",  `  bash: ${cmd}: command not found`),
        line("error",  `  Type 'help' for available commands.`),
        line("gap",    ""),
      ]);
    } else {
      const out = handler(profile);
      if (out === "__CLEAR__") {
        setLines([
          line("system", "  Terminal cleared."),
          line("gap",    ""),
        ]);
      } else {
        setLines(prev => [
          ...prev,
          line("prompt", cmd),
          line("output", out),
          line("gap",    ""),
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

  // Colour per line type
  const colour = (t: Line["type"]) => {
    switch (t) {
      case "output": return "#c9d1d9";
      case "error":  return "#f85149";
      case "system": return "#6e7681";
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
        display:       "flex",
        alignItems:    "center",
        padding:       "9px 14px",
        background:    "#161b22",
        borderBottom:  "1px solid #21262d",
        flexShrink:    0,
        gap:           "10px",
      }}>
        {/* Traffic lights */}
        <div style={{ display: "flex", gap: "6px" }}>
          {["#ff5f57","#ffbd2e","#28c940"].map((c, i) => (
            <div key={i} style={{
              width: 11, height: 11, borderRadius: "50%",
              background: c,
              boxShadow:  `0 0 0 0.5px rgba(0,0,0,0.4)`,
            }} />
          ))}
        </div>

        {/* Centre tab */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <div style={{
            fontSize:     "11px",
            color:        "#8b949e",
            letterSpacing:"0.2px",
          }}>
            {PROMPT_USER}@{PROMPT_HOST}: ~
          </div>
        </div>

        <div style={{
          fontSize: "9px", color: "#3d444d", letterSpacing: "0.8px",
        }}>
          bash
        </div>
      </div>

      {/* ── Output scroll area ── */}
      <div style={{
        flex:          1,
        overflowY:     "auto",
        padding:       "14px 0 6px",
        scrollbarWidth:"thin",
        scrollbarColor:"#21262d transparent",
      }}>
        {lines.map(l => {
          if (l.type === "gap") return <div key={l.id} style={{ height: "5px" }} />;

          if (l.type === "prompt") return (
            <div key={l.id} style={{
              display:    "flex",
              alignItems: "center",
              padding:    "1px 0",
              lineHeight: "1.5",
            }}>
              <span style={{ color: "#3fb950", fontSize: "12px", paddingLeft: "14px", flexShrink: 0 }}>
                {PROMPT_USER}
              </span>
              <span style={{ color: "#6e7681", fontSize: "12px" }}>@</span>
              <span style={{ color: "#58a6ff", fontSize: "12px" }}>{PROMPT_HOST}</span>
              <span style={{ color: "#6e7681", fontSize: "12px" }}>:~$&nbsp;</span>
              <span style={{ color: "#e6edf3", fontSize: "12px" }}>{l.text}</span>
            </div>
          );

          return (
            <pre key={l.id} style={{
              margin:      0,
              padding:     "0.5px 14px",
              fontSize:    "12px",
              lineHeight:  "1.6",
              color:       colour(l.type),
              whiteSpace:  "pre",
              fontFamily:  "inherit",
              overflowX:   "auto",
            }}>
              {l.text}
            </pre>
          );
        })}

        {/* Live prompt line */}
        <div style={{
          display:    "flex",
          alignItems: "center",
          padding:    "1px 0",
          lineHeight: "1.5",
        }}>
          <span style={{ color: "#3fb950", fontSize: "12px", paddingLeft: "14px", flexShrink: 0 }}>
            {PROMPT_USER}
          </span>
          <span style={{ color: "#6e7681", fontSize: "12px" }}>@</span>
          <span style={{ color: "#58a6ff", fontSize: "12px" }}>{PROMPT_HOST}</span>
          <span style={{ color: "#6e7681", fontSize: "12px" }}>:~$&nbsp;</span>
          <span style={{ color: "#e6edf3", fontSize: "12px" }}>{input}</span>
          <span style={{
            display:         "inline-block",
            width:           "7px",
            height:          "15px",
            background:      blink ? "#e6edf3" : "transparent",
            verticalAlign:   "middle",
            marginLeft:      "1px",
          }} />
        </div>

        <div ref={bottomRef} />
      </div>

      {/* Hidden real input */}
      <form
        onSubmit={submit}
        style={{ position: "absolute", opacity: 0, pointerEvents: "none", bottom: 30 }}
      >
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKey}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          style={{ position: "absolute", opacity: 0, width: 1 }}
        />
      </form>

      {/* ── Status bar ── */}
      <div style={{
        display:        "flex",
        alignItems:     "center",
        justifyContent: "space-between",
        padding:        "5px 14px",
        background:     "#161b22",
        borderTop:      "1px solid #21262d",
        flexShrink:     0,
      }}>
        <div style={{ display: "flex", gap: "14px" }}>
          <Stat dot="#3fb950" label="READY" />
          <Stat dot="#58a6ff" label={profile.role.toUpperCase()} />
        </div>
        <div style={{ display: "flex", gap: "14px" }}>
          <Stat dot="#3d444d" label="UTF-8" />
          <Stat dot="#3d444d" label="bash" />
          <Stat dot="#3d444d" label={profile.location} />
        </div>
      </div>
    </div>
  );
};

const Stat: React.FC<{ dot: string; label: string }> = ({ dot, label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
    <div style={{ width: 6, height: 6, borderRadius: "50%", background: dot }} />
    <span style={{ fontSize: "9px", color: "#3d444d", letterSpacing: "0.6px" }}>
      {label}
    </span>
  </div>
);