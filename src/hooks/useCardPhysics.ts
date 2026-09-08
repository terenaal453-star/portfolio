import { useRef, useEffect, useCallback } from "react";

export interface CardPhysicsState {
  rotX: number;
  rotY: number;
  rotZ: number;
  posX: number;
  posY: number;
}

export interface CardPhysicsHandlers {
  applyImpulse: (rx: number, ry: number, rz?: number) => void;
  applyCommand: (command: string) => void;
}

// Physics constants
const SPRING_STIFFNESS = 0.08;
const DAMPING = 0.75;
const MAX_ROTATION = 35;
const REST_TILT_Z = -8;

export function useCardPhysics(
  onUpdate: (state: CardPhysicsState) => void
): CardPhysicsHandlers {
  const physicsRef = useRef({
    rotX: 0,
    rotY: 0,
    rotZ: REST_TILT_Z,
    posX: 0,
    posY: 0,
    velRotX: 0,
    velRotY: 0,
    velRotZ: 0,
    velPosX: 0,
    velPosY: 0,
    targetRotZ: REST_TILT_Z,
  });

  const rafRef = useRef<number>(0);
  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;

  const animate = useCallback(() => {
    const p = physicsRef.current;

    // Spring acceleration toward rest position
    const accRotX = (0 - p.rotX) * SPRING_STIFFNESS;
    const accRotY = (0 - p.rotY) * SPRING_STIFFNESS;
    const accRotZ = (p.targetRotZ - p.rotZ) * SPRING_STIFFNESS;
    const accPosX = (0 - p.posX) * SPRING_STIFFNESS;
    const accPosY = (0 - p.posY) * SPRING_STIFFNESS;

    // Apply damping + acceleration
    p.velRotX = p.velRotX * DAMPING + accRotX;
    p.velRotY = p.velRotY * DAMPING + accRotY;
    p.velRotZ = p.velRotZ * DAMPING + accRotZ;
    p.velPosX = p.velPosX * DAMPING + accPosX;
    p.velPosY = p.velPosY * DAMPING + accPosY;

    // Integrate velocity
    p.rotX += p.velRotX;
    p.rotY += p.velRotY;
    p.rotZ += p.velRotZ;
    p.posX += p.velPosX;
    p.posY += p.velPosY;

    // Clamp rotations
    p.rotX = Math.max(-MAX_ROTATION, Math.min(MAX_ROTATION, p.rotX));
    p.rotY = Math.max(-MAX_ROTATION * 6, Math.min(MAX_ROTATION * 6, p.rotY));

    onUpdateRef.current({
      rotX: p.rotX,
      rotY: p.rotY,
      rotZ: p.rotZ,
      posX: p.posX,
      posY: p.posY,
    });

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate]);

  const applyImpulse = useCallback(
    (rx: number, ry: number, rz: number = 0) => {
      physicsRef.current.velRotX += rx;
      physicsRef.current.velRotY += ry;
      physicsRef.current.velRotZ += rz;
    },
    []
  );

  const applyCommand = useCallback((command: string) => {
    const cmd = command.trim().toLowerCase();
    const p = physicsRef.current;

    switch (cmd) {
      case "whoami":
        p.velRotY += 4;
        p.velRotX += -2;
        break;
      case "info":
        p.velRotX += 3;
        p.velRotY += 1.5;
        break;
      case "card":
        p.velRotY += 10;
        p.velRotX += 5;
        p.velRotZ += 6;
        break;
      case "about":
        p.velRotY += 5;
        p.velRotX += -2.5;
        break;
      case "flip":
        p.velRotY += 25;
        break;
      case "links":
        p.velRotX += -3;
        p.velRotY += 2;
        break;
      case "skills":
        p.velRotZ += 4;
        p.velRotY += 3;
        break;
      case "contact":
        p.velRotX += 2;
        p.velRotY += -3;
        break;
      default:
        break;
    }
  }, []);

  return { applyImpulse, applyCommand };
}