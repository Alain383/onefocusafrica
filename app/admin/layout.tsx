import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/admin/Sidebar'
import TopBar from '@/components/admin/TopBar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  // If no session, redirect to login
  if (!session) {
    redirect('/admin/login')
  }

  // Extract user info with defaults
  const userName = session.user?.name ?? 'Admin User'
  const userRole = (session.user?.role as 'ADMIN' | 'EDITOR') ?? 'ADMIN'

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar role={userRole} userName={userName} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar userName={userName} />
        <main className="flex-1 overflow-y-auto p-6" id="main-content">
          {children}
        </main>
      </div>
    </div>
  )
}
