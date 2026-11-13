# Production Environment Variables Checklist

## Overview

This checklist documents all required environment variables for deploying ONEFOCUS AFRICA to Vercel production.

**⚠️ SECURITY WARNING:** Never commit actual credentials to version control. Use Vercel's environment variable dashboard to set production values securely.

---

## Project 1: ONEFOCUS WEB (apps/web)

**Domain:** https://onefocusafrica.co

### Required Environment Variables

#### 1. Database Connection

```
DATABASE_URL="PLACEHOLDER_NEON_POSTGRES_CONNECTION_STRING"
```

**Source:** Neon Dashboard → Connection String  
**Format:** `postgresql://user:password@host:5432/database?sslmode=require`  
**Security:** Rotate this value before production deployment (see security audit report)

#### 2. Site Configuration

```
NEXT_PUBLIC_SITE_URL="https://onefocusafrica.co"
```

**Note:** This is public (exposed to browser) and must match your production domain

#### 3. Email Configuration (Resend)

```
RESEND_API_KEY="PLACEHOLDER_RESEND_API_KEY"
RESEND_FROM_EMAIL="noreply@onefocusafrica.co"
RESEND_INQUIRY_RECIPIENT="inquiries@onefocusafrica.co"
```

**Source:** Resend Dashboard → API Keys  
**Purpose:** Contact form notifications and inquiry handling

#### 4. Vercel Blob Storage

```
BLOB_READ_WRITE_TOKEN="PLACEHOLDER_VERCEL_BLOB_TOKEN"
```

**Source:** Vercel Dashboard → Storage → Blob → [Your Store] → Token  
**Purpose:** Access to production media uploads (images display)  
**Required:** Yes, even for read-only web app to display uploaded images

---

## Project 2: ONEFOCUS ADMIN (apps/admin)

**Domain:** https://admin.onefocusafrica.co

### Required Environment Variables

#### 1. Database Connection

```
DATABASE_URL="PLACEHOLDER_NEON_POSTGRES_CONNECTION_STRING"
```

**Source:** Neon Dashboard → Connection String  
**Format:** `postgresql://user:password@host:5432/database?sslmode=require`  
**Security:** Must be the **same** connection string as apps/web (shared database)  
**Security:** Rotate this value before production deployment (see security audit report)

#### 2. Site Configuration

```
NEXT_PUBLIC_SITE_URL="https://admin.onefocusafrica.co"
```

**Note:** This is public (exposed to browser) and must match your admin domain

#### 3. NextAuth Configuration

```
NEXTAUTH_URL="https://admin.onefocusafrica.co"
NEXTAUTH_SECRET="PLACEHOLDER_NEXTAUTH_SECRET_32_BYTES_BASE64"
```

**NEXTAUTH_URL:** Must match your admin domain exactly  
**NEXTAUTH_SECRET:** Generate using:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Security:** A new NEXTAUTH_SECRET has been generated and documented in the security audit report. Use that value, not any previously exposed secret.

#### 4. Vercel Blob Storage

```
BLOB_READ_WRITE_TOKEN="PLACEHOLDER_VERCEL_BLOB_TOKEN"
```

**Source:** Vercel Dashboard → Storage → Blob → [Your Store] → Token  
**Purpose:** Upload and manage media assets (images, cover photos)  
**Permissions:** Read + Write required for admin uploads

---

## Setup Instructions

### Step 1: Create Vercel Projects

1. Import repository: `https://github.com/Alain383/onefocusafrica`
2. Create **Project 1: onefocus-web**
   - Root Directory: `apps/web`
   - Framework Preset: Next.js
   - Build Command: (uses vercel.json)
   - Output Directory: (uses vercel.json)
3. Create **Project 2: onefocus-admin**
   - Root Directory: `apps/admin`
   - Framework Preset: Next.js
   - Build Command: (uses vercel.json)
   - Output Directory: (uses vercel.json)

### Step 2: Create Vercel Blob Store

1. In Vercel Dashboard → Storage → Blob
2. Click "Create Blob Store"
3. Name: `onefocus-media` (or your preferred name)
4. Connect to **both** projects (onefocus-web AND onefocus-admin)
5. Copy the `BLOB_READ_WRITE_TOKEN` from the store settings

### Step 3: Set Environment Variables

#### For onefocus-web:

Navigate to: **Project Settings → Environment Variables**

Add each variable from the "ONEFOCUS WEB" section above:
- Set for: Production, Preview, Development (or Production only)
- Replace all PLACEHOLDER values with actual credentials

#### For onefocus-admin:

Navigate to: **Project Settings → Environment Variables**

Add each variable from the "ONEFOCUS ADMIN" section above:
- Set for: Production, Preview, Development (or Production only)
- Replace all PLACEHOLDER values with actual credentials

### Step 4: Verify Shared Database

Confirm that both projects use the **exact same** `DATABASE_URL` value. This is critical for data consistency between the public website and admin dashboard.

### Step 5: Redeploy

After setting all environment variables:
1. Trigger redeployment for both projects
2. Verify builds succeed
3. Proceed to DNS configuration

---

## Security Checklist

Before setting production environment variables:

- [ ] Database credentials rotated (see security audit report)
- [ ] New NEXTAUTH_SECRET generated (never reuse exposed secrets)
- [ ] All compromised admin accounts disabled
- [ ] New secure admin account created via approved script
- [ ] No default passwords in use
- [ ] BLOB_READ_WRITE_TOKEN obtained from Vercel (never hardcode)
- [ ] RESEND_API_KEY obtained from Resend Dashboard
- [ ] All placeholder values replaced with actual credentials
- [ ] Credentials stored only in Vercel environment variables (not in code)

---

## Troubleshooting

### Build Fails with "BLOB_READ_WRITE_TOKEN is not defined"

**Solution:** Blob token must be set in both projects' environment variables, even if web app only reads. Vercel Blob SDK requires the token at build time.

### Admin login fails with "Invalid callback URL"

**Solution:** Verify `NEXTAUTH_URL` exactly matches your admin domain (https://admin.onefocusafrica.co, no trailing slash).

### Images fail to load after deployment

**Solution:** 
1. Verify Blob Store is connected to both projects
2. Confirm `BLOB_READ_WRITE_TOKEN` is set in both projects
3. Check Next.js remote image domains include `**.public.blob.vercel-storage.com`

### Database connection errors

**Solution:**
1. Verify DATABASE_URL format includes `?sslmode=require`
2. Confirm both projects use the same connection string
3. Check Neon database is not paused (connection pooler active)

---

## Reference Documentation

- **Security Audit Report:** `.agents/security-audit-report.md`
- **Vercel Blob Migration:** `.agents/blob-migration-guide.md`
- **Database Verification:** `.agents/database-verification-report.md`
- **DNS Setup Guide:** `.agents/hostinger-dns-setup.md`
- **Deployment Guide:** `.agents/vercel-deployment-guide.md`
