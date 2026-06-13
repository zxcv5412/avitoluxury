/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Enable type checking during build
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Disable source maps in production to reduce bundle size
  productionBrowserSourceMaps: false,
  // Add environment variables that are safe to expose to the client
  // Do NOT include sensitive information here - use .env.local for those
  env: {
    GOOGLE_STORAGE_BUCKET_NAME: process.env.GOOGLE_STORAGE_BUCKET_NAME || 'ecommerce-app-444531.appspot.com',
    GOOGLE_STORAGE_PROJECT_ID: process.env.GOOGLE_STORAGE_PROJECT_ID || 'ecommerce-app-444531',
    // Removed sensitive information - these should be loaded from .env.local only
  },
  output: 'standalone',
  // Add experimental features to improve compatibility with Vercel deployments
  experimental: {
    optimizePackageImports: ['react-icons'],
    optimizeCss: true,
  },
  serverExternalPackages: [],
  // Turbopack configuration (empty to silence warning)
  turbopack: {},
  async redirects() {
    const redirects = [
      {
        source: '/store-routes/store',
        destination: '/',
        permanent: true,
      },
      {
        source: '/store-routes/product/:path*',
        destination: '/product/:path*',
        permanent: true,
      },
      {
        source: '/store-routes',
        destination: '/',
        permanent: true,
      },
      {
        source: '/store',
        destination: '/',
        permanent: true,
      },
      {
        source: '/store/:path*',
        destination: '/',
        permanent: true,
      },
    ];
    
    return redirects;
  },
  // Domain configuration
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          }
        ],
      },
    ];
  },
};

module.exports = nextConfig; 