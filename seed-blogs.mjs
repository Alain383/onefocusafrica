import { prisma } from './packages/database/src/index.js'

async function seed() {
  const admin = await prisma.adminUser.findFirst({ where: { role: 'ADMIN' } })
  if (!admin) throw new Error('No admin found')
  
  const dm = await prisma.postCategory.upsert({
    where: { slug: 'digital-marketing' },
    update: {},
    create: { name: 'Digital Marketing', slug: 'digital-marketing' }
  })
  
  await prisma.post.upsert({
    where: { slug: 'can-customers-find-your-business-in-the-ai-search-era' },
    update: {},
    create: {
      title: 'Can Customers Find Your Business in the AI Search Era?',
      slug: 'can-customers-find-your-business-in-the-ai-search-era',
      excerpt: 'Search behavior is evolving. Learn how clear websites improve digital discoverability.',
      content: '<h2>AI Search</h2><p>Your business needs to be discoverable.</p>',
      coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      authorId: admin.id,
      categories: { connect: [{ id: dm.id }] }
    }
  })
  console.log('Done')
  await prisma.$disconnect()
}
seed()
