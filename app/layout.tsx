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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${rowdies.variable}`}>
      <body>
        {children}
      </body>
    </html>
  )
}