import Section from '@/components/ui/Section'
import Button from '@/components/ui/Button'
import CmsMedia from '@/components/CmsMedia'
import { getMediaBlock, getPageText, parseTextLines, parseTextRows } from '@/lib/site-content'

export const metadata = {
  title: 'Talent & Learning | ONEFOCUS AFRICA',
  description:
    'Build skills, show work, discover opportunities. Courses, career guidance, mentorship and community.',
}

export default async function TalentPage() {
  const [heroMedia, programMedia, communityMedia] = await Promise.all([
    getMediaBlock('talent.hero'),
    getMediaBlock('talent.program'),
    getMediaBlock('talent.community'),
  ])

  const textKeys = [
    'hero_eyebrow',
    'hero_title',
    'hero_tagline',
    'hero_description',
    'hero_button',
    'journey_title',
    'journey_subtitle',
    'journey_steps',
    'programs_eyebrow',
    'programs_title',
    'programs_description',
    'programs_items',
    'academy_eyebrow',
    'academy_title',
    'academy_tagline',
    'academy_description',
    'academy_pathways',
    'academy_pathway_label',
    'academy_button',
    'academy_notice',
    'community_eyebrow',
    'community_title',
    'community_tagline',
    'community_description',
    'community_inner_title',
    'community_price',
    'community_benefits',
    'community_rules_title',
    'community_rules_body',
    'community_button',
    'final_title',
    'final_description',
    'final_button',
  ] as const

  const textValues = await Promise.all(textKeys.map((key) => getPageText('talent', key)))
  const t = Object.fromEntries(textKeys.map((key, index) => [key, textValues[index]])) as Record<
    (typeof textKeys)[number],
    string
  >

  const journey = parseTextRows(t.journey_steps).map((row, index) => ({
    step: String(index + 1),
    title: row[0] ?? '',
    description: row[1] ?? '',
  }))

  const programs = parseTextRows(t.programs_items).map((row) => ({
    title: row[0] ?? '',
    description: row[1] ?? '',
    href: row[2] || '#',
  }))

  const skillPathways = parseTextRows(t.academy_pathways).map((row) => ({
    title: row[0] ?? '',
    description: row[1] ?? '',
  }))

  const communityBenefits = parseTextLines(t.community_benefits)

  return (
    <>
      {/* ── Hero — two-column with image ── */}
      <Section background="white" padding="lg">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <p
                className="text-xs font-bold tracking-[0.15em] uppercase text-[#1F99ED] mb-5"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {t.hero_eyebrow}
              </p>
              <h1
                className="text-[2.5rem] md:text-[3.5rem] font-bold text-[#10183F] mb-5 leading-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {t.hero_title}
              </h1>
              <p
                className="text-xl text-[#2E3192] font-semibold mb-5"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {t.hero_tagline}
              </p>
              <p
                className="text-lg text-gray-600 leading-relaxed mb-8"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {t.hero_description}
              </p>
              <Button href="#academy" variant="primary" size="lg">
                {t.hero_button}
              </Button>
            </div>
            <div className="relative rounded-[5px] overflow-hidden shadow-[0_8px_40px_0_rgba(31,153,237,0.15)]">
              <CmsMedia
                block={heroMedia}
                width={700}
                height={520}
                priority
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* ── Journey ── */}
      <Section background="light" padding="lg">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-[2rem] md:text-[2.75rem] font-bold text-[#10183F] mb-3 leading-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {t.journey_title}
            </h2>
            <p
              className="text-lg text-gray-600"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {t.journey_subtitle}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {journey.map((item) => (
              <div
                key={item.step}
                className="bg-white rounded-[5px] shadow-[0_2px_12px_0_rgba(31,153,237,0.08)] p-6 border-t-4 border-[#1F99ED]"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div
                    className="flex-shrink-0 w-11 h-11 bg-[#1F99ED] text-white rounded-full flex items-center justify-center font-bold text-lg"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {item.step}
                  </div>
                  <h3
                    className="text-lg font-semibold text-[#10183F]"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {item.title}
                  </h3>
                </div>
                <p
                  className="text-gray-600 text-sm leading-relaxed"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Programs ── */}
      <Section background="white" padding="lg">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <p
                className="text-xs font-bold tracking-[0.15em] uppercase text-[#1F99ED] mb-4"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {t.programs_eyebrow}
              </p>
              <h2
                className="text-[2rem] md:text-[2.75rem] font-bold text-[#10183F] mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {t.programs_title}
              </h2>
              <p
                className="text-lg text-gray-600 mb-8"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {t.programs_description}
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {programs.map((program) => (
                  <a
                    key={program.title}
                    href={program.href}
                    className="group bg-white rounded-[5px] shadow-[0_2px_12px_0_rgba(31,153,237,0.08)] p-5 transition-all duration-200 hover:shadow-[0_6px_28px_0_rgba(31,153,237,0.16)] hover:-translate-y-1 border border-transparent hover:border-[#1F99ED]/20 block"
                  >
                    <h3
                      className="text-sm font-semibold text-[#10183F] mb-1"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {program.title}
                    </h3>
                    <p
                      className="text-gray-600 text-xs leading-relaxed"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {program.description}
                    </p>
                  </a>
                ))}
              </div>
            </div>
            <div className="relative rounded-[5px] overflow-hidden shadow-[0_8px_40px_0_rgba(31,153,237,0.12)] lg:sticky lg:top-24">
              <CmsMedia
                block={programMedia}
                width={600}
                height={600}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* ── Learning Academy ── */}
      <Section background="light" padding="lg" id="academy">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p
              className="text-xs font-bold tracking-[0.15em] uppercase text-[#1F99ED] mb-4"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {t.academy_eyebrow}
            </p>
            <h2
              className="text-[2rem] md:text-[2.75rem] font-bold text-[#10183F] mb-3"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {t.academy_title}
            </h2>
            <p
              className="text-lg font-semibold text-[#2E3192] mb-3"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {t.academy_tagline}
            </p>
            <p
              className="text-gray-600 max-w-xl mx-auto"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {t.academy_description}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 mb-8">
            {skillPathways.map((pathway, index) => (
              <div
                key={pathway.title}
                className="bg-white rounded-[5px] shadow-[0_2px_12px_0_rgba(31,153,237,0.08)] p-6"
              >
                <p
                  className="text-xs font-bold uppercase tracking-widest text-[#2E3192] mb-2"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {t.academy_pathway_label} {index + 1}
                </p>
                <h3
                  className="text-lg font-semibold text-[#10183F] mb-3"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {pathway.title}
                </h3>
                <p
                  className="text-gray-600 text-sm mb-5 leading-relaxed"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {pathway.description}
                </p>
                <Button href="/contact?intent=TRAINING&subject=Corporate%20training" variant="outline" size="sm" className="w-full">
                  {t.academy_button}
                </Button>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 p-5 rounded-[5px] border border-amber-200">
            <p
              className="text-sm text-gray-700 text-center"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {t.academy_notice}
            </p>
          </div>
        </div>
      </Section>

      {/* ── Community ── dark section with team image */}
      <Section background="dark" padding="lg" id="community">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <p
                className="text-xs font-bold tracking-[0.15em] uppercase text-[#1F99ED] mb-4"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {t.community_eyebrow}
              </p>
              <h2
                className="text-[2rem] md:text-[2.75rem] font-bold mb-4"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {t.community_title}
              </h2>
              <p
                className="text-lg text-gray-300 mb-3"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {t.community_tagline}
              </p>
              <p
                className="text-gray-400 mb-8"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {t.community_description}
              </p>

              <div className="bg-white/10 p-6 md:p-8 rounded-[5px] border border-white/10 mb-6">
                <h3
                  className="text-xl font-bold mb-3"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {t.community_inner_title}
                </h3>
                <p
                  className="text-3xl font-bold text-[#1F99ED] mb-4"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {t.community_price}
                </p>
                <div className="grid sm:grid-cols-2 gap-3 text-left mb-6">
                  {communityBenefits.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-2 text-sm text-gray-300"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#1F99ED]" aria-hidden="true" />
                      {item}
                    </div>
                  ))}
                </div>
                <Button href="/contact?intent=COMMUNITY&subject=Talent%20community" variant="primary" size="lg">
                  {t.community_button}
                </Button>
              </div>

              <div className="bg-amber-50 text-gray-800 p-5 rounded-[5px]">
                <h4
                  className="font-bold mb-2 text-[#10183F]"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {t.community_rules_title}
                </h4>
                <p
                  className="text-sm text-gray-700"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {t.community_rules_body}
                </p>
              </div>
            </div>

            <div className="relative rounded-[5px] overflow-hidden shadow-[0_8px_40px_0_rgba(0,0,0,0.35)]">
              <CmsMedia
                block={communityMedia}
                width={600}
                height={700}
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#10183F]/50 to-transparent" />
            </div>
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
          <Button href="/contact?intent=TRAINING&subject=Corporate%20training" variant="primary" size="lg">
            {t.final_button}
          </Button>
        </div>
      </Section>
    </>
  )
}
