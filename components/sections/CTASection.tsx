import Link from 'next/link'
import Section from '../ui/Section'
import Button from '../ui/Button'

export default function CTASection() {
  return (
    // Gradient background — Picton Blue → Persian Blue per brand guidelines
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1F99ED] to-[#2E3192]">
      {/* Subtle wave / glow overlay from brand graphic elements */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 60% 70% at 80% 120%, rgba(255,255,255,0.06) 0%, transparent 60%), radial-gradient(ellipse 40% 50% at 20% -10%, rgba(255,255,255,0.08) 0%, transparent 55%)',
        }}
      />

      <div className="relative py-20 md:py-28">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center text-white">
          {/* Rowdies Bold — Main heading on gradient */}
          <h2
            className="text-[2rem] md:text-[3rem] lg:text-[3.5rem] font-bold mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            LET&apos;S MAKE IT PRACTICAL
          </h2>
          {/* Poppins SemiBold — subheading level */}
          <p
            className="text-xl md:text-2xl text-white/90 mb-4 font-semibold"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            What are you trying to grow?
          </p>
          {/* Poppins Regular — body text */}
          <p
            className="text-lg text-white/75 mb-10"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Tell us the challenge. We&apos;ll help define a sensible next step.
          </p>
          {/* White button on gradient — high contrast, 5px radius */}
          <Link
            href="/contact"
            className="inline-flex items-center justify-center font-semibold bg-white text-[#10183F] hover:bg-[#EEF6FD] px-10 py-4 rounded-[5px] text-lg transition-all duration-200 shadow-[0_4px_20px_0_rgba(0,0,0,0.15)] hover:shadow-[0_6px_28px_0_rgba(0,0,0,0.2)] hover:-translate-y-0.5"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Start a Project →
          </Link>
        </div>
      </div>
    </section>
  )
}
