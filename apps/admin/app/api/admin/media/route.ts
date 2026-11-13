import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import nextAuth from '@/lib/auth'
const auth = nextAuth.auth
import { prisma } from '@/lib/prisma'

// NOTE: Existing images in apps/web/public/uploads are preserved for backward compatibility.
// New uploads will use Vercel Blob storage for production-ready, persistent storage.
// Migration path: Update MediaAsset records to point to new blob URLs after re-uploading images.

export async function POST(request: NextRequest) {
  // Authentication check
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Only JPG, PNG, and WebP images are allowed' }, { status: 400 })
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 10 MB' }, { status: 400 })
    }

    // Upload to Vercel Blob storage
    const blob = await put(file.name, file, {
      access: 'public',
      addRandomSuffix: true,
    })

    // Save to database with blob URL
    const asset = await prisma.mediaAsset.create({
      data: {
        filename: blob.pathname,
        originalName: file.name,
        url: blob.url,
        mimeType: file.type,
        size: file.size,
        uploadedById: session.user.id,
      },
    })

    return NextResponse.json({
      asset: {
        id: asset.id,
        url: blob.url,
        filename: blob.pathname,
        originalName: file.name,
        size: file.size,
        type: file.type,
        createdAt: asset.createdAt,
      },
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}