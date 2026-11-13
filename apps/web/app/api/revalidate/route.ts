import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

/**
 * Revalidation webhook - called by admin app after content changes.
 * Requires REVALIDATE_SECRET to match to prevent unauthorized cache busting.
 *
 * Usage: POST /api/revalidate
 * Body: { secret: string, paths: string[] }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { secret?: string; paths?: string[] }

    // Validate secret
    const secret = process.env.REVALIDATE_SECRET
    if (!secret || body.secret !== secret) {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
    }

    const paths: string[] = body.paths ?? ['/']

    // Revalidate each path
    for (const path of paths) {
      revalidatePath(path)
    }

    return NextResponse.json({
      revalidated: true,
      paths,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 })
  }
}
