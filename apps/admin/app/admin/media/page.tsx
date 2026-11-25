import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-utils'
import PageHeader from '@/components/admin/PageHeader'
import MediaGrid from '@/components/admin/MediaGrid'
import MediaUploader from '@/components/admin/MediaUploader'

export default async function MediaLibraryPage() {
  await requireAuth()

  const assets = await prisma.mediaAsset.findMany({
    orderBy: { createdAt: 'desc' },
    include: { uploadedBy: { select: { name: true } } },
  })

  return (
    <div>
      <PageHeader
        title="Uploaded files"
        description="Files stored for reuse. Uploading here alone does not change any page; pick a file in Site images or a blog post."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Uploaded files' }]}
      />

      {/* Upload area */}
      <MediaUploader />

      {/* Stats bar */}
      <div className="mb-6 flex items-center gap-4 text-sm text-gray-500">
        <span>{assets.length} file{assets.length !== 1 ? 's' : ''} uploaded</span>
        {assets.length > 0 && (
          <span>
            {(assets.reduce((sum, a) => sum + a.size, 0) / (1024 * 1024)).toFixed(1)} MB total
          </span>
        )}
      </div>

      {/* Grid */}
      <MediaGrid mode="library" assets={assets} />
    </div>
  )
}
