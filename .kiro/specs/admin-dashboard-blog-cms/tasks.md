# Implementation Plan: Admin Dashboard & Blog CMS

## Overview

Implement a secure, additive admin dashboard and blog CMS on top of the existing ONEFOCUS AFRICA Next.js 15 app. All work is layered under `/admin` and `/blog` routes — no existing public pages, API routes, or Prisma models are modified. The implementation follows the order: dependencies → schema → auth → admin shell → blog management → media → public blog → inquiries → content/portfolio → programs/events → team/settings → SEO → tests.

**Current Status:** Core implementation complete. Bug fixes and production deployment in progress.

---

## Tasks

- [x] 1. Install dependencies and extend Prisma schema
  - [x] 1.1 Install new npm packages
  - [x] 1.2 Extend `prisma/schema.prisma` with new models
  - [ ]* 1.3 Write unit test for schema integrity

- [x] 2. Core utilities — slug, upload, sanitize, auth helpers
  - [x] 2.1 Implement `lib/slug.ts`
  - [ ]* 2.2 Write property test for `generateSlug` (Property 1)
  - [ ]* 2.3 Write property test for `ensureUniqueSlug` (Property 2)
  - [x] 2.4 Implement `lib/upload.ts`
  - [ ]* 2.5 Write property test for MIME type validation (Property 3)
  - [ ]* 2.6 Write property test for file size validation (Property 4)
  - [x] 2.7 Implement `lib/sanitize.ts`
  - [ ]* 2.8 Write property test for `sanitizeHtml` (Property 7)

- [x] 3. Authentication — NextAuth v5, middleware, login page
  - [x] 3.1 Implement `lib/auth.ts`
  - [x] 3.2 Implement `lib/auth-utils.ts`
  - [ ]* 3.3 Write property test for `requireRole` (Property 6)
  - [x] 3.4 Implement `middleware.ts` (NEEDS FIX - currently disabled due to infinite loop)
  - [ ]* 3.5 Write property test for middleware auth guard (Property 10)
  - [x] 3.6 Implement password hashing utilities and seed script
  - [ ]* 3.7 Write property test for password hashing round-trip (Property 5)
  - [x] 3.8 Implement admin login page at `app/admin/login/page.tsx`
  - [x] 3.9 Add NextAuth route handler at `app/api/auth/[...nextauth]/route.ts`

- [x] 4. Admin shell — layout, sidebar, topbar, shared components
  - [x] 4.1 Implement `app/admin/layout.tsx`
  - [x] 4.2 Implement `components/admin/Sidebar.tsx`
  - [x] 4.3 Implement `components/admin/TopBar.tsx`
  - [x] 4.4 Implement shared admin UI components

- [x] 5. Admin overview dashboard
  - [x] 5.1 Implement `app/admin/page.tsx` (dashboard overview)

- [x] 6. Blog management — post list, editor, categories, tags
  - [x] 6.1 Implement `app/admin/blog/page.tsx` (post list)
  - [x] 6.2 Implement `components/admin/editor/RichTextEditor.tsx`
  - [x] 6.3 Implement `components/admin/editor/SlugField.tsx`
  - [x] 6.4 Implement `components/admin/editor/SeoFields.tsx`
  - [ ]* 6.5 Write property test for SEO character counter state (Property 8)
  - [x] 6.6 Implement `components/admin/editor/StatusSelector.tsx`
  - [x] 6.7 Implement `app/admin/blog/new/page.tsx` and `app/admin/blog/[id]/edit/page.tsx`
  - [x] 6.8 Implement `savePost` and `deletePost` Server Actions in `app/admin/blog/actions.ts`
  - [x] 6.9 Implement categories and tags management in `app/admin/blog/categories/page.tsx`
  - [x] 6.10 Implement `PostCategory` and `PostTag` Server Actions in `app/admin/blog/categories/actions.ts`

- [x] 7. Checkpoint — Blog management working

- [x] 8. Media library
  - [x] 8.1 Implement `app/admin/media/page.tsx` (media library)
  - [x] 8.2 Implement `components/admin/MediaGrid.tsx`
  - [x] 8.3 Implement media upload API route at `app/api/admin/media/route.ts`

- [x] 9. Public blog — listing and article pages
  - [x] 9.1 Implement `app/blog/page.tsx` (public blog listing)
  - [x] 9.2 Implement `app/blog/[slug]/page.tsx` (public article page)
  - [x] 9.3 Implement `app/sitemap.ts` (extended XML sitemap)
  - [ ]* 9.4 Write property test for sitemap correctness (Property 9)

- [x] 10. Business inquiry management
  - [x] 10.1 Implement `app/admin/inquiries/page.tsx`
  - [x] 10.2 Implement `app/admin/inquiries/[id]/page.tsx` (inquiry detail)
  - [x] 10.3 Implement `updateInquiry` Server Action in `app/admin/inquiries/actions.ts`

- [x] 11. Website content and portfolio management
  - [x] 11.1 Implement `app/admin/content/page.tsx`
  - [x] 11.2 Implement `upsertSiteContent` Server Action in `app/admin/content/actions.ts`
  - [x] 11.3 Implement `app/admin/portfolio/page.tsx` (case study management)
  - [x] 11.4 Implement `app/admin/portfolio/new/page.tsx` and `app/admin/portfolio/[id]/edit/page.tsx`
  - [x] 11.5 Implement `saveCaseStudy` and `deleteCaseStudy` Server Actions in `app/admin/portfolio/actions.ts`

- [x] 12. Programs and Events management
  - [x] 12.1 Implement `app/admin/programs/page.tsx`
  - [x] 12.2 Implement program create/edit form and `saveProgram` Server Action
  - [x] 12.3 Implement `app/admin/events/page.tsx`
  - [x] 12.4 Implement event create/edit form and `saveEvent` Server Action

- [x] 13. Team and Settings management (ADMIN-only)
  - [x] 13.1 Implement `app/admin/team/page.tsx`
  - [x] 13.2 Implement Admin_User management Server Actions in `app/admin/team/actions.ts`
  - [ ]* 13.3 Write property test for last-ADMIN guard (Property 11)
  - [x] 13.4 Implement TeamMember management Server Actions in `app/admin/team/actions.ts`
  - [x] 13.5 Implement `app/admin/settings/page.tsx` and `saveSettings` Server Action

- [x] 14. Checkpoint — All admin modules working

- [ ] 15. End-to-end integration test
  - [ ] 15.1 Write Playwright end-to-end test covering the critical path
  - [ ]* 15.2 Write unit tests for specific example behaviours

- [x] 16. Build verification and quality gate
  - [x] 16.1 Configure Vitest
  - [x] 16.2 Run `next build` and fix all TypeScript and ESLint errors

- [x] 17. Final checkpoint — Build passes and tests pass

---

## Bug Fixes & Production Readiness (NEW)

- [x] 18. Fix Prisma logConfig type error
  - [x] 18.1 Update `packages/database/src/index.ts` to use `Prisma.LogLevel[]` instead of readonly array
  - Fixed in commit: 636e66e

- [x] 19. Fix React hydration error in Footer
  - [x] 19.1 Convert Footer to client component with useEffect for date rendering
  - Prevents server/client mismatch on `new Date().getFullYear()`

- [x] 20. Fix mobile navbar visibility
  - [x] 20.1 Update Header component to show "ONEFOCUS AFRICA" text on all screen sizes
  - Changed from `hidden sm:block` to responsive text sizing `text-xs sm:text-sm`

- [x] 21. Fix conditional layout routing
  - [x] 21.1 Create `components/ConditionalLayout.tsx` to conditionally render Header/Footer
  - [x] 21.2 Update root `app/layout.tsx` to use ConditionalLayout wrapper
  - Ensures public pages show navigation, admin pages show clean interface

- [x] 22. Fix database connection path
  - [x] 22.1 Update `.env.local` DATABASE_URL from `file:./prisma/dev.db` to `file:./prisma/prisma/dev.db`
  - Resolves "database not found" errors preventing login/dashboard access

- [ ] 23. Fix middleware infinite redirect loop (CRITICAL)
  - [ ] 23.1 Current status: Middleware disabled (renamed to `middleware.ts.backup`)
  - [ ] 23.2 Create simplified middleware that doesn't cause redirect loops
  - [ ] 23.3 Test middleware with login → dashboard → logout flow
  - [ ] 23.4 Re-enable middleware once stable
  - **Blocker:** Admin routes require authentication but middleware causes infinite loop

- [ ] 24. Database migration to PostgreSQL (DEPLOYMENT)
  - [ ] 24.1 Update Prisma schema for PostgreSQL compatibility
  - [ ] 24.2 Create migration script to transfer SQLite data to PostgreSQL
  - [ ] 24.3 Update `.env.local` with PostgreSQL connection string
  - [ ] 24.4 Run Prisma migrations and verify data integrity
  - **Note:** Deferred until deployment phase per monorepo migration plan

---

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP build
- Each task references specific requirements from `requirements.md` for traceability
- All admin routes enforce authentication via `app/admin/layout.tsx` which calls `auth()`
- **CRITICAL ISSUE:** Middleware is currently disabled due to infinite redirect loop - needs immediate fix
- **DATABASE:** Currently using SQLite at `./prisma/prisma/dev.db` - will migrate to PostgreSQL during deployment
- Property-based tests use `fast-check` with `numRuns: 100` minimum
- The `seed:admin` script creates the first admin account
- Auto-save in the post editor uses a 30-second interval

## Recent Changes

**2026-11-05:**
- Fixed Prisma type error preventing build completion
- Fixed React hydration error in Footer component
- Fixed mobile navbar visibility issue
- Fixed database connection path mismatch
- Created conditional layout system for public vs admin routes
- **Identified critical middleware issue** - causing infinite redirect loops, currently disabled

## Next Priority

1. **Fix middleware authentication** - The admin dashboard requires proper authentication middleware without causing redirect loops
2. **Test complete login flow** - Verify login → dashboard → navigation → logout works end-to-end
3. **Enable role-based access control** - Restore middleware to enforce ADMIN vs EDITOR permissions
4. **Write critical integration tests** - Cover authentication, post creation, and publishing workflows
5. **Prepare for monorepo migration** - Tasks 8-9 from monorepo-migration-dual-apps spec

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["1.3", "2.1", "2.4", "2.7", "16.1"] },
    { "id": 2, "tasks": ["2.2", "2.3", "2.5", "2.6", "2.8", "3.1"] },
    { "id": 3, "tasks": ["3.2", "3.6"] },
    { "id": 4, "tasks": ["3.3", "3.4", "3.7", "3.8", "3.9"] },
    { "id": 5, "tasks": ["3.5", "4.1"] },
    { "id": 6, "tasks": ["4.2", "4.3", "4.4"] },
    { "id": 7, "tasks": ["5.1"] },
    { "id": 8, "tasks": ["6.1", "6.2", "6.7"] },
    { "id": 9, "tasks": ["6.3", "6.4", "6.6", "6.8", "6.9"] },
    { "id": 10, "tasks": ["6.5", "6.10", "8.1", "9.1", "9.3", "10.1", "11.1", "11.3", "12.1", "12.3", "13.1", "13.5"] },
    { "id": 11, "tasks": ["8.2", "8.3", "9.2", "9.4", "10.2", "10.3", "11.2", "11.4", "12.2", "12.4", "13.2", "13.4"] },
    { "id": 12, "tasks": ["11.5", "13.3"] },
    { "id": 13, "tasks": ["15.1", "15.2", "16.2"] },
    { "id": 14, "tasks": ["18.1", "19.1", "20.1", "21.1", "21.2", "22.1"] },
    { "id": 15, "tasks": ["23.1", "23.2", "23.3", "23.4"] }
  ]
}
```
