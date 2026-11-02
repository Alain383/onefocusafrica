import Link from 'next/link'
import Section from '../ui/Section'
import Card from '../ui/Card'
import Button from '../ui/Button'

export default function CaseStudies() {
  const caseStudies = [
    {
      category: 'BRAND',
      label: 'STORY',
      title: 'Brand strategy & campaign',
      description: 'Challenge → solution → deliverables → verified outcome.',
      tag: 'CASE STUDY TEMPLATE 1 · NOT A REAL CLIENT',
    },
    {
      category: 'MARKETING',
      label: 'TOUR',
      title: 'Cinematic business showcase',
      description: 'Challenge → solution → deliverables → verified outcome.',
      tag: 'CASE STUDY TEMPLATE 2 · NOT A REAL CLIENT',
    },
    {
      category: 'WEB',
      label: 'FUNNEL',
      title: 'Conversion & customer flow',
      description: 'Challenge → solution → deliverables → verified outcome.',
      tag: 'CASE STUDY TEMPLATE 3 · NOT A REAL CLIENT',
    },
  ]

  return (
    <Section background="light" padding="lg">
      <div className="text-center mb-14">
        <p
          className="text-xs font-bold tracking-[0.15em] uppercase text-[#1F99ED] mb-4"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          SELECTED WORK
        </p>
        {/* Rowdies Bold — Section Heading */}
        <h2
          className="text-[2rem] md:text-[2.75rem] font-bold text-[#10183F] mb-3 leading-tight"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Proof matters more than promises.
        </h2>
        <p
          className="text-sm text-gray-500 italic"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Actual verified projects should replace the illustrative case-study layouts below.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
        {caseStudies.map((study) => (
          <Card key={study.title} hover>
            {/* Category label — Picton Blue uppercase */}
            <div className="mb-4">
              <span
                className="text-xs font-bold text-[#1F99ED] tracking-wider uppercase"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {study.category}
              </span>
              <br />
              {/* Persian Blue large label — Rowdies */}
              <span
                className="text-2xl font-bold text-[#2E3192]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {study.label}
              </span>
            </div>
            <p
              className="text-xs text-gray-400 mb-3 tracking-wide"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {study.tag}
            </p>
            {/* Card title — Poppins SemiBold */}
            <h3
              className="text-lg font-semibold text-[#10183F] mb-2"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {study.title}
            </h3>
            <p
              className="text-gray-600 text-sm mb-4 leading-relaxed"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {study.description}
            </p>
            <Link
              href="/work"
              className="text-[#1F99ED] font-semibold text-sm hover:text-[#2E3192] transition-colors"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              View work page →
            </Link>
          </Card>
        ))}
      </div>

      <div className="text-center mb-14">
        <Button href="/work" variant="primary" size="lg">
          View All Case Studies
        </Button>
      </div>

      {/* Case study standard box — 5px border-radius, Picton Blue border */}
      <div
        className="max-w-4xl mx-auto bg-white p-8 rounded-[5px] border-2 border-[#1F99ED] shadow-[0_2px_12px_0_rgba(31,153,237,0.08)]"
      >
        {/* Rowdies Bold — sub-section heading */}
        <h3
          className="text-xl md:text-2xl font-bold text-[#10183F] mb-3 text-center"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          CASE STUDY STANDARD
        </h3>
        {/* Persian Blue accent text */}
        <p
          className="text-center text-[#2E3192] font-semibold mb-5"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Proof over promises.
        </p>
        <p
          className="text-gray-600 mb-6 text-center text-sm"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Every actual portfolio item needs client permission, project scope, delivery dates and
          verified outcomes.
        </p>
        <ul className="space-y-2 text-gray-700 max-w-md mx-auto">
          {[
            "What was the client's challenge?",
            'What did ONEFOCUS deliver?',
            'How was success assessed?',
            'What assets may be published?',
          ].map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 text-sm"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <span className="text-[#1F99ED] font-bold mt-0.5" aria-hidden="true">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
