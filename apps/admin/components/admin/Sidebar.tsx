'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SidebarProps {
  role: 'ADMIN' | 'EDITOR'
  userName: string
}

interface NavItem {
  label: string
  href: string
  roles: Array<'ADMIN' | 'EDITOR'>
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Overview',           href: '/admin',           roles: ['ADMIN', 'EDITOR'] },
  { label: 'Blog & Articles',    href: '/admin/blog',      roles: ['ADMIN', 'EDITOR'] },
  { label: 'Media Library',      href: '/admin/media',     roles: ['ADMIN', 'EDITOR'] },
  { label: 'Website Content',    href: '/admin/content',   roles: ['ADMIN'] },
  { label: 'Portfolio',          href: '/admin/portfolio', roles: ['ADMIN'] },
  { label: 'Business Inquiries', href: '/admin/inquiries', roles: ['ADMIN', 'EDITOR'] },
  { label: 'Programs & Events',  href: '/admin/programs',  roles: ['ADMIN', 'EDITOR'] },
  { label: 'Team & Settings',    href: '/admin/team',      roles: ['ADMIN'] },
]

export default function Sidebar({ role, userName }: SidebarProps) {
  const pathname = usePathname()

  const filteredItems = NAV_ITEMS.filter((item) => item.roles.includes(role))

  return (
    <aside
      className="flex flex-col w-60 h-full flex-shrink-0 bg-[#101D3A]"
      aria-label="Admin navigation"
    >
      {/* Logo / brand */}
      <div className="flex items-center h-14 px-6 border-b border-white/10">
        <span className="text-white font-semibold text-sm tracking-wide">
          ONEFOCUS Admin
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3" aria-label="Sidebar navigation">
        <ul role="list" className="space-y-1">
          {filteredItems.map((item) => {
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href)

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium 
                    transition-colors focus-visible:outline-none focus-visible:ring-2 
                    focus-visible:ring-[#1F99ED]
                    ${isActive 
                      ? 'bg-[#EEF6FD] text-[#1F99ED]' 
                      : 'text-white/75 hover:bg-white/5'
                    }
                  `}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User name at bottom */}
      <div className="px-6 py-4 border-t border-white/10">
        <p className="text-xs text-white/50 truncate">{userName}</p>
      </div>
    </aside>
  )
}