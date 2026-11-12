import Section from '@/components/ui/Section'
import Button from '@/components/ui/Button'
import Image from 'next/image'

export const metadata = {
  title: 'Talent & Learning | ONEFOCUS AFRICA',
  description:
    'Build skills, show work, discover opportunities. Courses, career guidance, mentorship and community.',
}

export default function TalentPage() {
  const journey = [
    { step: '1', title: 'Discover', description: 'Explore possible pathways and strengths.' },
    { step: '2', title: 'Develop', description: 'Learn relevant tools and skills.' },
    { step: '3', title: 'Build', description: 'Work on age-appropriate real projects.' },
    { step: '4', title: 'Showcase', description: 'Present evidence of completed work.' },
    { step: '5', title: 'Connect', description: 'Meet approved mentors and institutions.' },
    { step: '6', title: 'Grow', description: 'Apply feedback to the next step.' },
  ]

  const programs = [
    { icon: '✳', title: 'Learning Academy', description: 'Courses and practical workshops', href: '#academy' },
    { icon: '✳', title: 'INZIRA AI', description: 'Career guidance concept; confirm live functionality before launch', href: '#inzira' },
    { icon: '✳', title: 'HYPERDRIVE', description: 'Entrepreneurship learning and project challenges', href: '#hyperdrive' },
    { icon: '✳', title: 'School Outreach', description: 'School-approved, supervised learner programs', href: '#school' },
    { icon: '✳', title: '1FOCUS VIP Inner Circle', description: 'Peer learning and community support', href: '#community' },
    { icon: '✳', title: 'Mentorship & Internships', description: 'Program availability and safeguards must be verified', href: '#mentorship' },
  ]

  const skillPathways = [
    { title: 'AI & Prompt Engineering', description: 'Practice-based modules, project exercises and an appropriate level of support.' },
    { title: 'Websites, Landing Pages & Funnels', description: 'Practice-based modules, project exercises and an appropriate level of support.' },
    { title: 'Email Marketing & Customer Communication', description: 'Practice-based modules, project exercises and an appropriate level of support.' },
    { title: 'Brand Strategy, Graphic Design & Content', description: 'Practice-based modules, project exercises and an appropriate level of support.' },
  ]

  return (
    <>
      {/* ── Hero — two-column with image ── */}
      <Section background="white" padding="lg">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <p
                className="text-xs font-bold tracking-[0.15em] uppercase text-[#1F99ED] mb-5"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                TALENT ECOSYSTEM
              </p>
              <h1
                className="text-[2.5rem] md:text-[3.5rem] font-bold text-[#10183F] mb-5 leading-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                TALENT &amp; LEARNING
              </h1>
              <p
                className="text-xl text-[#2E3192] font-semibold mb-5"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Build skills. Show work. Discover opportunities.
              </p>
              <p
                className="text-lg text-gray-600 leading-relaxed mb-8"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Courses, career discovery, mentorship, portfolios, entrepreneurship and community
                within one clear learner journey.
              </p>
              <Button href="#academy" variant="primary" size="lg">
                Explore Programs →
              </Button>
            </div>
            <div className="relative rounded-[5px] overflow-hidden shadow-[0_8px_40px_0_rgba(31,153,237,0.15)]">
              <Image
                src="/images/workshop.png"
                alt="ONEFOCUS AFRICA learning workshop"
                width={700}
                height={520}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </Section>

      {/* ── Journey ── */}
      <Section background="light" padding="lg">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-[2rem] md:text-[2.75rem] font-bold text-[#10183F] mb-3 leading-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              THE ONEFOCUS JOURNEY
            </h2>
            <p
              className="text-lg text-gray-600"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              From potential to demonstrable skills.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {journey.map((item) => (
              <div
                key={item.step}
                className="bg-white rounded-[5px] shadow-[0_2px_12px_0_rgba(31,153,237,0.08)] p-6 border-t-4 border-[#1F99ED]"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div
                    className="flex-shrink-0 w-11 h-11 bg-[#1F99ED] text-white rounded-full flex items-center justify-center font-bold text-lg"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {item.step}
                  </div>
                  <h3
                    className="text-lg font-semibold text-[#10183F]"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {item.title}
                  </h3>
                </div>
                <p
                  className="text-gray-600 text-sm leading-relaxed"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Programs ── */}
      <Section background="white" padding="lg">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <p
                className="text-xs font-bold tracking-[0.15em] uppercase text-[#1F99ED] mb-4"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                OUR PROGRAMS
              </p>
              <h2
                className="text-[2rem] md:text-[2.75rem] font-bold text-[#10183F] mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                PROGRAMS
              </h2>
              <p
                className="text-lg text-gray-600 mb-8"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Each initiative has a clear role.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {programs.map((program) => (
                  <a
                    key={program.title}
                    href={program.href}
                    className="group bg-white rounded-[5px] shadow-[0_2px_12px_0_rgba(31,153,237,0.08)] p-5 transition-all duration-200 hover:shadow-[0_6px_28px_0_rgba(31,153,237,0.16)] hover:-translate-y-1 border border-transparent hover:border-[#1F99ED]/20 block"
                  >
                    <div className="text-2xl text-[#1F99ED] mb-3" aria-hidden="true">{program.icon}</div>
                    <h3
                      className="text-sm font-semibold text-[#10183F] mb-1"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {program.title}
                    </h3>
                    <p
                      className="text-gray-600 text-xs leading-relaxed"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {program.description}
                    </p>
                  </a>
                ))}
              </div>
            </div>
            <div className="relative rounded-[5px] overflow-hidden shadow-[0_8px_40px_0_rgba(31,153,237,0.12)] lg:sticky lg:top-24">
              <Image
                src="/images/podcast.webp"
                alt="ONEFOCUS AFRICA programs in action"
                width={600}
                height={600}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* ── Learning Academy ── */}
      <Section background="light" padding="lg" id="academy">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p
              className="text-xs font-bold tracking-[0.15em] uppercase text-[#1F99ED] mb-4"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              SKILLS TRAINING
            </p>
            <h2
              className="text-[2rem] md:text-[2.75rem] font-bold text-[#10183F] mb-3"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              LEARNING ACADEMY
            </h2>
            <p
              className="text-lg font-semibold text-[#2E3192] mb-3"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Learn something useful. Build something real.
            </p>
            <p
              className="text-gray-600 max-w-xl mx-auto"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Explore training areas. Enrollment, pricing and certification should reflect
              verified current availability.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 mb-8">
            {skillPathways.map((pathway, index) => (
              <div
                key={pathway.title}
                className="bg-white rounded-[5px] shadow-[0_2px_12px_0_rgba(31,153,237,0.08)] p-6"
              >
                <p
                  className="text-xs font-bold uppercase tracking-widest text-[#2E3192] mb-2"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  SKILL PATHWAY {index + 1}
                </p>
                <h3
                  className="text-lg font-semibold text-[#10183F] mb-3"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {pathway.title}
                </h3>
                <p
                  className="text-gray-600 text-sm mb-5 leading-relaxed"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {pathway.description}
                </p>
                <Button href="/contact" variant="outline" size="sm" className="w-full">
                  Ask About Training →
                </Button>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 p-5 rounded-[5px] border border-amber-200">
            <p
              className="text-sm text-gray-700 text-center"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              ⚠ Do not claim all courses are open, accredited, certified or available before
              confirming the current program schedule.
            </p>
          </div>
        </div>
      </Section>

      {/* ── Community ── dark section with team image */}
      <Section background="dark" padding="lg" id="community">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <p
                className="text-xs font-bold tracking-[0.15em] uppercase text-[#1F99ED] mb-4"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                COMMUNITY
              </p>
              <h2
                className="text-[2rem] md:text-[2.75rem] font-bold mb-4"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                ONEFOCUS COMMUNITY
              </h2>
              <p
                className="text-lg text-gray-300 mb-3"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Learn and build alongside people with purpose.
              </p>
              <p
                className="text-gray-400 mb-8"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                A private learning and peer-support community for creators, freelancers,
                entrepreneurs and professionals.
              </p>

              <div className="bg-white/10 p-6 md:p-8 rounded-[5px] border border-white/10 mb-6">
                <h3
                  className="text-xl font-bold mb-3"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  1FOCUS VIP INNER CIRCLE
                </h3>
                <p
                  className="text-3xl font-bold text-[#1F99ED] mb-4"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  One-time joining fee: $2
                </p>
                <div className="grid sm:grid-cols-2 gap-3 text-left mb-6">
                  {[
                    'Practical AI and digital discussions',
                    'Shared learning resources',
                    'Networking and peer support',
                    'Information on confirmed sessions',
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-2 text-sm text-gray-300"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      <span className="text-[#1F99ED] font-bold mt-0.5" aria-hidden="true">✓</span>
                      {item}
                    </div>
                  ))}
                </div>
                <Button href="/contact" variant="primary" size="lg">
                  Ask How to Join →
                </Button>
              </div>

              <div className="bg-amber-50 text-gray-800 p-5 rounded-[5px]">
                <h4
                  className="font-bold mb-2 text-[#10183F]"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  COMMUNITY RULES
                </h4>
                <p
                  className="text-sm text-gray-700"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Privacy, respect and useful learning. No spam, unauthorized private outreach or
                  income guarantees.
                </p>
              </div>
            </div>

            <div className="relative rounded-[5px] overflow-hidden shadow-[0_8px_40px_0_rgba(0,0,0,0.35)]">
              <Image
                src="/images/team.webp"
                alt="ONEFOCUS AFRICA community and team"
                width={600}
                height={700}
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#10183F]/50 to-transparent" />
            </div>
          </div>
        </div>
      </Section>

      {/* ── Final CTA ── */}
      <Section background="white" padding="lg">
        <div className="text-center max-w-2xl mx-auto">
          <h2
            className="text-[2rem] md:text-[2.5rem] font-bold text-[#10183F] mb-5"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Ready to start your learning journey?
          </h2>
          <p
            className="text-lg text-gray-600 mb-8"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Tell us about your goals and we&apos;ll help you find the right pathway.
          </p>
          <Button href="/contact" variant="primary" size="lg">
            Get Started →
          </Button>
        </div>
      </Section>
    </>
  )
}