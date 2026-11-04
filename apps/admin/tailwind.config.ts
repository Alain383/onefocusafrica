import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand primary colors from guidelines
        'picton-blue': '#1F99ED',    // Innovation, creativity, technology, trust
        'persian-blue': '#2E3192',   // Strength, premium quality, professionalism
        'brand-black': '#000000',    // Authority, contrast, elegance
        'brand-white': '#FFFFFF',    // Simplicity, cleanliness, openness

        // Semantic aliases used throughout the site
        'primary-blue': '#1F99ED',
        'primary-purple': '#2E3192',
        'primary-dark': '#10183F',
        'primary-light': '#EEF6FD',
      },
      fontFamily: {
        // Rowdies — primary typeface for all headings (brand guideline p.23)
        heading: ['var(--font-heading)', 'system-ui', 'sans-serif'],
        // Poppins — secondary typeface for body, subheadings, UI text (brand guideline p.24)
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      // Typography hierarchy from brand guidelines p.25
      fontSize: {
        // Caption/Small Text — Poppins Regular 12-14px
        'caption': ['0.8125rem', { lineHeight: '1.5', fontWeight: '400' }],
        // Body Text — Poppins Regular 16-18px
        'body-sm': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
        // Small Heading — Poppins Medium 20-24px
        'h4': ['1.375rem', { lineHeight: '1.3', fontWeight: '500' }],
        // Subheading — Poppins SemiBold 24-32px
        'h3': ['1.75rem', { lineHeight: '1.25', fontWeight: '600' }],
        // Section Heading — Rowdies Bold 36-48px
        'h2': ['2.5rem', { lineHeight: '1.15', fontWeight: '700' }],
        // Main Heading — Rowdies Bold 48-64px
        'h1': ['3.5rem', { lineHeight: '1.1', fontWeight: '700' }],
      },
      borderRadius: {
        // Brand guideline: boxes use border-radius of 5px
        DEFAULT: '5px',
        'brand': '5px',
        'none': '0',
        'sm': '4px',
        'md': '5px',
        'lg': '5px',
        'xl': '5px',
        '2xl': '5px',
        'full': '9999px',
      },
      boxShadow: {
        'brand': '0 2px 12px 0 rgba(31, 153, 237, 0.10)',
        'brand-md': '0 4px 24px 0 rgba(31, 153, 237, 0.15)',
        'brand-lg': '0 8px 40px 0 rgba(31, 153, 237, 0.18)',
      },
    },
  },
  plugins: [],
}

export default config
