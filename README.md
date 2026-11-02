# ONEFOCUS AFRICA Website

Modern, full-stack website for ONEFOCUS AFRICA - A digital growth engine connecting strategy, media, technology and talent development.

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Email**: Nodemailer
- **Validation**: Zod
- **Animations**: Framer Motion

## Features

- ✅ Responsive design (mobile-first)
- ✅ Server-side rendering with Next.js App Router
- ✅ Contact/inquiry form with database storage
- ✅ Email notifications for new inquiries
- ✅ Community member registration
- ✅ Type-safe database queries with Prisma
- ✅ Form validation with Zod
- ✅ Accessible UI components
- ✅ SEO optimized
- ✅ Performance optimized

## Project Structure

```
.
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── about/            # About page
│   ├── contact/          # Contact page
│   ├── solutions/        # Solutions page
│   ├── talent/           # Talent & Learning page
│   ├── work/             # Case studies page
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Homepage
│   └── globals.css       # Global styles
├── components/            # React components
│   ├── forms/            # Form components
│   ├── sections/         # Page sections
│   └── ui/               # Reusable UI components
├── lib/                   # Utility functions
│   ├── email.ts          # Email sending logic
│   ├── prisma.ts         # Prisma client
│   └── validations.ts    # Zod schemas
├── prisma/                # Database schema
│   └── schema.prisma     # Prisma schema
└── public/                # Static assets

```

## Getting Started

### 1. Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or hosted)
- Gmail account for SMTP (or other email service)

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/onefocus"

# Email Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="onefocusafrica@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="onefocusafrica@gmail.com"

# Contact Information
CONTACT_EMAIL="onefocusafrica@gmail.com"
CONTACT_PHONE="+250 781 102 667"
WHATSAPP_NUMBER="+250781102667"

# Site Configuration
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_NAME="ONEFOCUS AFRICA"
```

### 4. Database Setup

Generate Prisma client and push schema to database:

```bash
npm run prisma:generate
npm run prisma:push
```

For production, use migrations instead:

```bash
npx prisma migrate dev --name init
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Email Setup (Gmail)

To use Gmail for sending emails:

1. Enable 2-factor authentication on your Google account
2. Generate an "App Password" from Google Account settings
3. Use the app password as `SMTP_PASS` in your `.env` file

## Database Management

View and manage your database with Prisma Studio:

```bash
npx prisma studio
```

## Building for Production

```bash
npm run build
npm start
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Railway (Database)

1. Create new PostgreSQL database on Railway
2. Copy connection string to `DATABASE_URL`
3. Run migrations: `npx prisma migrate deploy`

### Environment Variables for Production

Make sure to set all environment variables from `.env.example` in your deployment platform.

## Design System

### Colors

- Primary Blue: `#1F99ED`
- Primary Purple: `#2E3192`
- Primary Dark: `#10183F`
- Primary Light: `#F0F7FD`

### Typography

- Headings: Poppins Bold/Black
- Body: Poppins Regular/Medium

### Breakpoints

- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px

## Key Features Implementation

### Contact Form
- Located at `/contact`
- Validates input with Zod
- Stores in PostgreSQL via Prisma
- Sends email notifications to admin
- Sends confirmation email to user

### Community Registration
- API endpoint: `/api/community`
- $2 one-time membership fee (payment integration pending)
- Stores member information

### Case Studies
- Template structure in place
- Replace with real client work
- Requires client permission for publication

## Important Notes

⚠️ **Before Going Live:**

1. Replace all case study templates with actual client work
2. Verify email and phone contact information
3. Create Privacy Policy and Terms of Service pages
4. Add real testimonials and client logos (with permission)
5. Set up proper error tracking (Sentry, etc.)
6. Configure production database backups
7. Add Google Analytics or analytics platform
8. Test all forms thoroughly
9. Run accessibility audit
10. Set up monitoring and uptime checks

## Content Guidelines

As per design specifications:

- ✅ DO: Use verified client results with permission
- ✅ DO: Provide realistic timelines and deliverables
- ✅ DO: Show measurable outcomes when available
- ❌ DON'T: Make guaranteed sales promises
- ❌ DON'T: Publish fabricated statistics
- ❌ DON'T: Use client work without permission

## Support

For questions or issues:
- Email: onefocusafrica@gmail.com
- WhatsApp: +250 781 102 667

## License

Proprietary - ONEFOCUS AFRICA © 2026
