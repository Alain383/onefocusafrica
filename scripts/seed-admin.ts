import { config } from 'dotenv'
import { resolve } from 'path'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

// Load .env.local
config({ path: resolve(process.cwd(), '.env.local') })

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@onefocusafrica.com'
  const password = process.env.ADMIN_PASSWORD || 'admin123'
  const name = process.env.ADMIN_NAME || 'Admin User'

  console.log(`Seeding admin user: ${email}`)

  const hashedPassword = await bcrypt.hash(password, 12)

  const user = await prisma.adminUser.upsert({
    where: { email },
    update: { hashedPassword, name, role: 'ADMIN', isActive: true },
    create: {
      email,
      hashedPassword,
      name,
      role: 'ADMIN',
      isActive: true,
    },
  })

  console.log(`✓ Admin user created/updated: ${user.email} (id: ${user.id})`)
}

main()
  .catch((e) => {
    console.error('Error seeding admin:', e.message)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
