import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Use modern formats: WebP and AVIF (smallest file size, best quality)
    formats: ['image/avif', 'image/webp'],
    // Aggressive caching: 1 year for optimized images
    minimumCacheTTL: 31536000,
    // Responsive breakpoints
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 64, 128, 256, 384, 512, 700],
    remotePatterns: [
      // Vercel Blob Storage (media uploads)
      {
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com',
      },
      // Unsplash images
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // Allow any HTTPS image source for flexibility
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Compress responses
  compress: true,
  // Power-user headers for performance
  async headers() {
    return [
      {
        // Cache static assets aggressively
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache fonts aggressively
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

export default nextConfig
