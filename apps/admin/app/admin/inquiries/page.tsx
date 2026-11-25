import { prisma } from '@/lib/prisma'
import type { Prisma } from '@onefocus/database'
import { requireAuth } from '@/lib/auth-utils'
import PageHeader from '@/components/admin/PageHeader'
import Link from 'next/link'

const STATUS_OPTIONS = ['new', 'contacted', 'qualified', 'proposal', 'closed'] as const
const FOLLOW_UP_OPTIONS = ['all', 'due', 'upcoming', 'none'] as const

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  qualified: 'bg-purple-100 text-purple-700',
  proposal: 'bg-orange-100 text-orange-700',
  closed: 'bg-green-100 text-green-700',
}

const CATEGORIES = ['PROJECT', 'WORK', 'TRAINING', 'COMMUNITY', 'GENERAL'] as const
type InquiryCategory = (typeof CATEGORIES)[number]
type StatusOption = (typeof STATUS_OPTIONS)[number]
type FollowUpOption = (typeof FOLLOW_UP_OPTIONS)[number]

const CATEGORY_LABELS: Record<InquiryCategory, string> = {
  PROJECT: 'Start a Project',
  WORK: 'Our Work',
  TRAINING: 'Training',
  COMMUNITY: 'Community',
  GENERAL: 'General',
}

const CATEGORY_COLORS: Record<InquiryCategory, string> = {
  PROJECT: 'bg-blue-100 text-blue-700',
  WORK: 'bg-indigo-100 text-indigo-700',
  TRAINING: 'bg-emerald-100 text-emerald-700',
  COMMUNITY: 'bg-amber-100 text-amber-700',
  GENERAL: 'bg-gray-100 text-gray-600',
}

type RawSearchParams = {
  category?: string | string[]
  status?: string | string[]
  assignedTo?: string | string[]
  followUp?: string | string[]
  q?: string | string[]
}

function first(value?: string | string[]): string {
  if (Array.isArray(value)) return value[0] ?? ''
  return value ?? ''
}

export default async function InquiriesPage({ searchParams }: { searchParams: Promise<RawSearchParams> }) {
  await requireAuth()

  const raw = await searchParams
  const requestedCategory = first(raw.category).toUpperCase()
  const activeCategory = CATEGORIES.includes(requestedCategory as InquiryCategory)
    ? (requestedCategory as InquiryCategory)
    : null

  const requestedStatus = first(raw.status)
  const activeStatus = STATUS_OPTIONS.includes(requestedStatus as StatusOption)
    ? (requestedStatus as StatusOption)
    : ''

  const requestedFollowUp = first(raw.followUp)
  const activeFollowUp = FOLLOW_UP_OPTIONS.includes(requestedFollowUp as FollowUpOption)
    ? (requestedFollowUp as FollowUpOption)
    : 'all'

  const assignedTo = first(raw.assignedTo).trim()
  const query = first(raw.q).trim()

  const and: Prisma.InquiryWhereInput[] = []

  if (activeCategory) and.push({ category: activeCategory })
  if (activeStatus) and.push({ status: activeStatus })
  if (assignedTo) and.push({ assignedTo: { contains: assignedTo, mode: 'insensitive' } })

  if (query) {
    and.push({
      OR: [
        { fullName: { contains: query, mode: 'insensitive' } },
        { workEmail: { contains: query, mode: 'insensitive' } },
        { company: { contains: query, mode: 'insensitive' } },
        { serviceArea: { contains: query, mode: 'insensitive' } },
        { challenge: { contains: query, mode: 'insensitive' } },
      ],
    })
  }

  const endOfToday = new Date()
  endOfToday.setHours(23, 59, 59, 999)

  if (activeFollowUp === 'due') and.push({ followUpDate: { lte: endOfToday } })
  if (activeFollowUp === 'upcoming') and.push({ followUpDate: { gt: endOfToday } })
  if (activeFollowUp === 'none') and.push({ followUpDate: null })

  const where: Prisma.InquiryWhereInput = and.length > 0 ? { AND: and } : {}

  const [inquiries, counts] = await Promise.all([
    prisma.inquiry.findMany({
      where,
      orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        fullName: true,
        workEmail: true,
        company: true,
        serviceArea: true,
        category: true,
        status: true,
        assignedTo: true,
        followUpDate: true,
        createdAt: true,
      },
    }),
    prisma.inquiry.groupBy({
      by: ['category'],
      _count: { _all: true },
    }),
  ])

  const countFor = (value: InquiryCategory | 'ALL') =>
    value === 'ALL'
      ? counts.reduce((sum, row) => sum + row._count._all, 0)
      : (counts.find((row) => row.category === value)?._count._all ?? 0)

  function categoryHref(value: InquiryCategory | 'ALL') {
    const params = new URLSearchParams()
    if (value !== 'ALL') params.set('category', value)
    if (activeStatus) params.set('status', activeStatus)
    if (assignedTo) params.set('assignedTo', assignedTo)
    if (activeFollowUp !== 'all') params.set('followUp', activeFollowUp)
    if (query) params.set('q', query)
    const search = params.toString()
    return search ? `/admin/inquiries?${search}` : '/admin/inquiries'
  }

  const hasFilters = Boolean(activeCategory || activeStatus || assignedTo || query || activeFollowUp !== 'all')

  return (
    <div>
      <PageHeader
        title="Contact form submissions"
        description="Messages sent from the public /contact form. Filter, assign and track follow-ups here."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Submissions' }]}
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {(['ALL', ...CATEGORIES] as const).map((value) => (
          <Link
            key={value}
            href={categoryHref(value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeCategory === value || (value === 'ALL' && !activeCategory)
                ? 'bg-[#10183F] text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {value === 'ALL' ? 'All inquiries' : CATEGORY_LABELS[value]} ({countFor(value)})
          </Link>
        ))}
      </div>

      <form method="get" className="mb-5 rounded-xl border border-gray-200 bg-white p-4">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <label htmlFor="q" className="mb-1 block text-xs font-medium text-gray-600">
              Search
            </label>
            <input
              id="q"
              name="q"
              defaultValue={query}
              placeholder="Name, email, company, service..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F99ED]"
            />
          </div>

          <div>
            <label htmlFor="status" className="mb-1 block text-xs font-medium text-gray-600">
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={activeStatus}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F99ED]"
            >
              <option value="">All statuses</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="assignedTo" className="mb-1 block text-xs font-medium text-gray-600">
              Assigned To
            </label>
            <input
              id="assignedTo"
              name="assignedTo"
              defaultValue={assignedTo}
              placeholder="Name or email"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F99ED]"
            />
          </div>

          <div>
            <label htmlFor="followUp" className="mb-1 block text-xs font-medium text-gray-600">
              Follow-up
            </label>
            <select
              id="followUp"
              name="followUp"
              defaultValue={activeFollowUp}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F99ED]"
            >
              <option value="all">All follow-ups</option>
              <option value="due">Due or overdue</option>
              <option value="upcoming">Upcoming</option>
              <option value="none">No follow-up date</option>
            </select>
          </div>

          {activeCategory && <input type="hidden" name="category" value={activeCategory} />}

          <div className="flex items-end gap-2 md:col-span-2 lg:col-span-5">
            <button
              type="submit"
              className="rounded-lg bg-[#1F99ED] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1a87d4]"
            >
              Apply filters
            </button>
            <Link
              href="/admin/inquiries"
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              Clear
            </Link>
            <span className="ml-auto text-xs text-gray-400">{inquiries.length} shown</span>
          </div>
        </div>
      </form>

      {hasFilters && (
        <p className="mb-3 text-xs text-gray-500">
          Filters are active. Use Clear to see all submissions.
        </p>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Email</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Company</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Category</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Service</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Assigned To</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Follow-up</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {inquiries.length === 0 && (
                <tr>
                  <td colSpan={10} className="text-center py-12 text-gray-400">
                    No inquiries match these filters.
                  </td>
                </tr>
              )}
              {inquiries.map((inq) => {
                const followUp = inq.followUpDate ? new Date(inq.followUpDate) : null
                const isDue = followUp ? followUp <= endOfToday : false

                return (
                  <tr key={inq.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{inq.fullName}</td>
                    <td className="px-4 py-3 text-gray-600">{inq.workEmail}</td>
                    <td className="px-4 py-3 text-gray-600">{inq.company ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[inq.category as InquiryCategory] ?? ''}`}>
                        {CATEGORY_LABELS[inq.category as InquiryCategory] ?? inq.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{inq.serviceArea}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[inq.status] ?? ''}`}>
                        {inq.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{inq.assignedTo ?? <span className="text-gray-400">Unassigned</span>}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {followUp ? (
                        <span className={isDue ? 'font-medium text-red-600' : 'text-gray-500'}>
                          {followUp.toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
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
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
