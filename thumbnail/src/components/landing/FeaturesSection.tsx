'use client';
// FeaturesSection.tsx
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Layers, LayoutGrid, SlidersHorizontal, Move, Palette } from 'lucide-react';

const features = [
  {
    icon: <Layers size={36} className="text-blue-500" />,
    title: 'Subject‑Aware Text Layering',
    desc: 'Place bold text behind the main subject for a premium, cinematic look.',
  },
  {
    icon: <Move size={36} className="text-blue-500" />,
    title: 'Drag Text Anywhere',
    desc: 'Click and drag to position your caption precisely on the image.',
  },
  {
    icon: <Palette size={36} className="text-blue-500" />,
    title: 'Fonts, Colors & Effects',
    desc: 'Control font, size, color, outlines, shadows, gradients and opacity.',
  },
  {
    icon: <LayoutGrid size={36} className="text-blue-500" />,
    title: 'Ready‑Made Templates',
    desc: 'Start fast with curated styles to match your content vibe.',
  },
  {
    icon: <SlidersHorizontal size={36} className="text-blue-500" />,
    title: 'Image Filters',
    desc: 'Tune brightness, contrast, saturation and apply creative presets.',
  },
];

export default function FeaturesSection() {
  return (
    <section className="w-full py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {features.map((feature, i) => (
            <Card key={i} className="flex flex-col items-center text-center border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="mb-2 flex flex-col items-center">
                <div className="mb-4">{feature.icon}</div>
                <CardTitle className="text-xl font-semibold text-gray-800">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">{feature.desc}</CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}