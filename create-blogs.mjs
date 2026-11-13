import { prisma } from './packages/database/src/index.js'

async function createBlogPosts() {
  try {
    console.log('Creating blog categories...')
    
    const digitalMarketing = await prisma.postCategory.upsert({
      where: { slug: 'digital-marketing' },
      update: { name: 'Digital Marketing' },
      create: { name: 'Digital Marketing', slug: 'digital-marketing' }
    })
    
    const customerAcquisition = await prisma.postCategory.upsert({
      where: { slug: 'customer-acquisition' },
      update: { name: 'Customer Acquisition' },
      create: { name: 'Customer Acquisition', slug: 'customer-acquisition' }
    })
    
    const b2bMarketing = await prisma.postCategory.upsert({
      where: { slug: 'b2b-marketing' },
      update: { name: 'B2B Marketing' },
      create: { name: 'B2B Marketing', slug: 'b2b-marketing' }
    })
    
    console.log('Categories created')
    
    const admin = await prisma.adminUser.findFirst({ where: { role: 'ADMIN' } })
    if (!admin) throw new Error('No admin user found')
    
    console.log('Creating blog posts...')
    
    const blog03Content = `<h2>2026 trend: Customers researching businesses through search engines and AI-assisted tools</h2><p>Your business has a name.</p><p>But what happens when someone searches for the services you provide without knowing that name?</p><p>Being online is different from being discoverable.</p><h2>The Way Customers Research Businesses Is Changing</h2><p>Customers increasingly use search engines, maps, social platforms, and AI-powered tools to explore options before making decisions.</p><p>They may search for:</p><ul><li>Reliable marketing agencies in Kigali</li><li>Hotels with conference facilities in Rwanda</li><li>Commercial properties available for rent</li><li>Local agricultural suppliers</li><li>Professional business technology providers</li></ul><p>These searches represent potential business opportunities.</p><p>But if your online information is incomplete or inconsistent, customers may struggle to evaluate your company.</p><h2>Five Digital Visibility Essentials</h2><h3>1. A Clear Website</h3><p>Your homepage should immediately explain your services, target customers, and contact options.</p><h3>2. Consistent Business Details</h3><p>Keep your company name, telephone number, address, and services accurate across your digital platforms.</p><h3>3. Helpful Website Content</h3><p>Publish articles that answer real customer questions rather than only promoting your business.</p><h3>4. Authentic Visual Content</h3><p>Use clear photographs, informative videos, and accurate service descriptions.</p><h3>5. Technical Website Quality</h3><p>Make sure your website works on mobile devices, loads reliably, and allows search engines to discover important pages.</p><h2>What About AI Search?</h2><p>AI-powered search creates additional ways for people to research businesses.</p><p>However, there is no special trick that guarantees your company will appear in AI-generated answers.</p><p>The stronger approach is to publish original, accurate, helpful information and follow established search-engine optimization practices.</p><p>Your business should be easy for people to understand, not just algorithms.</p><h2>How ONEFOCUS AFRICA Supports Digital Visibility</h2><p>We help businesses organize their online presence through brand positioning, website development, content creation, digital marketing, and business automation.</p><p>Our objective is to create a connected experience between discovery and inquiry.</p><h2>Make Your Business Easier to Discover</h2><p>Do not rely exclusively on people knowing your company name.</p><p>Help potential customers discover the solutions you provide.</p><p><strong>ONEFOCUS AFRICA - Business & Digital Solutions Partner</strong></p><p>Call or WhatsApp: +250 781 102 667</p>`
    
    await prisma.post.upsert({
      where: { slug: 'can-customers-find-your-business-in-the-ai-search-era' },
      update: {},
      create: {
        title: 'Can Customers Find Your Business in the AI Search Era?',
        slug: 'can-customers-find-your-business-in-the-ai-search-era',
        excerpt: 'Search behavior is evolving. Learn how clear websites, accurate business information, and helpful content improve digital discoverability.',
        content: blog03Content,
        coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=675&fit=crop',
        seoTitle: 'Business Visibility in the AI Search Era | ONEFOCUS AFRICA',
        seoDescription: 'Learn how SEO and accurate business listings can make your business easier to discover.',
        status: 'PUBLISHED',
        publishedAt: new Date(),
        authorId: admin.id,
        categories: { connect: [{ id: digitalMarketing.id }] }
      }
    })
    console.log('Blog 03 created')
    
    const blog04Content = `<p>You publish a video. It reaches thousands of people. The likes arrive. People comment. Your page gains attention.</p><p>But your phone remains quiet.</p><p>Visibility is important. But attention alone does not pay the bills.</p><h2>The Missing Link Between Views and Customers</h2><p>Some businesses measure marketing success only through impressions, likes, and followers.</p><p>These metrics can be useful, but they do not tell the entire story.</p><p>A person may enjoy a video without understanding what the company sells. Another may be interested but cannot find the price range, location, or contact button. Someone else may send an inquiry but never receive a response.</p><p>The marketing journey breaks when the next step is unclear.</p><h2>Your Content Needs a Purpose</h2><p>Before publishing, ask:</p><h3>Who should see this?</h3><p>A showroom may want prospective buyers. A consultancy may want decision-makers. A hotel may want event organizers.</p><h3>What should they understand?</h3><p>Show the problem your service solves, the value you provide, and how customers can learn more.</p><h3>What should they do next?</h3><p>Invite an appropriate action: visit a website, request a quotation, book a meeting, or send a WhatsApp message.</p><h2>Build a Simple Inquiry System</h2><p>A practical business marketing journey can follow four steps:</p><ol><li><strong>Attract:</strong> Publish relevant content that reaches potential customers.</li><li><strong>Inform:</strong> Explain your offer clearly with real examples.</li><li><strong>Capture:</strong> Provide an accessible form, telephone number, or WhatsApp contact.</li><li><strong>Follow up:</strong> Respond professionally and track the inquiry.</li></ol><p>Each step matters.</p><h2>What Should Businesses Measure?</h2><p>Look beyond social media engagement. Track website visits from campaigns, qualified inquiries, contact-button clicks, booked meetings, and sales opportunities where reliable data is available.</p><h2>ONEFOCUS AFRICA Connects the Pieces</h2><p>Our services bring together professional content, digital marketing, websites, and lead capture.</p><p>Instead of treating every post as an isolated activity, we help businesses create a more connected marketing process.</p><h2>Your Next Post Should Have a Next Step</h2><p>A good advertisement should not leave an interested customer wondering what to do. Turn attention into meaningful conversations.</p><p><strong>Improve Your Customer Inquiry Journey</strong></p><p>Contact ONEFOCUS AFRICA. Call or WhatsApp: +250 781 102 667</p>`
    
    await prisma.post.upsert({
      where: { slug: 'your-posts-get-views-why-arent-customers-calling' },
      update: {},
      create: {
        title: 'Your Posts Get Views. Why Aren't Customers Calling?',
        slug: 'your-posts-get-views-why-arent-customers-calling',
        excerpt: 'Social media views are not the same as customer inquiries. Discover how clear offers, stronger calls to action, and follow-up systems help.',
        content: blog04Content,
        coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=675&fit=crop',
        seoTitle: 'Social Media Views but No Customers? | ONEFOCUS AFRICA',
        seoDescription: 'Getting views but few customer inquiries? Learn how clear offers and calls to action help.',
        status: 'PUBLISHED',
        publishedAt: new Date(),
        authorId: admin.id,
        categories: { connect: [{ id: customerAcquisition.id }] }
      }
    })
    console.log('Blog 04 created')
    
    const blog05Content = `<p>A customer asks about your services. You send your quotation. Then the customer disappears.</p><p>It is tempting to assume your price was too high. But pricing may not be the only concern.</p><p>Before businesses invest, they want confidence in the people and company behind the offer.</p><h2>Business Buyers Are Looking for Confidence</h2><p>Unlike an everyday impulse purchase, a business service may involve several people, budgets, and internal approvals. Decision-makers want to understand what they are buying.</p><p>They may ask:</p><ul><li>Does this company understand our needs?</li><li>Can its team deliver the promised service?</li><li>Have they completed similar projects?</li><li>What exactly is included?</li><li>How will communication and follow-up work?</li></ul><p>If your marketing does not answer these questions, buyers may hesitate.</p><h2>Five Ways to Build Trust Before the Sales Call</h2><h3>1. Explain Your Services Clearly</h3><p>Avoid vague descriptions. Tell potential customers exactly what you provide.</p><h3>2. Show Real Work</h3><p>Publish genuine project photographs, behind-the-scenes footage, or client-approved case studies.</p><h3>3. Introduce Your Team</h3><p>Help buyers see the professionals responsible for delivering the work.</p><h3>4. Educate Before Selling</h3><p>Create useful articles and videos that address common customer problems.</p><h3>5. Make Contact Professional</h3><p>Respond clearly, explain the process, and provide accurate information about timelines, scope, and next steps.</p><h2>Professional Presentation Supports Credibility</h2><p>A well-organized website, consistent brand identity, and clear service content cannot guarantee customer trust. They can, however, make it easier for buyers to evaluate your business.</p><h2>Why ONEFOCUS AFRICA Focuses on Storytelling</h2><p>We believe businesses should show more than advertisements. Through cinematic marketing tours, brand positioning, website development, and digital content, we help companies communicate what they genuinely do.</p><p>The goal is to make their strengths understandable and their services easier to evaluate.</p><h2>Make Choosing Your Business Easier</h2><p>Your next potential client may be comparing several companies. Give them useful reasons to understand your work and feel confident contacting you.</p><p>Be visible. Be credible. Be worth considering.</p><p><strong>Let's Strengthen Your Business Presentation - ONEFOCUS AFRICA</strong></p><p>Call or WhatsApp: +250 781 102 667</p>`
    
    await prisma.post.upsert({
      where: { slug: 'why-trust-wins-before-price-in-b2b-marketing' },
      update: {},
      create: {
        title: 'Why Trust Wins Before Price in B2B Marketing',
        slug: 'why-trust-wins-before-price-in-b2b-marketing',
        excerpt: 'Business buyers do not evaluate price alone. Learn how transparent messaging and real project evidence build confidence.',
        content: blog05Content,
        coverImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=675&fit=crop',
        seoTitle: 'How to Build Trust in B2B Marketing | ONEFOCUS AFRICA',
        seoDescription: 'Discover how real project evidence and professional branding build trust with business clients.',
        status: 'PUBLISHED',
        publishedAt: new Date(),
        authorId: admin.id,
        categories: { connect: [{ id: b2bMarketing.id }] }
      }
    })
    console.log('Blog 05 created')
    console.log('SUCCESS: All 3 blog posts created!')
    
  } catch (error) {
    console.error('ERROR:', error.message)
    process.exit(1)
  } finally {
    await prisma.`disconnect()
  }
}

createBlogPosts()
