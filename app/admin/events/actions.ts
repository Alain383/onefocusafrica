'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-utils'
import { z } from 'zod'

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

const EventSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  eventDate: z.string().min(1, 'Event date is required'),
  location: z.string().optional().nullable(),
  status: z.enum(['upcoming', 'past', 'cancelled']).default('upcoming'),
  registrationLink: z.string().url('Must be a valid URL').optional().nullable().or(z.literal('')),
})

export async function saveEvent(
  rawData: unknown
): Promise<ActionResult<{ id: string }>> {
  await requireAuth()

  const parsed = EventSchema.safeParse(rawData)
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message ?? 'Invalid data',
    }
  }

  const data = parsed.data

  // Validate the date is parseable
  const parsedDate = new Date(data.eventDate)
  if (isNaN(parsedDate.getTime())) {
    return { success: false, error: 'Invalid event date' }
  }

  try {
    const ev = await prisma.event.upsert({
      where: { id: data.id ?? '__new__' },
      create: {
        title: data.title,
        description: data.description,
        eventDate: parsedDate,
        location: data.location ?? null,
        status: data.status,
        registrationLink: data.registrationLink || null,
      },
      update: {
        title: data.title,
        description: data.description,
        eventDate: parsedDate,
        location: data.location ?? null,
        status: data.status,
        registrationLink: data.registrationLink || null,
      },
      select: { id: true },
    })

    revalidatePath('/admin/events')
    revalidatePath('/talent')

    return { success: true, data: { id: ev.id } }
  } catch (err) {
    console.error('saveEvent error:', err)
    return { success: false, error: 'Failed to save event' }
  }
}

export async function deleteEvent(id: string): Promise<ActionResult> {
  await requireAuth()

  try {
    await prisma.event.delete({ where: { id } })
    revalidatePath('/admin/events')
    revalidatePath('/talent')
    return { success: true, data: undefined }
  } catch (err) {
    console.error('deleteEvent error:', err)
    return { success: false, error: 'Failed to delete event' }
  }
}
