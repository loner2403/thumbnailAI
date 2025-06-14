"use client";


import { Card, CardContent, CardFooter } from "~/components/ui/card";
import ThumbnailCreator from "~/components/thumbnail-creator";
import { ImageIcon, Sparkles, Zap, Link2 } from "lucide-react";
import Recent from "~/components/recent";


export default function DashboardClient() {
  return (
    <div className="">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Hi there,
      </h1>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Want to create a thumbnail?
      </h1>
      <p className="mt-2 leading-7 text-muted-foreground">
        Use one of the templates below
      </p>

      {/* Dashboard Content */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-7">
        {/* Main Content - Thumbnail Creator */}
        <Card className="col-span-1 lg:col-span-5 border-none shadow-sm bg-background/60 backdrop-blur-sm overflow-hidden">
          
            <ThumbnailCreator />
              
        
        </Card>

        {/* Sidebar */}
        <div className="col-span-1 lg:col-span-2 space-y-6 lg:sticky lg:top-6 lg:self-start">
          {/* Stats Card */}
          

          {/* Tips Card */}
          <Card className="border-none shadow-sm bg-gradient-to-br from-primary/5 to-primary/10 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <ImageIcon className="h-5 w-5 text-primary" />
                  <h3 className="text-sm font-medium">Pro Tips</h3>
                </div>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start space-x-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Use high-contrast images for best results</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Keep text short and impactful</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Try different templates for variety</span>
                  </li>
                </ul>
              </div>
            </CardContent>
           
          </Card>
        </div>
      </div>
    </div>
  );
} 