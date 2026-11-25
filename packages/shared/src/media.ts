export type MediaType = 'image' | 'video' | 'slideshow'

export type MediaSlide = {
  url: string
  alt?: string
}

export type MediaBlock = {
  type: MediaType
  url?: string
  poster?: string
  alt?: string
  interval?: number
  slides?: MediaSlide[]
}

export type MediaSlot = {
  key: string
  label: string
  description: string
  defaultUrl: string
  defaultAlt: string
}

export const MEDIA_SLOTS: MediaSlot[] = [
  { key: 'site.logo', label: 'Site logo', description: 'Header logo on every page', defaultUrl: '/images/onefocuslogo-official.webp', defaultAlt: 'ONEFOCUS AFRICA' },
  { key: 'home.hero', label: 'Homepage hero', description: 'Homepage – large hero image', defaultUrl: '/images/heroimage.webp', defaultAlt: 'Urubyiruko rwa ONEFOCUS AFRICA' },
  { key: 'about.hero', label: 'About hero', description: 'About page – hero image', defaultUrl: '/images/office1.webp', defaultAlt: 'Itsinda rya ONEFOCUS AFRICA mu biro' },
  { key: 'about.team', label: 'About team', description: 'About page – team section', defaultUrl: '/images/team.webp', defaultAlt: 'Itsinda rya ONEFOCUS AFRICA' },
  { key: 'about.workspace', label: 'About workspace', description: 'About page – workspace section', defaultUrl: '/images/office.webp', defaultAlt: 'Abakozi ba ONEFOCUS AFRICA bakora' },
  { key: 'about.location', label: 'About location', description: 'About page – office section', defaultUrl: '/images/officepersonal.webp', defaultAlt: 'Ibiro bya ONEFOCUS AFRICA' },
  { key: 'work.hero', label: 'Work hero', description: 'Work page – hero image', defaultUrl: '/images/workshop.webp', defaultAlt: 'Amahugurwa ya ONEFOCUS AFRICA' },
  { key: 'work.project1', label: 'Work project 1', description: 'Work page – first project card', defaultUrl: '/images/recept.webp', defaultAlt: 'Umushinga wa ONEFOCUS AFRICA' },
  { key: 'work.project2', label: 'Work project 2', description: 'Work page – second project card', defaultUrl: '/images/media.webp', defaultAlt: 'Umushinga wa media' },
  { key: 'work.project3', label: 'Work project 3', description: 'Work page – third project card', defaultUrl: '/images/guest.webp', defaultAlt: 'Umwenyi muri gahunda' },
  { key: 'solutions.strategy', label: 'Solutions strategy', description: 'Solutions page – Strategy section', defaultUrl: '/images/office1.webp', defaultAlt: 'Ingamba za ONEFOCUS AFRICA' },
  { key: 'solutions.media', label: 'Solutions media', description: 'Solutions page – Media section', defaultUrl: '/images/media.webp', defaultAlt: 'Media na podcast' },
  { key: 'solutions.technology', label: 'Solutions technology', description: 'Solutions page – Technology section', defaultUrl: '/images/office.webp', defaultAlt: 'Ikoranabuhanga muri ONEFOCUS AFRICA' },
  { key: 'solutions.training', label: 'Solutions training', description: 'Solutions page – Training section', defaultUrl: '/images/workshop.webp', defaultAlt: 'Amahugurwa y’urubyiruko' },
  { key: 'solutions.highlight', label: 'Solutions highlight', description: 'Solutions page – bottom feature image', defaultUrl: '/images/podcast.webp', defaultAlt: 'Podcast ya ONEFOCUS AFRICA' },
  { key: 'talent.hero', label: 'Talent hero', description: 'Talent page – hero image', defaultUrl: '/images/workshop.webp', defaultAlt: 'Amahugurwa y’impano' },
  { key: 'talent.program', label: 'Talent program', description: 'Talent page – program section', defaultUrl: '/images/podcast.webp', defaultAlt: 'Gahunda y’impano' },
  { key: 'talent.community', label: 'Talent community', description: 'Talent page – community section', defaultUrl: '/images/team.webp', defaultAlt: 'Itsinda ry’abaturage' },
  { key: 'contact.hero', label: 'Contact hero', description: 'Contact page – hero image', defaultUrl: '/images/personal.webp', defaultAlt: 'Kwakira abatumirwa' },
]

export function slotForKey(key: string): MediaSlot | undefined {
  return MEDIA_SLOTS.find((slot) => slot.key === key)
}

export function defaultMediaBlock(slot: MediaSlot): MediaBlock {
  return { type: 'image', url: slot.defaultUrl, alt: slot.defaultAlt }
}

export function isMediaBlock(value: unknown): value is MediaBlock {
  if (!value || typeof value !== 'object') return false
  const block = value as MediaBlock
  return block.type === 'image' || block.type === 'video' || block.type === 'slideshow'
}

export function parseMediaBlock(raw?: string | null, fallbackUrl?: string, fallbackAlt?: string): MediaBlock {
  const fallback: MediaBlock = {
    type: 'image',
    url: fallbackUrl || '',
    alt: fallbackAlt || '',
  }

  if (!raw || !raw.trim()) return fallback

  const trimmed = raw.trim()
  if (trimmed.startsWith('{')) {
    try {
      const parsed: unknown = JSON.parse(trimmed)
      if (isMediaBlock(parsed)) {
        return {
          ...parsed,
          alt: parsed.alt || fallbackAlt || '',
          interval: parsed.interval && parsed.interval >= 1000 ? parsed.interval : 4000,
          slides: Array.isArray(parsed.slides) ? parsed.slides.filter((slide) => slide && typeof slide.url === 'string' && slide.url) : [],
        }
      }
    } catch {
      return fallback
    }
  }

  return { ...fallback, url: trimmed }
}

export function serializeMediaBlock(block: MediaBlock): string {
  return JSON.stringify({
    type: block.type,
    url: block.url?.trim() || '',
    poster: block.poster?.trim() || '',
    alt: block.alt?.trim() || '',
    interval: block.interval && block.interval >= 1000 ? block.interval : 4000,
    slides: (block.slides || [])
      .map((slide) => ({ url: slide.url?.trim() || '', alt: slide.alt?.trim() || '' }))
      .filter((slide) => slide.url),
  })
}

export function mediaFirstImage(block: MediaBlock): string {
  if (block.type === 'slideshow') return block.slides?.[0]?.url || ''
  if (block.type === 'video') return block.poster || ''
  return block.url || ''
}
