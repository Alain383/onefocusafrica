import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import type { Session } from 'next-auth'
import type { JWT } from 'next-auth/jwt'

// In-memory rate limiter (suitable for single-instance deployments)
const loginAttempts = new Map<string, { count: number; firstAttempt: number }>()
const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000 // 15 minutes

function checkRateLimit(ip: string): { blocked: boolean; message?: string } {
  const now = Date.now()
  const entry = loginAttempts.get(ip)

  if (entry) {
    const elapsed = now - entry.firstAttempt
    if (elapsed > WINDOW_MS) {
      // Window expired - reset
      loginAttempts.delete(ip)
    } else if (entry.count >= MAX_ATTEMPTS) {
      const remaining = Math.ceil((WINDOW_MS - elapsed) / 60000)
      return {
        blocked: true,
        message: `Too many attempts. Try again in ${remaining} minute(s).`,
      }
    }
  }
  return { blocked: false }
}

function recordFailedAttempt(ip: string) {
  const now = Date.now()
  const entry = loginAttempts.get(ip)
  if (!entry || now - entry.firstAttempt > WINDOW_MS) {
    loginAttempts.set(ip, { count: 1, firstAttempt: now })
  } else {
    entry.count++
  }
}

function clearAttempts(ip: string) {
  loginAttempts.delete(ip)
}

const nextAuthResult = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        ip: { label: 'IP', type: 'text' },
      },
      authorize: async (credentials) => {
        try {
          console.log('[AUTH] Login attempt started')
          console.log('[AUTH] Credentials:', credentials?.email)
          
          const ip = (credentials?.ip as string) || '127.0.0.1'

          // Rate limit check
          const rateCheck = checkRateLimit(ip)
          if (rateCheck.blocked) {
            throw new Error(rateCheck.message || 'Too many attempts.')
          }

          const email = credentials?.email as string
          const password = credentials?.password as string

          if (!email || !password) {
            console.log('[AUTH] Missing email or password')
            recordFailedAttempt(ip)
            return null
          }

          console.log('[AUTH] Querying database for user:', email)
          const user = await prisma.adminUser.findUnique({
            where: { email, isActive: true },
          })

          console.log('[AUTH] User found in DB:', !!user)
          if (!user) {
            console.log('[AUTH] User not found or inactive')
            recordFailedAttempt(ip)
            return null
          }

          console.log('[AUTH] Comparing passwords...')
          const valid = await bcrypt.compare(password, user.hashedPassword)
          console.log('[AUTH] Password valid:', valid)
          
          if (!valid) {
            console.log('[AUTH] Password comparison failed')
            recordFailedAttempt(ip)
            return null
          }

          // Update last login time
          await prisma.adminUser.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
          })

          clearAttempts(ip)
          console.log('[AUTH] Login successful for:', email)
          return { id: user.id, name: user.name, email: user.email, role: user.role }
        } catch (error) {
          console.error('[AUTH] Error during authorization:', error)
          throw error
        }
      },
    }),
  ],
  session: { strategy: 'jwt', maxAge: 8 * 60 * 60 },
  callbacks: {
    jwt: ({ token, user }): JWT => {
      if (user) {
        token.id = user.id as string
        token.role = user.role
      }
      return token
    },
    session: ({ session, token }): Session => {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/login',
  },
})

export default nextAuthResult