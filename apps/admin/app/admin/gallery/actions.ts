'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { requireAuth, requireRole } from '@/lib/auth-utils'
import { revalidateWebApp } from '@/lib/revalidate-web'
import { z } from 'zod'

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

const GalleryItemSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().max(255).optional().nullable(),
  description: z.string().trim().optional().nullable(),
  image: z.string().trim().min(1),
  sortOrder: z.number().int().min(0).max(9999).default(0),
  isPublished: z.boolean().default(true),
})

async function requireAdmin() {
  const session = await requireAuth()
  await requireRole(session, 'ADMIN')
}

function revalidateGallery() {
  revalidatePath('/admin/gallery')
  return revalidateWebApp(['/gallery', '/', '/sitemap.xml'])
}

export async function saveGalleryItem(raw: unknown): Promise<ActionResult<{ id: string }>> {
  await requireAdmin()
  const parsed = GalleryItemSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? 'Invalid gallery item' }
  }

  const data = parsed.data
  const shared = {
    title: data.title?.trim() || null,
    description: data.description?.trim() || null,
    image: data.image,
    sortOrder: data.sortOrder,
    isPublished: data.isPublished,
  }

  try {
    const item = data.id
      ? await prisma.galleryItem.update({
          where: { id: data.id },
          data: shared,
          select: { id: true },
        })
      : await prisma.galleryItem.create({
          data: shared,
          select: { id: true },
        })
    await revalidateGallery()
    return { success: true, data: { id: item.id } }
  } catch (err) {
    console.error('saveGalleryItem error:', err)
    return { success: false, error: 'Failed to save gallery item' }
  }
}

export async function deleteGalleryItem(id: string): Promise<ActionResult> {
  await requireAdmin()
  try {
    await prisma.galleryItem.delete({ where: { id } })
    await revalidateGallery()
    return { success: true, data: undefined }
  } catch (err) {
    console.error('deleteGalleryItem error:', err)
    return { success: false, error: 'Failed to delete gallery item' }
  }
}
