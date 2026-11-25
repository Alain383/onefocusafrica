import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { parseMediaBlock } from '@onefocus/shared/media'
import Section from '@/components/ui/Section'
import Button from '@/components/ui/Button'
import CmsMedia from '@/components/CmsMedia'
import { prisma } from '@/lib/prisma'
import { getMediaBlock } from '@/lib/site-content'
import { caseCover, parseList } from '@/lib/case-studies'

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const study = await prisma.caseStudy.findFirst({
    where: { slug, isPublished: true },
    select: { title: true, outcome: true },
  })
  if (!study) return { title: 'Case study not found | ONEFOCUS AFRICA' }
  return { title: `${study.title} | ONEFOCUS AFRICA`, description: study.outcome.slice(0, 160) }
}

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params
  const [study, fallback] = await Promise.all([
    prisma.caseStudy.findFirst({ where: { slug, isPublished: true } }),
    getMediaBlock('work.project1'),
  ])
  if (!study) notFound()

  const assets = parseList(study.publishedAssets)
  const cover = caseCover(study.publishedAssets, fallback)
  const deliverables = parseList(study.deliverables)

  return (
    <>
      <Section background="white" padding="lg">
        <div className="max-w-4xl mx-auto">
          <Link href="/work" className="text-sm text-[#1F99ED] hover:underline">All case studies</Link>
          <p className="text-xs font-bold tracking-[0.15em] uppercase text-[#1F99ED] mt-8 mb-3" style={{ fontFamily: 'var(--font-body)' }}>
            {study.category}
          </p>
          <h1 className="text-[2.25rem] md:text-[3.25rem] font-bold text-[#10183F] mb-4 leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
            {study.title}
          </h1>
          {study.clientName && (
            <p className="text-lg text-gray-600 mb-6" style={{ fontFamily: 'var(--font-body)' }}>
              {study.clientName}
            </p>
          )}
          <div className="relative rounded-[5px] overflow-hidden shadow-[0_8px_40px_0_rgba(31,153,237,0.15)]">
            <CmsMedia block={cover} width={900} height={520} priority className="w-full h-auto object-cover" />
          </div>
        </div>
      </Section>

      <Section background="light" padding="lg">
        <div className="max-w-4xl mx-auto space-y-6">
          {[
            ['The challenge', study.challenge],
            ['What ONEFOCUS delivered', study.solution],
            ['Verified outcome', study.outcome],
          ].map(([heading, body]) => (
            <div key={heading} className="bg-white rounded-[5px] border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-[#10183F] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                {heading}
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line" style={{ fontFamily: 'var(--font-body)' }}>
                {body}
              </p>
            </div>
          ))}

          {deliverables.length > 0 && (
            <div className="bg-white rounded-[5px] border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-[#10183F] mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                Deliverables
              </h2>
              <ul className="space-y-2">
                {deliverables.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-700" style={{ fontFamily: 'var(--font-body)' }}>
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#1F99ED]" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Section>

      {assets.length > 1 && (
        <Section background="white" padding="lg">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-[#10183F] mb-6 text-center" style={{ fontFamily: 'var(--font-heading)' }}>
              Published assets
            </h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {assets.slice(1).map((asset, index) => (
                <div key={`${asset}-${index}`} className="relative h-64 rounded-[5px] overflow-hidden">
                  <CmsMedia
                    block={parseMediaBlock(asset, asset, study.title)}
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </Section>
      )}

      <Section background="dark" padding="lg">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            Want something similar?
          </h2>
          <p className="text-gray-300 mb-6" style={{ fontFamily: 'var(--font-body)' }}>
            Tell us what you are trying to achieve and we will scope a practical next step.
          </p>
          <Button href={`/contact?intent=WORK&subject=${encodeURIComponent(study.title)}`} variant="primary" size="lg">
            Ask About Similar Projects
          </Button>
        </div>
      </Section>
    </>
  )
}
