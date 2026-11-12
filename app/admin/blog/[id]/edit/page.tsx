import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-utils'
import PageHeader from '@/components/admin/PageHeader'
import PostEditor from '../../PostEditor'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditPostPage({ params }: Props) {
  const { id } = await params
  const session = await requireAuth()

  const [post, categories, tags] = await Promise.all([
    prisma.post.findUnique({
      where: { id },
      include: {
        categories: { select: { id: true, name: true } },
        tags: { select: { id: true, name: true } },
      },
    }),
    prisma.postCategory.findMany({ orderBy: { name: 'asc' } }),
    prisma.postTag.findMany({ orderBy: { name: 'asc' } }),
  ])

  if (!post) notFound()

  return (
    <div>
      <PageHeader
        title="Edit Post"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Blog', href: '/admin/blog' },
          { label: 'Edit Post' },
        ]}
      />
      <PostEditor
        post={{
          ...post,
          excerpt: post.excerpt,
          coverImage: post.coverImage,
          seoTitle: post.seoTitle,
          seoDescription: post.seoDescription,
          scheduledAt: post.scheduledAt,
          categories: post.categories,
          tags: post.tags,
        }}
        allCategories={categories}
        allTags={tags}
        siteUrl={process.env.NEXT_PUBLIC_SITE_URL ?? ''}
        authorName={session.user.name}
      />
    </div>
  )
}
