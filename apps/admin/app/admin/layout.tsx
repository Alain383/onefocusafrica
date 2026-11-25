import { requireAuth } from '@/lib/auth-utils'
import AdminShell from '@/components/admin/AdminShell'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await requireAuth()

  const userName = session.user?.name ?? 'Admin User'
  const userRole = (session.user?.role as 'ADMIN' | 'EDITOR') ?? 'ADMIN'

  return (
    <AdminShell userName={userName} role={userRole}>
      {children}
    </AdminShell>
  )
}
