import Section from '../ui/Section'

export default function Process() {
  const steps = [
    {
      number: '01',
      title: 'DISCOVER',
      subtitle: 'Understand',
      description: 'Goals, audiences and friction points.',
    },
    {
      number: '02',
      title: 'DESIGN',
      subtitle: 'Plan',
      description: 'Practical scope and right channels.',
    },
    {
      number: '03',
      title: 'DELIVER',
      subtitle: 'Execute',
      description: 'Production, builds and campaigns.',
    },
    {
      number: '04',
      title: 'IMPROVE',
      subtitle: 'Measure',
      description: 'Review evidence and refine.',
    },
  ]

  return (
    <Section background="white" padding="lg">
      <div className="text-center mb-14">
        <p
          className="text-xs font-bold tracking-[0.15em] uppercase text-[#1F99ED] mb-4"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          HOW WE WORK
        </p>
        {/* Rowdies Bold — Section Heading */}
        <h2
          className="text-[2rem] md:text-[2.75rem] font-bold text-[#10183F] mb-3 leading-tight"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          One clear path from challenge to execution.
        </h2>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connector line between steps on desktop */}
              {index < steps.length - 1 && (
                <div
                  className="hidden lg:block absolute top-11 left-[calc(50%+2.75rem)] w-[calc(100%-3rem)] h-px bg-[#EEF6FD] z-0"
                  aria-hidden="true"
                />
              )}

              <div className="relative z-10 text-center">
                {/* Step circle — Picton Blue fill, Rowdies numeral */}
                <div
                  className="inline-flex items-center justify-center w-[5.5rem] h-[5.5rem] bg-[#1F99ED] text-white rounded-full font-bold text-2xl mb-5 shadow-[0_4px_16px_0_rgba(31,153,237,0.25)]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                  aria-label={`Step ${step.number}`}
                >
                  {step.number}
                </div>
                {/* Step title — Persian Blue, Poppins Bold uppercase */}
                <p
                  className="text-xs font-bold tracking-[0.12em] uppercase text-[#2E3192] mb-1"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {step.title}
                </p>
                {/* Step subtitle — Poppins SemiBold */}
                <h3
                  className="text-lg font-semibold text-[#10183F] mb-2"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {step.subtitle}
                </h3>
                {/* Description — Poppins Regular */}
                <p
                  className="text-gray-600 text-sm leading-relaxed"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}
