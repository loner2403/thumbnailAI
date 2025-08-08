'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Sparkles, Zap, Image } from 'lucide-react';
import gsap from 'gsap';

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const floatingElementsRef = useRef<HTMLDivElement>(null);
  const productVisualRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;

    const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    // Animate title words individually
    const titleWords = titleRef.current?.querySelectorAll('.word');
    if (titleWords) {
      timeline
        .fromTo(
          titleWords,
          { opacity: 0, y: 50, rotateX: 90 },
          { 
            opacity: 1, 
            y: 0, 
            rotateX: 0,
            duration: 0.8,
            stagger: 0.1,
            delay: 0.3
          }
        );
    }

    // Animate other elements
    timeline
      .fromTo(
        sectionRef.current.querySelector('p'),
        { opacity: 0, y: 30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8 },
        '-=0.4'
      )
      .fromTo(
        sectionRef.current.querySelector('.cta-button'),
        { opacity: 0, y: 30, scale: 0.8 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8 },
        '-=0.5'
      )
      .fromTo(
        productVisualRef.current,
        { opacity: 0, y: 50, scale: 0.8, rotateY: 15 },
        { opacity: 1, y: 0, scale: 1, rotateY: 0, duration: 1 },
        '-=0.3'
      );

    // Floating elements animation
    const floatingElements = floatingElementsRef.current?.querySelectorAll('.floating-element');
    if (floatingElements) {
      floatingElements.forEach((element, index) => {
        gsap.to(element, {
          y: -20,
          duration: 2 + index * 0.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: index * 0.3
        });
      });
    }

    // Background grid animation
    const gridItems = sectionRef.current?.querySelectorAll('.grid-item');
    if (gridItems) {
      gsap.fromTo(
        gridItems,
        { opacity: 0, scale: 0 },
        { 
          opacity: 0.1, 
          scale: 1, 
          duration: 1, 
          stagger: 0.1,
          delay: 1
        }
      );
    }

  }, []);

  const titleText = "Create Stunning Thumbnails in Seconds with AI";
  const words = titleText.split(' ');

  return (
    <section 
      ref={sectionRef} 
      className="relative flex flex-col items-center justify-center py-32 text-center w-full bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden"
    >
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-30">
        <div className="grid grid-cols-12 gap-4 h-full">
          {Array.from({ length: 48 }).map((_, i) => (
            <div
              key={i}
              className="grid-item w-2 h-2 bg-blue-200 rounded-full"
              style={{
                transform: `translate(${Math.random() * 100}px, ${Math.random() * 100}px)`
              }}
            />
          ))}
        </div>
      </div>

      {/* Floating Elements */}
      <div ref={floatingElementsRef} className="absolute inset-0 pointer-events-none">
        <div className="floating-element absolute top-20 left-10 text-blue-400 opacity-60">
          <Sparkles size={24} />
        </div>
        <div className="floating-element absolute top-32 right-20 text-blue-500 opacity-50">
          <Zap size={20} />
        </div>
        <div className="floating-element absolute bottom-40 left-20 text-blue-300 opacity-40">
          <Image size={28} />
        </div>
        <div className="floating-element absolute top-40 right-10 w-6 h-6 bg-blue-400 rounded-full opacity-30" />
        <div className="floating-element absolute bottom-60 right-32 w-4 h-4 bg-blue-300 rounded-full opacity-40" />
      </div>

      {/* Mouse Follower */}
      <div 
        className="absolute pointer-events-none opacity-20 transition-all duration-300"
        style={{
          left: mousePosition.x - 50,
          top: mousePosition.y - 50,
          width: 100,
          height: 100,
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
          borderRadius: '50%'
        }}
      />

      {/* Main Content */}
      <div className="relative z-10">
        <h1 ref={titleRef} className="text-4xl md:text-6xl font-extrabold text-gray-800 mb-6 leading-tight">
          {words.map((word, index) => (
            <span key={index} className="word inline-block mr-3 mb-2">
              {word === 'AI' ? (
                <span className="text-blue-500 relative">
                  {word}
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
                </span>
              ) : (
                word
              )}
            </span>
          ))}
        </h1>

        <p className="text-lg md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Upload a photo, place bold text behind the main subject, then fine‑tune fonts, colors, effects and templates to craft scroll‑stopping thumbnails.
        </p>

        <a
          href="/signup"
          className="cta-button group inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 mb-16"
        >
          Get Started for Free 
          <ArrowRight 
            size={22} 
            className="group-hover:translate-x-1 transition-transform duration-300" 
          />
        </a>

        {/* Enhanced Product Visual */}
        <div className="w-full flex justify-center">
          <div 
            ref={productVisualRef}
            className="product-visual relative rounded-2xl bg-gradient-to-br from-white to-gray-100 border border-gray-200 shadow-2xl w-[340px] h-[200px] md:w-[540px] md:h-[320px] flex items-center justify-center overflow-hidden group hover:shadow-3xl transition-all duration-500"
          >
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600" />
            </div>
            
            {/* Content */}
            <div className="relative z-10 text-center">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Image size={32} className="text-blue-500" />
                </div>
              </div>
              <span className="text-gray-500 text-lg font-medium">
                AI-Powered Thumbnail Generator
              </span>
              <div className="mt-4 flex justify-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>

            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-600/0 group-hover:from-blue-500/10 group-hover:to-blue-600/10 transition-all duration-500" />
          </div>
        </div>
      </div>

      {/* Bottom fade effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
