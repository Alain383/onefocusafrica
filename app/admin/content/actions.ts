'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { requireAuth, requireRole } from '@/lib/auth-utils'
import { z } from 'zod'

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

const ContentSchema = z.object({
  section: z.string().min(1),
  key: z.string().min(1),
  value: z.string(),
})

export async function upsertSiteContent(
  rawData: unknown
): Promise<ActionResult<{ id: string }>> {
  const session = await requireAuth()
  await requireRole(session, 'ADMIN')

  const parsed = ContentSchema.safeParse(rawData)
  if (!parsed.success) return { success: false, error: 'Invalid data' }

  const { section, key, value } = parsed.data

  try {
    const record = await prisma.siteContent.upsert({
      where: { section_key: { section, key } },
      create: { section, key, value, updatedById: session.user.id },
      update: { value, updatedById: session.user.id },
      select: { id: true },
    })
    revalidatePath('/admin/content')
    revalidatePath('/')
    return { success: true, data: { id: record.id } }
  } catch (err) {
    console.error('upsertSiteContent error:', err)
    return { success: false, error: 'Failed to save content' }
  }
}
