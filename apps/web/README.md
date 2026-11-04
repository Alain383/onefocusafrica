# @onefocus/web

Public website for ONEFOCUS AFRICA - www.onefocusafrica.com

## Overview

This is the public-facing Next.js application serving:
- Company homepage and about page
- Services/solutions pages
- Portfolio/work showcase
- Blog articles (read-only, published posts)
- Contact and inquiry forms
- Community membership signup
- Legal pages (privacy, terms)

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS 4.0
- **Animation:** Framer Motion
- **Database:** @onefocus/database (PostgreSQL via Prisma)
- **Utilities:** @onefocus/shared (validation, email, sanitization)
- **Testing:** Vitest + fast-check

## Development

```bash
# Install dependencies (from monorepo root)
npm install

# Run development server
npm run dev:web

# Build for production
npm run build:web

# Run tests
npm run test:web
```

## Project Structure

```
apps/web/
├── app/
│   ├── (routes)/          # Public pages
│   │   ├── page.tsx       # Homepage
│   │   ├── about/
│   │   ├── solutions/
│   │   ├── work/
│   │   ├── blog/
│   │   ├── contact/
│   │   └── ...
│   ├── api/               # Public API endpoints
│   │   ├── inquiries/
│   │   └── community/
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/
│   ├── sections/          # Page sections
│   └── forms/             # Forms
├── lib/                   # Utilities
├── public/                # Static assets
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
└── vitest.config.ts
```

## Features

### Public Pages
- Homepage with hero, services, testimonials
- About page with mission, values, team
- Solutions/services pages
- Portfolio showcase with case studies
- Blog listing and article pages (published only)
- Contact page with inquiry form
- Privacy policy and terms of service

### API Routes
- `/api/inquiries` - Submit business inquiries
- `/api/community` - Join community/newsletter

### Content Sync
- Blog posts are read-only
- Content syncs from admin within 60 seconds (ISR revalidation)
- Published posts only (status === "PUBLISHED")

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# Email (optional - for inquiry notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
SMTP_FROM=onefocusafrica@gmail.com
CONTACT_EMAIL=onefocusafrica@gmail.com

# Site
NEXT_PUBLIC_SITE_URL=https://www.onefocusafrica.com
```

## Deployment

**Platform:** Vercel  
**Domain:** www.onefocusafrica.com  
**Build Command:** `npm run build:web`  
**Output Directory:** `.next`  
**Install Command:** `npm install` (from root)

### Vercel Configuration
- Framework Preset: Next.js
- Root Directory: `apps/web`
- Node Version: 18.x or higher
- Environment Variables: Add all env vars above

## ISR Configuration

Blog pages use Incremental Static Regeneration:
- Revalidate: 3600 seconds (1 hour)
- On-demand revalidation triggered by admin publish action
- Ensures content syncs within 60 seconds

## Dependencies

### Runtime
- `next` - Framework
- `react`, `react-dom` - UI library
- `framer-motion` - Animations
- `zod` - Validation
- `@onefocus/database` - Database access
- `@onefocus/shared` - Shared utilities

### Development
- `typescript` - Type checking
- `tailwindcss` - Styling
- `vitest` - Testing
- `fast-check` - Property-based testing
- `eslint` - Linting

## Requirements Met

- 1.5, 3.1-3.15 - Public application structure
- 7.1-7.9 - Content display and routing
- 12.1-12.5 - Public routes migration
- 16.1, 16.3, 16.5, 16.7, 16.8 - TypeScript configuration
- 17.1, 17.6 - Testing setup
- 18.1, 18.2, 18.7, 18.8 - Public API endpoints