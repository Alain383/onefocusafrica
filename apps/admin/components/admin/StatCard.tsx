import Link from 'next/link'
import AdminIcon, { type AdminIconName } from './AdminIcon'

type Tone = 'blue' | 'purple' | 'amber' | 'green'

interface StatCardProps {
  label: string
  value: number | string | null
  note: string
  icon: AdminIconName
  tone?: Tone
  href?: string
}

const TONES: Record<Tone, { wrap: string; icon: string }> = {
  blue: { wrap: 'bg-[#EEF6FD] text-[#1F99ED]', icon: 'text-[#1F99ED]' },
  purple: { wrap: 'bg-[#F0F0FB] text-[#2E3192]', icon: 'text-[#2E3192]' },
  amber: { wrap: 'bg-[#FFF7E8] text-[#B7791F]', icon: 'text-[#B7791F]' },
  green: { wrap: 'bg-[#ECFDF3] text-[#18794E]', icon: 'text-[#18794E]' },
}

export default function StatCard({ label, value, note, icon, tone = 'blue', href }: StatCardProps) {
  const display = value === null || value === undefined ? '—' : value
  const toneClass = TONES[tone]

  const card = (
    <div className="group relative h-full overflow-hidden rounded-2xl border border-[#E7ECF3] bg-white p-5 shadow-[0_2px_12px_rgba(16,24,63,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(16,24,63,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-[#6B7280]">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-[#10183F]">{display}</p>
        </div>
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${toneClass.wrap}`}>
          <AdminIcon name={icon} className={`h-5 w-5 ${toneClass.icon}`} />
        </span>
      </div>
      <p className="mt-3 text-[11px] text-[#9AA3B2]">{note}</p>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F99ED]">
        {card}
      </Link>
    )
  }

  return card
}
