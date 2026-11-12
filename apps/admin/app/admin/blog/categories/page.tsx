import { prisma } from '@/lib/prisma'
import { requireAuth, requireRole } from '@/lib/auth-utils'
import PageHeader from '@/components/admin/PageHeader'
import CategoriesClient from './CategoriesClient'

export default async function CategoriesPage() {
  const session = await requireAuth()
  await requireRole(session, 'ADMIN')

  const [categories, tags] = await Promise.all([
    prisma.postCategory.findMany({ orderBy: { name: 'asc' } }),
    prisma.postTag.findMany({ orderBy: { name: 'asc' } }),
  ])

  return (
    <div>
      <PageHeader
        title="Categories & Tags"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Blog', href: '/admin/blog' },
          { label: 'Categories & Tags' },
        ]}
      />
      <CategoriesClient categories={categories} tags={tags} />
    </div>
  )
}
