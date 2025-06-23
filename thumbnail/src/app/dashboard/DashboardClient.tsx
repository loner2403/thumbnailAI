"use client";

import { Card, CardContent, CardFooter } from "~/components/ui/card";
import ThumbnailCreator from "~/components/thumbnail-creator";
import { ImageIcon, Sparkles, Zap, Link2 } from "lucide-react";
import Recent from "~/components/recent";

export default function DashboardClient() {
  return (
    <div className="w-full">
      <div className="w-full">
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
        <div className="grid grid-cols-1 w-full">
          {/* Main Content - Thumbnail Creator */}
          <Card className="w-full h-full">
            <ThumbnailCreator />
          </Card>
          {/* Sidebar removed */}
        </div>
      </div>
    </div>
  );
} 