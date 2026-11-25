'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { PAGE_TEXT_GROUPS, pageTextKey, type PageTextField, type PageTextGroup } from '@onefocus/shared/page-text'
import { savePageTextGroup } from './actions'

interface Props {
  values: Record<string, string>
}

function initialValues(values: Record<string, string>): Record<string, string> {
  return PAGE_TEXT_GROUPS.reduce<Record<string, string>>((acc, group) => {
    for (const field of group.fields) {
      const key = pageTextKey(field)
      acc[key] = values[key] ?? field.default
    }
    return acc
  }, {})
}

export default function PageTextEditor({ values }: Props) {
  const router = useRouter()
  const [draft, setDraft] = useState<Record<string, string>>(() => initialValues(values))
  const [pendingGroup, setPendingGroup] = useState<string | null>(null)
  const [savedGroup, setSavedGroup] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  function fieldValue(field: PageTextField): string {
    return draft[pageTextKey(field)] ?? field.default
  }

  function setField(field: PageTextField, value: string) {
    setSavedGroup(null)
    setDraft((current) => ({ ...current, [pageTextKey(field)]: value }))
  }

  async function save(group: PageTextGroup) {
    setError(null)
    setSavedGroup(null)
    setPendingGroup(group.id)
    startTransition(async () => {
      const result = await savePageTextGroup({
        groupId: group.id,
        values: group.fields.map((field) => ({
          section: field.section,
          key: field.key,
          value: fieldValue(field),
        })),
      })
      setPendingGroup(null)
      if (result.success) {
        setSavedGroup(group.id)
        router.refresh()
      } else {
        setError(result.error)
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

      {PAGE_TEXT_GROUPS.map((group) => (
        <div key={group.id} className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
            <div>
              <h2 className="font-semibold text-gray-900">{group.title}</h2>
              <p className="text-sm text-gray-500 mt-1">{group.description}</p>
            </div>
            <div className="flex items-center gap-3">
              {savedGroup === group.id && (
                <span className="text-xs text-green-600">Saved</span>
              )}
              <button
                type="button"
                onClick={() => save(group)}
                disabled={pendingGroup === group.id}
                className="bg-[#1F99ED] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#1a87d4] disabled:opacity-50"
              >
                {pendingGroup === group.id ? 'Saving…' : 'Save group'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {group.fields.map((field) => (
              <label key={pageTextKey(field)} className="block">
                <span className="block text-sm font-medium text-gray-700 mb-1">{field.label}</span>
                {field.multiline ? (
                  <textarea
                    value={fieldValue(field)}
                    onChange={(e) => setField(field, e.target.value)}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F99ED]"
                  />
                ) : (
                  <input
                    value={fieldValue(field)}
                    onChange={(e) => setField(field, e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F99ED]"
                  />
                )}
                {field.hint && (
                  <span className="block text-xs text-gray-400 mt-1">{field.hint}</span>
                )}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
