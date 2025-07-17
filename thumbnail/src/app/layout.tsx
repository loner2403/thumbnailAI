// In your main layout file (e.g., layout.tsx)
'use client';

import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import { ClerkProvider } from '@clerk/nextjs';
import '../styles/globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis();

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}