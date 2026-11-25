import Button from '@/components/ui/Button'
import Section from '@/components/ui/Section'
import CmsMedia from '@/components/CmsMedia'
import { prisma } from '@/lib/prisma'
import { getPageText, toMediaBlock } from '@/lib/site-content'

export const metadata = {
  title: 'Gallery | ONEFOCUS AFRICA',
  description: 'Photos from the work, people and community of ONEFOCUS AFRICA.',
}

export const revalidate = 3600

async function getGalleryItems() {
  try {
    return await prisma.galleryItem.findMany({
      where: { isPublished: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    })
  } catch (error) {
    console.warn('Gallery query failed:', error)
    return []
  }
}

export default async function GalleryPage() {
  const [items, heroEyebrow, heroTitle, heroDescription] = await Promise.all([
    getGalleryItems(),
    getPageText('gallery', 'hero_eyebrow'),
    getPageText('gallery', 'hero_title'),
    getPageText('gallery', 'hero_description'),
  ])

  return (
    <>
      <Section background="white" padding="lg">
        <div className="max-w-4xl mx-auto text-center">
          <p
            className="text-xs font-bold tracking-[0.15em] uppercase text-[#1F99ED] mb-5"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {heroEyebrow}
          </p>
          <h1
            className="text-[2.5rem] md:text-[3.5rem] font-bold text-[#10183F] mb-5 leading-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {heroTitle}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-body)' }}>
            {heroDescription}
          </p>
        </div>
      </Section>

      <Section background="light" padding="lg">
        <div className="max-w-6xl mx-auto">
          {items.length === 0 && (
            <div className="rounded-[5px] border border-gray-200 bg-white p-10 text-center">
              <p className="mb-2 text-lg font-semibold text-[#10183F]">Gallery images are being prepared.</p>
              <p className="text-sm text-gray-600">Published photos will appear here.</p>
            </div>
          )}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => (
              <article
                key={item.id}
                id={item.id}
                className="overflow-hidden rounded-[5px] bg-white shadow-[0_2px_12px_0_rgba(31,153,237,0.08)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_6px_28px_0_rgba(31,153,237,0.16)]"
              >
                <div className="relative h-64 overflow-hidden">
                  <CmsMedia
                    block={toMediaBlock(item.image, '', item.title || item.description || '')}
                    width={800}
                    height={600}
                    priority={index < 3}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                {(item.title || item.description) && (
                  <div className="p-5">
                    {item.title && (
                      <h2
                        className="mb-2 text-lg font-semibold text-[#10183F]"
                        style={{ fontFamily: 'var(--font-body)' }}
                      >
                        {item.title}
                      </h2>
                    )}
                    {item.description && (
                      <p className="text-sm leading-relaxed text-gray-600" style={{ fontFamily: 'var(--font-body)' }}>
                        {item.description}
                      </p>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button href="/contact?intent=GENERAL&subject=Gallery%20enquiry" variant="primary" size="lg">
              Work With Us
            </Button>
          </div>
        </div>
      </Section>
    </>
  )
}
