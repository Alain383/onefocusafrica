import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { Prisma } from '@prisma/client'
import Image from 'next/image'

const PAGE_SIZE = 9

export const metadata: Metadata = {  
  title: 'Blog & Insights | ONEFOCUS AFRICA',  
  description: 'Insights, articles, and updates from ONEFOCUS AFRICA.',
}

interface PageProps {
  searchParams: Promise<{ page?: string; category?: string; q?: string }>
}

// Function to estimate reading time
function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

export default async function BlogListingPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(params.page ?? '1')
  const skip = (page - 1) * PAGE_SIZE

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
        content: true,
        categories: { select: { name: true, slug: true } },
      },
    }),
    prisma.postCategory.findMany({ orderBy: { name: 'asc' }, select: { name: true, slug: true } }),
  ])

  const filteredPosts = params.q
    ? allPosts.filter(post => post.title.toLowerCase().includes(params.q!.toLowerCase()))
    : allPosts

  const total = filteredPosts.length
  const posts = filteredPosts.slice(skip, skip + PAGE_SIZE)
  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <main className="bg-[#FAFBFC] min-h-screen">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 
                className="text-5xl lg:text-6xl font-bold text-[#0F172A] mb-6 leading-tight" 
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Our Blog & Insight
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                We delve into the world of business growth, exploring the latest trends, strategies, and best practices that drive successful operations across Africa.
              </p>
            </div>
            <div className="hidden lg:flex justify-center">
              <div className="w-80 h-80 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-48 h-48 text-[#1F99ED]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        {/* Category Filter */}
        <div className="flex flex-wrap items-center gap-3 mb-12">
          <Link
            href="/blog"
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
              !params.category 
                ? 'bg-[#1F99ED] text-white shadow-md' 
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/blog?category=${cat.slug}`}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                params.category === cat.slug 
                  ? 'bg-[#1F99ED] text-white shadow-md' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-400">No posts found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {posts.map((post, index) => {
              const colors = [
                { accent: 'bg-orange-400', gradient: 'from-orange-50 to-orange-100' },
                { accent: 'bg-teal-400', gradient: 'from-teal-50 to-teal-100' },
                { accent: 'bg-purple-400', gradient: 'from-purple-50 to-purple-100' },
                { accent: 'bg-pink-400', gradient: 'from-pink-50 to-pink-100' },
                { accent: 'bg-blue-400', gradient: 'from-blue-50 to-blue-100' },
                { accent: 'bg-green-400', gradient: 'from-green-50 to-green-100' },
              ]
              const colorScheme = colors[index % colors.length]
              const readingTime = estimateReadingTime(post.content)

              return (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                  <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                    {/* Image with colored accent */}
                    <div className="relative h-56 overflow-hidden">
                      {post.coverImage ? (
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${colorScheme.gradient}`} />
                      )}
                      <div className={`absolute top-0 left-0 w-20 h-20 ${colorScheme.accent} rounded-br-[80px] opacity-90`} />
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      {/* Category Badge */}
                      {post.categories.length > 0 && (
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
                          {post.categories[0].name}
                        </span>
                      )}

                      {/* Meta */}
                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                        <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}</span>
                        <span>·</span>
                        <span>{readingTime} min read</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-[#0F172A] mb-3 leading-tight group-hover:text-[#1F99ED] transition-colors line-clamp-2" style={{ fontFamily: 'var(--font-heading)' }}>
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      {post.excerpt && (
                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 flex-grow mb-4">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                  </article>
                </Link>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3">
            {page > 1 && (
              <Link
                href={`/blog?page=${page - 1}${params.category ? `&category=${params.category}` : ''}`}
                className="px-6 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all"
              >
                Previous
              </Link>
            )}
            <span className="px-4 py-2 text-sm font-medium text-gray-600">
              Page {page} of {totalPages}
            </span>
            {page < totalPages && (
              <Link
                href={`/blog?page=${page + 1}${params.category ? `&category=${params.category}` : ''}`}
                className="px-6 py-2.5 rounded-lg bg-[#1F99ED] text-white font-medium hover:bg-[#1a87d4] transition-all"
              >
                Next
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  )
}