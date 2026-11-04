/**
 * Shared Prisma Client for ONEFOCUS AFRICA Monorepo
 * 
 * This singleton instance ensures a single PrismaClient connection
 * is shared across the monorepo (web + admin apps).
 * 
 * Usage:
 *   import { prisma } from '@onefocus/database'
 *   const users = await prisma.adminUser.findMany()
 */

import { PrismaClient } from '@prisma/client'

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Configure logging based on environment
const logConfig =
  process.env.NODE_ENV === 'development'
    ? ['query', 'error', 'warn'] as const
    : ['error'] as const

// Create singleton Prisma Client instance
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: logConfig,
  })

// In development, save to global to prevent hot-reload issues
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Re-export all Prisma types for convenience
export * from '@prisma/client'

// Export type-only exports
export type { Prisma } from '@prisma/client'