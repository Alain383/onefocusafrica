'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-utils'
import { revalidateWebApp } from '@/lib/revalidate-web'
import { generateSlug } from '@/lib/slug'
import { z } from 'zod'

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

const CaseStudySchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1),
  category: z.string().min(1),
  clientName: z.string().optional().nullable(),
  challenge: z.string().min(1),
  solution: z.string().min(1),
  outcome: z.string().min(1),
  deliverables: z.array(z.string()).default([]),
  publishedAssets: z.array(z.string()).default([]),
  isPublished: z.boolean().default(false),
})

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  const exists = async (slug: string) =>
    (await prisma.caseStudy.findFirst({
      where: { slug, NOT: excludeId ? { id: excludeId } : undefined },
      select: { id: true },
    })) !== null

  if (!(await exists(base))) return base
  let counter = 2
  while (await exists(`${base}-${counter}`)) counter++
  return `${base}-${counter}`
}

export async function saveCaseStudy(raw: unknown): Promise<ActionResult<{ id: string; slug: string }>> {
  await requireAuth()
  const parsed = CaseStudySchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? 'Invalid data' }
  }

  const data = parsed.data
  const slug = await uniqueSlug(generateSlug(data.title), data.id)
  const shared = {
    title: data.title,
    slug,
    category: data.category,
    clientName: data.clientName || null,
    challenge: data.challenge,
    solution: data.solution,
    outcome: data.outcome,
    deliverables: JSON.stringify(data.deliverables),
    publishedAssets: JSON.stringify(data.publishedAssets),
    isPublished: data.isPublished,
  }

  try {
    const study = data.id
      ? await prisma.caseStudy.update({
          where: { id: data.id },
          data: {
            ...shared,
            publishedAt: data.isPublished ? new Date() : undefined,
          },
          select: { id: true, slug: true },
        })
      : await prisma.caseStudy.create({
          data: { ...shared, publishedAt: data.isPublished ? new Date() : null },
          select: { id: true, slug: true },
        })

    revalidatePath('/admin/case-studies')
    await revalidateWebApp(['/work', '/', '/sitemap.xml', `/work/${study.slug}`])
    return { success: true, data: { id: study.id, slug: study.slug } }
  } catch (err) {
    console.error('saveCaseStudy error:', err)
    return { success: false, error: 'Failed to save case study' }
  }
}

export async function deleteCaseStudy(id: string): Promise<ActionResult> {
  await requireAuth()
  try {
    await prisma.caseStudy.delete({ where: { id } })
    revalidatePath('/admin/case-studies')
    await revalidateWebApp(['/work', '/', '/sitemap.xml'])
    return { success: true, data: undefined }
  } catch (err) {
    console.error('deleteCaseStudy error:', err)
    return { success: false, error: 'Failed to delete case study' }
  }
}
