import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

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

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        ip: { label: 'IP', type: 'text' },
      },
      authorize: async (credentials) => {
        const ip = (credentials?.ip as string) || '127.0.0.1'

        // Rate limit check
        const rateCheck = checkRateLimit(ip)
        if (rateCheck.blocked) {
          throw new Error(rateCheck.message || 'Too many attempts.')
        }

        const email = credentials?.email as string
        const password = credentials?.password as string

        if (!email || !password) {
          recordFailedAttempt(ip)
          return null
        }

        const user = await prisma.adminUser.findUnique({
          where: { email, isActive: true },
        })

        if (!user) {
          recordFailedAttempt(ip)
          return null
        }

        const valid = await bcrypt.compare(password, user.hashedPassword)
        if (!valid) {
          recordFailedAttempt(ip)
          return null
        }

        // Update last login time
        await prisma.adminUser.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        })

        clearAttempts(ip)
        return { id: user.id, name: user.name, email: user.email, role: user.role }
      },
    }),
  ],
  session: { strategy: 'jwt', maxAge: 8 * 60 * 60 },
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id as string
        token.role = user.role
      }
      return token
    },
    session: ({ session, token }) => {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: '/admin/login',
  },
})