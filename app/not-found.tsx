import Section from '@/components/ui/Section'
import Button from '@/components/ui/Button'

export default function NotFound() {
  return (
    <Section background="white" padding="lg">
      <div className="text-center max-w-2xl mx-auto">
        {/* Rowdies Bold — large display numeral */}
        <h1
          className="text-[5rem] md:text-[7rem] font-bold text-[#1F99ED] mb-3 leading-none"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          404
        </h1>
        <h2
          className="text-[1.75rem] md:text-[2.25rem] font-bold text-[#10183F] mb-5"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Page Not Found
        </h2>
        <p
          className="text-lg text-gray-600 mb-8"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button href="/" variant="primary" size="lg">
            Go Home
          </Button>
          <Button href="/contact" variant="outline" size="lg">
            Contact Us
          </Button>
        </div>
      </div>
    </Section>
  )
}
