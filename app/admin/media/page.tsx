import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-utils'
import PageHeader from '@/components/admin/PageHeader'
import MediaGrid from '@/components/admin/MediaGrid'

export default async function MediaLibraryPage() {
  await requireAuth()

  const assets = await prisma.mediaAsset.findMany({
    orderBy: { createdAt: 'desc' },
    include: { uploadedBy: { select: { name: true } } },
  })

  return (
    <div>
      <PageHeader
        title="Media Library"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Media' }]}
      />
      <MediaGrid mode="library" assets={assets} />
    </div>
  )
}
