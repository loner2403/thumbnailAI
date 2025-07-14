import React from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Slider } from "./ui/slider";
import { FONT_OPTIONS } from "../lib/utils";

interface TextTabProps {
  text: string;
  setText: (t: string) => void;
  textSize: number;
  setTextSize: (n: number) => void;
  font: string;
  setFont: (f: string) => void;
}

const TextTab: React.FC<TextTabProps> = ({ text, setText, textSize, setTextSize, font, setFont }) => (
  <div className="space-y-5">
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
        onValueChange={setFont}
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
  </div>
);

export default TextTab; 