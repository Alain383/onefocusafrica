import Link from 'next/link'
import Section from '../ui/Section'
import Button from '../ui/Button'
import CmsMedia from '../CmsMedia'
import { prisma } from '@/lib/prisma'
import { caseCover } from '@/lib/case-studies'
import { getMediaBlock } from '@/lib/site-content'

export default async function CaseStudies() {
  const [studies, fallback] = await Promise.all([
    prisma.caseStudy.findMany({
      where: { isPublished: true },
      orderBy: [{ publishedAt: 'desc' }, { updatedAt: 'desc' }],
      take: 3,
    }),
    getMediaBlock('work.project1'),
  ])

  if (studies.length === 0) return null

  return (
    <Section background="light" padding="lg">
      <div className="text-center mb-14">
        <p className="text-xs font-bold tracking-[0.15em] uppercase text-[#1F99ED] mb-4" style={{ fontFamily: 'var(--font-body)' }}>
          SELECTED WORK
        </p>
        <h2 className="text-[2rem] md:text-[2.75rem] font-bold text-[#10183F] mb-3 leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
          Proof matters more than promises.
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
        {studies.map((study, index) => (
          <div key={study.id} className="bg-white rounded-[5px] border border-gray-200 overflow-hidden shadow-[0_2px_12px_0_rgba(31,153,237,0.08)]">
            <div className="relative h-40 overflow-hidden">
              <CmsMedia
                block={caseCover(study.publishedAssets, fallback)}
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="p-5">
              <span className="text-xs font-bold text-[#1F99ED] tracking-wider uppercase" style={{ fontFamily: 'var(--font-body)' }}>
                {study.category}
              </span>
              <h3 className="text-lg font-semibold text-[#10183F] mt-2 mb-2" style={{ fontFamily: 'var(--font-body)' }}>
                {study.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3" style={{ fontFamily: 'var(--font-body)' }}>
                {study.outcome}
              </p>
              <div className="space-y-2">
                <Link href={`/work/${study.slug}`} className="text-[#1F99ED] font-semibold text-sm hover:text-[#2E3192] transition-colors" style={{ fontFamily: 'var(--font-body)' }}>
                  View case study
                </Link>
                <div>
                  <Button href={`/contact?intent=WORK&subject=${encodeURIComponent(study.title)}`} variant="outline" size="sm" className="w-full">
                    Ask About Similar Projects
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Button href="/work" variant="primary" size="lg">
          View All Case Studies
        </Button>
      </div>
    </Section>
  )
}
