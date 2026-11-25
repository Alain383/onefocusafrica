import { prisma } from '@/lib/prisma'
import { getSiteContent } from '@/lib/site-content'
import { mediaFirstImage, parseMediaBlock } from '@onefocus/shared/media'
import ClientLogosCarousel, { type ClientLogo } from './ClientLogosCarousel'

export default async function ClientLogos() {
  const eyebrow = await getSiteContent('home', 'clients_eyebrow', 'TRUSTED BY')
  const title = await getSiteContent('home', 'clients_title', 'Teams we have worked with')

  const partners = await prisma.partner.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  })

  const logos: ClientLogo[] = partners
    .map((partner) => ({
      id: partner.id,
      name: partner.name,
      logo: mediaFirstImage(parseMediaBlock(partner.logo, '', partner.name)),
      website: partner.website,
    }))
    .filter((partner): partner is ClientLogo => Boolean(partner.logo))

  if (logos.length === 0) return null

  return (
    <section className="bg-[#EEF6FD] py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <div className="mb-6 text-center">
          <p
            className="mb-2 text-xs font-bold tracking-[0.2em] uppercase text-[#1F99ED]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {eyebrow}
          </p>
          <h2
            className="text-xl font-semibold text-[#10183F] md:text-2xl"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {title}
          </h2>
        </div>

        <ClientLogosCarousel logos={logos} />
      </div>
    </section>
  )
}
