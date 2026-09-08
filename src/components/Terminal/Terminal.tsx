import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  KeyboardEvent,
  FormEvent,
} from "react";
import { profile } from "../../data/profile";

interface TerminalLine {
  id: number;
  type: "prompt" | "output" | "error" | "system";
  text: string;
}

type CommandHandler = (p: typeof profile) => string;

const COMMAND_MAP: Record<string, CommandHandler> = {
  whoami: (p) =>
    `${p.name}\n${p.role}\n${p.education}, ${p.university}\n${p.location}`,

  help: () =>
    [
      "┌─ Available Commands ──────────────────┐",
      "│  whoami   Show developer identity     │",
      "│  info     Full profile details        │",
      "│  about    About this developer        │",
      "│  card     Interact with ID card       │",
      "│  flip     Flip the ID card            │",
      "│  links    All profile links           │",
      "│  skills   Technical skills            │",
      "│  contact  Contact information         │",
      "│  clear    Clear terminal              │",
      "│  help     Show this help              │",
      "└───────────────────────────────────────┘",
    ].join("\n"),

  info: (p) =>
    [
      `Name       ${p.name}`,
      `Role       ${p.role}`,
      `Education  ${p.education}`,
      `University ${p.university}`,
      `Location   ${p.location}`,
      `Dev ID     ${p.developerId}`,
      `Serial     ${p.cardSerial}`,
    ].join("\n"),

  about: (p) =>
    `${p.name} is a passionate ${p.role.toLowerCase()} pursuing\n${p.education} at ${p.university}, ${p.location}.\n\nBuilding modern digital experiences with clean code,\nthoughtful design, and cutting-edge technologies.`,

  card: () => `↻ Interacting with ID card...\nPhysics simulation active.`,

  flip: () => `↺ Flipping ID card...`,

  links: (p) =>
    [
      `GitHub     ${p.github}`,
      `LinkedIn   ${p.linkedin}`,
      `Portfolio  ${p.portfolio}`,
      `Email      ${p.email}`,
    ].join("\n"),

  skills: () =>
    [
      "Languages   TypeScript  JavaScript  Python  Java",
      "Frameworks  React  Next.js  Node.js  Express",
      "Tools       Git  Docker  VS Code  Figma  Linux",
      "Database    PostgreSQL  MongoDB  Redis",
      "Cloud       AWS  Vercel  Railway  Netlify",
    ].join("\n"),

  contact: (p) =>
    [
      `Email     ${p.email}`,
      `GitHub    ${p.github}`,
      `LinkedIn  ${p.linkedin}`,
    ].join("\n"),

  clear: () => "__CLEAR__",
};

let lineIdCounter = 0;
const mkLine = (type: TerminalLine["type"], text: string): TerminalLine => ({
  id: lineIdCounter++,
  type,
  text,
});

export const Terminal: React.FC<{ onCommand: (cmd: string) => void }> = ({
  onCommand,
}) => {
  const [lines, setLines] = useState<TerminalLine[]>([
    mkLine("system", `Welcome to ${profile.name}'s Portfolio Terminal v2.0`),
    mkLine("system", `Type 'help' for available commands.`),
    mkLine("system", `Try: whoami  info  card  flip  links`),
  ]);

  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const cmd = input.trim().toLowerCase();
      if (!cmd) return;

      const handler = COMMAND_MAP[cmd];

      if (!handler) {
        setLines((prev) => [
          ...prev,
          mkLine("prompt", `user@portfolio:~$ ${cmd}`),
          mkLine(
            "error",
            `bash: ${cmd}: command not found\nType 'help' for available commands.`
          ),
        ]);
      } else {
        const result = handler(profile);

        if (result === "__CLEAR__") {
          setLines([mkLine("system", "Terminal cleared.")]);
        } else {
          setLines((prev) => [
            ...prev,
            mkLine("prompt", `user@portfolio:~$ ${cmd}`),
            mkLine("output", result),
          ]);
        }
        onCommand(cmd);
      }

      setCmdHistory((prev) => [cmd, ...prev.slice(0, 49)]);
      setHistIdx(-1);
      setInput("");
    },
    [input, onCommand]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        const next = Math.min(histIdx + 1, cmdHistory.length - 1);
        setHistIdx(next);
        setInput(cmdHistory[next] ?? "");
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = Math.max(histIdx - 1, -1);
        setHistIdx(next);
        setInput(next === -1 ? "" : (cmdHistory[next] ?? ""));
      }
    },
    [histIdx, cmdHistory]
  );

  const lineColor = (type: TerminalLine["type"]) => {
    switch (type) {
      case "prompt":
        return "#00d4ff";
      case "output":
        return "rgba(255,255,255,0.78)";
      case "error":
        return "#ff6b6b";
      case "system":
        return "rgba(0,212,255,0.45)";
    }
  };

  return (
    <div
      style={{
        width: "100%",
        background: "rgba(8,10,20,0.97)",
        border: `1px solid ${isFocused ? "rgba(0,212,255,0.35)" : "rgba(0,212,255,0.15)"}`,
        borderRadius: "12px",
        overflow: "hidden",
        fontFamily: "'Courier New', 'Lucida Console', monospace",
        boxShadow: isFocused
          ? "0 20px 60px rgba(0,0,0,0.8), 0 0 30px rgba(0,212,255,0.06)"
          : "0 20px 60px rgba(0,0,0,0.7)",
        transition: "border-color 0.2s, box-shadow 0.2s",
        backdropFilter: "blur(12px)",
      }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Title bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "10px 14px",
          background: "rgba(255,255,255,0.025)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            background: "#ff5f57",
          }}
        />
        <div
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            background: "#ffbd2e",
          }}
        />
        <div
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            background: "#28c940",
          }}
        />
        <div
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: "10px",
            color: "rgba(255,255,255,0.25)",
            letterSpacing: "1px",
          }}
        >
          portfolio@terminal — bash — 80×24
        </div>
      </div>

      {/* Output area */}
      <div
        style={{
          height: "300px",
          overflowY: "auto",
          padding: "14px 16px",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(0,212,255,0.15) transparent",
        }}
      >
        {lines.map((line) => (
          <pre
            key={line.id}
            style={{
              margin: "0 0 3px 0",
              padding: 0,
              fontSize: "11px",
              lineHeight: "1.65",
              color: lineColor(line.type),
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              fontFamily: "inherit",
              letterSpacing: "0.2px",
            }}
          >
            {line.type === "system" ? `# ${line.text}` : line.text}
          </pre>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input row */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px 16px",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          gap: "8px",
          background: "rgba(0,0,0,0.2)",
        }}
      >
        <span
          style={{
            color: "#00d4ff",
            fontSize: "11px",
            flexShrink: 0,
            letterSpacing: "0.3px",
          }}
        >
          user@portfolio:~$
        </span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoFocus
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#ffffff",
            fontSize: "11px",
            fontFamily: "inherit",
            caretColor: "#00d4ff",
            letterSpacing: "0.3px",
          }}
        />
        {isFocused && (
          <span
            style={{
              display: "inline-block",
              width: "7px",
              height: "13px",
              background: "#00d4ff",
              opacity: 0.85,
              animation: "blink 1s step-end infinite",
            }}
          />
        )}
      </form>
    </div>
  );
};