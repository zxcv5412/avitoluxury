import { NextRequest, NextResponse } from 'next/server';

// Protected paths that require authentication
const protectedPaths = [
  '/account',
  '/account/wishlist',
  '/account/orders'
];

// Admin paths
const adminBasePath = '/admin';

// Public paths that should always be accessible
const publicPaths = [
  '/admin/login',
  '/login',
  '/register'
];

export function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    const hostname = request.headers.get('host') || '';
    
    // Skip middleware for static files, API routes, and public paths
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api/') ||
      pathname.includes('favicon') ||
      pathname.includes('.') ||
      publicPaths.includes(pathname)
    ) {
      return NextResponse.next();
    }

    // Create response with security headers
    const response = NextResponse.next();
    
    // Security Headers
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    
    // Content Security Policy
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://www.googletagmanager.com https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://api.razorpay.com https://checkout.razorpay.com https://va.vercel-scripts.com https://vitals.vercel-insights.com",
      "frame-src https://api.razorpay.com https://checkout.razorpay.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ');
    
    response.headers.set('Content-Security-Policy', csp);
    
    // HSTS for production
    if (process.env.NODE_ENV === 'production') {
      response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    }

    // Temporarily disable domain routing to fix redirect loops
    // TODO: Re-enable after testing
    /*
    if (process.env.NODE_ENV === 'production') {
      // Handle www to non-www redirect first
      if (hostname === 'www.avitoluxury.in') {
        return NextResponse.redirect(new URL(`https://avitoluxury.in${pathname}`, request.url));
      }
      
      // Admin subdomain handling
      if (hostname === 'admin.avitoluxury.in') {
        // Only redirect root to admin login
        if (pathname === '/') {
          return NextResponse.redirect(new URL('/admin/login', request.url));
        }
        
        // Block store routes on admin subdomain
        if (pathname.startsWith('/store-routes')) {
          return NextResponse.redirect(new URL(`https://avitoluxury.in${pathname}`, request.url));
        }
      }
      // Main domain handling
      else if (hostname === 'avitoluxury.in') {
        // Redirect admin paths to admin subdomain
        if (pathname.startsWith('/admin')) {
          return NextResponse.redirect(new URL(`https://admin.avitoluxury.in${pathname}`, request.url));
        }
        
        // Only redirect root to store
        if (pathname === '/') {
          return NextResponse.redirect(new URL('/store-routes/store', request.url));
        }
      }
    }
    */

    // Basic auth check for protected routes (without async operations)
    if (pathname.startsWith(adminBasePath) || protectedPaths.some(path => pathname.startsWith(path))) {
      // Check for tokens in cookies
      const adminToken = request.cookies.get('admin_token')?.value;
      const regularToken = request.cookies.get('token')?.value;
      const authHeader = request.headers.get('authorization');
      
      // If no token found, redirect to appropriate login
      if (!adminToken && !regularToken && !authHeader) {
        if (pathname.startsWith(adminBasePath)) {
          const redirectResponse = NextResponse.redirect(new URL('/admin/login', request.url));
          // Add security headers to redirect response
          addSecurityHeaders(redirectResponse);
          return redirectResponse;
        } else {
          const url = new URL('/login', request.url);
          url.searchParams.set('redirect', pathname);
          const redirectResponse = NextResponse.redirect(url);
          // Add security headers to redirect response
          addSecurityHeaders(redirectResponse);
          return redirectResponse;
        }
      }
    }

    // Return response with security headers
    return response;
    
  } catch (error) {
    // Log error and return basic response
    console.error('Middleware error:', error);
    const errorResponse = NextResponse.next();
    addSecurityHeaders(errorResponse);
    return errorResponse;
  }
}

// Helper function to add security headers
function addSecurityHeaders(response: NextResponse) {
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://www.googletagmanager.com https://va.vercel-scripts.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://api.razorpay.com https://checkout.razorpay.com https://va.vercel-scripts.com https://vitals.vercel-insights.com",
    "frame-src https://api.razorpay.com https://checkout.razorpay.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ');
  
  response.headers.set('Content-Security-Policy', csp);
  
  // HSTS for production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|_next/webpack|favicon.ico).*)',
  ],
};