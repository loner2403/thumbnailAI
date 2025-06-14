import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Export middleware with better error handling
export default withAuth(
  function middleware(req) {
    // Successful authentication continues to the requested page
    return NextResponse.next();
  },
  {
    pages: { signIn: "/signin" },
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Protect only dashboard and subsequent routes
export const config = { matcher: ["/dashboard/:path*"] };