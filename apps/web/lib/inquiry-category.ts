export const inquiryCategories = ['PROJECT', 'WORK', 'TRAINING', 'COMMUNITY', 'GENERAL'] as const

export type InquiryCategory = (typeof inquiryCategories)[number]

export function toInquiryCategory(value?: string): InquiryCategory {
  const upper = value?.toUpperCase()
  return inquiryCategories.includes(upper as InquiryCategory)
    ? (upper as InquiryCategory)
    : 'GENERAL'
}
