"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Dropzone from "./dropzone";
import { refresh } from "~/app/actions/generate";
import LoadingScreen from "./LoadingScreen";
import { getPresignedUrl } from "~/app/actions/aws";
import Modal from "./Modal";
import useDebounce from "../hooks/useDebounce";
import { presets, imageFilters, FONT_OPTIONS } from "../lib/utils";
import StyleSelector from "./StyleSelector";
import EditorSidebar from "./EditorSidebar";
import useTextEffects from "../hooks/useTextEffects";
import useImageFilters from "../hooks/useImageFilters";

interface ThumbnailCreatorProps {
  children?: React.ReactNode;
}

interface WorkerMessage {
    success: boolean;
    blob?: Blob;
    error?: string;
}

const ThumbnailCreator: React.FC<ThumbnailCreatorProps> = ({ children }) => {
  const [selectedStyle, setSelectedStyle] = useState("style1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [processedImageSrc, setProcessedImageSrc] = useState<string | null>(null);
  const [canvasReady, setCanvasReady] = useState(false);
  const [text, setText] = useState("POV");
  const [font, setFont] = useState("arial");
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [textSize, setTextSize] = useState(100);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const imageObjectsRef = useRef<HTMLImageElement[]>([]);
  const fileReaderRef = useRef<FileReader | null>(null);

  const [textPosition, setTextPosition] = useState({ x: 0.5, y: 0.5 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });

  const { state: textEffects, dispatch: dispatchTextEffects } = useTextEffects();
  const { state: imageFiltersState, dispatch: dispatchImageFilters } = useImageFilters();

  useEffect(() => {
    const checkFonts = async () => {
      try {
        if ('fonts' in document) {
          await document.fonts.ready;
          setFontsLoaded(true);
        } else {
          setTimeout(() => setFontsLoaded(true), 1000);
        }
      } catch (error) {
        console.warn("Font loading check failed:", error);
        setFontsLoaded(true);
      }
    };
    checkFonts().catch(console.error);
  }, []);

  useEffect(() => {
    const abortController = abortControllerRef.current;
    const fileReader = fileReaderRef.current;
    return () => {
      if (abortController) {
        abortController.abort();
      }
      if (fileReader) {
        fileReader.abort();
      }
      if (processedImageSrc) {
        URL.revokeObjectURL(processedImageSrc);
      }
      imageObjectsRef.current.forEach(img => {
        img.onload = null;
        img.onerror = null;
        img.src = "";
      });
      imageObjectsRef.current = [];
    };
  }, [processedImageSrc]);

  const [modalOpen, setModalOpen] = useState(false);

  const setSelectedImage = async (file?: File) => {
    if (!file) return;
    setModalOpen(true);
    setLoading(true);
    setError(null);

    await new Promise(resolve => setTimeout(resolve, 0));

    const img = new Image();
    img.onload = () => {
      setOriginalDimensions({ width: img.width, height: img.height });
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);

    const src = URL.createObjectURL(file);
    setImageSrc(src);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    try {
      const worker = new Worker(new URL('./backgroundRemoval.worker.js', import.meta.url));
      worker.postMessage({ imageUrl: src });

      worker.onmessage = async (e: MessageEvent<WorkerMessage>) => {
        const { success, blob, error } = e.data;
        if (success && blob) {
          if (processedImageSrc) {
            URL.revokeObjectURL(processedImageSrc);
          }
          const processedUrl = URL.createObjectURL(blob);
          setProcessedImageSrc(processedUrl);
          setCanvasReady(true);
          setLoading(false);

          try {
            const res = await fetch("/api/deduct-credits", { method: "POST" });
            const data = await res.json() as { success: boolean, error?: string };
            if (!data.success) {
              setError(`Failed to deduct credits. ${data.error ?? "You may not have enough credits left."}`);
              return;
            }
          } catch {
            setError("Failed to deduct credits. Please try again.");
          }
        } else {
          setError(`Failed to remove background: ${error}`);
          setLoading(false);
        }
        worker.terminate();
      };
    } catch {
      setError("Failed to process the image. Please try again.");
      setLoading(false);
    }
  };
  
  const getCompositeFilter = useCallback(() => {
    const filter = imageFilters[imageFiltersState.selectedFilter as keyof typeof imageFilters];
    const intensity = imageFiltersState.filterIntensity / 100;
    
    let filterString = "";
    
    if (filter.filter) {
        switch(imageFiltersState.selectedFilter) {
            case "grayscale":
            case "sepia":
            case "invert":
                filterString += `${imageFiltersState.selectedFilter}(${intensity * 100}%)`;
                break;
            case "blur":
                filterString += `blur(${intensity * 2}px)`;
                break;
            case "contrast":
                filterString += `contrast(${100 + (50 * intensity)}%)`;
                break;
            case "brightness":
                filterString += `brightness(${100 + (30 * intensity)}%)`;
                break;
            case "saturate":
                filterString += `saturate(${100 + (100 * intensity)}%)`;
                break;
        }
    }
    
    if (imageFiltersState.filterBrightness !== 100) {
      filterString += ` brightness(${imageFiltersState.filterBrightness}%)`;
    }
    
    if (imageFiltersState.filterContrast !== 100) {
      filterString += ` contrast(${imageFiltersState.filterContrast}%)`;
    }
    
    if (imageFiltersState.filterSaturation !== 100) {
      filterString += ` saturate(${imageFiltersState.filterSaturation}%)`;
    }
    
    return filterString.trim();
  }, [imageFiltersState]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const textX = textPosition.x * rect.width;
    const textY = textPosition.y * rect.height;
    const distance = Math.sqrt(Math.pow(x * rect.width - textX, 2) + Math.pow(y * rect.height - textY, 2));
    if (distance < 50) {
      setIsDragging(true);
      dragStartPos.current = { x: x - textPosition.x, y: y - textPosition.y };
    }
  }, [textPosition]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
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

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) setIsDragging(false);
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [isDragging]);

  const drawCompositeImage = useCallback(() => {
    if (!canvasRef.current || !canvasReady || !imageSrc || !processedImageSrc || !fontsLoaded) return;

    requestAnimationFrame(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext("2d", { 
        alpha: true,
        desynchronized: true,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high'
      });
      
      if (!(ctx instanceof CanvasRenderingContext2D)) {
        console.error("Failed to get 2D rendering context");
        return;
      }

      imageObjectsRef.current.forEach(img => {
        img.onload = null;
        img.onerror = null;
      });
      imageObjectsRef.current = [];

      const bgImg = new window.Image();
      imageObjectsRef.current.push(bgImg);
      
      bgImg.onload = () => {
        try {
          const MAX_CANVAS_HEIGHT = 500;
          const MAX_CANVAS_WIDTH = 800;
          
          let drawWidth = bgImg.width;
          let drawHeight = bgImg.height;
          let scale = 1;
          
          const heightScale = bgImg.height > MAX_CANVAS_HEIGHT ? MAX_CANVAS_HEIGHT / bgImg.height : 1;
          const widthScale = bgImg.width > MAX_CANVAS_WIDTH ? MAX_CANVAS_WIDTH / bgImg.width : 1;
          
          scale = Math.min(heightScale, widthScale);
          
          if (scale < 1) {
            drawWidth = Math.round(bgImg.width * scale);
            drawHeight = Math.round(bgImg.height * scale);
          }
          
          const devicePixelRatio = window.devicePixelRatio ?? 1;
          const canvasWidth = drawWidth * devicePixelRatio;
          const canvasHeight = drawHeight * devicePixelRatio;
          
          if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            canvas.style.width = `${drawWidth}px`;
            canvas.style.height = `${drawHeight}px`;
          }

          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.scale(devicePixelRatio, devicePixelRatio);
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.clearRect(0, 0, drawWidth, drawHeight);

          const x = (drawWidth - bgImg.width * scale) / 2;
          const y = (drawHeight - bgImg.height * scale) / 2;

          ctx.filter = getCompositeFilter();
          ctx.drawImage(bgImg, x, y, bgImg.width * scale, bgImg.height * scale);
          ctx.filter = "none";

          let preset = presets.style1;
          if (selectedStyle === "style2") preset = presets.style2;
          else if (selectedStyle === "style3") preset = presets.style3;

          ctx.save();
          try {
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            const selectFont = FONT_OPTIONS.find(f => f.value === font)?.css ?? 'Arial, sans-serif';
            ctx.font = `${preset.fontWeight} ${textSize}px ${selectFont}`;
            
            const textMetrics = ctx.measureText(text);
            const textWidth = textMetrics.width;
            
            const textX = drawWidth * textPosition.x;
            const textY = drawHeight * textPosition.y;
            
            ctx.translate(textX, textY);

            if (textEffects.textShadow) {
              ctx.shadowColor = textEffects.shadowColor;
              ctx.shadowBlur = textEffects.shadowBlur;
              ctx.shadowOffsetX = 2;
              ctx.shadowOffsetY = 2;
            }

            if (textEffects.textOutline) {
              ctx.lineWidth = textEffects.outlineWidth;
              ctx.strokeStyle = textEffects.outlineColor;
              if (textEffects.useGradient) {
                ctx.globalAlpha = textEffects.textOpacity / 100;
              }
              ctx.strokeText(text, 0, 0);
              ctx.globalAlpha = 1;
            }

            if (textEffects.useGradient) {
              const angle = (textEffects.gradientDirection * Math.PI) / 180;
              const x1 = Math.cos(angle) * textWidth / 2;
              const y1 = Math.sin(angle) * textSize / 2;
              
              const gradient = ctx.createLinearGradient(-x1, -y1, x1, y1);
              gradient.addColorStop(0, textEffects.gradientColor1);
              gradient.addColorStop(1, textEffects.gradientColor2);
              ctx.fillStyle = gradient;
              ctx.globalAlpha = textEffects.textOpacity / 100;
            } else {
              ctx.fillStyle = preset.color;
              ctx.globalAlpha = preset.opacity;
            }

            ctx.fillText(text, 0, 0);

            ctx.shadowColor = "transparent";
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.globalAlpha = 1;
          } finally {
            ctx.restore();
          }

          const fgImg = new window.Image();
          imageObjectsRef.current.push(fgImg);
          fgImg.onload = () => {
            try {
              ctx.imageSmoothingEnabled = true;
              ctx.imageSmoothingQuality = 'high';
              ctx.drawImage(fgImg, x, y, bgImg.width * scale, bgImg.height * scale);
            } catch (error) {
              console.error("Error drawing foreground image:", error);
              setError("Failed to draw foreground image.");
            }
          };
          fgImg.onerror = () => setError("Failed to load processed image.");
          fgImg.src = processedImageSrc;
        } catch (error) {
          console.error("Error in background image drawing:", error);
          setError("Failed to draw background image.");
        }
      };
      bgImg.onerror = () => setError("Failed to load background image.");
      bgImg.src = imageSrc;
    });
  }, [canvasReady, text, font, selectedStyle, imageSrc, processedImageSrc, textEffects, getCompositeFilter, fontsLoaded, textPosition, textSize]);

  const debouncedDrawCompositeImage = useDebounce(drawCompositeImage, 100);

  useEffect(() => {
    if (canvasReady && imageSrc && processedImageSrc && fontsLoaded) {
      debouncedDrawCompositeImage();
    }
  }, [debouncedDrawCompositeImage, canvasReady, imageSrc, processedImageSrc, fontsLoaded, text, font, selectedStyle, textEffects]);

  useEffect(() => {
    if (canvasReady && imageSrc && processedImageSrc && fontsLoaded) {
      drawCompositeImage();
    }
  }, [canvasReady, imageSrc, processedImageSrc, fontsLoaded, textPosition, textSize, drawCompositeImage]);

  const handleDownload = useCallback(async () => {
    if (!canvasRef.current || !originalDimensions) return;
    try {
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return;
      
      tempCanvas.width = originalDimensions.width;
      tempCanvas.height = originalDimensions.height;
      tempCtx.drawImage(canvasRef.current, 0, 0, originalDimensions.width, originalDimensions.height);
      
      tempCanvas.toBlob((blob) => {
        if (blob) {
          void (async () => {  // Add 'void' here to ignore the promise
            try {
              const uploadUrl = await getPresignedUrl();
              await fetch(uploadUrl, {
                method: "PUT",
                body: blob,
                headers: { "Content-Type": "image/png" }
              });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.download = `thumbnail-${originalDimensions.width}x${originalDimensions.height}.png`;
              link.href = url;
              link.click();
              URL.revokeObjectURL(url);
            } catch (error) {
              console.error("Error uploading or downloading image:", error);
              setError("Failed to upload or download image.");
            }
          })();
        }
      }, 'image/png', 1.0);
    } catch (error) {
      console.error("Error downloading image:", error);
      setError("Failed to download image.");
    }
  }, [originalDimensions]);
  
  

  const handleReset = async () => {
    try {
      if (abortControllerRef.current) abortControllerRef.current.abort();
      if (fileReaderRef.current) fileReaderRef.current.abort();
      if (processedImageSrc) URL.revokeObjectURL(processedImageSrc);
      
      imageObjectsRef.current.forEach(img => {
        img.onload = null;
        img.onerror = null;
        img.src = "";
      });
      imageObjectsRef.current = [];
      
      setImageSrc(null);
      setProcessedImageSrc(null);
      setCanvasReady(false);
      setError(null);
      setModalOpen(false);
      
      await refresh();
    } catch (error) {
      console.error("Error resetting:", error);
    }
  };

  return (
    <>
      {!modalOpen && (
        <div className="flex flex-col mx-3">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">Choose a Template</h2>
              <p className="text-muted-foreground">Select a style for your thumbnail design</p>
            </div>
            <StyleSelector selectedStyle={selectedStyle} onSelect={setSelectedStyle} />
          </div>
          <div className="mt-10 space-y-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">Upload Your Image</h2>
              <p className="text-muted-foreground">Drag & drop or select an image to get started</p>
            </div>
            <Dropzone setSelectedImage={setSelectedImage} />
          </div>
          <div className="mt-8">{children}</div>
        </div>
      )}
      <Modal open={modalOpen} onClose={() => { void handleReset(); }}>
        {imageSrc ? (
          <>
            {loading ? (
              <LoadingScreen message="Processing image... This may take a moment." />
            ) : (
              <div className="flex w-full gap-6 p-6 flex-col md:flex-row min-h-0">
                <div className="w-full md:w-[70%] flex items-center justify-center mb-4 md:mb-0">
                  <div className="rounded-lg shadow-md overflow-hidden bg-checkerboard w-full">
                    <canvas
                      ref={canvasRef}
                      className={`h-auto w-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                    ></canvas>
                  </div>
                </div>
                <EditorSidebar
                  text={text}
                  setText={setText}
                  textSize={textSize}
                  setTextSize={setTextSize}
                  font={font}
                  setFont={setFont}
                  textShadow={textEffects.textShadow}
                  setTextShadow={(b) => dispatchTextEffects({ type: 'SET_SHADOW', value: b })}
                  shadowBlur={textEffects.shadowBlur}
                  setShadowBlur={(n) => dispatchTextEffects({ type: 'SET_SHADOW_BLUR', value: n })}
                  shadowColor={textEffects.shadowColor}
                  setShadowColor={(c) => dispatchTextEffects({ type: 'SET_SHADOW_COLOR', value: c })}
                  textOutline={textEffects.textOutline}
                  setTextOutline={(b) => dispatchTextEffects({ type: 'SET_OUTLINE', value: b })}
                  outlineWidth={textEffects.outlineWidth}
                  setOutlineWidth={(n) => dispatchTextEffects({ type: 'SET_OUTLINE_WIDTH', value: n })}
                  outlineColor={textEffects.outlineColor}
                  setOutlineColor={(c) => dispatchTextEffects({ type: 'SET_OUTLINE_COLOR', value: c })}
                  useGradient={textEffects.useGradient}
                  setUseGradient={(b) => dispatchTextEffects({ type: 'SET_GRADIENT', value: b })}
                  gradientColor1={textEffects.gradientColor1}
                  setGradientColor1={(c) => dispatchTextEffects({ type: 'SET_GRADIENT_COLOR1', value: c })}
                  gradientColor2={textEffects.gradientColor2}
                  setGradientColor2={(c) => dispatchTextEffects({ type: 'SET_GRADIENT_COLOR2', value: c })}
                  gradientDirection={textEffects.gradientDirection}
                  setGradientDirection={(n) => dispatchTextEffects({ type: 'SET_GRADIENT_DIRECTION', value: n })}
                  textOpacity={textEffects.textOpacity}
                  setTextOpacity={(n) => dispatchTextEffects({ type: 'SET_TEXT_OPACITY', value: n })}
                  selectedFilter={imageFiltersState.selectedFilter}
                  setSelectedFilter={(f) => dispatchImageFilters({ type: 'SET_FILTER', value: f })}
                  filterIntensity={imageFiltersState.filterIntensity}
                  setFilterIntensity={(n) => dispatchImageFilters({ type: 'SET_INTENSITY', value: n })}
                  filterBrightness={imageFiltersState.filterBrightness}
                  setFilterBrightness={(n) => dispatchImageFilters({ type: 'SET_BRIGHTNESS', value: n })}
                  filterContrast={imageFiltersState.filterContrast}
                  setFilterContrast={(n) => dispatchImageFilters({ type: 'SET_CONTRAST', value: n })}
                  filterSaturation={imageFiltersState.filterSaturation}
                  setFilterSaturation={(n) => dispatchImageFilters({ type: 'SET_SATURATION', value: n })}
                  onDownload={() => { void handleDownload(); }}
                  onUpdate={drawCompositeImage}
                  error={error}
                  onDismissError={() => setError(null)}
                />
              </div>
            )}
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default ThumbnailCreator;