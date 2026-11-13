# 🚀 ONEFOCUS AFRICA — Production Environment Setup Guide

**Deployment Date:** January 2025  
**Confirmed Domains:**
- Public Website: `https://onefocusafrica.co`
- Admin Dashboard: `https://admin.onefocusafrica.co`
- DNS Provider: Hostinger

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### ✅ Completed Items
- [x] Security vulnerabilities removed
- [x] Vercel Blob storage implemented
- [x] Both applications build successfully
- [x] Database schema verified (PostgreSQL)
- [x] Authentication enforced on all admin routes
- [x] Media upload system production-ready

### ⚠️ Required Before Launch
- [ ] Rotate Neon database credentials
- [ ] Generate new NEXTAUTH_SECRET
- [ ] Create production admin user
- [ ] Configure Vercel projects
- [ ] Set environment variables
- [ ] Configure Hostinger DNS

---

## 🔐 STEP 1: ROTATE DATABASE CREDENTIALS

### 1.1 Rotate Neon Password

1. Log into Neon Console: https://console.neon.tech/
2. Navigate to your project: `neondb`
3. Select branch: `production` (br-flat-wind-bex5f4n5)
4. Go to **Settings** → **Reset Password**
5. Generate new password
6. Copy **new connection strings** (save securely):
   - Pooled connection (for DATABASE_URL)
   - Direct connection (for DATABASE_URL_UNPOOLED)

**Format:**
```
postgresql://[user]:[NEW_PASSWORD]@[host]/[database]?sslmode=require
```

### 1.2 Generate New NEXTAUTH_SECRET

**Option A: Using OpenSSL (Windows with Git Bash/WSL):**
```bash
openssl rand -base64 32
```

**Option B: Using Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Option C: Using PowerShell:**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

Save the generated secret securely.

---

## 🌐 STEP 2: CREATE VERCEL PROJECTS

### Project 1: ONEFOCUS WEB (Public Website)

#### 2.1 Create Project
1. Go to https://vercel.com/new
2. Import Git Repository: `Alain383/onefocusafrica`
3. **Configure Project:**
   - **Project Name:** `onefocus-web`
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `apps/web`
   - **Build Command:** (auto-detected from vercel.json)
   - **Output Directory:** `.next` (auto-detected)
   - **Install Command:** (auto-detected from vercel.json)

#### 2.2 Environment Variables for ONEFOCUS WEB

Add these in Vercel Dashboard → Settings → Environment Variables:

```bash
# Database (use NEW rotated credentials)
DATABASE_URL=postgresql://[user]:[NEW_PASSWORD]@[pooler-host]/neondb?sslmode=require
DATABASE_URL_UNPOOLED=postgresql://[user]:[NEW_PASSWORD]@[direct-host]/neondb?sslmode=require

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://onefocusafrica.co
NEXT_PUBLIC_SITE_NAME=ONEFOCUS AFRICA

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=onefocusafrica@gmail.com
SMTP_PASS=[your_gmail_app_password]
SMTP_FROM=onefocusafrica@gmail.com

# Contact Information
CONTACT_EMAIL=onefocusafrica@gmail.com
CONTACT_PHONE=+250 781 102 667
WHATSAPP_NUMBER=+250781102667

# Neon Configuration
NEON_BRANCH=production
NEON_BRANCH_ID=br-flat-wind-bex5f4n5
```

#### 2.3 Deploy
Click **Deploy** and wait for initial deployment to complete.

---

### Project 2: ONEFOCUS ADMIN (Admin Dashboard)

#### 2.4 Create Project
1. Go to https://vercel.com/new
2. Import **same** Git Repository: `Alain383/onefocusafrica`
3. **Configure Project:**
   - **Project Name:** `onefocus-admin`
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `apps/admin`
   - **Build Command:** (auto-detected from vercel.json)
   - **Output Directory:** `.next` (auto-detected)
   - **Install Command:** (auto-detected from vercel.json)

#### 2.5 Environment Variables for ONEFOCUS ADMIN

Add these in Vercel Dashboard → Settings → Environment Variables:

```bash
# Database (use SAME NEW rotated credentials)
DATABASE_URL=postgresql://[user]:[NEW_PASSWORD]@[pooler-host]/neondb?sslmode=require
DATABASE_URL_UNPOOLED=postgresql://[user]:[NEW_PASSWORD]@[direct-host]/neondb?sslmode=require

# NextAuth (use NEW generated secret)
NEXTAUTH_SECRET=[your_generated_secret_from_step_1.2]
NEXTAUTH_URL=https://admin.onefocusafrica.co

# Vercel Blob Storage (REQUIRED for media uploads)
BLOB_READ_WRITE_TOKEN=[token_from_vercel_blob_dashboard]

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://admin.onefocusafrica.co
NEXT_PUBLIC_SITE_NAME=ONEFOCUS AFRICA Admin

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=onefocusafrica@gmail.com
SMTP_PASS=[your_gmail_app_password]
SMTP_FROM=onefocusafrica@gmail.com

# Contact Information
CONTACT_EMAIL=onefocusafrica@gmail.com
CONTACT_PHONE=+250 781 102 667
WHATSAPP_NUMBER=+250781102667

# Neon Configuration
NEON_BRANCH=production
NEON_BRANCH_ID=br-flat-wind-bex5f4n5
```

#### 2.6 Get Vercel Blob Token
1. In Vercel Dashboard → Storage
2. Create new Blob Store (or use existing)
3. Copy the `BLOB_READ_WRITE_TOKEN`
4. Add it to environment variables (step 2.5)

#### 2.7 Deploy
Click **Deploy** and wait for initial deployment to complete.

---

## 📝 STEP 3: CONFIGURE HOSTINGER DNS

After both Vercel deployments succeed, you'll receive temporary URLs:
- Web: `https://onefocus-web-[hash].vercel.app`
- Admin: `https://onefocus-admin-[hash].vercel.app`

Test these URLs first, then configure custom domains.

### 3.1 Get Vercel DNS Records

1. **In Vercel Web Project:**
   - Go to Settings → Domains
   - Click **Add Domain**
   - Enter: `onefocusafrica.co`
   - Vercel will provide DNS records

2. **In Vercel Admin Project:**
   - Go to Settings → Domains
   - Click **Add Domain**
   - Enter: `admin.onefocusafrica.co`
   - Vercel will provide DNS records

### 3.2 Configure DNS in Hostinger

Log into Hostinger → DNS/Name Servers → Manage

**For Public Website (onefocusafrica.co):**

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 76.76.21.21 | 14400 |
| CNAME | www | cname.vercel-dns.com. | 14400 |

**For Admin Dashboard (admin.onefocusafrica.co):**

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | admin | cname.vercel-dns.com. | 14400 |

**⚠️ IMPORTANT:**
- Do NOT modify existing MX records (email)
- Do NOT modify existing TXT records (email/SPF)
- Only add/modify A and CNAME records for the website

### 3.3 Verify DNS Configuration

After adding records in Hostinger:
1. Wait 5-15 minutes for DNS propagation
2. Return to Vercel Domains settings
3. Click **Verify** on each domain
4. Vercel will automatically provision SSL certificates
5. Wait for status: **Valid Certificate**

### 3.4 Test Custom Domains

Once verified:
- Public: https://onefocusafrica.co
- Admin: https://admin.onefocusafrica.co

Both should load with valid HTTPS certificates.

---

## 👤 STEP 4: CREATE PRODUCTION ADMIN USER

**IMPORTANT:** Only do this AFTER both deployments are live and environment variables are set.

### 4.1 Local Script Method (Recommended)

On your local machine with production credentials:

```bash
# Set environment variables
export ADMIN_NAME="Your Full Name"
export ADMIN_EMAIL="admin@onefocusafrica.com"
export ADMIN_PASSWORD="[strong-secure-password-min-12-chars]"
export DATABASE_URL="postgresql://[user]:[NEW_PASSWORD]@[direct-host]/neondb?sslmode=require"

# Navigate to repository
cd "d:\ONEFOCUS AFRICA"

# Generate Prisma Client
npm run db:generate

# Create admin user
npm run create-admin --workspace=packages/database

# Clear terminal history
cls
```

### 4.2 Verify Admin Access

1. Go to https://admin.onefocusafrica.co/auth/login
2. Login with created credentials
3. Verify dashboard loads
4. Test media upload
5. Create test blog post

---

## ✅ STEP 5: POST-DEPLOYMENT VERIFICATION

### Public Website Tests

- [ ] Homepage loads: https://onefocusafrica.co
- [ ] HTTPS certificate valid (padlock icon)
- [ ] Services page loads
- [ ] About page loads
- [ ] Blog listing page loads
- [ ] Individual blog posts load
- [ ] Contact form submission works
- [ ] Images load correctly
- [ ] Mobile responsive
- [ ] No console errors

### Admin Dashboard Tests

- [ ] Login page loads: https://admin.onefocusafrica.co/auth/login
- [ ] Can login with admin credentials
- [ ] Dashboard loads after login
- [ ] Unauthorized redirect works (test in incognito)
- [ ] Media upload works (uploads to Vercel Blob)
- [ ] Can view uploaded media list
- [ ] Can create draft blog post
- [ ] Can insert uploaded images into post
- [ ] Can save draft
- [ ] Can publish post
- [ ] Published post appears on public website immediately
- [ ] Can edit existing posts
- [ ] Can view inquiries
- [ ] Can logout successfully

### Database Verification

- [ ] Both apps connect to same database
- [ ] Data persists across deployments
- [ ] No connection errors in logs
- [ ] All queries execute successfully

### Media Storage Verification

- [ ] Upload image in admin dashboard
- [ ] Verify URL starts with `https://` (Blob Storage)
- [ ] Verify image displays in admin preview
- [ ] Publish blog post with image
- [ ] Verify image displays on public website
- [ ] Redeploy admin app (triggers build)
- [ ] Verify image still loads (not lost)
- [ ] Check Vercel Blob dashboard shows uploaded files

---

## 🔧 TROUBLESHOOTING

### Build Fails on Vercel

**Check:**
1. Verify `apps/web` or `apps/admin` Root Directory is set
2. Check build logs for specific errors
3. Verify all environment variables are set
4. Test build locally: `npm run build:web` or `npm run build:admin`

### Database Connection Errors

**Check:**
1. DATABASE_URL format is correct
2. Database URL uses correct host (pooler for web, direct for migrations)
3. Password was properly rotated and matches
4. Neon database is active (not suspended)
5. IP allowlist configured (if enabled)

### Authentication Not Working

**Check:**
1. NEXTAUTH_SECRET is set
2. NEXTAUTH_URL matches deployed domain
3. Cookies are enabled in browser
4. Try clearing browser cache and cookies

### Media Upload Fails

**Check:**
1. BLOB_READ_WRITE_TOKEN is set in admin environment variables
2. Token is valid (check Vercel Blob dashboard)
3. File type is allowed (JPG, PNG, WebP, GIF, SVG, PDF)
4. File size < 10MB
5. Check admin app logs in Vercel

### Images Not Displaying

**Check:**
1. Blob Storage domain configured in next.config.ts (already done)
2. Image URLs start with `https://` (blob URLs)
3. Check browser console for 403/404 errors
4. Verify image exists in Vercel Blob dashboard

### Custom Domain Not Working

**Check:**
1. DNS records added correctly in Hostinger
2. Wait 15-30 minutes for DNS propagation
3. Verify domain in Vercel (Settings → Domains)
4. Check nameservers are still Hostinger's
5. Use DNS checker: https://dnschecker.org/

---

## 📊 PRODUCTION MONITORING

### Vercel Analytics

Both projects have access to:
- Real-time visitor analytics
- Performance metrics (Web Vitals)
- Function logs
- Build logs
- Bandwidth usage

**Access:** Vercel Dashboard → [Project] → Analytics

### Database Monitoring

**Neon Console:**
- Connection pool status
- Query performance
- Storage usage
- Branch status

**Access:** https://console.neon.tech/ → Your Project

### Error Tracking

**Check Regularly:**
1. Vercel function logs for runtime errors
2. Browser console on both websites
3. Database connection issues
4. Media upload failures

---

## 🔒 SECURITY BEST PRACTICES

### After Launch

1. **Rotate credentials quarterly:**
   - Database password
   - NEXTAUTH_SECRET
   - Admin passwords
   - Gmail app passwords

2. **Monitor access logs:**
   - Failed login attempts
   - Unusual admin activity
   - Large file uploads

3. **Keep dependencies updated:**
   ```bash
   npm outdated
   npm update
   ```

4. **Enable Vercel security headers:**
   - Already configured in Next.js
   - Verify in browser dev tools

5. **Backup database regularly:**
   - Neon provides automatic backups
   - Verify backup schedule in console

---

## 📞 SUPPORT RESOURCES

- **Vercel Documentation:** https://vercel.com/docs
- **Next.js Documentation:** https://nextjs.org/docs
- **Neon Documentation:** https://neon.tech/docs
- **Hostinger Support:** https://www.hostinger.com/support
- **NextAuth Documentation:** https://authjs.dev/

---

## 🎉 LAUNCH CHECKLIST

- [ ] Database credentials rotated
- [ ] NEXTAUTH_SECRET generated
- [ ] Vercel Web project created and deployed
- [ ] Vercel Admin project created and deployed
- [ ] Vercel Blob token configured
- [ ] All environment variables set
- [ ] Hostinger DNS records configured
- [ ] Custom domains verified in Vercel
- [ ] HTTPS certificates issued
- [ ] Production admin user created
- [ ] Public website tested
- [ ] Admin dashboard tested
- [ ] Media upload tested
- [ ] Blog publishing tested
- [ ] Contact form tested
- [ ] Mobile responsiveness verified
- [ ] Browser compatibility tested
- [ ] Error monitoring configured
- [ ] Backup strategy confirmed

**When all items checked: ONEFOCUS AFRICA IS LIVE! 🚀**

---

**Last Updated:** Production preparation phase  
**Status:** Ready for manual deployment steps  
**Next:** Execute Step 1 (Rotate credentials)
