'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-utils'
import { z } from 'zod'

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

const ProgramSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  icon: z.string().optional().nullable(),
  status: z.enum(['active', 'inactive']).default('active'),
  urlAnchor: z.string().optional().nullable(),
})

export async function saveProgram(
  rawData: unknown
): Promise<ActionResult<{ id: string }>> {
  await requireAuth()

  const parsed = ProgramSchema.safeParse(rawData)
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message ?? 'Invalid data',
    }
  }

  const data = parsed.data

  try {
    const prog = await prisma.program.upsert({
      where: { id: data.id ?? '__new__' },
      create: {
        title: data.title,
        description: data.description,
        icon: data.icon ?? null,
        status: data.status,
        urlAnchor: data.urlAnchor ?? null,
      },
      update: {
        title: data.title,
        description: data.description,
        icon: data.icon ?? null,
        status: data.status,
        urlAnchor: data.urlAnchor ?? null,
      },
      select: { id: true },
    })

    revalidatePath('/admin/programs')
    revalidatePath('/talent')

    return { success: true, data: { id: prog.id } }
  } catch (err) {
    console.error('saveProgram error:', err)
    return { success: false, error: 'Failed to save program' }
  }
}

export async function deleteProgram(id: string): Promise<ActionResult> {
  await requireAuth()

  try {
    await prisma.program.delete({ where: { id } })
    revalidatePath('/admin/programs')
    revalidatePath('/talent')
    return { success: true, data: undefined }
  } catch (err) {
    console.error('deleteProgram error:', err)
    return { success: false, error: 'Failed to delete program' }
  }
}
