import { writeFile } from 'fs/promises'
import { join } from 'path'
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

export async function uploadToLocal(
  file: File,
  uploadedById: string
): Promise<MediaAsset> {
  // 1. Validate MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    const error = new Error(
      'Only JPEG, PNG, WebP, GIF, SVG, and PDF files are accepted.'
    )
    ;(error as NodeJS.ErrnoException).code = '415'
    throw error
  }

  // 2. Validate file size
  if (file.size > MAX_SIZE_BYTES) {
    const error = new Error('File exceeds the 10 MB limit.')
    ;(error as NodeJS.ErrnoException).code = '413'
    throw error
  }

  // 3. Generate UUID-prefixed filename
  const ext = file.name.split('.').pop() ?? ''
  const filename = `${crypto.randomUUID()}${ext ? '.' + ext : ''}`

  // 4. Save file to public/uploads directory
  const buffer = Buffer.from(await file.arrayBuffer())
  const publicPath = join(process.cwd(), 'public', 'uploads', filename)
  await writeFile(publicPath, buffer)

  // 5. Create URL (will be served from /uploads/filename)
  const url = `/uploads/${filename}`

  // 6. Persist MediaAsset record
  const asset = await prisma.mediaAsset.create({
    data: {
      filename,
      originalName: file.name,
      url,
      mimeType: file.type,
      size: file.size,
      uploadedById,
    },
  })

  return asset
}

export async function deleteFromLocal(url: string): Promise<void> {
  // Only delete if it's a local file
  if (!url.startsWith('/uploads/')) {
    return
  }

  const filename = url.replace('/uploads/', '')
  const publicPath = join(process.cwd(), 'public', 'uploads', filename)
  
  try {
    const { unlink } = await import('fs/promises')
    await unlink(publicPath)
  } catch (err) {
    console.error('Failed to delete local file:', err)
  }
}
