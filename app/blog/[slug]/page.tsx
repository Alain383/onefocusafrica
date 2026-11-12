import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

interface Props {
  params: Promise<{ slug: string }>
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
      author: { select: { name: true } },
      categories: { select: { name: true, slug: true } },
      tags: { select: { name: true, slug: true } },
    },
  })

  if (!post) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    author: { '@type': 'Person', name: post.author.name },
    datePublished: post.publishedAt?.toISOString(),
    image: post.coverImage,
    description: post.seoDescription ?? post.excerpt,
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-400">
        <Link href="/blog" className="hover:text-[#1F99ED]">Blog</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{post.title}</span>
      </nav>

      {/* Categories */}
      {post.categories.length > 0 && (
        <div className="flex gap-2 mb-3">
          {post.categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/blog?category=${cat.slug}`}
              className="text-xs font-medium text-[#1F99ED] uppercase tracking-wide hover:underline"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}

      <h1 className="text-3xl font-bold text-[#101D3A] mb-4">{post.title}</h1>

      <div className="flex items-center gap-3 text-sm text-gray-500 mb-6">
        <span>By {post.author.name}</span>
        {post.publishedAt && (
          <>
            <span>Â·</span>
            <time dateTime={post.publishedAt.toISOString()}>
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </>
        )}
      </div>

      {post.coverImage && (
        <div className="relative mb-8 rounded-2xl overflow-hidden aspect-video">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill className="object-cover" sizes="(max-width: 768px) 100vw, 768px" priority
          />
        </div>
      )}

      {/* Article content â€” content is already sanitized server-side before storing */}
      <article
        className="prose prose-lg max-w-none text-gray-800 prose-headings:text-[#101D3A] prose-a:text-[#1F99ED]"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-2">Tags:</p>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag.slug}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10">
        <Link href="/blog" className="text-sm text-[#1F99ED] hover:underline">â† Back to Blog</Link>
      </div>
    </main>
  )
}
