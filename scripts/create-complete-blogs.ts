import { config } from 'dotenv'
import { resolve } from 'path'
import { prisma } from '@onefocus/database'

config({ path: resolve(process.cwd(), 'apps/admin/.env') })

async function createCompleteBlogPosts() {
  try {
    console.log('Finding admin user...')
    const admin = await prisma.adminUser.findFirst({ where: { role: 'ADMIN' } })
    if (!admin) throw new Error('No admin user found')
    
    console.log('Creating categories...')
    const digitalMarketing = await prisma.postCategory.upsert({
      where: { slug: 'digital-marketing' },
      update: {},
      create: { name: 'Digital Marketing', slug: 'digital-marketing' }
    })
    
    const customerAcquisition = await prisma.postCategory.upsert({
      where: { slug: 'customer-acquisition' },
      update: {},
      create: { name: 'Customer Acquisition', slug: 'customer-acquisition' }
    })
    
    const b2bMarketing = await prisma.postCategory.upsert({
      where: { slug: 'b2b-marketing' },
      update: {},
      create: { name: 'B2B Marketing', slug: 'b2b-marketing' }
    })
    
    console.log('Creating tags...')
    const aiSearchTag = await prisma.postTag.upsert({
      where: { slug: 'ai-search' },
      update: {},
      create: { name: 'AI Search', slug: 'ai-search' }
    })
    
    const seoTag = await prisma.postTag.upsert({
      where: { slug: 'seo' },
      update: {},
      create: { name: 'SEO', slug: 'seo' }
    })
    
    const visibilityTag = await prisma.postTag.upsert({
      where: { slug: 'website-visibility' },
      update: {},
      create: { name: 'Website Visibility', slug: 'website-visibility' }
    })
    
    const leadGenTag = await prisma.postTag.upsert({
      where: { slug: 'lead-generation' },
      update: {},
      create: { name: 'Lead Generation', slug: 'lead-generation' }
    })
    
    const contentMarketingTag = await prisma.postTag.upsert({
      where: { slug: 'content-marketing' },
      update: {},
      create: { name: 'Content Marketing', slug: 'content-marketing' }
    })
    
    const conversionTag = await prisma.postTag.upsert({
      where: { slug: 'conversion' },
      update: {},
      create: { name: 'Conversion', slug: 'conversion' }
    })
    
    const trustTag = await prisma.postTag.upsert({
      where: { slug: 'customer-trust' },
      update: {},
      create: { name: 'Customer Trust', slug: 'customer-trust' }
    })
    
    const brandingTag = await prisma.postTag.upsert({
      where: { slug: 'brand-positioning' },
      update: {},
      create: { name: 'Brand Positioning', slug: 'brand-positioning' }
    })
    
    const b2bSalesTag = await prisma.postTag.upsert({
      where: { slug: 'b2b-sales' },
      update: {},
      create: { name: 'B2B Sales', slug: 'b2b-sales' }
    })
    
    console.log('Creating Blog 03 - AI Search...')
    await prisma.post.upsert({
      where: { slug: 'can-customers-find-your-business-in-the-ai-search-era' },
      update: {
        title: 'Can Customers Find Your Business in the AI Search Era?',
        excerpt: 'Search behavior is evolving. Learn how clear websites, accurate business information, and helpful content improve digital discoverability.',
        content: `<p class="lead">2026 trend: Customers researching businesses through search engines and AI-assisted tools.</p>

<p>Your business has a name.</p>

<p>But what happens when someone searches for the services you provide without knowing that name?</p>

<p><strong>Being online is different from being discoverable.</strong></p>

<h2>The Way Customers Research Businesses Is Changing</h2>

<p>Customers increasingly use search engines, maps, social platforms, and AI-powered tools to explore options before making decisions.</p>

<p>They may search for:</p>
<ul>
<li>Reliable marketing agencies in Kigali</li>
<li>Hotels with conference facilities in Rwanda</li>
<li>Commercial properties available for rent</li>
<li>Local agricultural suppliers</li>
<li>Professional business technology providers</li>
</ul>

<p>These searches represent potential business opportunities.</p>

<p>But if your online information is incomplete or inconsistent, customers may struggle to evaluate your company.</p>

<h2>Five Digital Visibility Essentials</h2>

<h3>1. A Clear Website</h3>
<p>Your homepage should immediately explain your services, target customers, and contact options.</p>

<h3>2. Consistent Business Details</h3>
<p>Keep your company name, telephone number, address, and services accurate across your digital platforms.</p>

<h3>3. Helpful Website Content</h3>
<p>Publish articles that answer real customer questions rather than only promoting your business.</p>

<h3>4. Authentic Visual Content</h3>
<p>Use clear photographs, informative videos, and accurate service descriptions.</p>

<h3>5. Technical Website Quality</h3>
<p>Make sure your website works on mobile devices, loads reliably, and allows search engines to discover important pages.</p>

<h2>What About AI Search?</h2>

<p>AI-powered search creates additional ways for people to research businesses.</p>

<p>However, there is no special trick that guarantees your company will appear in AI-generated answers.</p>

<p>The stronger approach is to publish original, accurate, helpful information and follow established search-engine optimization practices.</p>

<p><em>Your business should be easy for people to understand, not just algorithms.</em></p>

<h2>How ONEFOCUS AFRICA Supports Digital Visibility</h2>

<p>We help businesses organize their online presence through brand positioning, website development, content creation, digital marketing, and business automation.</p>

<p>Our objective is to create a connected experience between discovery and inquiry.</p>

<h2>Make Your Business Easier to Discover</h2>

<p>Don't rely exclusively on people knowing your company name.</p>

<p>Help potential customers discover the solutions you provide.</p>

<p><strong>ONEFOCUS AFRICA — Business & Digital Solutions Partner</strong></p>

<p>Call or WhatsApp: <a href="tel:+250781102667">+250 781 102 667</a></p>`,
        coverImage: '/images/blog/ai-search-discovery.jpg',
        seoTitle: 'Business Visibility in the AI Search Era | ONEFOCUS AFRICA',
        seoDescription: 'Learn how SEO, accurate business listings, helpful content, and strong websites can make your business easier to discover in today\'s search landscape.',
        status: 'PUBLISHED',
        publishedAt: new Date('2026-11-10T10:00:00Z'),
      },
      create: {
        title: 'Can Customers Find Your Business in the AI Search Era?',
        slug: 'can-customers-find-your-business-in-the-ai-search-era',
        excerpt: 'Search behavior is evolving. Learn how clear websites, accurate business information, and helpful content improve digital discoverability.',
        content: `<p class="lead">2026 trend: Customers researching businesses through search engines and AI-assisted tools.</p>

<p>Your business has a name.</p>

<p>But what happens when someone searches for the services you provide without knowing that name?</p>

<p><strong>Being online is different from being discoverable.</strong></p>

<h2>The Way Customers Research Businesses Is Changing</h2>

<p>Customers increasingly use search engines, maps, social platforms, and AI-powered tools to explore options before making decisions.</p>

<p>They may search for:</p>
<ul>
<li>Reliable marketing agencies in Kigali</li>
<li>Hotels with conference facilities in Rwanda</li>
<li>Commercial properties available for rent</li>
<li>Local agricultural suppliers</li>
<li>Professional business technology providers</li>
</ul>

<p>These searches represent potential business opportunities.</p>

<p>But if your online information is incomplete or inconsistent, customers may struggle to evaluate your company.</p>

<h2>Five Digital Visibility Essentials</h2>

<h3>1. A Clear Website</h3>
<p>Your homepage should immediately explain your services, target customers, and contact options.</p>

<h3>2. Consistent Business Details</h3>
<p>Keep your company name, telephone number, address, and services accurate across your digital platforms.</p>

<h3>3. Helpful Website Content</h3>
<p>Publish articles that answer real customer questions rather than only promoting your business.</p>

<h3>4. Authentic Visual Content</h3>
<p>Use clear photographs, informative videos, and accurate service descriptions.</p>

<h3>5. Technical Website Quality</h3>
<p>Make sure your website works on mobile devices, loads reliably, and allows search engines to discover important pages.</p>

<h2>What About AI Search?</h2>

<p>AI-powered search creates additional ways for people to research businesses.</p>

<p>However, there is no special trick that guarantees your company will appear in AI-generated answers.</p>

<p>The stronger approach is to publish original, accurate, helpful information and follow established search-engine optimization practices.</p>

<p><em>Your business should be easy for people to understand, not just algorithms.</em></p>

<h2>How ONEFOCUS AFRICA Supports Digital Visibility</h2>

<p>We help businesses organize their online presence through brand positioning, website development, content creation, digital marketing, and business automation.</p>

<p>Our objective is to create a connected experience between discovery and inquiry.</p>

<h2>Make Your Business Easier to Discover</h2>

<p>Don't rely exclusively on people knowing your company name.</p>

<p>Help potential customers discover the solutions you provide.</p>

<p><strong>ONEFOCUS AFRICA — Business & Digital Solutions Partner</strong></p>

<p>Call or WhatsApp: <a href="tel:+250781102667">+250 781 102 667</a></p>`,
        coverImage: '/images/blog/ai-search-discovery.jpg',
        seoTitle: 'Business Visibility in the AI Search Era | ONEFOCUS AFRICA',
        seoDescription: 'Learn how SEO, accurate business listings, helpful content, and strong websites can make your business easier to discover in today\'s search landscape.',
        status: 'PUBLISHED',
        publishedAt: new Date('2026-11-10T10:00:00Z'),
        authorId: admin.id,
        categories: { connect: [{ id: digitalMarketing.id }] },
        tags: { connect: [{ id: aiSearchTag.id }, { id: seoTag.id }, { id: visibilityTag.id }] }
      }
    })
    
    console.log('Blog 03 created')
    console.log('All blogs created successfully!')
    await prisma.$disconnect()
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

createCompleteBlogPosts()
