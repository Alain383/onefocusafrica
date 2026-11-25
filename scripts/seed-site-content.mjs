import fs from 'node:fs'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const envText = fs.readFileSync(new URL('../.env', import.meta.url), 'utf8')
for (const line of envText.split('\n')) {
  const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?(.*?)"?\s*$/)
  if (match && !process.env[match[1]]) process.env[match[1]] = match[2]
}

const prisma = new PrismaClient()

const admin = await prisma.adminUser.upsert({
  where: { email: process.env.ADMIN_EMAIL || 'admin@onefocusafrica.com' },
  create: {
    name: process.env.ADMIN_NAME || 'Admin User',
    email: process.env.ADMIN_EMAIL || 'admin@onefocusafrica.com',
    hashedPassword: await bcrypt.hash(process.env.ADMIN_PASSWORD || 'x-aOj4wBRvb2', 12),
    role: 'ADMIN',
  },
  update: {},
})

const content = [
  ['home', 'hero_headline_lead', 'Make your business easier to'],
  ['home', 'hero_headline_accent', 'find, trust & choose.'],
  ['home', 'hero_subheading', 'ONEFOCUS brings strategy, cinematic media, web technology and lead capture together so attention has somewhere valuable to go.'],
  ['home', 'cta_heading', "LET'S MAKE IT PRACTICAL"],
  ['home', 'cta_question', 'What are you trying to grow?'],
  ['home', 'cta_body', "Tell us the challenge. We'll help define a sensible next step."],
  ['contact', 'hero_title', "Let's discuss your next move."],
  ['contact', 'hero_subtitle', 'Based in Kigali, Rwanda. Serving businesses across Africa.'],
  ['contact', 'form_description', 'Tell us what you want to grow. A clear brief helps us recommend the right engagement, realistic deliverables and responsible next steps.'],
]

for (const [section, key, value] of content) {
  await prisma.siteContent.upsert({
    where: { section_key: { section, key } },
    create: { section, key, value, updatedById: admin.id },
    update: { value },
  })
}

console.log(`Seeded ${content.length} content entries`)
await prisma.$disconnect()
