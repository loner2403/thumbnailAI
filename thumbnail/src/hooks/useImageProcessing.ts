import { useState, useRef } from "react";

export function useImageProcessing() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [processedImageSrc, setProcessedImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);
  const [canvasReady, setCanvasReady] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const fileReaderRef = useRef<FileReader | null>(null);
  const imageObjectsRef = useRef<HTMLImageElement[]>([]);

  // ... image processing logic to be filled in from thumbnail-creator.tsx ...

  return {
    imageSrc,
    setImageSrc,
    processedImageSrc,
    setProcessedImageSrc,
    loading,
    setLoading,
    error,
    setError,
    originalDimensions,
    setOriginalDimensions,
    canvasReady,
    setCanvasReady,
    abortControllerRef,
    fileReaderRef,
    imageObjectsRef,
  };
}

export default useImageProcessing; 