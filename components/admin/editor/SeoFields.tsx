'use client'

interface SeoFieldsProps {
  seoTitle: string
  seoDescription: string
  onChangeSeoTitle: (v: string) => void
  onChangeSeoDescription: (v: string) => void
}

function counterColor(len: number, amberStart: number, redStart: number): string {
  if (len >= redStart) return 'text-red-500'
  if (len >= amberStart) return 'text-amber-500'
  return 'text-gray-400'
}

function CharCounter({ len, amberStart, redStart }: { len: number; amberStart: number; redStart: number }) {
  return (
    <span className={`text-xs tabular-nums ${counterColor(len, amberStart, redStart)}`}>
      {len}
    </span>
  )
}

export default function SeoFields({
  seoTitle,
  seoDescription,
  onChangeSeoTitle,
  onChangeSeoDescription,
}: SeoFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-gray-700">SEO Title</label>
          <CharCounter len={seoTitle.length} amberStart={55} redStart={60} />
        </div>
        <input
          type="text"
          value={seoTitle}
          onChange={(e) => onChangeSeoTitle(e.target.value)}
          placeholder="SEO title (optional, defaults to post title)"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F99ED]"
        />
        <p className="text-xs text-gray-400 mt-1">
          {seoTitle.length <= 54 ? 'Optimal' : seoTitle.length <= 59 ? 'Slightly long' : 'Too long — may be truncated in search results'}
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-gray-700">SEO Description</label>
          <CharCounter len={seoDescription.length} amberStart={140} redStart={160} />
        </div>
        <textarea
          value={seoDescription}
          onChange={(e) => onChangeSeoDescription(e.target.value)}
          rows={3}
          placeholder="Meta description (recommended 120–155 characters)"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F99ED] resize-none"
        />
        <p className="text-xs text-gray-400 mt-1">
          {seoDescription.length <= 139 ? 'Optimal' : seoDescription.length <= 159 ? 'Slightly long' : 'Too long — may be truncated in search results'}
        </p>
      </div>
    </div>
  )
}
