'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { LogIn, UserPlus, Menu, X, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

export default function LandingHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!headerRef.current) return;

    const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    // Initial header animation
    timeline
      .fromTo(
        headerRef.current,
        { y: -80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: 0.2 }
      )
      .fromTo(
        logoRef.current,
        { scale: 0, rotation: -180 },
        { scale: 1, rotation: 0, duration: 0.8 },
        '-=0.6'
      )
      .fromTo(
        navRef.current?.querySelectorAll('a') || [],
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },
        '-=0.4'
      )
      .fromTo(
        buttonsRef.current?.querySelectorAll('a') || [],
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.6, stagger: 0.1 },
        '-=0.3'
      );

    // Scroll-triggered animations
    ScrollTrigger.create({
      trigger: headerRef.current,
      start: 'top top',
      end: 'bottom top',
      onUpdate: (self) => {
        const progress = self.progress;
        if (headerRef.current) {
          gsap.to(headerRef.current, {
            backdropFilter: `blur(${progress * 20}px)`,
            backgroundColor: `rgba(249, 250, 251, ${0.8 + progress * 0.2})`,
            duration: 0.3
          });
        }
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    
    if (!isMenuOpen) {
      gsap.fromTo(
        mobileMenuRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
      );
      gsap.fromTo(
        mobileMenuRef.current?.querySelectorAll('.mobile-nav-item') || [],
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, delay: 0.1 }
      );
    } else {
      gsap.to(mobileMenuRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.2,
        ease: 'power2.in'
      });
    }
  };

  return (
    <>
      <header
        ref={headerRef}
        className={`w-full px-4 md:px-8 py-4 flex items-center justify-between fixed top-0 left-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-lg'
            : 'bg-gray-50/80 backdrop-blur-sm border-b border-gray-200'
        }`}
      >
        {/* Logo */}
        <div ref={logoRef} className="flex items-center gap-2 group cursor-pointer">
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Sparkles size={18} className="text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
            ThumbnailAI
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav ref={navRef} className="hidden md:flex gap-8 items-center">
          {navLinks.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              className="relative text-gray-600 hover:text-blue-500 transition-all duration-300 font-medium py-2 px-4 rounded-lg hover:bg-blue-50 group"
            >
              {link.label}
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-500 group-hover:w-full group-hover:left-0 transition-all duration-300" />
            </a>
          ))}
        </nav>

        {/* Desktop Buttons */}
        <div ref={buttonsRef} className="hidden md:flex gap-2 items-center">
          <Link
            href="/signin"
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-200 transition-all duration-300 font-medium"
          >
            <LogIn size={18} className="group-hover:scale-110 transition-transform duration-300" />
            Sign In
          </Link>
          <Link
            href="/signup"
            className="group inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <UserPlus size={18} className="group-hover:scale-110 transition-transform duration-300" />
            Sign Up
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 rounded-lg hover:bg-gray-200 transition-colors duration-300"
        >
          {isMenuOpen ? (
            <X size={24} className="text-gray-600" />
          ) : (
            <Menu size={24} className="text-gray-600" />
          )}
        </button>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="fixed top-16 left-0 right-0 bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-lg z-40 md:hidden"
        >
          <div className="px-4 py-6 space-y-4">
            {/* Mobile Navigation */}
            <nav className="space-y-2">
              {navLinks.map((link, index) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="mobile-nav-item block px-4 py-3 text-gray-600 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-300 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Mobile Buttons */}
            <div className="pt-4 border-t border-gray-200 space-y-2">
              <Link
                href="/signin"
                className="mobile-nav-item flex items-center gap-2 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-300 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <LogIn size={18} />
                Sign In
              </Link>
              <Link
                href="/signup"
                className="mobile-nav-item flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                <UserPlus size={18} />
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
