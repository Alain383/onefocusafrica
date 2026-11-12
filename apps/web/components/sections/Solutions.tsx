import Link from 'next/link'
import Section from '../ui/Section'
import Card from '../ui/Card'

export default function Solutions() {
  const solutions = [
    {
      icon: '◉',
      title: 'Brand & Growth',
      description: 'Strategy, positioning, campaigns and customer acquisition.',
      href: '/solutions#brand',
    },
    {
      icon: '▶',
      title: 'Cinematic Media',
      description: 'On-site tours, professional photography, video and live experiences.',
      href: '/solutions#cinematic',
    },
    {
      icon: '⌘',
      title: 'Web & Automation',
      description: 'Conversion-focused websites, lead capture and business systems.',
      href: '/solutions#web',
    },
    {
      icon: '✳',
      title: 'Corporate Training',
      description: 'Applied AI and digital skills for teams and institutions.',
      href: '/solutions#corporate',
    },
  ]

  return (
    // White background — primary brand background
    <Section background="white" padding="lg">
      <div className="text-center mb-14">
        <p
          className="text-xs font-bold tracking-[0.15em] uppercase text-[#1F99ED] mb-4"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          WHAT WE DO
        </p>
        {/* Rowdies Bold — Section Heading level */}
        <h2
          className="text-[2rem] md:text-[2.75rem] font-bold text-[#10183F] mb-3 leading-tight"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          One partner. Four clear capabilities.
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
        {solutions.map((solution) => (
          <Link key={solution.title} href={solution.href} className="group block">
            {/* 5px border-radius cards, hover lift */}
            <div className="bg-white rounded-[5px] shadow-[0_2px_12px_0_rgba(31,153,237,0.08)] p-6 h-full transition-all duration-200 group-hover:shadow-[0_6px_28px_0_rgba(31,153,237,0.16)] group-hover:-translate-y-1 border border-transparent group-hover:border-[#1F99ED]/20">
              {/* Icon — large Picton Blue */}
              <div
                className="text-3xl text-[#1F99ED] mb-4"
                aria-hidden="true"
              >
                {solution.icon}
              </div>
              {/* Small Heading — Poppins Medium 20px */}
              <h3
                className="text-lg font-semibold text-[#10183F] mb-2"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {solution.title}
              </h3>
              {/* Body — Poppins Regular 14-15px */}
              <p
                className="text-gray-600 text-sm leading-relaxed mb-4"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {solution.description}
              </p>
              {/* Link label — Picton Blue, SemiBold */}
              <p
                className="text-[#1F99ED] text-sm font-semibold group-hover:text-[#2E3192] transition-colors"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Explore {solution.title.split(' ')[0]} →
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Signature capability highlight ── */}
      {/* Light brand blue box — 5px radius, inner content centered */}
      <div className="mt-16 bg-[#EEF6FD] p-8 md:p-12 rounded-[5px] max-w-4xl mx-auto">
        <div className="text-center">
          <div className="text-4xl mb-4 text-[#1F99ED]" aria-hidden="true">▶</div>
          {/* Sub-section heading — Poppins SemiBold */}
          <h3
            className="text-xl md:text-2xl font-semibold text-[#10183F] mb-3 uppercase tracking-wide"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            OUR SIGNATURE CAPABILITY
          </h3>
          {/* Persian Blue — premium / depth color */}
          <p
            className="text-lg font-semibold text-[#2E3192] mb-3"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Don&apos;t just show it. Let customers experience it.
          </p>
          <p
            className="text-gray-700 leading-relaxed mb-6 max-w-2xl mx-auto"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Interactive Marketing Tours combine cinematic video, sharp photography, live formats
            and a clear inquiry pathway. Every media asset serves a business purpose.
          </p>
          <Link
            href="/solutions#marketing-tours"
            className="text-[#1F99ED] font-semibold hover:text-[#2E3192] transition-colors text-base"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Explore Marketing Tours →
          </Link>
        </div>
      </div>
    </Section>
  )
}
