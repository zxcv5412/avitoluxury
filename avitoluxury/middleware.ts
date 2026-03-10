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
          return NextResponse.redirect(new URL('/admin/login', request.url));
        } else {
          const url = new URL('/login', request.url);
          url.searchParams.set('redirect', pathname);
          return NextResponse.redirect(url);
        }
      }
    }

    // Create response with security headers
    const response = NextResponse.next();
    
    // Add security headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'geolocation=(), camera=()');
    
    // Simplified CSP
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com; connect-src 'self' https://*.cloudinary.com https://*.razorpay.com; img-src 'self' data: blob: https://*.cloudinary.com https://placehold.co https://storage.googleapis.com; style-src 'self' 'unsafe-inline'; font-src 'self' data:; frame-src 'self' https://checkout.razorpay.com; object-src 'none'; base-uri 'self';"
    );
    
    return response;
    
  } catch (error) {
    // Log error and return basic response
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|_next/webpack|favicon.ico).*)',
  ],
};