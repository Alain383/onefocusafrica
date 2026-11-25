import { cache } from 'react'
import { prisma } from '@/lib/prisma'
import { defaultMediaBlock, parseMediaBlock, slotForKey, type MediaBlock } from '@onefocus/shared'
import { pageTextDefault } from '@onefocus/shared/page-text'

const getSiteContentMap = cache(async (): Promise<Map<string, string>> => {
  try {
    const rows = await prisma.siteContent.findMany({
      select: { section: true, key: true, value: true },
    })
    return new Map(rows.map((row) => [`${row.section}:${row.key}`, row.value]))
  } catch {
    return new Map()
  }
})

export async function getSiteContent(
  section: string,
  key: string,
  fallback: string
): Promise<string> {
  const content = await getSiteContentMap()
  return content.get(`${section}:${key}`) ?? fallback
}

export async function getPageText(section: string, key: string): Promise<string> {
  return getSiteContent(section, key, pageTextDefault(section, key))
}

export async function getMediaBlock(slotKey: string): Promise<MediaBlock> {
  const slot = slotForKey(slotKey)
  const fallback = slot ? defaultMediaBlock(slot) : { type: 'image' as const, url: '', alt: '' }
  const content = await getSiteContentMap()
  return parseMediaBlock(content.get(`media:${slotKey}`), fallback.url, fallback.alt)
}

export function toMediaBlock(raw?: string | null, fallbackUrl = '', fallbackAlt = ''): MediaBlock {
  return parseMediaBlock(raw, fallbackUrl, fallbackAlt)
}

export function parseTextRows(value: string): string[][] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split('|').map((part) => part.trim()))
}

export function parseTextLines(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}
