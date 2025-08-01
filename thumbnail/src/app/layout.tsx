import { ClerkProvider } from '@clerk/nextjs';
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
      </body>
    </html>
  );
}