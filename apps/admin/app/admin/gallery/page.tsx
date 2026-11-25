import PageHeader from '@/components/admin/PageHeader'
import { prisma } from '@/lib/prisma'
import { requireAuth, requireRole } from '@/lib/auth-utils'
import GalleryClient from './GalleryClient'

export default async function GalleryPage() {
  const session = await requireAuth()
  await requireRole(session, 'ADMIN')

  const items = await prisma.galleryItem.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  })

  return (
    <div>
      <PageHeader
        title="Gallery"
        description="Images shown on the public gallery page. Upload a new image or select one from Uploaded files."
        breadcrumbs={[{ label: 'Content studio' }, { label: 'Gallery' }]}
        action={
          <a
            href="/gallery"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            View /gallery
          </a>
        }
      />
      <GalleryClient items={items} />
    </div>
  )
}
