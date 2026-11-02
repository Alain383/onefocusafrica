'use client'

import { useEffect } from 'react'
import Section from '@/components/ui/Section'
import Button from '@/components/ui/Button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Error:', error)
  }, [error])

  return (
    <Section background="white" padding="lg">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-primary-dark mb-4">Something went wrong</h1>
        <p className="text-lg text-gray-700 mb-8">
          We encountered an unexpected error. Please try again.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset} variant="primary" size="lg">
            Try Again
          </Button>
          <Button href="/" variant="outline" size="lg">
            Go Home
          </Button>
        </div>
      </div>
    </Section>
  )
}
