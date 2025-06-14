"use client"

import React, { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { cn } from "~/lib/utils"

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
  className?: string
}

const predefinedColors = [
  "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF", 
  "#FFFF00", "#FF00FF", "#00FFFF", "#FF8800", "#8800FF",
  "#0088FF", "#88FF00", "#FF0088", "#880000", "#008800",
  "#000088", "#888888", "#AAAAAA", "#CCCCCC"
]

export function ColorPicker({ color, onChange, className }: ColorPickerProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "h-8 w-8 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-ring",
            className
          )}
          style={{ background: color }}
          aria-label="Pick a color"
        ></button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3">
        <div className="grid grid-cols-5 gap-2">
          {predefinedColors.map((c) => (
            <button
              key={c}
              className={`h-6 w-6 rounded-md border ${
                c === color ? "ring-2 ring-primary" : ""
              }`}
              style={{ background: c }}
              onClick={() => {
                onChange(c)
                setOpen(false)
              }}
            />
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2">
          <input
            type="color"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="h-8 w-8 cursor-pointer appearance-none rounded-md border border-input bg-background"
            style={{ background: color }}
          />
          <input
            type="text"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="h-8 flex-1 rounded-md border border-input px-3 py-1 text-sm"
          />
        </div>
      </PopoverContent>
    </Popover>
  )
} 