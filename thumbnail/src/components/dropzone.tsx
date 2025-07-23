"use client";

import React, { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import Image from "next/image";

interface DropzoneProps {
  onFileAccepted?: (file: File) => void;
  setSelectedImage?: (file: File) => Promise<void>;
}

const Dropzone: React.FC<DropzoneProps> = ({ onFileAccepted, setSelectedImage }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (files?.[0]) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        setPreview(URL.createObjectURL(file));
        onFileAccepted?.(file);
        setSelectedImage?.(file).catch(err => console.error(err));
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  return (
    <div
      className={`
        border-2 
        border-dashed 
        rounded-xl 
        p-8 
        flex 
        flex-col 
        items-center 
        justify-center 
        transition-all 
        duration-300
        cursor-pointer 
        relative 
        bg-muted/20 
        hover:bg-muted/30
        ${dragActive ? "border-primary bg-primary/10 scale-[1.01]" : "border-border/50 dark:border-border/30"}
      `}
      onClick={() => inputRef.current?.click()}
      onDragOver={e => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={e => {
        e.preventDefault();
        setDragActive(false);
      }}
      onDrop={handleDrop}
      style={{ minHeight: 200 }}
    >
      {preview ? (
        <div className="relative flex flex-col items-center gap-3">
          <div className="relative rounded-md overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg">
            <Image
              src={preview}
              alt="Preview"
              width={200}
              height={200}
              className="max-h-44 object-contain"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <p className="text-xs text-muted-foreground">Image ready for processing</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 text-muted-foreground max-w-xs text-center">
          <div className={`rounded-full p-3 bg-primary/10 transition-all duration-300 ${dragActive ? "scale-110" : ""}`}>
            <UploadCloud className={`w-8 h-8 text-primary transition-all duration-300 ${dragActive ? "scale-110" : ""}`} />
          </div>
          <span className="font-medium">Drop your image here</span>
          <span className="text-xs text-muted-foreground">or click to browse</span>
          <span className="text-[10px] text-muted-foreground mt-2">PNG, JPG, JPEG, or GIF (max 5MB)</span>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
};

export default Dropzone;