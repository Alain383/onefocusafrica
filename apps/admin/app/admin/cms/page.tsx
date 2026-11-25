import { prisma } from '@/lib/prisma'
import { requireAuth, requireRole } from '@/lib/auth-utils'
import PageHeader from '@/components/admin/PageHeader'
import MediaTab from './MediaTab'

export default async function CmsPage() {
  const session = await requireAuth()
  await requireRole(session, 'ADMIN')

  const mediaRows = await prisma.siteContent.findMany({
    where: { section: 'media' },
    select: { key: true, value: true },
  })

  const mediaValues = Object.fromEntries(mediaRows.map((row) => [row.key, row.value]))

  return (
    <div>
      <PageHeader
        title="Site images"
        description="Choose the image, video or slideshow shown in each area of the public website. Save to update the live page."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Site images' },
        ]}
      />
      <MediaTab values={mediaValues} />
    </div>
  )
}
