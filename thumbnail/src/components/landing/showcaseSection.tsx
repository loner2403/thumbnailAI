'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

const showcaseItems = [
  {
    title: "Vibrant and Punchy",
    description: "Pop with vivid colors and bold text.",
    image: "/spiderman.png",
  },
  {
    title: "Clean and Minimal",
    description: "A modern look for a professional feel.",
    image: "/superman (1).png",
  },
  {
    title: "Dramatic and Cinematic",
    description: "High-contrast and dramatic lighting.",
    image: "/style3.png",
  },
  
  {
    title: "Sleek and Professional",
    description: "Perfect for corporate or serious content.",
    image: "/superman (1).png",
  },
  {
    title: "Eye-Catching Gradients",
    description: "Make your text stand out beautifully.",
    image: "/spiderman.png",
  },
];

// This interface will hold the original item data plus the calculated span values
interface ProcessedShowcaseItem {
  id: number;
  data: typeof showcaseItems[0];
  gridSpan: {
    colSpan: number;
    rowSpan: number;
  };
}

// Helper function to calculate grid spans based on image aspect ratio
const calculateGridSpan = (aspectRatio: number) => {
  if (aspectRatio < 0.8) { // Portrait
    return { colSpan: 1, rowSpan: 2 };
  }
  if (aspectRatio > 1.5) { // Landscape
    return { colSpan: 2, rowSpan: 1 };
  }
  // Square-like
  return { colSpan: 1, rowSpan: 1 };
};

export default function ShowcaseSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [processedItems, setProcessedItems] = useState<ProcessedShowcaseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const processImages = async () => {
      const itemsWithSpans = await Promise.all(
        showcaseItems.map((item, index) =>
          new Promise<ProcessedShowcaseItem>((resolve) => {
            const img = new window.Image();
            img.src = item.image;
            img.onload = () => {
              const aspectRatio = img.width / img.height;
              resolve({
                id: index,
                data: item,
                gridSpan: calculateGridSpan(aspectRatio),
              });
            };
            img.onerror = () => {
              // Fallback for failed images
              resolve({
                id: index,
                data: item,
                gridSpan: { colSpan: 1, rowSpan: 1 },
              });
            };
          })
        )
      );
      setProcessedItems(itemsWithSpans);
      setIsLoading(false);
    };

    processImages().catch(console.error);
  }, []);

  useEffect(() => {
    if (isLoading) return; // Don't run animations until the grid is ready

    const section = sectionRef.current;
    const title = titleRef.current;
    const gridItems = section?.querySelectorAll('.showcase-item');

    if (!section || !title || !gridItems) return;

    // Animate the main title
    gsap.fromTo(title,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: title,
          start: 'top 85%',
        }
      }
    );

    // Animate grid items with a staggered effect
    gsap.fromTo(gridItems,
      {
        autoAlpha: 0,
        y: 50,
        scale: 0.9,
      },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: section.querySelector('.grid'),
          start: 'top 80%',
        }
      }
    );
  }, [isLoading]); // Rerun animations when loading is complete

  return (
    <section ref={sectionRef} className="py-24 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 ref={titleRef} className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-4 tracking-tight">
            Infinite Styles, One Click
          </h2>
          <p className="text-lg text-gray-600">
            From minimal to cinematic, generate the perfect thumbnail for your content.
          </p>
        </div>
        
        {isLoading ? (
            <div className="text-center text-gray-500">Loading showcase...</div>
        ) : (
            <div
                className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[250px]"
            >
                {processedItems.map((item) => (
                <div
                    key={item.id}
                    className="showcase-item group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                    style={{
                        gridColumn: `span ${item.gridSpan.colSpan}`,
                        gridRow: `span ${item.gridSpan.rowSpan}`,
                    }}
                >
                    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                        <Image
                            src={item.data.image}
                            alt={item.data.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-contain transition-transform duration-500 ease-in-out group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-0 left-0 p-5 text-white w-full">
                            <div className="overflow-hidden">
                                <h3 className="text-xl font-bold transition-transform duration-500 ease-in-out transform translate-y-full group-hover:translate-y-0">
                                    {item.data.title}
                                </h3>
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm opacity-0 transition-all duration-500 ease-in-out delay-100 transform translate-y-full group-hover:translate-y-0 group-hover:opacity-100">
                                    {item.data.description}
                                </p>
                            </div>
                        </div>
                        <div className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300 ease-in-out">
                            <ArrowUpRight className="text-white w-5 h-5" />
                        </div>
                    </div>
                </div>
                ))}
            </div>
        )}
      </div>
    </section>
  );
}