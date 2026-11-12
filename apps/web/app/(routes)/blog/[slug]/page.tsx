import { prisma } from '@onefocus/database'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

interface Props {
  params: Promise<{ slug: string }>
}

// Function to estimate reading time
function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await prisma.post.findUnique({
    where: { slug, status: 'PUBLISHED' },
    select: { title: true, seoTitle: true, seoDescription: true, excerpt: true, coverImage: true },
  })

  if (!post) return { title: 'Not Found' }

  return {
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt ?? undefined,
    openGraph: {
      title: post.seoTitle ?? post.title,
      description: post.seoDescription ?? post.excerpt ?? undefined,
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
      type: 'article',
    },
  }
}

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    select: { slug: true },
  })
  return posts.map((p) => ({ slug: p.slug }))
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params

  const post = await prisma.post.findUnique({
    where: { slug, status: 'PUBLISHED' },
    include: {
      categories: { select: { name: true, slug: true } },
      tags: { select: { name: true, slug: true } },
    },
  })

  if (!post) notFound()

  const readingTime = estimateReadingTime(post.content)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    datePublished: post.publishedAt?.toISOString(),
    image: post.coverImage,
    description: post.seoDescription ?? post.excerpt,
  }

  return (
    <main className="bg-[#FAFBFC] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb & Back */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-6">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#1F99ED] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        {/* Categories */}
        {post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/blog?category=${cat.slug}`}
                className="px-4 py-1.5 bg-[#EEF6FD] text-[#1F99ED] text-xs font-semibold uppercase tracking-wide rounded-full hover:bg-[#1F99ED] hover:text-white transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 
          className="text-4xl lg:text-5xl font-bold text-[#0F172A] mb-6 leading-tight" 
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-8 pb-8 border-b border-gray-200">
          {post.publishedAt && (
            <span>
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          )}
          <span>·</span>
          <span>{readingTime} min read</span>
        </div>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="relative mb-12 rounded-2xl overflow-hidden aspect-video shadow-lg">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 896px"
              priority
            />
          </div>
        )}

        {/* Article Content */}
        <div
          className="prose prose-lg max-w-none mb-12
            prose-headings:font-bold prose-headings:text-[#0F172A] prose-headings:leading-tight
            prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
            prose-a:text-[#1F99ED] prose-a:font-medium prose-a:no-underline hover:prose-a:underline
            prose-strong:text-[#0F172A] prose-strong:font-semibold
            prose-ul:my-4 prose-ol:my-4
            prose-li:text-gray-700 prose-li:leading-relaxed
            prose-img:rounded-xl prose-img:shadow-md prose-img:my-8
            prose-blockquote:border-l-4 prose-blockquote:border-[#1F99ED] prose-blockquote:bg-[#F8FBFE] prose-blockquote:py-3 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:my-6
            prose-code:text-[#1F99ED] prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-normal"
          dangerouslySetInnerHTML={{ __html: post.content }}
          style={{ fontFamily: 'var(--font-body)' }}
        />

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-12">
            <p className="text-sm font-semibold text-gray-700 mb-3">Tags:</p>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag.slug}
                  className="px-4 py-2 bg-gray-50 text-gray-700 text-sm font-medium rounded-lg border border-gray-200"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Back to Blog CTA */}
        <div className="text-center pt-8 border-t border-gray-200">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1F99ED] text-white text-base font-semibold rounded-lg hover:bg-[#1a87d4] transition-all shadow-md hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to All Articles
          </Link>
        </div>
      </article>
    </main>
  )
}