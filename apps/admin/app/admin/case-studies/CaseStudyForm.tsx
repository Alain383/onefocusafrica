'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import MediaField from '@/components/admin/editor/MediaField'
import { saveCaseStudy } from './actions'

export type CaseStudyRecord = {
  id: string
  title: string
  category: string
  clientName: string | null
  challenge: string
  solution: string
  outcome: string
  deliverables: string
  publishedAssets: string
  isPublished: boolean
}

const CATEGORIES = ['BRAND', 'MEDIA', 'WEB', 'TRAINING', 'CORPORATE', 'TALENT']

function lines(value: string): string[] {
  return value.split('\n').map((item) => item.trim()).filter(Boolean)
}

export default function CaseStudyForm({ study }: { study?: CaseStudyRecord }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [title, setTitle] = useState(study?.title ?? '')
  const [category, setCategory] = useState(study?.category ?? CATEGORIES[0])
  const [clientName, setClientName] = useState(study?.clientName ?? '')
  const [challenge, setChallenge] = useState(study?.challenge ?? '')
  const [solution, setSolution] = useState(study?.solution ?? '')
  const [outcome, setOutcome] = useState(study?.outcome ?? '')
  const [cover, setCover] = useState(() => lines(study?.publishedAssets ?? '')[0] ?? '')
  const [extraAssets, setExtraAssets] = useState(() => lines(study?.publishedAssets ?? '').slice(1).join('\n'))
  const [deliverables, setDeliverables] = useState(study?.deliverables ?? '')
  const [isPublished, setIsPublished] = useState(study?.isPublished ?? false)
  const [error, setError] = useState<string | null>(null)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await saveCaseStudy({
        id: study?.id,
        title,
        category,
        clientName: clientName || null,
        challenge,
        solution,
        outcome,
        deliverables: lines(deliverables),
        publishedAssets: [cover, ...lines(extraAssets)].filter(Boolean),
        isPublished,
      })
      if (result.success) router.push('/admin/case-studies')
      else setError(result.error)
    })
  }

  const field = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F99ED]'

  return (
    <form onSubmit={submit} className="max-w-2xl space-y-5">
      {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</div>}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required className={field} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={field}>
            {CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Client name (optional)</label>
          <input value={clientName} onChange={(e) => setClientName(e.target.value)} className={field} />
        </div>
      </div>

      <MediaField value={cover} onChange={setCover} label="Cover image or video" />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Challenge *</label>
        <textarea value={challenge} onChange={(e) => setChallenge(e.target.value)} required rows={3} className={field} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">What ONEFOCUS delivered *</label>
        <textarea value={solution} onChange={(e) => setSolution(e.target.value)} required rows={3} className={field} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Verified outcome *</label>
        <textarea value={outcome} onChange={(e) => setOutcome(e.target.value)} required rows={3} className={field} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Deliverables (one per line)</label>
        <textarea value={deliverables} onChange={(e) => setDeliverables(e.target.value)} rows={3} className={field} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Extra published asset URLs (one per line)</label>
        <textarea value={extraAssets} onChange={(e) => setExtraAssets(e.target.value)} rows={3} className={field} />
      </div>

      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={isPublished}
          onChange={(e) => setIsPublished(e.target.checked)}
          className="rounded border-gray-300 text-[#1F99ED] focus:ring-[#1F99ED]"
        />
        Publish this case study on the /work page
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="bg-[#1F99ED] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#1a87d4] disabled:opacity-60 transition-colors"
      >
        {isPending ? 'Saving…' : 'Save case study'}
      </button>
    </form>
  )
}
