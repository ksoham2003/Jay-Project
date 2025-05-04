import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define protected routes
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',       // All dashboard routes
  '/api(.*)',             // All API routes
  '/sar-form(.*)',        // All SAR form routes
]);

export default clerkMiddleware((auth, req) => {
  // Protect matched routes
  if (isProtectedRoute(req)) {
    auth.protect();
  }

  // Handle API routes specifically
  if (req.nextUrl.pathname.startsWith('/api')) {
    // Add CORS headers for API routes
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Protect all routes except:
    '/((?!_next|sign-in|sign-up|public|favicon.ico|api/auth).*)',
    // Explicitly include API routes
    '/(api|trpc)(.*)',
  ],
};