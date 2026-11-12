'use client'

import { useState } from 'react'
import Button from '../ui/Button'

// Shared input / textarea / select base classes
// All form elements use 5px border-radius per Brand Guidelines
const inputBase =
  'w-full px-4 py-2.5 text-sm border border-gray-200 rounded-[5px] bg-white text-[#10183F] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1F99ED] focus:border-transparent transition-all duration-150'

const labelBase =
  'block text-xs font-bold uppercase tracking-widest text-[#10183F] mb-2'

export default function InquiryForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    workEmail: '',
    company: '',
    website: '',
    serviceArea: '',
    challenge: '',
    objective: '',
    consent: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const serviceAreas = [
    'Choose an area',
    'Brand and growth strategy',
    'Cinematic media and marketing tours',
    'Website, technology and automation',
    'Corporate training',
    'Talent, community or partnerships',
    'Not sure yet',
  ]

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
        setFormData({
          fullName: '',
          workEmail: '',
          company: '',
          website: '',
          serviceArea: '',
          challenge: '',
          objective: '',
          consent: false,
        })
      } else {
        setSubmitStatus('error')
        setErrorMessage(data.error || 'Failed to submit inquiry')
      }
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage('Network error. Please try again.')
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto space-y-6"
      style={{ fontFamily: 'var(--font-body)' }}
      noValidate
    >
      {/* Success message — 5px radius, Picton Blue accent */}
      {submitStatus === 'success' && (
        <div
          className="p-4 bg-[#EEF6FD] border border-[#1F99ED] text-[#10183F] rounded-[5px]"
          role="alert"
        >
          <p className="font-semibold text-[#1F99ED] mb-1">Thank you for your inquiry!</p>
          <p className="text-sm text-gray-700">We&apos;ll be in touch within 1–2 business days.</p>
        </div>
      )}

      {/* Error message — 5px radius */}
      {submitStatus === 'error' && (
        <div
          className="p-4 bg-red-50 border border-red-300 text-red-700 rounded-[5px]"
          role="alert"
        >
          <p className="font-semibold mb-1">Error submitting form</p>
          <p className="text-sm">{errorMessage}</p>
        </div>
      )}

      {/* ── Full Name ── */}
      <div>
        <label htmlFor="fullName" className={labelBase}>
          Full name <span className="text-[#1F99ED]">*</span>
        </label>
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

      {/* ── Work Email ── */}
      <div>
        <label htmlFor="workEmail" className={labelBase}>
          Work email <span className="text-[#1F99ED]">*</span>
        </label>
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

      {/* ── Two-column row: Company + Website ── */}
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="company" className={labelBase}>
            Company name
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            autoComplete="organization"
            placeholder="Your company"
            className={inputBase}
          />
        </div>
        <div>
          <label htmlFor="website" className={labelBase}>
            Website or social page
          </label>
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
      </div>

      {/* ── Service Area ── */}
      <div>
        <label htmlFor="serviceArea" className={labelBase}>
          What do you need? <span className="text-[#1F99ED]">*</span>
        </label>
        <select
          id="serviceArea"
          name="serviceArea"
          value={formData.serviceArea}
          onChange={handleChange}
          required
          className={inputBase}
        >
          {serviceAreas.map((area) => (
            <option key={area} value={area === 'Choose an area' ? '' : area}>
              {area}
            </option>
          ))}
        </select>
      </div>

      {/* ── Challenge ── */}
      <div>
        <label htmlFor="challenge" className={labelBase}>
          Tell us about your challenge <span className="text-[#1F99ED]">*</span>
        </label>
        <textarea
          id="challenge"
          name="challenge"
          value={formData.challenge}
          onChange={handleChange}
          required
          rows={4}
          placeholder="What's the specific challenge or opportunity you're facing?"
          className={inputBase}
        />
      </div>

      {/* ── Objective ── */}
      <div>
        <label htmlFor="objective" className={labelBase}>
          What&apos;s your goal?{' '}
          <span className="text-gray-400 normal-case tracking-normal text-xs font-normal">
            (optional)
          </span>
        </label>
        <textarea
          id="objective"
          name="objective"
          value={formData.objective}
          onChange={handleChange}
          rows={3}
          placeholder="What would success look like for this project?"
          className={inputBase}
        />
      </div>

      {/* ── Consent checkbox ── */}
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
        <label
          htmlFor="consent"
          className="text-sm text-gray-600 cursor-pointer leading-relaxed"
        >
          I consent to ONEFOCUS AFRICA contacting me about this inquiry.{' '}
          <span className="text-[#1F99ED]">*</span>
        </label>
      </div>

      {/* ── Submit ── */}
      <div>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? 'Submitting…' : 'Request Consultation →'}
        </Button>
      </div>

      {/* Caption text — Poppins Regular 12px */}
      <p className="text-xs text-gray-400 text-center">
        * Required fields. We&apos;ll respond within 1–2 business days.
      </p>
    </form>
  )
}
