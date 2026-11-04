import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { Prisma } from '@prisma/client'

const PAGE_SIZE = 12

export const metadata: Metadata = {
  title: 'Blog | ONEFOCUS AFRICA',
  description: 'Insights, articles, and updates from ONEFOCUS AFRICA.',
}

interface PageProps {
  searchParams: Promise<{ page?: string; category?: string; q?: string }>
}

export default async function BlogListingPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(params.page ?? '1')
  const skip = (page - 1) * PAGE_SIZE

  // Build where clause without case-insensitive search (SQLite compatibility)
  const where: Prisma.PostWhereInput = {
    status: 'PUBLISHED',
    ...(params.category ? { categories: { some: { slug: params.category } } } : {}),
  }

  const [allPosts, categories] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        publishedAt: true,
        author: { select: { name: true } },
        categories: { select: { name: true, slug: true } },
      },
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
  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[#101D3A] mb-2">Blog</h1>
      <p className="text-gray-500 mb-8">Insights, articles, and updates from ONEFOCUS AFRICA.</p>

      {/* Category filter */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <Link
            href="/blog"
            className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
              !params.category ? 'bg-[#101D3A] text-white border-[#101D3A]' : 'border-gray-300 text-gray-600 hover:border-[#1F99ED]'
            }`}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/blog?category=${cat.slug}`}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                params.category === cat.slug ? 'bg-[#101D3A] text-white border-[#101D3A]' : 'border-gray-300 text-gray-600 hover:border-[#1F99ED]'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}

      {/* Post grid */}
      {posts.length === 0 ? (
        <p className="text-center text-gray-400 py-16">No posts found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {posts.map((post) => (
            <article key={post.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {post.coverImage && (
                <div className="aspect-video overflow-hidden">
                  <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-5">
                {post.categories.length > 0 && (
                  <span className="text-xs font-medium text-[#1F99ED] uppercase tracking-wide">
                    {post.categories[0].name}
                  </span>
                )}
                <h2 className="text-lg font-bold text-[#101D3A] mt-1 mb-2 line-clamp-2">
                  <Link href={`/blog/${post.slug}`} className="hover:text-[#1F99ED] transition-colors">
                    {post.title}
                  </Link>
                </h2>
                {post.excerpt && (
                  <p className="text-sm text-gray-500 line-clamp-3 mb-3">{post.excerpt}</p>
                )}
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{post.author.name}</span>
                  <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ''}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {page > 1 && (
            <Link
              href={`/blog?page=${page - 1}${params.category ? `&category=${params.category}` : ''}${params.q ? `&q=${params.q}` : ''}`}
              className="px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-50"
            >
              Previous
            </Link>
          )}
          <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
          {page < totalPages && (
            <Link
              href={`/blog?page=${page + 1}${params.category ? `&category=${params.category}` : ''}${params.q ? `&q=${params.q}` : ''}`}
              className="px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-50"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </main>
  )
}
