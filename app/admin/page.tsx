import { prisma } from '@/lib/prisma'
import StatCard from '@/components/admin/StatCard'
import PageHeader from '@/components/admin/PageHeader'
import Link from 'next/link'

export default async function AdminDashboardPage() {
  const [publishedPosts, totalInquiries, newInquiries, activeMembers, recentInquiries, recentPosts] =
    await Promise.all([
      prisma.post.count({ where: { status: 'PUBLISHED' } }),
      prisma.inquiry.count(),
      prisma.inquiry.count({ where: { status: 'new' } }),
      prisma.communityMember.count({ where: { isActive: true } }),
      prisma.inquiry.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, fullName: true, serviceArea: true, status: true, createdAt: true },
      }),
      prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, title: true, status: true, createdAt: true },
      }),
    ])

  return (
    <div>
      <PageHeader title="Dashboard" />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Published Posts" value={publishedPosts} href="/admin/blog" />
        <StatCard label="Total Inquiries" value={totalInquiries} href="/admin/inquiries" />
        <StatCard label="New Inquiries" value={newInquiries} href="/admin/inquiries" />
        <StatCard label="Active Members" value={activeMembers} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Inquiries */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Recent Inquiries</h2>
            <Link href="/admin/inquiries" className="text-sm text-[#1F99ED] hover:underline">
              View all
            </Link>
          </div>
          <ul className="divide-y divide-gray-100">
            {recentInquiries.length === 0 && (
              <li className="px-5 py-4 text-sm text-gray-400">No inquiries yet.</li>
            )}
            {recentInquiries.map((inq) => (
              <li key={inq.id}>
                <Link
                  href={`/admin/inquiries/${inq.id}`}
                  className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{inq.fullName}</p>
                    <p className="text-xs text-gray-500">{inq.serviceArea}</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(inq.createdAt).toLocaleDateString()}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Recent Posts */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Recent Posts</h2>
            <Link href="/admin/blog" className="text-sm text-[#1F99ED] hover:underline">
              View all
            </Link>
          </div>
          <ul className="divide-y divide-gray-100">
            {recentPosts.length === 0 && (
              <li className="px-5 py-4 text-sm text-gray-400">No posts yet.</li>
            )}
            {recentPosts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/admin/blog/${post.id}/edit`}
                  className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
                >
                  <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                    {post.title}
                  </p>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                    {post.status}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
