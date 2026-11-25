import { prisma } from '@/lib/prisma'
import { requireAuth, requireRole } from '@/lib/auth-utils'
import PageHeader from '@/components/admin/PageHeader'
import TeamClient from './TeamClient'

export default async function TeamPage() {
  const session = await requireAuth()
  await requireRole(session, 'ADMIN')

  const adminUsers = await prisma.adminUser.findMany({
    orderBy: { createdAt: 'asc' },
    select: { id: true, name: true, email: true, role: true, isActive: true, lastLoginAt: true },
  })

  return (
    <div>
      <PageHeader
        title="Admin users & access"
        description="Manage who can sign in to this admin. This does not change the About page team section."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Admin users' }]}
      />
      <TeamClient adminUsers={adminUsers} currentUserId={session.user.id} />
    </div>
  )
}
