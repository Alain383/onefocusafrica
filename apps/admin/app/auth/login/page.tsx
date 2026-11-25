'use client'

import { useEffect, useState, type FormEvent } from 'react'
import Image from 'next/image'
import { signIn, getProviders, getCsrfToken } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import AdminIcon from '@/components/admin/AdminIcon'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    void Promise.all([getProviders(), getCsrfToken()]).catch(() => {})
  }, [])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (!result || result.error) {
        const message = result?.error ?? ''
        if (message.toLowerCase().includes('too many') || message.includes('429')) {
          setError(message)
        } else {
          setError('Invalid email or password.')
        }
      } else {
        router.push('/admin')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#10183F] px-4 py-10">
      <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-[#1F99ED]/20 blur-3xl" />
      <div className="absolute -bottom-40 -right-24 h-96 w-96 rounded-full bg-[#2E3192]/40 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-3">
          <Image
            src="/images/onefocuslogo-on-dark.png?v=2"
            alt="ONEFOCUS AFRICA"
            width={484}
            height={512}
            priority
            className="h-12 w-auto object-contain"
          />
          <div>
            <p className="text-sm font-semibold text-white">ONEFOCUS AFRICA</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/45">Control room</p>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white p-7 shadow-2xl sm:p-9">
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-[#10183F]">Welcome back</h1>
            <p className="mt-1 text-sm text-[#6B7280]">Sign in to manage the website.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-[#374151]">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-[#DCE3EC] px-4 py-3 text-sm text-[#10183F] outline-none transition-colors focus:border-[#1F99ED] focus:ring-2 focus:ring-[#1F99ED]/15"
                placeholder="admin@onefocusafrica.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-[#374151]">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-xl border border-[#DCE3EC] px-4 py-3 pr-12 text-sm text-[#10183F] outline-none transition-colors focus:border-[#1F99ED] focus:ring-2 focus:ring-[#1F99ED]/15"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[#6B7280] hover:bg-[#EEF6FD]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <AdminIcon name={showPassword ? 'eyeOff' : 'eye'} className="h-4 w-4" />
                </button>
              </div>
            </div>

            {error && (
              <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AdminIcon name="alert" className="mt-0.5 h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1F99ED] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1A87D4] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign in'}
              {!loading && <AdminIcon name="arrow" className="h-4 w-4" />}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-xs text-white/40">
          Authorized ONEFOCUS team access only
        </p>
      </div>
    </main>
  )
}
