import React from "react";

interface LanyardProps {
  cardRotY: number;
  cardRotZ: number;
}

export const Lanyard: React.FC<LanyardProps> = ({ cardRotY, cardRotZ }) => {
  const sway = cardRotY * 0.25;
  const twist = cardRotZ * 0.4;

  // Rope control points that move with card rotation
  const lx1 = 82 + sway * 0.3;
  const lx2 = 86 + sway * 0.8;
  const rx1 = 118 + sway * 0.3;
  const rx2 = 114 + sway * 0.8;
  const cy = 62 + Math.abs(twist) * 0.2;

  return (
    <svg
      width="200"
      height="135"
      viewBox="0 0 200 135"
      style={{ overflow: "visible", display: "block" }}
    >
      <defs>
        {/* Lanyard gradient — dark navy strap */}
        <linearGradient id="lanyardMain" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0d1117" />
          <stop offset="25%" stopColor="#1a2035" />
          <stop offset="50%" stopColor="#0f3060" />
          <stop offset="75%" stopColor="#1a2035" />
          <stop offset="100%" stopColor="#0d1117" />
        </linearGradient>

        {/* Sheen highlight */}
        <linearGradient id="lanyardSheen" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(0,212,255,0)" />
          <stop offset="40%" stopColor="rgba(0,212,255,0.12)" />
          <stop offset="60%" stopColor="rgba(0,212,255,0.18)" />
          <stop offset="100%" stopColor="rgba(0,212,255,0)" />
        </linearGradient>

        {/* Clip metal gradient */}
        <linearGradient id="clipMetal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2a2f4a" />
          <stop offset="50%" stopColor="#3a4060" />
          <stop offset="100%" stopColor="#1a1f35" />
        </linearGradient>
      </defs>

      {/* ── Left rope ── */}
      <path
        d={`M 88 0 Q ${lx1} ${cy} ${lx2} 122`}
        fill="none"
        stroke="url(#lanyardMain)"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d={`M 88 0 Q ${lx1} ${cy} ${lx2} 122`}
        fill="none"
        stroke="url(#lanyardSheen)"
        strokeWidth="8"
        strokeLinecap="round"
      />

      {/* ── Right rope ── */}
      <path
        d={`M 112 0 Q ${rx1} ${cy} ${rx2} 122`}
        fill="none"
        stroke="url(#lanyardMain)"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d={`M 112 0 Q ${rx1} ${cy} ${rx2} 122`}
        fill="none"
        stroke="url(#lanyardSheen)"
        strokeWidth="8"
        strokeLinecap="round"
      />

      {/* ── DEV text on left rope ── */}
      <path
        id="lanyardTextPath"
        d={`M 88 15 Q ${lx1} ${cy} ${lx2} 110`}
        fill="none"
      />
      <text
        style={{
          fontSize: "5.5px",
          fill: "rgba(0,212,255,0.22)",
          letterSpacing: "2px",
          fontFamily: "monospace",
        }}
      >
        <textPath href="#lanyardTextPath" startOffset="5%">
          DEV • DEV • DEV • DEV
        </textPath>
      </text>

      {/* ── Connector clip body ── */}
      <g
        transform={`translate(${100 + sway * 0.9}, 122)`}
        style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" }}
      >
        {/* Clip main body */}
        <rect
          x="-8"
          y="-9"
          width="16"
          height="18"
          rx="3"
          ry="3"
          fill="url(#clipMetal)"
          stroke="rgba(0,212,255,0.4)"
          strokeWidth="0.8"
        />

        {/* Clip highlight panel */}
        <rect
          x="-5"
          y="-7"
          width="5"
          height="14"
          rx="1"
          fill="rgba(255,255,255,0.06)"
        />

        {/* Clip top ring */}
        <ellipse
          cx="0"
          cy="-9"
          rx="5"
          ry="3.5"
          fill="none"
          stroke="rgba(0,212,255,0.55)"
          strokeWidth="1.5"
        />

        {/* D-ring arc above clip */}
        <path
          d="M -5 -11 Q 0 -17 5 -11"
          fill="none"
          stroke="#3a4060"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M -5 -11 Q 0 -17 5 -11"
          fill="none"
          stroke="rgba(0,212,255,0.2)"
          strokeWidth="1"
          strokeLinecap="round"
        />

        {/* Clip detail lines */}
        <line
          x1="-3"
          y1="-2"
          x2="3"
          y2="-2"
          stroke="rgba(0,212,255,0.15)"
          strokeWidth="0.6"
        />
        <line
          x1="-3"
          y1="2"
          x2="3"
          y2="2"
          stroke="rgba(0,212,255,0.15)"
          strokeWidth="0.6"
        />
        <line
          x1="-3"
          y1="6"
          x2="3"
          y2="6"
          stroke="rgba(0,212,255,0.1)"
          strokeWidth="0.6"
        />
      </g>
    </svg>
  );
};