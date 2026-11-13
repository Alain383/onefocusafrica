import Link from 'next/link'
import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

export default function Button({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  disabled = false,
}: ButtonProps) {
  // Base: Poppins SemiBold per brand typography, border-radius 5px per brand guidelines
  const baseStyles =
    'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 tracking-wide'

  // Border-radius is 5px per Brand Guidelines
  const variants = {
    // Picton Blue #1F99ED — primary action color with dark hover
    primary:
      'bg-[#1F99ED] text-white hover:bg-[#2E3129] focus:ring-[#1F99ED] rounded-[5px]',
    // Persian Blue — secondary depth/premium
    secondary:
      'bg-[#2E3192] text-white hover:bg-[#10183F] focus:ring-[#2E3192] rounded-[5px]',
    // Outline — Picton Blue border with fill on hover
    outline:
      'border-2 border-[#1F99ED] text-[#1F99ED] hover:bg-[#1F99ED] hover:text-white focus:ring-[#1F99ED] rounded-[5px] bg-transparent',
    // Ghost — minimal, text only
    ghost:
      'text-[#1F99ED] hover:bg-[#EEF6FD] focus:ring-[#1F99ED] rounded-[5px]',
  }

  // Typography hierarchy: Poppins body sizes
  const sizes = {
    sm: 'px-4 py-2 text-sm',       // Caption level
    md: 'px-6 py-3 text-base',     // Body text level
    lg: 'px-8 py-4 text-lg',       // Small heading level
  }

  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${disabledStyles} ${className}`

  if (href && !disabled) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  )
}
