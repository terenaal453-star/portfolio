import React, { useState } from "react";
import { profile } from "../../data/profile";
import { QRCodeDisplay } from "./QRCode";

interface RealisticCardProps {
  rotX:       number;
  rotY:       number;
  swingAngle: number;
  isFlipped:  boolean;   // ← new prop — controls which face renders
}

export const RealisticCard: React.FC<RealisticCardProps> = ({
  rotX,
  rotY,
  swingAngle,
  isFlipped,
}) => {
  const [imgError, setImgError] = useState(false);

  const lightX = 50 + rotY * 2.2;
  const lightY = 35 - rotX * 1.8;

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
        position:                 "absolute",
        inset:                    0,
        borderRadius:             "14px",
        backfaceVisibility:       "hidden",
        WebkitBackfaceVisibility: "hidden",
        overflow:                 "hidden",
        background:               "linear-gradient(175deg, #1a1a1e 0%, #212124 40%, #1c1c20 100%)",
        boxShadow: `
          0 2px 4px  rgba(0,0,0,0.95),
          0 8px 20px rgba(0,0,0,0.88),
          0 20px 48px rgba(0,0,0,0.72),
          inset 0 1px 0 rgba(255,255,255,0.07),
          inset 0 -1px 0 rgba(0,0,0,0.55)
        `,
      }}>
        {/* Plastic grain */}
        <div style={{
          position:      "absolute", inset: 0, opacity: 0.45,
          background:    `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`,
          pointerEvents: "none", borderRadius: "14px",
        }} />

        {/* Dynamic light */}
        <div style={{
          position:      "absolute", inset: 0,
          background:    `radial-gradient(ellipse at ${lightX}% ${lightY}%, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.03) 40%, transparent 68%)`,
          borderRadius:  "14px", pointerEvents: "none",
        }} />

        {/* Gloss band */}
        <div style={{
          position:      "absolute", inset: 0,
          background:    `linear-gradient(${108 + swingAngle * 0.5}deg, transparent 32%, rgba(255,255,255,0.022) 49%, rgba(255,255,255,0.038) 50%, rgba(255,255,255,0.022) 51%, transparent 68%)`,
          borderRadius:  "14px", pointerEvents: "none",
        }} />

        {/* Top specular edge */}
        <div style={{
          position:   "absolute", top: 0, left: "8%", right: "8%", height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.10), rgba(255,255,255,0.16), rgba(255,255,255,0.10), transparent)",
        }} />

        {/* CARD CONTENT */}
        <div style={{
          position:      "relative",
          width:         "100%",
          height:        "100%",
          display:       "flex",
          flexDirection: "column",
          padding:       "14px 14px 10px 14px",
          boxSizing:     "border-box",
          zIndex:        1,
        }}>

          {/* TOP BAR */}
          <div style={{
            display:        "flex",
            alignItems:     "center",
            justifyContent: "space-between",
            marginBottom:   "12px",
            paddingBottom:  "10px",
            borderBottom:   "1px solid rgba(255,255,255,0.07)",
            flexShrink:     0,
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:"7px" }}>
              <div style={{
                width:26, height:26, borderRadius:"6px",
                background:"linear-gradient(135deg,#2c2c38,#3a3a48)",
                border:"1px solid rgba(255,255,255,0.1)",
                display:"flex", alignItems:"center", justifyContent:"center",
                boxShadow:"0 2px 6px rgba(0,0,0,0.6)", flexShrink:0,
              }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <polygon points="7,1 13,11.5 1,11.5"
                    fill="none" stroke="rgba(255,255,255,0.65)"
                    strokeWidth="1.2" strokeLinejoin="round"/>
                  <circle cx="7" cy="8" r="1.8" fill="rgba(255,255,255,0.55)"/>
                </svg>
              </div>
              <div>
                <div style={{
                  fontSize:"7px", fontWeight:"700",
                  color:"rgba(255,255,255,0.85)",
                  letterSpacing:"1.5px", textTransform:"uppercase",
                  fontFamily:"Inter,sans-serif", lineHeight:"1",
                }}>
                  Dev Portfolio
                </div>
                <div style={{
                  fontSize:"4.5px", color:"rgba(255,255,255,0.25)",
                  fontFamily:"Inter,sans-serif", marginTop:"2px",
                }}>
                  {profile.university}
                </div>
              </div>
            </div>
            <div style={{
              padding:"3px 8px",
              background:"rgba(255,255,255,0.05)",
              border:"1px solid rgba(255,255,255,0.1)",
              borderRadius:"4px",
            }}>
              <div style={{
                fontSize:"5.5px", color:"rgba(255,255,255,0.4)",
                letterSpacing:"1.5px", fontFamily:"Inter,sans-serif", fontWeight:"600",
              }}>
                ID CARD
              </div>
            </div>
          </div>

          {/* CENTERED PHOTO */}
          <div style={{
            display:"flex", justifyContent:"center",
            alignItems:"center", marginBottom:"10px", flexShrink:0,
          }}>
            <div style={{ width:"82px", height:"82px", position:"relative", flexShrink:0 }}>
              {!imgError ? (
                <img
                  src={profile.profileImage}
                  alt={profile.name}
                  onError={() => setImgError(true)}
                  style={{
                    width:"100%", height:"100%",
                    objectFit:"cover", objectPosition:"center top",
                    display:"block",
                    maskImage:"radial-gradient(ellipse 80% 80% at 50% 50%, black 50%, transparent 100%)",
                    WebkitMaskImage:"radial-gradient(ellipse 80% 80% at 50% 50%, black 50%, transparent 100%)",
                    filter:"contrast(1.04) brightness(0.92) saturate(0.92)",
                  }}
                />
              ) : (
                <div style={{
                  width:"100%", height:"100%",
                  display:"flex", alignItems:"center", justifyContent:"center",
                }}>
                  <svg width="58" height="70" viewBox="0 0 58 70" fill="none">
                    <circle cx="29" cy="22" r="16" fill="rgba(255,255,255,0.11)"/>
                    <ellipse cx="29" cy="56" rx="24" ry="16" fill="rgba(255,255,255,0.06)"/>
                  </svg>
                </div>
              )}
              <div style={{
                position:"absolute", inset:0,
                background:`radial-gradient(ellipse at ${lightX}% ${lightY}%, rgba(255,255,255,0.055) 0%, transparent 65%)`,
                pointerEvents:"none", mixBlendMode:"overlay",
              }} />
            </div>
          </div>

          {/* NAME + ROLE + ACTIVE */}
          <div style={{
            textAlign:"center", marginBottom:"10px", flexShrink:0,
          }}>
            <div style={{
              fontSize:"15px", fontWeight:"800", color:"#ffffff",
              letterSpacing:"-0.3px", lineHeight:"1.15",
              fontFamily:"Inter,sans-serif", textShadow:"0 1px 4px rgba(0,0,0,0.9)",
            }}>
              {profile.name}
            </div>
            <div style={{
              fontSize:"6px", color:"rgba(255,255,255,0.32)",
              letterSpacing:"2.5px", fontWeight:"500",
              fontFamily:"Inter,sans-serif", textTransform:"uppercase", marginTop:"4px",
            }}>
              {profile.role}
            </div>
            <div style={{
              display:"inline-flex", alignItems:"center", gap:"4px",
              padding:"3px 9px",
              background:"rgba(34,197,94,0.09)",
              border:"1px solid rgba(34,197,94,0.2)",
              borderRadius:"20px", marginTop:"7px",
            }}>
              <div style={{
                width:"4px", height:"4px", borderRadius:"50%",
                background:"#22c55e", boxShadow:"0 0 5px rgba(34,197,94,0.9)",
              }} />
              <span style={{
                fontSize:"5px", color:"#22c55e", letterSpacing:"1px",
                fontFamily:"Inter,sans-serif", fontWeight:"600",
              }}>
                ACTIVE
              </span>
            </div>
          </div>

          {/* DIVIDER */}
          <div style={{
            height:"1px", background:"rgba(255,255,255,0.07)",
            marginBottom:"8px", flexShrink:0,
          }} />

          {/* INFO ROWS */}
          <div style={{
            display:"flex", flexDirection:"column", gap:"6px",
            flex:1, minHeight:0, paddingBottom:"2px",
          }}>
            <InfoRow label="NO."  value={profile.developerId} highlight />
            <InfoRow label="EDU"  value={profile.education} />
            <InfoRow label="UNI"  value={profile.university} />
            <InfoRow label="LOC"  value={profile.location} />
            <InfoRow label="EXP"  value={profile.expiryDate} />
          </div>

          {/* BOTTOM BAR */}
          <div style={{
            borderTop:"1px solid rgba(255,255,255,0.06)",
            paddingTop:"8px",
            display:"flex", justifyContent:"space-between", alignItems:"flex-end",
            flexShrink:0, marginTop:"6px",
          }}>
            {/* Barcode */}
            <div>
              <div style={{ display:"flex", gap:"1px", alignItems:"flex-end", marginBottom:"3px" }}>
                {[4,7,3,9,5,8,3,6,2,8,4,7,3,9,5,8,4,6,3].map((h,i) => (
                  <div key={i} style={{
                    width:        i % 3 === 0 ? "2px" : "1.2px",
                    height:       `${h}px`,
                    background:   i % 5 === 0
                      ? "rgba(255,255,255,0.55)"
                      : i % 3 === 0
                      ? "rgba(255,255,255,0.35)"
                      : "rgba(255,255,255,0.2)",
                    borderRadius: "0.5px",
                  }} />
                ))}
              </div>
              <div style={{
                fontSize:"4px", color:"rgba(255,255,255,0.16)",
                letterSpacing:"0.8px",
                fontFamily:"'JetBrains Mono','Courier New',monospace",
              }}>
                {profile.cardSerial}
              </div>
            </div>
            {/* QR */}
            <div style={{
              padding:"3px", background:"#f0f0f0",
              borderRadius:"4px", boxShadow:"0 2px 8px rgba(0,0,0,0.7)",
            }}>
              <QRCodeDisplay value={profile.qrValue} size={40} />
            </div>
          </div>
        </div>

        {/* Bottom vignette */}
        <div style={{
          position:"absolute", bottom:0, left:0, right:0, height:"42px",
          background:"linear-gradient(transparent,rgba(0,0,0,0.3))",
          pointerEvents:"none", borderRadius:"0 0 14px 14px",
        }} />
      </div>

      {/* ════ CARD THICKNESS EDGE ════ */}
      <div style={{
        position:"absolute", bottom:"-4px", left:"6px", right:"6px", height:"5px",
        background:"linear-gradient(180deg,#2a2a2e,#111114)",
        transform:"rotateX(-90deg)", transformOrigin:"bottom center",
        borderRadius:"0 0 4px 4px", boxShadow:"0 8px 24px rgba(0,0,0,0.9)",
      }} />

      {/* ════════════════════════════
          BACK FACE
      ════════════════════════════ */}
      <div style={{
        position:                 "absolute",
        inset:                    0,
        borderRadius:             "14px",
        backfaceVisibility:       "hidden",
        WebkitBackfaceVisibility: "hidden",
        transform:                "rotateY(180deg)",
        background:               "linear-gradient(165deg,#18181c 0%,#1e1e22 100%)",
        display:                  "flex",
        flexDirection:            "column",
        padding:                  "14px",
        boxSizing:                "border-box",
        boxShadow:                "inset 0 0 40px rgba(0,0,0,0.55)",
      }}>
        {/* Grain */}
        <div style={{
          position:"absolute", inset:0, opacity:0.4,
          background:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`,
          pointerEvents:"none", borderRadius:"14px",
        }} />

        {/* Magnetic strip */}
        <div style={{
          position:"absolute", top:"24px", left:0, right:0, height:"36px",
          background:"linear-gradient(180deg,#080808 0%,#101010 50%,#080808 100%)",
          boxShadow:"inset 0 2px 5px rgba(0,0,0,0.95)",
        }} />

        {/* Signature strip */}
        <div style={{
          position:"absolute", top:"74px", left:"14px", right:"14px", height:"28px",
          background:"rgba(255,255,255,0.05)",
          border:"1px solid rgba(255,255,255,0.07)",
          borderRadius:"3px",
          display:"flex", alignItems:"center", padding:"0 10px", gap:"10px",
        }}>
          <span style={{ fontSize:"4.5px", color:"rgba(255,255,255,0.18)", letterSpacing:"1px", fontFamily:"Inter,sans-serif" }}>
            SIGNATURE
          </span>
          <span style={{ fontSize:"14px", color:"rgba(255,255,255,0.32)", fontStyle:"italic", fontFamily:"Georgia,serif" }}>
            {profile.name.split(" ")[0]}
          </span>
        </div>

        {/* Back content */}
        <div style={{
          position:"relative", zIndex:1,
          marginTop:"112px",
          display:"flex", flexDirection:"column", gap:"8px",
        }}>
          <div style={{ textAlign:"center", marginBottom:"2px" }}>
            <div style={{
              fontSize:"6.5px", color:"rgba(255,255,255,0.4)",
              letterSpacing:"2.5px", fontFamily:"Inter,sans-serif", fontWeight:"600",
            }}>
              AUTHORIZED DEVELOPER
            </div>
            <div style={{ height:"1px", background:"rgba(255,255,255,0.07)", margin:"6px 0" }} />
            <div style={{
              fontSize:"12px", color:"rgba(255,255,255,0.78)",
              fontWeight:"700", fontFamily:"Inter,sans-serif",
            }}>
              {profile.name}
            </div>
            <div style={{
              fontSize:"5.5px", color:"rgba(255,255,255,0.28)",
              letterSpacing:"1px", fontFamily:"Inter,sans-serif", marginTop:"3px",
            }}>
              {profile.role}
            </div>
          </div>

          {/* Contact links */}
          <div style={{
            display:"flex", flexDirection:"column", gap:"5px",
            padding:"9px 10px",
            background:"rgba(255,255,255,0.03)",
            border:"1px solid rgba(255,255,255,0.07)",
            borderRadius:"6px",
          }}>
            <BackRow icon="🌐" label="WEB"  value={profile.portfolio.replace("https://","")} />
            <BackRow icon="⌥"  label="GIT"  value={profile.github.replace("https://","")} />
            <BackRow icon="in" label="LIN"  value={profile.linkedin.replace("https://linkedin.com/","").slice(0,28)} />
            <BackRow icon="@"  label="MAIL" value={profile.email} />
          </div>

          {/* Return notice */}
          <div style={{
            padding:"6px 10px",
            background:"rgba(255,70,70,0.05)",
            border:"1px solid rgba(255,70,70,0.12)",
            borderRadius:"4px", textAlign:"center",
          }}>
            <div style={{
              fontSize:"5px", color:"rgba(255,110,110,0.45)",
              letterSpacing:"0.5px", fontFamily:"Inter,sans-serif",
            }}>
              If found, return to: {profile.email}
            </div>
          </div>

          <div style={{ textAlign:"center" }}>
            <div style={{
              fontSize:"7px", color:"rgba(255,255,255,0.14)",
              letterSpacing:"2px",
              fontFamily:"'JetBrains Mono',monospace",
            }}>
              {profile.developerId}
            </div>
          </div>

          {/* Click hint on back */}
          <div style={{ textAlign:"center", marginTop:"4px" }}>
            <div style={{
              fontSize:"7px", color:"rgba(255,255,255,0.1)",
              letterSpacing:"1px", fontFamily:"'JetBrains Mono',monospace",
            }}>
              click to flip back
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Front info row ──
const InfoRow: React.FC<{
  label:      string;
  value:      string;
  highlight?: boolean;
}> = ({ label, value, highlight = false }) => (
  <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
    <span style={{
      fontSize:"5px", color:"rgba(255,255,255,0.25)",
      letterSpacing:"0.8px", width:"22px", flexShrink:0,
      fontFamily:"Inter,sans-serif", fontWeight:"600",
      textTransform:"uppercase",
    }}>
      {label}
    </span>
    <span style={{
      fontSize:      "7.5px",
      color:         highlight ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.5)",
      letterSpacing: highlight ? "0.4px" : "0.1px",
      fontWeight:    highlight ? "700" : "400",
      fontFamily:    "Inter,sans-serif",
      whiteSpace:    "nowrap", overflow:"hidden", textOverflow:"ellipsis",
    }}>
      {value}
    </span>
  </div>
);

// ── Back contact row ──
const BackRow: React.FC<{
  icon:  string;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
    <span style={{
      fontSize:"9px", width:"14px", textAlign:"center",
      flexShrink:0, color:"rgba(255,255,255,0.38)",
    }}>
      {icon}
    </span>
    <span style={{
      fontSize:"5px", color:"rgba(255,255,255,0.2)",
      width:"26px", letterSpacing:"0.5px",
      fontFamily:"Inter,sans-serif", textTransform:"uppercase", flexShrink:0,
    }}>
      {label}
    </span>
    <span style={{
      fontSize:"6px", color:"rgba(255,255,255,0.52)",
      fontFamily:"'JetBrains Mono',monospace", letterSpacing:"0.2px",
      overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
    }}>
      {value}
    </span>
  </div>
);