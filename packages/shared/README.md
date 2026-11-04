# @onefocus/shared

Shared utilities, validation schemas, and types for ONEFOCUS AFRICA monorepo. Used by both web and admin applications.

## Structure

```
packages/shared/
├── src/
│   ├── validation/
│   │   └── schemas.ts        # Zod validation schemas
│   ├── utils/
│   │   ├── slug.ts           # URL slug generation
│   │   ├── sanitize.ts       # HTML sanitization (DOMPurify)
│   │   └── email.ts          # Email sending utilities (Nodemailer)
│   ├── types/
│   │   └── (shared types)
│   └── index.ts              # Main export file
├── package.json
└── tsconfig.json
```

## Usage

### In Web or Admin App

```typescript
import { 
  inquirySchema, 
  communityMemberSchema,
  generateSlug,
  sanitizeHtml,
  sendInquiryNotification 
} from '@onefocus/shared'

// Validate user input
const validated = inquirySchema.parse(formData)

// Generate URL slug
const slug = generateSlug('My Blog Post Title')

// Sanitize HTML content
const clean = sanitizeHtml('<p>User content</p>')

// Send email
await sendInquiryNotification(inquiryData)
```

## Validation Schemas

### inquirySchema
Validates contact form inquiries with required fields:
- `fullName` (min 2 chars)
- `workEmail` (valid email)
- `serviceArea` (enum)
- `challenge` (min 20 chars)
- `consent` (must be true)

Optional fields: `company`, `industry`, `country`, `website`, `objective`, `timeline`

### communityMemberSchema
Validates community membership with:
- `fullName` (min 2 chars)
- `email` (valid email)
- `interests` (array, min 1 item)
- `whatsappPhone` (optional)

## Utilities

### generateSlug(title: string): string
Converts a title into a URL-safe slug:
- Lowercase
- Spaces → hyphens
- Removes non-alphanumeric characters
- Collapses consecutive hyphens
- Trims leading/trailing hyphens

Example: `"My Blog Post!"` → `"my-blog-post"`

### sanitizeHtml(dirty: string): string
Server-side HTML sanitization using DOMPurify + jsdom:
- Strips `<script>` and `<style>` tags
- Removes javascript: URI schemes
- Removes inline event handlers (onclick, onerror, etc.)
- Preserves safe HTML formatting

### Email Functions

#### sendInquiryNotification(data: InquiryEmailData)
Sends inquiry notification to admin email. Requires env vars:
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
- `SMTP_FROM`, `CONTACT_EMAIL`

#### sendInquiryConfirmation(data: { fullName, workEmail })
Sends auto-reply confirmation to user.

## Dependencies

### Runtime
- `zod` - Schema validation
- `nodemailer` - Email sending
- `dompurify` - HTML sanitization
- `jsdom` - DOM implementation for DOMPurify

### Development
- `typescript` - Type checking
- `vitest` - Testing framework
- Type definitions for all dependencies

## Environment Variables

Required for email utilities:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
SMTP_FROM=onefocusafrica@gmail.com
CONTACT_EMAIL=onefocusafrica@gmail.com
NEXT_PUBLIC_SITE_URL=https://onefocusafrica.com
```

## Testing

```bash
npm run test
```

## Requirements Met

- 6.1, 6.2, 6.3 - Package structure with types, validation, utils
- 6.4, 6.5 - Migrated utilities from lib/
- 6.6, 6.7, 6.8 - TypeScript configuration
- 6.9, 6.10, 6.11 - Dependencies and exports