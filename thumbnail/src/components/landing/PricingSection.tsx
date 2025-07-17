"use client"

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "../ui/card";

const plans = [
  {
    name: "Free",
    price: "$0",
    features: ["3 free credits", "Basic templates", "Standard filters"],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$9",
    features: ["50 credits", "All templates", "Advanced filters", "Priority support"],
    cta: "Buy Credits",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Contact Us",
    features: ["Custom credits", "Custom templates", "Dedicated support"],
    cta: "Contact Sales",
    highlight: false,
  },
];

export default function PricingSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.fromTo(
      sectionRef.current.querySelectorAll('.pricing-card'),
      { opacity: 0, scale: 0.95 },
      {
        opacity: 1,
        scale: 1,
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
    <section ref={sectionRef} className="w-full py-20 bg-white" id="pricing">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12">Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <Card
              key={i}
              className={`pricing-card flex flex-col items-center border rounded-xl p-8 shadow-sm transition-transform ${plan.highlight ? 'border-blue-500 scale-105 z-10' : 'border-gray-200'}`}
            >
              <CardHeader className="w-full text-center">
                <CardTitle className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</CardTitle>
                <div className={`text-3xl font-extrabold mb-4 ${plan.highlight ? 'text-blue-500' : 'text-gray-800'}`}>{plan.price}</div>
                <CardDescription>{plan.cta === 'Buy Credits' ? 'Best for creators' : plan.cta === 'Get Started' ? 'Try for free' : 'For teams & businesses'}</CardDescription>
              </CardHeader>
              <CardContent className="w-full mb-6 text-gray-600">
                <ul>
                  {plan.features.map((f, j) => (
                    <li key={j} className="mb-1 flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                      {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="w-full">
                <button
                  className={`px-6 py-3 rounded-lg font-semibold text-lg w-full transition-colors ${plan.highlight ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                >
                  {plan.cta}
                </button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
} 