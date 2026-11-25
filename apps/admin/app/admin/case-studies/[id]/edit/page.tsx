import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-utils'
import PageHeader from '@/components/admin/PageHeader'
import CaseStudyForm from '../../CaseStudyForm'

function parseList(value: string): string {
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.map(String).join('\n') : ''
  } catch {
    return ''
  }
}

export default async function EditCaseStudyPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAuth()
  const { id } = await params

  const study = await prisma.caseStudy.findUnique({ where: { id } })
  if (!study) notFound()

  return (
    <div>
      <PageHeader
        title="Edit case study"
        description="Changes here update the PROOF & CASE STUDIES page after saving."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Case studies', href: '/admin/case-studies' },
          { label: study.title },
        ]}
      />
      <Link href="/admin/case-studies" className="text-sm text-[#1F99ED] hover:underline">Back to case studies</Link>
      <div className="mt-5">
        <CaseStudyForm study={{
          id: study.id,
          title: study.title,
          category: study.category,
          clientName: study.clientName,
          challenge: study.challenge,
          solution: study.solution,
          outcome: study.outcome,
          deliverables: parseList(study.deliverables),
          publishedAssets: parseList(study.publishedAssets),
          isPublished: study.isPublished,
        }} />
      </div>
    </div>
  )
}
