'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import Container from '../ui/Container'
import Button from '../ui/Button'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  // Only the homepage gets the transparent-on-hero treatment
  const isHome = pathname === '/'
  // Navbar is "solid" if we're not on the homepage OR if the user has scrolled
  const solid = !isHome || scrolled

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navigation = [
    { name: 'Solutions', href: '/solutions' },
    { name: 'Our Work', href: '/work' },
    { name: 'Talent & Learning', href: '/talent' },
    { name: 'Blog & Insights', href: '/blog' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  // Helper to check if a navigation item is active
  const isActive = (href: string) => {
    if (href === '/blog') {
      return pathname === '/blog' || pathname?.startsWith('/blog/')
    }
    return pathname === href
  }

  return (
    <header
      className={[
        // Always fixed so it overlays the hero image
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        solid
          ? // Glassmorphism — semi-transparent white with blur effect
            'bg-white/80 backdrop-blur-lg border-b border-[#EEF6FD]/50 shadow-[0_1px_8px_0_rgba(31,153,237,0.07)]'
          : // On hero — fully transparent, no border, no shadow
            'bg-transparent border-b border-white/10',
      ].join(' ')}
    >
      <Container>
        <nav
          className="flex items-center justify-between gap-4 lg:gap-8 h-20 lg:h-24"
          aria-label="Global"
        >
          {/* ── Logo image ── */}
          <div className="flex lg:flex-[0_0_auto]">
            <Link
              href="/"
              className="flex items-center gap-2"
              aria-label="ONEFOCUS AFRICA — Home"
            >
              {/* Responsive logo sizing - smaller for single line fit */}
              <Image
                src="/images/onefocuslogo-official.png"
                alt="ONEFOCUS AFRICA"
                width={160}
                height={52}
                priority
                className={[
                  'h-8 sm:h-10 md:h-11 lg:h-12 w-auto object-contain transition-all duration-300',
                  solid ? 'brightness-100' : 'brightness-[10]',
                ].join(' ')}
              />
              <span
                className={[
                  'text-xs sm:text-sm md:text-sm lg:text-base font-bold tracking-[0.08em] uppercase transition-colors duration-300 whitespace-nowrap',
                  solid ? 'text-[#10183F]' : 'text-white',
                ].join(' ')}
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                ONEFOCUS AFRICA
              </span>
            </Link>
          </div>

          {/* ── Mobile menu button ── */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className={[
                'inline-flex items-center justify-center p-2.5 rounded-[5px] transition-colors',
                solid
                  ? 'text-[#10183F] hover:text-[#1F99ED] hover:bg-[#EEF6FD]'
                  : 'text-white hover:text-[#1F99ED] hover:bg-white/10',
              ].join(' ')}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
              {isMenuOpen ? (
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>

          {/* ── Desktop nav links ── */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-center lg:gap-x-6 xl:gap-x-8 lg:whitespace-nowrap" role="menubar">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                role="menuitem"
                className={[
                  'text-sm font-medium transition-colors relative group',
                  isActive(item.href)
                    ? solid
                      ? 'text-[#1F99ED]'
                      : 'text-[#1F99ED]'
                    : solid
                      ? 'text-[#10183F] hover:text-[#1F99ED]'
                      : 'text-white/90 hover:text-[#1F99ED]',
                ].join(' ')}
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {item.name}
                {/* Picton Blue underline on hover or active */}
                <span
                  className={[
                    'absolute -bottom-1 left-0 h-0.5 bg-[#1F99ED] transition-all duration-200 rounded-full',
                    isActive(item.href) ? 'w-full' : 'w-0 group-hover:w-full',
                  ].join(' ')}
                />
              </Link>
            ))}
          </div>

          {/* ── CTA ── */}
          <div className="hidden lg:flex lg:flex-[0_0_auto]">
            <Button href="/contact" variant="primary" size="sm">
              Start a Project →
            </Button>
          </div>
        </nav>

        {/* ── Mobile menu ── */}
        {isMenuOpen && (
          <div
            id="mobile-menu"
            className={[
              'lg:hidden border-t',
              solid ? 'border-[#EEF6FD]/50 bg-white/90 backdrop-blur-md' : 'border-white/10 bg-[#10183F]/90 backdrop-blur-md',
            ].join(' ')}
          >
            <div className="space-y-1 pb-4 pt-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={[
                    'block px-3 py-2.5 text-base font-medium rounded-[5px] transition-colors',
                    isActive(item.href)
                      ? solid
                        ? 'bg-[#EEF6FD] text-[#1F99ED]'
                        : 'bg-white/10 text-[#1F99ED]'
                      : solid
                        ? 'text-[#10183F] hover:bg-[#EEF6FD] hover:text-[#1F99ED]'
                        : 'text-white hover:bg-white/10 hover:text-[#1F99ED]',
                  ].join(' ')}
                  style={{ fontFamily: 'var(--font-body)' }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-3 pt-3">
                <Button
                  href="/contact"
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Start a Project →
                </Button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </header>
  )
}
