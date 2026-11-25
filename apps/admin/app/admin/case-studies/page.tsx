import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-utils'
import PageHeader from '@/components/admin/PageHeader'
import CaseStudiesClient from './CaseStudiesClient'

export default async function CaseStudiesPage() {
  await requireAuth()

  const studies = await prisma.caseStudy.findMany({
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      isPublished: true,
      updatedAt: true,
    },
  })

  return (
    <div>
      <PageHeader
        title="Case studies"
        description="Published case studies appear under PROOF & CASE STUDIES at /work, each with its own detail page."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Case studies' }]}
        action={
          <Link
            href="/admin/case-studies/new"
            className="bg-[#1F99ED] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1a87d4] transition-colors"
          >
            New case study
          </Link>
        }
      />
      <CaseStudiesClient studies={studies} />
    </div>
  )
}
