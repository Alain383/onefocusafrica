# Vercel Environment Variables Setup Guide

## Critical: Environment Variables Must Be Set Before Build Succeeds

The build that just failed needs these environment variables configured in Vercel.

---

## Required Environment Variables

### For Both Services (web and admin)

Add these in Vercel Project Settings → Environment Variables:

#### 1. Database Connection (REQUIRED)
```
DATABASE_URL
```
**Value:** Your Neon PostgreSQL connection string (pooled)
```
postgresql://username:password@hostname/database?sslmode=require
```

**Where to find it:**
- Go to Neon Console → Your Project → Connection Details
- Copy the "Pooled Connection" string
- **⚠️ IMPORTANT:** Use production credentials, not development

---

#### 2. Site URL (REQUIRED)

**For Web Service:**
```
NEXT_PUBLIC_SITE_URL=https://onefocusafrica.co
```

**For Admin Service:**
```
NEXT_PUBLIC_SITE_URL=https://admin.onefocusafrica.co
NEXTAUTH_URL=https://admin.onefocusafrica.co
```

---

#### 3. NextAuth Secret (Admin Service ONLY)

```
NEXTAUTH_SECRET
```
**Value:** Generate a secure random string
```bash
# On your local machine:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**⚠️ CRITICAL:** Do NOT use the same secret from development. Generate a new one for production.

---

#### 4. Email Configuration (Optional - for contact forms)

**For Web Service:**
```
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@onefocusafrica.co
RESEND_INQUIRY_RECIPIENT=inquiries@onefocusafrica.co
```

**Where to get:**
- Sign up at https://resend.com
- Verify your domain
- Generate API key

---

#### 5. Vercel Blob Storage (Will be added after first deployment)

```
BLOB_READ_WRITE_TOKEN
```

**Note:** This will be automatically added when you create and connect a Vercel Blob Store. Leave this for Phase 4 of deployment.

---

## How to Add Environment Variables in Vercel

### Step 1: Access Project Settings

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project name
3. Click **Settings** tab
4. Click **Environment Variables** in the left sidebar

### Step 2: Add Each Variable

For each variable:

1. Click **Add New** button
2. **Key:** Enter the variable name (e.g., `DATABASE_URL`)
3. **Value:** Paste the value
4. **Environment:** Select which environments need this variable:
   - ✅ **Production** (always)
   - ✅ **Preview** (recommended)
   - ✅ **Development** (optional)
5. Click **Save**

### Step 3: Trigger Rebuild

After adding ALL required variables:

1. Go to **Deployments** tab
2. Click **"Redeploy"** button on the latest deployment
3. Confirm redeployment
4. Monitor build logs

---

## Environment Variable Checklist

### Minimum Required (Build Will Fail Without These):

- [ ] `DATABASE_URL` (both services)
- [ ] `NEXT_PUBLIC_SITE_URL` (both services)
- [ ] `NEXTAUTH_URL` (admin only)
- [ ] `NEXTAUTH_SECRET` (admin only)

### Optional (Features Will Be Disabled):

- [ ] `RESEND_API_KEY` (email functionality)
- [ ] `RESEND_FROM_EMAIL` (email functionality)
- [ ] `RESEND_INQUIRY_RECIPIENT` (email functionality)
- [ ] `BLOB_READ_WRITE_TOKEN` (media uploads - add after Phase 4)

---

## Troubleshooting

### Build Still Fails After Adding DATABASE_URL

**Check:**
1. DATABASE_URL format includes `?sslmode=require`
2. No extra spaces or quotes in the value
3. Database is Active in Neon (not paused)
4. Variable is set for "Production" environment

### "Environment variable not found: NEXTAUTH_SECRET"

**Admin service needs:**
- `NEXTAUTH_SECRET` value
- `NEXTAUTH_URL` matching your domain

### Email Features Not Working

**Optional - can skip initially:**
- Contact forms will show error if Resend vars not set
- Can add these after initial deployment succeeds

---

## Security Best Practices

### ✅ DO:
- Use different credentials for production vs development
- Generate new NEXTAUTH_SECRET for production
- Rotate DATABASE_URL if it was ever committed to git
- Store credentials in password manager

### ❌ DON'T:
- Copy production credentials to public repositories
- Share environment variables via chat/email
- Use development credentials in production
- Commit `.env.local` files to git

---

## Next Steps After Adding Variables

1. **Add all minimum required variables** (checklist above)
2. **Trigger redeploy** in Vercel
3. **Monitor build logs** - should succeed this time
4. **Verify deployment** works at preview URL
5. **Continue to Phase 4** (Vercel Blob Storage setup)

---

## Quick Reference: Variable Scope

| Variable | Web Service | Admin Service | Notes |
|----------|-------------|---------------|-------|
| DATABASE_URL | ✅ Required | ✅ Required | Same value for both |
| NEXT_PUBLIC_SITE_URL | ✅ Required | ✅ Required | Different domains |
| NEXTAUTH_URL | ❌ Not needed | ✅ Required | Admin only |
| NEXTAUTH_SECRET | ❌ Not needed | ✅ Required | Admin only |
| RESEND_API_KEY | ✅ Optional | ❌ Not needed | Email only |
| RESEND_FROM_EMAIL | ✅ Optional | ❌ Not needed | Email only |
| RESEND_INQUIRY_RECIPIENT | ✅ Optional | ❌ Not needed | Email only |
| BLOB_READ_WRITE_TOKEN | ✅ Phase 4 | ✅ Phase 4 | Added later |

---

## Production Environment Values Template

Save this template and fill in the values:

```env
# ===================================
# PRODUCTION ENVIRONMENT VARIABLES
# ===================================

# Database (BOTH services - same value)
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"

# Web Service URLs
NEXT_PUBLIC_SITE_URL="https://onefocusafrica.co"

# Admin Service URLs & Auth
NEXT_PUBLIC_SITE_URL="https://admin.onefocusafrica.co"
NEXTAUTH_URL="https://admin.onefocusafrica.co"
NEXTAUTH_SECRET="[generate new secure secret]"

# Email (Optional - Web Service)
RESEND_API_KEY="re_xxxxxxxxxxxx"
RESEND_FROM_EMAIL="noreply@onefocusafrica.co"
RESEND_INQUIRY_RECIPIENT="inquiries@onefocusafrica.co"

# Blob Storage (Added in Phase 4)
BLOB_READ_WRITE_TOKEN="[will be auto-added]"
```

---

## Support

If build continues to fail after adding variables:
1. Check build logs for specific error
2. Verify variable names match exactly (case-sensitive)
3. Ensure no typos in DATABASE_URL format
4. Contact Vercel support if persistent issues
