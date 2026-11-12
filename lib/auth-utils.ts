import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export type AdminSession = {
  user: {
    id: string
    name: string
    email: string
    role: string
  }
}

/**
 * Requires an authenticated session. Redirects to /admin/login if none exists.
 * Returns the current session.
 */
export async function requireAuth(): Promise<AdminSession> {
  const session = await auth()

  if (!session) {
    redirect('/admin/login')
  }

  return session as AdminSession
}

/**
 * Requires the session user to have the specified role.
 * Throws a 403 Response if the role does not match.
 */
export async function requireRole(session: AdminSession, role: 'ADMIN'): Promise<void> {
  if (session.user.role !== role) {
    throw new Response(null, { status: 403 })
  }
}
