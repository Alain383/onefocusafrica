import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-utils'
import PageHeader from '@/components/admin/PageHeader'
import { notFound } from 'next/navigation'
import InquiryDetailClient from '../InquiryDetailClient'

interface Props {
  params: Promise<{ id: string }>
}

export default async function InquiryDetailPage({ params }: Props) {
  await requireAuth()
  const { id } = await params

  const inquiry = await prisma.inquiry.findUnique({ where: { id } })
  if (!inquiry) notFound()

  return (
    <div>
      <PageHeader
        title="Inquiry Detail"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Inquiries', href: '/admin/inquiries' },
          { label: inquiry.fullName },
        ]}
      />
      <InquiryDetailClient inquiry={inquiry} />
    </div>
  )
}
