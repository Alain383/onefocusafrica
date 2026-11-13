'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export default function MediaUploader() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)

  async function uploadFile(file: File) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      setError('Only JPG, PNG, WebP, GIF, SVG images are allowed.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10 MB.')
      return
    }

    setError(null)
    setSuccess(null)
    setUploading(true)
    setProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 15, 85))
    }, 150)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/admin/media', { method: 'POST', body: formData })
      clearInterval(interval)
      setProgress(100)

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Upload failed')
      }

      setSuccess(`"${file.name}" uploaded successfully`)
      router.refresh()
    } catch (err) {
      clearInterval(interval)
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      setTimeout(() => setProgress(0), 1500)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    // Upload one at a time
    for (const file of Array.from(files)) {
      await uploadFile(file)
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFiles(e.dataTransfer.files)
  }, [])

  return (
    <div className="mb-8">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all
          ${dragOver
            ? 'border-[#1F99ED] bg-[#EEF6FD] scale-[1.01]'
            : 'border-gray-300 bg-gray-50 hover:border-[#1F99ED] hover:bg-[#EEF6FD]'
          }
          ${uploading ? 'opacity-60 cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        {uploading ? (
          <div className="space-y-3">
            <div className="text-2xl">⏳</div>
            <p className="text-sm font-medium text-gray-700">Uploading…</p>
            <div className="max-w-xs mx-auto bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#1F99ED] h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500">{progress}%</p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-4xl">📁</div>
            <p className="text-base font-semibold text-gray-700">
              Drop images here or <span className="text-[#1F99ED]">click to upload</span>
            </p>
            <p className="text-xs text-gray-500">
              JPG, PNG, WebP, GIF, SVG · Max 10 MB · Multiple files supported
            </p>
          </div>
        )}
      </div>

      {/* Feedback */}
      {error && (
        <div className="mt-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600 flex items-center gap-2">
          <span>⚠️</span> {error}
        </div>
      )}
      {success && (
        <div className="mt-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-700 flex items-center gap-2">
          <span>✅</span> {success}
        </div>
      )}
    </div>
  )
}
