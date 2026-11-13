import { NextRequest, NextResponse } from 'next/server'
import { put, del } from '@vercel/blob'
import nextAuth from '@/lib/auth'
const auth = nextAuth.auth
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
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

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Only JPG, PNG, WebP, GIF, and SVG images are allowed' }, { status: 400 })
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 10 MB' }, { status: 400 })
    }

    // Upload to Vercel Blob storage
    const blob = await put(file.name, file, {
      access: 'public',
      addRandomSuffix: true,
    })

    // Save to database
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

export async function DELETE(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Asset ID required' }, { status: 400 })
    }

    const asset = await prisma.mediaAsset.findUnique({ where: { id } })
    if (!asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 })
    }

    // Delete from Vercel Blob
    try {
      await del(asset.url)
    } catch (blobErr) {
      console.warn('Blob delete warning (file may already be gone):', blobErr)
    }

    // Delete from database
    await prisma.mediaAsset.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}