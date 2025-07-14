import { useState, useRef, useCallback } from "react";

export function useDrag(initialPosition = { x: 0.5, y: 0.5 }) {
  const [textPosition, setTextPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>, canvasRef: React.RefObject<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const textX = textPosition.x * rect.width;
    const textY = textPosition.y * rect.height;
    const distance = Math.sqrt(Math.pow(x * rect.width - textX, 2) + Math.pow(y * rect.height - textY, 2));
    if (distance < 50) {
      setIsDragging(true);
      dragStartPos.current = {
        x: x - textPosition.x,
        y: y - textPosition.y
      };
    }
  }, [textPosition]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>, canvasRef: React.RefObject<HTMLCanvasElement>) => {
    if (!isDragging || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTextPosition({
      x: Math.max(0, Math.min(1, x - dragStartPos.current.x)),
      y: Math.max(0, Math.min(1, y - dragStartPos.current.y))
    });
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return {
    textPosition,
    setTextPosition,
    isDragging,
    setIsDragging,
    dragStartPos,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
}

export default useDrag; 