import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-utils'
import PageHeader from '@/components/admin/PageHeader'
import Link from 'next/link'

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  qualified: 'bg-purple-100 text-purple-700',
  proposal: 'bg-orange-100 text-orange-700',
  closed: 'bg-green-100 text-green-700',
}

export default async function InquiriesPage() {
  await requireAuth()

  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      fullName: true,
      workEmail: true,
      company: true,
      serviceArea: true,
      status: true,
      assignedTo: true,
      createdAt: true,
    },
  })

  return (
    <div>
      <PageHeader
        title="Business Inquiries"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Inquiries' }]}
      />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Email</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Company</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Service</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {inquiries.length === 0 && (
                <tr><td colSpan={7} className="text-center py-12 text-gray-400">No inquiries yet.</td></tr>
              )}
              {inquiries.map((inq) => (
                <tr key={inq.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{inq.fullName}</td>
                  <td className="px-4 py-3 text-gray-600">{inq.workEmail}</td>
                  <td className="px-4 py-3 text-gray-600">{inq.company ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{inq.serviceArea}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[inq.status] ?? ''}`}>
                      {inq.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    {new Date(inq.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/inquiries/${inq.id}`} className="text-[#1F99ED] hover:underline text-xs">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
