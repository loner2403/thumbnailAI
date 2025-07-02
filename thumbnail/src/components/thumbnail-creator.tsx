"use client"

import { useEffect, useRef, useState, useCallback } from "react";
import Dropzone from "./dropzone";
import Style from "./style";
import { removeBackground } from "@imgly/background-removal";
import { Button } from "./ui/button";
import { IoMdArrowBack } from "react-icons/io";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { inter, domine } from "../app/fonts";
import { generate, refresh } from "~/app/actions/generate";
import { Type, Image as LucideImage, Sliders } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Slider } from "~/components/ui/slider";
import LoadingScreen from "./LoadingScreen";
import { blob } from "stream/consumers";
import { getPresignedUrl } from "~/app/actions/aws";

// Type for canvas context
type CanvasContextType = CanvasRenderingContext2D;

const presets = {
  style1: {
    fontSize: 100,
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 1)",
    opacity: 1,
  },
  style2: {
    fontSize: 100,
    fontWeight: "bold",
    color: "rgba(0, 0, 0, 1)",
    opacity: 1,
  },
  style3: {
    fontSize: 100,
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 0.8)",
    opacity: 0.8,
  },
};

// Image filter presets
const imageFilters = {
  none: { name: "None", filter: "" },
  grayscale: { name: "B&W", filter: "grayscale(100%)" },
  sepia: { name: "Sepia", filter: "sepia(100%)" },
  invert: { name: "Invert", filter: "invert(100%)" },
  contrast: { name: "High Contrast", filter: "contrast(150%)" },
  brightness: { name: "Bright", filter: "brightness(130%)" },
  blur: { name: "Soft Focus", filter: "blur(2px)" },
  saturate: { name: "Vibrant", filter: "saturate(200%)" },
};

// Gradient presets for easy selection
const gradientPresets = [
  { name: "Sunset", colors: ["#ff7e5f", "#feb47b"] },
  { name: "Ocean", colors: ["#2196f3", "#21cbf3"] },
  { name: "Purple", colors: ["#667eea", "#764ba2"] },
  { name: "Green", colors: ["#11998e", "#38ef7d"] },
  { name: "Pink", colors: ["#ff9a9e", "#fecfef"] },
  { name: "Gold", colors: ["#ffecd2", "#fcb69f"] },
  { name: "Fire", colors: ["#ff416c", "#ff4b2b"] },
  { name: "Sky", colors: ["#a8edea", "#fed6e3"] },
  { name: "Night", colors: ["#0c0c0c", "#654ea3"] },
  { name: "Autumn", colors: ["#f79d00", "#64f38c"] },
  { name: "Cool", colors: ["#2196f3", "#9c27b0"] },
  { name: "Warm", colors: ["#ff5722", "#ffc107"] },
];

// Color swatches for quick selection
const colorSwatches = [
  "#ff0000", "#ff4000", "#ff8000", "#ffbf00", "#ffff00", "#bfff00",
  "#80ff00", "#40ff00", "#00ff00", "#00ff40", "#00ff80", "#00ffbf",
  "#00ffff", "#00bfff", "#0080ff", "#0040ff", "#0000ff", "#4000ff",
  "#8000ff", "#bf00ff", "#ff00ff", "#ff00bf", "#ff0080", "#ff0040",
  "#000000", "#404040", "#808080", "#bfbfbf", "#ffffff", "#ffcccc",
  "#ccffcc", "#ccccff", "#ffffcc", "#ffccff", "#ccffff", "#ffddcc"
];

// Gradient direction presets
const directionPresets = [
  { name: "→", angle: 90, desc: "Left to Right" },
  { name: "←", angle: 270, desc: "Right to Left" },
  { name: "↓", angle: 180, desc: "Top to Bottom" },
  { name: "↑", angle: 0, desc: "Bottom to Top" },
  { name: "↘", angle: 135, desc: "Diagonal Down" },
  { name: "↙", angle: 225, desc: "Diagonal Left" },
  { name: "↖", angle: 315, desc: "Diagonal Up" },
  { name: "↗", angle: 45, desc: "Diagonal Right" },
];

const FONT_OPTIONS = [
  { label: "Arial", value: "arial", css: "Arial, sans-serif" },
  { label: "Inter", value: "inter", css: `${inter.style.fontFamily}, Arial, sans-serif` },
  { label: "Domine", value: "domine", css: `${domine.style.fontFamily}, Georgia, serif` },
  { label: "Roboto", value: "roboto", css: 'Roboto, Arial, sans-serif' },
  { label: "Lato", value: "lato", css: 'Lato, Arial, sans-serif' },
  { label: "Montserrat", value: "montserrat", css: 'Montserrat, Arial, sans-serif' },
  { label: "Oswald", value: "oswald", css: 'Oswald, Arial, sans-serif' },
  { label: "Playfair Display", value: "playfair", css: 'Playfair Display, Georgia, serif' },
];

interface ThumbnailCreatorProps {
  children?: React.ReactNode;
}

// Debounce utility
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

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

  // Advanced text effects states
  const [textShadow, setTextShadow] = useState(false);
  const [shadowBlur, setShadowBlur] = useState(5);
  const [shadowColor, setShadowColor] = useState("rgba(0, 0, 0, 0.7)");
  const [textOutline, setTextOutline] = useState(false);
  const [outlineWidth, setOutlineWidth] = useState(2);
  const [outlineColor, setOutlineColor] = useState("#000000");
  const [useGradient, setUseGradient] = useState(false);
  const [gradientColor1, setGradientColor1] = useState("#ff0000");
  const [gradientColor2, setGradientColor2] = useState("#0000ff");
  const [gradientDirection, setGradientDirection] = useState(90);
  const [textOpacity, setTextOpacity] = useState(100);
  
  // Image filter states
  const [selectedFilter, setSelectedFilter] = useState("none");
  const [filterIntensity, setFilterIntensity] = useState(100);
  const [filterBrightness, setFilterBrightness] = useState(100);
  const [filterContrast, setFilterContrast] = useState(100);
  const [filterSaturation, setFilterSaturation] = useState(100);

  // Text position and dragging states
  const [textPosition, setTextPosition] = useState({ x: 0.5, y: 0.5 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const canvasContainerRef = useRef<HTMLDivElement>(null);

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

  const setSelectedImage = async (file?: File) => {
    if (!file) return;

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

      worker.onmessage = (e) => {
        const { success, blob, error } = e.data;
        if (success) {
          if (processedImageSrc) {
            URL.revokeObjectURL(processedImageSrc);
          }
          const processedUrl = URL.createObjectURL(blob);
          setProcessedImageSrc(processedUrl);
          setCanvasReady(true);
          setLoading(false);
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
    const filter = imageFilters[selectedFilter as keyof typeof imageFilters];
    const intensity = filterIntensity / 100;
    
    let filterString = "";
    
    // Apply base filter with intensity
    if (filter.filter && filter.filter !== "") {
      if (selectedFilter === "grayscale") {
        filterString += `grayscale(${intensity * 100}%)`;
      } else if (selectedFilter === "sepia") {
        filterString += `sepia(${intensity * 100}%)`;
      } else if (selectedFilter === "invert") {
        filterString += `invert(${intensity * 100}%)`;
      } else if (selectedFilter === "blur") {
        filterString += `blur(${intensity * 2}px)`;
      } else if (selectedFilter === "contrast") {
        const contrastValue = 100 + (50 * intensity);
        filterString += `contrast(${contrastValue}%)`;
      } else if (selectedFilter === "brightness") {
        const brightnessValue = 100 + (30 * intensity);
        filterString += `brightness(${brightnessValue}%)`;
      } else if (selectedFilter === "saturate") {
        const saturateValue = 100 + (100 * intensity);
        filterString += `saturate(${saturateValue}%)`;
      }
    }
    
    // Add adjustment filters
    if (filterBrightness !== 100) {
      filterString += filterString ? ` brightness(${filterBrightness}%)` : `brightness(${filterBrightness}%)`;
    }
    
    if (filterContrast !== 100) {
      filterString += filterString ? ` contrast(${filterContrast}%)` : `contrast(${filterContrast}%)`;
    }
    
    if (filterSaturation !== 100) {
      filterString += filterString ? ` saturate(${filterSaturation}%)` : `saturate(${filterSaturation}%)`;
    }
    
    return filterString;
  }, [selectedFilter, filterIntensity, filterBrightness, filterContrast, filterSaturation]);
  
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
            if (textShadow) {
              ctx.shadowColor = shadowColor;
              ctx.shadowBlur = shadowBlur;
              ctx.shadowOffsetX = 2;
              ctx.shadowOffsetY = 2;
            }

            // Draw text outline if enabled (apply opacity to outline as well)
            if (textOutline) {
              ctx.lineWidth = outlineWidth;
              ctx.strokeStyle = outlineColor;
              // Apply opacity to outline when gradient is used
              if (useGradient) {
                ctx.globalAlpha = textOpacity / 100;
              }
              ctx.strokeText(text, 0, 0);
              // Reset alpha for fill
              ctx.globalAlpha = 1;
            }

            // Apply gradient fill if enabled
            if (useGradient) {
              const angle = (gradientDirection * Math.PI) / 180;
              const x1 = Math.cos(angle) * textWidth / 2;
              const y1 = Math.sin(angle) * textSize / 2; // Use textSize instead of fontSize
              
              const gradient = ctx.createLinearGradient(-x1, -y1, x1, y1);
              gradient.addColorStop(0, gradientColor1);
              gradient.addColorStop(1, gradientColor2);
              ctx.fillStyle = gradient;
              // Apply custom text opacity for gradient
              ctx.globalAlpha = textOpacity / 100;
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
    textShadow, 
    shadowBlur, 
    shadowColor, 
    textOutline, 
    outlineWidth, 
    outlineColor, 
    useGradient,
    gradientColor1,
    gradientColor2,
    gradientDirection,
    textOpacity,
    getCompositeFilter,
    fontsLoaded,
    textPosition,
    textSize,
  ]);

  // Optimize canvas drawing with debouncing
  const debouncedDrawCompositeImage = useCallback(
    debounce(() => {
      console.log('Debounced drawCompositeImage triggered at:', performance.now());
      drawCompositeImage();
    }, 100),
    [drawCompositeImage]
  );

  // Use debounced version for text/effect changes
  useEffect(() => {
    if (canvasReady && imageSrc && processedImageSrc && fontsLoaded) {
      console.log('useEffect triggered draw at:', performance.now(), 
        { canvasReady, imageSrc: !!imageSrc, processedImageSrc: !!processedImageSrc, fontsLoaded });
      debouncedDrawCompositeImage();
    }
  }, [debouncedDrawCompositeImage, canvasReady, imageSrc, processedImageSrc, fontsLoaded]);

  // Optimize download function
  const handleDownload = useCallback(() => {
    if (!canvasRef.current || !originalDimensions) return;
    
    try {
      // Create a temporary canvas for high-resolution export
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d', {
        alpha: true,
        desynchronized: true,
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
      
      await refresh();
    } catch (error) {
      console.error("Error resetting:", error);
    }
  };

  // Color Swatch Picker Component
  const ColorSwatchPicker = ({ value, onChange, label }: { value: string; onChange: (color: string) => void; label: string }) => (
    <div className="space-y-2">
      <Label className="text-sm">{label}</Label>
      <div className="flex items-center gap-2 mb-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-12 rounded border border-gray-300 cursor-pointer"
        />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 text-xs flex-1"
          placeholder="#000000"
        />
      </div>
      <div className="grid grid-cols-6 gap-1">
        {colorSwatches.map((color, index) => (
          <button
            key={index}
            className="h-6 w-6 rounded border border-gray-200 hover:border-gray-400 transition-colors"
            style={{ backgroundColor: color }}
            onClick={() => onChange(color)}
            title={color}
          />
        ))}
      </div>
    </div>
  );

  return (
    <>
      {imageSrc ? (
        <>
          {loading ? (
            <LoadingScreen message="Processing image... This may take a moment." />
          ) : (
            <div className="flex w-full mx-4 gap-6">
              <div className="w-[70%]">
                {error && (
                  <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                    <p className="text-red-800 text-sm">{error}</p>
                    <Button 
                      onClick={() => setError(null)} 
                      className="mt-2 text-xs"
                      variant="outline"
                      size="sm"
                    >
                      Dismiss
                    </Button>
                  </div>
                )}
                
                <div className="relative w-full" ref={canvasContainerRef}>
                  <button
                    onClick={handleReset}
                    className="absolute -top-2 -left-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-muted/80 backdrop-blur-sm hover:bg-muted transition-colors shadow-sm"
                  >
                    <IoMdArrowBack className="h-4 w-4 text-foreground" />
                  </button>
                  
                  <div className="rounded-lg shadow-md overflow-hidden bg-checkerboard">
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
              </div>
              
              <Card className="w-[25%] max-h-[65vh] border-none shadow-md bg-background/80 backdrop-blur-sm flex flex-col">
                <CardHeader className="pb-3 px-5">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-primary" />
                    Edit Thumbnail
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-5 flex-1 overflow-y-auto">
                  <Tabs defaultValue="text" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-4">
                      <TabsTrigger value="text" className="flex items-center gap-1.5 text-xs">
                        <Type className="h-3.5 w-3.5" />
                        <span>Text</span>
                      </TabsTrigger>
                      <TabsTrigger value="effects" className="flex items-center gap-1.5 text-xs">
                        <Type className="h-3.5 w-3.5" />
                        <span>Text Effects</span>
                      </TabsTrigger>
                      <TabsTrigger value="filters" className="flex items-center gap-1.5 text-xs">
                        <LucideImage className="h-3.5 w-3.5" />
                        <span>Image Filters</span>
                      </TabsTrigger>
                    </TabsList>
                    
                    {/* Text Tab */}
                    <TabsContent value="text" className="space-y-5">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="text" className="text-sm font-medium">Caption Text</Label>
                        <Input
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          id="text"
                          placeholder="Enter text for your thumbnail"
                          className="h-10"
                        />
                      </div>

                      {/* Add Text Size Control */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="text-size" className="text-sm">Text Size</Label>
                          <span className="text-xs text-muted-foreground">{textSize}px</span>
                        </div>
                        <Slider 
                          id="text-size"
                          min={20} 
                          max={400} 
                          step={1}
                          value={[textSize]}
                          onValueChange={(value: number[]) => {
                            if (value[0] !== undefined) {
                              setTextSize(value[0]);
                            }
                          }}
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label htmlFor="font" className="text-sm font-medium">Font Family</Label>
                        <Select
                          value={font}
                          onValueChange={(value) => setFont(value)}
                        >
                          <SelectTrigger id="font" className="h-10 w-full">
                            <SelectValue placeholder="Select a font" />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            {FONT_OPTIONS.map(opt => (
                              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </TabsContent>
                    
                    {/* Text Effects Tab */}
                    <TabsContent value="effects" className="space-y-4 mt-4">
                      {/* Text Shadow Controls */}
                      <div className="rounded-lg border p-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="shadow-toggle" className="font-medium">Text Shadow</Label>
                          <input 
                            type="checkbox" 
                            id="shadow-toggle"
                            checked={textShadow}
                            onChange={(e) => setTextShadow(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                        </div>
                        
                        {textShadow && (
                          <div className="mt-3 space-y-3">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label htmlFor="shadow-blur" className="text-sm">Blur</Label>
                                <span className="text-xs text-muted-foreground">{shadowBlur}px</span>
                              </div>
                              <Slider 
                                id="shadow-blur"
                                min={0} 
                                max={20} 
                                step={1}
                                value={[shadowBlur]}
                                onValueChange={(value: number[]) => {
                                  if (value[0] !== undefined) {
                                    setShadowBlur(value[0]);
                                  }
                                }}
                              />
                            </div>
                            
                            <ColorSwatchPicker
                              value={shadowColor}
                              onChange={setShadowColor}
                              label="Shadow Color"
                            />
                          </div>
                        )}
                      </div>
                      
                      {/* Text Outline Controls */}
                      <div className="rounded-lg border p-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="outline-toggle" className="font-medium">Text Outline</Label>
                          <input 
                            type="checkbox" 
                            id="outline-toggle"
                            checked={textOutline}
                            onChange={(e) => setTextOutline(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                        </div>
                        
                        {textOutline && (
                          <div className="mt-3 space-y-3">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label htmlFor="outline-width" className="text-sm">Width</Label>
                                <span className="text-xs text-muted-foreground">{outlineWidth}px</span>
                              </div>
                              <Slider 
                                id="outline-width"
                                min={1} 
                                max={10} 
                                step={1}
                                value={[outlineWidth]}
                                onValueChange={(value: number[]) => {
                                  if (value[0] !== undefined) {
                                    setOutlineWidth(value[0]);
                                  }
                                }}
                              />
                            </div>
                            
                            <ColorSwatchPicker
                              value={outlineColor}
                              onChange={setOutlineColor}
                              label="Outline Color"
                            />
                          </div>
                        )}
                      </div>
                      
                      {/* Enhanced Text Gradient Controls with Opacity */}
                      <div className="rounded-lg border p-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="gradient-toggle" className="font-medium">Gradient Fill</Label>
                          <input 
                            type="checkbox" 
                            id="gradient-toggle"
                            checked={useGradient}
                            onChange={(e) => setUseGradient(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                        </div>
                        
                        {useGradient && (
                          <div className="mt-3 space-y-4">
                            {/* Gradient Presets */}
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Quick Presets</Label>
                              <div className="grid grid-cols-4 gap-2">
                                {gradientPresets.map((preset, index) => (
                                  <button
                                    key={index}
                                    className="h-8 rounded border border-gray-200 hover:border-gray-400 transition-colors relative overflow-hidden"
                                    style={{
                                      background: `linear-gradient(90deg, ${preset.colors[0]}, ${preset.colors[1]})`
                                    }}
                                    onClick={() => {
                                      setGradientColor1(preset.colors[0] ?? "#000000");
                                      setGradientColor2(preset.colors[1] ?? "#ffffff");
                                    }}
                                    title={preset.name}
                                  >
                                    <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white mix-blend-difference">
                                      {preset.name}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            </div>
                            
                            {/* Gradient Direction */}
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Gradient Direction</Label>
                              <div className="grid grid-cols-4 gap-1">
                                {directionPresets.map((preset, index) => (
                                  <button
                                    key={index}
                                    className={`h-8 text-lg border rounded transition-colors ${
                                      gradientDirection === preset.angle 
                                        ? 'border-primary bg-primary/10 text-primary' 
                                        : 'border-gray-200 hover:border-gray-400'
                                    }`}
                                    onClick={() => setGradientDirection(preset.angle)}
                                    title={preset.desc}
                                  >
                                    {preset.name}
                                  </button>
                                ))}
                              </div>
                            </div>
                            
                            {/* Color Pickers */}
                            <div className="grid grid-cols-2 gap-3">
                              <ColorSwatchPicker
                                value={gradientColor1}
                                onChange={setGradientColor1}
                                label="Color 1"
                              />
                              <ColorSwatchPicker
                                value={gradientColor2}
                                onChange={setGradientColor2}
                                label="Color 2"
                              />
                            </div>
                            
                            {/* Text Opacity Control */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label htmlFor="text-opacity" className="text-sm font-medium">Text Opacity</Label>
                                <span className="text-xs text-muted-foreground">{textOpacity}%</span>
                              </div>
                              <Slider 
                                id="text-opacity"
                                min={0} 
                                max={100} 
                                step={1}
                                value={[textOpacity]}
                                onValueChange={(value: number[]) => {
                                  if (value[0] !== undefined) {
                                    setTextOpacity(value[0]);
                                  }
                                }}
                              />
                            </div>
                            
                            {/* Live Preview with Opacity */}
                            <div className="space-y-2">
                              <Label className="text-sm">Preview</Label>
                              <div className="h-8 w-full rounded-md border border-gray-200 relative overflow-hidden bg-gray-100">
                                <div
                                  className="absolute inset-0"
                                  style={{ 
                                    background: `linear-gradient(${gradientDirection}deg, ${gradientColor1}, ${gradientColor2})`,
                                    opacity: textOpacity / 100
                                  }} 
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    
                    {/* Image Filters Tab */}
                    <TabsContent value="filters" className="space-y-4 mt-4">
                      <div className="space-y-3">
                        <Label htmlFor="filter-preset" className="font-medium">Filter Preset</Label>
                        <div className="grid grid-cols-4 gap-2">
                          {Object.entries(imageFilters).map(([key, filter]) => (
                            <button
                              key={key}
                              className={`p-1 rounded-md text-xs border transition-colors ${
                                selectedFilter === key 
                                  ? 'border-primary ring-1 ring-primary bg-primary/5' 
                                  : 'border-border hover:border-gray-400'
                              }`}
                              onClick={() => setSelectedFilter(key)}
                            >
                              {filter.name}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="brightness" className="text-sm">Brightness</Label>
                          <span className="text-xs text-muted-foreground">{filterBrightness}%</span>
                        </div>
                        <Slider 
                          id="brightness"
                          min={50} 
                          max={150} 
                          step={1}
                          value={[filterBrightness]}
                          onValueChange={(value: number[]) => {
                            if (value[0] !== undefined) {
                              setFilterBrightness(value[0]);
                            }
                          }}
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="contrast" className="text-sm">Contrast</Label>
                          <span className="text-xs text-muted-foreground">{filterContrast}%</span>
                        </div>
                        <Slider 
                          id="contrast"
                          min={50} 
                          max={150} 
                          step={1}
                          value={[filterContrast]}
                          onValueChange={(value: number[]) => {
                            if (value[0] !== undefined) {
                              setFilterContrast(value[0]);
                            }
                          }}
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="saturation" className="text-sm">Saturation</Label>
                          <span className="text-xs text-muted-foreground">{filterSaturation}%</span>
                        </div>
                        <Slider 
                          id="saturation"
                          min={0} 
                          max={200} 
                          step={1}
                          value={[filterSaturation]}
                          onValueChange={(value: number[]) => {
                            if (value[0] !== undefined) {
                              setFilterSaturation(value[0]);
                            }
                          }}
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="intensity" className="text-sm">Effect Intensity</Label>
                          <span className="text-xs text-muted-foreground">{filterIntensity}%</span>
                        </div>
                        <Slider 
                          id="intensity"
                          min={0} 
                          max={100} 
                          step={1}
                          value={[filterIntensity]}
                          onValueChange={(value: number[]) => {
                            if (value[0] !== undefined) {
                              setFilterIntensity(value[0]);
                            }
                          }}
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="flex flex-wrap justify-between gap-2 px-5 pt-2 pb-5">
                  <Button 
                    onClick={handleDownload} 
                    className="gap-1.5 bg-primary/90 hover:bg-primary"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Download
                  </Button>
                  <Button 
                    onClick={drawCompositeImage} 
                    className="gap-1.5 bg-muted/80 hover:bg-muted text-foreground"
                  >
                    <Sliders className="h-4 w-4" />
                    Update
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col mx-3">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">Choose a Template</h2>
              <p className="text-muted-foreground">Select a style for your thumbnail design</p>
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
              <Style
                image="/style1.png"
                selectStyle={() => setSelectedStyle("style1")}
                isSelected={selectedStyle === "style1"}
              />
              <Style
                image="/style2.png"
                selectStyle={() => setSelectedStyle("style2")}
                isSelected={selectedStyle === "style2"}
              />
              <Style
                image="/style3.png"
                selectStyle={() => setSelectedStyle("style3")}
                isSelected={selectedStyle === "style3"}
              />
            </div>
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
    </>
  );
};

export default ThumbnailCreator;