'use server'

import { revalidatePath } from 'next/cache'
import { parseMediaBlock, serializeMediaBlock, slotForKey } from '@onefocus/shared'
import { prisma } from '@/lib/prisma'
import { requireAuth, requireRole } from '@/lib/auth-utils'
import { revalidateWebApp } from '@/lib/revalidate-web'

function webPathsForSlot(slotKey: string): string[] {
  const paths = new Set<string>(['/'])

  if (slotKey.startsWith('about.')) paths.add('/about')
  if (slotKey.startsWith('work.')) paths.add('/work')
  if (slotKey.startsWith('solutions.')) paths.add('/solutions')
  if (slotKey.startsWith('talent.')) paths.add('/talent')
  if (slotKey.startsWith('contact.')) paths.add('/contact')
  if (slotKey.startsWith('blog.')) paths.add('/blog')

  return [...paths]
}

async function revalidateSlot(slotKey: string) {
  revalidatePath('/admin/cms')
  const paths = webPathsForSlot(slotKey)
  for (const path of paths) revalidatePath(path)
  void revalidateWebApp(paths)
}

export async function saveSiteMedia(
  slotKey: string,
  raw: string
): Promise<{ success: boolean; error?: string }> {
  const session = await requireAuth()
  await requireRole(session, 'ADMIN')

  const slot = slotForKey(slotKey)
  if (!slot) return { success: false, error: 'Unknown media slot' }

  const block = parseMediaBlock(raw, slot.defaultUrl, slot.defaultAlt)

  try {
    await prisma.siteContent.upsert({
      where: { section_key: { section: 'media', key: slotKey } },
      update: { value: serializeMediaBlock(block), updatedById: session.user.id },
      create: { section: 'media', key: slotKey, value: serializeMediaBlock(block), updatedById: session.user.id },
    })
    await revalidateSlot(slotKey)
    return { success: true }
  } catch (error) {
    console.error(`saveSiteMedia(${slotKey}) error:`, error)
    return { success: false, error: 'Could not save media' }
  }
}

export async function resetSiteMedia(
  slotKey: string
): Promise<{ success: boolean; error?: string }> {
  const session = await requireAuth()
  await requireRole(session, 'ADMIN')

  if (!slotForKey(slotKey)) return { success: false, error: 'Unknown media slot' }

  try {
    await prisma.siteContent.deleteMany({ where: { section: 'media', key: slotKey } })
    await revalidateSlot(slotKey)
    return { success: true }
  } catch (error) {
    console.error(`resetSiteMedia(${slotKey}) error:`, error)
    return { success: false, error: 'Could not reset media' }
  }
}
