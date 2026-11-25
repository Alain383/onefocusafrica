import { describe, expect, it } from 'vitest'
import { inquirySchema, inquiryCategories } from './schemas'

const validInquiry = {
  fullName: 'Jane Doe',
  workEmail: 'jane@example.com',
  serviceArea: 'Corporate training',
  challenge: 'We need a clear training plan for our growing team.',
  consent: true,
}

describe('inquirySchema', () => {
  it('defaults the category to GENERAL when it is omitted', () => {
    expect(inquirySchema.parse(validInquiry).category).toBe('GENERAL')
  })

  it.each(inquiryCategories)('accepts the %s category', (category) => {
    expect(inquirySchema.parse({ ...validInquiry, category }).category).toBe(category)
  })

  it('rejects an unknown category', () => {
    expect(() => inquirySchema.parse({ ...validInquiry, category: 'UNKNOWN' })).toThrow()
  })
})
