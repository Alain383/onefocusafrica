import Link from 'next/link'
import Section from '../ui/Section'
import Button from '../ui/Button'

export default function TalentEcosystem() {
  const journey = [
    { step: '1', title: 'Discover', description: 'Career direction' },
    { step: '2', title: 'Develop', description: 'Practical skills' },
    { step: '3', title: 'Build', description: 'Project portfolios' },
    { step: '4', title: 'Showcase', description: 'Demonstrate work' },
    { step: '5', title: 'Connect', description: 'Approved pathways' },
    { step: '6', title: 'Grow', description: 'Apply feedback' },
  ]

  return (
    <Section background="white" padding="lg">
      <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
        {/* ── Left: copy ── */}
        <div>
          <p
            className="text-xs font-bold tracking-[0.15em] uppercase text-[#1F99ED] mb-4"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            TALENT ECOSYSTEM
          </p>
          {/* Rowdies Bold — Section Heading */}
          <h2
            className="text-[2rem] md:text-[2.75rem] font-bold text-[#10183F] mb-4 leading-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            OUR TALENT ECOSYSTEM
          </h2>
          {/* Persian Blue — premium/emphasis */}
          <p
            className="text-xl text-[#2E3192] font-semibold mb-5"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Business growth connects with human potential.
          </p>
          <p
            className="text-gray-600 mb-8 leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            We support creators, students, professionals and entrepreneurs through learning,
            mentorship, community and practical projects.
          </p>
          <Button href="/talent" variant="primary" size="lg">
            Explore Talent &amp; Learning →
          </Button>
        </div>

        {/* ── Right: journey steps ── */}
        <div className="space-y-3">
          {journey.map((item) => (
            // 5px border-radius, light brand blue background
            <div
              key={item.step}
              className="flex items-center gap-4 p-4 bg-[#EEF6FD] rounded-[5px] transition-all duration-200 hover:bg-[#dceef9]"
            >
              {/* Circle — Picton Blue */}
              <div
                className="flex-shrink-0 w-12 h-12 bg-[#1F99ED] text-white rounded-full flex items-center justify-center font-bold text-lg shadow-[0_2px_8px_0_rgba(31,153,237,0.25)]"
                style={{ fontFamily: 'var(--font-heading)' }}
                aria-label={`Step ${item.step}`}
              >
                {item.step}
              </div>
              <div>
                {/* Poppins SemiBold — card heading level */}
                <h4
                  className="font-semibold text-[#10183F]"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {item.title}
                </h4>
                {/* Poppins Regular — body text */}
                <p
                  className="text-sm text-gray-600"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Community highlight ── dark background box, 5px radius */}
      <div
        className="mt-16 bg-[#10183F] text-white p-8 md:p-12 rounded-[5px] max-w-4xl mx-auto text-center"
      >
        {/* Rowdies Bold heading on dark */}
        <h3
          className="text-2xl md:text-3xl font-bold mb-3"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          ONEFOCUS VIP INNER CIRCLE
        </h3>
        {/* Poppins Medium price highlight */}
        <p
          className="text-lg mb-4"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          One-time joining fee:{' '}
          <span className="text-[#1F99ED] font-bold text-2xl">$2</span>
        </p>
        <p
          className="text-gray-300 mb-6 max-w-lg mx-auto leading-relaxed"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Not a monthly subscription. A private learning and peer-support community for creators,
          freelancers, entrepreneurs and professionals.
        </p>
        <ul className="text-left max-w-sm mx-auto space-y-2 mb-8">
          {[
            'Practical AI and digital discussions',
            'Shared learning resources',
            'Networking and peer support',
            'Information on confirmed sessions',
          ].map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 text-sm text-gray-300"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <span className="text-[#1F99ED] font-bold mt-0.5" aria-hidden="true">✓</span>
              {item}
            </li>
          ))}
        </ul>
        {/* White button on dark — 5px radius */}
        <Link
          href="/talent#community"
          className="inline-block bg-white text-[#10183F] px-8 py-3 rounded-[5px] font-semibold hover:bg-[#EEF6FD] transition-colors text-base"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Ask How to Join →
        </Link>
      </div>
    </Section>
  )
}
