'use client'

import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'

export type ClientLogo = {
  id: string
  name: string
  logo: string
  website: string | null
}

const ITEM_WIDTH = 300
const SPEED = 22

function logoLink(logo: ClientLogo) {
  if (logo.website) return logo.website
  try {
    const url = new URL(logo.name)
    return url.protocol === 'http:' || url.protocol === 'https:' ? logo.name : null
  } catch {
    return null
  }
}

export default function ClientLogosCarousel({ logos }: { logos: ClientLogo[] }) {
  const stageRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const offsetRef = useRef(0)
  const pausedRef = useRef(false)
  const reducedRef = useRef(false)
  const tweenRef = useRef<{ start: number; from: number; to: number; duration: number } | null>(null)

  const [centerIndex, setCenterIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const copies = logos.length > 1 ? 6 : 1
  const loop = useMemo(
    () => Array.from({ length: copies }, (_, copy) => logos.map((logo) => ({ ...logo, copy }))).flat(),
    [copies, logos]
  )
  const setWidth = logos.length * ITEM_WIDTH

  useEffect(() => {
    pausedRef.current = paused
  }, [paused])

  useEffect(() => {
    reducedRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  useEffect(() => {
    if (logos.length < 2) return

    let frame = 0
    let last = performance.now()

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now

      if (!pausedRef.current && !reducedRef.current) {
        const tween = tweenRef.current
        if (tween) {
          const progress = Math.min((now - tween.start) / tween.duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          offsetRef.current = tween.from + (tween.to - tween.from) * eased
          if (progress >= 1) tweenRef.current = null
        } else {
          offsetRef.current -= SPEED * dt
        }

        if (offsetRef.current <= -setWidth) offsetRef.current += setWidth
        if (offsetRef.current > 0) offsetRef.current -= setWidth
      }

      const track = trackRef.current
      if (track) {
        track.style.transform = `translate3d(${offsetRef.current}px, -50%, 0)`
      }

      const stageWidth = stageRef.current?.offsetWidth ?? 0
      const centerPos = -offsetRef.current + stageWidth / 2
      const rawIndex = Math.floor(centerPos / ITEM_WIDTH)
      const normalized = ((rawIndex % logos.length) + logos.length) % logos.length
      setCenterIndex((current) => (current === normalized ? current : normalized))

      frame = window.requestAnimationFrame(tick)
    }

    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [logos.length, setWidth])

  const nudge = (direction: number) => {
    if (logos.length < 2) return
    const from = offsetRef.current
    tweenRef.current = {
      start: performance.now(),
      from,
      to: from - direction * ITEM_WIDTH,
      duration: 700,
    }
  }

  const activeLogo = logos[centerIndex]

  return (
    <div
      ref={stageRef}
      className="client-logos-stage"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="client-logos-glow" aria-hidden="true" />

      <div className="client-logos-viewport">
        <div ref={trackRef} className="client-logos-track">
          {loop.map((logo, index) => {
            const isCenterCopy = index % logos.length === centerIndex && index >= logos.length && index < logos.length * 2
            const href = logoLink(logo)
            const content = (
              <span className="client-logo-card" data-center={isCenterCopy ? 'true' : undefined}>
                <span className="client-logo-media">
                  <Image
                    src={logo.logo}
                    alt={logo.name}
                    width={240}
                    height={96}
                    unoptimized
                    className="client-logo-image"
                  />
                </span>
                <span className="client-logo-name">{logo.name}</span>
              </span>
            )

            return (
              <div key={`${logo.id}-${logo.copy}-${index}`} className="client-logo-item">
                {href ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="client-logo-link"
                    aria-label={`Visit ${logo.name}`}
                  >
                    {content}
                  </a>
                ) : (
                  content
                )}
              </div>
            )
          })}
        </div>
      </div>

      <button
        type="button"
        className="client-logos-arrow client-logos-arrow-left"
        onClick={() => nudge(-1)}
        disabled={logos.length < 2}
        aria-label="Previous client logo"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <button
        type="button"
        className="client-logos-arrow client-logos-arrow-right"
        onClick={() => nudge(1)}
        disabled={logos.length < 2}
        aria-label="Next client logo"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {activeLogo && <span className="sr-only" aria-live="polite">{activeLogo.name}</span>}
    </div>
  )
}
