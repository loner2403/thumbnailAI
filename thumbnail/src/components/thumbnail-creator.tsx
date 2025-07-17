"use client"

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
  const [image, setImage] = useState<File | null>(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [textSize, setTextSize] = useState(100); // Base text size in pixels
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);
  
  // Refs for cleanup
  const abortControllerRef = useRef<AbortController | null>(null);
  const imageObjectsRef = useRef<HTMLImageElement[]>([]);
  const fileReaderRef = useRef<FileReader | null>(null);

  // Text position and dragging states
  const [textPosition, setTextPosition] = useState({ x: 0.5, y: 0.5 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const { state: textEffects, dispatch: dispatchTextEffects } = useTextEffects();
  const { state: imageFiltersState, dispatch: dispatchImageFilters } = useImageFilters();

  // Check font loading status
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
    
    checkFonts();
  }, []);

  // Cleanup function for component unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      if (fileReaderRef.current) {
        fileReaderRef.current.abort();
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
  }, []);

  // Cleanup processed image URL when it changes
  useEffect(() => {
    return () => {
      if (processedImageSrc) {
        URL.revokeObjectURL(processedImageSrc);
      }
    };
  }, [processedImageSrc]);

  const [modalOpen, setModalOpen] = useState(false);

  // Add console logs for debugging state changes
  useEffect(() => {
    console.log("Modal open state changed:", modalOpen);
  }, [modalOpen]);
  useEffect(() => {
    console.log("Image src changed:", imageSrc);
  }, [imageSrc]);
  useEffect(() => {
    console.log("Processed image src changed:", processedImageSrc);
  }, [processedImageSrc]);
  useEffect(() => {
    console.log("Error state changed:", error);
  }, [error]);
  useEffect(() => {
    console.log("Text position changed:", textPosition);
  }, [textPosition]);
  useEffect(() => {
    console.log("Text size changed:", textSize);
  }, [textSize]);

  useEffect(() => {
    console.log("ThumbnailCreator mounted");
    return () => {
      console.log("ThumbnailCreator unmounted");
    };
  }, []);

  const setSelectedImage = async (file?: File) => {
    if (!file) return;
    console.log("Image selected:", file);
    setModalOpen(true);

    setLoading(true);
    setError(null);
    setImage(file);

    // Let the loader render before heavy work
    await new Promise(resolve => setTimeout(resolve, 0));

    // Store original dimensions
    const img = new Image();
    img.onload = () => {
      setOriginalDimensions({ width: img.width, height: img.height });
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);

    // Use object URL for instant, non-blocking preview
    const src = URL.createObjectURL(file);
    setImageSrc(src);

    // Cancel any existing operations
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Use a dedicated Web Worker for background removal
    try {
      // Dynamically import the worker (Vite/Next.js 13+ syntax)
      const worker = new Worker(new URL('./backgroundRemoval.worker.js', import.meta.url));
      worker.postMessage({ imageUrl: src });

      worker.onmessage = async (e) => {
        const { success, blob, error } = e.data;
        if (success) {
          if (processedImageSrc) {
            URL.revokeObjectURL(processedImageSrc);
          }
          const processedUrl = URL.createObjectURL(blob);
          setProcessedImageSrc(processedUrl);
          setCanvasReady(true);
          setLoading(false);

          // Deduct credits after image is generated
          try {
            const res = await fetch("/api/deduct-credits", { method: "POST" });
            const data = await res.json();
            if (!data.success) {
              setError("Failed to deduct credits. " + (data.error || "You may not have enough credits left."));
              // Optionally, you can disable further actions here
              return;
            }
          } catch (err) {
            setError("Failed to deduct credits. Please try again.");
            return;
          }
        } else {
          setError("Failed to remove background: " + error);
          setLoading(false);
        }
        worker.terminate();
      };
    } catch (error) {
      setError("Failed to process the image. Please try again.");
      setLoading(false);
    }
  };

  // Generate composite CSS filter string with proper intensity application
  const getCompositeFilter = useCallback(() => {
    const filter = imageFilters[imageFiltersState.selectedFilter as keyof typeof imageFilters];
    const intensity = imageFiltersState.filterIntensity / 100;
    
    let filterString = "";
    
    // Apply base filter with intensity
    if (filter.filter && filter.filter !== "") {
      if (imageFiltersState.selectedFilter === "grayscale") {
        filterString += `grayscale(${intensity * 100}%)`;
      } else if (imageFiltersState.selectedFilter === "sepia") {
        filterString += `sepia(${intensity * 100}%)`;
      } else if (imageFiltersState.selectedFilter === "invert") {
        filterString += `invert(${intensity * 100}%)`;
      } else if (imageFiltersState.selectedFilter === "blur") {
        filterString += `blur(${intensity * 2}px)`;
      } else if (imageFiltersState.selectedFilter === "contrast") {
        const contrastValue = 100 + (50 * intensity);
        filterString += `contrast(${contrastValue}%)`;
      } else if (imageFiltersState.selectedFilter === "brightness") {
        const brightnessValue = 100 + (30 * intensity);
        filterString += `brightness(${brightnessValue}%)`;
      } else if (imageFiltersState.selectedFilter === "saturate") {
        const saturateValue = 100 + (100 * intensity);
        filterString += `saturate(${saturateValue}%)`;
      }
    }
    
    // Add adjustment filters
    if (imageFiltersState.filterBrightness !== 100) {
      filterString += filterString ? ` brightness(${imageFiltersState.filterBrightness}%)` : `brightness(${imageFiltersState.filterBrightness}%)`;
    }
    
    if (imageFiltersState.filterContrast !== 100) {
      filterString += filterString ? ` contrast(${imageFiltersState.filterContrast}%)` : `contrast(${imageFiltersState.filterContrast}%)`;
    }
    
    if (imageFiltersState.filterSaturation !== 100) {
      filterString += filterString ? ` saturate(${imageFiltersState.filterSaturation}%)` : `saturate(${imageFiltersState.filterSaturation}%)`;
    }
    
    console.log('filterString:', filterString); // Log the filter string for debugging
    return filterString;
  }, [imageFiltersState]);
  
  // Mouse event handlers for dragging
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    // Check if click is near the text
    const textX = textPosition.x * rect.width;
    const textY = textPosition.y * rect.height;
    const distance = Math.sqrt(Math.pow(x * rect.width - textX, 2) + Math.pow(y * rect.height - textY, 2));
    
    if (distance < 50) { // 50px click radius
      setIsDragging(true);
      dragStartPos.current = {
        x: x - textPosition.x,
        y: y - textPosition.y
      };
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

  // Add event listeners for mouse up outside canvas
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging]);

  // Modify the drawCompositeImage function to use custom text size
  const drawCompositeImage = useCallback(() => {
    console.log('Starting drawCompositeImage at:', performance.now());
    if (!canvasRef.current || !canvasReady || !imageSrc || !processedImageSrc || !fontsLoaded) {
      console.log('Skipping draw - missing required elements');
      return;
    }

    // Use requestAnimationFrame for smooth rendering
    requestAnimationFrame(() => {
      console.log('requestAnimationFrame callback at:', performance.now());
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext("2d", { 
        alpha: true,
        desynchronized: true,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high'
      }) as CanvasRenderingContext2D;
      if (!ctx) return;

      // Clear any existing image objects
      imageObjectsRef.current.forEach(img => {
        img.onload = null;
        img.onerror = null;
      });
      imageObjectsRef.current = [];

      const bgImg = new window.Image();
      imageObjectsRef.current.push(bgImg);
      
      console.time('Background image load');
      bgImg.onload = () => {
        console.timeEnd('Background image load');
        console.time('Canvas drawing operations');
        try {
          // --- Improved scaling logic ---
          const MAX_CANVAS_HEIGHT = 500;
          const MAX_CANVAS_WIDTH = 800;
          
          let drawWidth = bgImg.width;
          let drawHeight = bgImg.height;
          let scale = 1;
          
          // Calculate scale based on both width and height constraints
          const heightScale = bgImg.height > MAX_CANVAS_HEIGHT ? MAX_CANVAS_HEIGHT / bgImg.height : 1;
          const widthScale = bgImg.width > MAX_CANVAS_WIDTH ? MAX_CANVAS_WIDTH / bgImg.width : 1;
          
          // Use the smaller scale to ensure image fits within both constraints
          scale = Math.min(heightScale, widthScale);
          
          if (scale < 1) {
            drawWidth = Math.round(bgImg.width * scale);
            drawHeight = Math.round(bgImg.height * scale);
          }
          
          // Get device pixel ratio for high-quality rendering
          const devicePixelRatio = window.devicePixelRatio || 1;
          
          // Set canvas internal dimensions (for high quality)
          const canvasWidth = drawWidth * devicePixelRatio;
          const canvasHeight = drawHeight * devicePixelRatio;
          
          if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            
            // IMPORTANT: Set the display size using CSS
            canvas.style.width = `${drawWidth}px`;
            canvas.style.height = `${drawHeight}px`;
          }

          // Reset any existing transformations
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          
          // Scale the context to match the device pixel ratio
          ctx.scale(devicePixelRatio, devicePixelRatio);

          // Enable high-quality image rendering
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Clear canvas
          ctx.clearRect(0, 0, drawWidth, drawHeight);

          // Calculate center position for the image
          const x = (drawWidth - bgImg.width * scale) / 2;
          const y = (drawHeight - bgImg.height * scale) / 2;

          // Apply image filters to background
          ctx.filter = getCompositeFilter();
          // Draw the image centered
          ctx.drawImage(bgImg, x, y, bgImg.width * scale, bgImg.height * scale);
          ctx.filter = "none";

          let preset = presets.style1;
          switch (selectedStyle) {
            case "style2":
              preset = presets.style2;
              break;
            case "style3":
              preset = presets.style3;
              break;
          }

          ctx.save();

          // Text rendering logic
          try {
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            let selectFont = FONT_OPTIONS.find(f => f.value === font)?.css || 'Arial, sans-serif';
            
            // Use custom text size directly
            ctx.font = `${preset.fontWeight} ${textSize}px ${selectFont}`;
            
            // Calculate text dimensions for gradient
            const textMetrics = ctx.measureText(text);
            const textWidth = textMetrics.width;
            
            // Use textPosition for x and y coordinates
            const x = drawWidth * textPosition.x;
            const y = drawHeight * textPosition.y;
            
            ctx.translate(x, y);

            // Apply text shadow if enabled
            if (textEffects.textShadow) {
              ctx.shadowColor = textEffects.shadowColor;
              ctx.shadowBlur = textEffects.shadowBlur;
              ctx.shadowOffsetX = 2;
              ctx.shadowOffsetY = 2;
            }

            // Draw text outline if enabled (apply opacity to outline as well)
            if (textEffects.textOutline) {
              ctx.lineWidth = textEffects.outlineWidth;
              ctx.strokeStyle = textEffects.outlineColor;
              // Apply opacity to outline when gradient is used
              if (textEffects.useGradient) {
                ctx.globalAlpha = textEffects.textOpacity / 100;
              }
              ctx.strokeText(text, 0, 0);
              // Reset alpha for fill
              ctx.globalAlpha = 1;
            }

            // Apply gradient fill if enabled
            if (textEffects.useGradient) {
              const angle = (textEffects.gradientDirection * Math.PI) / 180;
              const x1 = Math.cos(angle) * textWidth / 2;
              const y1 = Math.sin(angle) * textSize / 2; // Use textSize instead of fontSize
              
              const gradient = ctx.createLinearGradient(-x1, -y1, x1, y1);
              gradient.addColorStop(0, textEffects.gradientColor1);
              gradient.addColorStop(1, textEffects.gradientColor2);
              ctx.fillStyle = gradient;
              // Apply custom text opacity for gradient
              ctx.globalAlpha = textEffects.textOpacity / 100;
            } else {
              ctx.fillStyle = preset.color;
              ctx.globalAlpha = preset.opacity;
            }

            ctx.fillText(text, 0, 0);

            // Reset context state
            ctx.shadowColor = "transparent";
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.globalAlpha = 1;

          } finally {
            ctx.restore();
          }

          // Draw the foreground image centered as well
          const fgImg = new window.Image();
          imageObjectsRef.current.push(fgImg);

          fgImg.onload = () => {
            console.time('Foreground image draw');
            try {
              // Ensure high quality for foreground image too
              ctx.imageSmoothingEnabled = true;
              ctx.imageSmoothingQuality = 'high';
              ctx.drawImage(fgImg, x, y, bgImg.width * scale, bgImg.height * scale);
              console.timeEnd('Foreground image draw');
              console.timeEnd('Canvas drawing operations');
              console.log('Completed all drawing operations at:', performance.now());
            } catch (error) {
              console.error("Error drawing foreground image:", error);
              setError("Failed to draw foreground image.");
            }
          };

          fgImg.onerror = () => {
            console.error("Failed to load foreground image");
            setError("Failed to load processed image.");
          };

          fgImg.src = processedImageSrc;

        } catch (error) {
          console.error("Error in background image drawing:", error);
          setError("Failed to draw background image.");
        }
      };
      
      bgImg.onerror = () => {
        console.error("Failed to load background image");
        setError("Failed to load background image.");
      };

      bgImg.src = imageSrc;
    });
  }, [
    canvasReady, 
    text, 
    font, 
    selectedStyle, 
    imageSrc, 
    processedImageSrc, 
    textEffects,
    getCompositeFilter,
    fontsLoaded,
    textPosition,
    textSize,
  ]);

  // Debounced draw for general effect changes (100ms)
  const debouncedDrawCompositeImage = useDebounce(() => {
    console.log('Debounced drawCompositeImage triggered at:', performance.now());
    drawCompositeImage();
  }, 100);

  // Use debounced version for general text/effect changes
  useEffect(() => {
    if (canvasReady && imageSrc && processedImageSrc && fontsLoaded) {
      console.log('useEffect triggered draw at:', performance.now(), 
        { canvasReady, imageSrc: !!imageSrc, processedImageSrc: !!processedImageSrc, fontsLoaded });
      debouncedDrawCompositeImage();
    }
  }, [debouncedDrawCompositeImage, canvasReady, imageSrc, processedImageSrc, fontsLoaded]);

  // Direct draw for text dragging and text size changes (no debounce)
  useEffect(() => {
    if (canvasReady && imageSrc && processedImageSrc && fontsLoaded) {
      drawCompositeImage();
    }
  }, [canvasReady, imageSrc, processedImageSrc, fontsLoaded, textPosition, textSize]);

  // Optimize download function
  const handleDownload = useCallback(async () => {
    console.log("Download button clicked");
    if (!canvasRef.current || !originalDimensions) return;
    
    try {
      
      
      // Create a temporary canvas for high-resolution export
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d', {
        alpha: true,
        debsynchronized: true,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
      }) as CanvasRenderingContext2D;
      
      if (!tempCtx) return;
      
      // Set the canvas to original dimensions
      tempCanvas.width = originalDimensions.width;
      tempCanvas.height = originalDimensions.height;
       
      // Draw the current canvas content scaled to original dimensions
      tempCtx.drawImage(canvasRef.current, 0, 0, originalDimensions.width, originalDimensions.height);
      
      // Convert to blob, upload to S3, and download locally
      tempCanvas.toBlob(async (blob) => {
        if(blob) {
          try {
            // TODO: Replace with API call to get presigned URL
            const uploadUrl = await getPresignedUrl();
            await fetch(uploadUrl, {
              method: "PUT",
              body: blob,
              headers: {
                "Content-Type": "image/png",
              }
            });
            console.log("File uploaded successfully!");

            // Download the image locally
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
        }
      }, 'image/png', 1.0);
    } catch (error) {
      console.error("Error downloading image:", error);
      setError("Failed to download image.");
    }
  }, [originalDimensions]);

  const handleReset = async () => {
    console.log("Reset button clicked");
    try {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      if (fileReaderRef.current) {
        fileReaderRef.current.abort();
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
      
      setImageSrc(null);
      setProcessedImageSrc(null);
      setCanvasReady(false);
      setImage(null);
      setError(null);
      setModalOpen(false);
      
      await refresh();
    } catch (error) {
      console.error("Error resetting:", error);
    }
  };

  return (
    <>
      {/* Main page: only style selection and upload */}
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
      {/* Modal for processing, editing, and download */}
      <Modal open={modalOpen} onClose={handleReset}>
        {imageSrc ? (
          <>
            {loading ? (
              <LoadingScreen message="Processing image... This may take a moment." />
            ) : (
              <div className="flex w-full h-full gap-6 p-6 overflow-auto flex-col md:flex-row">
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
                  // Text tab
                  text={text}
                  setText={setText}
                  textSize={textSize}
                  setTextSize={setTextSize}
                  font={font}
                  setFont={setFont}
                  // Effects tab
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
                  // Filters tab
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
                  // Actions
                  onDownload={handleDownload}
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