'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

type Asset = {
  id: string
  filename: string
  originalName: string
  url: string
  mimeType: string
  size: number
  createdAt: Date
}

interface ImagePickerModalProps {
  open: boolean
  onClose: () => void
  onSelect: (url: string) => void
}

export default function ImagePickerModal({
  open,
  onClose,
  onSelect,
}: ImagePickerModalProps) {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      loadAssets()
    }
  }, [open])

  async function loadAssets() {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/media/list')
      if (response.ok) {
        const data = await response.json()
        setAssets(data.assets || [])
      }
    } catch (err) {
      console.error('Failed to load media assets:', err)
    } finally {
      setLoading(false)
    }
  }

  function handleSelect() {
    if (selected) {
      onSelect(selected)
      handleClose()
    }
  }

  function handleClose() {
    setSelected(null)
    onClose()
  }

  if (!open) return null

  const imageAssets = assets.filter((a) => a.mimeType.startsWith('image/'))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Choose from Media Library</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1F99ED]"></div>
            </div>
          ) : imageAssets.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>No images in your media library yet.</p>
              <p className="text-sm mt-2">Upload images to use them in your posts.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {imageAssets.map((asset) => (
                <button
                  key={asset.id}
                  type="button"
                  onClick={() => setSelected(asset.url)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selected === asset.url
                      ? 'border-[#1F99ED] ring-2 ring-[#1F99ED] ring-offset-2'
                      : 'border-gray-200 hover:border-[#1F99ED]'
                  }`}
                >
                  <Image
                    src={asset.url}
                    alt={asset.originalName}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  {selected === asset.url && (
                    <div className="absolute inset-0 bg-[#1F99ED]/20 flex items-center justify-center">
                      <div className="bg-[#1F99ED] text-white rounded-full p-2">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSelect}
            disabled={!selected}
            className="px-6 py-2 bg-[#1F99ED] text-white rounded-lg text-sm font-medium hover:bg-[#1a87d4] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            Select Image
          </button>
        </div>
      </div>
    </div>
  )
}
