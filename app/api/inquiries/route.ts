import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { inquirySchema } from '@/lib/validations'
import { sendInquiryNotification, sendInquiryConfirmation } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = inquirySchema.parse(body)
    
    // Save to database
    const inquiry = await prisma.inquiry.create({
      data: {
        fullName: validatedData.fullName,
        workEmail: validatedData.workEmail,
        company: validatedData.company,
        industry: validatedData.industry,
        country: validatedData.country,
        website: validatedData.website,
        serviceArea: validatedData.serviceArea,
        challenge: validatedData.challenge,
        objective: validatedData.objective,
        timeline: validatedData.timeline,
        consent: validatedData.consent,
      },
    })
    
    // Send notifications
    await Promise.all([
      sendInquiryNotification({
        fullName: validatedData.fullName,
        workEmail: validatedData.workEmail,
        company: validatedData.company,
        serviceArea: validatedData.serviceArea,
        challenge: validatedData.challenge,
        objective: validatedData.objective,
      }),
      sendInquiryConfirmation({
        fullName: validatedData.fullName,
        workEmail: validatedData.workEmail,
      }),
    ])
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Inquiry submitted successfully',
        inquiryId: inquiry.id,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error processing inquiry:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Invalid form data', details: error },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to process inquiry' },
      { status: 500 }
    )
  }
}
