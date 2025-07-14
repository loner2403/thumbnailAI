import React from "react";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import ColorSwatchPicker from "./ColorSwatchPicker";
import { gradientPresets, directionPresets } from "../lib/utils";

interface EffectsTabProps {
  textShadow: boolean;
  setTextShadow: (b: boolean) => void;
  shadowBlur: number;
  setShadowBlur: (n: number) => void;
  shadowColor: string;
  setShadowColor: (c: string) => void;
  textOutline: boolean;
  setTextOutline: (b: boolean) => void;
  outlineWidth: number;
  setOutlineWidth: (n: number) => void;
  outlineColor: string;
  setOutlineColor: (c: string) => void;
  useGradient: boolean;
  setUseGradient: (b: boolean) => void;
  gradientColor1: string;
  setGradientColor1: (c: string) => void;
  gradientColor2: string;
  setGradientColor2: (c: string) => void;
  gradientDirection: number;
  setGradientDirection: (n: number) => void;
  textOpacity: number;
  setTextOpacity: (n: number) => void;
}

const EffectsTab: React.FC<EffectsTabProps> = (props) => {
  const {
    textShadow, setTextShadow, shadowBlur, setShadowBlur, shadowColor, setShadowColor,
    textOutline, setTextOutline, outlineWidth, setOutlineWidth, outlineColor, setOutlineColor,
    useGradient, setUseGradient, gradientColor1, setGradientColor1, gradientColor2, setGradientColor2,
    gradientDirection, setGradientDirection, textOpacity, setTextOpacity
  } = props;

  return (
    <div className="space-y-4 mt-4">
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
                    style={{ background: `linear-gradient(90deg, ${preset.colors[0]}, ${preset.colors[1]})` }}
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
    </div>
  );
};

export default EffectsTab; 