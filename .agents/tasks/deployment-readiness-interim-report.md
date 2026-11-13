# ONEFOCUS AFRICA — DEPLOYMENT READINESS INTERIM REPORT

**Generated:** 2025-01-XX  
**Status:** SECURITY FIXES APPLIED, AWAITING BUILD VERIFICATION  
**GitHub Repo:** https://github.com/Alain383/onefocusafrica

---

## 🔒 TASK 1 — SECURITY AUDIT: ✅ CRITICAL FIXES APPLIED

### Vulnerabilities Found & Remediated

#### ✅ FIXED: Unauthenticated Admin Creation Endpoint
- **Location:** `app/api/create-admin/route.ts` (legacy root-level)
- **Risk:** PUBLIC endpoint creating admin users with default credentials
- **Default credentials:** `admin@onefocus.africa` / `admin123`
- **Action:** **DELETED** from repository
- **Commit:** 8f1e3b6 - "SECURITY: Remove dangerous admin creation endpoint"

#### ✅ FIXED: Unauthenticated Media Upload
- **Location:** `apps/admin/app/api/admin/media/route.ts`
- **Risk:** Anonymous file uploads to admin media storage
- **Action:** Added NextAuth session check before processing uploads
- **Commit:** 8f1e3b6

#### ✅ VERIFIED: No Environment Files Tracked
- `.env`, `.env.local`, `.env.production` are properly gitignored
- Only `.env.example` and `.env.local.example` are tracked (templates)
- **However:** Credentials were exposed in multiple .env files during development

#### ⚠️ REQUIRED: Credential Rotation Before Production
**DATABASE_URL** exposed in:
- `apps/web/.env`
- `apps/admin/.env`
- `.env.local` (root)
- Git commit history (potentially)

**ADMIN_PASSWORD** exposed in:
- `apps/admin/.env`: `Alainhlavin@#1`

**Action Required:** See `SECURITY-ROTATION-REQUIRED.md` for step-by-step rotation instructions.

### Authentication & Authorization Verification

#### ✅ Admin Dashboard Protection
- **Middleware:** ❌ Missing in `apps/admin/` (no middleware.ts file found)
- **API Routes:** ✅ Protected via NextAuth session checks
  - `/api/admin/media/list` — PROTECTED ✅
  - `/api/admin/media` — PROTECTED ✅ (just fixed)
  - `/api/admin/slug-check` — PROTECTED ✅
- **Rate Limiting:** ✅ Implemented (5 attempts / 15 min per IP)
- **Session:** ✅ JWT strategy, 8-hour expiration
- **Password Hashing:** ✅ bcrypt with 12 rounds

#### ⚠️ RECOMMENDATION: Add Middleware to Admin App
While API routes are protected, adding middleware would provide defense-in-depth:

```typescript
// apps/admin/middleware.ts
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  if (!req.auth && !req.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }
})

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
}
```

### Role-Based Access Control
- **Roles Defined:** `ADMIN`, `EDITOR` (PostgreSQL enum)
- **Role Enforcement:** ⚠️ Stored in JWT but not consistently checked in API routes
- **Recommendation:** Add role checks for destructive operations (delete, publish, etc.)

---

## 💾 TASK 2 — DATABASE READINESS: ✅ SCHEMA CORRECT

### Authoritative Schema Identified
- **Location:** `packages/database/prisma/schema.prisma`
- **Provider:** PostgreSQL ✅
- **Prisma Version:** 6.19.3 ✅
- **Client Version:** 6.19.3 ✅ (matches)

### ⚠️ LEGACY SCHEMA FOUND (IGNORE)
- **Location:** `prisma/schema.prisma` (root level)
- **Provider:** ~~SQLite~~ → PostgreSQL (fixed in commit 8f1e3b6)
- **Status:** Legacy file, not used by monorepo apps
- **Action:** Apps correctly reference `packages/database`

### Database Connection
- **Provider:** Neon PostgreSQL
- **Region:** us-east-2 (AWS)
- **Branch:** `production` (br-flat-wind-bex5f4n5)
- **Pooling:** Configured (DATABASE_URL uses pooler)
- **Direct Access:** Configured (DATABASE_URL_UNPOOLED)

### Schema Features
- ✅ UUID primary keys (`@db.Uuid`)
- ✅ Timestamp columns with timezone (`@db.Timestamptz(3)`)
- ✅ Proper foreign key relationships
- ✅ Indexes on common query fields
- ✅ Enums for status fields
- ✅ Many-to-many relationships (Post ↔ Category, Post ↔ Tag)

### Migration Status
- **Migrations Folder:** Not checked yet (workflow in progress)
- **Current State:** Unknown if production database has existing data
- **Recommendation:** 
  1. Use Neon branch/staging database for testing migrations
  2. Run `npm run db:migrate:deploy --workspace=packages/database`
  3. Verify schema matches before production deployment

### ⚠️ SQLite vs PostgreSQL Data Migration
If any SQLite database exists with production data:
1. Export data from SQLite
2. Transform to PostgreSQL format (UUIDs, timestamps)
3. Import via Prisma seed script
4. Verify data integrity

**Status:** Needs verification if SQLite database file exists.

---

## 🔧 TASK 3 — MONOREPO BUILD VERIFICATION: ⏳ IN PROGRESS

### Repository Structure
```
onefocus-monorepo/
├── apps/
│   ├── web/          → Public website (Next.js 15.5.29)
│   └── admin/        → Admin dashboard (Next.js 15.1.6)
├── packages/
│   ├── database/     → Shared Prisma schema & client
│   └── shared/       → Shared utilities
└── package.json      → Workspace root
```

### Workspace Configuration
- **Package Manager:** npm workspaces ✅
- **Node Version:** >=18.0.0 ✅ (currently 24.18.1)
- **TypeScript:** 5.8.3 ✅

### Dependency Management
```json
{
  "workspaces": ["apps/*", "packages/*"]
}
```

Both apps correctly import:
- `@onefocus/database` (Prisma client)
- `@onefocus/shared` (shared utilities)

### Build Commands
- **Web:** `npm run build:web` → `npm run build --workspace=apps/web`
- **Admin:** `npm run build:admin` → `npm run build --workspace=apps/admin`
- **Prisma:** `npm run db:generate --workspace=packages/database`

### Initial Build Attempt (apps/web)
**Status:** ❌ FAILED (TypeScript error)

**Error:**
```
./app/(routes)/blog/[slug]/page.tsx:179:13
Type error: Property 'image' does not exist on type 'SocialShareProps'.
```

**Fix Applied:** Removed invalid `image` prop from SocialShare component
**Status:** ✅ FIXED in commit 8f1e3b6

### Next Build Verification
**Status:** ⏳ WORKFLOW IN PROGRESS
- Workflow `wf_ec4bdee039d9cd51` is running build verification loop
- Will test both `apps/web` and `apps/admin` builds
- Will fix any remaining TypeScript/build errors

---

## 📦 TASK 4 — VERCEL CONFIGURATION: 📝 PENDING

**Status:** Waiting for builds to pass before creating Vercel configs

### Planned Vercel Projects

#### Project 1: ONEFOCUS WEB
- **Root Directory:** `apps/web`
- **Framework:** Next.js
- **Node Version:** 18.x
- **Install Command:** `cd ../.. && npm install`
- **Build Command:** `cd ../.. && npm run db:generate && npm run build:web`
- **Output Directory:** `apps/web/.next`

#### Project 2: ONEFOCUS ADMIN
- **Root Directory:** `apps/admin`
- **Framework:** Next.js
- **Node Version:** 18.x
- **Install Command:** `cd ../.. && npm install`
- **Build Command:** `cd ../.. && npm run db:generate && npm run build:admin`
- **Output Directory:** `apps/admin/.next`

### Required Environment Variables
See `SECURITY-ROTATION-REQUIRED.md` for complete list with rotation instructions.

---

## 📁 TASK 5 — CONTENT SYNCHRONIZATION: ⚠️ CRITICAL ISSUE

### Media Storage Problem Identified

**Current Implementation:**
```typescript
// apps/admin/app/api/admin/media/route.ts
const uploadDir = join(process.cwd(), '..', 'web', 'public', 'uploads')
```

**Issues:**
1. ❌ Saves to `apps/web/public/uploads` (local filesystem)
2. ❌ Vercel filesystem is **ephemeral** — files lost on redeployment
3. ❌ Cross-app file access won't work (separate Vercel deployments)
4. ❌ No CDN/optimization for uploaded images

**Dependencies Available:**
- ✅ `@vercel/blob` already installed in `apps/admin/package.json`

**REQUIRED BEFORE PRODUCTION:**
Migrate media upload to **Vercel Blob Storage**

**Migration Steps:**
1. Update `apps/admin/app/api/admin/media/route.ts` to use Vercel Blob
2. Add `BLOB_READ_WRITE_TOKEN` environment variable
3. Update `MediaAsset` model to store blob URLs
4. Migrate any existing uploads to Blob Storage
5. Update `apps/web` to fetch images from blob URLs

**Risk:** High — content publishing workflow will fail in production without this fix.

### Content Publishing Workflow
After migration, the workflow will be:
1. Admin logs in → `apps/admin` (admin.onefocusafrica.com)
2. Uploads image → Vercel Blob Storage (permanent, CDN-backed)
3. Creates blog post → PostgreSQL (Neon)
4. Publishes post → Updates `publishedAt` timestamp
5. Public website queries published posts → `apps/web` (www.onefocusafrica.com)
6. Images load from Vercel Blob CDN

**Revalidation:** ISR or on-demand revalidation needed for instant updates

---

## 🚀 TASK 6 — PRODUCTION VERIFICATION: 🔜 NOT STARTED

Checklist (to be completed post-deployment):
- [ ] Public homepage loads
- [ ] Blog listing shows published posts
- [ ] Individual blog post pages render
- [ ] Contact form submissions work
- [ ] Admin login/logout works
- [ ] Admin can upload images (via Blob)
- [ ] Admin can create draft posts
- [ ] Admin can publish posts
- [ ] Published posts appear on public site without redeployment
- [ ] Mobile responsiveness verified
- [ ] HTTPS works on custom domains
- [ ] Error logging configured

---

## 📊 CURRENT STATUS SUMMARY

| Task | Status | Blocker |
|------|--------|---------|
| Security Audit | ✅ COMPLETE | ⚠️ Credentials must be rotated |
| Database Readiness | ✅ SCHEMA READY | ⚠️ Migrations not run yet |
| Build Verification | ⏳ IN PROGRESS | Workflow running |
| Vercel Configuration | 📝 PENDING | Awaiting build success |
| Content Sync (Media) | ❌ CRITICAL ISSUE | Filesystem storage won't work on Vercel |
| Production Verification | 🔜 NOT STARTED | Deployment not done yet |
| Launch | 🔒 BLOCKED | Credential rotation + media storage |

---

## 🚨 DEPLOYMENT BLOCKERS

### Critical (Must Fix Before Deployment)
1. **Credential Rotation** — Database and admin passwords exposed
2. **Media Storage Migration** — Local filesystem won't work on Vercel

### High Priority (Should Fix Before Launch)
3. **Admin Middleware** — Add route-level protection for defense-in-depth
4. **Database Migrations** — Test and run migrations safely

### Medium Priority (Can Fix Post-Launch)
5. **Role-Based Permissions** — Enforce ADMIN/EDITOR roles on sensitive operations
6. **ISR/Revalidation** — Configure caching strategy for published content

---

## 📋 NEXT STEPS

### Immediate (Orchestrator)
1. ✅ Wait for workflow build verification to complete
2. ✅ Review workflow findings and fix any remaining build errors
3. ✅ Create Vercel configuration files once builds pass

### Before Production Deployment (Manual)
1. **Rotate all exposed credentials** (see SECURITY-ROTATION-REQUIRED.md)
2. **Migrate media upload to Vercel Blob Storage**
3. **Test database migrations on Neon staging branch**
4. **Create admin user using secure local script**

### Vercel Deployment (Manual)
1. Create Project 1: ONEFOCUS WEB
   - Import: https://github.com/Alain383/onefocusafrica
   - Root: `apps/web`
   - Add environment variables
2. Create Project 2: ONEFOCUS ADMIN
   - Import: https://github.com/Alain383/onefocusafrica
   - Root: `apps/admin`
   - Add environment variables
3. Deploy both projects
4. Configure custom domains
5. Run production verification tests

---

## 📞 QUESTIONS FOR USER

1. **Do you have a custom domain purchased?** (www.onefocusafrica.com, admin.onefocusafrica.com)
2. **Do you have existing production data in a SQLite database that needs migration?**
3. **Should I proceed with migrating media storage to Vercel Blob immediately, or deploy first with a temporary workaround?**

---

**Workflow Status:** Build verification loop running  
**Workflow ID:** wf_ec4bdee039d9cd51  
**Next Update:** After workflow completion
