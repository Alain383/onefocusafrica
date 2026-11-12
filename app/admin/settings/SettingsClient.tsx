'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { upsertSiteContent } from '@/app/admin/content/actions'

type Setting = { id: string; section: string; key: string; value: string }
interface Props { settings: Setting[] }

const DEFAULT_SETTINGS = [
  { key: 'siteName', label: 'Site Name', placeholder: 'ONEFOCUS AFRICA' },
  { key: 'siteTagline', label: 'Tagline', placeholder: 'Creative Branding & Strategy' },
  { key: 'contactEmail', label: 'Contact Email', placeholder: 'hello@onefocusafrica.com' },
  { key: 'twitterUrl', label: 'Twitter URL', placeholder: 'https://twitter.com/...' },
  { key: 'linkedinUrl', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/...' },
  { key: 'instagramUrl', label: 'Instagram URL', placeholder: 'https://instagram.com/...' },
]

export default function SettingsClient({ settings }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const initialValues = DEFAULT_SETTINGS.reduce<Record<string, string>>((acc, s) => {
    const found = settings.find(setting => setting.key === s.key)
    acc[s.key] = found?.value ?? ''
    return acc
  }, {})

  const [values, setValues] = useState(initialValues)

  function handleChange(key: string, val: string) {
    setValues(prev => ({ ...prev, [key]: val }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      for (const { key } of DEFAULT_SETTINGS) {
        const res = await upsertSiteContent({ section: 'settings', key, value: values[key] ?? '' })
        if (!res.success) { setError(res.error); return }
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      router.refresh()
    })
  }

  return (
    <form onSubmit={handleSave} className="max-w-lg space-y-4">
      {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</div>}

      {DEFAULT_SETTINGS.map(({ key, label, placeholder }) => (
        <div key={key}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
          <input
            type="text"
            value={values[key] ?? ''}
            onChange={e => handleChange(key, e.target.value)}
            placeholder={placeholder}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F99ED]"
          />
        </div>
      ))}

      <button type="submit" disabled={isPending}
        className="bg-[#1F99ED] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#1a87d4] disabled:opacity-60 transition-colors">
        {saved ? 'Saved ✓' : isPending ? 'Saving…' : 'Save Settings'}
      </button>
    </form>
  )
}
