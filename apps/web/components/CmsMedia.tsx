'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import type { MediaBlock } from '@onefocus/shared/media'

type CmsMediaProps = {
  block: MediaBlock
  className?: string
  imageClassName?: string
  sizes?: string
  priority?: boolean
  width?: number
  height?: number
}

export default function CmsMedia({
  block,
  className = '',
  imageClassName = '',
  sizes = '(max-width: 768px) 100vw, 50vw',
  priority = false,
  width,
  height,
}: CmsMediaProps) {
  const [active, setActive] = useState(0)
  const slides = block.slides?.filter((slide) => slide?.url) || []
  const fillPosition = width && height ? '' : 'absolute inset-0 h-full w-full'

  useEffect(() => {
    if (block.type !== 'slideshow' || slides.length < 2) return
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length)
    }, block.interval && block.interval >= 1000 ? block.interval : 4000)
    return () => window.clearInterval(timer)
  }, [block.type, block.interval, slides.length])

  if (block.type === 'video' && block.url) {
    return (
      <video
        width={width}
        height={height}
        className={`${fillPosition} ${className} ${imageClassName}`.trim()}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={block.poster || undefined}
        aria-label={block.alt || undefined}
      >
        <source src={block.url} />
      </video>
    )
  }

  if (block.type === 'slideshow' && slides.length > 0) {
    if (width && height) {
      return (
        <div className={`${className} relative`.trim()}>
          {slides.map((slide, index) => (
            <Image
              key={`${slide.url}-${index}`}
              src={slide.url}
              alt={slide.alt || block.alt || ''}
              width={width}
              height={height}
              className={`${className} ${imageClassName} ${
                index === 0 ? '' : 'absolute inset-0 h-full w-full'
              } transition-opacity duration-700 ${
                index === active ? 'opacity-100' : 'opacity-0'
              }`.trim()}
              priority={index === 0 && priority}
            />
          ))}
        </div>
      )
    }

    return (
      <div className={`${className} absolute inset-0 h-full w-full`.trim()}>
        {slides.map((slide, index) => (
          <Image
            key={`${slide.url}-${index}`}
            src={slide.url}
            alt={slide.alt || block.alt || ''}
            fill
            sizes={sizes}
            className={`${className} ${imageClassName} transition-opacity duration-700 ${
              index === active ? 'opacity-100' : 'opacity-0'
            }`.trim()}
            priority={index === 0 && priority}
          />
        ))}
      </div>
    )
  }

  const src = block.url || slides[0]?.url
  if (!src) {
    return <div className={`${fillPosition} ${className} bg-neutral-100`.trim()} aria-hidden="true" />
  }

  if (width && height) {
    return (
      <Image
        src={src}
        alt={block.alt || ''}
        width={width}
        height={height}
        className={`${className} ${imageClassName}`.trim()}
        priority={priority}
      />
    )
  }

  return (
    <Image
      src={src}
      alt={block.alt || ''}
      fill
      sizes={sizes}
      className={`${className} ${imageClassName}`.trim()}
      priority={priority}
    />
  )
}
