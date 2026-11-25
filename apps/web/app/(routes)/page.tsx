import Hero from '@/components/sections/Hero'
import ClientLogos from '@/components/sections/ClientLogos'
import Problems from '@/components/sections/Problems'
import Solutions from '@/components/sections/Solutions'
import Process from '@/components/sections/Process'
import CaseStudies from '@/components/sections/CaseStudies'
import TalentEcosystem from '@/components/sections/TalentEcosystem'
import CTASection from '@/components/sections/CTASection'

export const revalidate = 3600

export default function HomePage() {
  return (
    <>
      <Hero />
      <ClientLogos />
      <Problems />
      <Solutions />
      <Process />
      <CaseStudies />
      <TalentEcosystem />
      <CTASection />
    </>
  )
}
