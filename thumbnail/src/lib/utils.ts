import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Presets
export const presets = {
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
export const imageFilters = {
  none: { name: "None", filter: "" },
  grayscale: { name: "B&W", filter: "grayscale(100%)" },
  sepia: { name: "Sepia", filter: "sepia(100%)" },
  invert: { name: "Invert", filter: "invert(100%)" },
  contrast: { name: "High Contrast", filter: "contrast(150%)" },
  brightness: { name: "Bright", filter: "brightness(130%)" },
  blur: { name: "Soft Focus", filter: "blur(2px)" },
  saturate: { name: "Vibrant", filter: "saturate(200%)" },
};

// Gradient presets
export const gradientPresets = [
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

// Color swatches
export const colorSwatches = [
  "#ff0000", "#ff4000", "#ff8000", "#ffbf00", "#ffff00", "#bfff00",
  "#80ff00", "#40ff00", "#00ff00", "#00ff40", "#00ff80", "#00ffbf",
  "#00ffff", "#00bfff", "#0080ff", "#0040ff", "#0000ff", "#4000ff",
  "#8000ff", "#bf00ff", "#ff00ff", "#ff00bf", "#ff0080", "#ff0040",
  "#000000", "#404040", "#808080", "#bfbfbf", "#ffffff", "#ffcccc",
  "#ccffcc", "#ccccff", "#ffffcc", "#ffccff", "#ccffff", "#ffddcc"
];

// Gradient direction presets
export const directionPresets = [
  { name: "→", angle: 90, desc: "Left to Right" },
  { name: "←", angle: 270, desc: "Right to Left" },
  { name: "↓", angle: 180, desc: "Top to Bottom" },
  { name: "↑", angle: 0, desc: "Bottom to Top" },
  { name: "↘", angle: 135, desc: "Diagonal Down" },
  { name: "↙", angle: 225, desc: "Diagonal Left" },
  { name: "↖", angle: 315, desc: "Diagonal Up" },
  { name: "↗", angle: 45, desc: "Diagonal Right" },
];

// Font options
export const FONT_OPTIONS = [
  { label: "Arial", value: "arial", css: "Arial, sans-serif" },
  { label: "Inter", value: "inter", css: "var(--font-inter), Arial, sans-serif" },
  { label: "Domine", value: "domine", css: "var(--font-domine), Georgia, serif" },
  { label: "Roboto", value: "roboto", css: 'Roboto, Arial, sans-serif' },
  { label: "Lato", value: "lato", css: 'Lato, Arial, sans-serif' },
  { label: "Montserrat", value: "montserrat", css: 'Montserrat, Arial, sans-serif' },
  { label: "Oswald", value: "oswald", css: 'Oswald, Arial, sans-serif' },
  { label: "Playfair Display", value: "playfair", css: 'Playfair Display, Georgia, serif' },
];
