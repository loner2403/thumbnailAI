import React from "react";
import Style from "./style";

interface StyleSelectorProps {
  selectedStyle: string;
  onSelect: (style: string) => void;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyle, onSelect }) => (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
    <Style
      image="/style1.png"
      selectStyle={() => onSelect("style1")}
      isSelected={selectedStyle === "style1"}
    />
    <Style
      image="/style2.png"
      selectStyle={() => onSelect("style2")}
      isSelected={selectedStyle === "style2"}
    />
    <Style
      image="/style3.png"
      selectStyle={() => onSelect("style3")}
      isSelected={selectedStyle === "style3"}
    />
  </div>
);

export default StyleSelector; 