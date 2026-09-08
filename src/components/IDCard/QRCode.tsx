import React, { useEffect, useRef } from "react";

interface QRCodeProps {
  value: string;
  size?: number;
  darkColor?: string;
  lightColor?: string;
}

function generateQRMatrix(text: string, size: number = 21): boolean[][] {
  // Deterministic hash from text
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
  }
  hash = Math.abs(hash);

  const matrix: boolean[][] = Array(size)
    .fill(null)
    .map(() => Array(size).fill(false));

  // Finder pattern helper
  const addFinder = (startRow: number, startCol: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const isOuterEdge = r === 0 || r === 6 || c === 0 || c === 6;
        const isInnerSquare = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        const row = startRow + r;
        const col = startCol + c;
        if (row < size && col < size) {
          matrix[row][col] = isOuterEdge || isInnerSquare;
        }
      }
    }
  };

  // Three finder patterns
  addFinder(0, 0);           // Top-left
  addFinder(0, size - 7);   // Top-right
  addFinder(size - 7, 0);   // Bottom-left

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Alignment pattern (center)
  const alignCenter = Math.floor(size / 2);
  for (let r = alignCenter - 2; r <= alignCenter + 2; r++) {
    for (let c = alignCenter - 2; c <= alignCenter + 2; c++) {
      if (r >= 0 && r < size && c >= 0 && c < size && !matrix[r][c]) {
        const isEdge = r === alignCenter - 2 || r === alignCenter + 2 ||
                       c === alignCenter - 2 || c === alignCenter + 2;
        const isCenter = r === alignCenter && c === alignCenter;
        matrix[r][c] = isEdge || isCenter;
      }
    }
  }

  // Data modules using seeded PRNG
  let seed = hash;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!matrix[r][c]) {
        const inSeparatorTL = r < 9 && c < 9;
        const inSeparatorTR = r < 9 && c >= size - 8;
        const inSeparatorBL = r >= size - 8 && c < 9;
        const inTiming = r === 6 || c === 6;

        if (!inSeparatorTL && !inSeparatorTR && !inSeparatorBL && !inTiming) {
          seed = ((seed * 1664525 + 1013904223) >>> 0);
          matrix[r][c] = (seed & 3) !== 0; // ~75% fill for visual density
        }
      }
    }
  }

  return matrix;
}

export const QRCodeDisplay: React.FC<QRCodeProps> = ({
  value,
  size = 60,
  darkColor = "#0a0a1a",
  lightColor = "#ffffff",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const matrixSize = 21;
    const cellSize = size / matrixSize;
    const matrix = generateQRMatrix(value, matrixSize);

    canvas.width = size;
    canvas.height = size;

    // Background
    ctx.fillStyle = lightColor;
    ctx.fillRect(0, 0, size, size);

    // Draw modules
    ctx.fillStyle = darkColor;
    matrix.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell) {
          ctx.fillRect(
            c * cellSize,
            r * cellSize,
            Math.max(cellSize - 0.3, 1),
            Math.max(cellSize - 0.3, 1)
          );
        }
      });
    });
  }, [value, size, darkColor, lightColor]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: size,
        height: size,
        imageRendering: "pixelated",
        display: "block",
      }}
    />
  );
};