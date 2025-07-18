import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Sliders, Type, Image as LucideImage } from "lucide-react";
import TextTab from "./TextTab";
import EffectsTab from "./EffectsTab";
import FiltersTab from "./FiltersTab";
import { Button } from "./ui/button";

interface EditorSidebarProps {
  // Text tab
  text: string;
  setText: (t: string) => void;
  textSize: number;
  setTextSize: (n: number) => void;
  font: string;
  setFont: (f: string) => void;
  
  // Effects tab
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
  
  // Filters tab
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
  
  // Actions
  onDownload: () => void;
  onUpdate: () => void;
  error: string | null;
  onDismissError: () => void;
}

const EditorSidebar: React.FC<EditorSidebarProps> = (props) => {
  return (
    <Card className="w-full border-none shadow-md bg-background/80 backdrop-blur-sm flex flex-col">
      <CardHeader>
        <CardTitle>Edit Thumbnail</CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 min-h-0 overflow-y-auto">
        <Tabs defaultValue="text" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="text">
              <Type className="w-4 h-4 mr-2" />
              Text
            </TabsTrigger>
            <TabsTrigger value="effects">
              <Sliders className="w-4 h-4 mr-2" />
              Text Effects
            </TabsTrigger>
            <TabsTrigger value="filters">
              <LucideImage className="w-4 h-4 mr-2" />
              Image Filters
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="text" className="mt-6">
            <TextTab
              text={props.text}
              setText={props.setText}
              textSize={props.textSize}
              setTextSize={props.setTextSize}
              font={props.font}
              setFont={props.setFont}
            />
          </TabsContent>
          
          <TabsContent value="effects" className="mt-6">
            <EffectsTab
              textShadow={props.textShadow}
              setTextShadow={props.setTextShadow}
              shadowBlur={props.shadowBlur}
              setShadowBlur={props.setShadowBlur}
              shadowColor={props.shadowColor}
              setShadowColor={props.setShadowColor}
              textOutline={props.textOutline}
              setTextOutline={props.setTextOutline}
              outlineWidth={props.outlineWidth}
              setOutlineWidth={props.setOutlineWidth}
              outlineColor={props.outlineColor}
              setOutlineColor={props.setOutlineColor}
              useGradient={props.useGradient}
              setUseGradient={props.setUseGradient}
              gradientColor1={props.gradientColor1}
              setGradientColor1={props.setGradientColor1}
              gradientColor2={props.gradientColor2}
              setGradientColor2={props.setGradientColor2}
              gradientDirection={props.gradientDirection}
              setGradientDirection={props.setGradientDirection}
              textOpacity={props.textOpacity}
              setTextOpacity={props.setTextOpacity}
            />
          </TabsContent>
          
          <TabsContent value="filters" className="mt-6">
            <FiltersTab
              selectedFilter={props.selectedFilter}
              setSelectedFilter={props.setSelectedFilter}
              filterIntensity={props.filterIntensity}
              setFilterIntensity={props.setFilterIntensity}
              filterBrightness={props.filterBrightness}
              setFilterBrightness={props.setFilterBrightness}
              filterContrast={props.filterContrast}
              setFilterContrast={props.setFilterContrast}
              filterSaturation={props.filterSaturation}
              setFilterSaturation={props.setFilterSaturation}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex gap-2">
        <Button onClick={props.onDownload} className="flex-1">
          Download
        </Button>
        <Button onClick={props.onUpdate} variant="outline" className="flex-1">
          Update
        </Button>
      </CardFooter>
      
      {props.error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg m-4">
          <p className="text-destructive text-sm">{props.error}</p>
          <Button
            onClick={props.onDismissError}
            variant="ghost"
            size="sm"
            className="mt-2"
          >
            Dismiss
          </Button>
        </div>
      )}
    </Card>
  );
};

export default EditorSidebar;
