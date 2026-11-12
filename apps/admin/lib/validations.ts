import { z } from 'zod'

export const inquirySchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  workEmail: z.string().email('Please provide a valid email address'),
  company: z.string().optional(),
  industry: z.string().optional(),
  country: z.string().optional(),
  website: z.string().url('Please provide a valid URL').optional().or(z.literal('')),
  serviceArea: z.enum([
    'Brand and growth strategy',
    'Cinematic media and marketing tours',
    'Website, technology and automation',
    'Corporate training',
    'Talent, community or partnerships',
    'Not sure yet',
  ]),
  challenge: z.string().min(20, 'Please provide more details about your challenge'),
  objective: z.string().optional(),
  timeline: z.string().optional(),
  consent: z.boolean().refine((val) => val === true, {
    message: 'You must consent to be contacted',
  }),
})

export const communityMemberSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please provide a valid email address'),
  whatsappPhone: z.string().optional(),
  interests: z.array(z.string()).min(1, 'Please select at least one interest'),
})

export type InquiryInput = z.infer<typeof inquirySchema>
export type CommunityMemberInput = z.infer<typeof communityMemberSchema>
