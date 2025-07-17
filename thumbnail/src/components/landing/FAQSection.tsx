"use client"

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    q: "How many free credits do I get?",
    a: "You get 3 free credits when you sign up. Use them to try all features!",
  },
  {
    q: "What file formats are supported?",
    a: "You can upload PNG, JPG, and JPEG files.",
  },
  {
    q: "Can I use my own fonts?",
    a: "Currently, you can choose from a wide range of built-in fonts. Custom font upload is coming soon!",
  },
  {
    q: "Is there a subscription plan?",
    a: "We offer pay-as-you-go credits and custom enterprise plans. No recurring subscription required.",
  },
];

export default function FAQSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.fromTo(
      sectionRef.current.querySelectorAll('.faq-card'),
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="w-full py-20 bg-gray-100" id="faq">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-8">
          {faqs.map((faq, i) => (
            <div key={i} className="faq-card bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{faq.q}</h3>
              <p className="text-gray-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 