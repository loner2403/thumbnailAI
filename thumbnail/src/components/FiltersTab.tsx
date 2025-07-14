import React from "react";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { imageFilters } from "../lib/utils";

interface FiltersTabProps {
  selectedFilter: string;
  setSelectedFilter: (f: string) => void;
  filterIntensity: number;
  setFilterIntensity: (n: number) => void;
  filterBrightness: number;
  setFilterBrightness: (n: number) => void;
  filterContrast: number;
  setFilterContrast: (n: number) => void;
  filterSaturation: number;
  setFilterSaturation: (n: number) => void;
}

const FiltersTab: React.FC<FiltersTabProps> = ({
  selectedFilter, setSelectedFilter,
  filterIntensity, setFilterIntensity,
  filterBrightness, setFilterBrightness,
  filterContrast, setFilterContrast,
  filterSaturation, setFilterSaturation
}) => (
  <div className="space-y-4 mt-4">
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
  </div>
);

export default FiltersTab; 