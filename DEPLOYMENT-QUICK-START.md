# 🚀 ONEFOCUS AFRICA — Deployment Quick Start

## Pre-Deployment Security Checklist

### ✅ Step 1: Rotate Database Credentials
```bash
# 1. Log in to Neon Console
open https://console.neon.tech/

# 2. Navigate to your project → Settings → Reset Password
# 3. Copy new connection strings
# 4. Update locally (don't commit):
# - apps/web/.env
# - apps/admin/.env
```

### ✅ Step 2: Generate New NextAuth Secret
```bash
# Generate secure random secret
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Update apps/admin/.env:
# NEXTAUTH_SECRET="<generated_secret>"
```

### ✅ Step 3: Create Production Admin User
```bash
# Set credentials (terminal only, never commit)
export ADMIN_NAME="Your Full Name"
export ADMIN_EMAIL="admin@onefocusafrica.com"
export ADMIN_PASSWORD="YourSecurePassword123!"
export DATABASE_URL="<new_production_database_url>"

# Generate Prisma Client
npm run db:generate

# Create admin user
npm run create-admin --workspace=packages/database

# Clear terminal history
history -c
```

---

## Vercel Deployment

### Project 1: ONEFOCUS WEB (Public Website)

#### Create Project
1. Go to https://vercel.com/new
2. Import: `Alain383/onefocusafrica`
3. **Root Directory:** `apps/web`
4. **Framework Preset:** Next.js

#### Build Settings
```
Install Command: cd ../.. && npm install
Build Command:   cd ../.. && npm run db:generate && npm run build:web
Output Directory: apps/web/.next
```

#### Environment Variables
```bash
DATABASE_URL=<new_neon_pooled_url>
DATABASE_URL_UNPOOLED=<new_neon_direct_url>
NEXT_PUBLIC_SITE_URL=https://www.onefocusafrica.com
NEXT_PUBLIC_SITE_NAME=ONEFOCUS AFRICA
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=onefocusafrica@gmail.com
SMTP_PASS=<gmail_app_password>
SMTP_FROM=onefocusafrica@gmail.com
CONTACT_EMAIL=onefocusafrica@gmail.com
CONTACT_PHONE=+250 781 102 667
WHATSAPP_NUMBER=+250781102667
NEON_BRANCH=production
NEON_BRANCH_ID=br-flat-wind-bex5f4n5
```

### Project 2: ONEFOCUS ADMIN (Protected Dashboard)

#### Create Project
1. Go to https://vercel.com/new
2. Import: `Alain383/onefocusafrica` (same repo)
3. **Root Directory:** `apps/admin`
4. **Framework Preset:** Next.js

#### Build Settings
```
Install Command: cd ../.. && npm install
Build Command:   cd ../.. && npm run db:generate && npm run build:admin
Output Directory: apps/admin/.next
```

#### Environment Variables
```bash
DATABASE_URL=<new_neon_pooled_url>
DATABASE_URL_UNPOOLED=<new_neon_direct_url>
NEXTAUTH_SECRET=<generated_secret_from_step_2>
NEXTAUTH_URL=https://admin.onefocusafrica.com
NEXT_PUBLIC_SITE_URL=https://admin.onefocusafrica.com
NEXT_PUBLIC_SITE_NAME=ONEFOCUS AFRICA Admin
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=onefocusafrica@gmail.com
SMTP_PASS=<gmail_app_password>
SMTP_FROM=onefocusafrica@gmail.com
NEON_BRANCH=production
NEON_BRANCH_ID=br-flat-wind-bex5f4n5

# ⚠️ REQUIRED AFTER MEDIA STORAGE MIGRATION:
BLOB_READ_WRITE_TOKEN=<vercel_blob_token>
```

---

## Custom Domain Configuration

### Public Website
1. Vercel → ONEFOCUS WEB project → Settings → Domains
2. Add domain: `www.onefocusafrica.com`
3. Add redirect: `onefocusafrica.com` → `www.onefocusafrica.com`

### DNS Configuration (Your Domain Registrar)
```
Type  Name  Value
CNAME www   cname.vercel-dns.com
A     @     76.76.21.21 (Vercel's IP)
```

### Admin Dashboard
1. Vercel → ONEFOCUS ADMIN project → Settings → Domains
2. Add domain: `admin.onefocusafrica.com`

### DNS Configuration
```
Type  Name   Value
CNAME admin  cname.vercel-dns.com
```

---

## Database Migration

### Option 1: Using Prisma Migrate (Recommended)
```bash
# Generate Prisma Client
npm run db:generate

# Deploy migrations to production
npm run db:migrate:deploy --workspace=packages/database
```

### Option 2: Push Schema Directly (No Migration History)
```bash
# Push schema to database
npm run push --workspace=packages/database
```

---

## Post-Deployment Verification

### Public Website Tests
- [ ] Homepage loads: https://www.onefocusafrica.com
- [ ] Blog listing: https://www.onefocusafrica.com/blog
- [ ] Services page: https://www.onefocusafrica.com/services
- [ ] Contact form submission works
- [ ] Mobile responsive
- [ ] HTTPS enabled

### Admin Dashboard Tests
- [ ] Login page: https://admin.onefocusafrica.com/auth/login
- [ ] Admin can log in with created credentials
- [ ] Dashboard loads after login
- [ ] ⚠️ Media upload (will fail until Blob Storage migration)
- [ ] Can create draft blog post
- [ ] Can publish blog post
- [ ] Published post appears on public website

---

## ⚠️ KNOWN ISSUES (Must Fix Before Launch)

### CRITICAL: Media Storage
**Problem:** Current implementation saves uploads to local filesystem, which is ephemeral on Vercel.

**Status:** Workflow in progress to migrate to Vercel Blob Storage.

**Temporary Workaround:** Use external URLs for images in blog posts until migration complete.

**Permanent Fix Required:** 
1. Migrate upload endpoint to use `@vercel/blob`
2. Add `BLOB_READ_WRITE_TOKEN` to admin environment variables
3. Test image upload → publish → display workflow

---

## Troubleshooting

### Build Fails
```bash
# Test build locally
cd apps/web && npm run build
cd apps/admin && npm run build

# Check Prisma generation
npm run db:generate
```

### Database Connection Errors
- Verify `DATABASE_URL` in Vercel environment variables
- Check Neon database is active
- Verify IP allowlist (if configured)

### Authentication Not Working
- Verify `NEXTAUTH_SECRET` is set
- Verify `NEXTAUTH_URL` matches deployed domain
- Check browser cookies are enabled

### Images Not Loading
- Expected until Vercel Blob Storage migration
- Use external image URLs as temporary workaround

---

## Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Prisma Docs:** https://www.prisma.io/docs
- **Neon Docs:** https://neon.tech/docs
- **NextAuth Docs:** https://authjs.dev/

---

## Security Best Practices

✅ **DO:**
- Use environment variables for all secrets
- Rotate credentials regularly
- Enable HTTPS on custom domains
- Monitor authentication logs
- Keep dependencies updated
- Use strong admin passwords

❌ **DON'T:**
- Commit .env files
- Expose admin credentials
- Disable authentication
- Use default passwords
- Share admin access
- Deploy without testing

---

**Last Updated:** Deployment preparation phase  
**Status:** Awaiting build verification completion  
**Next Step:** Fix any remaining build errors, then deploy to Vercel
