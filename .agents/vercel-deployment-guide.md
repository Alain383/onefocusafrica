# Vercel Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying ONEFOCUS AFRICA to production using Vercel's platform.

**Repository:** https://github.com/Alain383/onefocusafrica  
**Architecture:** Monorepo with two independent Next.js applications  
**Deployment Strategy:** Two separate Vercel projects

---

## Project Configuration

### Project 1: ONEFOCUS WEB (Public Website)

- **Name:** onefocus-web
- **Root Directory:** `apps/web`
- **Framework:** Next.js
- **Domain:** https://onefocusafrica.co
- **Build Config:** `apps/web/vercel.json`

### Project 2: ONEFOCUS ADMIN (Admin Dashboard)

- **Name:** onefocus-admin
- **Root Directory:** `apps/admin`
- **Framework:** Next.js
- **Domain:** https://admin.onefocusafrica.co
- **Build Config:** `apps/admin/vercel.json`

---

## Prerequisites

Before starting deployment, ensure:

- [ ] GitHub repository accessible: https://github.com/Alain383/onefocusafrica
- [ ] Vercel account created and authenticated
- [ ] Neon PostgreSQL database provisioned with rotated credentials
- [ ] All security fixes completed (see security audit report)
- [ ] Compromised admin accounts disabled
- [ ] New secure admin account created
- [ ] Both apps verified to build successfully locally

---

## Phase 1: Initial Vercel Setup

### Step 1: Import Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Select "Import Git Repository"
4. Choose GitHub and authorize Vercel (if first time)
5. Select repository: `Alain383/onefocusafrica`
6. **Do not click "Deploy" yet** - we need to configure the project first

---

## Phase 2: Deploy ONEFOCUS WEB

### Step 2.1: Configure Web Project

In the import configuration screen:

**Project Settings:**
- **Project Name:** `onefocus-web` (or your preference)
- **Framework Preset:** Next.js
- **Root Directory:** `apps/web` ← **CRITICAL: Must be set**
- **Build Command:** (leave blank - uses vercel.json)
- **Output Directory:** (leave blank - uses vercel.json)
- **Install Command:** (leave blank - uses vercel.json)

**Environment Variables:**

Click "Add" for each variable from the [production environment checklist](.agents/production-env-checklist.md):

```
DATABASE_URL = [Your Neon connection string]
NEXT_PUBLIC_SITE_URL = https://onefocusafrica.co
RESEND_API_KEY = [Your Resend API key]
RESEND_FROM_EMAIL = noreply@onefocusafrica.co
RESEND_INQUIRY_RECIPIENT = inquiries@onefocusafrica.co
BLOB_READ_WRITE_TOKEN = [Will set after creating Blob Store]
```

**Environment Scope:**
- Select: **Production, Preview, Development** (or Production only)

### Step 2.2: Deploy Web Project

1. Click "Deploy"
2. Wait for build to complete (5-10 minutes)
3. Monitor build logs for errors

**Expected Result:**
- ✅ Build succeeds with status "Ready"
- ✅ Vercel provides a preview URL: `onefocus-web-xxx.vercel.app`
- ✅ Preview site loads correctly

**If Build Fails:**
- Check build logs for specific error
- Verify all environment variables are set correctly
- Confirm root directory is set to `apps/web`
- Review [build verification report](.agents/build-verification-report.md)

---

## Phase 3: Deploy ONEFOCUS ADMIN

### Step 3.1: Create Second Project

1. Return to Vercel Dashboard
2. Click "Add New..." → "Project"
3. Select "Import Git Repository" again
4. Choose the **same** repository: `Alain383/onefocusafrica`

**Note:** Vercel allows multiple projects from the same repository using different root directories.

### Step 3.2: Configure Admin Project

**Project Settings:**
- **Project Name:** `onefocus-admin` (or your preference)
- **Framework Preset:** Next.js
- **Root Directory:** `apps/admin` ← **CRITICAL: Must be set**
- **Build Command:** (leave blank - uses vercel.json)
- **Output Directory:** (leave blank - uses vercel.json)
- **Install Command:** (leave blank - uses vercel.json)

**Environment Variables:**

Add variables from the [production environment checklist](.agents/production-env-checklist.md):

```
DATABASE_URL = [Same Neon connection string as web project]
NEXT_PUBLIC_SITE_URL = https://admin.onefocusafrica.co
NEXTAUTH_URL = https://admin.onefocusafrica.co
NEXTAUTH_SECRET = [Use newly generated secret from security audit report]
BLOB_READ_WRITE_TOKEN = [Will set after creating Blob Store]
```

**⚠️ CRITICAL:** Ensure `DATABASE_URL` is **identical** to the web project (shared database).

### Step 3.3: Deploy Admin Project

1. Click "Deploy"
2. Wait for build to complete (5-10 minutes)
3. Monitor build logs for errors

**Expected Result:**
- ✅ Build succeeds with status "Ready"
- ✅ Vercel provides a preview URL: `onefocus-admin-xxx.vercel.app`
- ✅ Can access login page at preview URL

**If Build Fails:**
- Verify NEXTAUTH_URL and NEXTAUTH_SECRET are set
- Confirm root directory is set to `apps/admin`
- Check build logs for missing dependencies
- Review [security audit report](.agents/security-audit-report.md)

---

## Phase 4: Configure Vercel Blob Storage

### Step 4.1: Create Blob Store

1. In Vercel Dashboard, navigate to: **Storage** tab
2. Click "Create Database" → Select "Blob"
3. Configure store:
   - **Name:** `onefocus-media` (or your preference)
   - **Region:** Choose closest to your Neon database region
4. Click "Create"

### Step 4.2: Connect Blob Store to Projects

1. After creation, click on the Blob Store name
2. Go to **Settings** tab
3. Under "Connected Projects", click "Connect Project"
4. Select **onefocus-web** from dropdown
5. Click "Connect"
6. Repeat to connect **onefocus-admin**

**Both projects must be connected to the same Blob Store.**

### Step 4.3: Copy Blob Token

1. In the Blob Store settings, locate "Token"
2. Click "Show" to reveal the token
3. Copy the `BLOB_READ_WRITE_TOKEN` value

### Step 4.4: Update Environment Variables

#### For onefocus-web:

1. Go to **onefocus-web** project → Settings → Environment Variables
2. Find `BLOB_READ_WRITE_TOKEN`
3. Click "Edit" and paste the token
4. Save changes

#### For onefocus-admin:

1. Go to **onefocus-admin** project → Settings → Environment Variables
2. Find `BLOB_READ_WRITE_TOKEN`
3. Click "Edit" and paste the token
4. Save changes

### Step 4.5: Redeploy Both Projects

After updating the Blob token:

1. Go to **onefocus-web** → Deployments tab
2. Click "..." menu on latest deployment → "Redeploy"
3. Confirm redeployment
4. Repeat for **onefocus-admin**

**Expected Result:**
- ✅ Both projects rebuild successfully
- ✅ Blob token now available at runtime
- ✅ Media upload functionality will work

---

## Phase 5: Configure Custom Domains

### Step 5.1: Add Domain to ONEFOCUS WEB

1. Go to **onefocus-web** project → Settings → Domains
2. Click "Add Domain"
3. Enter: `onefocusafrica.co`
4. Click "Add"

**Vercel will display required DNS records:**
- Type: CNAME or A record
- Target: Vercel's DNS endpoint

**Copy these exact values** - you'll need them for Hostinger DNS configuration.

### Step 5.2: Add Domain to ONEFOCUS ADMIN

1. Go to **onefocus-admin** project → Settings → Domains
2. Click "Add Domain"
3. Enter: `admin.onefocusafrica.co`
4. Click "Add"

**Vercel will display required DNS records:**
- Type: CNAME
- Name: `admin`
- Target: Vercel's DNS endpoint

### Step 5.3: Configure DNS in Hostinger

**⚠️ STOP: Do not proceed until you have copied the exact DNS targets from Vercel.**

Follow the detailed DNS configuration guide:

📄 **[Hostinger DNS Setup Guide](.agents/hostinger-dns-setup.md)**

**Key steps:**
1. Log in to Hostinger control panel
2. Navigate to DNS management for `onefocusafrica.co`
3. Add CNAME/A records as specified by Vercel
4. **Do not modify existing email DNS records**
5. Save changes and wait for propagation (5-30 minutes)

### Step 5.4: Verify Domain Configuration

After DNS propagates:

1. Return to Vercel Dashboard → onefocus-web → Settings → Domains
2. Status should change to: ✅ **Valid Configuration**
3. SSL certificate should auto-provision (5-15 minutes)
4. Repeat verification for onefocus-admin

**Expected Result:**
- ✅ Both domains show "Valid Configuration"
- ✅ SSL certificates active
- ✅ Can access https://onefocusafrica.co (no browser warnings)
- ✅ Can access https://admin.onefocusafrica.co (no browser warnings)

---

## Phase 6: Production Verification

### Step 6.1: Run Post-Deployment Checklist

After DNS and SSL are working, complete all verification tests:

📄 **[Post-Deployment Checklist](.agents/post-deployment-checklist.md)**

**Critical tests:**
1. Both apps build successfully ✅
2. Admin login works ✅
3. Image uploads work ✅
4. Blog publishing works ✅
5. Published articles appear on public site ✅
6. Images persist after redeployment ✅
7. Contact forms work ✅
8. Protected routes secured ✅
9. Apps work independently ✅

**Do not announce the site as live until all tests pass.**

### Step 6.2: Monitor Initial Traffic

After verification:

1. Enable Vercel Analytics (optional):
   - Go to each project → Analytics tab
   - Click "Enable Analytics"
2. Monitor Vercel Logs:
   - Dashboard → [Project] → Logs
   - Watch for errors in first 24 hours
3. Set up alerts (optional):
   - Configure email notifications for deployment failures
   - Set up uptime monitoring (Vercel Pro feature or external tool)

---

## Phase 7: Post-Deployment Tasks

### Step 7.1: Security Verification

- [ ] Confirm no default admin passwords in use
- [ ] Verify all compromised accounts disabled
- [ ] Test that unauthenticated users cannot access /admin routes
- [ ] Test that /api/admin/* endpoints require authentication
- [ ] Review Vercel logs for unauthorized access attempts

### Step 7.2: Performance Optimization

- [ ] Verify Next.js Image optimization working (check network tab)
- [ ] Confirm static pages cached correctly
- [ ] Test page load times from different regions
- [ ] Run Lighthouse audit on key pages

### Step 7.3: Documentation Updates

- [ ] Update README.md with production URLs
- [ ] Document any deployment issues encountered
- [ ] Create runbook for common issues
- [ ] Save deployment credentials securely (1Password, etc.)

### Step 7.4: Team Access

If multiple team members need access:

1. Go to Vercel Dashboard → Settings → Members
2. Invite team members with appropriate roles:
   - **Admin:** Full access
   - **Member:** Deploy and view logs
   - **Viewer:** View only
3. Document who has access and their roles

---

## Troubleshooting

### Build Fails: "Cannot find module '@onefocus/database'"

**Cause:** Monorepo workspace dependencies not resolved

**Solution:**
1. Verify `package.json` in root has `workspaces` defined
2. Check Vercel build command uses `npm install` (not `npm ci`)
3. Confirm vercel.json `installCommand` set correctly

### Build Fails: "Prisma Client not generated"

**Cause:** Prisma generate step missing

**Solution:**
- Verify vercel.json `buildCommand` includes:
  ```
  npx prisma generate --schema=packages/database/prisma/schema.prisma
  ```
- This should already be configured in existing vercel.json files

### SSL Certificate Not Provisioning

**Cause:** DNS not fully propagated or CAA records blocking Let's Encrypt

**Solution:**
1. Wait 15-30 minutes after DNS changes
2. Check DNS propagation: https://dnschecker.org
3. Verify no CAA records in Hostinger DNS that block Let's Encrypt
4. Click "Refresh" in Vercel domain settings

### Images Not Loading: "Failed to load resource"

**Cause:** BLOB_READ_WRITE_TOKEN not set or Blob Store not connected

**Solution:**
1. Verify token set in **both** projects' environment variables
2. Confirm Blob Store connected to both projects
3. Check Next.js `remotePatterns` includes blob domain
4. Redeploy both projects after token update

### Admin Login Fails: "Invalid callback URL"

**Cause:** NEXTAUTH_URL mismatch

**Solution:**
1. Verify `NEXTAUTH_URL=https://admin.onefocusafrica.co` (no trailing slash)
2. Confirm it matches the actual domain configured in Vercel
3. Check for typos (admin. vs www. etc.)
4. Redeploy after fixing environment variable

### Database Connection Errors

**Cause:** Invalid DATABASE_URL or Neon database paused

**Solution:**
1. Verify DATABASE_URL format includes `?sslmode=require`
2. Check Neon Dashboard - database should be "Active"
3. Test connection string locally before deploying
4. Ensure connection pooling enabled in Neon

### "Deployment Failed" with No Specific Error

**Cause:** Vercel platform issue or account limits

**Solution:**
1. Check Vercel Status Page: https://vercel.com/status
2. Verify account not hitting limits (builds, bandwidth)
3. Try redeploying after 5-10 minutes
4. Contact Vercel support if persistent

---

## Rollback Procedure

If deployment causes critical issues:

### Option 1: Rollback to Previous Deployment

1. Go to Vercel Dashboard → [Project] → Deployments
2. Find the last known-good deployment
3. Click "..." menu → "Promote to Production"
4. Confirm promotion

**Effect:** Instantly rolls back to previous version

### Option 2: Disable Domain Temporarily

1. Go to Settings → Domains
2. Click "..." on problematic domain → "Remove"
3. Fix issues in code
4. Redeploy
5. Re-add domain when ready

**Effect:** Takes site offline while you fix issues

### Option 3: Emergency Maintenance Page

1. Create static maintenance.html page
2. Deploy to separate simple Vercel project
3. Update DNS to point to maintenance page
4. Fix issues in main projects
5. Restore DNS to main projects when ready

---

## Deployment Checklist Summary

Use this quick checklist for future deployments:

- [ ] Security audit completed
- [ ] Local builds verified for both apps
- [ ] Credentials rotated (DATABASE_URL, NEXTAUTH_SECRET)
- [ ] Vercel account ready
- [ ] Repository accessible
- [ ] **Phase 1:** Repository imported
- [ ] **Phase 2:** Web project deployed with environment variables
- [ ] **Phase 3:** Admin project deployed with environment variables
- [ ] **Phase 4:** Blob Storage created and connected to both projects
- [ ] **Phase 5:** Custom domains configured in Vercel
- [ ] **Phase 5:** DNS records added in Hostinger
- [ ] **Phase 5:** SSL certificates provisioned
- [ ] **Phase 6:** Post-deployment checklist completed
- [ ] **Phase 7:** Team access configured
- [ ] **Phase 7:** Monitoring enabled

---

## Reference Documentation

- **Environment Variables:** `.agents/production-env-checklist.md`
- **DNS Configuration:** `.agents/hostinger-dns-setup.md`
- **Post-Deployment Tests:** `.agents/post-deployment-checklist.md`
- **Security Audit:** `.agents/security-audit-report.md`
- **Blob Migration:** `.agents/blob-migration-guide.md`
- **Database Verification:** `.agents/database-verification-report.md`

---

## Support Resources

- **Vercel Documentation:** https://vercel.com/docs
- **Vercel Support:** https://vercel.com/support
- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **Neon Documentation:** https://neon.tech/docs

---

## Final Notes

**⚠️ IMPORTANT:** The website is **NOT LIVE** until:
1. All deployment phases completed
2. DNS fully propagated
3. SSL certificates active
4. Post-deployment checklist passes all tests

**After successful deployment:**
- Save all production credentials securely
- Document any custom configurations
- Schedule 1-week post-launch review
- Set up ongoing maintenance schedule

**Questions or issues?** Review troubleshooting section above or contact Vercel support.
