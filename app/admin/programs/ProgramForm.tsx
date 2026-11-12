'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { saveProgram } from './actions'

type Program = {
  id: string
  title: string
  description: string
  icon: string | null
  status: string
  urlAnchor: string | null
}

interface Props {
  program?: Program
  onDone?: () => void
}

export default function ProgramForm({ program, onDone }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [title, setTitle] = useState(program?.title ?? '')
  const [description, setDescription] = useState(program?.description ?? '')
  const [icon, setIcon] = useState(program?.icon ?? '')
  const [status, setStatus] = useState(program?.status ?? 'active')
  const [urlAnchor, setUrlAnchor] = useState(program?.urlAnchor ?? '')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const res = await saveProgram({
        id: program?.id,
        title,
        description,
        icon: icon || null,
        status,
        urlAnchor: urlAnchor || null,
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
          Icon (emoji or URL)
        </label>
        <input
          type="text"
          value={icon}
          onChange={e => setIcon(e.target.value)}
          placeholder="e.g. 🎯 or https://..."
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
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          URL Anchor
        </label>
        <input
          type="text"
          value={urlAnchor}
          onChange={e => setUrlAnchor(e.target.value)}
          placeholder="e.g. #programs"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F99ED]"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="bg-[#1F99ED] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1a87d4] disabled:opacity-60 transition-colors"
      >
        {isPending ? 'Saving…' : program ? 'Update Program' : 'Create Program'}
      </button>
    </form>
  )
}
