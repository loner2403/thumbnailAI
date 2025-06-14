"use client";

import React, { useEffect, useState } from "react";
import { Loader2, SparklesIcon, ImageIcon, Zap, Wand2 } from "lucide-react";

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = "Processing your image..." 
}) => {
  const [dots, setDots] = useState("");
  const [progress, setProgress] = useState(0);
  const [activeIcon, setActiveIcon] = useState(0);
  
  // Animate the loading dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? "" : prev + ".");
    }, 500);
    return () => clearInterval(interval);
  }, []);
  
  // Simulate progress movement
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + (Math.random() * 5);
        return next > 95 ? 95 : next;
      });
    }, 300);
    return () => clearInterval(interval);
  }, []);
  
  // Cycle through the icons
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIcon(prev => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  
  // Icons for the loading animation
  const loadingIcons = [
    <ImageIcon key="image" className="text-primary h-5 w-5" />,
    <Wand2 key="wand" className="text-primary h-5 w-5" />,
    <Zap key="zap" className="text-primary h-5 w-5" />,
    <SparklesIcon key="sparkles" className="text-primary h-5 w-5" />
  ];

  return (
    <div className="w-full py-12 flex flex-col items-center justify-center">
      <div className="max-w-md w-full mx-auto">
        {/* Main loading container */}
        <div 
          className="relative overflow-hidden border border-border/40 rounded-lg shadow-lg bg-gradient-to-b from-background/90 to-background/50 backdrop-blur-md"
          style={{
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.05) inset"
          }}
        >
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-10 overflow-hidden">
            <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-primary/30 blur-3xl animate-pulse-subtle" 
              style={{ animationDuration: "7s" }} />
            <div className="absolute -bottom-20 -right-10 w-60 h-60 rounded-full bg-primary/20 blur-3xl animate-pulse-subtle" 
              style={{ animationDuration: "8s", animationDelay: "1s" }} />
          </div>
          
          {/* Shimmering skeleton */}
          <div className="aspect-video w-full bg-transparent relative overflow-hidden">
            {/* Gradient overlay */}
            <div 
              className="absolute inset-0" 
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)",
                animation: "shimmer 2s infinite",
                backgroundSize: "200% 100%",
              }}
            />
            
            {/* Skeleton shapes with improved animation */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
              <div className="w-1/2 h-1/3 rounded-lg bg-muted/20 mb-6 relative overflow-hidden backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer-fast" />
              </div>
              <div className="w-3/4 h-8 rounded-md bg-muted/15 mb-4 relative overflow-hidden backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer-fast" style={{ animationDelay: "0.2s" }} />
              </div>
              <div className="w-1/2 h-6 rounded-md bg-muted/15 relative overflow-hidden backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer-fast" style={{ animationDelay: "0.4s" }} />
              </div>
            </div>
          </div>
          
          {/* Loading indicator overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10 backdrop-blur-[3px]">
            <div className="relative flex flex-col items-center gap-4">
              {/* Illuminated spinner */}
              <div className="relative w-16 h-16">
                {/* Glowing backdrop */}
                <div className="absolute inset-[25%] bg-primary/20 blur-xl rounded-full animate-pulse-subtle" style={{ animationDuration: "2s" }} />
                
                {/* Spinner elements */}
                <Loader2 className="w-16 h-16 animate-spin text-primary/20" />
                <Loader2 
                  className="w-16 h-16 animate-spin text-primary absolute inset-0" 
                  style={{ 
                    clipPath: 'polygon(0 0, 50% 0, 50% 50%, 0 50%)',
                    animation: 'spin 1s linear infinite, clip-rotate 2s ease-in-out infinite',
                    filter: 'drop-shadow(0 0 3px rgba(var(--primary), 0.5))'
                  }} 
                />
                
                {/* Center dot */}
                <div className="absolute inset-[42%] rounded-full bg-primary animate-pulse" />
              </div>
              
              <div className="text-center px-6 py-2 rounded-full bg-black/10 backdrop-blur-sm border border-white/5">
                <p className="text-sm font-medium flex items-center gap-2 justify-center">
                  {loadingIcons[activeIcon]}
                  <span>{message}{dots}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">AI magic in progress</p>
              </div>
              
              {/* Enhanced progress bar */}
              <div className="w-full max-w-xs mt-3">
                <div className="h-1 bg-muted/30 rounded-full overflow-hidden backdrop-blur-sm">
                  <div 
                    className="h-full bg-gradient-to-r from-primary/60 to-primary rounded-full"
                    style={{ 
                      width: `${progress}%`, 
                      transition: 'width 0.3s ease-out',
                      boxShadow: '0 0 8px rgba(var(--primary), 0.5)'
                    }} 
                  />
                </div>
                <div className="flex justify-between mt-1.5 px-1">
                  <span className="text-[10px] text-muted-foreground">{Math.round(progress)}% complete</span>
                  <span className="text-[10px] text-muted-foreground">Optimizing results</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced helpful tips */}
        <div className="mt-8 text-center relative">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-md rounded-full border border-border/20 shadow-md"></div>
            <SparklesIcon className="h-5 w-5 text-primary relative animate-pulse-subtle" style={{ animationDuration: "3s" }} />
          </div>
          
          <div className="pt-6 p-4 bg-black/5 backdrop-blur-sm rounded-lg border border-white/5">
            <h3 className="text-xs font-medium mb-2">While You Wait</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Our AI is carefully analyzing your image, removing the background,
              and preparing it for the perfect thumbnail composition.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen; 