"use client"

import { useEffect, useRef } from 'react';
import { ArrowRight } from "lucide-react";
import gsap from 'gsap';

export default function FinalCTASection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.fromTo(
      sectionRef.current.querySelectorAll('.cta-animate'),
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out',
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="w-full py-20 flex flex-col items-center justify-center text-center bg-gray-200">
      <h2 className="cta-animate text-3xl md:text-4xl font-extrabold text-gray-800 mb-4">Boost Your Views with Better Thumbnails</h2>
      <p className="cta-animate text-lg text-gray-600 mb-8 max-w-xl mx-auto">Start creating eye-catching thumbnails with AI-powered tools. Sign up now and get free credits to try it out!</p>
      <a
        href="/signup"
        className="cta-animate inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-blue-500 text-white font-bold text-lg shadow-md hover:bg-blue-600 transition-all"
      >
        Get Started for Free <ArrowRight size={22} />
      </a>
    </section>
  );
} 