import { config } from 'dotenv'
import { resolve } from 'path'
import { prisma } from '@onefocus/database'

config({ path: resolve(process.cwd(), 'apps/admin/.env') })

async function createRemainingBlogs() {
  const admin = await prisma.adminUser.findFirst({ where: { role: 'ADMIN' } })
  const ca = await prisma.postCategory.findUnique({ where: { slug: 'customer-acquisition' } })
  const b2b = await prisma.postCategory.findUnique({ where: { slug: 'b2b-marketing' } })
  
  console.log('Creating Blog 04...')
  await prisma.post.upsert({
    where: { slug: 'your-posts-get-views-why-arent-customers-calling' },
    update: {},
    create: {
      title: 'Your Posts Get Views. Why Arent Customers Calling?',
      slug: 'your-posts-get-views-why-arent-customers-calling',
      excerpt: 'Social media views are not the same as customer inquiries.',
      content: '<h2>Views vs Customers</h2><p>Attention does not pay the bills.</p>',
      coverImage: '/images/blog/social-media-inquiries.jpg',
      seoTitle: 'Social Media Views but No Customers? | ONEFOCUS AFRICA',
      seoDescription: 'Getting views but few customer inquiries? Learn how to convert.',
      status: 'PUBLISHED',
      publishedAt: new Date('2026-11-11T10:00:00Z'),
      authorId: admin.id,
      categories: { connect: [{ id: ca.id }] }
    }
  })
  console.log('Blog 04 created')
  
  console.log('Creating Blog 05...')
  await prisma.post.upsert({
    where: { slug: 'why-trust-wins-before-price-in-b2b-marketing' },
    update: {},
    create: {
      title: 'Why Trust Wins Before Price in B2B Marketing',
      slug: 'why-trust-wins-before-price-in-b2b-marketing',
      excerpt: 'Business buyers dont evaluate price alone.',
      content: '<h2>Building Trust</h2><p>Confidence matters more than cost.</p>',
      coverImage: '/images/blog/b2b-trust-building.jpg',
      seoTitle: 'How to Build Trust in B2B Marketing | ONEFOCUS AFRICA',
      seoDescription: 'Discover how to build trust with business clients.',
      status: 'PUBLISHED',
      publishedAt: new Date('2026-11-12T10:00:00Z'),
      authorId: admin.id,
      categories: { connect: [{ id: b2b.id }] }
    }
  })
  console.log('Blog 05 created')
  console.log('SUCCESS!')
  await prisma.$disconnect()
}

createRemainingBlogs().catch(e => { console.error(e); process.exit(1) })
