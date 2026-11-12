'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-utils'
import { generateSlug, ensureUniqueSlug } from '@/lib/slug'
import { sanitizeHtml } from '@/lib/sanitize'
import { z } from 'zod'

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

const PostSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required').max(255),
  slug: z.string().optional(),
  content: z.string().default(''),
  excerpt: z.string().optional().nullable(),
  coverImage: z.string().optional().nullable(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  status: z.enum(['DRAFT', 'REVIEW', 'SCHEDULED', 'PUBLISHED']).default('DRAFT'),
  scheduledAt: z.string().optional().nullable(),
  categoryIds: z.array(z.string()).default([]),
  tagIds: z.array(z.string()).default([]),
})

export async function savePost(
  rawData: unknown
): Promise<ActionResult<{ id: string; slug: string }>> {
  const session = await requireAuth()

  const parsed = PostSchema.safeParse(rawData)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? 'Invalid data' }
  }

  const data = parsed.data
  const isNew = !data.id

  // Generate / ensure unique slug
  const baseSlug = data.slug?.trim() || generateSlug(data.title)
  const finalSlug = await ensureUniqueSlug(baseSlug, data.id)

  // Sanitize HTML content
  const cleanContent = sanitizeHtml(data.content)

  const publishedAt =
    data.status === 'PUBLISHED'
      ? isNew
        ? new Date()
        : undefined // keep existing publishedAt on re-save
      : null

  const scheduledAt = data.status === 'SCHEDULED' && data.scheduledAt
    ? new Date(data.scheduledAt)
    : null

  try {
    const post = await prisma.post.upsert({
      where: { id: data.id ?? '__new__' },
      create: {
        title: data.title,
        slug: finalSlug,
        content: cleanContent,
        excerpt: data.excerpt ?? null,
        coverImage: data.coverImage ?? null,
        seoTitle: data.seoTitle ?? null,
        seoDescription: data.seoDescription ?? null,
        status: data.status,
        scheduledAt,
        publishedAt: data.status === 'PUBLISHED' ? new Date() : null,
        authorId: session.user.id,
        categories: { connect: data.categoryIds.map((id) => ({ id })) },
        tags: { connect: data.tagIds.map((id) => ({ id })) },
      },
      update: {
        title: data.title,
        slug: finalSlug,
        content: cleanContent,
        excerpt: data.excerpt ?? null,
        coverImage: data.coverImage ?? null,
        seoTitle: data.seoTitle ?? null,
        seoDescription: data.seoDescription ?? null,
        status: data.status,
        scheduledAt,
        ...(data.status === 'PUBLISHED' && publishedAt !== undefined ? {} : { publishedAt }),
        categories: { set: data.categoryIds.map((id) => ({ id })) },
        tags: { set: data.tagIds.map((id) => ({ id })) },
      },
      select: { id: true, slug: true },
    })

    // Revalidate public blog pages when publishing
    if (data.status === 'PUBLISHED') {
      revalidatePath('/blog')
      revalidatePath(`/blog/${finalSlug}`)
    }
    revalidatePath('/admin/blog')

    return { success: true, data: { id: post.id, slug: post.slug } }
  } catch (err) {
    console.error('savePost error:', err)
    return { success: false, error: 'Failed to save post. Please try again.' }
  }
}

export async function deletePost(id: string): Promise<ActionResult> {
  const session = await requireAuth()
  void session

  try {
    const post = await prisma.post.findUnique({ where: { id }, select: { slug: true } })
    if (!post) return { success: false, error: 'Post not found' }

    await prisma.post.delete({ where: { id } })

    revalidatePath('/blog')
    revalidatePath(`/blog/${post.slug}`)
    revalidatePath('/admin/blog')

    return { success: true, data: undefined }
  } catch (err) {
    console.error('deletePost error:', err)
    return { success: false, error: 'Failed to delete post.' }
  }
}
