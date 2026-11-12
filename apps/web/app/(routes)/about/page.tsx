import Section from '@/components/ui/Section'
import Button from '@/components/ui/Button'
import Image from 'next/image'

export const metadata = {
  title: 'About Us | ONEFOCUS AFRICA',
  description:
    'Built in Africa. Designed to move business forward. Learn about ONEFOCUS AFRICA and our approach to growth.',
}

export default function AboutPage() {
  const values = [
    {
      title: 'Innovation First',
      initial: 'I',
      description: 'Modern, forward-thinking branding solutions that keep brands ahead.',
    },
    {
      title: 'Authentic Impact',
      initial: 'A',
      description: 'We build brands that genuinely connect with people and communities.',
    },
    {
      title: 'Consistency',
      initial: 'C',
      description: 'Every brand touchpoint feels unified, professional, and memorable.',
    },
    {
      title: 'Empowerment',
      initial: 'E',
      description: 'Design and strategy that helps businesses grow with confidence.',
    },
  ]

  return (
    <>
      {/* ── Header hero ── */}
      <Section background="white" padding="lg">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p
                className="text-xs font-bold tracking-[0.15em] uppercase text-[#1F99ED] mb-5"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                OUR STORY
              </p>
              <h1
                className="text-[2.5rem] md:text-[3.5rem] font-bold text-[#10183F] mb-6 leading-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                ABOUT ONEFOCUS AFRICA
              </h1>
              <p
                className="text-xl text-[#2E3192] font-semibold mb-6"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Built in Africa. Designed to move business forward.
              </p>
              <p
                className="text-lg text-gray-600 leading-relaxed"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                ONEFOCUS AFRICA connects commercial strategy, media, technology and practical
                skills under one clear approach.
              </p>
            </div>
            <div className="relative rounded-[5px] overflow-hidden shadow-[0_8px_40px_0_rgba(31,153,237,0.15)]">
              <Image
                src="/images/office1.png"
                alt="ONEFOCUS AFRICA office and team"
                width={700}
                height={500}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </Section>

      {/* ── Why We Exist ── */}
      <Section background="light" padding="lg">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative rounded-[5px] overflow-hidden shadow-[0_8px_40px_0_rgba(31,153,237,0.12)] order-2 lg:order-1">
              <Image
                src="/images/team.webp"
                alt="ONEFOCUS AFRICA team collaborating"
                width={700}
                height={500}
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <p
                className="text-xs font-bold tracking-[0.15em] uppercase text-[#1F99ED] mb-4"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                WHY WE EXIST
              </p>
              <h2
                className="text-[2rem] md:text-[2.75rem] font-bold text-[#10183F] mb-6 leading-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                A clear partner for complex growth challenges.
              </h2>
              <div className="space-y-5 text-gray-700 mb-10" style={{ fontFamily: 'var(--font-body)' }}>
                <p className="text-lg leading-relaxed">
                  Disconnected marketing, media production and technology vendors can make execution
                  unnecessarily difficult. ONEFOCUS aims to bring the most useful capabilities
                  together, scoped to a client&apos;s actual needs.
                </p>
                <p className="text-lg leading-relaxed">
                  We believe that business growth requires more than visibility. It requires a
                  system where brand positioning, content creation, website experience, and
                  follow-up all work together — not in isolation.
                </p>
              </div>
              <Button href="/contact" variant="primary" size="lg">
                Work With Us →
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Core Values ── */}
      <Section background="white" padding="lg">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p
              className="text-xs font-bold tracking-[0.15em] uppercase text-[#1F99ED] mb-4"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              WHAT WE STAND FOR
            </p>
            <h2
              className="text-[2rem] md:text-[2.75rem] font-bold text-[#10183F] leading-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Our Core Values
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-white rounded-[5px] shadow-[0_2px_12px_0_rgba(31,153,237,0.08)] p-6 text-center border-t-4 border-[#1F99ED]"
              >
                <div className="bg-[#1F99ED] text-white w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold shadow-[0_2px_10px_0_rgba(31,153,237,0.25)]">
                  {value.initial}
                </div>
                <h3
                  className="text-base font-semibold text-[#10183F] mb-2"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {value.title}
                </h3>
                <p
                  className="text-gray-600 text-sm leading-relaxed"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── What We Do ── dark section */}
      <Section background="dark" padding="lg">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-[2rem] md:text-[2.75rem] font-bold mb-10 text-center"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            What We Do
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="bg-white/10 p-6 rounded-[5px] border border-white/10">
              <h3
                className="text-lg font-semibold mb-3 text-[#1F99ED]"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                For Businesses
              </h3>
              <p
                className="text-gray-300 leading-relaxed text-sm"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Strategy, media, web and automation that helps companies become easier to find,
                trust and choose. We fix fragmented growth systems.
              </p>
            </div>
            <div className="bg-white/10 p-6 rounded-[5px] border border-white/10">
              <h3
                className="text-lg font-semibold mb-3 text-[#1F99ED]"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                For Talent
              </h3>
              <p
                className="text-gray-300 leading-relaxed text-sm"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Learning, community, mentorship and practical projects that help creators and
                professionals build demonstrable skills and real opportunities.
              </p>
            </div>
          </div>
          {/* Office image inside dark section */}
          <div className="relative rounded-[5px] overflow-hidden shadow-[0_8px_40px_0_rgba(0,0,0,0.3)]">
            <Image
              src="/images/office.png"
              alt="ONEFOCUS AFRICA workspace"
              width={1200}
              height={500}
              className="w-full h-[280px] sm:h-[360px] object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#10183F]/60 to-transparent" />
          </div>
        </div>
      </Section>

      {/* ── Location ── */}
      <Section background="white" padding="lg">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h2
                className="text-[2rem] md:text-[2.5rem] font-bold text-[#10183F] mb-5"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Based in Kigali, Rwanda
              </h2>
              <p
                className="text-lg text-gray-600 mb-8 leading-relaxed"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Serving businesses, institutions and individuals across Africa through practical
                partnerships and remote-first collaboration.
              </p>
              <div className="bg-[#EEF6FD] rounded-[5px] p-6 mb-8 space-y-3 text-left">
                <p style={{ fontFamily: 'var(--font-body)' }} className="text-gray-700">
                  <strong className="text-[#10183F]">Email: </strong>
                  <a href="mailto:onefocusafrica@gmail.com" className="text-[#1F99ED] hover:text-[#2E3192] transition-colors">
                    onefocusafrica@gmail.com
                  </a>
                </p>
                <p style={{ fontFamily: 'var(--font-body)' }} className="text-gray-700">
                  <strong className="text-[#10183F]">WhatsApp: </strong>
                  <a href="https://wa.me/250781102667" className="text-[#1F99ED] hover:text-[#2E3192] transition-colors">
                    +250 781 102 667
                  </a>
                </p>
              </div>
              <Button href="/contact" variant="primary" size="lg">
                Get in Touch →
              </Button>
            </div>
            <div className="relative rounded-[5px] overflow-hidden shadow-[0_8px_40px_0_rgba(31,153,237,0.12)]">
              <Image
                src="/images/officepersonal.png"
                alt="ONEFOCUS AFRICA team member"
                width={600}
                height={500}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}