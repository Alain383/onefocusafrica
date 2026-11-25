import Link from 'next/link'
import Section from '@/components/ui/Section'
import Button from '@/components/ui/Button'
import CmsMedia from '@/components/CmsMedia'
import { prisma } from '@/lib/prisma'
import { getMediaBlock, getPageText, parseTextLines } from '@/lib/site-content'
import { caseCover, parseList, type CaseStudyRecord } from '@/lib/case-studies'

export const metadata = {
  title: 'Our Work | ONEFOCUS AFRICA',
  description: 'Explore verified case studies and project outcomes from ONEFOCUS AFRICA.',
}

export default async function WorkPage() {
  const [studies, heroMedia, fallback1, fallback2, fallback3] = await Promise.all([
    prisma.caseStudy.findMany({
      where: { isPublished: true },
      orderBy: [{ publishedAt: 'desc' }, { updatedAt: 'desc' }],
    }),
    getMediaBlock('work.hero'),
    getMediaBlock('work.project1'),
    getMediaBlock('work.project2'),
    getMediaBlock('work.project3'),
  ])

  const fallbacks = [fallback1, fallback2, fallback3]

  const textKeys = [
    'hero_eyebrow',
    'hero_title',
    'hero_tagline',
    'hero_description',
    'standard_title',
    'standard_tagline',
    'standard_requirements',
    'standard_questions',
    'final_title',
    'final_description',
    'final_button',
  ] as const
  const textValues = await Promise.all(textKeys.map((key) => getPageText('work', key)))
  const t = Object.fromEntries(textKeys.map((key, index) => [key, textValues[index]])) as Record<
    (typeof textKeys)[number],
    string
  >
  const requirements = parseTextLines(t.standard_requirements)
  const questions = parseTextLines(t.standard_questions)

  return (
    <>
      <Section background="white" padding="lg">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-bold tracking-[0.15em] uppercase text-[#1F99ED] mb-5" style={{ fontFamily: 'var(--font-body)' }}>
                {t.hero_eyebrow}
              </p>
              <h1 className="text-[2.5rem] md:text-[3.5rem] font-bold text-[#10183F] mb-5 leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                {t.hero_title}
              </h1>
              <p className="text-xl text-[#2E3192] font-semibold mb-4" style={{ fontFamily: 'var(--font-body)' }}>
                {t.hero_tagline}
              </p>
              <p className="text-lg text-gray-600 mb-6" style={{ fontFamily: 'var(--font-body)' }}>
                {t.hero_description}
              </p>
            </div>
            <div className="relative rounded-[5px] overflow-hidden shadow-[0_8px_40px_0_rgba(31,153,237,0.15)]">
              <CmsMedia block={heroMedia} width={700} height={500} priority className="w-full h-auto object-cover" />
            </div>
          </div>
        </div>
      </Section>

      <Section background="light" padding="lg">
        <div className="max-w-6xl mx-auto">
          {studies.length === 0 && (
            <div className="bg-white rounded-[5px] border border-gray-200 p-10 text-center">
              <p className="text-lg font-semibold text-[#10183F] mb-2">Case studies are being prepared.</p>
              <p className="text-sm text-gray-600">Published proof will appear here.</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studies.map((study: CaseStudyRecord, index: number) => (
              <div key={study.id} className="bg-white rounded-[5px] shadow-[0_2px_12px_0_rgba(31,153,237,0.08)] overflow-hidden transition-all duration-200 hover:shadow-[0_6px_28px_0_rgba(31,153,237,0.16)] hover:-translate-y-1">
                <div className="relative h-44 overflow-hidden">
                  <CmsMedia
                    block={caseCover(study.publishedAssets, fallbacks[index % fallbacks.length])}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#10183F]/60 to-transparent" />
                  <div className="absolute bottom-3 left-4">
                    <span className="text-xs font-bold text-[#1F99ED] tracking-wider uppercase" style={{ fontFamily: 'var(--font-body)' }}>
                      {study.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  {study.clientName && (
                    <p className="text-xs text-gray-500 mb-2" style={{ fontFamily: 'var(--font-body)' }}>
                      {study.clientName}
                    </p>
                  )}
                  <h3 className="text-lg font-semibold text-[#10183F] mb-3" style={{ fontFamily: 'var(--font-body)' }}>
                    {study.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3" style={{ fontFamily: 'var(--font-body)' }}>
                    {study.outcome}
                  </p>

                  <div className="space-y-2 text-xs text-gray-600 mb-5" style={{ fontFamily: 'var(--font-body)' }}>
                    <p><strong className="text-[#10183F]">Challenge:</strong> {study.challenge}</p>
                    <p><strong className="text-[#10183F]">Delivered:</strong> {parseList(study.deliverables).join(', ')}</p>
                    <p><strong className="text-[#10183F]">Outcome:</strong> {study.outcome}</p>
                  </div>

                  <div className="space-y-2">
                    <Button href={`/work/${study.slug}`} variant="primary" size="sm" className="w-full">
                      Read case study
                    </Button>
                    <Button href={`/contact?intent=WORK&subject=${encodeURIComponent(study.title)}`} variant="outline" size="sm" className="w-full">
                      Ask About Similar Projects
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section background="white" padding="lg">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#EEF6FD] p-8 md:p-12 rounded-[5px] border-2 border-[#1F99ED]">
            <h2 className="text-[1.75rem] md:text-[2.25rem] font-bold text-[#10183F] mb-3 text-center" style={{ fontFamily: 'var(--font-heading)' }}>
              {t.standard_title}
            </h2>
            <p className="text-center text-lg font-semibold text-[#2E3192] mb-6" style={{ fontFamily: 'var(--font-body)' }}>
              {t.standard_tagline}
            </p>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="bg-white p-6 rounded-[5px] shadow-[0_1px_6px_0_rgba(31,153,237,0.06)]">
                <h3 className="font-semibold text-[#10183F] mb-4 uppercase tracking-wide text-sm" style={{ fontFamily: 'var(--font-body)' }}>
                  Required for publication:
                </h3>
                <ul className="space-y-2 text-gray-700">
                  {requirements.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm" style={{ fontFamily: 'var(--font-body)' }}>
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#1F99ED]" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white p-6 rounded-[5px] shadow-[0_1px_6px_0_rgba(31,153,237,0.06)]">
                <h3 className="font-semibold text-[#10183F] mb-4 uppercase tracking-wide text-sm" style={{ fontFamily: 'var(--font-body)' }}>
                  Every case study answers:
                </h3>
                <ul className="space-y-2 text-gray-700">
                  {questions.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm" style={{ fontFamily: 'var(--font-body)' }}>
                      <span className="text-[#2E3192] font-bold mt-0.5" aria-hidden="true">?</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section background="dark" padding="lg">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-[2rem] md:text-[2.5rem] font-bold mb-5" style={{ fontFamily: 'var(--font-heading)' }}>
            {t.final_title}
          </h2>
          <p className="text-lg text-gray-300 mb-8" style={{ fontFamily: 'var(--font-body)' }}>
            {t.final_description}
          </p>
          <Button href="/contact?intent=PROJECT&subject=New%20project" variant="primary" size="lg">
            {t.final_button}
          </Button>
          <div className="mt-4">
            <Link href="/work" className="text-sm text-white/60 hover:text-white transition-colors">
              Back to all case studies
            </Link>
          </div>
        </div>
      </Section>
    </>
  )
}
