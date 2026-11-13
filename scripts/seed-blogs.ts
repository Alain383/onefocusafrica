import { config } from 'dotenv'
import { resolve } from 'path'
import { prisma } from '@onefocus/database'

config({ path: resolve(process.cwd(), 'apps/admin/.env') })

async function main() {
  console.log('Creating blogs...')
  const admin = await prisma.adminUser.findFirst({ where: { role: 'ADMIN' } })
  
  const dm = await prisma.postCategory.upsert({
    where: { slug: 'digital-marketing' },
    update: {},
    create: { name: 'Digital Marketing', slug: 'digital-marketing' }
  })
  
  const ca = await prisma.postCategory.upsert({
    where: { slug: 'customer-acquisition' },
    update: {},
    create: { name: 'Customer Acquisition', slug: 'customer-acquisition' }
  })
  
  const b2b = await prisma.postCategory.upsert({
    where: { slug: 'b2b-marketing' },
    update: {},
    create: { name: 'B2B Marketing', slug: 'b2b-marketing' }
  })
  
  await prisma.post.upsert({
    where: { slug: 'can-customers-find-your-business-in-the-ai-search-era' },
    update: {},
    create: {
      title: 'Can Customers Find Your Business in the AI Search Era?',
      slug: 'can-customers-find-your-business-in-the-ai-search-era',
      excerpt: 'Search behavior is evolving.',
      content: '<h2>AI Search</h2>',
      coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      authorId: admin.id,
      categories: { connect: [{ id: dm.id }] }
    }
  })
  
  console.log('Done!')
  await prisma.$disconnect()
}

main().catch(console.error)
