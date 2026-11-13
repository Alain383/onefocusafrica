# ONEFOCUS AFRICA — Two Separate Vercel Projects Deployment Guide

## Deployment Architecture: Option A (CONFIRMED)

**Repository:** https://github.com/Alain383/onefocusafrica  
**DNS Provider:** Hostinger  
**Domain:** onefocusafrica.co

### Project 1: ONEFOCUS WEB (Public Website)
- **Root Directory:** `apps/web`
- **Production Domain:** `onefocusafrica.co`
- **WWW Alias:** `www.onefocusafrica.co`
- **Purpose:** Public website, services, blog, portfolio, customer inquiries

### Project 2: ONEFOCUS ADMIN (Admin Dashboard)
- **Root Directory:** `apps/admin`
- **Production Domain:** `admin.onefocusafrica.co`
- **Purpose:** Secure content management and business operations

---

## ✅ PRE-DEPLOYMENT VERIFICATION COMPLETED

### Security Audit ✅
- [x] Insecure `/api/create-admin` endpoint removed
- [x] `scripts/seed-admin.ts` deleted (exposed default passwords)
- [x] `scripts/check-admin.ts` deleted (exposed credentials)
- [x] `ADMIN-FIX.js` deleted (hardcoded credentials)
- [x] Only secure CLI script remains: `packages/database/scripts/create-admin.js`

### Build Verification ✅
- [x] **Web app builds successfully** (Exit 0, 18 routes, 0 errors)
- [x] **Admin app builds successfully** (Exit 0, 23 routes, 0 errors)
- [x] Blog routes handle missing DATABASE_URL during build
- [x] Monorepo workspace packages working
- [x] Prisma generates correctly

### Configuration ✅
- [x] Root `vercel.json` removed (was multi-service, not needed)
- [x] `apps/web/vercel.json` configured for independent deployment
- [x] `apps/admin/vercel.json` configured for independent deployment
- [x] Enhanced security headers added
- [x] NextAuth v5 environment variables documented (`AUTH_SECRET`)

---

## DEPLOYMENT PHASES

## PHASE 1: Deploy ONEFOCUS WEB (Public Website)

### Step 1.1: Import Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Select **"Import Git Repository"**
4. Choose **GitHub** and authorize Vercel (if first time)
5. Select repository: **`Alain383/onefocusafrica`**
6. ⚠️ **DO NOT click "Deploy" yet**

### Step 1.2: Configure Web Project

**Project Settings:**
- **Project Name:** `onefocus-web` (or your preference)
- **Framework Preset:** Next.js
- **Root Directory:** `apps/web` ← **CRITICAL**
- **Build Command:** (leave default - uses vercel.json)
- **Output Directory:** (leave default - uses vercel.json)
- **Install Command:** (leave default - uses vercel.json)

### Step 1.3: Add Environment Variables (Web)

Click **"Add"** for each variable:

#### Required Variables:
```
DATABASE_URL
```
**Value:** Your Neon PostgreSQL pooled connection string
```
postgresql://username:password@hostname/database?sslmode=require
```
**⚠️ IMPORTANT:** Use PRODUCTION credentials (not development)

```
NEXT_PUBLIC_SITE_URL=https://onefocusafrica.co
```

#### Optional (Email functionality):
```
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@onefocusafrica.co
RESEND_INQUIRY_RECIPIENT=inquiries@onefocusafrica.co
```

**Environment Scope:** Select **Production, Preview, Development** (or Production only)

### Step 1.4: Deploy Web Project

1. Click **"Deploy"**
2. Wait 5-10 minutes for build
3. Monitor build logs for errors

**Expected Result:**
- ✅ Build succeeds
- ✅ Vercel provides preview URL: `onefocus-web-xxx.vercel.app`
- ✅ Preview site loads correctly

**If build fails:**
- Verify `DATABASE_URL` is set correctly
- Confirm `Root Directory` is `apps/web`
- Check build logs for specific error

---

## PHASE 2: Deploy ONEFOCUS ADMIN (Admin Dashboard)

### Step 2.1: Import Repository Again

1. Return to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Select **"Import Git Repository"**
4. Choose the **SAME** repository: **`Alain383/onefocusafrica`**

**Note:** Vercel allows multiple projects from the same repository using different root directories.

### Step 2.2: Configure Admin Project

**Project Settings:**
- **Project Name:** `onefocus-admin` (or your preference)
- **Framework Preset:** Next.js
- **Root Directory:** `apps/admin` ← **CRITICAL**
- **Build Command:** (leave default - uses vercel.json)
- **Output Directory:** (leave default - uses vercel.json)
- **Install Command:** (leave default - uses vercel.json)

### Step 2.3: Add Environment Variables (Admin)

Click **"Add"** for each variable:

#### Required Variables:
```
DATABASE_URL
```
**Value:** Same Neon connection string as web project (shared database)
```
postgresql://username:password@hostname/database?sslmode=require
```

```
NEXT_PUBLIC_SITE_URL=https://admin.onefocusafrica.co
```

```
NEXTAUTH_URL=https://admin.onefocusafrica.co
```

```
AUTH_SECRET
```
**Value:** Generate a new secure secret:
```bash
# On your local machine (Git Bash, WSL, or Node.js):
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Or using OpenSSL:
openssl rand -base64 32
```
**⚠️ CRITICAL:** 
- Generate a NEW secret for production
- Do NOT use development secrets
- Do NOT commit this secret to GitHub
- Save it securely (1Password, etc.)

**Note:** NextAuth v5 uses `AUTH_SECRET` (not `NEXTAUTH_SECRET`). Both are supported for backward compatibility.

**Environment Scope:** Select **Production, Preview, Development** (or Production only)

### Step 2.4: Deploy Admin Project

1. Click **"Deploy"**
2. Wait 5-10 minutes for build
3. Monitor build logs for errors

**Expected Result:**
- ✅ Build succeeds
- ✅ Vercel provides preview URL: `onefocus-admin-xxx.vercel.app`
- ✅ Login page loads at preview URL

**If build fails:**
- Verify `AUTH_SECRET` and `NEXTAUTH_URL` are set
- Confirm `Root Directory` is `apps/admin`
- Check that `DATABASE_URL` is identical to web project

---

## PHASE 3: Configure Vercel Blob Storage

### Step 3.1: Create Blob Store

1. In Vercel Dashboard, click **Storage** tab (top navigation)
2. Click **"Create Database"** → Select **"Blob"**
3. Configure:
   - **Name:** `onefocus-media` (or your preference)
   - **Region:** Choose closest to your Neon database region
4. Click **"Create"**

### Step 3.2: Connect Blob Store to Both Projects

1. After creation, click on the Blob Store name
2. Go to **Settings** tab
3. Under **"Connected Projects"**, click **"Connect Project"**
4. Select **`onefocus-web`** from dropdown
5. Click **"Connect"**
6. Click **"Connect Project"** again
7. Select **`onefocus-admin`** from dropdown
8. Click **"Connect"**

**⚠️ BOTH projects must be connected to the SAME Blob Store**

### Step 3.3: Verify Blob Token Added

After connecting:
1. Go to **onefocus-admin** → Settings → Environment Variables
2. Verify `BLOB_READ_WRITE_TOKEN` was automatically added
3. Go to **onefocus-web** → Settings → Environment Variables
4. Verify `BLOB_READ_WRITE_TOKEN` was automatically added

**If token not auto-added:**
1. In Blob Store settings, locate **"Token"**
2. Click **"Show"** to reveal token
3. Manually add `BLOB_READ_WRITE_TOKEN` to both projects

### Step 3.4: Redeploy Both Projects

After Blob token is added:

**Redeploy Web:**
1. Go to **onefocus-web** → Deployments tab
2. Click **"..."** menu on latest deployment → **"Redeploy"**
3. Confirm

**Redeploy Admin:**
1. Go to **onefocus-admin** → Deployments tab
2. Click **"..."** menu on latest deployment → **"Redeploy"**
3. Confirm

**Both will rebuild with Blob storage enabled**

---

## PHASE 4: Test Preview Deployments

### Step 4.1: Test Web Preview

Visit: `https://onefocus-web-xxx.vercel.app`

**Test checklist:**
- [ ] Homepage loads
- [ ] Navigation works
- [ ] Blog page loads
- [ ] Blog articles load (if any published)
- [ ] Portfolio page loads
- [ ] Contact form loads
- [ ] No console errors

### Step 4.2: Test Admin Preview

Visit: `https://onefocus-admin-xxx.vercel.app/admin/login`

**Test checklist:**
- [ ] Login page loads
- [ ] Cannot access `/admin` without login (redirects to login)
- [ ] Can navigate to other admin pages after login
- [ ] No console errors

**Note:** You cannot test login yet because no admin user exists. We'll create one after custom domains are configured.

---

## PHASE 5: Configure Custom Domains

### Step 5.1: Add Domain to ONEFOCUS WEB

1. Go to **onefocus-web** project → Settings → **Domains**
2. Click **"Add Domain"**
3. Enter: `onefocusafrica.co`
4. Click **"Add"**
5. Click **"Add Domain"** again
6. Enter: `www.onefocusafrica.co`
7. Click **"Add"**

**Vercel will display required DNS records for BOTH domains**

### Step 5.2: Add Domain to ONEFOCUS ADMIN

1. Go to **onefocus-admin** project → Settings → **Domains**
2. Click **"Add Domain"**
3. Enter: `admin.onefocusafrica.co`
4. Click **"Add"**

**Vercel will display required DNS record**

### Step 5.3: Copy DNS Records from Vercel

**For each domain added, Vercel shows:**

**Example for `onefocusafrica.co`:**
```
Type: A
Name: @
Value: 76.76.21.21
```

**Example for `www.onefocusafrica.co`:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Example for `admin.onefocusafrica.co`:**
```
Type: CNAME
Name: admin
Value: cname.vercel-dns.com
```

**⚠️ COPY THESE EXACT VALUES** - They may differ from examples above

---

## PHASE 6: Configure DNS in Hostinger

### Step 6.1: Access Hostinger DNS Management

1. Log in to [Hostinger Control Panel](https://hpanel.hostinger.com/)
2. Navigate to **Domains** section
3. Find **`onefocusafrica.co`**
4. Click **"Manage"** or **"DNS Zone"**

### Step 6.2: Add DNS Records

**⚠️ IMPORTANT: Do NOT delete existing email DNS records (MX, TXT, SPF, DKIM)**

For each DNS record from Vercel:

#### Record 1: Root Domain (`onefocusafrica.co`)
1. Click **"Add Record"**
2. **Type:** A
3. **Name:** @ (or leave empty for root)
4. **Points to:** [IP from Vercel, e.g., 76.76.21.21]
5. **TTL:** 3600 (or default)
6. Click **"Save"** or **"Add Record"**

#### Record 2: WWW Subdomain (`www.onefocusafrica.co`)
1. Click **"Add Record"**
2. **Type:** CNAME
3. **Name:** www
4. **Points to:** [CNAME from Vercel, e.g., cname.vercel-dns.com]
5. **TTL:** 3600 (or default)
6. Click **"Save"** or **"Add Record"**

#### Record 3: Admin Subdomain (`admin.onefocusafrica.co`)
1. Click **"Add Record"**
2. **Type:** CNAME
3. **Name:** admin
4. **Points to:** [CNAME from Vercel, e.g., cname.vercel-dns.com]
5. **TTL:** 3600 (or default)
6. Click **"Save"** or **"Add Record"**

### Step 6.3: Save and Wait for Propagation

1. Save all changes in Hostinger
2. DNS propagation takes **5-30 minutes** (sometimes up to 48 hours)
3. Check propagation: https://dnschecker.org

**Do NOT proceed until DNS propagates**

---

## PHASE 7: Verify Domain Configuration & SSL

### Step 7.1: Check Domain Status in Vercel

**For onefocus-web:**
1. Go to Settings → Domains
2. Both `onefocusafrica.co` and `www.onefocusafrica.co` should show:
   - ✅ **Valid Configuration**
   - ✅ SSL certificate auto-provisioning (5-15 minutes)

**For onefocus-admin:**
1. Go to Settings → Domains
2. `admin.onefocusafrica.co` should show:
   - ✅ **Valid Configuration**
   - ✅ SSL certificate active

### Step 7.2: Test Production Domains

**Test Web:**
- Visit: https://onefocusafrica.co
- Visit: https://www.onefocusafrica.co (should redirect to non-www or work independently)
- ✅ No browser SSL warnings
- ✅ Site loads correctly

**Test Admin:**
- Visit: https://admin.onefocusafrica.co/admin/login
- ✅ No browser SSL warnings
- ✅ Login page loads

**If "Invalid Configuration":**
- Wait 10-15 more minutes for DNS propagation
- Click **"Refresh"** in Vercel domain settings
- Verify DNS records in Hostinger match Vercel's requirements exactly

---

## PHASE 8: Create Production Admin User

### Step 8.1: Connect to Production Database

From your local machine:

```powershell
# Set environment variables
$env:ADMIN_EMAIL="your-email@onefocusafrica.co"
$env:ADMIN_PASSWORD="[YourSecurePassword123!]"
$env:ADMIN_NAME="Your Name"
$env:DATABASE_URL="postgresql://username:password@hostname/database?sslmode=require"

# Run the secure CLI script
node packages/database/scripts/create-admin.js
```

**⚠️ SECURITY:**
- Use a STRONG password (16+ characters, mixed case, numbers, symbols)
- Save credentials in password manager
- Do NOT use default passwords
- Do NOT commit credentials to GitHub

### Step 8.2: Verify Admin User Created

```powershell
# Using psql or database tool
SELECT email, name, role, "isActive", "createdAt"
FROM "AdminUser"
WHERE email = 'your-email@onefocusafrica.co';
```

**Expected result:**
- User exists
- `isActive` = true
- `role` = 'ADMIN'

---

## PHASE 9: Production Testing

### Step 9.1: Test Admin Login

1. Visit: https://admin.onefocusafrica.co/admin/login
2. Enter admin credentials from Phase 8
3. Click **"Sign In"**

**Expected:**
- ✅ Login succeeds
- ✅ Redirects to `/admin` dashboard
- ✅ Can navigate to all admin pages

**If login fails:**
- Verify user created in database
- Check `AUTH_SECRET` is set in Vercel
- Check `NEXTAUTH_URL` matches domain exactly
- Review browser console and Vercel logs

### Step 9.2: Test Media Upload

1. In admin dashboard, go to **Media** section
2. Click **"Upload"**
3. Select an image file
4. Click **"Upload"** or **"Save"**

**Expected:**
- ✅ Upload succeeds
- ✅ Image appears in media library
- ✅ Image URL starts with `https://` (Vercel Blob)
- ✅ Image loads when clicked

**If upload fails:**
- Verify `BLOB_READ_WRITE_TOKEN` is set in admin project
- Check Vercel Blob Store is connected
- Review Vercel function logs

### Step 9.3: Test Blog Publishing

1. In admin, go to **Blog** → **New Post**
2. Create a test blog post:
   - Title: "Test Post"
   - Content: "This is a test."
   - Status: **Published**
3. Click **"Save"** or **"Publish"**
4. Visit: https://onefocusafrica.co/blog
5. Verify test post appears
6. Click post to view full article

**Expected:**
- ✅ Post saves successfully
- ✅ Post appears on public blog page
- ✅ Post URL works: `https://onefocusafrica.co/blog/test-post`
- ✅ Content displays correctly

**If post doesn't appear:**
- Verify status is "Published" (not "Draft")
- Check both apps use same `DATABASE_URL`
- Review Vercel logs for errors

### Step 9.4: Test Contact Form

1. Visit: https://onefocusafrica.co/contact
2. Fill out contact form with test data
3. Submit form

**Expected:**
- ✅ Form submits successfully
- ✅ Success message appears
- ✅ Inquiry appears in admin dashboard (if configured)

**If Resend email not configured:**
- Form saves to database but doesn't send email
- This is expected if `RESEND_API_KEY` not set

### Step 9.5: Test Image Persistence

1. Trigger a redeployment of admin project:
   - Go to Vercel → onefocus-admin → Deployments
   - Click **"Redeploy"**
2. Wait for deployment to complete
3. Check that uploaded images still load

**Expected:**
- ✅ Images persist after redeployment
- ✅ URLs still work
- ✅ Media library shows all images

**This confirms Vercel Blob is working (not ephemeral filesystem)**

### Step 9.6: Test Independent Operation

**Confirm web and admin apps work independently:**

**Stop admin (simulate crash):**
- In Vercel, temporarily set admin to "Paused" or add invalid env var
- Verify **web still works** at onefocusafrica.co

**Stop web (simulate crash):**
- Restore admin, pause web
- Verify **admin still works** at admin.onefocusafrica.co

**Expected:**
- ✅ Each app operates independently
- ✅ One failing doesn't affect the other
- ✅ Both share same database and Blob storage

---

## PHASE 10: Post-Deployment Checklist

### Security Verification
- [ ] No insecure admin creation endpoints exist
- [ ] All compromised credentials rotated
- [ ] `AUTH_SECRET` is strong and unique
- [ ] `DATABASE_URL` never committed to GitHub
- [ ] Admin dashboard requires authentication
- [ ] `/admin` routes redirect to login when not authenticated
- [ ] `/api/admin/*` endpoints require authentication

### Performance Verification
- [ ] Both sites load in < 3 seconds
- [ ] Images load correctly (Next.js Image optimization)
- [ ] No console errors on either site
- [ ] SSL certificates active (no warnings)
- [ ] Both domains resolve correctly

### Functionality Verification
- [ ] Admin login works
- [ ] Media uploads work and persist
- [ ] Blog publishing works
- [ ] Published articles appear on public site
- [ ] Contact forms work (or gracefully degrade)
- [ ] Navigation works on both sites

### Monitoring Setup
- [ ] Enable Vercel Analytics (optional)
- [ ] Configure error notifications
- [ ] Set up uptime monitoring (optional)
- [ ] Document access for team members

---

## DNS RECORDS SUMMARY FOR HOSTINGER

Add these records to `onefocusafrica.co` in Hostinger DNS:

| Type  | Name    | Points To / Value       | Purpose               |
|-------|---------|-------------------------|-----------------------|
| A     | @       | [Vercel IP]             | Root domain (web)     |
| CNAME | www     | cname.vercel-dns.com    | WWW subdomain (web)   |
| CNAME | admin   | cname.vercel-dns.com    | Admin subdomain       |

**⚠️ PRESERVE EXISTING EMAIL RECORDS:**
- Do NOT delete MX records
- Do NOT delete SPF (TXT) records
- Do NOT delete DKIM (TXT) records
- Only ADD the new records above

---

## ENVIRONMENT VARIABLES REFERENCE

### ONEFOCUS WEB (`apps/web`)

**Required:**
```env
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
NEXT_PUBLIC_SITE_URL=https://onefocusafrica.co
```

**Optional (Email):**
```env
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@onefocusafrica.co
RESEND_INQUIRY_RECIPIENT=inquiries@onefocusafrica.co
```

**Auto-Added (Blob):**
```env
BLOB_READ_WRITE_TOKEN=[auto-added by Vercel]
```

### ONEFOCUS ADMIN (`apps/admin`)

**Required:**
```env
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
NEXT_PUBLIC_SITE_URL=https://admin.onefocusafrica.co
NEXTAUTH_URL=https://admin.onefocusafrica.co
AUTH_SECRET=[generate with: openssl rand -base64 32]
```

**Auto-Added (Blob):**
```env
BLOB_READ_WRITE_TOKEN=[auto-added by Vercel]
```

---

## TROUBLESHOOTING

### Build Fails: "Environment variable not found: DATABASE_URL"
**Solution:** Add `DATABASE_URL` in Vercel project settings → Environment Variables

### Build Fails: "Cannot find module '@onefocus/database'"
**Solution:** Verify `Root Directory` is set correctly (`apps/web` or `apps/admin`)

### Admin Login Fails: "Invalid callback URL"
**Solution:** 
- Verify `NEXTAUTH_URL=https://admin.onefocusafrica.co` (exact match)
- Verify `AUTH_SECRET` is set
- No trailing slash in `NEXTAUTH_URL`

### Images Not Loading: 404 errors
**Solution:**
- Verify Blob Store connected to both projects
- Check `BLOB_READ_WRITE_TOKEN` exists in environment variables
- Redeploy both projects after connecting Blob

### DNS Not Propagating
**Solution:**
- Wait 15-30 minutes minimum
- Check https://dnschecker.org
- Verify records in Hostinger match Vercel exactly
- Try clearing DNS cache: `ipconfig /flushdns` (Windows)

### SSL Certificate Not Provisioning
**Solution:**
- Wait 15-30 minutes after DNS propagates
- Click "Refresh" in Vercel domain settings
- Verify no CAA records block Let's Encrypt in Hostinger
- Check domain status shows "Valid Configuration"

### Published Blog Posts Don't Appear on Web
**Solution:**
- Verify both projects use IDENTICAL `DATABASE_URL`
- Check post status is "Published" (not "Draft")
- Verify web app redeployed after publishing
- Check Vercel logs for database connection errors

---

## ROLLBACK PROCEDURE

If critical issues occur:

### Option 1: Rollback Single Project
1. Go to Vercel → [Project] → Deployments
2. Find last known-good deployment
3. Click "..." → "Promote to Production"

### Option 2: Temporarily Disable Domain
1. Remove domain from Vercel (Settings → Domains)
2. Fix issues
3. Re-add domain when ready

### Option 3: Emergency Maintenance Page
1. Create simple static `maintenance.html`
2. Deploy to new Vercel project
3. Update DNS to point to maintenance page
4. Fix issues in main projects
5. Restore DNS when ready

---

## SUCCESS CRITERIA

Deployment is complete when ALL of these are true:

- [x] Both apps build successfully in Vercel
- [x] Both domains resolve with SSL (no warnings)
- [x] Admin login works
- [x] Media uploads work and persist after redeploy
- [x] Blog publishing works
- [x] Published articles appear on public site
- [x] Contact forms work (or gracefully degrade)
- [x] Both apps operate independently
- [x] Vercel Blob Storage connected and working
- [x] No insecure endpoints exposed
- [x] All compromised credentials rotated
- [x] Production admin user created
- [x] Security headers active
- [x] No console errors on either site

**Do NOT announce site as live until all criteria met**

---

## NEXT STEPS AFTER DEPLOYMENT

1. **Monitor for 24-48 hours:**
   - Check Vercel logs for errors
   - Monitor uptime
   - Test all features regularly

2. **Team Access:**
   - Add team members to Vercel projects
   - Set appropriate permissions
   - Share admin credentials securely

3. **Performance Optimization:**
   - Run Lighthouse audits
   - Optimize images
   - Review Core Web Vitals

4. **Ongoing Maintenance:**
   - Schedule regular security audits
   - Keep dependencies updated
   - Monitor Vercel usage/costs
   - Backup database regularly

---

## SUPPORT RESOURCES

- **Vercel Documentation:** https://vercel.com/docs
- **Vercel Support:** https://vercel.com/support
- **NextAuth Documentation:** https://authjs.dev
- **Neon Documentation:** https://neon.tech/docs
- **Hostinger DNS Help:** https://support.hostinger.com/en/collections/1598533-dns-and-nameservers

---

## FINAL NOTES

**⚠️ CRITICAL REMINDERS:**

1. **Never commit secrets to GitHub** - All credentials stay in Vercel environment variables and secure storage
2. **Both projects share the same database** - Changes in admin reflect immediately on web
3. **Images stored in Vercel Blob** - Persistent across deployments, shared between projects
4. **Each project deploys independently** - One can be updated without affecting the other
5. **DNS changes take time** - Allow 15-30 minutes for propagation before troubleshooting

**Questions or issues?** Review troubleshooting section or contact Vercel support.

**Deployment prepared by:** Kiro AI  
**Date:** 2026-11-13  
**Repository:** https://github.com/Alain383/onefocusafrica
