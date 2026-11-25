import { NextRequest, NextResponse } from 'next/server'
import nextAuth from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const auth = nextAuth.auth

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = (await request.json()) as {
      url?: string
      filename?: string
      originalName?: string
      mimeType?: string
      size?: number
    }

    const url = body.url?.trim()
    const filename = body.filename?.trim()
    const originalName = body.originalName?.trim() || filename
    const mimeType = body.mimeType?.trim()
    const size = body.size

    if (!url || !filename || !mimeType || !originalName || typeof size !== 'number' || !Number.isFinite(size)) {
      return NextResponse.json({ error: 'Missing media details' }, { status: 400 })
    }

    let parsedUrl: URL
    try {
      parsedUrl = new URL(url)
    } catch {
      return NextResponse.json({ error: 'Invalid media URL' }, { status: 400 })
    }
    if (parsedUrl.protocol !== 'https:') {
      return NextResponse.json({ error: 'Invalid media URL' }, { status: 400 })
    }

    const asset = await prisma.mediaAsset.upsert({
      where: { url },
      update: {},
      create: {
        filename,
        originalName,
        url,
        mimeType,
        size: Math.max(0, Math.round(size)),
        uploadedById: session.user.id,
      },
    })

    return NextResponse.json({
      asset: {
        id: asset.id,
        url: asset.url,
        filename: asset.filename,
        originalName: asset.originalName,
        size: asset.size,
        type: asset.mimeType,
        createdAt: asset.createdAt,
      },
    })
  } catch (error) {
    console.error('Register media error:', error)
    return NextResponse.json({ error: 'Could not register media' }, { status: 500 })
  }
}
