# 🔒 SECURITY: CREDENTIAL ROTATION REQUIRED BEFORE PRODUCTION DEPLOYMENT

## CRITICAL: Database Credentials Exposed

The Neon PostgreSQL database credentials have been exposed in .env files and git history. These must be rotated before production deployment.

### Exposed Credentials Location
- `apps/web/.env`
- `apps/admin/.env`
- `.env.local` (root)
- Git commit history

### Required Actions

#### 1. Rotate Neon Database Password
1. Log in to Neon Console: https://console.neon.tech/
2. Navigate to your project: `neondb` (Branch: `br-flat-wind-bex5f4n5`)
3. Go to Settings → Reset Password
4. Generate new password
5. Update all connection strings

#### 2. Generate New NextAuth Secret
```bash
openssl rand -base64 32
```
Or use Node.js:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

#### 3. Rotate Email SMTP Password
If using Gmail App Password, regenerate:
1. Google Account → Security → 2-Step Verification → App passwords
2. Create new app password
3. Delete old app password

## Environment Variables for Vercel

### ONEFOCUS WEB (apps/web)
Required environment variables (add in Vercel dashboard):

```
DATABASE_URL=<new_neon_pooled_connection_string>
DATABASE_URL_UNPOOLED=<new_neon_direct_connection_string>
NEXT_PUBLIC_SITE_URL=https://www.onefocusafrica.com
NEXT_PUBLIC_SITE_NAME=ONEFOCUS AFRICA
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=onefocusafrica@gmail.com
SMTP_PASS=<new_app_password>
SMTP_FROM=onefocusafrica@gmail.com
CONTACT_EMAIL=onefocusafrica@gmail.com
CONTACT_PHONE=+250 781 102 667
WHATSAPP_NUMBER=+250781102667
NEON_BRANCH=production
NEON_BRANCH_ID=br-flat-wind-bex5f4n5
```

### ONEFOCUS ADMIN (apps/admin)
Required environment variables (add in Vercel dashboard):

```
DATABASE_URL=<new_neon_pooled_connection_string>
DATABASE_URL_UNPOOLED=<new_neon_direct_connection_string>
NEXTAUTH_SECRET=<generated_secret_from_step_2>
NEXTAUTH_URL=https://admin.onefocusafrica.com
NEXT_PUBLIC_SITE_URL=https://admin.onefocusafrica.com
NEXT_PUBLIC_SITE_NAME=ONEFOCUS AFRICA Admin
BLOB_READ_WRITE_TOKEN=<vercel_blob_token>
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=onefocusafrica@gmail.com
SMTP_PASS=<new_app_password>
SMTP_FROM=onefocusafrica@gmail.com
CONTACT_EMAIL=onefocusafrica@gmail.com
CONTACT_PHONE=+250 781 102 667
WHATSAPP_NUMBER=+250781102667
NEON_BRANCH=production
NEON_BRANCH_ID=br-flat-wind-bex5f4n5
```

## Admin User Creation

**NEVER** use the removed `/api/create-admin` endpoint in production.

### Secure Admin Creation Method

Use the local script with environment variables:

```bash
# Set credentials in terminal (not in files)
export ADMIN_NAME="Your Name"
export ADMIN_EMAIL="your-email@example.com"
export ADMIN_PASSWORD="strong-password-here"
export DATABASE_URL="<new_production_database_url>"

# Run the secure creation script
npm run db:generate
node packages/database/scripts/create-admin.js
```

The script will:
1. Connect to production database
2. Hash the password with bcrypt
3. Create the admin user
4. Exit without exposing credentials

## Verification Checklist

- [ ] Neon database password rotated
- [ ] All .env files updated locally with new credentials
- [ ] New NEXTAUTH_SECRET generated
- [ ] Vercel environment variables configured for both projects
- [ ] Gmail app password rotated (if used)
- [ ] Admin user created using secure script
- [ ] Old credentials invalidated
- [ ] .env files remain in .gitignore
- [ ] No credentials in git history of main branch

## Additional Security Measures

### Rate Limiting
Already implemented in apps/admin/lib/auth.ts:
- 5 failed login attempts per 15 minutes per IP
- In-memory storage (suitable for single Vercel instance)

### Session Security
- JWT strategy with 8-hour expiration
- Secure session cookies in production
- HTTP-only, SameSite=Lax

### API Protection
All admin API routes require authentication via NextAuth session check.

### HTTPS
Automatically enforced by Vercel on custom domains.

---

**DO NOT DEPLOY TO PRODUCTION UNTIL ALL CREDENTIALS ARE ROTATED**
