import { prisma } from '@/lib/prisma'
import { requireAuth, requireRole } from '@/lib/auth-utils'
import PageHeader from '@/components/admin/PageHeader'
import SettingsClient from './SettingsClient'

export default async function SettingsPage() {
  const session = await requireAuth()
  await requireRole(session, 'ADMIN')

  const settings = await prisma.siteContent.findMany({
    where: { section: 'settings' },
    orderBy: { key: 'asc' },
  })

  return (
    <div>
      <PageHeader title="Settings" breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Settings' }]} />
      <SettingsClient settings={settings} />
    </div>
  )
}
