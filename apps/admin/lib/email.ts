import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

interface InquiryEmailData {
  fullName: string
  workEmail: string
  company?: string
  serviceArea: string
  challenge: string
  objective?: string
}

export async function sendInquiryNotification(data: InquiryEmailData) {
  const { fullName, workEmail, company, serviceArea, challenge, objective } = data

  const mailOptions = {
    from: process.env.SMTP_FROM || 'onefocusafrica@gmail.com',
    to: process.env.CONTACT_EMAIL || 'onefocusafrica@gmail.com',
    subject: `New Inquiry from ${fullName} - ${serviceArea}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1F99ED;">New Business Inquiry</h2>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${workEmail}</p>
          ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
          <p><strong>Service Area:</strong> ${serviceArea}</p>
        </div>
        
        <div style="margin: 20px 0;">
          <h3 style="color: #2E3192;">Challenge</h3>
          <p>${challenge}</p>
        </div>
        
        ${objective ? `
          <div style="margin: 20px 0;">
            <h3 style="color: #2E3192;">Objective</h3>
            <p>${objective}</p>
          </div>
        ` : ''}
        
        <p style="margin-top: 30px; color: #666; font-size: 14px;">
          Received via ONEFOCUS AFRICA website
        </p>
      </div>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error }
  }
}

export async function sendInquiryConfirmation(data: { fullName: string; workEmail: string }) {
  const mailOptions = {
    from: process.env.SMTP_FROM || 'onefocusafrica@gmail.com',
    to: data.workEmail,
    subject: 'We received your inquiry - ONEFOCUS AFRICA',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1F99ED;">Thank you for reaching out!</h2>
        
        <p>Hi ${data.fullName},</p>
        
        <p>We've received your inquiry and will review it carefully. A member of our team will be in touch within 1-2 business days to discuss your project.</p>
        
        <p>In the meantime, feel free to explore our work and learn more about our approach at <a href="${process.env.NEXT_PUBLIC_SITE_URL}" style="color: #1F99ED;">onefocusafrica.com</a>.</p>
        
        <div style="margin: 30px 0; padding: 20px; background: #F0F7FD; border-radius: 5px;">
          <p style="margin: 0;"><strong>ONEFOCUS AFRICA</strong></p>
          <p style="margin: 5px 0;">Kigali, Rwanda</p>
          <p style="margin: 5px 0;">Email: onefocusafrica@gmail.com</p>
          <p style="margin: 5px 0;">WhatsApp: +250 781 102 667</p>
        </div>
        
        <p style="color: #666; font-size: 14px;">
          This is an automated confirmation. Please do not reply to this email.
        </p>
      </div>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error('Error sending confirmation:', error)
    return { success: false, error }
  }
}
