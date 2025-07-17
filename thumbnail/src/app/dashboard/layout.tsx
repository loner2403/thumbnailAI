"use server"

import Link from "next/link";
import Credits from "~/components/credits";
import { Button } from "~/components/ui/button";
import "~/styles/globals.css";
import { ImageIcon, CreditCard, Home, GithubIcon, TwitterIcon, Mail, Heart } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background/50 backdrop-blur-sm">
      {/* Modern top navbar */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <ImageIcon className="h-6 w-6 text-primary" />
            <span className="font-semibold tracking-tight">ThumbnailAI</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-muted px-3 py-1.5 text-sm">
              <Credits />
            </div>
            <Link href="/dashboard/pricing">
              <Button variant="outline" size="sm" className="gap-1.5">
                <CreditCard className="h-4 w-4" />
                Buy credits
              </Button>
            </Link>
            <div className="rounded-full p-2 hover:bg-muted/80 transition-colors">
              <UserButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main content with subtle background pattern */}
      <main className="flex-1 bg-grid-pattern">
        <div 
          className="container mx-auto px-4 py-8 md:py-12 max-w-7xl"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}
        >
          {children}
        </div>
      </main>

      {/* Responsive footer with improved design */}
      <footer className="border-t bg-background/90 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand section */}
            <div className="md:col-span-1 space-y-4">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-primary" />
                <span className="font-semibold tracking-tight">ThumbnailAI</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs">
                Create professional thumbnails with AI-powered background removal in seconds.
              </p>
            </div>

            {/* Links section */}
            <div className="md:col-span-1">
              <h3 className="font-medium text-sm mb-4">Quick Links</h3>
              <nav className="flex flex-col space-y-2">
                <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </Link>
                <Link href="/dashboard/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
                <Link href="/dashboard/help" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Help & Support
                </Link>
              </nav>
            </div>

            {/* Resources section */}
            <div className="md:col-span-1">
              <h3 className="font-medium text-sm mb-4">Resources</h3>
              <nav className="flex flex-col space-y-2">
                <Link href="/dashboard/templates" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Templates
                </Link>
                <Link href="/dashboard/api" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  API
                </Link>
                <Link href="/dashboard/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
              </nav>
            </div>

            {/* Social section */}
            <div className="md:col-span-1">
              <h3 className="font-medium text-sm mb-4">Connect</h3>
              <div className="flex items-center space-x-3">
                <a href="#" className="p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors" aria-label="Twitter">
                  <TwitterIcon className="h-4 w-4" />
                </a>
                <a href="#" className="p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors" aria-label="GitHub">
                  <GithubIcon className="h-4 w-4" />
                </a>
                <a href="#" className="p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors" aria-label="Email">
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-border/40 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>© {new Date().getFullYear()} ThumbnailAI. All rights reserved.</span>
            </div>
            
            <div className="flex items-center gap-6">
              <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="/cookies" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Cookies
              </Link>
            </div>
            
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>Made with</span>
              <Heart className="h-3 w-3 text-red-500 fill-red-500" />
              <span>by ThumbnailAI Team</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
