"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"
import type { ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          error: "bg-destructive text-destructive-foreground border-destructive",
          success: "bg-success text-success-foreground border-success/50",
          info: "bg-blue-500 text-white border-blue-600",
          warning: "bg-yellow-500 text-white border-yellow-600",
        }
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--success-bg": "var(--success)",
          "--success-text": "white",
          "--success-border": "var(--success)",
          "--error-bg": "var(--destructive)",
          "--error-text": "white",
          "--error-border": "var(--destructive)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
