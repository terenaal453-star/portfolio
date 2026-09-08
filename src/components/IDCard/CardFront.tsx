import React, { useState } from "react";
import { profile } from "../../data/profile";
import { QRCodeDisplay } from "./QRCode";

interface CardFrontProps {
  rotY: number;
}

// Geometric dev logo fallback
const GeometricLogo: React.FC = () => (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
    <polygon
      points="15,2 28,24 2,24"
      fill="none"
      stroke="#00d4ff"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <polygon
      points="15,8 23,21 7,21"
      fill="rgba(0,212,255,0.15)"
      stroke="rgba(0,212,255,0.3)"
      strokeWidth="0.5"
    />
    <circle cx="15" cy="15" r="2.5" fill="#00d4ff" />
  </svg>
);

// Single info row
const InfoRow: React.FC<{
  label: string;
  value: string;
  small?: boolean;
  accent?: boolean;
}> = ({ label, value, small = false, accent = false }) => (
  <div
    style={{
      display: "flex",
      alignItems: "baseline",
      gap: "6px",
      marginBottom: "5px",
    }}
  >
    <span
      style={{
        fontSize: "5px",
        color: "rgba(0,212,255,0.5)",
        letterSpacing: "1px",
        minWidth: "20px",
        flexShrink: 0,
        fontFamily: "'Courier New', monospace",
      }}
    >
      {label}
    </span>
    <span
      style={{
        fontSize: small ? "6px" : "7.5px",
        color: accent ? "#00d4ff" : "rgba(255,255,255,0.82)",
        letterSpacing: accent ? "1.5px" : "0.3px",
        fontWeight: accent ? "700" : "400",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        textShadow: accent ? "0 0 10px rgba(0,212,255,0.6)" : "none",
        fontFamily: "'Courier New', monospace",
      }}
    >
      {value}
    </span>
  </div>
);

export const CardFront: React.FC<CardFrontProps> = ({ rotY }) => {
  const [imgError, setImgError] = useState(false);
  const [logoError, setLogoError] = useState(false);

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
          "linear-gradient(145deg, #0d1117 0%, #161b2e 35%, #0d1117 70%, #111827 100%)",
        display: "flex",
        flexDirection: "column",
        padding: "18px 18px 14px 18px",
        boxSizing: "border-box",
        fontFamily: "'Courier New', monospace",
      }}
    >
      {/* ── Diagonal security pattern ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            repeating-linear-gradient(
              45deg,
              transparent 0px,
              transparent 12px,
              rgba(0,212,255,0.018) 12px,
              rgba(0,212,255,0.018) 13px
            ),
            repeating-linear-gradient(
              -45deg,
              transparent 0px,
              transparent 12px,
              rgba(0,212,255,0.012) 12px,
              rgba(0,212,255,0.012) 13px
            )
          `,
          borderRadius: "16px",
          pointerEvents: "none",
        }}
      />

      {/* ── Top holographic strip ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background:
            "linear-gradient(90deg, #ff006660, #00d4ff, #7c3aed80, #00ff8860, #00d4ff, #ff006660)",
          borderRadius: "16px 16px 0 0",
        }}
      />

      {/* ── Corner decorations ── */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          width: "10px",
          height: "10px",
          borderTop: "1.5px solid rgba(0,212,255,0.4)",
          borderRight: "1.5px solid rgba(0,212,255,0.4)",
          borderRadius: "0 3px 0 0",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          left: "10px",
          width: "10px",
          height: "10px",
          borderBottom: "1.5px solid rgba(0,212,255,0.4)",
          borderLeft: "1.5px solid rgba(0,212,255,0.4)",
          borderRadius: "0 0 0 3px",
        }}
      />

      {/* ── HEADER: Logo + Title ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {!logoError ? (
            <img
              src={profile.logo}
              alt="Logo"
              onError={() => setLogoError(true)}
              style={{ width: 30, height: 30, objectFit: "contain" }}
            />
          ) : (
            <GeometricLogo />
          )}
          <div>
            <div
              style={{
                fontSize: "7px",
                color: "#00d4ff",
                letterSpacing: "2.5px",
                fontWeight: "700",
              }}
            >
              DEV PORTFOLIO
            </div>
            <div
              style={{
                fontSize: "5px",
                color: "rgba(255,255,255,0.25)",
                letterSpacing: "1.5px",
              }}
            >
              AUTHENTICATED
            </div>
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontSize: "8px",
              color: "rgba(0,212,255,0.9)",
              letterSpacing: "2px",
              fontWeight: "700",
            }}
          >
            DEVELOPER ID
          </div>
          <div
            style={{
              fontSize: "5px",
              color: "rgba(255,255,255,0.2)",
              letterSpacing: "1px",
            }}
          >
            {profile.location.toUpperCase()} • {new Date().getFullYear()}
          </div>
        </div>
      </div>

      {/* ── Divider ── */}
      <div
        style={{
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, rgba(0,212,255,0.4), transparent)",
          marginBottom: "13px",
        }}
      />

      {/* ── PROFILE SECTION ── */}
      <div
        style={{
          display: "flex",
          gap: "13px",
          alignItems: "flex-start",
          flex: 1,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Photo column */}
        <div style={{ flexShrink: 0 }}>
          {/* Photo frame */}
          <div
            style={{
              width: "74px",
              height: "92px",
              borderRadius: "8px",
              overflow: "hidden",
              border: "1.5px solid rgba(0,212,255,0.45)",
              boxShadow:
                "0 0 14px rgba(0,212,255,0.25), inset 0 0 10px rgba(0,0,0,0.5)",
              position: "relative",
              background: "linear-gradient(145deg, #1a1f35, #0d1117)",
            }}
          >
            {!imgError ? (
              <img
                src={profile.profileImage}
                alt={profile.name}
                onError={() => setImgError(true)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center top",
                  display: "block",
                }}
              />
            ) : (
              /* Placeholder avatar */
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  background: "linear-gradient(145deg, #1a2035, #0d1117)",
                }}
              >
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <circle
                    cx="18"
                    cy="13"
                    r="8"
                    fill="rgba(0,212,255,0.35)"
                    stroke="rgba(0,212,255,0.4)"
                    strokeWidth="1"
                  />
                  <ellipse
                    cx="18"
                    cy="32"
                    rx="14"
                    ry="8"
                    fill="rgba(0,212,255,0.2)"
                    stroke="rgba(0,212,255,0.3)"
                    strokeWidth="0.5"
                  />
                </svg>
                <div
                  style={{
                    fontSize: "5px",
                    color: "rgba(0,212,255,0.5)",
                    letterSpacing: "1px",
                  }}
                >
                  PHOTO
                </div>
              </div>
            )}

            {/* Photo bottom gradient */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "22px",
                background: "linear-gradient(transparent, rgba(13,17,23,0.65))",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* Active status */}
          <div
            style={{
              marginTop: "6px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: "#00ff88",
                boxShadow: "0 0 5px #00ff88, 0 0 10px rgba(0,255,136,0.4)",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: "5px",
                color: "#00ff88",
                letterSpacing: "1px",
              }}
            >
              ACTIVE
            </span>
          </div>
        </div>

        {/* Info column */}
        <div style={{ flex: 1, minWidth: 0, paddingTop: "2px" }}>
          {/* Name */}
          <div
            style={{
              fontSize: "12.5px",
              fontWeight: "700",
              color: "#ffffff",
              letterSpacing: "0.3px",
              lineHeight: "1.15",
              textShadow: "0 0 14px rgba(0,212,255,0.3)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {profile.name.toUpperCase()}
          </div>

          {/* Role */}
          <div
            style={{
              fontSize: "6.5px",
              color: "#00d4ff",
              letterSpacing: "2px",
              fontWeight: "600",
              marginTop: "4px",
              marginBottom: "9px",
            }}
          >
            {profile.role}
          </div>

          {/* Sub divider */}
          <div
            style={{
              height: "1px",
              background: "rgba(0,212,255,0.15)",
              marginBottom: "8px",
            }}
          />

          {/* Info rows */}
          <InfoRow label="EDU" value={profile.education} />
          <InfoRow label="UNI" value={profile.university} small />
          <InfoRow label="LOC" value={profile.location} />
          <InfoRow label="ID" value={profile.developerId} accent />
        </div>
      </div>

      {/* ── BOTTOM SECTION ── */}
      <div style={{ marginTop: "10px", position: "relative", zIndex: 1 }}>
        <div
          style={{
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(0,212,255,0.25), transparent)",
            marginBottom: "10px",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          {/* Left: Serial + barcode + dates */}
          <div>
            <div
              style={{
                fontSize: "5px",
                color: "rgba(255,255,255,0.18)",
                letterSpacing: "0.5px",
                marginBottom: "4px",
              }}
            >
              SN: {profile.cardSerial}
            </div>

            {/* Barcode visual */}
            <div
              style={{
                display: "flex",
                gap: "1px",
                alignItems: "flex-end",
                marginBottom: "3px",
              }}
            >
              {[3, 6, 2, 8, 4, 7, 3, 5, 2, 7, 4, 3, 8, 5, 2, 6, 4].map(
                (h, i) => (
                  <div
                    key={i}
                    style={{
                      width: "1.5px",
                      height: `${h}px`,
                      background:
                        i % 3 === 0
                          ? "rgba(0,212,255,0.5)"
                          : "rgba(0,212,255,0.25)",
                    }}
                  />
                )
              )}
            </div>

            <div
              style={{
                fontSize: "5px",
                color: "rgba(255,255,255,0.15)",
                letterSpacing: "0.8px",
              }}
            >
              {profile.issueDate} — {profile.expiryDate}
            </div>
          </div>

          {/* Right: QR code */}
          <div>
            <div
              style={{
                fontSize: "5px",
                color: "rgba(0,212,255,0.45)",
                letterSpacing: "1px",
                textAlign: "center",
                marginBottom: "3px",
              }}
            >
              SCAN →
            </div>
            <div
              style={{
                padding: "3px",
                background: "rgba(255,255,255,0.96)",
                borderRadius: "5px",
                border: "1px solid rgba(0,212,255,0.35)",
                boxShadow: "0 0 8px rgba(0,212,255,0.15)",
              }}
            >
              <QRCodeDisplay value={profile.qrValue} size={52} />
            </div>
          </div>
        </div>

        {/* Microtext strip */}
        <div
          style={{
            marginTop: "7px",
            fontSize: "3.5px",
            color: "rgba(255,255,255,0.08)",
            letterSpacing: "0.8px",
            textAlign: "center",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          {"AUTHORIZED DEVELOPER • VERIFIED IDENTITY • PORTFOLIO CARD • "}
          {"AUTHORIZED DEVELOPER • VERIFIED IDENTITY • PORTFOLIO CARD • "}
          {"AUTHORIZED DEVELOPER • VERIFIED IDENTITY • PORTFOLIO CARD • "}
        </div>
      </div>
    </div>
  );
};