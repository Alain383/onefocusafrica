# @onefocus/admin

Admin dashboard for ONEFOCUS AFRICA - admin.onefocusafrica.com

## Overview

This is the private admin dashboard application for content management and operations:
- Blog post authoring (TipTap rich text editor)
- Blog categories and tags management
- Portfolio/case study management
- Media asset uploads (Vercel Blob)
- Inquiry management (CRM)
- Community member management
- Site content management (programs, events, team)
- Admin user management
- Authentication and authorization

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Authentication:** NextAuth v5
- **Rich Text Editor:** TipTap
- **File Upload:** Vercel Blob
- **Styling:** Tailwind CSS 4.0
- **Animation:** Framer Motion
- **Database:** @onefocus/database (PostgreSQL via Prisma)
- **Utilities:** @onefocus/shared (validation, email, sanitization)
- **Testing:** Vitest + fast-check

## Development

```bash
# Install dependencies (from monorepo root)
npm install

# Run development server (port 3001)
npm run dev:admin

# Build for production
npm run build:admin

# Run tests
npm run test:admin
```

## Project Structure

```
apps/admin/
├── app/
│   ├── admin/              # Admin routes (protected)
│   │   ├── page.tsx        # Dashboard
│   │   ├── login/          # Login page
│   │   ├── blog/           # Blog management
│   │   ├── portfolio/      # Portfolio management
│   │   ├── media/          # Media library
│   │   ├── inquiries/      # CRM
│   │   ├── content/        # Site content
│   │   ├── settings/       # Settings
│   │   └── layout.tsx      # Admin layout
│   ├── api/                # Admin API endpoints
│   │   └── admin/
│   ├── layout.tsx          # Root layout
│   └── globals.css         # Global styles
├── components/
│   └── admin/              # Admin components
├── lib/                    # Utilities
├── middleware.ts           # Auth middleware
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
└── vitest.config.ts
```

## Features

### Content Management
- **Blog:** Create, edit, schedule, publish posts with categories/tags
- **Portfolio:** Manage case studies with media assets
- **Media Library:** Upload and organize images/files to Vercel Blob
- **Site Content:** Manage programs, events, team members

### Operations
- **Inquiries:** View and manage business inquiries (CRM)
- **Community:** View community members and newsletter subscribers
- **Analytics:** Track content performance (future)

### Administration
- **User Management:** Create admin users (ADMIN/EDITOR roles)
- **Authentication:** Secure login with rate limiting
- **Authorization:** Role-based access control

### Real-time Sync
- Content published triggers web app revalidation
- ISR ensures web sees updates within 60 seconds
- On-demand revalidation API

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# NextAuth
NEXTAUTH_URL="https://admin.onefocusafrica.com"
NEXTAUTH_SECRET="your-secret-key"

# Vercel Blob (file uploads)
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
SMTP_FROM=onefocusafrica@gmail.com
CONTACT_EMAIL=onefocusafrica@gmail.com

# Site
NEXT_PUBLIC_SITE_URL=https://www.onefocusafrica.com
NEXT_PUBLIC_ADMIN_URL=https://admin.onefocusafrica.com
```

## Deployment

**Platform:** Vercel  
**Domain:** admin.onefocusafrica.com  
**Build Command:** `npm run build:admin`  
**Output Directory:** `.next`  
**Install Command:** `npm install` (from root)  
**Port:** 3001 (development)

### Vercel Configuration
- Framework Preset: Next.js
- Root Directory: `apps/admin`
- Node Version: 18.x or higher
- Environment Variables: Add all env vars above

## Authentication

- **Provider:** NextAuth v5 with Credentials
- **Session:** JWT-based (8-hour expiry)
- **Rate Limiting:** 5 failed attempts = 15-minute lockout
- **Roles:** ADMIN (full access), EDITOR (content only)

## File Uploads

- **Storage:** Vercel Blob
- **Max Size:** 10MB per file
- **Allowed Types:** Images (jpg, png, webp, gif), PDFs
- **Organization:** Automatic path prefixing by type

## Content Publishing Flow

1. Editor creates/edits content in admin
2. Editor sets status to PUBLISHED
3. Admin triggers web revalidation API
4. Web app refreshes content within 60 seconds
5. Public sees updated content

## Dependencies

### Runtime
- `next` - Framework
- `react`, `react-dom` - UI library
- `next-auth` - Authentication
- `@tiptap/react` - Rich text editor
- `@vercel/blob` - File uploads
- `bcryptjs` - Password hashing
- `zod` - Validation
- `framer-motion` - Animations
- `@onefocus/database` - Database access
- `@onefocus/shared` - Shared utilities

### Development
- `typescript` - Type checking
- `tailwindcss` - Styling
- `vitest` - Testing
- `fast-check` - Property-based testing
- `eslint` - Linting

## Security

- Password hashing with bcryptjs
- Rate-limited login attempts
- JWT session tokens (httpOnly)
- CSRF protection (NextAuth)
- Input sanitization (DOMPurify)
- SQL injection prevention (Prisma)

## Requirements Met

- 1.6, 4.1-4.10 - Admin application structure
- 8.1-8.9 - Content management features
- 9.1-9.6 - Media and user management
- 10.1-10.5 - Authentication and authorization
- 12.6-12.12 - Admin routes migration
- 16.2, 16.4, 16.6, 16.7, 16.9 - TypeScript configuration
- 17.2, 17.6 - Testing setup
- 19.1-19.8 - Admin API endpoints