# Post-Deployment Verification Checklist

## Overview

Complete this checklist after deploying both ONEFOCUS WEB and ONEFOCUS ADMIN to Vercel production. This ensures all functionality works correctly before announcing the site is live.

**Production URLs:**
- Public website: https://onefocusafrica.co
- Admin dashboard: https://admin.onefocusafrica.co

---

## Pre-Verification Requirements

Before starting this checklist, confirm:

- [ ] Both Vercel projects deployed successfully
- [ ] DNS records configured and propagated
- [ ] SSL certificates active (no browser warnings)
- [ ] All environment variables set in both projects
- [ ] Database migrations applied to production database
- [ ] At least one secure admin account exists (not using compromised credentials)

---

## Test 1: ONEFOCUS WEB Builds Successfully

**Purpose:** Verify the public website compiles and deploys without errors

### Verification Steps

1. Go to Vercel Dashboard → **onefocus-web** → **Deployments**
2. Check the latest production deployment status

**Expected Result:**
- ✅ Status: "Ready"
- ✅ Build logs show no errors
- ✅ All routes generated successfully
- ✅ No TypeScript compilation errors
- ✅ No missing environment variables warnings

**If Failed:**
- Review build logs in Vercel dashboard
- Check environment variables match production-env-checklist.md
- Verify Prisma client generated successfully
- Confirm DATABASE_URL is valid and accessible

---

## Test 2: ONEFOCUS ADMIN Builds Successfully

**Purpose:** Verify the admin dashboard compiles and deploys without errors

### Verification Steps

1. Go to Vercel Dashboard → **onefocus-admin** → **Deployments**
2. Check the latest production deployment status

**Expected Result:**
- ✅ Status: "Ready"
- ✅ Build logs show no errors
- ✅ All routes generated successfully
- ✅ No TypeScript compilation errors
- ✅ No missing environment variables warnings

**If Failed:**
- Review build logs in Vercel dashboard
- Check environment variables match production-env-checklist.md
- Verify NEXTAUTH_URL and NEXTAUTH_SECRET are set
- Confirm BLOB_READ_WRITE_TOKEN is valid

---

## Test 3: Admin Login and Logout Work

**Purpose:** Verify authentication system functions correctly

### Verification Steps

#### Login Test

1. Navigate to: https://admin.onefocusafrica.co
2. Enter secure admin credentials (created via approved script)
3. Click "Sign In"

**Expected Result:**
- ✅ Redirected to: https://admin.onefocusafrica.co/admin/dashboard
- ✅ Navigation menu displays (Dashboard, Blog, Media, etc.)
- ✅ User profile/email shown in header
- ✅ No console errors in browser DevTools

#### Logout Test

1. Click user profile/logout button
2. Confirm logout

**Expected Result:**
- ✅ Redirected to: https://admin.onefocusafrica.co
- ✅ Session cleared (cannot access /admin routes without re-login)
- ✅ No error messages displayed

**If Failed:**
- Verify NEXTAUTH_URL matches https://admin.onefocusafrica.co exactly
- Check NEXTAUTH_SECRET is set and matches between deployments
- Confirm DATABASE_URL is correct and database accessible
- Review Vercel function logs for authentication errors

---

## Test 4: Uploading Images Works

**Purpose:** Verify Vercel Blob Storage integration and media upload flow

### Verification Steps

1. Log in to: https://admin.onefocusafrica.co
2. Navigate to: **Media Library** or **Media Management**
3. Click "Upload Image" or similar button
4. Select a test image (JPG, PNG, or WebP under 10MB)
5. Upload the image

**Expected Result:**
- ✅ Upload progress indicator displays
- ✅ Image appears in media library after upload completes
- ✅ Image URL starts with `https://[hash].public.blob.vercel-storage.com/`
- ✅ Thumbnail preview loads correctly
- ✅ MediaAsset record saved in database with correct metadata

**If Failed:**
- Verify BLOB_READ_WRITE_TOKEN is set in admin project environment variables
- Check Vercel Blob Store is connected to admin project
- Review Vercel function logs for upload errors
- Confirm file size under 10MB and type is JPG/PNG/WebP
- Check browser console for CORS or network errors

---

## Test 5: Creating and Publishing Blog Articles Works

**Purpose:** Verify blog authoring and publishing workflow

### Verification Steps

#### Create Draft Article

1. Log in to admin dashboard
2. Navigate to: **Blog → New Article**
3. Fill in:
   - Title: "Test Article - Post-Deployment Verification"
   - Slug: "test-article-verification"
   - Content: Sample content with at least one paragraph
   - Cover Image: Upload or select from media library
   - Author: Select your admin account
   - Category: Select any category
   - Status: **Draft**
4. Click "Save" or "Create Article"

**Expected Result:**
- ✅ Article saved successfully
- ✅ Appears in blog list with "Draft" status
- ✅ Can edit the draft article
- ✅ Cover image displays in article preview

#### Publish Article

1. Open the draft article
2. Change status to: **Published**
3. Set publish date (or leave as current date)
4. Click "Save" or "Publish"

**Expected Result:**
- ✅ Article status changes to "Published"
- ✅ Publish date recorded
- ✅ No errors displayed

**If Failed:**
- Check database connection (both projects use same DATABASE_URL)
- Verify blog schema migrations applied
- Review Vercel function logs for API errors
- Confirm admin user has required permissions

---

## Test 6: Published Articles Appear on Public Website

**Purpose:** Verify blog content flows from admin to public site

### Verification Steps

1. Navigate to: https://onefocusafrica.co/blog
2. Look for "Test Article - Post-Deployment Verification"

**Expected Result:**
- ✅ Article appears in blog listing
- ✅ Title, excerpt, and cover image display correctly
- ✅ Clicking article opens: https://onefocusafrica.co/blog/test-article-verification
- ✅ Full article content renders properly
- ✅ Author name and publish date display
- ✅ Category tag shown

**If Failed:**
- Verify both projects use the same DATABASE_URL
- Check if web app is using correct Prisma client
- Confirm article status is "Published" (not "Draft")
- Review getStaticProps or data fetching logic in blog pages
- Check Vercel build logs for static generation errors

---

## Test 7: Uploaded Images Remain Available After Redeployment

**Purpose:** Verify media persistence in Vercel Blob Storage

### Verification Steps

1. Note the URL of an uploaded image from Test 4
2. Trigger a redeployment of **both** projects:
   - Option A: Push a trivial commit to GitHub
   - Option B: Click "Redeploy" in Vercel dashboard
3. Wait for both deployments to complete
4. Visit the image URL directly in browser
5. Check if the image still displays in admin media library
6. Verify the image still shows in published blog article

**Expected Result:**
- ✅ Image URL still resolves (not 404)
- ✅ Image displays correctly in browser
- ✅ Image visible in admin media library after redeploy
- ✅ Image displays in published article after redeploy
- ✅ No broken image placeholders anywhere

**If Failed:**
- Verify BLOB_READ_WRITE_TOKEN set in both projects
- Confirm Vercel Blob Store connected to both projects
- Check if images were uploaded to local filesystem instead of blob storage
- Review blob migration implementation in media upload API

---

## Test 8: Inquiry Forms Store Data Correctly

**Purpose:** Verify contact/inquiry form functionality

### Verification Steps

1. Navigate to: https://onefocusafrica.co
2. Locate the contact or inquiry form (homepage or /contact page)
3. Fill in form fields:
   - Name: "Test User"
   - Email: "test@example.com"
   - Message: "Post-deployment verification test"
4. Submit the form

**Expected Result:**
- ✅ Form submits successfully
- ✅ Success message displayed to user
- ✅ Inquiry record saved in database
- ✅ Email notification sent (if configured)

#### Verify in Database (Optional)

If you have database access:
```sql
SELECT * FROM "Inquiry" ORDER BY "createdAt" DESC LIMIT 1;
```

**Expected Result:**
- ✅ Record exists with correct name, email, message
- ✅ createdAt timestamp is recent

**If Failed:**
- Check web app DATABASE_URL is correct
- Verify inquiry API route exists and authenticated (if required)
- Review Vercel function logs for submission errors
- Confirm RESEND_API_KEY is set if email notifications enabled

---

## Test 9: All Protected Routes Enforce Authorization

**Purpose:** Verify authentication and authorization security

### Verification Steps

#### Test Unauthenticated Access

1. Open incognito/private browser window
2. Attempt to access protected routes directly:
   - https://admin.onefocusafrica.co/admin/dashboard
   - https://admin.onefocusafrica.co/admin/blog
   - https://admin.onefocusafrica.co/admin/media
   - https://admin.onefocusafrica.co/api/admin/media
   - https://admin.onefocusafrica.co/api/admin/slug-check

**Expected Result:**
- ✅ All admin/* routes redirect to login page
- ✅ All /api/admin/* endpoints return 401 Unauthorized
- ✅ No sensitive data visible without authentication
- ✅ Cannot upload, edit, or delete content without authentication

#### Test Admin API Routes

Using a tool like curl or Postman:

```bash
# Without authentication - should fail
curl https://admin.onefocusafrica.co/api/admin/media

# Expected: 401 Unauthorized or redirect
```

**Expected Result:**
- ✅ API returns 401 or 403 (not 200 OK)
- ✅ No data returned without valid session

**If Failed:**
- Review middleware in admin app
- Check NextAuth session validation in API routes
- Verify getServerSession calls in protected routes
- Review security audit report for remediation steps

---

## Test 10: Both Applications Work Independently

**Purpose:** Verify no cross-dependencies or shared frontend state

### Verification Steps

#### Test 1: Admin Works When Web Is Down

1. In Vercel, temporarily pause/disable the **onefocus-web** project (or use Vercel's "Pause" feature)
2. Access: https://admin.onefocusafrica.co
3. Log in and perform admin tasks (upload image, edit article)

**Expected Result:**
- ✅ Admin dashboard loads normally
- ✅ Can upload media
- ✅ Can create/edit/publish articles
- ✅ All admin functionality works

#### Test 2: Web Works When Admin Is Down

1. Re-enable onefocus-web project
2. In Vercel, temporarily pause/disable the **onefocus-admin** project
3. Access: https://onefocusafrica.co
4. Browse pages (homepage, blog, services, about)

**Expected Result:**
- ✅ Public website loads normally
- ✅ All pages accessible
- ✅ Images display correctly
- ✅ Blog articles visible
- ✅ No errors related to admin app

#### Test 3: Verify Separate Build Artifacts

1. Check Vercel Dashboard → onefocus-web → Build logs
2. Check Vercel Dashboard → onefocus-admin → Build logs

**Expected Result:**
- ✅ Each project builds from its own root directory
- ✅ No shared .next build cache between projects
- ✅ Each has independent deployment history
- ✅ Deployments can succeed independently

**If Failed:**
- Verify vercel.json in each app specifies correct buildCommand
- Confirm each project has separate root directory in Vercel settings
- Check for hardcoded cross-domain API calls
- Review middleware for cross-origin dependencies

---

## Test 11: Performance and Accessibility (Optional)

**Purpose:** Verify site meets basic performance and accessibility standards

### Verification Steps

1. Run Lighthouse audit on: https://onefocusafrica.co
2. Run Lighthouse audit on: https://admin.onefocusafrica.co/admin/dashboard (after login)

**Targets:**
- Performance: > 80
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90 (public site only)

**Expected Result:**
- ✅ No critical performance issues
- ✅ Images optimized and lazy-loaded
- ✅ No accessibility violations
- ✅ Meta tags present (public site)

**Note:** Admin dashboard performance may be lower due to authenticated routes and data tables.

---

## Test 12: Error Handling and Monitoring (Optional)

**Purpose:** Verify error tracking and logging work

### Verification Steps

1. Go to Vercel Dashboard → onefocus-web → Logs
2. Go to Vercel Dashboard → onefocus-admin → Logs
3. Trigger a controlled error (e.g., visit /nonexistent-page)
4. Check logs for error entry

**Expected Result:**
- ✅ 404 errors logged
- ✅ No unhandled promise rejections
- ✅ No database connection errors in logs
- ✅ Can trace user requests through logs

**If Failed:**
- Consider adding error monitoring (Sentry, LogRocket, etc.)
- Review Vercel log retention settings
- Add structured logging to critical API routes

---

## Summary Checklist

Mark each item as you complete verification:

- [ ] Test 1: ONEFOCUS WEB builds successfully
- [ ] Test 2: ONEFOCUS ADMIN builds successfully
- [ ] Test 3: Admin login and logout work
- [ ] Test 4: Uploading images works
- [ ] Test 5: Creating and publishing blog articles works
- [ ] Test 6: Published articles appear on public website
- [ ] Test 7: Uploaded images remain available after redeployment
- [ ] Test 8: Inquiry forms store data correctly
- [ ] Test 9: All protected routes enforce authorization
- [ ] Test 10: Both applications work independently

### Additional Optional Tests

- [ ] Test 11: Performance and accessibility
- [ ] Test 12: Error handling and monitoring

---

## Final Sign-Off

Once all tests pass:

- [ ] Document any issues found and their resolutions
- [ ] Save test results with timestamps
- [ ] Notify stakeholders that site is verified and live
- [ ] Set up ongoing monitoring and alerts
- [ ] Schedule post-launch review (1 week after deployment)

**Verification completed by:** _______________  
**Date:** _______________  
**Production URLs verified:** onefocusafrica.co, admin.onefocusafrica.co

---

## Troubleshooting Resources

- **Build Verification Report:** `.agents/build-verification-report.md`
- **Security Audit Report:** `.agents/security-audit-report.md`
- **Environment Variables:** `.agents/production-env-checklist.md`
- **Vercel Deployment Guide:** `.agents/vercel-deployment-guide.md`
- **Vercel Logs:** Dashboard → [Project] → Logs
- **Vercel Support:** https://vercel.com/support
