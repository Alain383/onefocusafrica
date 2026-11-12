import { put } from '@vercel/blob'
import { prisma } from '@/lib/prisma'
import type { MediaAsset } from '@prisma/client'

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'application/pdf',
]

const MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB

export async function uploadToBlob(
  file: File,
  uploadedById: string
): Promise<MediaAsset> {
  // 1. Validate MIME type BEFORE any Blob call
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    const error = new Error(
      'Only JPEG, PNG, WebP, GIF, SVG, and PDF files are accepted.'
    )
    ;(error as NodeJS.ErrnoException).code = '415'
    throw error
  }

  // 2. Validate file size BEFORE any Blob call
  if (file.size > MAX_SIZE_BYTES) {
    const error = new Error('File exceeds the 10 MB limit.')
    ;(error as NodeJS.ErrnoException).code = '413'
    throw error
  }

  // 3. Generate UUID-prefixed filename using built-in crypto (Node.js 14.17+)
  const ext = file.name.split('.').pop() ?? ''
  const filename = `${crypto.randomUUID()}${ext ? '.' + ext : ''}`

  // 4. Upload to Vercel Blob
  const blob = await put(filename, file, { access: 'public' })

  // 5. Persist MediaAsset record
  const asset = await prisma.mediaAsset.create({
    data: {
      filename,
      originalName: file.name,
      url: blob.url,
      mimeType: file.type,
      size: file.size,
      uploadedById,
    },
  })

  return asset
}
