import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import StatCard from '@/components/admin/StatCard'
import AdminIcon, { type AdminIconName } from '@/components/admin/AdminIcon'
import { ADMIN_QUICK_ACTIONS } from '@/components/admin/quick-actions'
import { MEDIA_SLOTS } from '@onefocus/shared'
import { PAGE_TEXT_FIELDS } from '@onefocus/shared/page-text'

type ActivityKind = 'inquiry' | 'post' | 'case'

interface ActivityItem {
  id: string
  kind: ActivityKind
  title: string
  subtitle: string
  href: string
  at: Date
  icon: AdminIconName
}

const ACTIVITY_STYLES: Record<ActivityKind, string> = {
  inquiry: 'bg-[#EEF6FD] text-[#1F99ED]',
  post: 'bg-[#F0F0FB] text-[#2E3192]',
  case: 'bg-[#ECFDF3] text-[#18794E]',
}

function percent(value: number, total: number): number {
  if (total <= 0) return 0
  return Math.min(100, Math.round((value / total) * 100))
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export default async function AdminDashboardPage() {
  const [
    publishedPosts,
    totalPosts,
    totalInquiries,
    newInquiries,
    activeMembers,
    publishedCaseStudies,
    totalCaseStudies,
    mediaSlots,
    textEntries,
    categories,
    subscribers,
    recentInquiries,
    recentPosts,
    recentStudies,
  ] = await Promise.all([
    prisma.post.count({ where: { status: 'PUBLISHED' } }),
    prisma.post.count(),
    prisma.inquiry.count(),
    prisma.inquiry.count({ where: { status: 'new' } }),
    prisma.communityMember.count({ where: { isActive: true } }),
    prisma.caseStudy.count({ where: { isPublished: true } }),
    prisma.caseStudy.count(),
    prisma.siteContent.count({ where: { section: 'media' } }),
    prisma.siteContent.count({
      where: { section: { in: ['home', 'contact', 'talent', 'work', 'solutions', 'about'] } },
    }),
    prisma.postCategory.count(),
    prisma.newsletterSubscriber.count(),
    prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' },
      take: 4,
      select: { id: true, fullName: true, serviceArea: true, createdAt: true },
    }),
    prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      take: 4,
      select: { id: true, title: true, status: true, createdAt: true },
    }),
    prisma.caseStudy.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 4,
      select: { id: true, title: true, isPublished: true, updatedAt: true },
    }),
  ])

  const activity: ActivityItem[] = [
    ...recentInquiries.map((item) => ({
      id: `inquiry-${item.id}`,
      kind: 'inquiry' as const,
      title: item.fullName,
      subtitle: `New message · ${item.serviceArea}`,
      href: `/admin/inquiries/${item.id}`,
      at: item.createdAt,
      icon: 'inbox' as const,
    })),
    ...recentPosts.map((item) => ({
      id: `post-${item.id}`,
      kind: 'post' as const,
      title: item.title,
      subtitle: `Blog post · ${item.status.toLowerCase()}`,
      href: `/admin/blog/${item.id}/edit`,
      at: item.createdAt,
      icon: 'blog' as const,
    })),
    ...recentStudies.map((item) => ({
      id: `case-${item.id}`,
      kind: 'case' as const,
      title: item.title,
      subtitle: `Case study · ${item.isPublished ? 'published' : 'draft'}`,
      href: `/admin/case-studies/${item.id}/edit`,
      at: item.updatedAt,
      icon: 'case' as const,
    })),
  ]
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 6)

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const quickActions = ADMIN_QUICK_ACTIONS.map((action) => ({
    ...action,
    description:
      action.href === '/admin/inquiries' ? `${newInquiries} need attention` : action.description,
    icon: action.icon as AdminIconName,
  }))

  const healthRows = [
    { label: 'Media slots', value: mediaSlots, total: MEDIA_SLOTS.length, href: '/admin/cms' },
    { label: 'Page text fields', value: textEntries, total: PAGE_TEXT_FIELDS.length, href: '/admin/content' },
    { label: 'Published case studies', value: publishedCaseStudies, total: totalCaseStudies, href: '/admin/case-studies' },
    { label: 'Blog categories', value: categories, total: Math.max(categories, 1), href: '/admin/blog/categories' },
  ]

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-[#10183F] px-6 py-8 text-white shadow-[0_16px_44px_rgba(16,24,63,0.18)] sm:px-8 sm:py-10">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#1F99ED]/25 blur-3xl" />
        <div className="absolute -bottom-32 right-1/3 h-64 w-64 rounded-full bg-[#2E3192]/40 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1F99ED]" />
              Control room
            </div>
            <h1 className="text-2xl font-bold leading-tight text-white sm:text-3xl">
              Good to see you. Everything is in one place.
            </h1>
            <p className="mt-3 text-sm text-white/60">
              {today} · Manage content, review messages and keep the live site up to date.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/blog/new"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#10183F] transition-colors hover:bg-[#EEF6FD]"
            >
              Create content
              <AdminIcon name="arrow" className="h-4 w-4" />
            </Link>
            <a
              href="https://onefocus-africa.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/10"
            >
              Open website
              <AdminIcon name="external" className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Published posts" value={publishedPosts} note={`${totalPosts} posts in total`} icon="blog" tone="purple" href="/admin/blog" />
        <StatCard label="New messages" value={newInquiries} note={`${totalInquiries} inquiries received`} icon="inbox" tone="amber" href="/admin/inquiries" />
        <StatCard label="Published proof" value={publishedCaseStudies} note={`${totalCaseStudies} case studies in total`} icon="case" tone="green" href="/admin/case-studies" />
        <StatCard label="Active members" value={activeMembers} note={`${subscribers} newsletter subscribers`} icon="users" tone="blue" href="/admin/team" />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.7fr_1fr]">
        <div className="rounded-2xl border border-[#E7ECF3] bg-white shadow-[0_2px_12px_rgba(16,24,63,0.04)]">
          <div className="flex items-center justify-between border-b border-[#EEF1F6] px-5 py-4">
            <div>
              <h2 className="text-base font-semibold text-[#10183F]">Recent activity</h2>
              <p className="text-xs text-[#9AA3B2]">Latest changes across the workspace</p>
            </div>
            <AdminIcon name="clock" className="h-5 w-5 text-[#1F99ED]" />
          </div>

          {activity.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-5 py-14 text-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EEF6FD] text-[#1F99ED]">
                <AdminIcon name="check" className="h-5 w-5" />
              </span>
              <p className="text-sm font-medium text-[#10183F]">Nothing new yet</p>
              <p className="text-xs text-[#9AA3B2]">New messages and content will appear here.</p>
            </div>
          ) : (
            <ul className="divide-y divide-[#F1F3F7]">
              {activity.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-[#F8FAFD]"
                  >
                    <span className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${ACTIVITY_STYLES[item.kind]}`}>
                      <AdminIcon name={item.icon} className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-[#10183F]">{item.title}</span>
                      <span className="block truncate text-xs capitalize text-[#9AA3B2]">{item.subtitle}</span>
                    </span>
                    <span className="flex-shrink-0 text-xs text-[#9AA3B2]">{formatDate(item.at)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-[#E7ECF3] bg-white p-5 shadow-[0_2px_12px_rgba(16,24,63,0.04)]">
            <h2 className="text-base font-semibold text-[#10183F]">Quick actions</h2>
            <p className="mt-1 text-xs text-[#9AA3B2]">Jump straight into the work that matters.</p>
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-1">
              {quickActions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="group flex items-center gap-3 rounded-xl border border-[#EEF1F6] px-3 py-3 transition-all hover:border-[#1F99ED]/30 hover:bg-[#F8FBFF]"
                >
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#EEF6FD] text-[#1F99ED]">
                    <AdminIcon name={action.icon} className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-[#10183F]">{action.label}</span>
                    <span className="block truncate text-[11px] text-[#9AA3B2]">{action.description}</span>
                  </span>
                  <AdminIcon
                    name="arrow"
                    className="h-4 w-4 flex-shrink-0 text-[#C4CCD8] transition-transform group-hover:translate-x-0.5 group-hover:text-[#1F99ED]"
                  />
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#E7ECF3] bg-white p-5 shadow-[0_2px_12px_rgba(16,24,63,0.04)]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-[#10183F]">Content health</h2>
                <p className="text-xs text-[#9AA3B2]">What is ready on the live site</p>
              </div>
              <AdminIcon name="globe" className="h-5 w-5 text-[#2E3192]" />
            </div>
            <div className="mt-5 space-y-4">
              {healthRows.map((row) => {
                const value = percent(row.value, row.total)
                return (
                  <Link key={row.label} href={row.href} className="block">
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <span className="truncate text-xs font-medium text-[#4B5563]">{row.label}</span>
                      <span className="flex-shrink-0 text-[11px] text-[#9AA3B2]">
                        {row.value}/{row.total}
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-[#EEF1F6]">
                      <div
                        className="h-full rounded-full bg-brand-gradient"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
