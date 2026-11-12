import { ReactNode } from 'react'
import Container from './Container'

interface SectionProps {
  children: ReactNode
  className?: string
  background?: 'white' | 'light' | 'dark' | 'gradient'
  padding?: 'sm' | 'md' | 'lg'
  containerSize?: 'sm' | 'md' | 'lg' | 'full'
  id?: string
}

export default function Section({
  children,
  className = '',
  background = 'white',
  padding = 'lg',
  containerSize = 'lg',
  id,
}: SectionProps) {
  // Brand backgrounds:
  // white  = #FFFFFF — primary background (Brand Guidelines: white dominates layouts)
  // light  = #EEF6FD — subtle brand blue tint for alternating sections
  // dark   = #10183F — navy dark for CTA / contrast sections
  // gradient = Picton Blue → Persian Blue diagonal gradient
  const backgrounds = {
    white:    'bg-white',
    light:    'bg-[#EEF6FD]',
    dark:     'bg-[#10183F] text-white',
    gradient: 'bg-gradient-to-br from-[#1F99ED] to-[#2E3192] text-white',
  }

  const paddings = {
    sm: 'py-10 md:py-14',
    md: 'py-14 md:py-20',
    lg: 'py-16 md:py-24 lg:py-28',
  }

  return (
    <section
      id={id}
      className={`${backgrounds[background]} ${paddings[padding]} ${className}`}
    >
      <Container size={containerSize}>{children}</Container>
    </section>
  )
}
