'use server'

import { prisma } from '@/lib/prisma'
import { requireAuth, requireRole } from '@/lib/auth-utils'
import { generateSlug } from '@/lib/slug'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

// ─── Validation schemas ────────────────────────────────────────────────────────

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or fewer'),
})

const tagSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or fewer'),
})

// ─── PostCategory actions (ADMIN-only) ────────────────────────────────────────

/**
 * Creates a new PostCategory.
 * Enforces unique name (case-insensitive) and unique slug per Requirement 7.4 and 7.5.
 */
export async function createCategory(
  input: { name: string }
): Promise<ActionResult<{ id: string; name: string; slug: string }>> {
  try {
    const session = await requireAuth()
    await requireRole(session, 'ADMIN')

    const parsed = categorySchema.safeParse(input)
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0].message }
    }

    const { name } = parsed.data
    const slug = generateSlug(name)

    if (!slug) {
      return { success: false, error: 'Category name must contain at least one alphanumeric character.' }
    }

    // Enforce case-insensitive uniqueness on name (Requirement 7.4)
    // SQLite-compatible: fetch all and filter in JS
    const allCategories = await prisma.postCategory.findMany({
      select: { id: true, name: true },
    })
    const existingByName = allCategories.find(c => c.name.toLowerCase() === name.toLowerCase())
    if (existingByName) {
      return { success: false, error: 'A category with this name already exists.' }
    }

    // Enforce unique slug (Requirement 7.5)
    const existingBySlug = await prisma.postCategory.findUnique({
      where: { slug },
      select: { id: true },
    })
    if (existingBySlug) {
      return { success: false, error: 'A category with this slug already exists. Try a different name.' }
    }

    const category = await prisma.postCategory.create({
      data: { name, slug },
      select: { id: true, name: true, slug: true },
    })

    revalidatePath('/admin/blog/categories')
    revalidatePath('/blog')

    return { success: true, data: category }
  } catch (err) {
    if (err instanceof Response) throw err // propagate 403
    console.error('[createCategory]', err)
    return { success: false, error: 'Failed to create category. Please try again.' }
  }
}

/**
 * Renames an existing PostCategory.
 * Enforces case-insensitive name uniqueness (excluding the category itself).
 */
export async function updateCategory(
  id: string,
  input: { name: string }
): Promise<ActionResult<{ id: string; name: string; slug: string }>> {
  try {
    const session = await requireAuth()
    await requireRole(session, 'ADMIN')

    const parsed = categorySchema.safeParse(input)
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0].message }
    }

    const { name } = parsed.data
    const slug = generateSlug(name)

    if (!slug) {
      return { success: false, error: 'Category name must contain at least one alphanumeric character.' }
    }

    // Enforce case-insensitive uniqueness, excluding the category being updated
    // SQLite-compatible: fetch all and filter in JS
    const allCategories = await prisma.postCategory.findMany({
      select: { id: true, name: true },
      where: { NOT: { id } },
    })
    const existingByName = allCategories.find(c => c.name.toLowerCase() === name.toLowerCase())
    if (existingByName) {
      return { success: false, error: 'A category with this name already exists.' }
    }

    // Enforce unique slug (excluding current)
    const existingBySlug = await prisma.postCategory.findFirst({
      where: { slug, NOT: { id } },
      select: { id: true },
    })
    if (existingBySlug) {
      return { success: false, error: 'A category with this slug already exists. Try a different name.' }
    }

    const category = await prisma.postCategory.update({
      where: { id },
      data: { name, slug },
      select: { id: true, name: true, slug: true },
    })

    revalidatePath('/admin/blog/categories')
    revalidatePath('/blog')

    return { success: true, data: category }
  } catch (err) {
    if (err instanceof Response) throw err
    console.error('[updateCategory]', err)
    return { success: false, error: 'Failed to update category. Please try again.' }
  }
}

/**
 * Deletes a PostCategory.
 * Per Requirement 7.3: removes the category association from posts without deleting posts.
 * Prisma's implicit many-to-many handles the disconnect automatically on delete.
 */
export async function deleteCategory(id: string): Promise<ActionResult> {
  try {
    const session = await requireAuth()
    await requireRole(session, 'ADMIN')

    // Disconnect category from all posts before deleting
    // For implicit many-to-many relations, Prisma cascades the join-table rows on delete.
    await prisma.postCategory.delete({ where: { id } })

    revalidatePath('/admin/blog/categories')
    revalidatePath('/blog')

    return { success: true, data: undefined }
  } catch (err) {
    if (err instanceof Response) throw err
    console.error('[deleteCategory]', err)
    return { success: false, error: 'Failed to delete category. Please try again.' }
  }
}

// ─── PostTag actions (any authenticated user) ─────────────────────────────────

/**
 * Creates a new PostTag.
 * Accessible to any authenticated Admin_User (not restricted to ADMIN role).
 * Per Requirement 7.2.
 */
export async function createTag(
  input: { name: string }
): Promise<ActionResult<{ id: string; name: string; slug: string }>> {
  try {
    await requireAuth()

    const parsed = tagSchema.safeParse(input)
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0].message }
    }

    const { name } = parsed.data
    const slug = generateSlug(name)

    if (!slug) {
      return { success: false, error: 'Tag name must contain at least one alphanumeric character.' }
    }

    // Check for existing tag (case-insensitive name)
    // SQLite-compatible: fetch all and filter in JS
    const allTags = await prisma.postTag.findMany({
      select: { id: true, name: true },
    })
    const existingByName = allTags.find(t => t.name.toLowerCase() === name.toLowerCase())
    if (existingByName) {
      return { success: false, error: 'A tag with this name already exists.' }
    }

    // Check slug uniqueness
    const existingBySlug = await prisma.postTag.findUnique({
      where: { slug },
      select: { id: true },
    })
    if (existingBySlug) {
      return { success: false, error: 'A tag with this slug already exists. Try a different name.' }
    }

    const tag = await prisma.postTag.create({
      data: { name, slug },
      select: { id: true, name: true, slug: true },
    })

    revalidatePath('/admin/blog/categories')

    return { success: true, data: tag }
  } catch (err) {
    if (err instanceof Response) throw err
    console.error('[createTag]', err)
    return { success: false, error: 'Failed to create tag. Please try again.' }
  }
}
