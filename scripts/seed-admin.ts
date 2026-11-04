import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

async function main() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD
  const name = process.env.ADMIN_NAME

  if (!email || !password || !name) {
    console.error('Missing required env vars: ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME')
    process.exit(1)
  }

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

  console.log(`Admin user upserted: ${user.email} (id: ${user.id})`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
