"use client"

import { Card, CardHeader, CardContent } from "../ui/card";
import gsap from 'gsap';
import { useEffect, useRef } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote: "ThumbnailAI made my YouTube workflow so much faster! The text-behind-subject effect is magic.",
    name: "Alex J.",
  },
  {
    quote: "I love the templates and text effects. My thumbnails look so much more professional now.",
    name: "Priya S.",
  },
  {
    quote: "Super easy to use and the results are amazing. Highly recommend for any content creator!",
    name: "Chris M.",
  },
];

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.fromTo(
      sectionRef.current.querySelectorAll('.testimonial-card'),
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
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12">What Our Users Say</h2>
        <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
          {testimonials.map((t, i) => (
            <Card key={i} className="testimonial-card flex-1 border border-gray-200 rounded-xl p-8 shadow-sm flex flex-col items-center text-center">
              <CardHeader className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center mb-4 text-white text-2xl font-bold">
                  {t.name.charAt(0)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 italic mb-4">{`"${t.quote}"`}</p>
                <span className="text-gray-800 font-semibold">{t.name}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}