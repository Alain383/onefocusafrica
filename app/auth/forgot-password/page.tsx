'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setStatus('success')
        setMessage('If an account exists with this email, you will receive password reset instructions.')
      } else {
        setStatus('error')
        setMessage('Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setMessage('Network error. Please check your connection.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#101D3A]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#101D3A]">Reset Password</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>

        {status === 'success' ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-700">
              {message}
            </div>
            <Link
              href="/auth/login"
              className="block w-full text-center bg-[#1F99ED] text-white py-2.5 rounded-lg font-medium hover:bg-[#1a87d4] transition-colors"
            >
              Back to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F99ED] focus:border-transparent"
                placeholder="admin@onefocusafrica.com"
              />
            </div>

            {status === 'error' && (
              <div role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-[#1F99ED] text-white py-2.5 rounded-lg font-medium hover:bg-[#1a87d4] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {status === 'loading' ? 'Sending…' : 'Send reset link'}
            </button>

            <div className="text-center">
              <Link
                href="/auth/login"
                className="text-sm text-gray-600 hover:text-[#1F99ED]"
              >
                ← Back to login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
