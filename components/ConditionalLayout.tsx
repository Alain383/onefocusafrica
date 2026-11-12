'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/sections/Header'
import Footer from '@/components/sections/Footer'

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin') ?? false

  if (isAdminRoute) {
    return <>{children}</>
  }

  return (
    <>
      <Header />
      <main className="pt-16 lg:pt-20">{children}</main>
      <Footer />
    </>
  )
}
