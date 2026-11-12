'use client'

import { useState, useEffect, useRef } from 'react'
import { generateSlug } from '@/lib/slug'

interface SlugFieldProps {
  value: string
  onChange: (slug: string) => void
  postId?: string
  siteUrl?: string
}

type UniquenessStatus = 'idle' | 'checking' | 'unique' | 'conflict'

export default function SlugField({ value, onChange, postId, siteUrl = '' }: SlugFieldProps) {
  const [status, setStatus] = useState<UniquenessStatus>('idle')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Check uniqueness with debounce
  useEffect(() => {
    if (!value) { setStatus('idle'); return }

    setStatus('checking')
    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(async () => {
      try {
        const params = new URLSearchParams({ slug: value })
        if (postId) params.set('excludeId', postId)
        const res = await fetch(`/api/admin/slug-check?${params.toString()}`)
        const data = await res.json() as { unique: boolean }
        setStatus(data.unique ? 'unique' : 'conflict')
      } catch {
        setStatus('idle')
      }
    }, 400)

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [value, postId])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const cleaned = generateSlug(e.target.value)
    onChange(cleaned)
  }

  const statusEl = {
    idle: null,
    checking: <span className="text-xs text-gray-400">Checking…</span>,
    unique: <span className="text-xs text-green-600">✓ Available</span>,
    conflict: <span className="text-xs text-red-500">✗ Already taken</span>,
  }[status]

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="post-slug"
          aria-label="Slug"
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#1F99ED]"
        />
        {statusEl}
      </div>
      {value && (
        <p className="text-xs text-gray-400 truncate">
          {siteUrl}/blog/<span className="text-gray-600">{value}</span>
        </p>
      )}
    </div>
  )
}
