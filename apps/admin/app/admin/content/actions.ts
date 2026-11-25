'use server'

import { revalidatePath } from 'next/cache'
import { PAGE_TEXT_GROUPS } from '@onefocus/shared/page-text'
import { prisma } from '@/lib/prisma'
import { requireAuth, requireRole } from '@/lib/auth-utils'
import { revalidateWebApp } from '@/lib/revalidate-web'
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

const PageTextSchema = z.object({
  groupId: z.string().min(1),
  values: z.array(
    z.object({
      section: z.string().min(1),
      key: z.string().min(1),
      value: z.string(),
    })
  ),
})

export async function savePageTextGroup(rawData: unknown): Promise<ActionResult> {
  const session = await requireAuth()
  await requireRole(session, 'ADMIN')

  const parsed = PageTextSchema.safeParse(rawData)
  if (!parsed.success) return { success: false, error: 'Invalid data' }

  const group = PAGE_TEXT_GROUPS.find((item) => item.id === parsed.data.groupId)
  if (!group) return { success: false, error: 'Unknown content group' }

  const allowed = new Set(group.fields.map((field) => `${field.section}:${field.key}`))
  const entries = parsed.data.values.filter((item) => allowed.has(`${item.section}:${item.key}`))

  try {
    await Promise.all(
      entries.map((item) =>
        prisma.siteContent.upsert({
          where: { section_key: { section: item.section, key: item.key } },
          create: { section: item.section, key: item.key, value: item.value, updatedById: session.user.id },
          update: { value: item.value, updatedById: session.user.id },
        })
      )
    )
    revalidatePath('/admin/content')
    await revalidateWebApp(group.paths)
    return { success: true, data: undefined }
  } catch (err) {
    console.error('savePageTextGroup error:', err)
    return { success: false, error: 'Failed to save content' }
  }
}
