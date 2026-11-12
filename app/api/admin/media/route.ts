import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { uploadToBlob } from '@/lib/upload'
import { uploadToLocal, deleteFromLocal } from '@/lib/upload-local'
import { prisma } from '@/lib/prisma'
import { del } from '@vercel/blob'

// Check if Vercel Blob is configured
const USE_VERCEL_BLOB = !!process.env.BLOB_READ_WRITE_TOKEN

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

    // Use Vercel Blob in production, local storage in development
    const asset = USE_VERCEL_BLOB
      ? await uploadToBlob(file, session.user.id)
      : await uploadToLocal(file, session.user.id)

    return NextResponse.json({ asset }, { status: 201 })
  } catch (err: unknown) {
    if (err instanceof Error) {
      const code = (err as NodeJS.ErrnoException).code
      if (code === '415') return NextResponse.json({ error: err.message }, { status: 415 })
      if (code === '413') return NextResponse.json({ error: err.message }, { status: 413 })
    }
    console.error('Media upload error:', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const id = request.nextUrl.searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  try {
    const asset = await prisma.mediaAsset.findUnique({ where: { id } })
    if (!asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 })
    }

    // Delete from appropriate storage
    if (USE_VERCEL_BLOB && asset.url.startsWith('https://')) {
      await del(asset.url)
    } else {
      await deleteFromLocal(asset.url)
    }

    // Delete from database
    await prisma.mediaAsset.delete({ where: { id } })

    return new NextResponse(null, { status: 204 })
  } catch (err) {
    console.error('Media delete error:', err)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
