'use client'

import { signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'

interface TopBarProps {
  userName: string
}

/**
 * Derives a simple breadcrumb label from the current pathname.
 * e.g. /admin/blog/new → ["Admin", "Blog", "New"]
 */
function useBreadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  return segments.map((seg, index) => ({
    label: seg.charAt(0).toUpperCase() + seg.slice(1),
    href: '/' + segments.slice(0, index + 1).join('/'),
  }))
}

export default function TopBar({ userName }: TopBarProps) {
  const breadcrumbs = useBreadcrumbs()

  return (
    <header
      className="flex items-center justify-between h-14 px-6 bg-white border-b border-gray-200 flex-shrink-0"
      aria-label="Admin top bar"
    >
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-1 text-sm text-gray-500">
          {breadcrumbs.map((crumb, i) => (
            <li key={crumb.href} className="flex items-center gap-1">
              {i > 0 && <span aria-hidden="true">/</span>}
              <span
                className={
                  i === breadcrumbs.length - 1
                    ? 'font-medium text-gray-900'
                    : 'text-gray-500'
                }
              >
                {crumb.label}
              </span>
            </li>
          ))}
        </ol>
      </nav>

      {/* User controls */}
      <div className="flex items-center gap-4">
        <span className="hidden sm:block text-sm font-medium text-gray-700">
          {userName}
        </span>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="text-sm text-gray-500 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F99ED] rounded px-2 py-1 transition-colors"
        >
          Sign out
        </button>
      </div>
    </header>
  )
}
