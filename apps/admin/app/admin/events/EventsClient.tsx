'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import EventForm from './EventForm'
import { deleteEvent } from './actions'

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
  events: Event[]
}

const STATUS_COLORS: Record<string, string> = {
  upcoming: 'bg-blue-100 text-blue-700',
  past: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-600',
}

export default function EventsClient({ events }: Props) {
  const router = useRouter()
  const [showNew, setShowNew] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!deleteId) return
    startTransition(async () => {
      await deleteEvent(deleteId)
      setDeleteId(null)
      router.refresh()
    })
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex justify-end">
        <button
          onClick={() => { setShowNew(!showNew); setEditId(null) }}
          className="bg-[#1F99ED] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1a87d4] transition-colors"
        >
          {showNew ? 'Cancel' : 'Add Event'}
        </button>
      </div>

      {/* New event form */}
      {showNew && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">New Event</h2>
          <EventForm
            onDone={() => {
              setShowNew(false)
              router.refresh()
            }}
          />
        </div>
      )}

      {/* Events table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Title</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Location</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {events.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-400">
                  No events yet. Add one above.
                </td>
              </tr>
            )}
            {events.map(ev => (
              <tr key={ev.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{ev.title}</td>
                <td className="px-4 py-3 text-gray-600">
                  {new Date(ev.eventDate).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">{ev.location || '—'}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      STATUS_COLORS[ev.status] ?? 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {ev.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setEditId(editId === ev.id ? null : ev.id)
                        setShowNew(false)
                      }}
                      className="text-[#1F99ED] hover:underline text-xs font-medium"
                    >
                      {editId === ev.id ? 'Cancel' : 'Edit'}
                    </button>
                    <button
                      onClick={() => setDeleteId(ev.id)}
                      className="text-red-500 hover:underline text-xs font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit form */}
      {editId && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Edit Event</h2>
          <EventForm
            event={events.find(e => e.id === editId)}
            onDone={() => {
              setEditId(null)
              router.refresh()
            }}
          />
        </div>
      )}

      {/* Delete confirm */}
      <ConfirmDialog
        open={deleteId !== null}
        title="Delete Event"
        message="This will permanently delete the event. This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={isPending}
      />
    </div>
  )
}
