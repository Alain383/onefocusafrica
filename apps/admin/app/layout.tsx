import type { Metadata } from 'next'
import { Poppins, Rowdies } from 'next/font/google'
import './globals.css'

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const rowdies = Rowdies({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ONEFOCUS AFRICA Admin',
  description: 'Admin Dashboard for ONEFOCUS AFRICA',
  icons: {
    icon: [
      { url: '/icons/icon-light.png?v=2', media: '(prefers-color-scheme: light)', type: 'image/png' },
      { url: '/icons/icon-dark.png?v=2', media: '(prefers-color-scheme: dark)', type: 'image/png' },
      { url: '/icons/favicon.ico?v=2', sizes: 'any' },
    ],
    apple: '/icons/apple-touch-icon.png?v=2',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${rowdies.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}