import type { InquiryCategory } from './inquiry-category'

export type InquiryContext = {
  eyebrow: string
  title: string
  description: string
  serviceAreas: string[]
  companyLabel: string
  challengeLabel: string
  challengePlaceholder: string
  objectiveLabel: string
  objectivePlaceholder: string
  showTimeline: boolean
  submitLabel: string
}

const ALL_AREAS = [
  'Brand and growth strategy',
  'Cinematic media and marketing tours',
  'Website, technology and automation',
  'Corporate training',
  'Talent, community or partnerships',
  'Not sure yet',
]

export const inquiryContext: Record<InquiryCategory, InquiryContext> = {
  PROJECT: {
    eyebrow: 'PROJECT DISCOVERY',
    title: 'START A PROJECT',
    description: 'Tell us what you want to build so we can suggest a sensible scope, deliverables and next step.',
    serviceAreas: [
      'Brand and growth strategy',
      'Cinematic media and marketing tours',
      'Website, technology and automation',
      'Not sure yet',
    ],
    companyLabel: 'Company name',
    challengeLabel: 'What do you want to build or fix?',
    challengePlaceholder: 'Describe the business challenge, the audience and what needs to change.',
    objectiveLabel: 'What would success look like?',
    objectivePlaceholder: 'A clear outcome, launch date or metric we should work towards.',
    showTimeline: true,
    submitLabel: 'Request a project scope',
  },
  WORK: {
    eyebrow: 'SIMILAR WORK',
    title: 'ASK ABOUT SIMILAR PROJECTS',
    description: 'Ask about the proof you just saw. Tell us which result you want to discuss for your own organisation.',
    serviceAreas: [
      'Brand and growth strategy',
      'Cinematic media and marketing tours',
      'Website, technology and automation',
      'Not sure yet',
    ],
    companyLabel: 'Company name',
    challengeLabel: 'Which result are you interested in?',
    challengePlaceholder: 'Tell us which case study caught your attention and what you would want to achieve.',
    objectiveLabel: 'Your target outcome',
    objectivePlaceholder: 'For example: more qualified inquiries, stronger trust or a clearer brand story.',
    showTimeline: false,
    submitLabel: 'Ask about this work',
  },
  TRAINING: {
    eyebrow: 'TRAINING ENQUIRY',
    title: 'ASK ABOUT TRAINING',
    description: 'Tell us who needs training and what they should be able to do afterwards.',
    serviceAreas: [
      'Corporate training',
      'Talent, community or partnerships',
      'Not sure yet',
    ],
    companyLabel: 'Organisation name',
    challengeLabel: 'What training do you need?',
    challengePlaceholder: 'Describe the team, their current skills and the gap you want to close.',
    objectiveLabel: 'Preferred format or timing',
    objectivePlaceholder: 'Workshop, cohort, online session, preferred dates.',
    showTimeline: true,
    submitLabel: 'Ask about training',
  },
  COMMUNITY: {
    eyebrow: 'COMMUNITY ENQUIRY',
    title: 'ASK HOW TO JOIN',
    description: 'Tell us how you would like to take part in the ONEFOCUS talent community.',
    serviceAreas: [
      'Talent, community or partnerships',
      'Corporate training',
      'Not sure yet',
    ],
    companyLabel: 'Organisation or group',
    challengeLabel: 'How would you like to be involved?',
    challengePlaceholder: 'Tell us about your interests, skills or the community you want to serve.',
    objectiveLabel: 'Anything else we should know?',
    objectivePlaceholder: 'Availability, location, links to your work or past projects.',
    showTimeline: false,
    submitLabel: 'Ask how to join',
  },
  GENERAL: {
    eyebrow: 'DISCOVERY FORM',
    title: 'BUSINESS DISCOVERY',
    description: 'Tell us what you want to grow. A clear brief helps us recommend the right engagement, realistic deliverables and responsible next steps.',
    serviceAreas: ALL_AREAS,
    companyLabel: 'Company name',
    challengeLabel: 'Tell us about your challenge',
    challengePlaceholder: "What's the specific challenge or opportunity you're facing?",
    objectiveLabel: "What's your goal?",
    objectivePlaceholder: 'What would success look like for this project?',
    showTimeline: false,
    submitLabel: 'Request Consultation',
  },
}

export function subjectChallenge(subject: string | undefined, category: InquiryCategory): string {
  if (!subject) return ''
  const intro: Record<InquiryCategory, string> = {
    PROJECT: "I'd like to discuss a project about",
    WORK: "I'd like to discuss a project similar to",
    TRAINING: "I'd like training about",
    COMMUNITY: "I'd like to join or partner around",
    GENERAL: "I'm contacting you about",
  }
  const value = `${intro[category]} ${subject}.`
  return value.length >= 20 ? value : `${value} Please tell me how this works.`
}
