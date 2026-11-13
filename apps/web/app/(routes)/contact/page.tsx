import Section from '@/components/ui/Section'
import Image from 'next/image'
import InquiryForm from '@/components/forms/InquiryForm'

export const metadata = {
  title: 'Contact Us | ONEFOCUS AFRICA',
  description:
    "Get in touch with ONEFOCUS AFRICA. Tell us about your business challenge and we'll help you find the right solution.",
}

export default function ContactPage() {
  return (
    <>
      {/* ── Hero banner ── */}
      <div className="relative h-[260px] sm:h-[320px] md:h-[380px] overflow-hidden">
        <Image
          src="/images/personal.png"
          alt="ONEFOCUS AFRICA contact"
          fill
          className="object-cover object-top"
          priority
          sizes="100vw"
          quality={80}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#10183F]/70 via-[#10183F]/40 to-[#10183F]/80" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <p
            className="text-xs font-bold tracking-[0.15em] uppercase text-[#1F99ED] mb-3"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            GET IN TOUCH
          </p>
          <h1
            className="text-[2rem] md:text-[3.25rem] font-bold text-white mb-3 leading-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Let&apos;s discuss your next move.
          </h1>
          <p
            className="text-lg text-white/80 max-w-xl"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Based in Kigali, Rwanda. Serving businesses across Africa.
          </p>
        </div>
      </div>

      <Section background="white" padding="lg">
        {/* ── Contact info box ── */}
        <div className="max-w-2xl mx-auto mb-14">
          <div className="bg-[#EEF6FD] p-8 rounded-[5px]">
            <h2
              className="text-xl font-bold text-[#10183F] mb-6 text-center uppercase tracking-wide"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              CONTACT ONEFOCUS
            </h2>
            <div className="space-y-5 text-center">
              <div>
                <p
                  className="text-xs font-bold uppercase tracking-widest text-[#2E3192] mb-1"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Email
                </p>
                <a
                  href="mailto:onefocusafrica@gmail.com"
                  className="text-[#1F99ED] hover:text-[#2E3192] transition-colors text-lg font-medium"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  onefocusafrica@gmail.com
                </a>
              </div>
              <div className="h-px bg-[#1F99ED]/20 max-w-xs mx-auto" />
              <div>
                <p
                  className="text-xs font-bold uppercase tracking-widest text-[#2E3192] mb-1"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  WhatsApp
                </p>
                <a
                  href="https://wa.me/250781102667"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1F99ED] hover:text-[#2E3192] transition-colors text-lg font-medium"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  +250 781 102 667
                </a>
              </div>
            </div>
            <p
              className="text-xs text-gray-500 mt-6 text-center"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Before going live, verify the phone and email, and publish real privacy,
              accessibility and terms pages.
            </p>
          </div>
        </div>

        {/* ── Inquiry form ── */}
        <div className="mb-14">
          <div className="text-center mb-8">
            <p
              className="text-xs font-bold tracking-[0.15em] uppercase text-[#1F99ED] mb-3"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              DISCOVERY FORM
            </p>
            <h2
              className="text-[1.75rem] md:text-[2.25rem] font-bold text-[#10183F] mb-3"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              BUSINESS DISCOVERY
            </h2>
            <p
              className="text-lg text-gray-600 max-w-xl mx-auto"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Tell us what you want to grow. A clear brief helps us recommend the right
              engagement, realistic deliverables and responsible next steps.
            </p>
          </div>
          <InquiryForm />
        </div>

        {/* ── Process box ── */}
        <div className="max-w-3xl mx-auto mt-6">
          <h3
            className="text-xl md:text-2xl font-bold text-[#10183F] mb-4 text-center"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            OUR SIMPLE PROCESS
          </h3>
          <p
            className="text-base text-gray-600 mb-6 text-center"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            From an idea to a scoped project.
          </p>
          <div className="bg-white p-6 rounded-[5px] border border-[#EEF6FD] shadow-[0_2px_12px_0_rgba(31,153,237,0.07)]">
            <ul className="space-y-4 text-gray-700" style={{ fontFamily: 'var(--font-body)' }}>
              {[
                'Share your business challenge',
                'Discuss goals, timing and constraints',
                'Receive a defined, appropriate scope',
                'Agree deliverables, roles and next steps',
              ].map((item, i) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    className="flex-shrink-0 w-7 h-7 bg-[#1F99ED] text-white rounded-full flex items-center justify-center text-sm font-bold"
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{item}</span>
                </li>
              ))}
            </ul>
            <p
              className="text-xs text-gray-400 mt-6 italic"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              No promises of guaranteed sales, leads or monthly income. Projects are quoted by scope.
            </p>
          </div>
        </div>
      </Section>
    </>
  )
}