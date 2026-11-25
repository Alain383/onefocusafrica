'use client'

import type { ReactNode } from 'react'
import TopBar from './TopBar'
import type { AdminRole } from './admin-nav'

interface AdminShellProps {
  userName: string
  role: AdminRole
  children: ReactNode
}

export default function AdminShell({ userName, role, children }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-[#F5F7FB] bg-wave-pattern">
      <TopBar userName={userName} role={role} />
      <main id="main-content" className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mx-auto w-full max-w-[1500px]">{children}</div>
      </main>
    </div>
  )
}
