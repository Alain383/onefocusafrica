'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Container from '../ui/Container'

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(2024)

  useEffect(() => {
    setCurrentYear(new Date().getFullYear())
  }, [])

  const footerLinks = {
    Business: [
      { name: 'Solutions', href: '/solutions' },
      { name: 'Marketing Tours', href: '/solutions#marketing-tours' },
      { name: 'Our Work', href: '/work' },
      { name: 'Start a Project', href: '/contact' },
    ],
    Ecosystem: [
      { name: 'Talent & Learning', href: '/talent' },
      { name: 'Academy', href: '/talent#academy' },
      { name: 'VIP Community', href: '/talent#community' },
      { name: 'Blog & Insights', href: '/blog' },
    ],
    Company: [
      { name: 'About', href: '/about' },
      { name: 'Contact', href: '/contact' },
    ],
  }

  return (
    // Dark background — #10183F per brand color system
    <footer className="bg-[#10183F] text-white">
      <Container>
        <div className="py-14 lg:py-20">
          {/* ── Main footer grid ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

            {/* Brand column */}
            <div className="lg:col-span-1">
              {/* Wordmark — Rowdies, Picton Blue + white */}
              <div className="mb-5">
                <Link
                  href="/"
                  className="flex items-baseline gap-1"
                  aria-label="ONEFOCUS AFRICA — Home"
                >
                  <span
                    className="text-xl font-bold text-[#1F99ED]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    ONEFOCUS
                  </span>
                  <span
                    className="text-xl font-bold text-white"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    &nbsp;AFRICA
                  </span>
                </Link>
                {/* Tagline from brand guidelines */}
                <p
                  className="text-xs text-[#1F99ED] font-medium mt-1 tracking-wide"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Success of your Dream
                </p>
              </div>

              <p
                className="text-gray-400 text-sm mb-6 leading-relaxed"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Integrated growth strategy, cinematic media, digital solutions and talent development.
              </p>

              {/* Contact info — Poppins Regular 14px */}
              <div className="space-y-2 text-sm" style={{ fontFamily: 'var(--font-body)' }}>
                <p className="text-gray-400">Kigali, Rwanda</p>
                <p>
                  <a
                    href="mailto:onefocusafrica@gmail.com"
                    className="text-gray-400 hover:text-[#1F99ED] transition-colors"
                  >
                    onefocusafrica@gmail.com
                  </a>
                </p>
                <p>
                  <a
                    href="tel:+250781102667"
                    className="text-gray-400 hover:text-[#1F99ED] transition-colors"
                  >
                    +250 781 102 667
                  </a>
                </p>
              </div>
            </div>

            {/* Footer link columns — Poppins typography */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                {/* Column heading — Poppins SemiBold */}
                <h4
                  className="font-semibold text-white text-sm uppercase tracking-widest mb-4"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {category}
                </h4>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-400 hover:text-[#1F99ED] transition-colors"
                        style={{ fontFamily: 'var(--font-body)' }}
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* ── Bottom bar ── */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Caption level — Poppins Regular 12-14px */}
              <p
                className="text-sm text-gray-500"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                © {currentYear} ONEFOCUS AFRICA. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm text-gray-500" style={{ fontFamily: 'var(--font-body)' }}>
                <Link href="/privacy" className="hover:text-[#1F99ED] transition-colors">
                  Privacy
                </Link>
                <Link href="/terms" className="hover:text-[#1F99ED] transition-colors">
                  Terms
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}
