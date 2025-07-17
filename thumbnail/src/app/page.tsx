import LandingHeader from "../components/landing/LandingHeader";
import HeroSection from "../components/landing/HeroSection";
import HowItWorks from "../components/landing/HowItWorks";
import FeaturesSection from "../components/landing/FeaturesSection";
import TestimonialsSection from "../components/landing/TestimonialsSection";
import PricingSection from "../components/landing/PricingSection";
import FAQSection from "../components/landing/FAQSection";
import FinalCTASection from "../components/landing/FinalCTASection";
import LandingFooter from "../components/landing/LandingFooter";

export default function HomePage() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <LandingHeader />
      <main className="flex-1 flex flex-col items-center w-full">
        <section id="hero" className="w-full"><HeroSection /></section>
        <section id="how-it-works" className="w-full"><HowItWorks /></section>
        <section id="features" className="w-full"><FeaturesSection /></section>
        <section id="testimonials" className="w-full"><TestimonialsSection /></section>
        <section id="pricing" className="w-full"><PricingSection /></section>
        <section id="faq" className="w-full"><FAQSection /></section>
        <section id="final-cta" className="w-full"><FinalCTASection /></section>
      </main>
      <LandingFooter />
    </div>
  );
}
