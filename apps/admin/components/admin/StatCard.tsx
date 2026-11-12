import Link from 'next/link'

interface StatCardProps {
  label: string
  value: number | string | null
  href?: string
}

export default function StatCard({ label, value, href }: StatCardProps) {
  const display = value === null || value === undefined ? '—' : value

  const card = (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="text-3xl font-bold text-[#101D3A] mt-2">{display}</p>
    </div>
  )

  if (href) {
    return <Link href={href}>{card}</Link>
  }
  return card
}
