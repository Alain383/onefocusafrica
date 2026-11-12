'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { saveCaseStudy } from './actions'

type CaseStudy = {
  id: string
  title: string
  slug: string
  category: string
  clientName: string | null
  challenge: string
  solution: string
  outcome: string
  deliverables: string[]
  publishedAssets: string[]
  isPublished: boolean
}

interface Props {
  caseStudy?: CaseStudy
}

const CATEGORIES = ['Brand', 'Media', 'Web', 'Training', 'Corporate', 'Talent']

export default function CaseStudyForm({ caseStudy }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [title, setTitle] = useState(caseStudy?.title ?? '')
  const [category, setCategory] = useState(caseStudy?.category ?? CATEGORIES[0])
  const [clientName, setClientName] = useState(caseStudy?.clientName ?? '')
  const [challenge, setChallenge] = useState(caseStudy?.challenge ?? '')
  const [solution, setSolution] = useState(caseStudy?.solution ?? '')
  const [outcome, setOutcome] = useState(caseStudy?.outcome ?? '')
  const [deliverables, setDeliverables] = useState(
    caseStudy?.deliverables.join('\n') ?? ''
  )
  const [publishedAssets, setPublishedAssets] = useState(
    caseStudy?.publishedAssets.join('\n') ?? ''
  )
  const [isPublished, setIsPublished] = useState(caseStudy?.isPublished ?? false)
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const res = await saveCaseStudy({
        id: caseStudy?.id,
        title,
        category,
        clientName: clientName || null,
        challenge,
        solution,
        outcome,
        deliverables: deliverables
          .split('\n')
          .map(s => s.trim())
          .filter(Boolean),
        publishedAssets: publishedAssets
          .split('\n')
          .map(s => s.trim())
          .filter(Boolean),
        isPublished,
      })
      if (res.success) {
        router.push('/admin/portfolio')
      } else {
        setError(res.error)
      }
    })
  }

  const textareaFields: [string, string, (v: string) => void, boolean][] = [
    ['Challenge *', challenge, setChallenge, true],
    ['Solution *', solution, setSolution, true],
    ['Outcome *', outcome, setOutcome, true],
  ]

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F99ED]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F99ED]"
        >
          {CATEGORIES.map(c => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
        <input
          type="text"
          value={clientName}
          onChange={e => setClientName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F99ED]"
        />
      </div>

      {textareaFields.map(([label, val, setter, required]) => (
        <div key={label}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
          <textarea
            value={val}
            onChange={e => setter(e.target.value)}
            required={required}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1F99ED]"
          />
        </div>
      ))}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Deliverables (one per line)
        </label>
        <textarea
          value={deliverables}
          onChange={e => setDeliverables(e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1F99ED]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Published Assets (URLs, one per line)
        </label>
        <textarea
          value={publishedAssets}
          onChange={e => setPublishedAssets(e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1F99ED]"
        />
      </div>

      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={isPublished}
          onChange={e => setIsPublished(e.target.checked)}
          className="rounded border-gray-300 text-[#1F99ED] focus:ring-[#1F99ED]"
        />
        Publish this case study
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="bg-[#1F99ED] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#1a87d4] disabled:opacity-60 transition-colors"
      >
        {isPending ? 'Saving…' : 'Save'}
      </button>
    </form>
  )
}
