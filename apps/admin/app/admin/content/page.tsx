import { prisma } from '@/lib/prisma'
import { requireAuth, requireRole } from '@/lib/auth-utils'
import { PAGE_TEXT_FIELDS } from '@onefocus/shared/page-text'
import PageHeader from '@/components/admin/PageHeader'
import ContentEditor from './ContentEditor'

export default async function ContentPage() {
  const session = await requireAuth()
  await requireRole(session, 'ADMIN')

  const sections = [...new Set(PAGE_TEXT_FIELDS.map((field) => field.section))]
  const contents = await prisma.siteContent.findMany({
    where: { section: { in: sections } },
    select: { section: true, key: true, value: true },
  })

  const values = contents.reduce<Record<string, string>>((acc, item) => {
    acc[`${item.section}:${item.key}`] = item.value
    return acc
  }, {})

  return (
    <div>
      <PageHeader
        title="Page text"
        description="Edit headings, descriptions, buttons and lists shown across public pages. Changes appear on the website after saving. Images are managed in Site images."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Page text' },
        ]}
      />
      <ContentEditor values={values} />
    </div>
  )
}
