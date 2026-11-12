'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-utils'
import { z } from 'zod'

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

const UpdateInquirySchema = z.object({
  status: z.enum(['new', 'contacted', 'qualified', 'proposal', 'closed']).optional(),
  assignedTo: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  followUpDate: z.string().optional().nullable(),
})

export async function updateInquiry(
  id: string,
  rawData: unknown
): Promise<ActionResult<{ id: string }>> {
  await requireAuth()

  const parsed = UpdateInquirySchema.safeParse(rawData)
  if (!parsed.success) {
    return { success: false, error: 'Invalid data' }
  }

  const data = parsed.data

  try {
    const inquiry = await prisma.inquiry.update({
      where: { id },
      data: {
        ...(data.status ? { status: data.status } : {}),
        ...(data.assignedTo !== undefined ? { assignedTo: data.assignedTo } : {}),
        ...(data.notes !== undefined ? { notes: data.notes } : {}),
        ...(data.followUpDate !== undefined ? {
          followUpDate: data.followUpDate ? new Date(data.followUpDate) : null
        } : {}),
      },
      select: { id: true },
    })

    revalidatePath('/admin/inquiries')
    revalidatePath(`/admin/inquiries/${id}`)

    return { success: true, data: { id: inquiry.id } }
  } catch (err) {
    console.error('updateInquiry error:', err)
    return { success: false, error: 'Failed to update inquiry' }
  }
}
