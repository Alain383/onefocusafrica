import PageHeader from '@/components/admin/PageHeader'
import { prisma } from '@/lib/prisma'
import { requireAuth, requireRole } from '@/lib/auth-utils'
import ClientLogosClient from './ClientLogosClient'

export default async function ClientLogosPage() {
  const session = await requireAuth()
  await requireRole(session, 'ADMIN')

  const items = await prisma.partner.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  })

  return (
    <div>
      <PageHeader
        title="Client logos"
        description="Logos of teams and clients we have worked with. Active logos appear in the home page marquee above The Problem."
        breadcrumbs={[{ label: 'Content studio' }, { label: 'Client logos' }]}
        action={
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            View home page
          </a>
        }
      />
      <ClientLogosClient items={items} />
    </div>
  )
}
