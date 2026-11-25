import { parseMediaBlock, type MediaBlock } from '@onefocus/shared/media'

export type CaseStudyRecord = {
  id: string
  title: string
  slug: string
  category: string
  clientName: string | null
  challenge: string
  solution: string
  outcome: string
  deliverables: string
  publishedAssets: string
  updatedAt: Date
}

export function parseList(value: string): string[] {
  try {
    const parsed: unknown = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.map(String).filter(Boolean) : []
  } catch {
    return []
  }
}

export function caseCover(value: string, fallback: MediaBlock): MediaBlock {
  const assets = parseList(value)
  if (assets.length === 0) return fallback
  return parseMediaBlock(assets[0], assets[0], '')
}
