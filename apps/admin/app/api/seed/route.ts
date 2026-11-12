import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    const hashedPassword = await bcrypt.hash('Alainhlavin@#1', 10)
    
    const user = await prisma.adminUser.upsert({
      where: { email: 'alainhlavin@gmail.com' },
      update: {
        hashedPassword,
        isActive: true,
        name: 'Alain Hlavin',
        role: 'ADMIN'
      },
      create: {
        email: 'alainhlavin@gmail.com',
        name: 'Alain Hlavin',
        hashedPassword,
        role: 'ADMIN',
        isActive: true
      }
    })
    
    return NextResponse.json({ 
      success: true, 
      message: 'Admin user created/updated',
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
        isActive: user.isActive
      }
    })
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}