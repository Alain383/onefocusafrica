'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-utils'
import { generateSlug } from '@/lib/slug'
import { z } from 'zod'

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

/**
 * Ensures the slug is unique among CaseStudy records.
 * Appends -2, -3, … until a free slug is found.
 */
async function ensureUniqueCaseStudySlug(
  baseSlug: string,
  excludeId?: string
): Promise<string> {
  const existing = await prisma.caseStudy.findFirst({
    where: {
      slug: baseSlug,
      NOT: excludeId ? { id: excludeId } : undefined,
    },
    select: { id: true },
  })

  if (!existing) return baseSlug

  let counter = 2
  while (true) {
    const candidate = `${baseSlug}-${counter}`
    const conflict = await prisma.caseStudy.findFirst({
      where: {
        slug: candidate,
        NOT: excludeId ? { id: excludeId } : undefined,
      },
      select: { id: true },
    })
    if (!conflict) return candidate
    counter++
  }
}

const CaseStudySchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  slug: z.string().optional(),
  category: z.string().min(1),
  clientName: z.string().optional().nullable(),
  challenge: z.string().min(1),
  solution: z.string().min(1),
  outcome: z.string().min(1),
  deliverables: z.array(z.string()).default([]),
  publishedAssets: z.array(z.string()).default([]),
  isPublished: z.boolean().default(false),
})

export async function saveCaseStudy(
  rawData: unknown
): Promise<ActionResult<{ id: string; slug: string }>> {
  await requireAuth()

  const parsed = CaseStudySchema.safeParse(rawData)
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message ?? 'Invalid data',
    }
  }

  const data = parsed.data
  const baseSlug = data.slug?.trim() || generateSlug(data.title)
  const finalSlug = await ensureUniqueCaseStudySlug(baseSlug, data.id)

  try {
    const cs = await prisma.caseStudy.upsert({
      where: { id: data.id ?? '__new__' },
      create: {
        title: data.title,
        slug: finalSlug,
        category: data.category,
        clientName: data.clientName ?? null,
        challenge: data.challenge,
        solution: data.solution,
        outcome: data.outcome,
        deliverables: JSON.stringify(data.deliverables),
        publishedAssets: JSON.stringify(data.publishedAssets),
        isPublished: data.isPublished,
        publishedAt: data.isPublished ? new Date() : null,
      },
      update: {
        title: data.title,
        slug: finalSlug,
        category: data.category,
        clientName: data.clientName ?? null,
        challenge: data.challenge,
        solution: data.solution,
        outcome: data.outcome,
        deliverables: JSON.stringify(data.deliverables),
        publishedAssets: JSON.stringify(data.publishedAssets),
        isPublished: data.isPublished,
        publishedAt: data.isPublished ? new Date() : undefined,
      },
      select: { id: true, slug: true },
    })
    revalidatePath('/admin/portfolio')
    revalidatePath('/work')
    return { success: true, data: { id: cs.id, slug: cs.slug } }
  } catch (err) {
    console.error('saveCaseStudy error:', err)
    return { success: false, error: 'Failed to save case study' }
  }
}

export async function deleteCaseStudy(id: string): Promise<ActionResult> {
  await requireAuth()
  try {
    await prisma.caseStudy.delete({ where: { id } })
    revalidatePath('/admin/portfolio')
    revalidatePath('/work')
    return { success: true, data: undefined }
  } catch (err) {
    console.error('deleteCaseStudy error:', err)
    return { success: false, error: 'Failed to delete case study' }
  }
}