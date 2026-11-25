import Link from 'next/link'
import { requireAuth } from '@/lib/auth-utils'
import PageHeader from '@/components/admin/PageHeader'
import CaseStudyForm from '../CaseStudyForm'

export default async function NewCaseStudyPage() {
  await requireAuth()

  return (
    <div>
      <PageHeader
        title="New case study"
        description="Add real proof. Publishing makes it appear on the public /work page."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Case studies', href: '/admin/case-studies' },
          { label: 'New' },
        ]}
      />
      <Link href="/admin/case-studies" className="text-sm text-[#1F99ED] hover:underline">Back to case studies</Link>
      <div className="mt-5">
        <CaseStudyForm />
      </div>
    </div>
  )
}
