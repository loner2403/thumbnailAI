"use client"

import { useState } from "react";
import { Check } from "lucide-react";

const Style = ({
    image,
    selectStyle, 
    isSelected
} : {
    image: string;
    selectStyle: () => void;
    isSelected: boolean;
}) => {
    const [mouseOver, setMouseOver] = useState(false);

    return (
        <div
            onMouseEnter={() => setMouseOver(true)}
            onMouseLeave={() => setMouseOver(false)}
            onClick={selectStyle}
            className={`
                group
                relative
                aspect-video
                w-full
                max-w-[260px]
                cursor-pointer 
                overflow-hidden
                rounded-xl 
                transition-all
                duration-300
                ${mouseOver ? "transform-gpu translate-y-[-4px] shadow-lg" : "shadow-sm"} 
                ${isSelected ? "ring-2 ring-primary" : ""}
                after:absolute
                after:inset-0
                after:z-10
                after:transition-all
                after:duration-300
                ${isSelected ? "after:bg-gradient-to-tr after:from-primary/10 after:to-transparent" : "after:opacity-0 after:bg-gradient-to-tr after:from-black/30 after:to-transparent after:group-hover:opacity-100"}
            `}
            style={{
                transform: mouseOver 
                    ? "perspective(1000px) rotateX(1.5deg)" 
                    : isSelected 
                        ? "perspective(1000px) rotateY(-0.5deg)" 
                        : "none"
            }}
        >
            {/* Background image */}
            <img
                className={`
                    w-full
                    h-full
                    object-cover
                    transition-all
                    duration-300
                    ${mouseOver ? "scale-[1.03] filter brightness-[1.03]" : ""}
                    ${isSelected ? "scale-[1.01] filter contrast-[1.03]" : ""}
                `}
                src={image}
                alt="style preview"
            />
            
            {/* Selection indicator */}
            {isSelected && (
                <div className="absolute top-2.5 right-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white shadow-md z-20">
                    <Check className="h-3 w-3" />
                </div>
            )}
            
            {/* Hover content */}
            <div className="absolute inset-0 z-20 flex flex-col justify-between p-3 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                <div className="flex justify-end">
                    <span className="rounded-full bg-white/90 backdrop-blur-sm px-2 py-0.5 text-[10px] font-medium text-gray-800 shadow-sm">
                        Template
                    </span>
                </div>
                <div className="flex items-end justify-center">
                    <div className="w-full rounded-md bg-black/40 p-2 backdrop-blur-sm">
                        <p className="text-center text-xs font-medium text-white">
                            {isSelected ? "Selected" : "Click to Select"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Style;