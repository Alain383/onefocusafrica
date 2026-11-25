import { describe, expect, it } from 'vitest'
import { toInquiryCategory } from './inquiry-category'

describe('toInquiryCategory', () => {
  it('maps known intents to their category', () => {
    expect(toInquiryCategory('project')).toBe('PROJECT')
    expect(toInquiryCategory('TRAINING')).toBe('TRAINING')
    expect(toInquiryCategory('community')).toBe('COMMUNITY')
  })

  it('falls back to GENERAL for missing or unknown intents', () => {
    expect(toInquiryCategory()).toBe('GENERAL')
    expect(toInquiryCategory('unknown')).toBe('GENERAL')
  })
})
