'use client';
// FeaturesSection.tsx
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { ImageOff, LayoutGrid, Type, SlidersHorizontal } from 'lucide-react';

const features = [
  {
    icon: <ImageOff size={36} className="text-blue-500" />,
    title: 'AI Background Removal',
    desc: 'Instantly remove backgrounds from your images with a single click.',
  },
  {
    icon: <LayoutGrid size={36} className="text-blue-500" />,
    title: 'Customizable Templates',
    desc: 'Choose from a variety of professional thumbnail styles.',
  },
  {
    icon: <Type size={36} className="text-blue-500" />,
    title: 'Text Effects & Fonts',
    desc: 'Add eye-catching text with a range of fonts and effects.',
  },
  {
    icon: <SlidersHorizontal size={36} className="text-blue-500" />,
    title: 'Image Filters',
    desc: 'Enhance your thumbnails with powerful image filters.',
  },
];

export default function FeaturesSection() {
  return (
    <section className="w-full py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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