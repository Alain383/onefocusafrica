import Section from '@/components/ui/Section'
import Button from '@/components/ui/Button'
import CmsMedia from '@/components/CmsMedia'
import { getMediaBlock, getPageText, parseTextRows } from '@/lib/site-content'

export const metadata = {
  title: 'About Us | ONEFOCUS AFRICA',
  description:
    'Built in Africa. Designed to move business forward. Learn about ONEFOCUS AFRICA and our approach to growth.',
}

export default async function AboutPage() {
  const [heroMedia, teamMedia, workspaceMedia, locationMedia] = await Promise.all([
    getMediaBlock('about.hero'),
    getMediaBlock('about.team'),
    getMediaBlock('about.workspace'),
    getMediaBlock('about.location'),
  ])
  const textKeys = [
    'hero_eyebrow',
    'hero_title',
    'hero_subtitle',
    'hero_description',
    'why_eyebrow',
    'why_title',
    'why_body1',
    'why_body2',
    'why_button',
    'values_eyebrow',
    'values_title',
    'values_rows',
    'what_title',
    'business_title',
    'business_body',
    'talent_title',
    'talent_body',
    'location_title',
    'location_description',
    'location_button',
  ] as const
  const textValues = await Promise.all(textKeys.map((key) => getPageText('about', key)))
  const t = Object.fromEntries(textKeys.map((key, index) => [key, textValues[index]])) as Record<
    (typeof textKeys)[number],
    string
  >
  const values = parseTextRows(t.values_rows).map((row) => ({
    initial: row[0] ?? '',
    title: row[1] ?? '',
    description: row[2] ?? '',
  }))

  return (
    <>
      {/* ── Header hero ── */}
      <Section background="white" padding="lg">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p
                className="text-xs font-bold tracking-[0.15em] uppercase text-[#1F99ED] mb-5"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {t.hero_eyebrow}
              </p>
              <h1
                className="text-[2.5rem] md:text-[3.5rem] font-bold text-[#10183F] mb-6 leading-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {t.hero_title}
              </h1>
              <p
                className="text-xl text-[#2E3192] font-semibold mb-6"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {t.hero_subtitle}
              </p>
              <p
                className="text-lg text-gray-600 leading-relaxed"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {t.hero_description}
              </p>
            </div>
            <div className="relative rounded-[5px] overflow-hidden shadow-[0_8px_40px_0_rgba(31,153,237,0.15)]">
              <CmsMedia
                block={heroMedia}
                width={700}
                height={500}
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* ── Why We Exist ── */}
      <Section background="light" padding="lg">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative rounded-[5px] overflow-hidden shadow-[0_8px_40px_0_rgba(31,153,237,0.12)] order-2 lg:order-1">
              <CmsMedia
                block={teamMedia}
                width={700}
                height={500}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <p
                className="text-xs font-bold tracking-[0.15em] uppercase text-[#1F99ED] mb-4"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {t.why_eyebrow}
              </p>
              <h2
                className="text-[2rem] md:text-[2.75rem] font-bold text-[#10183F] mb-6 leading-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {t.why_title}
              </h2>
              <div className="space-y-5 text-gray-700 mb-10" style={{ fontFamily: 'var(--font-body)' }}>
                <p className="text-lg leading-relaxed">
                  {t.why_body1}
                </p>
                <p className="text-lg leading-relaxed">
                  {t.why_body2}
                </p>
              </div>
              <Button href="/contact?intent=GENERAL&subject=About%20ONEFOCUS" variant="primary" size="lg">
                {t.why_button}
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Core Values ── */}
      <Section background="white" padding="lg">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p
              className="text-xs font-bold tracking-[0.15em] uppercase text-[#1F99ED] mb-4"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {t.values_eyebrow}
            </p>
            <h2
              className="text-[2rem] md:text-[2.75rem] font-bold text-[#10183F] leading-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {t.values_title}
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-white rounded-[5px] shadow-[0_2px_12px_0_rgba(31,153,237,0.08)] p-6 text-center border-t-4 border-[#1F99ED]"
              >
                <div className="bg-[#1F99ED] text-white w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold shadow-[0_2px_10px_0_rgba(31,153,237,0.25)]">
                  {value.initial}
                </div>
                <h3
                  className="text-base font-semibold text-[#10183F] mb-2"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {value.title}
                </h3>
                <p
                  className="text-gray-600 text-sm leading-relaxed"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── What We Do ── dark section */}
      <Section background="dark" padding="lg">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-[2rem] md:text-[2.75rem] font-bold mb-10 text-center"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {t.what_title}
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="bg-white/10 p-6 rounded-[5px] border border-white/10">
              <h3
                className="text-lg font-semibold mb-3 text-[#1F99ED]"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {t.business_title}
              </h3>
              <p
                className="text-gray-300 leading-relaxed text-sm"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {t.business_body}
              </p>
            </div>
            <div className="bg-white/10 p-6 rounded-[5px] border border-white/10">
              <h3
                className="text-lg font-semibold mb-3 text-[#1F99ED]"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {t.talent_title}
              </h3>
              <p
                className="text-gray-300 leading-relaxed text-sm"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {t.talent_body}
              </p>
            </div>
          </div>
          {/* Office image inside dark section */}
          <div className="relative rounded-[5px] overflow-hidden shadow-[0_8px_40px_0_rgba(0,0,0,0.3)]">
            <CmsMedia
              block={workspaceMedia}
              width={1200}
              height={500}
              sizes="100vw"
              className="w-full h-[280px] sm:h-[360px] object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#10183F]/60 to-transparent" />
          </div>
        </div>
      </Section>

      {/* ── Location ── */}
      <Section background="white" padding="lg">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h2
                className="text-[2rem] md:text-[2.5rem] font-bold text-[#10183F] mb-5"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {t.location_title}
              </h2>
              <p
                className="text-lg text-gray-600 mb-8 leading-relaxed"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {t.location_description}
              </p>
              <div className="bg-[#EEF6FD] rounded-[5px] p-6 mb-8 space-y-3 text-left">
                <p style={{ fontFamily: 'var(--font-body)' }} className="text-gray-700">
                  <strong className="text-[#10183F]">Email: </strong>
                  <a href="mailto:onefocusafrica@gmail.com" className="text-[#1F99ED] hover:text-[#2E3192] transition-colors">
                    onefocusafrica@gmail.com
                  </a>
                </p>
                <p style={{ fontFamily: 'var(--font-body)' }} className="text-gray-700">
                  <strong className="text-[#10183F]">WhatsApp: </strong>
                  <a href="https://wa.me/250781102667" className="text-[#1F99ED] hover:text-[#2E3192] transition-colors">
                    +250 781 102 667
                  </a>
                </p>
              </div>
              <Button href="/contact?intent=GENERAL&subject=About%20ONEFOCUS" variant="primary" size="lg">
                {t.location_button}
              </Button>
            </div>
            <div className="relative rounded-[5px] overflow-hidden shadow-[0_8px_40px_0_rgba(31,153,237,0.12)]">
              <CmsMedia
                block={locationMedia}
                width={600}
                height={500}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}