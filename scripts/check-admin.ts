import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkAndUpdateAdmin() {
  try {
    // Check current admin
    const admin = await prisma.adminUser.findUnique({
      where: { email: 'alainhlavin@gmail.com' }
    })
    
    if (admin) {
      console.log('Found admin:', admin.email)
      console.log('Name:', admin.name)
      console.log('Role:', admin.role)
      console.log('Active:', admin.isActive)
      
      // Update password
      const hashedPassword = await bcrypt.hash('Alainhlavin@#1', 12)
      await prisma.adminUser.update({
        where: { email: 'alainhlavin@gmail.com' },
        data: { 
          hashedPassword,
          isActive: true,
          name: 'Alain Hlavin'
        }
      })
      console.log('✓ Password updated successfully')
    } else {
      console.log('Admin not found. Creating new admin...')
      const hashedPassword = await bcrypt.hash('Alainhlavin@#1', 12)
      await prisma.adminUser.create({
        data: {
          email: 'alainhlavin@gmail.com',
          hashedPassword,
          name: 'Alain Hlavin',
          role: 'ADMIN',
          isActive: true
        }
      })
      console.log('✓ Admin created successfully')
    }
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

checkAndUpdateAdmin()
