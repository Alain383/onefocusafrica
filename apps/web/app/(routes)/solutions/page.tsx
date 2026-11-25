import Section from '@/components/ui/Section'
import Button from '@/components/ui/Button'
import CmsMedia from '@/components/CmsMedia'
import { getMediaBlock, getPageText, parseTextRows } from '@/lib/site-content'

export const metadata = {
  title: 'Solutions | ONEFOCUS AFRICA',
  description:
    'Explore our integrated solutions: Brand Strategy, Cinematic Media, Web & Automation, and Corporate Training.',
}

export default async function SolutionsPage() {
  const [highlightMedia, strategyMedia, cinematicMedia, webMedia, trainingMedia] = await Promise.all([
    getMediaBlock('solutions.highlight'),
    getMediaBlock('solutions.strategy'),
    getMediaBlock('solutions.media'),
    getMediaBlock('solutions.technology'),
    getMediaBlock('solutions.training'),
  ])

  const textKeys = [
    'hero_eyebrow',
    'hero_title',
    'hero_description',
    'signature_eyebrow',
    'signature_title',
    'signature_tagline',
    'signature_description',
    'signature_button',
    'service_button',
    'process_eyebrow',
    'process_title',
    'process_description',
    'process_steps',
    'final_title',
    'final_description',
    'final_button',
  ] as const
  const textValues = await Promise.all(textKeys.map((key) => getPageText('solutions', key)))
  const t = Object.fromEntries(textKeys.map((key, index) => [key, textValues[index]])) as Record<
    (typeof textKeys)[number],
    string
  >
  const processSteps = parseTextRows(t.process_steps).map((row, index) => ({
    number: String(index + 1),
    title: row[0] ?? '',
    description: row[1] ?? '',
  }))

  const solutions = [
    {
      id: 'brand',
      title: 'Brand & Growth Strategy',
      tagline: 'Be clearer. Be different. Be chosen.',
      problem:
        "People see your brand, but don't understand the reason to choose you.",
      description:
        'We help businesses communicate their value and create a more intentional journey from awareness to inquiry.',
      media: strategyMedia,
      imageAlt: 'Brand strategy session',
      deliverables: [
        'Brand discovery and audience research',
        'Message and offer positioning',
        'Campaign strategy and lead-generation plan',
        'Business discovery and scope',
        'Review and transparent reporting',
      ],
    },
    {
      id: 'cinematic',
      title: 'Cinematic Media & Marketing Tours',
      tagline: 'Bring the business experience to the buyer.',
      problem:
        "Generic posts don't give customers enough reason to trust your business.",
      description:
        'Immersive on-site storytelling, professional videography, photography, short-form campaigns and live series.',
      media: cinematicMedia,
      imageAlt: 'Cinematic media production',
      deliverables: [
        'Creative concept and location shoot',
        'Polished photo and video assets',
        'Distribution plan with inquiry CTA',
        'Business discovery and scope',
        'Review and transparent reporting',
      ],
    },
    {
      id: 'web',
      title: 'Websites & Automation',
      tagline: 'A website that supports your sales process.',
      problem:
        "People get interested but can't complete the next step—or don't get timely follow-up.",
      description:
        'Responsive web experience, clear offer pages, inquiry forms, responsible automation and CRM support.',
      media: webMedia,
      imageAlt: 'Web and automation systems',
      deliverables: [
        'UX design and implementation',
        'Validated forms and secure CRM connection',
        'Analytics and handover documentation',
        'Business discovery and scope',
        'Review and transparent reporting',
      ],
    },
    {
      id: 'corporate',
      title: 'Corporate Talent & Training',
      tagline: 'Turn digital skills into useful team capabilities.',
      problem:
        'Teams have tools and content but lack consistent workflows and applied training.',
      description:
        'Practical company training in applied AI, marketing, media, customer processes and digital tools.',
      media: trainingMedia,
      imageAlt: 'Corporate training workshop',
      deliverables: [
        'Needs assessment and practical workshops',
        'Exercises and facilitator guide',
        'Review and follow-up',
        'Business discovery and scope',
        'Review and transparent reporting',
      ],
    },
  ]

  return (
    <>
      {/* ── Page header ── */}
      <Section background="white" padding="md">
        <div className="text-center max-w-3xl mx-auto">
          <p
            className="text-xs font-bold tracking-[0.15em] uppercase text-[#1F99ED] mb-4"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {t.hero_eyebrow}
          </p>
          <h1
            className="text-[2.5rem] md:text-[3.5rem] font-bold text-[#10183F] mb-4 leading-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {t.hero_title}
          </h1>
          <p
            className="text-xl text-gray-600"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {t.hero_description}
          </p>
        </div>
      </Section>

      {/* ── Marketing Tours highlight with podcast image ── */}
      <Section background="light" padding="lg" id="marketing-tours">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <p
                className="text-xs font-bold tracking-[0.15em] uppercase text-[#1F99ED] mb-4"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {t.signature_eyebrow}
              </p>
              <h2
                className="text-[2rem] md:text-[2.75rem] font-bold text-[#10183F] mb-4 leading-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {t.signature_title}
              </h2>
              <p
                className="text-xl font-semibold text-[#2E3192] mb-5"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {t.signature_tagline}
              </p>
              <p
                className="text-lg text-gray-600 mb-8 leading-relaxed"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {t.signature_description}
              </p>
              <Button href="/contact?intent=PROJECT&subject=Marketing%20Tours" variant="primary" size="lg">
                {t.signature_button}
              </Button>
            </div>
            <div className="relative rounded-[5px] overflow-hidden shadow-[0_8px_40px_0_rgba(31,153,237,0.15)]">
              <CmsMedia
                block={highlightMedia}
                width={700}
                height={500}
                priority
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* ── Solution details ── */}
      {solutions.map((solution, index) => (
        <Section
          key={solution.id}
          background={index % 2 === 0 ? 'white' : 'light'}
          padding="lg"
          id={solution.id}
        >
          <div className="max-w-6xl mx-auto">
            {/* Image banner */}
            <div className="relative rounded-[5px] overflow-hidden mb-10 shadow-[0_4px_24px_0_rgba(31,153,237,0.10)]">
              <CmsMedia
                block={solution.media}
                width={1200}
                height={400}
                className="w-full h-[200px] sm:h-[280px] md:h-[340px] object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#10183F]/70 via-[#10183F]/30 to-transparent flex items-center px-8 md:px-14">
                <div>
                  <h2
                    className="text-[1.75rem] md:text-[2.5rem] font-bold text-white leading-tight"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {solution.title}
                  </h2>
                  <p
                    className="text-[#1F99ED] font-semibold mt-1 text-lg"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {solution.tagline}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <div className="bg-white rounded-[5px] shadow-[0_2px_12px_0_rgba(31,153,237,0.08)] p-6 border-t-4 border-[#2E3192]">
                <h3
                  className="text-base font-bold text-[#10183F] mb-3 uppercase tracking-wide"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  THE FRICTION
                </h3>
                <p
                  className="text-gray-700 mb-4 leading-relaxed"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {solution.problem}
                </p>
                <p
                  className="text-sm text-gray-500 leading-relaxed"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  You need more than another disconnected vendor. We define the business outcome,
                  the right delivery scope and practical ways to measure progress.
                </p>
              </div>

              <div className="bg-white rounded-[5px] shadow-[0_2px_12px_0_rgba(31,153,237,0.08)] p-6 border-t-4 border-[#1F99ED]">
                <h3
                  className="text-base font-bold text-[#10183F] mb-3 uppercase tracking-wide"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  THE DELIVERY
                </h3>
                <p
                  className="text-gray-600 mb-3 text-sm"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  What ONEFOCUS can provide:
                </p>
                <ul className="space-y-2">
                  {solution.deliverables.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-gray-700"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#1F99ED]" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="text-center">
              <p
                className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {solution.description}
              </p>
              <Button href={`/contact?intent=PROJECT&subject=${encodeURIComponent(solution.title)}`} variant="primary" size="lg">
                {t.service_button}
              </Button>
            </div>
          </div>
        </Section>
      ))}

      {/* ── Process — dark section ── */}
      <Section background="dark" padding="lg">
        <div className="max-w-4xl mx-auto text-center">
          <p
            className="text-xs font-bold tracking-[0.15em] uppercase text-[#1F99ED] mb-4"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {t.process_eyebrow}
          </p>
          <h2
            className="text-[2rem] md:text-[2.75rem] font-bold mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {t.process_title}
          </h2>
          <p
            className="text-lg text-gray-300 mb-12"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {t.process_description}
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {processSteps.map((step) => (
              <div
                key={step.number}
                className="bg-white/10 p-6 rounded-[5px] border border-white/10"
              >
                <div
                  className="text-4xl font-bold text-[#1F99ED] mb-3"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {step.number}
                </div>
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-gray-300 text-sm leading-relaxed"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Final CTA ── */}
      <Section background="white" padding="lg">
        <div className="text-center max-w-2xl mx-auto">
          <h2
            className="text-[2rem] md:text-[2.5rem] font-bold text-[#10183F] mb-5"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {t.final_title}
          </h2>
          <p
            className="text-lg text-gray-600 mb-8"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {t.final_description}
          </p>
          <Button href="/contact?intent=PROJECT&subject=New%20project" variant="primary" size="lg">
            {t.final_button}
          </Button>
        </div>
      </Section>
    </>
  )
}