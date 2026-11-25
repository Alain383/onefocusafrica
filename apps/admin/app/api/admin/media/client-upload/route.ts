import { NextRequest, NextResponse } from 'next/server'
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import nextAuth from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const auth = nextAuth.auth

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'video/mp4',
  'video/webm',
  'video/quicktime',
]

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN.startsWith('your_')) {
    return NextResponse.json(
      { error: 'BLOB_READ_WRITE_TOKEN ntabwo yashyizweho muri Vercel. Shyira token ya Vercel Blob kugira ngo upload ikore.' },
      { status: 503 }
    )
  }

  try {
    const body = (await request.json()) as HandleUploadBody

    const response = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        let originalName = pathname
        let size = 0

        try {
          const meta = clientPayload ? JSON.parse(clientPayload) as { originalName?: string; size?: number } : {}
          originalName = meta.originalName || pathname
          size = meta.size || 0
        } catch {
          originalName = clientPayload || pathname
        }

        return {
          allowedContentTypes: ALLOWED_TYPES,
          maximumSizeInBytes: 100 * 1024 * 1024,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({
            uploadedById: session.user.id,
            originalName,
            size,
          }),
        }
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        let uploadedById = session.user.id
        let originalName = blob.pathname
        let size = 0

        try {
          const meta = tokenPayload ? JSON.parse(tokenPayload) as { uploadedById?: string; originalName?: string; size?: number } : {}
          uploadedById = meta.uploadedById || uploadedById
          originalName = meta.originalName || originalName
          size = meta.size || 0
        } catch {
          console.warn('Could not parse blob token payload')
        }

        await prisma.mediaAsset.upsert({
          where: { url: blob.url },
          update: {},
          create: {
            filename: blob.pathname,
            originalName,
            url: blob.url,
            mimeType: blob.contentType || 'application/octet-stream',
            size,
            uploadedById,
          },
        })
      },
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error('Client upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
