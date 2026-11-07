import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    const email = 'admin@onefocus.africa'
    const password = 'admin123'
    const name = 'Admin User'

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.adminUser.upsert({
      where: { email },
      update: { 
        hashedPassword, 
        name, 
        role: 'ADMIN', 
        isActive: true 
      },
      create: {
        email,
        hashedPassword,
        name,
        role: 'ADMIN',
        isActive: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully!',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      credentials: {
        email: 'admin@onefocus.africa',
        password: 'admin123',
      },
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 })
  }
}
