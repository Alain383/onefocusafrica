import { prisma } from '@/lib/prisma'
import { requireAuth, requireRole } from '@/lib/auth-utils'
import PageHeader from '@/components/admin/PageHeader'
import ContentEditor from './ContentEditor'

export default async function ContentPage() {
  const session = await requireAuth()
  await requireRole(session, 'ADMIN')

  const contents = await prisma.siteContent.findMany({
    orderBy: [{ section: 'asc' }, { key: 'asc' }],
  })

  return (
    <div>
      <PageHeader
        title="Website Content"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Content' },
        ]}
      />
      <ContentEditor contents={contents} />
    </div>
  )
}
