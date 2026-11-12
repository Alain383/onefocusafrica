'use client'

interface StatusSelectorProps {
  status: string
  scheduledAt?: string | null
  onChangeStatus: (status: string) => void
  onChangeScheduledAt: (date: string | null) => void
}

const STATUS_OPTIONS = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'REVIEW', label: 'In Review' },
  { value: 'SCHEDULED', label: 'Scheduled' },
  { value: 'PUBLISHED', label: 'Published' },
]

export default function StatusSelector({
  status,
  scheduledAt,
  onChangeStatus,
  onChangeScheduledAt,
}: StatusSelectorProps) {
  function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value
    onChangeStatus(val)
    if (val !== 'SCHEDULED') {
      onChangeScheduledAt(null)
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
          value={status}
          onChange={handleStatusChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F99ED]"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {status === 'SCHEDULED' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Publish Date & Time</label>
          <input
            type="datetime-local"
            value={scheduledAt ?? ''}
            onChange={(e) => onChangeScheduledAt(e.target.value || null)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F99ED]"
          />
        </div>
      )}
    </div>
  )
}
