'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { requireAuth, requireRole } from '@/lib/auth-utils'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

// ─── AdminUser management ─────────────────────────────────────────────────────

const CreateAdminSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['ADMIN', 'EDITOR']).default('EDITOR'),
})

export async function createAdminUser(rawData: unknown): Promise<ActionResult<{ id: string }>> {
  const session = await requireAuth()
  await requireRole(session, 'ADMIN')

  const parsed = CreateAdminSchema.safeParse(rawData)
  if (!parsed.success) return { success: false, error: parsed.error.errors[0]?.message ?? 'Invalid data' }
  const { name, email, password, role } = parsed.data

  const existing = await prisma.adminUser.findUnique({ where: { email } })
  if (existing) return { success: false, error: 'A user with this email already exists' }

  const hashedPassword = await bcrypt.hash(password, 12)
  try {
    const user = await prisma.adminUser.create({
      data: { name, email, hashedPassword, role },
      select: { id: true },
    })
    revalidatePath('/admin/team')
    return { success: true, data: { id: user.id } }
  } catch (err) {
    console.error(err)
    return { success: false, error: 'Failed to create user' }
  }
}

const UpdateAdminSchema = z.object({
  name: z.string().min(1).optional(),
  role: z.enum(['ADMIN', 'EDITOR']).optional(),
  isActive: z.boolean().optional(),
})

export async function updateAdminUser(id: string, rawData: unknown): Promise<ActionResult<{ id: string }>> {
  const session = await requireAuth()
  await requireRole(session, 'ADMIN')

  const parsed = UpdateAdminSchema.safeParse(rawData)
  if (!parsed.success) return { success: false, error: 'Invalid data' }
  const data = parsed.data

  // Prevent removing last ADMIN
  if (data.role === 'EDITOR' || data.isActive === false) {
    const adminCount = await prisma.adminUser.count({ where: { role: 'ADMIN', isActive: true } })
    const targetUser = await prisma.adminUser.findUnique({ where: { id }, select: { role: true } })
    if (targetUser?.role === 'ADMIN' && adminCount <= 1) {
      return { success: false, error: 'Cannot demote or deactivate the last active ADMIN' }
    }
  }

  try {
    const user = await prisma.adminUser.update({ where: { id }, data, select: { id: true } })
    revalidatePath('/admin/team')
    return { success: true, data: { id: user.id } }
  } catch (err) {
    console.error(err)
    return { success: false, error: 'Failed to update user' }
  }
}

export async function deleteAdminUser(id: string): Promise<ActionResult> {
  const session = await requireAuth()
  await requireRole(session, 'ADMIN')

  // Prevent deleting self
  if (session.user.id === id) return { success: false, error: 'You cannot delete your own account' }

  // Prevent deleting last ADMIN
  const target = await prisma.adminUser.findUnique({ where: { id }, select: { role: true } })
  if (target?.role === 'ADMIN') {
    const count = await prisma.adminUser.count({ where: { role: 'ADMIN', isActive: true } })
    if (count <= 1) return { success: false, error: 'Cannot delete the last ADMIN account' }
  }

  try {
    await prisma.adminUser.delete({ where: { id } })
    revalidatePath('/admin/team')
    return { success: true, data: undefined }
  } catch (err) {
    console.error(err)
    return { success: false, error: 'Failed to delete user' }
  }
}

// ─── TeamMember management ────────────────────────────────────────────────────

const TeamMemberSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  roleTitle: z.string().min(1),
  bio: z.string().optional().nullable(),
  photo: z.string().optional().nullable(),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
})

export async function saveTeamMember(rawData: unknown): Promise<ActionResult<{ id: string }>> {
  const session = await requireAuth()
  await requireRole(session, 'ADMIN')

  const parsed = TeamMemberSchema.safeParse(rawData)
  if (!parsed.success) return { success: false, error: parsed.error.errors[0]?.message ?? 'Invalid data' }
  const data = parsed.data

  try {
    const member = await prisma.teamMember.upsert({
      where: { id: data.id ?? '__new__' },
      create: { name: data.name, roleTitle: data.roleTitle, bio: data.bio ?? null, photo: data.photo ?? null, sortOrder: data.sortOrder, isActive: data.isActive },
      update: { name: data.name, roleTitle: data.roleTitle, bio: data.bio ?? null, photo: data.photo ?? null, sortOrder: data.sortOrder, isActive: data.isActive },
      select: { id: true },
    })
    revalidatePath('/admin/team')
    return { success: true, data: { id: member.id } }
  } catch (err) {
    console.error(err)
    return { success: false, error: 'Failed to save team member' }
  }
}

export async function deleteTeamMember(id: string): Promise<ActionResult> {
  const session = await requireAuth()
  await requireRole(session, 'ADMIN')

  try {
    await prisma.teamMember.delete({ where: { id } })
    revalidatePath('/admin/team')
    return { success: true, data: undefined }
  } catch (err) {
    console.error(err)
    return { success: false, error: 'Failed to delete team member' }
  }
}
