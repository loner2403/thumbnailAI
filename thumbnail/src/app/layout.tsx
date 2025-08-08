import { ClerkProvider } from '@clerk/nextjs';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import '../styles/globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider
          afterSignInUrl="/dashboard"
          afterSignUpUrl="/dashboard"
          signInUrl="/signin"
          signUpUrl="/signup"
        >
          {children}
        </ClerkProvider>
        {/* Vercel Analytics & Speed Insights */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}