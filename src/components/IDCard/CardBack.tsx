import React from "react";
import { profile } from "../../data/profile";

interface CardBackProps {
  rotY: number;
}

export const CardBack: React.FC<CardBackProps> = ({ rotY }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        borderRadius: "16px",
        overflow: "hidden",
        background:
          "linear-gradient(145deg, #090f1e 0%, #111827 50%, #090f1e 100%)",
        transform: "rotateY(180deg)",
        display: "flex",
        flexDirection: "column",
        padding: "18px",
        boxSizing: "border-box",
        fontFamily: "'Courier New', monospace",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      }}
    >
      {/* Horizontal line pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent 0px,
            transparent 9px,
            rgba(0,212,255,0.018) 9px,
            rgba(0,212,255,0.018) 10px
          )`,
          borderRadius: "16px",
          pointerEvents: "none",
        }}
      />

      {/* Top holographic strip */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background:
            "linear-gradient(90deg, #7c3aed80, #00d4ff, #ff006660, #00d4ff, #7c3aed80)",
          borderRadius: "16px 16px 0 0",
        }}
      />

      {/* Magnetic strip */}
      <div
        style={{
          position: "absolute",
          top: "26px",
          left: 0,
          right: 0,
          height: "34px",
          background:
            "linear-gradient(180deg, #080808, #141414 50%, #080808)",
          boxShadow: "inset 0 1px 3px rgba(0,0,0,0.8)",
        }}
      />

      {/* Content below magnetic strip */}
      <div
        style={{
          marginTop: "72px",
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {/* Signature area */}
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "5px",
            padding: "7px 10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "5px",
                color: "rgba(255,255,255,0.25)",
                letterSpacing: "1px",
                marginBottom: "3px",
              }}
            >
              AUTHORIZED SIGNATURE
            </div>
            <div
              style={{
                fontSize: "14px",
                color: "rgba(255,255,255,0.5)",
                fontStyle: "italic",
                fontFamily: "Georgia, 'Times New Roman', serif",
                letterSpacing: "1px",
              }}
            >
              {profile.name.split(" ")[0]}
            </div>
          </div>

          {/* Initials circle */}
          <div
            style={{
              width: "28px",
              height: "28px",
              border: "1.5px solid rgba(0,212,255,0.3)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "9px",
              color: "rgba(0,212,255,0.6)",
              fontWeight: "700",
              background: "rgba(0,212,255,0.05)",
            }}
          >
            {profile.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>
        </div>

        {/* Title */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "7px",
              color: "rgba(0,212,255,0.75)",
              letterSpacing: "3px",
              fontWeight: "700",
              marginBottom: "6px",
            }}
          >
            AUTHORIZED DEVELOPER
          </div>
          <div
            style={{
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, rgba(0,212,255,0.35), transparent)",
              marginBottom: "8px",
            }}
          />
          <div
            style={{
              fontSize: "5.5px",
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "1px",
              marginBottom: "4px",
            }}
          >
            This card belongs to:
          </div>
          <div
            style={{
              fontSize: "11px",
              color: "#ffffff",
              letterSpacing: "1px",
              fontWeight: "700",
              textShadow: "0 0 10px rgba(0,212,255,0.3)",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {profile.name}
          </div>
          <div
            style={{
              fontSize: "6px",
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "1px",
              marginTop: "3px",
            }}
          >
            {profile.role}
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            background: "rgba(255,255,255,0.07)",
          }}
        />

        {/* Portfolio link */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "5.5px",
              color: "rgba(255,255,255,0.25)",
              letterSpacing: "1px",
              marginBottom: "3px",
            }}
          >
            Portfolio:
          </div>
          <div
            style={{
              fontSize: "8px",
              color: "#00d4ff",
              letterSpacing: "0.5px",
              textShadow: "0 0 8px rgba(0,212,255,0.4)",
            }}
          >
            {profile.portfolio.replace("https://", "")}
          </div>
        </div>

        {/* Return notice */}
        <div
          style={{
            background: "rgba(255,80,80,0.05)",
            border: "1px solid rgba(255,80,80,0.15)",
            borderRadius: "5px",
            padding: "7px 10px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "5px",
              color: "rgba(255,100,100,0.55)",
              letterSpacing: "1px",
              marginBottom: "3px",
            }}
          >
            If found, please return to:
          </div>
          <div
            style={{
              fontSize: "6.5px",
              color: "rgba(255,255,255,0.35)",
              letterSpacing: "0.5px",
            }}
          >
            {profile.email}
          </div>
        </div>

        {/* Dev ID */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "9px",
              color: "rgba(0,212,255,0.55)",
              letterSpacing: "2.5px",
              fontWeight: "700",
              marginBottom: "3px",
            }}
          >
            DEV-ID: {profile.developerId.replace("DEV-", "")}
          </div>
          <div
            style={{
              fontSize: "4px",
              color: "rgba(255,255,255,0.1)",
              letterSpacing: "1px",
            }}
          >
            {profile.cardSerial} • {profile.location.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Bottom microtext */}
      <div
        style={{
          position: "absolute",
          bottom: "8px",
          left: "18px",
          right: "18px",
          fontSize: "3.5px",
          color: "rgba(255,255,255,0.07)",
          letterSpacing: "0.8px",
          textAlign: "center",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        {"VERIFIED DEVELOPER IDENTITY • AUTHORIZED ACCESS • PORTFOLIO CARD • "}
        {"VERIFIED DEVELOPER IDENTITY • AUTHORIZED ACCESS • PORTFOLIO CARD • "}
      </div>
    </div>
  );
};