import { useRef, useEffect, useCallback } from "react";

export interface CardPhysicsState {
  rotX:        number;
  rotY:        number;
  rotZ:        number;
  posX:        number;
  posY:        number;
  swingAngle:  number;
}

export interface CardPhysicsHandlers {
  applyImpulse: (rx: number, ry: number, rz?: number) => void;
  applyCommand: (command: string) => void;
  applySwing:   (force: number) => void;
}

// ── Physics constants ──
const GRAVITY          = 0.28;   // pendulum gravity strength
const PENDULUM_DAMPING = 0.965;  // air resistance on swing
const TILT_DAMPING     = 0.88;   // card tilt resistance
const TILT_SPRING      = 0.055;  // card tilt return force
const POS_DAMPING      = 0.92;
const POS_SPRING       = 0.04;
const MAX_SWING        = 30;
const MAX_TILT         = 18;

export function useCardPhysics(
  onUpdate: (state: CardPhysicsState) => void
): CardPhysicsHandlers {

  const s = useRef({
    swingAngle: 0,
    swingVel:   0,
    tiltX:      0,
    tiltY:      0,
    tiltVelX:   0,
    tiltVelY:   0,
    posX:       0,
    posY:       0,
    posVelX:    0,
    posVelY:    0,
  });

  const rafRef      = useRef<number>(0);
  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;

  const animate = useCallback(() => {
    const p = s.current;

    // ── Pendulum physics ──
    // Restoring force = -gravity * sin(angle)
    const swingAcc = -GRAVITY * Math.sin((p.swingAngle * Math.PI) / 180);
    p.swingVel     = p.swingVel * PENDULUM_DAMPING + swingAcc;
    p.swingAngle  += p.swingVel;
    p.swingAngle   = Math.max(-MAX_SWING, Math.min(MAX_SWING, p.swingAngle));

    // ── Card tilt spring ──
    const accX  = (0 - p.tiltX) * TILT_SPRING;
    const accY  = (0 - p.tiltY) * TILT_SPRING;
    p.tiltVelX  = p.tiltVelX * TILT_DAMPING + accX;
    p.tiltVelY  = p.tiltVelY * TILT_DAMPING + accY;
    p.tiltX    += p.tiltVelX;
    p.tiltY    += p.tiltVelY;
    p.tiltX     = Math.max(-MAX_TILT, Math.min(MAX_TILT, p.tiltX));
    p.tiltY     = Math.max(-MAX_TILT, Math.min(MAX_TILT, p.tiltY));

    // ── Position spring ──
    p.posVelX = p.posVelX * POS_DAMPING + (0 - p.posX) * POS_SPRING;
    p.posVelY = p.posVelY * POS_DAMPING + (0 - p.posY) * POS_SPRING;
    p.posX   += p.posVelX;
    p.posY   += p.posVelY;

    onUpdateRef.current({
      rotX:       p.tiltX,
      rotY:       p.tiltY,
      rotZ:       p.swingAngle,
      posX:       p.posX,
      posY:       p.posY,
      swingAngle: p.swingAngle,
    });

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate]);

  const applyImpulse = useCallback(
    (rx: number, ry: number, rz: number = 0) => {
      s.current.tiltVelX  += rx;
      s.current.tiltVelY  += ry;
      s.current.swingVel  += rz;
    }, []
  );

  const applySwing = useCallback((force: number) => {
    s.current.swingVel += force;
  }, []);

  const applyCommand = useCallback((command: string) => {
    const cmd = command.trim().toLowerCase();
    const p   = s.current;
    switch (cmd) {
      case "whoami":  p.swingVel += 3;  p.tiltVelY += 2;              break;
      case "info":    p.swingVel += -2; p.tiltVelX += 2;              break;
      case "card":    p.swingVel += 6;  p.tiltVelX += 3; p.tiltVelY += 3; break;
      case "about":   p.swingVel += 4;                                break;
      case "flip":    p.tiltVelY += 15;                               break;
      case "links":   p.swingVel += -4;                               break;
      case "skills":  p.swingVel += 5;  p.tiltVelX += -2;            break;
      case "contact": p.swingVel += -3; p.tiltVelY += -2;            break;
      case "banner":  p.swingVel += 2;                                break;
      default:        p.swingVel += 1;                                break;
    }
  }, []);

  return { applyImpulse, applyCommand, applySwing };
}