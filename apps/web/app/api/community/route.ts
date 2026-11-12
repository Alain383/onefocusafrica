import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { communityMemberSchema } from '@onefocus/shared'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = communityMemberSchema.parse(body)
    
    // Check if email already exists
    const existing = await prisma.communityMember.findUnique({
      where: { email: validatedData.email },
    })
    
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 409 }
      )
    }
    
    // Save to database - serialize interests array to JSON
    const member = await prisma.communityMember.create({
      data: {
        fullName: validatedData.fullName,
        email: validatedData.email,
        whatsappPhone: validatedData.whatsappPhone,
        interests: JSON.stringify(validatedData.interests),
        membershipFee: 2.00,
        paymentStatus: 'pending',
      },
    })
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Community registration initiated',
        memberId: member.id,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error processing community registration:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Invalid form data', details: error },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to process registration' },
      { status: 500 }
    )
  }
}
