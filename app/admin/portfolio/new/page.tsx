import { requireAuth } from '@/lib/auth-utils'
import PageHeader from '@/components/admin/PageHeader'
import CaseStudyForm from '../CaseStudyForm'

export default async function NewCaseStudyPage() {
  await requireAuth()
  return (
    <div>
      <PageHeader
        title="New Case Study"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Portfolio', href: '/admin/portfolio' },
          { label: 'New' },
        ]}
      />
      <CaseStudyForm />
    </div>
  )
}
