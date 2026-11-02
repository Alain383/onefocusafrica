import Section from '../ui/Section'
import Card from '../ui/Card'

export default function Problems() {
  const problems = [
    {
      number: '01',
      title: "Buyers don't understand your value",
      description:
        "Your positioning and message don't explain why someone should choose you.",
    },
    {
      number: '02',
      title: 'Content gets views, not inquiries',
      description:
        'People notice your business without a clear route to the next action.',
    },
    {
      number: '03',
      title: 'Leads slip through the cracks',
      description:
        'Your website, messages and follow-up process are disconnected.',
    },
  ]

  return (
    // Light background — alternating section color from brand guidelines
    <Section background="light" padding="lg">
      {/* Section label — Picton Blue, Poppins Bold uppercase */}
      <div className="text-center mb-14">
        <p
          className="text-xs font-bold tracking-[0.15em] uppercase text-[#1F99ED] mb-4"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          THE PROBLEM
        </p>
        {/* Section Heading — Rowdies Bold 36-48px */}
        <h2
          className="text-[2rem] md:text-[2.75rem] font-bold text-[#10183F] mb-4 leading-tight"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Where growth opportunities get lost.
        </h2>
        {/* Body Text — Poppins Regular 16-18px */}
        <p
          className="text-lg text-gray-600 max-w-xl mx-auto"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          We solve commercial problems before prescribing services.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {problems.map((problem) => (
          // Card — brand-card with 5px border-radius + top Picton Blue accent
          <Card key={problem.number} hover accent>
            {/* Number — Rowdies Bold, Picton Blue (large display numerals) */}
            <div
              className="text-5xl font-bold text-[#1F99ED] mb-4 leading-none"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {problem.number}
            </div>
            {/* Card heading — Poppins SemiBold 20px (small heading level) */}
            <h3
              className="text-xl font-semibold text-[#10183F] mb-3"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {problem.title}
            </h3>
            {/* Body text — Poppins Regular 16px */}
            <p className="text-gray-600 leading-relaxed text-base" style={{ fontFamily: 'var(--font-body)' }}>
              {problem.description}
            </p>
          </Card>
        ))}
      </div>
    </Section>
  )
}
