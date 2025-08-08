'use client';
// HowItWorks.tsx
import { useEffect, useRef } from 'react';
import { UploadCloud, Sparkles, Download } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    icon: <UploadCloud size={40} className="text-blue-500" />,
    title: 'Upload Your Image',
    desc: 'Start by uploading your photo. We prep it for clean, pro results.',
  },
  {
    icon: <Sparkles size={40} className="text-blue-500" />,
    title: 'Add & Style Text',
    desc: 'Place text behind the main subject, drag to position, tweak fonts, colors, outlines, shadows and gradients.',
  },
  {
    icon: <Download size={40} className="text-blue-500" />,
    title: 'Download & Share',
    desc: 'Export your finished thumbnail with filters applied and share anywhere.',
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.fromTo(
      sectionRef.current.querySelectorAll('.step'),
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="w-full py-20 bg-gray-100">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12">How It Works</h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-10">
          {steps.map((step, i) => (
            <div key={i} className="step flex flex-col items-center text-center max-w-xs">
              <div className="mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}