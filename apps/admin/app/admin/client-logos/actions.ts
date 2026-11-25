'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { requireAuth, requireRole } from '@/lib/auth-utils'
import { revalidateWebApp } from '@/lib/revalidate-web'
import { mediaFirstImage, parseMediaBlock } from '@onefocus/shared/media'
import { z } from 'zod'

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

const PartnerSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1).max(255),
  logo: z.string().trim().min(1),
  website: z.string().trim().url().optional().nullable(),
  sortOrder: z.number().int().min(0).max(9999).default(0),
  isActive: z.boolean().default(true),
})

async function requireAdmin() {
  const session = await requireAuth()
  await requireRole(session, 'ADMIN')
}

async function revalidateClientLogos() {
  revalidatePath('/admin/client-logos')
  await revalidateWebApp(['/', '/sitemap.xml'])
}

export async function savePartner(raw: unknown): Promise<ActionResult<{ id: string }>> {
  await requireAdmin()
  const parsed = PartnerSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? 'Invalid client logo' }
  }

  const data = parsed.data
  const logo = mediaFirstImage(parseMediaBlock(data.logo, '', data.name))
  if (!logo) {
    return { success: false, error: 'Choose a logo image' }
  }

  const shared = {
    name: data.name,
    logo,
    website: data.website?.trim() || null,
    sortOrder: data.sortOrder,
    isActive: data.isActive,
  }

  try {
    const partner = data.id
      ? await prisma.partner.update({
          where: { id: data.id },
          data: shared,
          select: { id: true },
        })
      : await prisma.partner.create({
          data: shared,
          select: { id: true },
        })
    await revalidateClientLogos()
    return { success: true, data: { id: partner.id } }
  } catch (err) {
    console.error('savePartner error:', err)
    return { success: false, error: 'Failed to save client logo' }
  }
}

export async function deletePartner(id: string): Promise<ActionResult> {
  await requireAdmin()
  try {
    await prisma.partner.delete({ where: { id } })
    await revalidateClientLogos()
    return { success: true, data: undefined }
  } catch (err) {
    console.error('deletePartner error:', err)
    return { success: false, error: 'Failed to delete client logo' }
  }
}
