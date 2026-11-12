'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateInquiry } from './actions'

type Inquiry = {
  id: string
  fullName: string
  workEmail: string
  company: string | null
  industry: string | null
  country: string | null
  website: string | null
  serviceArea: string
  challenge: string
  objective: string | null
  timeline: string | null
  status: string
  assignedTo: string | null
  notes: string | null
  followUpDate: Date | null
  createdAt: Date
}

const STATUS_OPTIONS = ['new', 'contacted', 'qualified', 'proposal', 'closed']

interface Props { inquiry: Inquiry }

export default function InquiryDetailClient({ inquiry }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState(inquiry.status)
  const [assignedTo, setAssignedTo] = useState(inquiry.assignedTo ?? '')
  const [notes, setNotes] = useState(inquiry.notes ?? '')
  const [followUpDate, setFollowUpDate] = useState(
    inquiry.followUpDate ? new Date(inquiry.followUpDate).toISOString().slice(0, 10) : ''
  )
  const [saved, setSaved] = useState(false)

  function handleSave() {
    startTransition(async () => {
      await updateInquiry(inquiry.id, {
        status,
        assignedTo: assignedTo || null,
        notes: notes || null,
        followUpDate: followUpDate || null,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      router.refresh()
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Submission details */}
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="font-semibold text-gray-900">Submission Details</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
            {[
              ['Name', inquiry.fullName],
              ['Email', inquiry.workEmail],
              ['Company', inquiry.company],
              ['Industry', inquiry.industry],
              ['Country', inquiry.country],
              ['Website', inquiry.website],
              ['Service Area', inquiry.serviceArea],
              ['Timeline', inquiry.timeline],
            ].map(([label, value]) => value ? (
              <div key={label as string}>
                <dt className="text-gray-500 font-medium">{label}</dt>
                <dd className="text-gray-900">{value}</dd>
              </div>
            ) : null)}
          </dl>
          <div>
            <dt className="text-sm font-medium text-gray-500 mb-1">Challenge</dt>
            <dd className="text-sm text-gray-900 bg-gray-50 rounded-lg p-3">{inquiry.challenge}</dd>
          </div>
          {inquiry.objective && (
            <div>
              <dt className="text-sm font-medium text-gray-500 mb-1">Objective</dt>
              <dd className="text-sm text-gray-900 bg-gray-50 rounded-lg p-3">{inquiry.objective}</dd>
            </div>
          )}
        </div>
      </div>

      {/* Actions sidebar */}
      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="font-semibold text-gray-900">Manage Inquiry</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F99ED]">
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
            <input type="text" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}
              placeholder="Name or email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F99ED]" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Date</label>
            <input type="date" value={followUpDate} onChange={(e) => setFollowUpDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F99ED]" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1F99ED]" />
          </div>

          <button onClick={handleSave} disabled={isPending}
            className="w-full bg-[#1F99ED] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#1a87d4] disabled:opacity-60 transition-colors">
            {saved ? 'Saved ✓' : isPending ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
