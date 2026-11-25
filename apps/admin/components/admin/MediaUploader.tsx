'use client'

import { upload } from '@vercel/blob/client'
import { useCallback, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime']
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
const MAX_IMAGE_SIZE = 10 * 1024 * 1024
const MAX_VIDEO_SIZE = 100 * 1024 * 1024

export default function MediaUploader() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentFile, setCurrentFile] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)

  const uploadFile = useCallback(async (file: File) => {
    const isVideo = file.type.startsWith('video/')
    const allowed = isVideo ? VIDEO_TYPES : IMAGE_TYPES
    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE

    if (!allowed.includes(file.type)) {
      setError(isVideo ? 'Only MP4, WebM and MOV videos are allowed.' : 'Only JPG, PNG, WebP, GIF and SVG images are allowed.')
      return
    }
    if (file.size > maxSize) {
      setError(isVideo ? 'Video must be less than 100 MB.' : 'Image must be less than 10 MB.')
      return
    }

    setError(null)
    setSuccess(null)
    setCurrentFile(file.name)
    setUploading(true)
    setProgress(0)

    try {
      const blob = await upload(file.name, file, {
        access: 'public',
        contentType: file.type,
        handleUploadUrl: '/api/admin/media/client-upload',
        multipart: file.size > 10 * 1024 * 1024,
        clientPayload: JSON.stringify({ originalName: file.name, size: file.size }),
        onUploadProgress: ({ percentage }) => setProgress(Math.round(percentage)),
      })

      await fetch('/api/admin/media/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: blob.url,
          filename: blob.pathname,
          originalName: file.name,
          mimeType: blob.contentType || file.type,
          size: file.size,
        }),
      }).catch(() => {})

      setSuccess(`"${file.name}" uploaded successfully`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      setProgress(0)
      setCurrentFile('')
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }, [router])

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return
    for (const file of Array.from(files)) {
      await uploadFile(file)
    }
  }, [uploadFile])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    void handleFiles(e.dataTransfer.files)
  }, [handleFiles])

  return (
    <div className="mb-8">
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
          accept={[...IMAGE_TYPES, ...VIDEO_TYPES].join(',')}
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        {uploading ? (
          <div className="space-y-3">
            <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-[#1F99ED] border-t-transparent" />
            <p className="text-sm font-medium text-gray-700">Uploading {currentFile}</p>
            <div className="max-w-xs mx-auto bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#1F99ED] h-full transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500">{progress}%</p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-base font-semibold text-gray-700">
              Drop images or videos here or <span className="text-[#1F99ED]">click to upload</span>
            </p>
            <p className="text-xs text-gray-500">
              JPG, PNG, WebP, GIF, SVG, MP4, WebM, MOV · Images 10 MB · Videos 100 MB · Multiple files supported
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600">
          Error: {error}
        </div>
      )}
      {success && (
        <div className="mt-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-700">
          Success: {success}
        </div>
      )}
    </div>
  )
}
