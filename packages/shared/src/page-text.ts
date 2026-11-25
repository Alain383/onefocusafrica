export type PageTextField = {
  section: string
  key: string
  label: string
  default: string
  multiline?: boolean
  hint?: string
}

export type PageTextGroup = {
  id: string
  title: string
  description: string
  paths: string[]
  fields: PageTextField[]
}

export const PAGE_TEXT_GROUPS: PageTextGroup[] = [
  {
    id: 'home',
    title: 'Homepage',
    description: 'Headline and call-to-action wording on the homepage.',
    paths: ['/'],
    fields: [
      { section: 'home', key: 'hero_headline_lead', label: 'Hero headline – first line', default: 'Make your business easier to' },
      { section: 'home', key: 'hero_headline_accent', label: 'Hero headline – highlighted line', default: 'find, trust & choose.' },
      { section: 'home', key: 'hero_subheading', label: 'Hero description', default: 'ONEFOCUS brings strategy, cinematic media, web technology and lead capture together so attention has somewhere valuable to go.', multiline: true },
      { section: 'home', key: 'clients_eyebrow', label: 'Client logos small label', default: 'TRUSTED BY' },
      { section: 'home', key: 'clients_title', label: 'Client logos heading', default: 'Teams we have worked with' },
      { section: 'home', key: 'cta_heading', label: 'Bottom CTA heading', default: "LET'S MAKE IT PRACTICAL" },
      { section: 'home', key: 'cta_question', label: 'Bottom CTA question', default: 'What are you trying to grow?' },
      { section: 'home', key: 'cta_body', label: 'Bottom CTA description', default: "Tell us the challenge. We'll help define a sensible next step.", multiline: true },
    ],
  },
  {
    id: 'contact',
    title: 'Contact page',
    description: 'Intro text above the general inquiry form.',
    paths: ['/contact'],
    fields: [
      { section: 'contact', key: 'hero_title', label: 'Hero title', default: "Let's discuss your next move." },
      { section: 'contact', key: 'hero_subtitle', label: 'Hero subtitle', default: 'Based in Kigali, Rwanda. Serving businesses across Africa.' },
      { section: 'contact', key: 'form_description', label: 'Form introduction', default: 'Tell us what you want to grow. A clear brief helps us recommend the right engagement, realistic deliverables and responsible next steps.', multiline: true },
      { section: 'contact', key: 'location_eyebrow', label: 'Location small label', default: 'OUR LOCATION' },
      { section: 'contact', key: 'location_title', label: 'Location heading', default: 'Find us in Kigali' },
      { section: 'contact', key: 'location_description', label: 'Location description', default: 'Our office is in Timbuktoo Building, Nyarugenge, Kigali. Send an inquiry before visiting so we can set the right time and agenda.', multiline: true },
      { section: 'contact', key: 'location_address', label: 'Office address', default: 'Nyarugenge, Timbuktoo Building, Kigali, Rwanda' },
      { section: 'contact', key: 'location_directions', label: 'Directions button text', default: 'Get directions' },
    ],
  },
  {
    id: 'talent-hero',
    title: 'Talent – hero',
    description: 'Top section of the Talent & Learning page.',
    paths: ['/talent'],
    fields: [
      { section: 'talent', key: 'hero_eyebrow', label: 'Small label', default: 'TALENT ECOSYSTEM' },
      { section: 'talent', key: 'hero_title', label: 'Page title', default: 'TALENT & LEARNING' },
      { section: 'talent', key: 'hero_tagline', label: 'Tagline', default: 'Build skills. Show work. Discover opportunities.' },
      { section: 'talent', key: 'hero_description', label: 'Description', default: 'Courses, career discovery, mentorship, portfolios, entrepreneurship and community within one clear learner journey.', multiline: true },
      { section: 'talent', key: 'hero_button', label: 'Button text', default: 'Explore Programs' },
    ],
  },
  {
    id: 'talent-journey',
    title: 'Talent – journey',
    description: 'The six-step learner journey. One step per line: Title | Description.',
    paths: ['/talent'],
    fields: [
      { section: 'talent', key: 'journey_title', label: 'Section title', default: 'THE ONEFOCUS JOURNEY' },
      { section: 'talent', key: 'journey_subtitle', label: 'Section subtitle', default: 'From potential to demonstrable skills.' },
      { section: 'talent', key: 'journey_steps', label: 'Journey steps', default: 'Discover | Explore possible pathways and strengths.\nDevelop | Learn relevant tools and skills.\nBuild | Work on age-appropriate real projects.\nShowcase | Present evidence of completed work.\nConnect | Meet approved mentors and institutions.\nGrow | Apply feedback to the next step.', multiline: true, hint: 'One step per line: Title | Description' },
    ],
  },
  {
    id: 'talent-programs',
    title: 'Talent – programs',
    description: 'Program cards. One program per line: Title | Description | Link.',
    paths: ['/talent'],
    fields: [
      { section: 'talent', key: 'programs_eyebrow', label: 'Small label', default: 'OUR PROGRAMS' },
      { section: 'talent', key: 'programs_title', label: 'Section title', default: 'PROGRAMS' },
      { section: 'talent', key: 'programs_description', label: 'Section description', default: 'Each initiative has a clear role.' },
      { section: 'talent', key: 'programs_items', label: 'Program cards', default: 'Learning Academy | Courses and practical workshops | #academy\nINZIRA AI | Career guidance concept; confirm live functionality before launch | #inzira\nHYPERDRIVE | Entrepreneurship learning and project challenges | #hyperdrive\nSchool Outreach | School-approved, supervised learner programs | #school\n1FOCUS VIP Inner Circle | Peer learning and community support | #community\nMentorship & Internships | Program availability and safeguards must be verified | #mentorship', multiline: true, hint: 'One per line: Title | Description | Link' },
    ],
  },
  {
    id: 'talent-academy',
    title: 'Talent – Skills Training / Learning Academy',
    description: 'Headings, skill pathways and notice in the academy section.',
    paths: ['/talent'],
    fields: [
      { section: 'talent', key: 'academy_eyebrow', label: 'Small label', default: 'SKILLS TRAINING' },
      { section: 'talent', key: 'academy_title', label: 'Section title', default: 'LEARNING ACADEMY' },
      { section: 'talent', key: 'academy_tagline', label: 'Tagline', default: 'Learn something useful. Build something real.' },
      { section: 'talent', key: 'academy_description', label: 'Description', default: 'Explore training areas. Enrollment, pricing and certification should reflect verified current availability.', multiline: true },
      { section: 'talent', key: 'academy_pathways', label: 'Skill pathways', default: 'AI & Prompt Engineering | Practice-based modules, project exercises and an appropriate level of support.\nWebsites, Landing Pages & Funnels | Practice-based modules, project exercises and an appropriate level of support.\nEmail Marketing & Customer Communication | Practice-based modules, project exercises and an appropriate level of support.\nBrand Strategy, Graphic Design & Content | Practice-based modules, project exercises and an appropriate level of support.', multiline: true, hint: 'One per line: Title | Description' },
      { section: 'talent', key: 'academy_pathway_label', label: 'Pathway card label', default: 'SKILL PATHWAY' },
      { section: 'talent', key: 'academy_button', label: 'Pathway button text', default: 'Ask About Training' },
      { section: 'talent', key: 'academy_notice', label: 'Notice at bottom', default: 'Do not claim all courses are open, accredited, certified or available before confirming the current program schedule.', multiline: true },
    ],
  },
  {
    id: 'talent-community',
    title: 'Talent – community & CTA',
    description: 'Community section, inner circle details and final call to action.',
    paths: ['/talent'],
    fields: [
      { section: 'talent', key: 'community_eyebrow', label: 'Small label', default: 'COMMUNITY' },
      { section: 'talent', key: 'community_title', label: 'Section title', default: 'ONEFOCUS COMMUNITY' },
      { section: 'talent', key: 'community_tagline', label: 'Tagline', default: 'Learn and build alongside people with purpose.' },
      { section: 'talent', key: 'community_description', label: 'Description', default: 'A private learning and peer-support community for creators, freelancers, entrepreneurs and professionals.', multiline: true },
      { section: 'talent', key: 'community_inner_title', label: 'Inner circle title', default: '1FOCUS VIP INNER CIRCLE' },
      { section: 'talent', key: 'community_price', label: 'Joining fee text', default: 'One-time joining fee: $2' },
      { section: 'talent', key: 'community_benefits', label: 'Inner circle benefits', default: 'Practical AI and digital discussions\nShared learning resources\nNetworking and peer support\nInformation on confirmed sessions', multiline: true, hint: 'One benefit per line' },
      { section: 'talent', key: 'community_rules_title', label: 'Rules title', default: 'COMMUNITY RULES' },
      { section: 'talent', key: 'community_rules_body', label: 'Rules text', default: 'Privacy, respect and useful learning. No spam, unauthorized private outreach or income guarantees.', multiline: true },
      { section: 'talent', key: 'community_button', label: 'Community button text', default: 'Ask How to Join' },
      { section: 'talent', key: 'final_title', label: 'Final CTA title', default: 'Ready to start your learning journey?' },
      { section: 'talent', key: 'final_description', label: 'Final CTA description', default: "Tell us about your goals and we'll help you find the right pathway.", multiline: true },
      { section: 'talent', key: 'final_button', label: 'Final CTA button text', default: 'Get Started' },
    ],
  },
  {
    id: 'work',
    title: 'Work & case studies',
    description: 'Headings on the PROOF & CASE STUDIES page.',
    paths: ['/work'],
    fields: [
      { section: 'work', key: 'hero_eyebrow', label: 'Small label', default: 'SELECTED WORK' },
      { section: 'work', key: 'hero_title', label: 'Page title', default: 'PROOF & CASE STUDIES' },
      { section: 'work', key: 'hero_tagline', label: 'Tagline', default: 'Work should speak through evidence.' },
      { section: 'work', key: 'hero_description', label: 'Description', default: 'Real problems, delivered scope and verified results — added by the admin team.', multiline: true },
      { section: 'work', key: 'standard_title', label: 'Standard box title', default: 'CASE STUDY STANDARD' },
      { section: 'work', key: 'standard_tagline', label: 'Standard box tagline', default: 'Proof over promises.' },
      { section: 'work', key: 'standard_requirements', label: 'Publication requirements', default: 'Client permission and approval\nProject scope and timeline\nDelivery dates and team\nVerified outcomes and metrics', multiline: true, hint: 'One item per line' },
      { section: 'work', key: 'standard_questions', label: 'Case study questions', default: "What was the client's challenge?\nWhat did ONEFOCUS deliver?\nHow was success assessed?\nWhat assets may be published?", multiline: true, hint: 'One question per line' },
      { section: 'work', key: 'final_title', label: 'Final CTA title', default: 'Ready to create your own success story?' },
      { section: 'work', key: 'final_description', label: 'Final CTA description', default: "Tell us about your challenge and we'll help define a practical project scope.", multiline: true },
      { section: 'work', key: 'final_button', label: 'Final CTA button text', default: 'Start a Project' },
    ],
  },
  {
    id: 'gallery',
    title: 'Gallery page',
    description: 'Headings on the public gallery page.',
    paths: ['/gallery'],
    fields: [
      { section: 'gallery', key: 'hero_eyebrow', label: 'Small label', default: 'MOMENTS & IMPACT' },
      { section: 'gallery', key: 'hero_title', label: 'Page title', default: 'GALLERY' },
      { section: 'gallery', key: 'hero_description', label: 'Description', default: 'A visual record of our work, people and community.', multiline: true },
    ],
  },
  {
    id: 'solutions',
    title: 'Solutions page',
    description: 'Main headings on the Solutions page.',
    paths: ['/solutions'],
    fields: [
      { section: 'solutions', key: 'hero_eyebrow', label: 'Small label', default: 'WHAT WE OFFER' },
      { section: 'solutions', key: 'hero_title', label: 'Page title', default: 'Our Solutions' },
      { section: 'solutions', key: 'hero_description', label: 'Description', default: 'One partner. Four clear capabilities.' },
      { section: 'solutions', key: 'signature_eyebrow', label: 'Signature small label', default: 'SIGNATURE CAPABILITY' },
      { section: 'solutions', key: 'signature_title', label: 'Signature title', default: 'OUR SIGNATURE CAPABILITY' },
      { section: 'solutions', key: 'signature_tagline', label: 'Signature tagline', default: "Don't just show it. Let customers experience it." },
      { section: 'solutions', key: 'signature_description', label: 'Signature description', default: 'Interactive Marketing Tours combine cinematic video, sharp photography, live formats and a clear inquiry pathway. Every media asset serves a business purpose.', multiline: true },
      { section: 'solutions', key: 'signature_button', label: 'Signature button text', default: 'Explore Marketing Tours' },
      { section: 'solutions', key: 'service_button', label: 'Service button text', default: 'Request This Service' },
      { section: 'solutions', key: 'process_eyebrow', label: 'Process small label', default: 'HOW IT WORKS' },
      { section: 'solutions', key: 'process_title', label: 'Process title', default: 'THE PROCESS' },
      { section: 'solutions', key: 'process_description', label: 'Process description', default: 'A simple engagement, not unnecessary complexity.' },
      { section: 'solutions', key: 'process_steps', label: 'Process steps', default: 'Understand | Review needs, assets and constraints.\nDeliver | Build and produce the agreed scope.\nImprove | Test, report and suggest next actions.', multiline: true, hint: 'One step per line: Title | Description' },
      { section: 'solutions', key: 'final_title', label: 'Final CTA title', default: 'Ready to start?' },
      { section: 'solutions', key: 'final_description', label: 'Final CTA description', default: "Tell us about your challenge and we'll help define the right engagement.", multiline: true },
      { section: 'solutions', key: 'final_button', label: 'Final CTA button text', default: 'Start a Project' },
    ],
  },
  {
    id: 'about',
    title: 'About page',
    description: 'Main headings on the About page.',
    paths: ['/about'],
    fields: [
      { section: 'about', key: 'hero_eyebrow', label: 'Small label', default: 'OUR STORY' },
      { section: 'about', key: 'hero_title', label: 'Page title', default: 'ABOUT ONEFOCUS AFRICA' },
      { section: 'about', key: 'hero_subtitle', label: 'Hero subtitle', default: 'Built in Africa. Designed to move business forward.' },
      { section: 'about', key: 'hero_description', label: 'Hero description', default: 'ONEFOCUS AFRICA connects commercial strategy, media, technology and practical skills under one clear approach.', multiline: true },
      { section: 'about', key: 'why_eyebrow', label: 'Why small label', default: 'WHY WE EXIST' },
      { section: 'about', key: 'why_title', label: 'Why title', default: 'A clear partner for complex growth challenges.' },
      { section: 'about', key: 'why_body1', label: 'Why paragraph 1', default: 'Disconnected marketing, media production and technology vendors can make execution unnecessarily difficult. ONEFOCUS aims to bring the most useful capabilities together, scoped to a client\'s actual needs.', multiline: true },
      { section: 'about', key: 'why_body2', label: 'Why paragraph 2', default: 'We believe that business growth requires more than visibility. It requires a system where brand positioning, content creation, website experience, and follow-up all work together — not in isolation.', multiline: true },
      { section: 'about', key: 'why_button', label: 'Why button text', default: 'Work With Us' },
      { section: 'about', key: 'values_eyebrow', label: 'Values small label', default: 'WHAT WE STAND FOR' },
      { section: 'about', key: 'values_title', label: 'Values title', default: 'Our Core Values' },
      { section: 'about', key: 'values_rows', label: 'Core values', default: 'I | Innovation First | Modern, forward-thinking branding solutions that keep brands ahead.\nA | Authentic Impact | We build brands that genuinely connect with people and communities.\nC | Consistency | Every brand touchpoint feels unified, professional, and memorable.\nE | Empowerment | Design and strategy that helps businesses grow with confidence.', multiline: true, hint: 'One per line: Initial | Title | Description' },
      { section: 'about', key: 'what_title', label: 'What We Do title', default: 'What We Do' },
      { section: 'about', key: 'business_title', label: 'For Businesses title', default: 'For Businesses' },
      { section: 'about', key: 'business_body', label: 'For Businesses text', default: 'Strategy, media, web and automation that helps companies become easier to find, trust and choose. We fix fragmented growth systems.', multiline: true },
      { section: 'about', key: 'talent_title', label: 'For Talent title', default: 'For Talent' },
      { section: 'about', key: 'talent_body', label: 'For Talent text', default: 'Learning, community, mentorship and practical projects that help creators and professionals build demonstrable skills and real opportunities.', multiline: true },
      { section: 'about', key: 'location_title', label: 'Location title', default: 'Based in Kigali, Rwanda' },
      { section: 'about', key: 'location_description', label: 'Location description', default: 'Serving businesses, institutions and individuals across Africa through practical partnerships and remote-first collaboration.', multiline: true },
      { section: 'about', key: 'location_button', label: 'Location button text', default: 'Get in Touch' },
    ],
  },
]

export const PAGE_TEXT_FIELDS: PageTextField[] = PAGE_TEXT_GROUPS.flatMap((group) => group.fields)

export function pageTextKey(field: PageTextField): string {
  return `${field.section}:${field.key}`
}

export function pageTextDefault(section: string, key: string): string {
  return PAGE_TEXT_FIELDS.find((field) => field.section === section && field.key === key)?.default ?? ''
}
