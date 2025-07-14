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
    <Card className="w-full md:w-[25%] max-h-[80vh] border-none shadow-md bg-background/80 backdrop-blur-sm flex flex-col">
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
          <TabsContent value="text">
            <TextTab
              text={props.text}
              setText={props.setText}
              textSize={props.textSize}
              setTextSize={props.setTextSize}
              font={props.font}
              setFont={props.setFont}
            />
          </TabsContent>
          <TabsContent value="effects">
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
          <TabsContent value="filters">
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
      <CardFooter className="flex flex-wrap justify-between gap-2 px-5 pt-2 pb-5">
        <Button onClick={props.onDownload} className="gap-1.5 bg-primary/90 hover:bg-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Download
        </Button>
        <Button onClick={props.onUpdate} className="gap-1.5 bg-muted/80 hover:bg-muted text-foreground">
          <Sliders className="h-4 w-4" />
          Update
        </Button>
      </CardFooter>
      {props.error && (
        <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
          <p className="text-red-800 text-sm">{props.error}</p>
          <Button 
            onClick={props.onDismissError} 
            className="mt-2 text-xs"
            variant="outline"
            size="sm"
          >
            Dismiss
          </Button>
        </div>
      )}
    </Card>
  );
};

export default EditorSidebar; 