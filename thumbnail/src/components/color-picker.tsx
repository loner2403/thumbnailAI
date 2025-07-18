// components/ColorPicker.tsx
import React, { useState } from 'react';
import { ChromePicker } from 'react-color';
import type { ColorResult } from 'react-color';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange, label }) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleColorChange = (color: ColorResult) => {
    onChange(color.hex);
  };

  return (
    <div className="relative">
      {label && <label className="block text-sm font-medium mb-2">{label}</label>}
      <div
        className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer shadow-sm"
        style={{ backgroundColor: color }}
        onClick={() => setShowPicker(!showPicker)}
      />
      {showPicker && (
        <div className="absolute top-14 left-0 z-50">
          <div
            className="fixed inset-0"
            onClick={() => setShowPicker(false)}
          />
          <ChromePicker
            color={color}
            onChange={handleColorChange}
            disableAlpha={false}
          />
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
