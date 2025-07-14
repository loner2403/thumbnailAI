import React from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

const colorSwatches = [
  "#ff0000", "#ff4000", "#ff8000", "#ffbf00", "#ffff00", "#bfff00",
  "#80ff00", "#40ff00", "#00ff00", "#00ff40", "#00ff80", "#00ffbf",
  "#00ffff", "#00bfff", "#0080ff", "#0040ff", "#0000ff", "#4000ff",
  "#8000ff", "#bf00ff", "#ff00ff", "#ff00bf", "#ff0080", "#ff0040",
  "#000000", "#404040", "#808080", "#bfbfbf", "#ffffff", "#ffcccc",
  "#ccffcc", "#ccccff", "#ffffcc", "#ffccff", "#ccffff", "#ffddcc"
];

interface ColorSwatchPickerProps {
  value: string;
  onChange: (color: string) => void;
  label: string;
}

const ColorSwatchPicker: React.FC<ColorSwatchPickerProps> = ({ value, onChange, label }) => (
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

export default ColorSwatchPicker; 