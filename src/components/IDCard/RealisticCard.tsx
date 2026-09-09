import React, { useState } from "react";
import { profile } from "../../data/profile";
import { QRCodeDisplay } from "./QRCode";

interface RealisticCardProps {
  rotX:       number;
  rotY:       number;
  swingAngle: number;
}

// ── Single info row inside the card ──
const InfoLine: React.FC<{
  label:      string;
  value:      string;
  highlight?: boolean;
}> = ({ label, value, highlight = false }) => (
  <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
    <span style={{
      fontSize:     "5px",
      color:        "rgba(255,255,255,0.28)",
      letterSpacing:"0.8px",
      minWidth:     "20px",
      fontFamily:   "Inter, sans-serif",
      fontWeight:   "500",
      flexShrink:   0,
      textTransform:"uppercase",
    }}>
      {label}
    </span>
    <span style={{
      fontSize:      "7px",
      color:         highlight ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.52)",
      letterSpacing: highlight ? "0.3px" : "0.1px",
      fontWeight:    highlight ? "700" : "400",
      fontFamily:    "Inter, sans-serif",
      whiteSpace:    "nowrap",
      overflow:      "hidden",
      textOverflow:  "ellipsis",
    }}>
      {value}
    </span>
  </div>
);

export const RealisticCard: React.FC<RealisticCardProps> = ({
  rotX,
  rotY,
  swingAngle,
}) => {
  const [imgError, setImgError] = useState(false);

  // Dynamic light position based on tilt
  const lightX = 50 + rotY * 2.2;
  const lightY = 35 - rotX * 1.8;

  // Subtle gloss shift from swing
  const glossX = 50 + swingAngle * 0.6;

  return (
    <div style={{
      width:          "100%",
      height:         "100%",
      position:       "relative",
      transformStyle: "preserve-3d",
    }}>

      {/* ════════════════════════════
          FRONT FACE
      ════════════════════════════ */}
      <div style={{
        position:            "absolute",
        inset:               0,
        borderRadius:        "12px",
        backfaceVisibility:  "hidden",
        WebkitBackfaceVisibility: "hidden",
        overflow:            "hidden",

        // Dark matte plastic
        background: "linear-gradient(160deg, #1e1e22 0%, #252528 45%, #1a1a1e 100%)",

        // Realistic card shadow layers
        boxShadow: `
          0 1px 2px  rgba(0,0,0,0.95),
          0 4px 8px  rgba(0,0,0,0.85),
          0 12px 28px rgba(0,0,0,0.75),
          0 28px 56px rgba(0,0,0,0.55),
          inset 0 1px 0 rgba(255,255,255,0.07),
          inset 0 -1px 0 rgba(0,0,0,0.6),
          inset 1px 0 0 rgba(255,255,255,0.03),
          inset -1px 0 0 rgba(0,0,0,0.3)
        `,
      }}>

        {/* ── Plastic card texture / grain ── */}
        <div style={{
          position:   "absolute",
          inset:      0,
          opacity:    0.5,
          background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`,
          pointerEvents: "none",
          borderRadius: "12px",
        }} />

        {/* ── Primary dynamic light reflection ── */}
        <div style={{
          position:   "absolute",
          inset:      0,
          background: `radial-gradient(
            ellipse at ${lightX}% ${lightY}%,
            rgba(255,255,255,0.10) 0%,
            rgba(255,255,255,0.04) 35%,
            transparent 65%
          )`,
          borderRadius:  "12px",
          pointerEvents: "none",
        }} />

        {/* ── Secondary gloss band from swing ── */}
        <div style={{
          position:   "absolute",
          inset:      0,
          background: `linear-gradient(
            ${105 + swingAngle * 0.5}deg,
            transparent 30%,
            rgba(255,255,255,0.025) 48%,
            rgba(255,255,255,0.04)  50%,
            rgba(255,255,255,0.025) 52%,
            transparent 70%
          )`,
          borderRadius:  "12px",
          pointerEvents: "none",
        }} />

        {/* ── Top edge specular highlight ── */}
        <div style={{
          position:   "absolute",
          top:        0,
          left:       "8%",
          right:      "8%",
          height:     "1px",
          background: `linear-gradient(90deg,
            transparent,
            rgba(255,255,255,${0.08 + Math.max(0, -rotX) * 0.004}),
            rgba(255,255,255,${0.14 + Math.max(0, -rotX) * 0.006}),
            rgba(255,255,255,${0.08 + Math.max(0, -rotX) * 0.004}),
            transparent
          )`,
        }} />

        {/* ── Left edge specular ── */}
        <div style={{
          position:   "absolute",
          top:        "5%",
          bottom:     "5%",
          left:       0,
          width:      "1px",
          background: `linear-gradient(180deg,
            transparent,
            rgba(255,255,255,${0.04 + Math.max(0, rotY) * 0.003}),
            transparent
          )`,
        }} />

        {/* ════════════════════════════
            CARD CONTENT
        ════════════════════════════ */}
        <div style={{
          position:      "relative",
          width:         "100%",
          height:        "100%",
          display:       "flex",
          flexDirection: "column",
          padding:       "15px",
          boxSizing:     "border-box",
          zIndex:        1,
        }}>

          {/* ── TOP BAR — Organisation ── */}
          <div style={{
            display:        "flex",
            alignItems:     "center",
            justifyContent: "space-between",
            marginBottom:   "11px",
            paddingBottom:  "10px",
            borderBottom:   "1px solid rgba(255,255,255,0.07)",
          }}>
            {/* Logo + org name */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{
                width:        "26px",
                height:       "26px",
                borderRadius: "6px",
                background:   "linear-gradient(135deg, #2c2c38, #3a3a48)",
                border:       "1px solid rgba(255,255,255,0.1)",
                display:      "flex",
                alignItems:   "center",
                justifyContent:"center",
                boxShadow:    "0 2px 6px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)",
                flexShrink:   0,
              }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <polygon
                    points="7,1 13,11.5 1,11.5"
                    fill="none"
                    stroke="rgba(255,255,255,0.65)"
                    strokeWidth="1.2"
                    strokeLinejoin="round"
                  />
                  <circle cx="7" cy="8" r="1.8" fill="rgba(255,255,255,0.55)" />
                </svg>
              </div>
              <div>
                <div style={{
                  fontSize:      "7px",
                  fontWeight:    "700",
                  color:         "rgba(255,255,255,0.82)",
                  letterSpacing: "1.2px",
                  textTransform: "uppercase",
                  fontFamily:    "Inter, sans-serif",
                  lineHeight:    "1",
                }}>
                  Dev Portfolio
                </div>
                <div style={{
                  fontSize:      "5px",
                  color:         "rgba(255,255,255,0.28)",
                  letterSpacing: "0.5px",
                  fontFamily:    "Inter, sans-serif",
                  marginTop:     "2px",
                }}>
                  {profile.university}
                </div>
              </div>
            </div>

            {/* ID label chip */}
            <div style={{
              padding:    "3px 8px",
              background: "rgba(255,255,255,0.05)",
              border:     "1px solid rgba(255,255,255,0.1)",
              borderRadius:"4px",
              boxShadow:  "inset 0 1px 0 rgba(255,255,255,0.04)",
            }}>
              <div style={{
                fontSize:      "5.5px",
                color:         "rgba(255,255,255,0.4)",
                letterSpacing: "1.5px",
                fontFamily:    "Inter, sans-serif",
                fontWeight:    "600",
              }}>
                ID CARD
              </div>
            </div>
          </div>

          {/* ── MIDDLE — Photo + Info ── */}
          <div style={{
            display:       "flex",
            gap:           "12px",
            flex:          1,
            marginBottom:  "11px",
            alignItems:    "flex-start",
          }}>

            {/* Photo column */}
            <div style={{
              flexShrink:    0,
              display:       "flex",
              flexDirection: "column",
              alignItems:    "center",
              gap:           "6px",
            }}>
              {/* Photo frame */}
              <div style={{
                width:        "68px",
                height:       "86px",
                borderRadius: "5px",
                overflow:     "hidden",
                position:     "relative",
                background:   "linear-gradient(145deg, #28282e, #1c1c20)",
                border:       "1px solid rgba(255,255,255,0.1)",
                boxShadow:    `
                  0 3px 10px rgba(0,0,0,0.8),
                  0 1px 3px  rgba(0,0,0,0.9),
                  inset 0 1px 0 rgba(255,255,255,0.05)
                `,
              }}>
                {!imgError ? (
                  <img
                    src={profile.profileImage}
                    alt={profile.name}
                    onError={() => setImgError(true)}
                    style={{
                      width:           "100%",
                      height:          "100%",
                      objectFit:       "cover",
                      objectPosition:  "center top",
                      display:         "block",
                      filter:          "contrast(1.04) brightness(0.94) saturate(0.95)",
                    }}
                  />
                ) : (
                  /* Placeholder silhouette */
                  <div style={{
                    width:          "100%",
                    height:         "100%",
                    display:        "flex",
                    flexDirection:  "column",
                    alignItems:     "center",
                    justifyContent: "center",
                    background:     "linear-gradient(160deg, #262630, #1a1a22)",
                    gap:            "4px",
                  }}>
                    <svg width="38" height="48" viewBox="0 0 38 48" fill="none">
                      <circle
                        cx="19" cy="14" r="10"
                        fill="rgba(255,255,255,0.13)"
                        stroke="rgba(255,255,255,0.06)"
                        strokeWidth="0.5"
                      />
                      <ellipse
                        cx="19" cy="38" rx="16" ry="11"
                        fill="rgba(255,255,255,0.08)"
                        stroke="rgba(255,255,255,0.04)"
                        strokeWidth="0.5"
                      />
                    </svg>
                    <div style={{
                      fontSize:   "4.5px",
                      color:      "rgba(255,255,255,0.18)",
                      letterSpacing:"1px",
                      fontFamily: "Inter, sans-serif",
                    }}>
                      PHOTO
                    </div>
                  </div>
                )}

                {/* Inner shadow overlay */}
                <div style={{
                  position:     "absolute",
                  inset:        0,
                  boxShadow:    "inset 0 0 14px rgba(0,0,0,0.55)",
                  borderRadius: "5px",
                  pointerEvents:"none",
                }} />

                {/* Dynamic photo light */}
                <div style={{
                  position:     "absolute",
                  inset:        0,
                  background:   `radial-gradient(
                    ellipse at ${lightX}% ${lightY}%,
                    rgba(255,255,255,0.05) 0%,
                    transparent 60%
                  )`,
                  borderRadius:  "5px",
                  pointerEvents: "none",
                  mixBlendMode:  "overlay",
                }} />
              </div>

              {/* Active status badge */}
              <div style={{
                display:     "flex",
                alignItems:  "center",
                gap:         "3px",
                padding:     "2px 7px",
                background:  "rgba(34,197,94,0.1)",
                border:      "1px solid rgba(34,197,94,0.22)",
                borderRadius:"20px",
                boxShadow:   "0 0 8px rgba(34,197,94,0.08)",
              }}>
                <div style={{
                  width:     "4px",
                  height:    "4px",
                  borderRadius: "50%",
                  background: "#22c55e",
                  boxShadow:  "0 0 4px rgba(34,197,94,0.8)",
                }} />
                <span style={{
                  fontSize:      "4.5px",
                  color:         "#22c55e",
                  letterSpacing: "0.8px",
                  fontFamily:    "Inter, sans-serif",
                  fontWeight:    "600",
                }}>
                  ACTIVE
                </span>
              </div>
            </div>

            {/* Info column */}
            <div style={{
              flex:          1,
              display:       "flex",
              flexDirection: "column",
              justifyContent:"space-between",
              minWidth:      0,
              height:        "100%",
            }}>
              {/* Name + role */}
              <div style={{ marginBottom: "10px" }}>
                <div style={{
                  fontSize:      "14px",
                  fontWeight:    "800",
                  color:         "#ffffff",
                  letterSpacing: "-0.3px",
                  lineHeight:    "1.1",
                  fontFamily:    "Inter, sans-serif",
                  textShadow:    "0 1px 4px rgba(0,0,0,0.9)",
                  whiteSpace:    "nowrap",
                  overflow:      "hidden",
                  textOverflow:  "ellipsis",
                }}>
                  {profile.name}
                </div>
                <div style={{
                  fontSize:      "6.5px",
                  color:         "rgba(255,255,255,0.38)",
                  letterSpacing: "1.8px",
                  fontWeight:    "500",
                  fontFamily:    "Inter, sans-serif",
                  textTransform: "uppercase",
                  marginTop:     "4px",
                }}>
                  {profile.role}
                </div>
              </div>

              {/* Info rows */}
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <InfoLine label="No."  value={profile.developerId} highlight />
                <InfoLine label="Edu"  value={profile.education} />
                <InfoLine label="Loc"  value={profile.location} />
                <InfoLine label="Exp"  value={profile.expiryDate} />
              </div>
            </div>
          </div>

          {/* ── BOTTOM — Barcode + QR ── */}
          <div style={{
            borderTop:    "1px solid rgba(255,255,255,0.06)",
            paddingTop:   "10px",
            display:      "flex",
            justifyContent:"space-between",
            alignItems:   "flex-end",
          }}>
            {/* Barcode */}
            <div>
              <div style={{
                display:    "flex",
                gap:        "1px",
                alignItems: "flex-end",
                marginBottom:"4px",
              }}>
                {[4,7,3,9,5,8,3,6,2,8,4,7,3,9,5,8,4,6,3,7,5].map((h, i) => (
                  <div key={i} style={{
                    width:        i % 3 === 0 ? "2px" : "1.2px",
                    height:       `${h}px`,
                    background:   i % 5 === 0
                      ? "rgba(255,255,255,0.55)"
                      : i % 3 === 0
                      ? "rgba(255,255,255,0.38)"
                      : "rgba(255,255,255,0.22)",
                    borderRadius: "0.5px",
                  }} />
                ))}
              </div>
              <div style={{
                fontSize:      "4px",
                color:         "rgba(255,255,255,0.18)",
                letterSpacing: "0.8px",
                fontFamily:    "'JetBrains Mono', 'Courier New', monospace",
              }}>
                {profile.cardSerial}
              </div>
            </div>

            {/* QR Code */}
            <div style={{
              padding:      "3px",
              background:   "#f2f2f2",
              borderRadius: "4px",
              boxShadow:    "0 3px 10px rgba(0,0,0,0.7), inset 0 0 0 0.5px rgba(0,0,0,0.1)",
            }}>
              <QRCodeDisplay value={profile.qrValue} size={44} />
            </div>
          </div>
        </div>

        {/* ── Bottom vignette ── */}
        <div style={{
          position:     "absolute",
          bottom:       0, left: 0, right: 0,
          height:       "45px",
          background:   "linear-gradient(transparent, rgba(0,0,0,0.35))",
          pointerEvents:"none",
          borderRadius: "0 0 12px 12px",
        }} />
      </div>

      {/* ════════════════════════════
          CARD THICKNESS — bottom edge
      ════════════════════════════ */}
      <div style={{
        position:        "absolute",
        bottom:          "-4px",
        left:            "6px",
        right:           "6px",
        height:          "5px",
        background:      "linear-gradient(180deg, #2a2a2e, #111114)",
        transform:       "rotateX(-90deg)",
        transformOrigin: "bottom center",
        borderRadius:    "0 0 4px 4px",
        boxShadow:       "0 8px 24px rgba(0,0,0,0.9)",
      }} />

      {/* ════════════════════════════
          BACK FACE
      ════════════════════════════ */}
      <div style={{
        position:            "absolute",
        inset:               0,
        borderRadius:        "12px",
        backfaceVisibility:  "hidden",
        WebkitBackfaceVisibility: "hidden",
        transform:           "rotateY(180deg)",
        background:          "linear-gradient(160deg, #1a1a1c 0%, #202024 100%)",
        display:             "flex",
        flexDirection:       "column",
        padding:             "18px",
        boxSizing:           "border-box",
        boxShadow:           "inset 0 0 40px rgba(0,0,0,0.6)",
      }}>
        {/* Magnetic strip */}
        <div style={{
          position:  "absolute",
          top:       "28px",
          left:      0,
          right:     0,
          height:    "38px",
          background:"linear-gradient(180deg, #080808 0%, #0f0f0f 50%, #080808 100%)",
          boxShadow: "inset 0 2px 5px rgba(0,0,0,0.95), inset 0 -1px 3px rgba(0,0,0,0.8)",
        }} />

        {/* Signature strip */}
        <div style={{
          position:    "absolute",
          top:         "82px",
          left:        "16px",
          right:       "16px",
          height:      "30px",
          background:  "rgba(255,255,255,0.05)",
          border:      "1px solid rgba(255,255,255,0.07)",
          borderRadius:"3px",
          display:     "flex",
          alignItems:  "center",
          padding:     "0 10px",
          gap:         "10px",
        }}>
          <div style={{
            fontSize:   "4.5px",
            color:      "rgba(255,255,255,0.18)",
            letterSpacing:"1px",
            fontFamily: "Inter, sans-serif",
          }}>
            SIGNATURE
          </div>
          <div style={{
            fontSize:   "14px",
            color:      "rgba(255,255,255,0.35)",
            fontStyle:  "italic",
            fontFamily: "Georgia, 'Times New Roman', serif",
          }}>
            {profile.name.split(" ")[0]}
          </div>
        </div>

        {/* Back text content */}
        <div style={{
          marginTop:  "56px",
          textAlign:  "center",
          display:    "flex",
          flexDirection:"column",
          gap:        "8px",
          alignItems: "center",
        }}>
          <div style={{
            fontSize:      "7px",
            color:         "rgba(255,255,255,0.45)",
            letterSpacing: "2.5px",
            fontFamily:    "Inter, sans-serif",
            fontWeight:    "600",
          }}>
            AUTHORIZED DEVELOPER
          </div>

          <div style={{
            height:    "1px",
            width:     "80px",
            background:"rgba(255,255,255,0.08)",
          }} />

          <div style={{
            fontSize:   "12px",
            color:      "rgba(255,255,255,0.75)",
            fontWeight: "700",
            fontFamily: "Inter, sans-serif",
          }}>
            {profile.name}
          </div>

          <div style={{
            fontSize:   "7px",
            color:      "rgba(255,255,255,0.28)",
            letterSpacing:"0.5px",
            fontFamily: "Inter, sans-serif",
          }}>
            {profile.portfolio.replace("https://", "")}
          </div>

          <div style={{
            marginTop:    "6px",
            padding:      "7px 14px",
            background:   "rgba(255,80,80,0.06)",
            border:       "1px solid rgba(255,80,80,0.14)",
            borderRadius: "5px",
            fontSize:     "5.5px",
            color:        "rgba(255,120,120,0.5)",
            letterSpacing:"0.6px",
            fontFamily:   "Inter, sans-serif",
          }}>
            If found, return to: {profile.email}
          </div>

          <div style={{
            fontSize:      "8px",
            color:         "rgba(255,255,255,0.18)",
            letterSpacing: "2px",
            fontFamily:    "'JetBrains Mono', monospace",
            marginTop:     "4px",
          }}>
            {profile.developerId}
          </div>
        </div>
      </div>
    </div>
  );
};