'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'

interface CoverImageUploaderProps {
  value: string
  onChange: (url: string) => void
  onOpenMediaLibrary: () => void
}

export default function CoverImageUploader({
  value,
  onChange,
  onOpenMediaLibrary,
}: CoverImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type client-side
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setError('Only JPG, PNG, and WebP images are allowed')
      return
    }

    // Validate file size client-side (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10 MB')
      return
    }

    setError(null)
    setUploading(true)
    setProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90))
      }, 200)

      const response = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Upload failed')
      }

      const data = await response.json()
      onChange(data.asset.url)
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      setTimeout(() => setProgress(0), 1000)
    }
  }

  function handleRemove() {
    onChange('')
    setError(null)
  }

  return (
    <div className="space-y-3">
      {/* Preview */}
      {value && (
        <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
          <div className="relative aspect-video">
            <Image
              src={value}
              alt="Cover image preview"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-red-600 transition-colors"
          >
            Remove
          </button>
        </div>
      )}

      {/* Upload buttons */}
      <div className="space-y-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full bg-[#1F99ED] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#1a87d4] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {uploading ? 'Uploading...' : value ? 'Replace Image' : 'Upload Cover Image'}
        </button>

        <button
          type="button"
          onClick={onOpenMediaLibrary}
          disabled={uploading}
          className="w-full bg-white border-2 border-[#1F99ED] text-[#1F99ED] py-2.5 rounded-lg text-sm font-medium hover:bg-[#EEF6FD] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          Choose from Library
        </button>
      </div>

      {/* Progress bar */}
      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-[#1F99ED] h-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Success message */}
      {!uploading && progress === 100 && !error && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-600">
          ✓ Image uploaded successfully
        </div>
      )}

      {/* Image info */}
      {!value && (
        <p className="text-xs text-gray-500">
          Accepts JPG, PNG, WebP. Max size: 10 MB
        </p>
      )}
    </div>
  )
}
