'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { MEDIA_SLOTS, serializeMediaBlock, defaultMediaBlock } from '@onefocus/shared/media'
import MediaField from '@/components/admin/editor/MediaField'
import { resetSiteMedia, saveSiteMedia } from './media-actions'

type Props = {
  values: Record<string, string>
}

export default function MediaTab({ values }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [selected, setSelected] = useState(MEDIA_SLOTS[0].key)
  const [draft, setDraft] = useState(() => initialValue(MEDIA_SLOTS[0].key, values))
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const slot = MEDIA_SLOTS.find((item) => item.key === selected) || MEDIA_SLOTS[0]

  function choose(key: string) {
    setSelected(key)
    setDraft(initialValue(key, values))
    setMessage(null)
  }

  function save() {
    setMessage(null)
    startTransition(async () => {
      const result = await saveSiteMedia(selected, draft)
      setMessage(result.success
        ? { type: 'success', text: 'Media saved. The public site will update shortly.' }
        : { type: 'error', text: result.error || 'Could not save media' })
      if (result.success) router.refresh()
    })
  }

  function reset() {
    setMessage(null)
    startTransition(async () => {
      const result = await resetSiteMedia(selected)
      setMessage(result.success
        ? { type: 'success', text: 'Media reset to the original image.' }
        : { type: 'error', text: result.error || 'Could not reset media' })
      if (result.success) {
        setDraft(serializeMediaBlock(defaultMediaBlock(slot)))
        router.refresh()
      }
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 text-sm font-semibold text-gray-900">
          Media slots
        </div>
        <div className="max-h-[560px] overflow-y-auto divide-y divide-gray-100">
          {MEDIA_SLOTS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => choose(item.key)}
              className={`w-full text-left px-4 py-3 transition-colors ${
                selected === item.key ? 'bg-[#EEF6FD]' : 'hover:bg-gray-50'
              }`}
            >
              <span className="block text-sm font-medium text-gray-900">{item.label}</span>
              <span className="block text-xs text-gray-500 mt-0.5">{item.description}</span>
              <span className="block text-[10px] text-gray-400 mt-1">{item.key}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">{slot.label}</h2>
            <p className="text-sm text-gray-500">{slot.description}</p>
          </div>

          <MediaField value={draft} onChange={setDraft} label="Choose what appears in this slot" />

          {message && (
            <div className={`mt-4 text-sm px-4 py-3 rounded-lg border ${
              message.type === 'success'
                ? 'text-green-700 bg-green-50 border-green-200'
                : 'text-red-600 bg-red-50 border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={save}
              disabled={isPending}
              className="bg-[#1F99ED] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#2E3192] disabled:opacity-50"
            >
              {isPending ? 'Saving…' : 'Save media'}
            </button>
            <button
              type="button"
              onClick={reset}
              disabled={isPending}
              className="bg-white border border-gray-200 text-gray-600 px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              Reset to original
            </button>
          </div>
        </div>

        <div className="bg-[#EEF6FD] border border-[#1F99ED]/20 rounded-xl p-5 text-sm text-gray-700">
          <p className="font-semibold text-[#10183F] mb-2">How it works</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Image: one photo.</li>
            <li>Video: an uploaded or linked video with an optional poster.</li>
            <li>Slideshow: several photos shown one after another.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function initialValue(key: string, values: Record<string, string>): string {
  const slot = MEDIA_SLOTS.find((item) => item.key === key)
  if (!slot) return ''
  return values[key] ?? serializeMediaBlock(defaultMediaBlock(slot))
}
