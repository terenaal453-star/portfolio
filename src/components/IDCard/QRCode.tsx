import React, { useEffect, useRef } from "react";

interface QRCodeProps {
  value: string;
  size?:  number;
}

function generateQRMatrix(text: string, size: number = 21): boolean[][] {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
  }
  hash = Math.abs(hash);

  const matrix: boolean[][] = Array(size)
    .fill(null)
    .map(() => Array(size).fill(false));

  const addFinder = (sr: number, sc: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const isEdge  = r === 0 || r === 6 || c === 0 || c === 6;
        const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        if (sr + r < size && sc + c < size)
          matrix[sr + r][sc + c] = isEdge || isInner;
      }
    }
  };

  addFinder(0, 0);
  addFinder(0, size - 7);
  addFinder(size - 7, 0);

  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  let seed = hash;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!matrix[r][c]) {
        const skip =
          (r < 9 && c < 9) ||
          (r < 9 && c >= size - 8) ||
          (r >= size - 8 && c < 9) ||
          r === 6 || c === 6;
        if (!skip) {
          seed = ((seed * 1664525 + 1013904223) >>> 0);
          matrix[r][c] = (seed & 3) !== 0;
        }
      }
    }
  }
  return matrix;
}

export const QRCodeDisplay: React.FC<QRCodeProps> = ({
  value,
  size = 56,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const matrixSize = 21;
    const cell       = size / matrixSize;
    const matrix     = generateQRMatrix(value, matrixSize);

    canvas.width  = size;
    canvas.height = size;

    ctx.fillStyle = "#f5f5f5";
    ctx.fillRect(0, 0, size, size);

    ctx.fillStyle = "#111111";
    matrix.forEach((row, r) => {
      row.forEach((cellVal, c) => {
        if (cellVal) {
          ctx.fillRect(
            c * cell, r * cell,
            Math.max(cell - 0.3, 1),
            Math.max(cell - 0.3, 1)
          );
        }
      });
    });
  }, [value, size]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width:          size,
        height:         size,
        imageRendering: "pixelated",
        display:        "block",
      }}
    />
  );
};