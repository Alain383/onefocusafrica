'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import ConfirmDialog from '@/components/admin/ConfirmDialog'

type Asset = {
  id: string
  filename: string
  originalName: string
  url: string
  mimeType: string
  size: number
  createdAt: Date
}

interface MediaGridProps {
  mode: 'library' | 'picker'
  assets: Asset[]
  onSelect?: (asset: Asset) => void
}

function humanFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function isPdf(mimeType: string) { return mimeType === 'application/pdf' }
function isImage(mimeType: string) { return mimeType.startsWith('image/') }

export default function MediaGrid({ mode, assets, onSelect }: MediaGridProps) {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!deleteId) return
    startTransition(async () => {
      await fetch(`/api/admin/media?id=${deleteId}`, { method: 'DELETE' })
      setDeleteId(null)
      router.refresh()
    })
  }

  return (
    <>
      {assets.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          No media files uploaded yet.
          {mode === 'library' && (
            <p className="mt-2 text-sm">Upload files via the media upload area.</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {assets.map((asset) => (
          <div
            key={asset.id}
            className={`bg-white rounded-xl border border-gray-200 overflow-hidden group ${
              mode === 'picker' ? 'cursor-pointer hover:border-[#1F99ED] hover:shadow-md transition-all' : ''
            }`}
            onClick={mode === 'picker' && onSelect ? () => onSelect(asset) : undefined}
          >
            {/* Thumbnail */}
            <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
              {isImage(asset.mimeType) ? (
                <Image
                  src={asset.url}
                  alt={asset.originalName}
                  width={200}
                  height={200}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              ) : isPdf(asset.mimeType) ? (
                <span className="text-4xl">📄</span>
              ) : (
                <span className="text-4xl">📁</span>
              )}
            </div>

            {/* Metadata */}
            <div className="p-2">
              <p className="text-xs font-medium text-gray-800 truncate" title={asset.originalName}>
                {asset.originalName}
              </p>
              <p className="text-xs text-gray-400">{humanFileSize(asset.size)}</p>
              <p className="text-xs text-gray-400">
                {new Date(asset.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Delete button (library mode only) */}
            {mode === 'library' && (
              <div className="px-2 pb-2">
                <button
                  onClick={(e) => { e.stopPropagation(); setDeleteId(asset.id) }}
                  className="text-xs text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete Asset"
        message="Are you sure you want to permanently delete this media file? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={isPending}
      />
    </>
  )
}
