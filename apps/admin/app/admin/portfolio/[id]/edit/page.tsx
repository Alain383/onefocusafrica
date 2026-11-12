import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-utils'
import PageHeader from '@/components/admin/PageHeader'
import CaseStudyForm from '../../CaseStudyForm'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditCaseStudyPage({ params }: Props) {
  await requireAuth()
  const { id } = await params
  const cs = await prisma.caseStudy.findUnique({ where: { id } })
  if (!cs) notFound()

  // Parse JSON strings to arrays for the form
  const caseStudy = {
    ...cs,
    deliverables: JSON.parse(cs.deliverables) as string[],
    publishedAssets: (cs.publishedAssets ? JSON.parse(cs.publishedAssets) : []) as string[],
  }

  return (
    <div>
      <PageHeader
        title="Edit Case Study"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Portfolio', href: '/admin/portfolio' },
          { label: 'Edit' },
        ]}
      />
      <CaseStudyForm caseStudy={caseStudy} />
    </div>
  )
}