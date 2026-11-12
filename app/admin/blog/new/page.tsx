import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-utils'
import PageHeader from '@/components/admin/PageHeader'
import PostEditor from '../PostEditor'

export default async function NewPostPage() {
  const session = await requireAuth()

  const [categories, tags] = await Promise.all([
    prisma.postCategory.findMany({ orderBy: { name: 'asc' } }),
    prisma.postTag.findMany({ orderBy: { name: 'asc' } }),
  ])

  return (
    <div>
      <PageHeader
        title="New Post"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Blog', href: '/admin/blog' },
          { label: 'New Post' },
        ]}
      />
      <PostEditor
        allCategories={categories}
        allTags={tags}
        siteUrl={process.env.NEXT_PUBLIC_SITE_URL ?? ''}
        authorName={session.user.name}
      />
    </div>
  )
}
