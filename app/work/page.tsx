import Section from '@/components/ui/Section'
import Button from '@/components/ui/Button'
import Image from 'next/image'

export const metadata = {
  title: 'Our Work | ONEFOCUS AFRICA',
  description: 'Explore verified case studies and project outcomes from ONEFOCUS AFRICA.',
}

export default function WorkPage() {
  const caseStudies = [
    {
      id: 'brand-story-1',
      category: 'BRAND',
      label: 'STORY',
      title: 'Cinematic Brand Story',
      subtitle: 'CASE STUDY TEMPLATE 1 · NOT A REAL CLIENT',
      description: 'Client context → work delivered → evidence → next step.',
      image: '/images/recept.png',
      imageAlt: 'Brand story production',
      details: {
        challenge: 'Describe the specific business challenge or market position issue.',
        delivered: 'List the actual deliverables: strategy docs, positioning, assets produced.',
        outcome: 'Measurable results and verified business impact.',
      },
    },
    {
      id: 'marketing-tour-1',
      category: 'MEDIA',
      label: 'TOUR',
      title: 'Business Marketing Tour',
      subtitle: 'CASE STUDY TEMPLATE 2 · NOT A REAL CLIENT',
      description: 'Client context → work delivered → evidence → next step.',
      image: '/images/media.png',
      imageAlt: 'Media production tour',
      details: {
        challenge: 'Describe the visibility or trust-building challenge.',
        delivered: 'List media assets: video tour, photography, distribution plan.',
        outcome: 'Measurable engagement and inquiry results.',
      },
    },
    {
      id: 'web-system-1',
      category: 'WEB',
      label: 'SYSTEM',
      title: 'Digital Conversion System',
      subtitle: 'CASE STUDY TEMPLATE 3 · NOT A REAL CLIENT',
      description: 'Client context → work delivered → evidence → next step.',
      image: '/images/guest.png',
      imageAlt: 'Web system client interaction',
      details: {
        challenge: 'Describe the lead capture or follow-up challenge.',
        delivered: 'List technical deliverables: site, forms, CRM, automation.',
        outcome: 'Conversion metrics and qualified inquiry improvements.',
      },
    },
  ]

  return (
    <>
      {/* ── Hero with team image ── */}
      <Section background="white" padding="lg">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p
                className="text-xs font-bold tracking-[0.15em] uppercase text-[#1F99ED] mb-5"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                SELECTED WORK
              </p>
              <h1
                className="text-[2.5rem] md:text-[3.5rem] font-bold text-[#10183F] mb-5 leading-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                PROOF &amp; CASE STUDIES
              </h1>
              <p
                className="text-xl text-[#2E3192] font-semibold mb-4"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Work should speak through evidence.
              </p>
              <p
                className="text-lg text-gray-600 mb-6"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Show real problems, delivered scope and measurable results. This prototype
                includes clearly labeled demonstration cards.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-[5px] p-4 text-sm text-gray-700">
                <span style={{ fontFamily: 'var(--font-body)' }}>
                  ⚠ All cards below are case-study design placeholders, NOT claims of delivered
                  projects or client results. Replace before launch with actual verified work.
                </span>
              </div>
            </div>
            <div className="relative rounded-[5px] overflow-hidden shadow-[0_8px_40px_0_rgba(31,153,237,0.15)]">
              <Image
                src="/images/workshop.png"
                alt="ONEFOCUS AFRICA in action"
                width={700}
                height={500}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </Section>

      {/* ── Case Studies Grid ── */}
      <Section background="light" padding="lg">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {caseStudies.map((study) => (
              <div
                key={study.id}
                className="bg-white rounded-[5px] shadow-[0_2px_12px_0_rgba(31,153,237,0.08)] overflow-hidden transition-all duration-200 hover:shadow-[0_6px_28px_0_rgba(31,153,237,0.16)] hover:-translate-y-1"
              >
                {/* Case study image */}
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={study.image}
                    alt={study.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#10183F]/60 to-transparent" />
                  <div className="absolute bottom-3 left-4">
                    <span
                      className="text-xs font-bold text-[#1F99ED] tracking-wider uppercase"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {study.category}
                    </span>
                    <br />
                    <span
                      className="text-xl font-bold text-white"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {study.label}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <p
                    className="text-xs text-gray-500 mb-3 bg-amber-50 px-2 py-1 rounded-[3px]"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {study.subtitle}
                  </p>

                  <h3
                    className="text-lg font-semibold text-[#10183F] mb-3"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {study.title}
                  </h3>
                  <p
                    className="text-gray-600 text-sm mb-4"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {study.description}
                  </p>

                  <div
                    className="space-y-2 text-xs text-gray-600 mb-5"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    <p><strong className="text-[#10183F]">Challenge:</strong> {study.details.challenge}</p>
                    <p><strong className="text-[#10183F]">Delivered:</strong> {study.details.delivered}</p>
                    <p><strong className="text-[#10183F]">Outcome:</strong> {study.details.outcome}</p>
                  </div>

                  <Button href="/contact" variant="outline" size="sm" className="w-full">
                    Ask About Similar Projects
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Case Study Standard ── */}
      <Section background="white" padding="lg">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#EEF6FD] p-8 md:p-12 rounded-[5px] border-2 border-[#1F99ED]">
            <h2
              className="text-[1.75rem] md:text-[2.25rem] font-bold text-[#10183F] mb-3 text-center"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              CASE STUDY STANDARD
            </h2>
            <p
              className="text-center text-lg font-semibold text-[#2E3192] mb-6"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Proof over promises.
            </p>
            <p
              className="text-gray-700 mb-8 text-center"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Every actual portfolio item needs client permission, project scope, delivery dates
              and verified outcomes.
            </p>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="bg-white p-6 rounded-[5px] shadow-[0_1px_6px_0_rgba(31,153,237,0.06)]">
                <h3
                  className="font-semibold text-[#10183F] mb-4 uppercase tracking-wide text-sm"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Required for Publication:
                </h3>
                <ul className="space-y-2 text-gray-700">
                  {[
                    'Client permission and approval',
                    'Project scope and timeline',
                    'Delivery dates and team',
                    'Verified outcomes and metrics',
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

              <div className="bg-white p-6 rounded-[5px] shadow-[0_1px_6px_0_rgba(31,153,237,0.06)]">
                <h3
                  className="font-semibold text-[#10183F] mb-4 uppercase tracking-wide text-sm"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Every Case Study Answers:
                </h3>
                <ul className="space-y-2 text-gray-700">
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
                      <span className="text-[#2E3192] font-bold mt-0.5" aria-hidden="true">?</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p
                className="text-xs text-gray-500 italic"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Do not publish unverified promises such as &quot;3× more content&quot;, guaranteed
                sales, clients already served, or unsupported audience statistics.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Final CTA — dark section ── */}
      <Section background="dark" padding="lg">
        <div className="text-center max-w-2xl mx-auto">
          <h2
            className="text-[2rem] md:text-[2.5rem] font-bold mb-5"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Ready to create your own success story?
          </h2>
          <p
            className="text-lg text-gray-300 mb-8"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Tell us about your challenge and we&apos;ll help define a practical project scope.
          </p>
          <Button href="/contact" variant="primary" size="lg">
            Start a Project →
          </Button>
        </div>
      </Section>
    </>
  )
}