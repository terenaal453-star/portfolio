import React, { useRef, useEffect } from "react";

interface LanyardSystemProps {
  swingAngle:   number;
  rotX:         number;
  rotY:         number;
  cardWidth:    number;
  lanyardHeight:number;
}

export const LanyardSystem: React.FC<LanyardSystemProps> = ({
  swingAngle,
  rotX,
  rotY,
  cardWidth,
  lanyardHeight,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const W = cardWidth + 140;
  const H = lanyardHeight;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width  = W;
    canvas.height = H;
    ctx.clearRect(0, 0, W, H);

    const cx      = W / 2;
    const topY    = 0;
    const angleRad = (swingAngle * Math.PI) / 180;

    // Card attachment point swings like a pendulum
    const pendulumLen = H - 22;
    const cardTopX = cx + Math.sin(angleRad) * pendulumLen * 0.55;
    const cardTopY = H - 22;

    // ── STRAP ──────────────────────────────────────────────
    const strapW = 16;

    // Control point — sag in the middle
    const cpX = cx + (cardTopX - cx) * 0.5;
    const cpY = H * 0.45 + Math.abs(swingAngle) * 0.3;

    // Helper to draw one strap layer
    const drawStrapLayer = (
      offsetX: number,
      width:   number,
      colors:  string[],
      alpha:   number
    ) => {
      const grd = ctx.createLinearGradient(
        cx - width / 2 + offsetX, 0,
        cx + width / 2 + offsetX, 0
      );
      colors.forEach((c, i) => grd.addColorStop(i / (colors.length - 1), c));

      ctx.beginPath();
      ctx.moveTo(cx - width / 2 + offsetX, topY);
      ctx.quadraticCurveTo(
        cpX - width / 2 + offsetX, cpY,
        cardTopX - width / 2 + offsetX, cardTopY
      );
      ctx.lineTo(cardTopX + width / 2 + offsetX, cardTopY);
      ctx.quadraticCurveTo(
        cpX + width / 2 + offsetX, cpY,
        cx + width / 2 + offsetX, topY
      );
      ctx.closePath();
      ctx.globalAlpha = alpha;
      ctx.fillStyle   = grd;
      ctx.fill();
      ctx.globalAlpha = 1;
    };

    // Shadow layer
    drawStrapLayer(2, strapW, [
      "rgba(0,0,0,0.4)",
      "rgba(0,0,0,0.6)",
      "rgba(0,0,0,0.4)",
    ], 0.5);

    // Main strap — dark fabric
    drawStrapLayer(0, strapW, [
      "rgba(18,18,20,1)",
      "rgba(38,38,42,1)",
      "rgba(50,50,55,1)",
      "rgba(42,42,46,1)",
      "rgba(22,22,24,1)",
    ], 1);

    // Fabric sheen highlight
    drawStrapLayer(0, strapW, [
      "rgba(255,255,255,0)",
      "rgba(255,255,255,0.04)",
      "rgba(255,255,255,0.07)",
      "rgba(255,255,255,0.03)",
      "rgba(255,255,255,0)",
    ], 1);

    // ── STRAP EDGES ──
    // Left edge shadow
    ctx.beginPath();
    ctx.moveTo(cx - strapW / 2, topY);
    ctx.quadraticCurveTo(cpX - strapW / 2, cpY, cardTopX - strapW / 2, cardTopY);
    ctx.strokeStyle = "rgba(0,0,0,0.7)";
    ctx.lineWidth   = 1.2;
    ctx.stroke();

    // Right edge highlight
    ctx.beginPath();
    ctx.moveTo(cx + strapW / 2, topY);
    ctx.quadraticCurveTo(cpX + strapW / 2, cpY, cardTopX + strapW / 2, cardTopY);
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth   = 0.8;
    ctx.stroke();

    // ── STRAP WEAVE TEXTURE ──
    const steps = 14;
    for (let i = 0; i <= steps; i++) {
      const t  = i / steps;
      const t2 = t * t;  // ease-in curve
      const sx = cx      + (cardTopX - cx)      * t2;
      const sy = topY    + (cardTopY - topY)    * t;
      const hw = strapW / 2 - 1;

      // Horizontal stitch lines
      ctx.beginPath();
      ctx.moveTo(sx - hw, sy);
      ctx.lineTo(sx + hw, sy);
      ctx.strokeStyle = "rgba(255,255,255,0.035)";
      ctx.lineWidth   = 0.6;
      ctx.stroke();

      // Center stitch dots
      if (i % 2 === 0) {
        ctx.beginPath();
        ctx.arc(sx, sy, 0.6, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.07)";
        ctx.fill();
      }
    }

    // ── D-RING / METAL EYELET ──────────────────────────────
    const ringX = cx;
    const ringY = 14;
    const ringRx = 7;
    const ringRy = 4.5;

    // Ring shadow
    ctx.beginPath();
    ctx.ellipse(ringX, ringY + 2, ringRx, ringRy, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fill();

    // Ring body gradient
    const ringGrd = ctx.createRadialGradient(
      ringX - 1, ringY - 1, 1,
      ringX,     ringY,     ringRx
    );
    ringGrd.addColorStop(0,   "rgba(180,180,185,1)");
    ringGrd.addColorStop(0.4, "rgba(120,120,128,1)");
    ringGrd.addColorStop(0.8, "rgba(70,70,78,1)");
    ringGrd.addColorStop(1,   "rgba(45,45,52,1)");

    ctx.beginPath();
    ctx.ellipse(ringX, ringY, ringRx, ringRy, 0, 0, Math.PI * 2);
    ctx.strokeStyle = ringGrd;
    ctx.lineWidth   = 2.8;
    ctx.stroke();

    // Ring specular
    ctx.beginPath();
    ctx.ellipse(ringX - 2, ringY - 1.5, ringRx * 0.6, ringRy * 0.5, -0.3, 0, Math.PI);
    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth   = 0.8;
    ctx.stroke();

    // ── CLIP BODY ──────────────────────────────────────────
    const clipX  = cardTopX;
    const clipY  = cardTopY - 4;
    const clipW  = 14;
    const clipH  = 20;
    const clipR  = 3.5;

    // Clip drop shadow
    ctx.save();
    ctx.shadowColor   = "rgba(0,0,0,0.9)";
    ctx.shadowBlur    = 12;
    ctx.shadowOffsetY = 5;
    ctx.shadowOffsetX = 2;

    const clipGrd = ctx.createLinearGradient(
      clipX - clipW / 2, clipY,
      clipX + clipW / 2, clipY + clipH
    );
    clipGrd.addColorStop(0,    "#2e2e38");
    clipGrd.addColorStop(0.2,  "#3c3c48");
    clipGrd.addColorStop(0.5,  "#343440");
    clipGrd.addColorStop(0.8,  "#2a2a34");
    clipGrd.addColorStop(1,    "#1e1e26");

    ctx.beginPath();
    ctx.roundRect(clipX - clipW / 2, clipY - clipH / 2, clipW, clipH, clipR);
    ctx.fillStyle = clipGrd;
    ctx.fill();
    ctx.restore();

    // Clip border
    ctx.beginPath();
    ctx.roundRect(clipX - clipW / 2, clipY - clipH / 2, clipW, clipH, clipR);
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth   = 0.8;
    ctx.stroke();

    // Clip left highlight panel
    ctx.beginPath();
    ctx.roundRect(clipX - clipW / 2 + 1.5, clipY - clipH / 2 + 1.5, 4, clipH - 3, 2);
    ctx.fillStyle = "rgba(255,255,255,0.055)";
    ctx.fill();

    // Clip detail grooves
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(clipX - clipW / 2 + 2.5, clipY - clipH / 2 + 5 + i * 3.5);
      ctx.lineTo(clipX + clipW / 2 - 2.5, clipY - clipH / 2 + 5 + i * 3.5);
      ctx.strokeStyle = i === 0
        ? "rgba(255,255,255,0.08)"
        : "rgba(0,0,0,0.4)";
      ctx.lineWidth = 0.7;
      ctx.stroke();
    }

    // Clip top hook that connects to ring
    ctx.beginPath();
    ctx.arc(clipX, clipY - clipH / 2 - 2, 4.5, Math.PI, 0);
    ctx.strokeStyle = "#3a3a45";
    ctx.lineWidth   = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(clipX, clipY - clipH / 2 - 2, 4.5, Math.PI, 0);
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.lineWidth   = 0.8;
    ctx.stroke();

    // Clip bottom — card slot opening
    ctx.beginPath();
    ctx.moveTo(clipX - clipW / 2 + 2, clipY + clipH / 2 - 2);
    ctx.lineTo(clipX + clipW / 2 - 2, clipY + clipH / 2 - 2);
    ctx.strokeStyle = "rgba(0,0,0,0.6)";
    ctx.lineWidth   = 1.5;
    ctx.stroke();

  }, [swingAngle, rotX, rotY, W, H]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:      "absolute",
        top:           0,
        left:          "50%",
        transform:     "translateX(-50%)",
        pointerEvents: "none",
        width:         W,
        height:        H,
      }}
    />
  );
};