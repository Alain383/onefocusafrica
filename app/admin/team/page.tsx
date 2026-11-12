import { prisma } from '@/lib/prisma'
import { requireAuth, requireRole } from '@/lib/auth-utils'
import PageHeader from '@/components/admin/PageHeader'
import TeamClient from './TeamClient'

export default async function TeamPage() {
  const session = await requireAuth()
  await requireRole(session, 'ADMIN')

  const [adminUsers, teamMembers] = await Promise.all([
    prisma.adminUser.findMany({ orderBy: { createdAt: 'asc' }, select: { id: true, name: true, email: true, role: true, isActive: true, lastLoginAt: true } }),
    prisma.teamMember.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] }),
  ])

  return (
    <div>
      <PageHeader title="Team & Admin Users" breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Team' }]} />
      <TeamClient adminUsers={adminUsers} teamMembers={teamMembers} currentUserId={session.user.id} />
    </div>
  )
}
