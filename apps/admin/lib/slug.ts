import { prisma } from '@/lib/prisma'

export { generateSlug } from './slug-client'

/**
 * Ensures the given slug is unique among all Post records.
 *
 * If `excludeId` is provided, the post with that id is excluded from the
 * collision check (useful when editing an existing post).
 *
 * When a conflict is found the function tries `${baseSlug}-2`,
 * `${baseSlug}-3`, … until a free slug is found.
 */
export async function ensureUniqueSlug(
  baseSlug: string,
  excludeId?: string
): Promise<string> {
  const conflict = await prisma.post.findFirst({
    where: {
      slug: baseSlug,
      NOT: excludeId ? { id: excludeId } : undefined,
    },
    select: { id: true },
  })

  if (!conflict) {
    return baseSlug
  }

  let counter = 2
  while (true) {
    const candidate = `${baseSlug}-${counter}`
    const existing = await prisma.post.findFirst({
      where: {
        slug: candidate,
        NOT: excludeId ? { id: excludeId } : undefined,
      },
      select: { id: true },
    })

    if (!existing) {
      return candidate
    }

    counter++
  }
}
