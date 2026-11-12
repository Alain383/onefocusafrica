import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-utils'
import PageHeader from '@/components/admin/PageHeader'
import ProgramsClient from './ProgramsClient'

export default async function ProgramsPage() {
  await requireAuth()

  const programs = await prisma.program.findMany({
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      title: true,
      description: true,
      icon: true,
      status: true,
      urlAnchor: true,
    },
  })

  // Convert enum values to strings for the client
  const serializedPrograms = programs.map(p => ({
    ...p,
    status: p.status as string,
  }))

  return (
    <div>
      <PageHeader
        title="Programs"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Programs' },
        ]}
      />
      <ProgramsClient programs={serializedPrograms} />
    </div>
  )
}
