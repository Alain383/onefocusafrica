import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import nextAuth from '@/lib/auth'
const auth = nextAuth.auth

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const slug = request.nextUrl.searchParams.get('slug')
  const excludeId = request.nextUrl.searchParams.get('excludeId') || undefined

  if (!slug) return NextResponse.json({ unique: false })

  const existing = await prisma.post.findFirst({
    where: { slug, NOT: excludeId ? { id: excludeId } : undefined },
    select: { id: true },
  })

  return NextResponse.json({ unique: !existing })
}
