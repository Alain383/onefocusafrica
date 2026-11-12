import { prisma } from '@/lib/prisma'

/**
 * Converts a title string into a URL-safe slug.
 *
 * Steps:
 *   1. Lowercase the input
 *   2. Replace spaces with hyphens
 *   3. Strip any character that is not [a-z0-9-]
 *   4. Collapse consecutive hyphens into one
 *   5. Trim leading and trailing hyphens
 *
 * Returns an empty string when no valid characters remain.
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
}

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
