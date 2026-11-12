import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  accent?: boolean   // adds a top Picton Blue accent border
  dark?: boolean     // dark/Persian Blue background variant
}

export default function Card({
  children,
  className = '',
  hover = false,
  accent = false,
  dark = false,
}: CardProps) {
  // Brand Guidelines: border-radius 5px on all boxes
  const base = 'rounded-[5px] p-6'

  const background = dark
    ? 'bg-[#10183F] text-white'
    : 'bg-white'

  const shadow = 'shadow-[0_2px_12px_0_rgba(31,153,237,0.08)]'

  // Hover: slight lift + stronger brand shadow (no scale — stays readable)
  const hoverStyle = hover
    ? 'transition-all duration-200 hover:shadow-[0_6px_28px_0_rgba(31,153,237,0.16)] hover:-translate-y-1 cursor-pointer'
    : ''

  // Optional top accent bar in Picton Blue (Brand Guidelines accent usage)
  const accentStyle = accent ? 'border-t-4 border-[#1F99ED]' : ''

  return (
    <div className={`${base} ${background} ${shadow} ${hoverStyle} ${accentStyle} ${className}`}>
      {children}
    </div>
  )
}
