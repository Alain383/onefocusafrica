'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { upsertSiteContent } from './actions'

type Content = { id: string; section: string; key: string; value: string }

interface Props {
  contents: Content[]
}

export default function ContentEditor({ contents }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [newSection, setNewSection] = useState('')
  const [newKey, setNewKey] = useState('')
  const [newValue, setNewValue] = useState('')
  const [error, setError] = useState<string | null>(null)

  const grouped = contents.reduce<Record<string, Content[]>>((acc, c) => {
    acc[c.section] = acc[c.section] ?? []
    acc[c.section].push(c)
    return acc
  }, {})

  function startEdit(c: Content) {
    setEditingId(c.id)
    setEditValue(c.value)
  }

  async function saveEdit(c: Content) {
    setError(null)
    const res = await upsertSiteContent({
      section: c.section,
      key: c.key,
      value: editValue,
    })
    if (res.success) {
      setEditingId(null)
      router.refresh()
    } else {
      setError(res.error)
    }
  }

  async function handleCreate() {
    setError(null)
    if (!newSection.trim() || !newKey.trim()) {
      setError('Section and key are required')
      return
    }
    startTransition(async () => {
      const res = await upsertSiteContent({
        section: newSection.trim(),
        key: newKey.trim(),
        value: newValue,
      })
      if (res.success) {
        setNewSection('')
        setNewKey('')
        setNewValue('')
        router.refresh()
      } else {
        setError(res.error)
      }
    })
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* Add new content */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Add Content</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            value={newSection}
            onChange={e => setNewSection(e.target.value)}
            placeholder="Section (e.g. hero)"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F99ED]"
          />
          <input
            value={newKey}
            onChange={e => setNewKey(e.target.value)}
            placeholder="Key (e.g. title)"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F99ED]"
          />
          <input
            value={newValue}
            onChange={e => setNewValue(e.target.value)}
            placeholder="Value"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F99ED]"
          />
        </div>
        <button
          onClick={handleCreate}
          disabled={isPending}
          className="mt-3 bg-[#1F99ED] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#1a87d4] disabled:opacity-50"
        >
          Add
        </button>
      </div>

      {/* Existing content grouped by section */}
      {Object.entries(grouped).map(([section, items]) => (
        <div key={section} className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4 capitalize">{section}</h2>
          <div className="space-y-3">
            {items.map(c => (
              <div key={c.id} className="flex items-start gap-3">
                <span className="text-sm font-mono text-gray-500 w-32 flex-shrink-0 pt-2">
                  {c.key}
                </span>
                {editingId === c.id ? (
                  <div className="flex-1 flex gap-2">
                    <input
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F99ED]"
                    />
                    <button
                      onClick={() => saveEdit(c)}
                      className="text-xs text-green-600 hover:underline"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-xs text-gray-400 hover:underline"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-between gap-2">
                    <span className="text-sm text-gray-800 truncate">{c.value}</span>
                    <button
                      onClick={() => startEdit(c)}
                      className="text-xs text-[#1F99ED] hover:underline flex-shrink-0"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {contents.length === 0 && (
        <p className="text-sm text-gray-400">No content entries yet.</p>
      )}
    </div>
  )
}
