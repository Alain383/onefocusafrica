'use client'

import { signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import AdminIcon from './AdminIcon'
import { ADMIN_NAV_PARENTS, type AdminRole } from './admin-nav'
import { ADMIN_QUICK_ACTIONS } from './quick-actions'

interface TopBarProps {
  userName: string
  role: AdminRole
}

export default function TopBar({ userName, role }: TopBarProps) {
  const pathname = usePathname()
  const headerRef = useRef<HTMLElement>(null)
  const [desktopOpen, setDesktopOpen] = useState<string | null>(null)
  const [quickOpen, setQuickOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)

  const parents = useMemo(
    () =>
      ADMIN_NAV_PARENTS.map((parent) => ({
        ...parent,
        children: parent.children.filter((child) => child.roles.includes(role)),
      })).filter((parent) => parent.children.length > 0),
    [role]
  )

  const quickActions = useMemo(
    () => ADMIN_QUICK_ACTIONS.filter((action) => action.roles.includes(role)),
    [role]
  )

  const activeChild = useMemo(
    () =>
      parents
        .flatMap((parent) => parent.children)
        .sort((a, b) => b.href.length - a.href.length)
        .find((child) =>
          child.href === '/admin'
            ? pathname === '/admin'
            : pathname === child.href || pathname.startsWith(`${child.href}/`)
        ),
    [parents, pathname]
  )

  const activeParentId = parents.find((parent) =>
    parent.children.some((child) => child.href === activeChild?.href)
  )?.id

  useEffect(() => {
    setDesktopOpen(null)
    setQuickOpen(false)
    setMobileOpen(false)
    setMobileExpanded(null)
  }, [pathname])

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setDesktopOpen(null)
        setQuickOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setDesktopOpen(null)
        setQuickOpen(false)
        setMobileOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  function childLinkClasses(href: string): string {
    return `flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors ${
      activeChild?.href === href
        ? 'bg-[#EEF6FD] text-[#10183F]'
        : 'text-[#6B7280] hover:bg-[#F5F8FC] hover:text-[#10183F]'
    }`
  }

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 border-b border-[#E7ECF3] bg-white/95 backdrop-blur"
      aria-label="Admin navigation"
    >
      <div className="mx-auto flex h-16 max-w-[1500px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/admin" className="flex min-w-0 items-center gap-2.5 rounded-lg" aria-label="Admin dashboard">
          <Image
            src="/images/onefocuslogo-on-light.png?v=2"
            alt="ONEFOCUS AFRICA"
            width={484}
            height={512}
            priority
            className="h-9 w-auto flex-shrink-0 object-contain"
          />
          <span className="hidden min-w-0 sm:block">
            <span className="block truncate text-sm font-semibold leading-tight text-[#10183F]">
              ONEFOCUS AFRICA
            </span>
            <span className="block truncate text-[9px] font-semibold uppercase tracking-[0.18em] text-[#1F99ED]">
              Control room
            </span>
          </span>
        </Link>

        <nav className="ml-2 hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          {parents.map((parent) => {
            const isOpen = desktopOpen === parent.id
            const isActive = activeParentId === parent.id

            return (
              <div key={parent.id} className="relative">
                <button
                  type="button"
                  onClick={() => setDesktopOpen((current) => (current === parent.id ? null : parent.id))}
                  aria-expanded={isOpen}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                    isActive || isOpen
                      ? 'bg-[#EEF6FD] text-[#1F99ED]'
                      : 'text-[#5B6472] hover:bg-[#F5F7FB] hover:text-[#10183F]'
                  }`}
                >
                  <AdminIcon name={parent.icon} className="h-4 w-4" />
                  {parent.label}
                </button>

                {isOpen && (
                  <div className="absolute left-0 top-full z-50 mt-2 w-72 rounded-2xl border border-[#E7ECF3] bg-white p-2 shadow-[0_18px_48px_rgba(16,24,63,0.16)]">
                    <p className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9AA3B2]">
                      {parent.label}
                    </p>
                    <div className="space-y-0.5">
                      {parent.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setDesktopOpen(null)}
                          className={childLinkClasses(child.href)}
                          aria-current={activeChild?.href === child.href ? 'page' : undefined}
                        >
                          <span
                            className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${
                              activeChild?.href === child.href
                                ? 'bg-[#1F99ED] text-white'
                                : 'bg-[#F5F7FB] text-[#1F99ED]'
                            }`}
                          >
                            <AdminIcon name={child.icon} className="h-4 w-4" />
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-xs font-semibold">{child.label}</span>
                            <span className="block truncate text-[11px] text-[#9AA3B2]">
                              {child.description}
                            </span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setQuickOpen((current) => !current)}
              aria-expanded={quickOpen}
              aria-label="Quick actions"
              className="flex items-center gap-2 rounded-xl bg-[#10183F] px-2.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1F99ED] md:px-3"
            >
              <AdminIcon name="plus" className="h-4 w-4" />
              <span className="hidden md:inline">Quick actions</span>
            </button>

            {quickOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-[19rem] rounded-2xl border border-[#E7ECF3] bg-white p-2 shadow-[0_18px_48px_rgba(16,24,63,0.16)]">
                <p className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9AA3B2]">
                  Jump straight to
                </p>
                <div className="space-y-0.5">
                  {quickActions.map((action) => (
                    <Link
                      key={action.href}
                      href={action.href}
                      onClick={() => setQuickOpen(false)}
                      className={childLinkClasses(action.href)}
                    >
                      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#F5F7FB] text-[#1F99ED]">
                        <AdminIcon name={action.icon} className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-xs font-semibold">{action.label}</span>
                        <span className="block truncate text-[11px] text-[#9AA3B2]">
                          {action.description}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <a
            href="https://onefocus-africa.vercel.app"
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-1.5 rounded-xl border border-[#E7ECF3] px-3 py-2 text-xs font-medium text-[#2E3192] transition-colors hover:bg-[#EEF6FD] md:flex"
          >
            View site
            <AdminIcon name="external" className="h-3.5 w-3.5" />
          </a>

          <div className="hidden items-center gap-2 rounded-full bg-[#F5F7FB] py-1 pl-1 pr-3 sm:flex">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1F99ED] text-[10px] font-bold text-white">
              {userName.slice(0, 2).toUpperCase()}
            </span>
            <span className="max-w-[120px] truncate text-xs font-medium text-[#10183F]">{userName}</span>
          </div>

          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/auth/login' })}
            className="hidden rounded-xl px-3 py-2 text-xs font-medium text-[#6B7280] transition-colors hover:bg-[#F5F7FB] hover:text-[#10183F] sm:block"
          >
            Sign out
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="rounded-xl border border-[#E7ECF3] p-2 text-[#10183F] lg:hidden"
            aria-label="Open navigation"
          >
            <AdminIcon name="menu" className="h-5 w-5" />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-[#10183F]/60 backdrop-blur-sm"
            aria-label="Close navigation"
          />
          <div className="absolute inset-x-0 top-0 max-h-[88vh] overflow-y-auto rounded-b-3xl bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-[#EEF1F6] bg-white px-4 py-3">
              <div className="flex items-center gap-2.5">
                <Image
                  src="/images/onefocuslogo-on-light.png?v=2"
                  alt="ONEFOCUS AFRICA"
                  width={484}
                  height={512}
                  className="h-9 w-auto object-contain"
                />
                <div>
                  <p className="text-sm font-semibold text-[#10183F]">ONEFOCUS AFRICA</p>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#1F99ED]">
                    Control room
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl p-2 text-[#6B7280] hover:bg-[#F5F7FB]"
                aria-label="Close navigation"
              >
                <AdminIcon name="close" className="h-5 w-5" />
              </button>
            </div>

            <nav className="space-y-2 p-4" aria-label="Mobile navigation">
              <div className="mb-4 rounded-2xl bg-[#10183F] p-3">
                <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/50">
                  Quick actions
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action) => (
                    <Link
                      key={action.href}
                      href={action.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2.5 text-white transition-colors hover:bg-white/15"
                    >
                      <AdminIcon name={action.icon} className="h-4 w-4 flex-shrink-0 text-[#1F99ED]" />
                      <span className="truncate text-xs font-medium">{action.label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {parents.map((parent) => {
                const isExpanded = mobileExpanded === parent.id
                const isActive = activeParentId === parent.id

                return (
                  <div key={parent.id} className="rounded-2xl border border-[#EEF1F6]">
                    <button
                      type="button"
                      onClick={() => setMobileExpanded((current) => (current === parent.id ? null : parent.id))}
                      aria-expanded={isExpanded}
                      className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left ${
                        isActive ? 'bg-[#EEF6FD]' : ''
                      }`}
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#10183F] text-white">
                        <AdminIcon name={parent.icon} className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-[#10183F]">{parent.label}</span>
                        <span className="block text-[11px] text-[#9AA3B2]">
                          {parent.children.length} {parent.children.length === 1 ? 'page' : 'pages'}
                        </span>
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="space-y-0.5 border-t border-[#EEF1F6] p-2">
                        {parent.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setMobileOpen(false)}
                            className={childLinkClasses(child.href)}
                            aria-current={activeChild?.href === child.href ? 'page' : undefined}
                          >
                            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#F5F7FB] text-[#1F99ED]">
                              <AdminIcon name={child.icon} className="h-4 w-4" />
                            </span>
                            <span className="min-w-0">
                              <span className="block truncate text-xs font-semibold">{child.label}</span>
                              <span className="block truncate text-[11px] text-[#9AA3B2]">
                                {child.description}
                              </span>
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}

              <div className="flex items-center justify-between gap-2 rounded-2xl bg-[#F5F7FB] px-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-[#10183F]">{userName}</p>
                  <p className="text-[11px] capitalize text-[#9AA3B2]">{role} access</p>
                </div>
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: '/auth/login' })}
                  className="rounded-xl bg-white px-3 py-2 text-xs font-medium text-[#6B7280] shadow-sm"
                >
                  Sign out
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
