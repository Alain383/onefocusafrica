# VERCEL DEPLOYMENT GUIDE - ONEFOCUS AFRICA

## Architecture: Two Separate Vercel Projects

This monorepo will deploy as TWO independent Vercel projects:
1. **onefocusafrica-web** (Public Website)
2. **onefocusafrica-admin** (CMS Dashboard)

Both share the same PostgreSQL database but deploy independently.

═══════════════════════════════════════════════════════════════════════

## PREREQUISITES

### 1. Database Setup (Choose One):

#### Option A: Vercel Postgres (Recommended)
```bash
# In Vercel Dashboard
1. Go to Storage → Create Database → Postgres
2. Copy connection string
3. Format: postgresql://user:pass@host:5432/database
```

#### Option B: Supabase
```bash
# Free tier includes PostgreSQL
1. Create project at supabase.com
2. Get connection string from Settings → Database
3. Use "Connection pooling" URL for better performance
```

#### Option C: Railway / Render
```bash
# Both offer free PostgreSQL tiers
1. Create database
2. Copy connection string
```

### 2. Generate NextAuth Secret
```bash
# Run this command to generate a secure secret:
openssl rand -base64 32

# Or use Node.js:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Save this - you'll need it for admin app
```

═══════════════════════════════════════════════════════════════════════

## DEPLOYMENT STEP 1: DATABASE MIGRATION

### From your local development machine:

```bash
# 1. Set production database URL
export DATABASE_URL="postgresql://user:pass@host:5432/database"

# 2. Generate Prisma Client
cd D:\ONEFOCUS-TEST
npx prisma generate

# 3. Push schema to production database
npx prisma db push

# 4. Verify tables created
npx prisma studio
# Check that all tables exist: AdminUser, Post, CaseStudy, etc.
```

═══════════════════════════════════════════════════════════════════════

## DEPLOYMENT STEP 2: WEB APP (Public Website)

### 2.1 Create Vercel Project

1. Go to https://vercel.com/new
2. Import Git Repository
3. Select: `Alain383/onefocusafrica`
4. Branch: `feat/monorepo-dual-app-migration`

### 2.2 Configure Build Settings

```
Framework Preset: Next.js
Root Directory: apps/web
Build Command: (leave default or use):
  npm run build
Output Directory: .next
Install Command: 
  npm install --legacy-peer-deps
```

### 2.3 Environment Variables

Add these in Vercel project settings:

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/database

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
NEXT_PUBLIC_SITE_NAME=ONEFOCUS AFRICA
```

### 2.4 Deploy

1. Click "Deploy"
2. Wait for build (2-3 minutes)
3. Vercel will provide URL: https://onefocusafrica-web.vercel.app

### 2.5 Test Web App

Visit deployment URL and verify:
- ✅ Homepage loads
- ✅ Navigation works
- ✅ Blog page accessible (/blog)
- ✅ No database errors in logs
- ✅ Images load correctly

═══════════════════════════════════════════════════════════════════════

## DEPLOYMENT STEP 3: ADMIN APP (CMS Dashboard)

### 3.1 Create Second Vercel Project

1. Go to https://vercel.com/new (again)
2. Import Git Repository (same repo)
3. Select: `Alain383/onefocusafrica`
4. Branch: `feat/monorepo-dual-app-migration`

### 3.2 Configure Build Settings

```
Framework Preset: Next.js
Root Directory: apps/admin
Build Command: (leave default or use):
  npm run build
Output Directory: .next
Install Command:
  npm install --legacy-peer-deps
```

### 3.3 Environment Variables

Add these in Vercel project settings:

```bash
# Database (SAME as web app)
DATABASE_URL=postgresql://user:pass@host:5432/database

# NextAuth Configuration
NEXTAUTH_SECRET=[paste the 32+ char secret you generated]
NEXTAUTH_URL=https://your-admin-domain.vercel.app

# Admin User Credentials
ADMIN_NAME=Alain Hlavin
ADMIN_EMAIL=alainhlavin@gmail.com
ADMIN_PASSWORD=[secure password]

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-admin-domain.vercel.app
NEXT_PUBLIC_SITE_NAME=ONEFOCUS AFRICA Admin
```

### 3.4 Deploy

1. Click "Deploy"
2. Wait for build (2-3 minutes)
3. Vercel will provide URL: https://onefocusafrica-admin.vercel.app

### 3.5 Create Admin User

```bash
# Visit the seed endpoint to create admin user:
https://your-admin-domain.vercel.app/api/seed

# You should see:
{
  "success": true,
  "user": {
    "email": "alainhlavin@gmail.com",
    "role": "ADMIN",
    "isActive": true
  }
}
```

### 3.6 Test Admin Login

1. Visit: https://your-admin-domain.vercel.app
2. Should redirect to: /auth/login
3. Log in with credentials from ADMIN_EMAIL and ADMIN_PASSWORD
4. Should see admin dashboard

═══════════════════════════════════════════════════════════════════════

## DEPLOYMENT STEP 4: TEST PUBLISHING WORKFLOW

### This verifies that posts created in admin appear on public website

1. **In Admin Dashboard:**
   - Go to Blog & Articles
   - Click "New Post"
   - Add title, content, cover image
   - Set status to "Published"
   - Click "Save & Publish"

2. **In Web App:**
   - Visit: https://your-web-domain.vercel.app/blog
   - Your new post should appear in the listing
   - Click the post to view full article
   - Verify all content displays correctly

3. **Test Portfolio:**
   - In admin: Create case study
   - In web: Visit /work
   - Verify case study appears

═══════════════════════════════════════════════════════════════════════

## DEPLOYMENT STEP 5: CUSTOM DOMAINS (Optional)

### Web App Domain
```
1. In Vercel Web App project:
   - Settings → Domains
   - Add: yourdomain.com
   - Follow DNS instructions

2. Update environment variable:
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### Admin App Subdomain
```
1. In Vercel Admin App project:
   - Settings → Domains
   - Add: admin.yourdomain.com
   - Follow DNS instructions

2. Update environment variables:
   NEXTAUTH_URL=https://admin.yourdomain.com
   NEXT_PUBLIC_SITE_URL=https://admin.yourdomain.com

3. Redeploy after changing NEXTAUTH_URL
```

═══════════════════════════════════════════════════════════════════════

## DEPLOYMENT STEP 6: MEDIA STORAGE CONFIGURATION

### Current Limitation:
Local file uploads won't work on Vercel (ephemeral filesystem)

### Solution: Configure Vercel Blob Storage

1. **Enable Vercel Blob:**
```bash
# In Vercel Dashboard (both projects):
Storage → Create Storage → Blob
```

2. **Update Upload API (apps/admin/app/api/admin/media/route.ts):**
```typescript
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  
  // Upload to Vercel Blob
  const blob = await put(file.name, file, {
    access: 'public',
  });
  
  return NextResponse.json({
    asset: {
      url: blob.url,
      filename: file.name,
      size: file.size,
      type: file.type,
    },
  });
}
```

3. **Install dependency:**
```bash
npm install @vercel/blob --workspace=apps/admin
```

4. **Redeploy admin app**

═══════════════════════════════════════════════════════════════════════

## TROUBLESHOOTING

### Build Fails with "Cannot find module '@onefocus/database'"

**Solution:** The database package is not set up. Use direct Prisma import instead:
```typescript
// Instead of:
import { prisma } from '@onefocus/database'

// Use:
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
```

### "NEXTAUTH_SECRET is not defined" Error

**Solution:** Add NEXTAUTH_SECRET environment variable in Vercel:
```bash
# Generate with:
openssl rand -base64 32
```

### Database Connection Timeout

**Solution:** Check DATABASE_URL format:
```bash
# Should be:
postgresql://user:pass@host:5432/database

# NOT:
postgres://... (use postgresql://)
```

### Images Not Uploading

**Solution:** Configure Vercel Blob (see Step 6)

### Admin Redirect Loop at /auth/login

**Solution:** Verify NEXTAUTH_URL matches deployment URL exactly

### Posts Not Appearing on Web

**Solution:** 
1. Check post status is "PUBLISHED" in admin
2. Verify both apps use same DATABASE_URL
3. Clear browser cache and refresh

═══════════════════════════════════════════════════════════════════════

## POST-DEPLOYMENT MONITORING

### Check Vercel Logs:

1. **Web App Logs:**
   ```
   Vercel → onefocusafrica-web → Deployments → [latest] → Runtime Logs
   ```

2. **Admin App Logs:**
   ```
   Vercel → onefocusafrica-admin → Deployments → [latest] → Runtime Logs
   ```

### Monitor For:
- Database connection errors
- NextAuth authentication issues
- Image upload failures
- API endpoint errors
- Build warnings

═══════════════════════════════════════════════════════════════════════

## ROLLBACK PROCEDURE

If deployment has critical issues:

1. **In Vercel Dashboard:**
   - Go to Deployments
   - Find previous working deployment
   - Click "..." → "Promote to Production"

2. **Revert GitHub commit:**
   ```bash
   git revert [commit-hash]
   git push origin feat/monorepo-dual-app-migration
   ```

═══════════════════════════════════════════════════════════════════════

## SUCCESS CRITERIA

✅ Web app accessible at production URL
✅ Admin app accessible at production URL
✅ Admin login works
✅ Blog post creation works
✅ Published post appears on web app /blog
✅ Portfolio items display on web app /work
✅ Contact form submissions work
✅ No errors in Vercel logs
✅ Custom domains configured (if applicable)
✅ SSL certificates active

═══════════════════════════════════════════════════════════════════════

## PRODUCTION URLS

After deployment, update this section:

- **Public Website:** https://_____.vercel.app
- **Admin Dashboard:** https://_____.vercel.app
- **Database:** [Provider and region]
- **Deployment Date:** ____

═══════════════════════════════════════════════════════════════════════