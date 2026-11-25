'use client'

import Image from 'next/image'
import { upload } from '@vercel/blob/client'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  parseMediaBlock,
  serializeMediaBlock,
  type MediaBlock,
  type MediaType,
} from '@onefocus/shared/media'
import ImagePickerModal from './ImagePickerModal'

type MediaFieldProps = {
  value: string
  onChange: (value: string) => void
  label?: string
  types?: MediaType[]
}

const TYPES: { value: MediaType; label: string }[] = [
  { value: 'image', label: 'Image' },
  { value: 'video', label: 'Video' },
  { value: 'slideshow', label: 'Slideshow' },
]

const DEFAULT_TYPES: MediaType[] = ['image', 'video', 'slideshow']

function parseAllowedMedia(value: string, allowedTypes: MediaType[]): MediaBlock {
  const parsed = parseMediaBlock(value, '', '')
  if (allowedTypes.includes(parsed.type)) return parsed
  const first = allowedTypes[0] ?? 'image'
  const url = parsed.type === 'slideshow' ? parsed.slides?.[0]?.url || '' : parsed.url || ''
  return { type: first, url, alt: parsed.alt || '' }
}

export default function MediaField({ value, onChange, label, types }: MediaFieldProps) {
  const typeKey = types?.length ? types.join(',') : DEFAULT_TYPES.join(',')
  const allowedTypes = useMemo<MediaType[]>(() => typeKey.split(',') as MediaType[], [typeKey])
  const availableTypes = TYPES.filter((type) => allowedTypes.includes(type.value))
  const [block, setBlock] = useState<MediaBlock>(() => parseAllowedMedia(value, allowedTypes))
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setBlock(parseAllowedMedia(value, allowedTypes))
  }, [value, allowedTypes])

  function commit(next: MediaBlock) {
    setBlock(next)
    onChange(serializeMediaBlock(next))
  }

  function clear() {
    const next: MediaBlock = { type: allowedTypes[0] ?? 'image', url: '', alt: '' }
    setBlock(next)
    onChange('')
  }

  function patch(next: Partial<MediaBlock>) {
    commit({ ...block, ...next })
  }

  async function uploadFile(file: File) {
    const isVideo = block.type === 'video'
    const allowed = isVideo
      ? ['video/mp4', 'video/webm', 'video/quicktime']
      : ['image/jpeg', 'image/png', 'image/webp']
    const maxSize = isVideo ? 100 * 1024 * 1024 : 10 * 1024 * 1024

    if (!allowed.includes(file.type)) {
      setError(isVideo ? 'Only MP4, WebM and MOV videos are allowed' : 'Only JPG, PNG and WebP images are allowed')
      return
    }
    if (file.size > maxSize) {
      setError(isVideo ? 'Video must be less than 100 MB' : 'Image must be less than 10 MB')
      return
    }

    setError(null)
    setProgress(0)
    setUploading(true)
    try {
      const blob = await upload(file.name, file, {
        access: 'public',
        contentType: file.type,
        handleUploadUrl: '/api/admin/media/client-upload',
        multipart: file.size > 10 * 1024 * 1024,
        clientPayload: JSON.stringify({ originalName: file.name, size: file.size }),
        onUploadProgress: ({ percentage }) => setProgress(Math.round(percentage)),
      })
      if (block.type === 'slideshow') {
        patch({ slides: [...(block.slides || []), { url: blob.url, alt: '' }] })
      } else {
        patch({ url: blob.url })
      }
      void fetch('/api/admin/media/register', {
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      setProgress(0)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  function removeSlide(index: number) {
    patch({ slides: (block.slides || []).filter((_, i) => i !== index) })
  }

  function moveSlide(index: number, direction: -1 | 1) {
    const slides = [...(block.slides || [])]
    const target = index + direction
    if (target < 0 || target >= slides.length) return
    ;[slides[index], slides[target]] = [slides[target], slides[index]]
    patch({ slides })
  }

  function updateSlide(index: number, key: 'url' | 'alt', nextValue: string) {
    const slides = [...(block.slides || [])]
    slides[index] = { ...slides[index], [key]: nextValue }
    patch({ slides })
  }

  const previewUrl = block.type === 'slideshow' ? block.slides?.[0]?.url : block.url
  const accept = block.type === 'video'
    ? 'video/mp4,video/webm,video/quicktime'
    : 'image/jpeg,image/png,image/webp'

  return (
    <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
      {label && <div className="text-xs font-medium text-gray-500">{label}</div>}

      {availableTypes.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {availableTypes.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => patch({ type: type.value })}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                block.type === type.value
                  ? 'bg-[#10183F] text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      )}

      {block.type === 'slideshow' ? (
        <div className="space-y-2">
          {(block.slides || []).map((slide, index) => (
            <div key={index} className="flex flex-wrap items-center gap-2 rounded-md bg-white p-2 border border-gray-200">
              <span className="w-5 text-xs text-gray-400">{index + 1}</span>
              <input
                value={slide.url}
                onChange={(e) => updateSlide(index, 'url', e.target.value)}
                placeholder="Image URL"
                className="min-w-[180px] flex-1 border border-gray-300 rounded px-2 py-1.5 text-xs"
              />
              <input
                value={slide.alt || ''}
                onChange={(e) => updateSlide(index, 'alt', e.target.value)}
                placeholder="Alt text"
                className="w-32 border border-gray-300 rounded px-2 py-1.5 text-xs"
              />
              <button type="button" onClick={() => moveSlide(index, -1)} className="text-xs text-gray-500 hover:text-[#1F99ED]">↑</button>
              <button type="button" onClick={() => moveSlide(index, 1)} className="text-xs text-gray-500 hover:text-[#1F99ED]">↓</button>
              <button type="button" onClick={() => removeSlide(index)} className="text-xs text-red-500 hover:text-red-700">Remove</button>
            </div>
          ))}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="bg-[#1F99ED] text-white px-3 py-1.5 rounded-md text-xs font-medium disabled:opacity-50"
            >
              {uploading ? `Uploading… ${progress}%` : 'Add image'}
            </button>
            <button type="button" onClick={() => setPickerOpen(true)} className="bg-white border border-[#1F99ED] text-[#1F99ED] px-3 py-1.5 rounded-md text-xs font-medium">
              Choose from library
            </button>
            <button
              type="button"
              onClick={() => patch({ slides: [...(block.slides || []), { url: '', alt: '' }] })}
              className="bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-md text-xs font-medium"
            >
              Add URL
            </button>
          </div>
          <label className="flex items-center gap-2 text-xs text-gray-600">
            Seconds between slides
            <input
              type="number"
              min={1}
              value={Math.round((block.interval || 4000) / 1000)}
              onChange={(e) => patch({ interval: Math.max(1, Number(e.target.value) || 1) * 1000 })}
              className="w-20 border border-gray-300 rounded px-2 py-1"
            />
          </label>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              value={block.url || ''}
              onChange={(e) => patch({ url: e.target.value })}
              placeholder={block.type === 'video' ? 'Video URL' : 'Image URL'}
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="bg-[#1F99ED] text-white px-3 py-2 rounded-md text-xs font-medium disabled:opacity-50"
            >
              {uploading ? `Uploading… ${progress}%` : 'Upload'}
            </button>
            {block.type === 'image' && (
              <button type="button" onClick={() => setPickerOpen(true)} className="bg-white border border-[#1F99ED] text-[#1F99ED] px-3 py-2 rounded-md text-xs font-medium">
                Library
              </button>
            )}
          </div>
          {block.type === 'video' && (
            <input
              value={block.poster || ''}
              onChange={(e) => patch({ poster: e.target.value })}
              placeholder="Poster image URL (optional)"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) void uploadFile(file)
        }}
      />

      {previewUrl && block.type !== 'slideshow' && (
        <div className="relative aspect-video overflow-hidden rounded-md border border-gray-200 bg-white">
          {block.type === 'video' ? (
            <video src={previewUrl} poster={block.poster} controls className="h-full w-full object-cover" />
          ) : (
            <Image src={previewUrl} alt={block.alt || ''} fill unoptimized className="object-cover" />
          )}
        </div>
      )}

      <input
        value={block.alt || ''}
        onChange={(e) => patch({ alt: e.target.value })}
        placeholder="Alt text"
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
      />

      {error && <p className="text-xs text-red-600">{error}</p>}

      <div className="flex items-center justify-between">
        <button type="button" onClick={clear} className="text-xs text-red-500 hover:text-red-700">
          Clear media
        </button>
        <span className="text-[10px] text-gray-400">{availableTypes.map((type) => type.label).join(' · ')}</span>
      </div>

      <ImagePickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(url) => {
          if (block.type === 'slideshow') {
            patch({ slides: [...(block.slides || []), { url, alt: '' }] })
          } else {
            patch({ url })
          }
          setPickerOpen(false)
        }}
      />
    </div>
  )
}
