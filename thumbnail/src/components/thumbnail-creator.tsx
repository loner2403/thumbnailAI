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
  const [textOpacity, setTextOpacity] = useState(100); // Add text opacity state
  
  // Image filter states
  const [selectedFilter, setSelectedFilter] = useState("none");
  const [filterIntensity, setFilterIntensity] = useState(100);
  const [filterBrightness, setFilterBrightness] = useState(100);
  const [filterContrast, setFilterContrast] = useState(100);
  const [filterSaturation, setFilterSaturation] = useState(100);

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
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    if (fileReaderRef.current) {
      fileReaderRef.current.abort();
    }
    
    try {
      abortControllerRef.current = new AbortController();
      
      const reader = new FileReader();
      fileReaderRef.current = reader;
      
      reader.onload = async (e) => {
        try {
          const src = e.target?.result as string;
          
          if (abortControllerRef.current?.signal.aborted) {
            return;
          }
          
          setImageSrc(src);

          const blob = await removeBackground(src, {
            debug: false,
            proxyToWorker: true,
            model: 'isnet_fp16',
          });
          
          if (abortControllerRef.current?.signal.aborted) {
            return;
          }
          
          const processedUrl = URL.createObjectURL(blob);
          setProcessedImageSrc(processedUrl);
          setCanvasReady(true);
          
        } catch (error) {
          if (!abortControllerRef.current?.signal.aborted) {
            console.error("Error removing background:", error);
            setError("Failed to remove background. Please try again.");
          }
        } finally {
          if (!abortControllerRef.current?.signal.aborted) {
            setLoading(false);
          }
        }
      };
      
      reader.onerror = () => {
        if (!abortControllerRef.current?.signal.aborted) {
          setError("Failed to read the image file.");
          setLoading(false);
        }
      };
      
      reader.readAsDataURL(file);
      
      try {
        await generate();
      } catch (error) {
        console.error("Error in generate action:", error);
      }
      
    } catch (error) {
      console.error("Error processing image:", error);
      setError("Failed to process the image. Please try again.");
      setLoading(false);
    }
  };

  // Generate composite CSS filter string with proper intensity application
  const getCompositeFilter = useCallback(() => {
    const filter = imageFilters[selectedFilter as keyof typeof imageFilters];
    const intensity = filterIntensity / 100;
    
    let compositeFilter = "";
    
    // Apply base filter with intensity
    if (filter.filter && filter.filter !== "") {
      if (selectedFilter === "grayscale") {
        compositeFilter += `grayscale(${intensity * 100}%)`;
      } else if (selectedFilter === "sepia") {
        compositeFilter += `sepia(${intensity * 100}%)`;
      } else if (selectedFilter === "invert") {
        compositeFilter += `invert(${intensity * 100}%)`;
      } else if (selectedFilter === "blur") {
        compositeFilter += `blur(${intensity * 2}px)`;
      } else if (selectedFilter === "contrast") {
        const contrastValue = 100 + (50 * intensity);
        compositeFilter += `contrast(${contrastValue}%)`;
      } else if (selectedFilter === "brightness") {
        const brightnessValue = 100 + (30 * intensity);
        compositeFilter += `brightness(${brightnessValue}%)`;
      } else if (selectedFilter === "saturate") {
        const saturateValue = 100 + (100 * intensity);
        compositeFilter += `saturate(${saturateValue}%)`;
      }
    }
    
    // Add adjustment filters
    if (filterBrightness !== 100) {
      compositeFilter += compositeFilter ? ` brightness(${filterBrightness}%)` : `brightness(${filterBrightness}%)`;
    }
    
    if (filterContrast !== 100) {
      compositeFilter += compositeFilter ? ` contrast(${filterContrast}%)` : `contrast(${filterContrast}%)`;
    }
    
    if (filterSaturation !== 100) {
      compositeFilter += compositeFilter ? ` saturate(${filterSaturation}%)` : `saturate(${filterSaturation}%)`;
    }
    
    return compositeFilter;
  }, [selectedFilter, filterIntensity, filterBrightness, filterContrast, filterSaturation]);

  const drawCompositeImage = useCallback(() => {
    if (!canvasRef.current || !canvasReady || !imageSrc || !processedImageSrc || !fontsLoaded) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear any existing image objects
    imageObjectsRef.current.forEach(img => {
      img.onload = null;
      img.onerror = null;
    });
    imageObjectsRef.current = [];

    const bgImg = new window.Image();
    imageObjectsRef.current.push(bgImg);
    
    bgImg.onload = () => {
      try {
        canvas.width = bgImg.width;
        canvas.height = bgImg.height;

        // Apply image filters to background
        ctx.filter = getCompositeFilter();
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
        ctx.filter = "none"; // Reset filter for text and foreground

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

        // Calculate font size to fill image 90% of the canvas
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        let fontSize = 100;
        let selectFont = FONT_OPTIONS.find(f => f.value === font)?.css || 'Arial, sans-serif';
        
        ctx.font = `${preset.fontWeight} ${fontSize}px ${selectFont}`;
        const textWidth = ctx.measureText(text).width;
        const targetWidth = canvas.width * 0.9;

        if (textWidth > 0) {
          fontSize *= targetWidth / textWidth;
          ctx.font = `${preset.fontWeight} ${fontSize}px ${selectFont}`;
        }
        
        const x = canvas.width / 2;
        const y = canvas.height / 2;
        
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
          const y1 = Math.sin(angle) * fontSize / 2;
          
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
        
        // Reset shadow and alpha
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.globalAlpha = 1;
        
        ctx.restore();

        // Draw the foreground image (with no filter)
        const fgImg = new window.Image();
        imageObjectsRef.current.push(fgImg);
        
        fgImg.onload = () => {
          try {
            ctx.drawImage(fgImg, 0, 0, canvas.width, canvas.height);
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
    textOpacity, // Add textOpacity to dependencies
    getCompositeFilter,
    fontsLoaded
  ]);

  useEffect(() => {
    if (canvasReady && imageSrc && processedImageSrc && fontsLoaded) {
      drawCompositeImage();
    }
  }, [drawCompositeImage, canvasReady, imageSrc, processedImageSrc, fontsLoaded]);

  const handleDownload = () => {
    if (canvasRef.current) {
      try {
        const link = document.createElement("a");
        link.download = "thumbnail.png";
        link.href = canvasRef.current.toDataURL();
        link.click();
      } catch (error) {
        console.error("Error downloading image:", error);
        setError("Failed to download image.");
      }
    }
  };

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
            <LoadingScreen message="Removing background..." />
          ) : (
            <div className="flex w-full max-w-3xl flex-col items-center gap-6">
              {error && (
                <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg">
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
              
              <div className="relative w-full">
                <button
                  onClick={handleReset}
                  className="absolute -top-2 -left-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-muted/80 backdrop-blur-sm hover:bg-muted transition-colors shadow-sm"
                >
                  <IoMdArrowBack className="h-4 w-4 text-foreground" />
                </button>
                
                <div className="rounded-lg shadow-md overflow-hidden bg-checkerboard">
                  <canvas
                    ref={canvasRef}
                    className="h-auto w-full max-w-full"
                  ></canvas>
                </div>
              </div>
              
              <Card className="w-full border-none shadow-md bg-background/80 backdrop-blur-sm">
                <CardHeader className="pb-3 px-5">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-primary" />
                    Edit Thumbnail
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-5">
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
                    
                    {/* Basic Text Tab */}
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
        <div className="flex flex-col">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">Choose a Template</h2>
              <p className="text-muted-foreground">Select a style for your thumbnail design</p>
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
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
