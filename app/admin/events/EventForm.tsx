'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { saveEvent } from './actions'

type Event = {
  id: string
  title: string
  description: string
  eventDate: Date
  location: string | null
  status: string
  registrationLink: string | null
}

interface Props {
  event?: Event
  onDone?: () => void
}

export default function EventForm({ event, onDone }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [title, setTitle] = useState(event?.title ?? '')
  const [description, setDescription] = useState(event?.description ?? '')
  const [eventDate, setEventDate] = useState(
    event?.eventDate
      ? new Date(event.eventDate).toISOString().slice(0, 16)
      : ''
  )
  const [location, setLocation] = useState(event?.location ?? '')
  const [status, setStatus] = useState(event?.status ?? 'upcoming')
  const [registrationLink, setRegistrationLink] = useState(
    event?.registrationLink ?? ''
  )
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const res = await saveEvent({
        id: event?.id,
        title,
        description,
        eventDate,
        location: location || null,
        status,
        registrationLink: registrationLink || null,
      })
      if (res.success) {
        router.refresh()
        onDone?.()
      } else {
        setError(res.error)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F99ED]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1F99ED]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Event Date &amp; Time <span className="text-red-500">*</span>
        </label>
        <input
          type="datetime-local"
          value={eventDate}
          onChange={e => setEventDate(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F99ED]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <input
          type="text"
          value={location}
          onChange={e => setLocation(e.target.value)}
          placeholder="e.g. Nairobi, Kenya or Online"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F99ED]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F99ED]"
        >
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Registration Link
        </label>
        <input
          type="url"
          value={registrationLink}
          onChange={e => setRegistrationLink(e.target.value)}
          placeholder="https://..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F99ED]"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="bg-[#1F99ED] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1a87d4] disabled:opacity-60 transition-colors"
      >
        {isPending ? 'Saving…' : event ? 'Update Event' : 'Create Event'}
      </button>
    </form>
  )
}
