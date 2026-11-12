import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-utils'
import PageHeader from '@/components/admin/PageHeader'
import EventsClient from './EventsClient'

export default async function EventsPage() {
  await requireAuth()

  const events = await prisma.event.findMany({
    orderBy: { eventDate: 'desc' },
    select: {
      id: true,
      title: true,
      description: true,
      eventDate: true,
      location: true,
      status: true,
      registrationLink: true,
    },
  })

  // Convert enum values and Date to serializable form for the client
  const serializedEvents = events.map(e => ({
    ...e,
    status: e.status as string,
    eventDate: e.eventDate,
  }))

  return (
    <div>
      <PageHeader
        title="Events"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Events' },
        ]}
      />
      <EventsClient events={serializedEvents} />
    </div>
  )
}
