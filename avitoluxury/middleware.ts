import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from './src/app/lib/auth-utils';

// Protected paths that require authentication
const protectedPaths = [
  '/account',
  '/account/wishlist',
  '/account/orders'
];

// Protect all /admin pages and subpages
const adminBasePath = '/admin';

// Paths that should always be accessible
const publicPaths = [
  '/admin/login',
  '/login',
  '/register'
];

// Helper function to check if we're in development mode or on localhost
function isDevelopmentOrLocalhost(hostname: string): boolean {
  return process.env.NODE_ENV !== 'production' || 
         hostname.includes('localhost') || 
         hostname.includes('127.0.0.1');
}

export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    const hostname = request.headers.get('host') || '';
    
    // Skip middleware for static files and certain API routes early
    if (
      pathname.startsWith('/_next') ||
      pathname.includes('favicon') ||
      pathname.includes('.') ||
      pathname.startsWith('/api/') ||
      publicPaths.some(path => pathname === path)
    ) {
      return applySecurityHeaders(NextResponse.next());
    }

    // Skip domain-based routing for development or localhost
    const isDevOrLocal = isDevelopmentOrLocalhost(hostname);
    
    // Domain-based routing logic for production environment
    if (!isDevOrLocal) {
      try {
        const domainResponse = await handleDomainRouting(request, hostname, pathname);
        if (domainResponse) {
          return domainResponse;
        }
      } catch (error) {
        console.error('Domain routing error:', error);
        // Continue with normal processing if domain routing fails
      }
    }

    // Handle protected routes
    if (
      pathname.startsWith(adminBasePath) || 
      protectedPaths.some(path => pathname.startsWith(path))
    ) {
      try {
        const authResponse = await handleAuthentication(request, pathname);
        if (authResponse) {
          return authResponse;
        }
      } catch (error) {
        console.error('Authentication error:', error);
        // Redirect to login on auth error
        return applySecurityHeaders(NextResponse.redirect(new URL('/login', request.url)));
      }
    }

    // Default response with security headers
    return applySecurityHeaders(NextResponse.next());
    
  } catch (error) {
    console.error('Middleware error:', error);
    // Return a basic response with security headers in case of error
    return applySecurityHeaders(NextResponse.next());
  }
}

// Separate function to handle domain routing
async function handleDomainRouting(request: NextRequest, hostname: string, pathname: string) {
  // Admin subdomain handling
  if (hostname === 'admin.avitoluxury.in') {
    // For admin login page, allow access
    if (pathname === '/admin/login') {
      return applySecurityHeaders(NextResponse.next());
    }
    
    // Redirect root path to admin login or dashboard based on authentication
    if (pathname === '/' || pathname === '') {
      try {
        const session = await getSessionFromRequest(request);
        if (session && session.role === 'admin') {
          return applySecurityHeaders(NextResponse.redirect(new URL('/admin/dashboard', request.url)));
        } else {
          return applySecurityHeaders(NextResponse.redirect(new URL('/admin/login', request.url)));
        }
      } catch (error) {
        return applySecurityHeaders(NextResponse.redirect(new URL('/admin/login', request.url)));
      }
    }
    
    // Block access to store routes on admin subdomain
    if (pathname.startsWith('/store-routes')) {
      return applySecurityHeaders(
        NextResponse.redirect(new URL(`https://avitoluxury.in${pathname}`, request.url))
      );
    }
    
    // For all other admin paths, require admin authentication
    if (pathname.startsWith('/admin')) {
      try {
        const session = await getSessionFromRequest(request);
        if (!session || session.role !== 'admin') {
          return applySecurityHeaders(NextResponse.redirect(new URL('/admin/login', request.url)));
        }
      } catch (error) {
        return applySecurityHeaders(NextResponse.redirect(new URL('/admin/login', request.url)));
      }
    }
    
    // Redirect non-admin paths to main domain
    if (!pathname.startsWith('/admin') && !pathname.startsWith('/_next')) {
      return applySecurityHeaders(
        NextResponse.redirect(new URL(`https://avitoluxury.in${pathname}`, request.url))
      );
    }
  } 
  // Main domain handling
  else if (hostname === 'avitoluxury.in' || hostname === 'www.avitoluxury.in') {
    // Redirect admin paths to admin subdomain
    if (pathname.startsWith('/admin')) {
      return applySecurityHeaders(
        NextResponse.redirect(new URL(`https://admin.avitoluxury.in${pathname}`, request.url))
      );
    }
    
    // Redirect root path to store
    if (pathname === '/' || pathname === '') {
      return applySecurityHeaders(
        NextResponse.redirect(new URL('/store-routes/store', request.url))
      );
    }
  }
  
  // Handle www to non-www redirect if needed
  if (hostname === 'www.avitoluxury.in') {
    return applySecurityHeaders(
      NextResponse.redirect(new URL(`https://avitoluxury.in${pathname}`, request.url))
    );
  }

  return null; // No domain-specific handling needed
}

// Separate function to handle authentication
async function handleAuthentication(request: NextRequest, pathname: string) {
  const session = await getSessionFromRequest(request);

  // Check if the path is admin-only
  const isAdminPath = pathname.startsWith(adminBasePath);

  // Check if the path is protected
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

  // If path is admin-only and user is not an admin, redirect to admin login
  if (isAdminPath && (!session || session.role !== 'admin')) {
    return applySecurityHeaders(NextResponse.redirect(new URL('/admin/login', request.url)));
  }

  // If path is protected and user is not authenticated, redirect to login
  if (isProtectedPath && !session) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return applySecurityHeaders(NextResponse.redirect(url));
  }

  return null; // No authentication redirect needed
}

// Helper function to get session from request with timeout
async function getSessionFromRequest(request: NextRequest) {
  try {
    // First try to get token from cookie - check both admin_token and regular token
    const adminToken = request.cookies.get('admin_token')?.value;
    const regularToken = request.cookies.get('token')?.value;
    const token = adminToken || regularToken;
    
    // If no token in cookie, check authorization header
    const authToken = token || request.headers.get('authorization')?.split(' ')[1] || null;
    
    // If no token found, return null
    if (!authToken) {
      return null;
    }
    
    // Decrypt and verify the token with timeout
    const payload = await Promise.race([
      decrypt(authToken),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Token verification timeout')), 3000)
      )
    ]);
    
    if (!payload) {
      return null;
    }
    
    // Return user info from payload
    return {
      userId: payload.userId,
      email: payload.email,
      name: payload.name,
      role: payload.role
    };
  } catch (error) {
    // Log error in development for debugging
    if (process.env.NODE_ENV === 'development') {
      console.error('Session verification error:', error);
    }
    return null;
  }
}

// Helper function to apply security headers to any response
function applySecurityHeaders(response: NextResponse) {
  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), camera=()');
  
  // Add Content-Security-Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com; " +
    "connect-src 'self' https://*.cloudinary.com https://*.razorpay.com; " +
    "img-src 'self' data: blob: https://*.cloudinary.com https://placehold.co https://storage.googleapis.com; " +
    "style-src 'self' 'unsafe-inline'; " +
    "font-src 'self' data:; " +
    "frame-src 'self' https://checkout.razorpay.com; " +
    "object-src 'none'; " +
    "base-uri 'self';"
  );

  return response;
}

// Define which paths this middleware should run on
export const config = {
  matcher: [
    // Apply to all routes except API routes and static files
    '/((?!api|_next/static|_next/image|_next/webpack|favicon.ico).*)',
  ],
};