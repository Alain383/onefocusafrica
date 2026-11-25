import type { Metadata } from 'next'
import { Poppins, Rowdies } from 'next/font/google'
import './globals.css'
import Header from '@/components/sections/Header'
import Footer from '@/components/sections/Footer'
import { getMediaBlock } from '@/lib/site-content'

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
  title: 'ONEFOCUS AFRICA | Digital Growth Engine',
  description: 'We fix your digital growth engine. One partner for brand strategy, content, websites, customer acquisition and smart business operations.',
  keywords: ['brand strategy', 'digital marketing', 'web development', 'Rwanda', 'Africa', 'business growth'],
  authors: [{ name: 'ONEFOCUS AFRICA' }],
  openGraph: {
    title: 'ONEFOCUS AFRICA | Digital Growth Engine',
    description: 'We fix your digital growth engine.',
    type: 'website',
    locale: 'en_US',
  },
  icons: {
    icon: [
      { url: '/icons/icon-light.png?v=2', media: '(prefers-color-scheme: light)', type: 'image/png' },
      { url: '/icons/icon-dark.png?v=2', media: '(prefers-color-scheme: dark)', type: 'image/png' },
      { url: '/icons/favicon.ico?v=2', sizes: 'any' },
    ],
    apple: '/icons/apple-touch-icon.png?v=2',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const logo = await getMediaBlock('site.logo')

  return (
    <html lang="en" className={`${poppins.variable} ${rowdies.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Header logo={logo} />
        <main className="pt-16 lg:pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
