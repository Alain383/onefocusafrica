import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-utils'
import PageHeader from '@/components/admin/PageHeader'
import Link from 'next/link'
import PortfolioTable from './PortfolioTable'

export default async function PortfolioPage() {
  await requireAuth()

  const caseStudies = await prisma.caseStudy.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      category: true,
      isPublished: true,
      createdAt: true,
    },
  })

  return (
    <div>
      <PageHeader
        title="Portfolio / Case Studies"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Portfolio' },
        ]}
        action={
          <Link
            href="/admin/portfolio/new"
            className="bg-[#1F99ED] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1a87d4] transition-colors"
          >
            New Case Study
          </Link>
        }
      />
      <PortfolioTable caseStudies={caseStudies} />
    </div>
  )
}
