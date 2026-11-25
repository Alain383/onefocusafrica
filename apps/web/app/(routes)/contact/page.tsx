import type { ReactNode } from 'react'
import Section from '@/components/ui/Section'
import CmsMedia from '@/components/CmsMedia'
import ContactIcon, { type ContactIconName } from '@/components/ui/ContactIcon'
import InquiryForm from '@/components/forms/InquiryForm'
import { getMediaBlock, getPageText } from '@/lib/site-content'
import { toInquiryCategory } from '@/lib/inquiry-category'
import { inquiryContext } from '@/lib/inquiry-context'

export const metadata = {
  title: 'Contact Us | ONEFOCUS AFRICA',
  description:
    'Contact ONEFOCUS AFRICA in Nyarugenge, Kigali, Rwanda. Send an inquiry and our team will respond within 1–2 business days.',
}

function DetailItem({
  icon,
  label,
  children,
}: {
  icon: ContactIconName
  label: string
  children: ReactNode
}) {
  return (
    <div className="flex gap-4">
      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-[#1F99ED]">
        <ContactIcon name={icon} className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50">
          {label}
        </p>
        <div className="mt-1 text-sm font-medium leading-relaxed text-white">{children}</div>
      </div>
    </div>
  )
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ intent?: string; subject?: string }>
}) {
  const { intent, subject } = await searchParams
  const category = toInquiryCategory(intent)
  const context = inquiryContext[category]

  const textKeys = [
    'hero_title',
    'hero_subtitle',
    'form_description',
    'location_eyebrow',
    'location_title',
    'location_description',
    'location_address',
    'location_directions',
  ] as const
  const textValues = await Promise.all(textKeys.map((key) => getPageText('contact', key)))
  const t = Object.fromEntries(textKeys.map((key, index) => [key, textValues[index]])) as Record<
    (typeof textKeys)[number],
    string
  >

  const formDescription = category === 'GENERAL' ? t.form_description : context.description
  const heroMedia = await getMediaBlock('contact.hero')
  const mapQuery = encodeURIComponent(t.location_address)
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`

  return (
    <>
      <div className="relative min-h-[320px] overflow-hidden md:min-h-[420px]">
        <CmsMedia
          block={heroMedia}
          priority
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#10183F]/90 via-[#10183F]/70 to-[#1F99ED]/40" />
        <div className="relative mx-auto flex min-h-[320px] max-w-7xl flex-col justify-end px-4 pb-12 sm:px-6 md:min-h-[420px] md:pb-16 lg:px-8">
          <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1F99ED]" />
            Get in touch
          </span>
          <h1
            className="max-w-3xl text-[2.25rem] font-bold leading-tight text-white md:text-[3.5rem]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {t.hero_title}
          </h1>
          <p
            className="mt-4 max-w-2xl text-lg text-white/80"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {t.hero_subtitle}
          </p>
        </div>
      </div>

      <Section background="light" padding="lg">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <aside className="lg:col-span-4">
            <div className="h-full rounded-[5px] bg-[#10183F] p-7 shadow-[0_12px_40px_rgba(16,24,63,0.16)] sm:p-8">
              <p
                className="text-xs font-bold uppercase tracking-[0.16em] text-[#1F99ED]"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Contact details
              </p>
              <h2
                className="mt-3 text-2xl font-bold text-white"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Talk to our team
              </h2>
              <p
                className="mt-3 text-sm leading-relaxed text-white/60"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Choose the channel that works for you. Clear context helps us respond with a useful
                next step.
              </p>

              <div className="mt-8 space-y-6" style={{ fontFamily: 'var(--font-body)' }}>
                <DetailItem icon="mail" label="Email">
                  <a
                    href="mailto:onefocusafrica@gmail.com"
                    className="break-all transition-colors hover:text-[#1F99ED]"
                  >
                    onefocusafrica@gmail.com
                  </a>
                </DetailItem>
                <DetailItem icon="phone" label="WhatsApp">
                  <a
                    href="https://wa.me/250781102667"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-[#1F99ED]"
                  >
                    +250 781 102 667
                  </a>
                </DetailItem>
                <DetailItem icon="pin" label="Office">
                  <span>{t.location_address}</span>
                </DetailItem>
                <DetailItem icon="clock" label="Response time">
                  <span>Within 1–2 business days</span>
                </DetailItem>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-8">
            <div className="rounded-[5px] bg-white p-6 shadow-[0_2px_16px_rgba(31,153,237,0.08)] sm:p-8 md:p-10">
              <div className="mb-8">
                <p
                  className="text-xs font-bold uppercase tracking-[0.16em] text-[#1F99ED]"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {context.eyebrow}
                </p>
                <h2
                  className="mt-3 text-[1.75rem] font-bold text-[#10183F] md:text-[2.25rem]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {context.title}
                </h2>
                <p
                  className="mt-3 max-w-2xl text-base leading-relaxed text-gray-600"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {formDescription}
                </p>
              </div>
              <InquiryForm category={category} subject={subject} />
            </div>
          </div>
        </div>
      </Section>

      <Section background="white" padding="lg" id="location">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <p
              className="text-xs font-bold tracking-[0.16em] uppercase text-[#1F99ED]"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {t.location_eyebrow}
            </p>
            <h2
              className="mt-3 text-[2rem] font-bold text-[#10183F] md:text-[2.75rem]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {t.location_title}
            </h2>
            <p
              className="mt-4 max-w-lg text-lg leading-relaxed text-gray-600"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {t.location_description}
            </p>

            <div className="mt-8 rounded-[5px] border border-[#E7ECF3] bg-white p-6 shadow-[0_2px_12px_rgba(31,153,237,0.06)]">
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#2E3192]"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Head office
              </p>
              <p
                className="mt-2 text-lg font-semibold leading-relaxed text-[#10183F]"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {t.location_address}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-[5px] bg-[#10183F] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1F99ED]"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {t.location_directions}
                  <ContactIcon name="arrow" className="h-4 w-4" />
                </a>
                <a
                  href="mailto:onefocusafrica@gmail.com"
                  className="inline-flex items-center gap-2 rounded-[5px] border border-[#1F99ED] px-5 py-3 text-sm font-semibold text-[#1F99ED] transition-colors hover:bg-[#EEF6FD]"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Email us
                  <ContactIcon name="mail" className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="flex h-full min-h-[320px] flex-col justify-between rounded-[5px] border border-[#E7ECF3] bg-gradient-to-br from-[#EEF6FD] to-white p-8 shadow-[0_8px_32px_rgba(16,24,63,0.08)] md:min-h-[440px]">
              <div>
                <p
                  className="text-xs font-bold uppercase tracking-[0.18em] text-[#1F99ED]"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Visit us
                </p>
                <p
                  className="mt-6 max-w-lg text-2xl font-bold leading-relaxed text-[#10183F] md:text-3xl"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Nyarugenge, Timbuktoo Building, Kigali, Rwanda
                </p>
              </div>
              <div className="mt-10 flex flex-wrap gap-3">
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-[5px] bg-[#1F99ED] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#10183F]"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {t.location_directions}
                  <ContactIcon name="arrow" className="h-4 w-4" />
                </a>
                <a
                  href="mailto:onefocusafrica@gmail.com"
                  className="inline-flex items-center gap-2 rounded-[5px] border border-[#1F99ED] px-5 py-3 text-sm font-semibold text-[#1F99ED] transition-colors hover:bg-white"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Email us
                  <ContactIcon name="mail" className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section background="dark" padding="lg">
        <div className="mx-auto max-w-5xl">
          <p
            className="text-center text-xs font-bold uppercase tracking-[0.16em] text-[#1F99ED]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Our simple process
          </p>
          <h2
            className="mt-3 text-center text-[2rem] font-bold text-white md:text-[2.75rem]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            From an idea to a scoped project
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              'Share your business challenge',
              'Discuss goals, timing and constraints',
              'Receive a defined, appropriate scope',
              'Agree deliverables, roles and next steps',
            ].map((item, index) => (
              <div
                key={item}
                className="rounded-[5px] border border-white/10 bg-white/5 p-5"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1F99ED] text-sm font-bold text-white">
                  {index + 1}
                </span>
                <p className="mt-4 text-sm font-medium leading-relaxed text-white">{item}</p>
              </div>
            ))}
          </div>
          <p
            className="mt-8 text-center text-xs text-white/50"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            No promises of guaranteed sales, leads or monthly income. Projects are quoted by scope.
          </p>
        </div>
      </Section>
    </>
  )
}
