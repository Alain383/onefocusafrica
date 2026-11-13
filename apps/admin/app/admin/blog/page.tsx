import { prisma } from '@/lib/prisma'
import PageHeader from '@/components/admin/PageHeader'
import Link from 'next/link'
import BlogFilters from './BlogFilters'
import BlogTable from './BlogTable'
import type { Prisma } from '@onefocus/database'

const PAGE_SIZE = 20

interface PageProps {
  searchParams: Promise<{ status?: string; category?: string; q?: string; page?: string }>
}

export default async function BlogListPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(params.page ?? '1')
  const skip = (page - 1) * PAGE_SIZE

  // Build where clause without case-insensitive search (SQLite compatibility)
  const where: Prisma.PostWhereInput = {
    ...(params.status ? { status: params.status as 'DRAFT' | 'REVIEW' | 'SCHEDULED' | 'PUBLISHED' } : {}),
    ...(params.category ? { categories: { some: { slug: params.category } } } : {}),
  }

  const [allPosts, categories] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { name: true } }, categories: { select: { name: true, slug: true } } },
    }),
    prisma.postCategory.findMany({ orderBy: { name: 'asc' }, select: { name: true, slug: true } }),
  ])

  // Filter by search query in JavaScript (case-insensitive)
  const filteredPosts = params.q
    ? allPosts.filter(post => post.title.toLowerCase().includes(params.q!.toLowerCase()))
    : allPosts

  // Apply pagination
  const total = filteredPosts.length
  const posts = filteredPosts.slice(skip, skip + PAGE_SIZE)

  return (
    <div>
      <PageHeader
        title="Blog & Articles"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Blog' }]}
        action={
          <Link
            href="/admin/blog/new"
            className="bg-[#1F99ED] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1a87d4] transition-colors"
          >
            New Post
          </Link>
        }
      />

      <BlogFilters categories={categories} />
      <BlogTable posts={posts} total={total} page={page} pageSize={PAGE_SIZE} />
    </div>
  )
}
