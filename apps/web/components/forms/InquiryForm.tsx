'use client'

import { useEffect, useState } from 'react'
import Button from '../ui/Button'
import type { InquiryCategory } from '@/lib/inquiry-category'
import { inquiryContext, subjectChallenge } from '@/lib/inquiry-context'

const inputBase =
  'w-full px-4 py-2.5 text-sm border border-gray-200 rounded-[5px] bg-white text-[#10183F] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1F99ED] focus:border-transparent transition-all duration-150'

const labelBase = 'block text-xs font-bold uppercase tracking-widest text-[#10183F] mb-2'

type FormData = {
  fullName: string
  workEmail: string
  company: string
  website: string
  serviceArea: string
  category: InquiryCategory
  challenge: string
  objective: string
  timeline: string
  consent: boolean
}

function initialData(category: InquiryCategory, subject?: string): FormData {
  return {
    fullName: '',
    workEmail: '',
    company: '',
    website: '',
    serviceArea: inquiryContext[category].serviceAreas[0],
    category,
    challenge: subjectChallenge(subject, category),
    objective: '',
    timeline: '',
    consent: false,
  }
}

export default function InquiryForm({
  category = 'GENERAL',
  subject,
}: {
  category?: InquiryCategory
  subject?: string
}) {
  const context = inquiryContext[category]
  const [formData, setFormData] = useState<FormData>(() => initialData(category, subject))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    setFormData(initialData(category, subject))
    setSubmitStatus('idle')
  }, [category, subject])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await response.json()

      if (response.ok) {
        setSubmitStatus('success')
        setFormData(initialData(category, subject))
      } else {
        setSubmitStatus('error')
        setErrorMessage(data.error || 'Failed to submit inquiry')
      }
    } catch {
      setSubmitStatus('error')
      setErrorMessage('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6" style={{ fontFamily: 'var(--font-body)' }}>
      {subject && (
        <div className="p-4 bg-[#EEF6FD] border border-[#1F99ED] text-[#10183F] rounded-[5px] text-sm">
          <span className="font-bold text-[#1F99ED]">You selected:</span> {subject}
        </div>
      )}

      {submitStatus === 'success' && (
        <div className="p-4 bg-[#EEF6FD] border border-[#1F99ED] text-[#10183F] rounded-[5px]" role="alert">
          <p className="font-semibold text-[#1F99ED] mb-1">Thank you for your inquiry!</p>
          <p className="text-sm text-gray-700">We&apos;ll be in touch within 1–2 business days.</p>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="p-4 bg-red-50 border border-red-300 text-red-700 rounded-[5px]" role="alert">
          <p className="font-semibold mb-1">Error submitting form</p>
          <p className="text-sm">{errorMessage}</p>
        </div>
      )}

      <div>
        <label htmlFor="fullName" className={labelBase}>Full name <span className="text-[#1F99ED]">*</span></label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
          autoComplete="name"
          placeholder="Your full name"
          className={inputBase}
        />
      </div>

      <div>
        <label htmlFor="workEmail" className={labelBase}>Work email <span className="text-[#1F99ED]">*</span></label>
        <input
          type="email"
          id="workEmail"
          name="workEmail"
          value={formData.workEmail}
          onChange={handleChange}
          required
          autoComplete="email"
          placeholder="you@company.com"
          className={inputBase}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="company" className={labelBase}>{context.companyLabel}</label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            autoComplete="organization"
            placeholder={context.companyLabel}
            className={inputBase}
          />
        </div>
        {(category === 'PROJECT' || category === 'WORK' || category === 'GENERAL') && (
          <div>
            <label htmlFor="website" className={labelBase}>Website or social page</label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://"
              className={inputBase}
            />
          </div>
        )}
      </div>

      <div>
        <label htmlFor="serviceArea" className={labelBase}>What is this about? <span className="text-[#1F99ED]">*</span></label>
        <select
          id="serviceArea"
          name="serviceArea"
          value={formData.serviceArea}
          onChange={handleChange}
          required
          className={inputBase}
        >
          {context.serviceAreas.map((area) => (
            <option key={area} value={area}>{area}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="challenge" className={labelBase}>{context.challengeLabel} <span className="text-[#1F99ED]">*</span></label>
        <textarea
          id="challenge"
          name="challenge"
          value={formData.challenge}
          onChange={handleChange}
          required
          minLength={20}
          rows={4}
          placeholder={context.challengePlaceholder}
          className={inputBase}
        />
      </div>

      <div>
        <label htmlFor="objective" className={labelBase}>{context.objectiveLabel}</label>
        <textarea
          id="objective"
          name="objective"
          value={formData.objective}
          onChange={handleChange}
          rows={3}
          placeholder={context.objectivePlaceholder}
          className={inputBase}
        />
      </div>

      {context.showTimeline && (
        <div>
          <label htmlFor="timeline" className={labelBase}>Timeline</label>
          <input
            type="text"
            id="timeline"
            name="timeline"
            value={formData.timeline}
            onChange={handleChange}
            placeholder="e.g. this quarter, as soon as possible, next year"
            className={inputBase}
          />
        </div>
      )}

      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="consent"
          name="consent"
          checked={formData.consent}
          onChange={handleChange}
          required
          className="mt-0.5 h-4 w-4 rounded-[3px] border-gray-300 text-[#1F99ED] focus:ring-[#1F99ED] cursor-pointer"
        />
        <label htmlFor="consent" className="text-sm text-gray-600 cursor-pointer leading-relaxed">
          I consent to ONEFOCUS AFRICA contacting me about this inquiry. <span className="text-[#1F99ED]">*</span>
        </label>
      </div>

      <div>
        <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Submitting…' : context.submitLabel}
        </Button>
      </div>

      <p className="text-xs text-gray-400 text-center">
        * Required fields. We&apos;ll respond within 1–2 business days.
      </p>
    </form>
  )
}
