# Implementation Plan: Monorepo Migration for Dual Applications

## Overview

This implementation plan guides the migration of the ONEFOCUS AFRICA single Next.js application into a dual-application monorepo architecture. The migration will separate the public website (www.onefocusafrica.com) from the admin dashboard (admin.onefocusafrica.com) while enabling independent deployments, shared database access, and real-time content synchronization.

The implementation follows a structured approach: pre-migration preparation → monorepo setup → shared packages creation → database migration → application separation → content synchronization → testing → deployment configuration → post-migration validation.

## Tasks

- [ ] 1. Pre-Migration Preparation and Backup
  - Create a new git branch `feat/monorepo-migration` from main
  - Create a `backups/` directory at the project root
  - Create a timestamped backup of the SQLite database file (prisma/dev.db)
  - Document the current application structure in `MIGRATION.md`
  - Take inventory of all routes, components, and API endpoints
  - Verify all tests pass in the current application
  - _Requirements: 1.12, 11.11, 13.6, 13.7, 20.1_

- [ ] 2. Create Monorepo Root Configuration
  - [ ] 2.1 Create root-level directory structure
    - Create `apps/` directory for applications
    - Create `packages/` directory for shared packages
    - Create `scripts/` directory for utility scripts
    - _Requirements: 1.1, 1.2_

  - [ ] 2.2 Create root package.json with workspace configuration
    - Set name to "onefocus-monorepo"
    - Set private to true
    - Configure workspaces array: ["apps/*", "packages/*"]
    - Add workspace-level scripts: dev:web, dev:admin, dev:all, build:web, build:admin, build:all, test:web, test:admin, test:all, db:generate, db:migrate, db:migrate:deploy, db:studio
    - Add devDependencies: @types/node, typescript, eslint, concurrently
    - _Requirements: 1.3, 1.4, 1.9_

  - [ ] 2.3 Create root tsconfig.json with workspace references
    - Configure base compiler options for ES2020
    - Add project references for apps/web, apps/admin, packages/database, packages/shared
    - Set up strict type checking
    - _Requirements: 16.10_

  - [ ] 2.4 Update .gitignore for monorepo structure
    - Add workspace-specific build artifacts patterns
    - Add node_modules patterns for all workspaces
    - Add .next/ patterns for both applications
    - _Requirements: 1.12_

- [ ] 3. Create Shared Database Package
  - [ ] 3.1 Create database package structure
    - Create `packages/database/` directory
    - Create `packages/database/src/` directory for TypeScript exports
    - Create `packages/database/prisma/` directory for schema and migrations
    - Create `packages/database/scripts/` directory for migration scripts
    - _Requirements: 5.2, 5.3_

  - [ ] 3.2 Create database package.json
    - Set name to "@onefocus/database"
    - Set main to "./src/index.ts"
    - Add dependencies: @prisma/client
    - Add devDependencies: prisma, typescript
    - Add scripts: generate, migrate, migrate:deploy, studio, push
    - _Requirements: 5.4, 5.5, 5.6, 5.11_

  - [ ] 3.3 Create database tsconfig.json
    - Extend from root tsconfig.json
    - Configure output settings for package
    - _Requirements: 5.10_

  - [ ] 3.4 Migrate Prisma schema to PostgreSQL
    - Copy existing prisma/schema.prisma to packages/database/prisma/schema.prisma
    - Change datasource provider from "sqlite" to "postgresql"
    - Add PostgreSQL-specific type optimizations (@db.Uuid, @db.VarChar, @db.Text, @db.Timestamptz, etc.)
    - Preserve all 13 models with their fields, relations, indexes, and enums
    - Update UUID generation from cuid() to uuid()
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [ ] 3.5 Create Prisma client singleton export
    - Create packages/database/src/index.ts
    - Implement singleton pattern for PrismaClient
    - Configure logging based on NODE_ENV
    - Re-export all Prisma types
    - _Requirements: 5.1, 5.7, 5.8, 5.9, 5.10_

- [ ] 4. Create Shared Utilities Package
  - [ ] 4.1 Create shared package structure
    - Create `packages/shared/` directory
    - Create `packages/shared/src/` directory
    - Create subdirectories: types/, validation/, utils/
    - _Requirements: 6.2, 6.3_

  - [ ] 4.2 Create shared package.json
    - Set name to "@onefocus/shared"
    - Set main to "./src/index.ts"
    - Add dependencies: zod, nodemailer, dompurify, jsdom
    - Add devDependencies: @types/nodemailer, @types/dompurify, @types/jsdom, typescript
    - _Requirements: 6.11_

  - [ ] 4.3 Create shared tsconfig.json
    - Extend from root tsconfig.json
    - Configure output settings for package
    - _Requirements: 6.7, 6.8_

  - [ ] 4.4 Migrate utilities to shared package
    - Copy validation schemas from lib/validations.ts to packages/shared/src/validation/
    - Copy email utility from lib/email.ts to packages/shared/src/utils/email.ts
    - Copy slug utility from lib/slug.ts to packages/shared/src/utils/slug.ts
    - Copy sanitize utility from lib/sanitize.ts to packages/shared/src/utils/sanitize.ts
    - Create packages/shared/src/types/ for shared TypeScript types
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [ ] 4.5 Create shared package index export
    - Create packages/shared/src/index.ts
    - Export all utilities from validation, types, and utils
    - _Requirements: 6.6, 6.9, 6.10_

- [ ] 5. Database Migration Script Development
  - [ ] 5.1 Create SQLite to PostgreSQL migration script
    - Create packages/database/scripts/migrate-sqlite-to-postgres.ts
    - Implement dual Prisma client initialization (SQLite source, PostgreSQL target)
    - Implement connection validation for both databases
    - Implement record counting logic for verification
    - Implement model iteration and data transfer logic
    - Implement error logging and reporting
    - _Requirements: 2.5, 2.6, 2.8, 11.1, 11.2_

  - [ ] 5.2 Add backup and verification logic
    - Implement timestamped SQLite backup creation before migration
    - Implement record count verification after migration
    - Implement UUID, foreign key, and timestamp preservation
    - Implement enum value preservation
    - Generate migration report JSON with record counts and errors
    - _Requirements: 2.9, 11.3, 11.4, 11.5, 11.6, 11.7, 11.8, 11.9, 11.10, 11.11, 11.12_

- [ ] 6. Checkpoint - Verify Shared Packages
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Create Public Web Application Structure
  - [ ] 7.1 Create web application directory and basic configuration
    - Create `apps/web/` directory
    - Create apps/web/package.json with name "@onefocus/web"
    - Add dependencies: next, react, react-dom, framer-motion, zod
    - Add workspace dependencies: @onefocus/database, @onefocus/shared
    - Add devDependencies: typescript, tailwindcss, autoprefixer, postcss, vitest, fast-check
    - Add scripts: dev, build, start, lint, test
    - _Requirements: 1.5, 3.11, 3.12, 17.1_

  - [ ] 7.2 Create web application TypeScript configuration
    - Create apps/web/tsconfig.json extending root config
    - Configure path aliases: @/* for local imports, @onefocus/database, @onefocus/shared
    - Add Next.js plugin configuration
    - _Requirements: 16.1, 16.3, 16.5, 16.7, 16.8_

  - [ ] 7.3 Create web application Next.js configuration
    - Create apps/web/next.config.js
    - Configure image domains for Vercel Blob
    - Configure experimental features as needed
    - _Requirements: 3.1_

  - [ ] 7.4 Create web application Tailwind configuration
    - Create apps/web/tailwind.config.js
    - Copy content paths from existing config
    - Copy theme extensions from existing config
    - _Requirements: 3.1_

  - [ ] 7.5 Create web application Vitest configuration
    - Create apps/web/vitest.config.ts
    - Configure path aliases matching tsconfig
    - Configure test environment for React
    - _Requirements: 17.1, 17.6_

- [ ] 8. Migrate Public Routes to Web Application
  - [ ] 8.1 Create web application directory structure
    - Create apps/web/app/ directory
    - Create apps/web/app/(routes)/ directory for route groups
    - Create apps/web/components/ directory
    - Create apps/web/lib/ directory
    - Create apps/web/public/ directory
    - _Requirements: 3.1_

  - [ ] 8.2 Migrate root layout and global styles
    - Copy app/layout.tsx to apps/web/app/layout.tsx (public layout only)
    - Copy app/globals.css to apps/web/app/globals.css
    - Update import paths to use @onefocus/* aliases
    - Remove admin-specific layout code
    - _Requirements: 3.5, 16.7_

  - [ ] 8.3 Migrate public page routes
    - Copy app/page.tsx to apps/web/app/(routes)/page.tsx (home page)
    - Copy app/about/page.tsx to apps/web/app/(routes)/about/page.tsx
    - Copy app/solutions/page.tsx to apps/web/app/(routes)/solutions/page.tsx
    - Copy app/work/page.tsx to apps/web/app/(routes)/work/page.tsx
    - Copy app/talent/page.tsx to apps/web/app/(routes)/talent/page.tsx
    - Copy app/contact/page.tsx to apps/web/app/(routes)/contact/page.tsx
    - Copy app/privacy/page.tsx to apps/web/app/(routes)/privacy/page.tsx
    - Copy app/terms/page.tsx to apps/web/app/(routes)/terms/page.tsx
    - Update all imports to use @onefocus/database and @onefocus/shared
    - _Requirements: 3.1, 12.1_

  - [ ] 8.4 Migrate blog routes
    - Copy app/blog/page.tsx to apps/web/app/(routes)/blog/page.tsx
    - Copy app/blog/[slug]/page.tsx to apps/web/app/(routes)/blog/[slug]/page.tsx
    - Update database queries to filter only published posts (status === "PUBLISHED")
    - Configure ISR with revalidate: 3600
    - _Requirements: 3.1, 3.10, 7.9, 12.2, 12.3_

  - [ ] 8.5 Migrate special routes
    - Copy app/sitemap.ts to apps/web/app/sitemap.ts
    - Copy app/error.tsx to apps/web/app/error.tsx
    - Copy app/loading.tsx to apps/web/app/loading.tsx
    - Copy app/not-found.tsx to apps/web/app/not-found.tsx
    - Update imports as needed
    - _Requirements: 3.1_

  - [ ] 8.6 Migrate public components
    - Copy components/sections/ to apps/web/components/sections/
    - Copy components/forms/ to apps/web/components/forms/
    - Update all imports to use @onefocus/database and @onefocus/shared
    - _Requirements: 3.3, 3.4_

  - [ ] 8.7 Copy public assets
    - Copy public/ directory contents to apps/web/public/
    - _Requirements: 3.1_

- [ ] 9. Migrate Public API Routes to Web Application
  - [ ] 9.1 Create API directory structure
    - Create apps/web/app/api/ directory
    - Create apps/web/app/api/inquiries/ directory
    - Create apps/web/app/api/community/ directory
    - _Requirements: 3.2, 18.1, 18.2_

  - [ ] 9.2 Migrate inquiries API route
    - Copy app/api/inquiries/route.ts to apps/web/app/api/inquiries/route.ts
    - Update imports to use @onefocus/database for Prisma client
    - Update imports to use @onefocus/shared for validation
    - Test inquiry creation functionality
    - _Requirements: 3.2, 3.14, 12.4, 18.7_

  - [ ] 9.3 Migrate community API route
    - Copy app/api/community/route.ts to apps/web/app/api/community/route.ts
    - Update imports to use @onefocus/database for Prisma client
    - Update imports to use @onefocus/shared for validation
    - Test newsletter subscription functionality
    - _Requirements: 3.2, 3.15, 12.5, 18.8_

- [ ] 10. Create Admin Application Structure
  - [ ] 10.1 Create admin application directory and basic configuration
    - Create `apps/admin/` directory
    - Create apps/admin/package.json with name "@onefocus/admin"
    - Add dependencies: next, react, react-dom, next-auth, @auth/prisma-adapter, bcryptjs, @tiptap/react, @tiptap/starter-kit, @tiptap/extension-link, @tiptap/extension-placeholder, @tiptap/pm, @vercel/blob, framer-motion, zod
    - Add workspace dependencies: @onefocus/database, @onefocus/shared
    - Add devDependencies: typescript, @types/bcryptjs, tailwindcss, autoprefixer, postcss, vitest, fast-check
    - Add scripts: dev (with -p 3001), build, start (with -p 3001), lint, test
    - _Requirements: 1.6, 4.9, 4.10, 17.2_

  - [ ] 10.2 Create admin application TypeScript configuration
    - Create apps/admin/tsconfig.json extending root config
    - Configure path aliases: @/* for local imports, @onefocus/database, @onefocus/shared
    - Add Next.js plugin configuration
    - _Requirements: 16.2, 16.4, 16.6, 16.7, 16.9_

  - [ ] 10.3 Create admin application Next.js configuration
    - Create apps/admin/next.config.js
    - Configure image domains for Vercel Blob
    - Configure experimental features as needed
    - _Requirements: 4.1_

  - [ ] 10.4 Create admin application Tailwind configuration
    - Create apps/admin/tailwind.config.js
    - Copy content paths from existing config
    - Copy theme extensions from existing config
    - _Requirements: 4.1_

  - [ ] 10.5 Create admin application Vitest configuration
    - Create apps/admin/vitest.config.ts
    - Configure path aliases matching tsconfig
    - Configure test environment for React
    - _Requirements: 17.2, 17.6_

- [ ] 11. Migrate Admin Routes to Admin Application
  - [ ] 11.1 Create admin application directory structure
    - Create apps/admin/app/ directory
    - Create apps/admin/app/admin/ directory for admin routes
    - Create apps/admin/components/ directory
    - Create apps/admin/lib/ directory
    - _Requirements: 4.1_

  - [ ] 11.2 Migrate admin layout and global styles
    - Copy app/layout.tsx to apps/admin/app/layout.tsx (base layout)
    - Copy app/admin/layout.tsx to apps/admin/app/admin/layout.tsx (admin-specific layout)
    - Copy app/globals.css to apps/admin/app/globals.css
    - Copy app/error.tsx to apps/admin/app/error.tsx
    - Update import paths to use @onefocus/* aliases
    - _Requirements: 4.4, 16.7_

  - [ ] 11.3 Migrate admin page routes - Dashboard and Login
    - Copy app/admin/page.tsx to apps/admin/app/admin/page.tsx (dashboard)
    - Copy app/admin/login/page.tsx to apps/admin/app/admin/login/page.tsx
    - Update all imports to use @onefocus/database and @onefocus/shared
    - _Requirements: 4.1, 12.6, 12.7_

  - [ ] 11.4 Migrate admin page routes - Blog Management
    - Copy app/admin/blog/ directory to apps/admin/app/admin/blog/
    - Include: page.tsx, new/page.tsx, [id]/edit/page.tsx, categories/page.tsx
    - Include: BlogTable.tsx, BlogFilters.tsx, PostEditor.tsx, actions.ts
    - Update all imports to use @onefocus/database and @onefocus/shared
    - _Requirements: 4.1, 12.8, 12.9_

  - [ ] 11.5 Migrate admin page routes - Portfolio Management
    - Copy app/admin/portfolio/ directory to apps/admin/app/admin/portfolio/
    - Include: page.tsx, new/page.tsx, [id]/edit/page.tsx
    - Include: PortfolioTable.tsx, CaseStudyForm.tsx, actions.ts
    - Update all imports to use @onefocus/database and @onefocus/shared
    - _Requirements: 4.1, 12.13, 12.14_

  - [ ] 11.6 Migrate admin page routes - Inquiries Management
    - Copy app/admin/inquiries/ directory to apps/admin/app/admin/inquiries/
    - Include: page.tsx, [id]/page.tsx, InquiryDetailClient.tsx, actions.ts
    - Update all imports to use @onefocus/database and @onefocus/shared
    - _Requirements: 4.1, 12.12_

  - [ ] 11.7 Migrate admin page routes - Other Management Pages
    - Copy app/admin/programs/ directory to apps/admin/app/admin/programs/
    - Copy app/admin/events/ directory to apps/admin/app/admin/events/
    - Copy app/admin/team/ directory to apps/admin/app/admin/team/
    - Copy app/admin/media/ directory to apps/admin/app/admin/media/
    - Copy app/admin/content/ directory to apps/admin/app/admin/content/
    - Copy app/admin/settings/ directory to apps/admin/app/admin/settings/
    - Update all imports to use @onefocus/database and @onefocus/shared
    - _Requirements: 4.1_

  - [ ] 11.8 Migrate admin components
    - Copy components/admin/ to apps/admin/components/admin/
    - Include DataTable, RichTextEditor, MediaGrid, PageHeader, ConfirmDialog, and editor components
    - Update all imports to use @onefocus/database and @onefocus/shared
    - _Requirements: 4.3, 14.6, 14.7, 14.8_

- [ ] 12. Migrate Admin API Routes to Admin Application
  - [ ] 12.1 Create admin API directory structure
    - Create apps/admin/app/api/ directory
    - Create apps/admin/app/api/auth/ directory
    - Create apps/admin/app/api/admin/ directory
    - _Requirements: 4.2, 18.3, 18.4, 18.5_

  - [ ] 12.2 Migrate NextAuth API route
    - Copy app/api/auth/[...nextauth]/route.ts to apps/admin/app/api/auth/[...nextauth]/route.ts
    - Update imports to use @onefocus/database for Prisma client
    - Configure NEXTAUTH_URL for admin domain
    - _Requirements: 4.2, 9.4, 18.3_

  - [ ] 12.3 Migrate authentication utilities
    - Copy lib/auth.ts to apps/admin/lib/auth.ts
    - Copy lib/auth-utils.ts to apps/admin/lib/auth-utils.ts
    - Update imports to use @onefocus/database
    - Configure session management with secure, httpOnly cookies
    - _Requirements: 4.5, 9.11, 9.12_

  - [ ] 12.4 Migrate media upload API route
    - Copy app/api/admin/media/route.ts to apps/admin/app/api/admin/media/route.ts
    - Copy lib/upload.ts to apps/admin/lib/upload.ts
    - Update imports to use @onefocus/database
    - Test file upload to Vercel Blob
    - _Requirements: 4.2, 4.6, 12.11, 12.15, 15.2, 15.8, 18.9_

  - [ ] 12.5 Migrate slug-check API route
    - Copy app/api/admin/slug-check/route.ts to apps/admin/app/api/admin/slug-check/route.ts
    - Update imports to use @onefocus/database
    - _Requirements: 4.2, 18.5_

- [ ] 13. Implement Content Synchronization
  - [ ] 13.1 Create revalidation webhook in web application
    - Create apps/web/app/api/revalidate/route.ts
    - Implement POST handler with token authentication
    - Implement path-based revalidation using revalidatePath
    - Implement tag-based revalidation using revalidateTag
    - Return JSON response with revalidation status
    - _Requirements: 7.2, 7.3, 7.4, 7.5, 9.1, 9.8, 18.6, 18.10_

  - [ ] 13.2 Create revalidation client utility in admin application
    - Create apps/admin/lib/revalidation.ts
    - Implement triggerRevalidation function
    - Use WEB_APP_URL environment variable
    - Use ADMIN_REVALIDATION_TOKEN for authentication
    - Implement error logging for failed requests
    - _Requirements: 7.1, 9.6, 10.9_

  - [ ] 13.3 Integrate revalidation into blog publishing flow
    - Update apps/admin/app/admin/blog/actions.ts
    - Call triggerRevalidation(['/blog', `/blog/${slug}`]) when publishing a post
    - _Requirements: 7.6, 12.10_

  - [ ] 13.4 Integrate revalidation into portfolio publishing flow
    - Update apps/admin/app/admin/portfolio/actions.ts
    - Call triggerRevalidation(['/work']) when publishing a case study
    - _Requirements: 7.7_

  - [ ] 13.5 Integrate revalidation into content update flow
    - Update apps/admin/app/admin/content/actions.ts
    - Call triggerRevalidation for affected pages when updating site content
    - _Requirements: 7.8_

- [ ] 14. Checkpoint - Test Applications Locally
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 15. Execute Database Migration
  - [ ] 15.1 Set up PostgreSQL database
    - Create PostgreSQL database instance on chosen provider (Railway, Supabase, Neon, or Vercel Postgres)
    - Configure connection pooling based on provider requirements
    - Obtain DATABASE_URL connection string
    - _Requirements: 2.10, 19.1, 19.2, 19.6_

  - [ ] 15.2 Configure environment variables for migration
    - Set SQLITE_DATABASE_URL pointing to existing SQLite database
    - Set DATABASE_URL pointing to PostgreSQL database
    - _Requirements: 5.11, 10.7_

  - [ ] 15.3 Run Prisma migrations to PostgreSQL
    - Run `npm run db:generate` to generate Prisma client
    - Run `npm run db:migrate` to create PostgreSQL schema
    - Verify all tables, indexes, and constraints are created
    - _Requirements: 2.1, 2.11_

  - [ ] 15.4 Execute migration script
    - Run `node packages/database/scripts/migrate-sqlite-to-postgres.ts`
    - Monitor console output for progress
    - Verify backup file is created in backups/ directory
    - Verify migration report JSON is generated
    - _Requirements: 2.5, 2.6, 2.7, 11.3, 11.4, 11.5_

  - [ ] 15.5 Verify migration success
    - Review migration report for record count matches
    - Review migration report for any errors
    - Query PostgreSQL database to spot-check data integrity
    - _Requirements: 2.7, 11.5, 11.12_

- [ ] 16. Create Environment Variable Configuration
  - [ ] 16.1 Create web application environment variables template
    - Create apps/web/.env.example
    - Document: DATABASE_URL, BLOB_READ_WRITE_TOKEN, ADMIN_REVALIDATION_TOKEN, NEXT_PUBLIC_SITE_URL
    - Add descriptions and example values for each variable
    - _Requirements: 10.1, 10.3, 10.10_

  - [ ] 16.2 Create admin application environment variables template
    - Create apps/admin/.env.example
    - Document: DATABASE_URL, BLOB_READ_WRITE_TOKEN, NEXTAUTH_SECRET, NEXTAUTH_URL, ADMIN_REVALIDATION_TOKEN, WEB_APP_URL, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
    - Add descriptions and example values for each variable
    - _Requirements: 10.2, 10.4, 10.9, 10.10_

  - [ ] 16.3 Create local environment files for development
    - Create apps/web/.env.local with actual development values
    - Create apps/admin/.env.local with actual development values
    - Generate NEXTAUTH_SECRET with at least 32 characters
    - Generate ADMIN_REVALIDATION_TOKEN with at least 32 characters
    - _Requirements: 9.5, 9.7, 10.8, 11.11, 11.12_

- [ ] 17. Configure Vercel Deployment
  - [ ] 17.1 Create web application Vercel configuration
    - Create apps/web/vercel.json
    - Set buildCommand to "cd ../.. && npm run build:web"
    - Set outputDirectory to ".next"
    - Set installCommand to "cd ../.. && npm install"
    - Set framework to "nextjs"
    - Set regions to ["iad1"]
    - _Requirements: 8.1, 8.2, 8.3_

  - [ ] 17.2 Create admin application Vercel configuration
    - Create apps/admin/vercel.json
    - Set buildCommand to "cd ../.. && npm run build:admin"
    - Set outputDirectory to ".next"
    - Set installCommand to "cd ../.. && npm install"
    - Set framework to "nextjs"
    - Set regions to ["iad1"]
    - _Requirements: 8.1, 8.2, 8.4_

  - [ ] 17.3 Create documentation for Vercel project setup
    - Document creating two separate Vercel projects
    - Document linking apps/web/ to www.onefocusafrica.com domain
    - Document linking apps/admin/ to admin.onefocusafrica.com domain
    - Document adding environment variables to each project
    - _Requirements: 8.5, 8.6, 8.11, 8.12, 20.3_

- [ ] 18. Local Testing and Validation
  - [ ] 18.1 Test web application build and functionality
    - Run `npm run build:web` and verify successful build
    - Run `npm run dev:web` and test all public routes
    - Test blog post listing shows only published posts
    - Test contact form submission
    - Test newsletter subscription
    - _Requirements: 1.10, 12.1, 12.2, 12.3, 12.4, 12.5, 12.15_

  - [ ] 18.2 Test admin application build and functionality
    - Run `npm run build:admin` and verify successful build
    - Run `npm run dev:admin` on port 3001
    - Test admin login functionality
    - Test blog post creation and editing
    - Test blog post publishing
    - Test media upload functionality
    - Test portfolio management
    - Test inquiries viewing
    - _Requirements: 1.11, 12.6, 12.7, 12.8, 12.9, 12.10, 12.11, 12.12, 12.13, 12.14, 12.16_

  - [ ] 18.3 Test content synchronization
    - Publish a blog post in admin application
    - Verify revalidation webhook is called
    - Verify published post appears on web application within 60 seconds
    - Publish a case study and verify it appears on /work
    - _Requirements: 7.1, 7.10, 12.10, 12.14_

  - [ ] 18.4 Test shared packages
    - Verify @onefocus/database imports work in both apps
    - Verify @onefocus/shared imports work in both apps
    - Verify TypeScript types are correctly resolved
    - _Requirements: 5.7, 5.8, 6.7, 6.8_

  - [ ] 18.5 Run test suites
    - Run `npm run test:web` and verify all tests pass
    - Run `npm run test:admin` and verify all tests pass
    - Fix any failing tests related to import paths or structure changes
    - _Requirements: 17.4, 17.5, 17.9_

- [ ] 19. Create Migration Documentation
  - [ ] 19.1 Create comprehensive MIGRATION.md document
    - Document migration overview and goals
    - Document monorepo structure
    - Document database migration steps
    - Document environment variable setup
    - Document development workflow (running both apps)
    - Document build commands for each application
    - _Requirements: 20.1, 20.2, 20.3, 20.4_

  - [ ] 19.2 Document rollback procedure
    - Document steps to restore SQLite database from backup
    - Document steps to revert to pre-migration git commit
    - Document steps to switch Vercel deployments back to original app
    - Document expected downtime during rollback
    - Document verification steps after rollback
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.8, 13.9_

  - [ ] 19.3 Create deployment guide
    - Document Vercel project creation steps
    - Document domain configuration steps
    - Document environment variable configuration for production
    - Document database connection string configuration
    - Document deployment verification steps
    - _Requirements: 20.5, 20.6, 20.7_

  - [ ] 19.4 Document known limitations and differences
    - Document UI component duplication strategy
    - Document security boundaries between applications
    - Document content synchronization latency expectations
    - Document any feature behavior changes
    - _Requirements: 14.5, 14.9, 20.8_

- [ ] 20. Production Deployment Preparation
  - [ ] 20.1 Create Vercel project for web application
    - Create new Vercel project linked to repository
    - Configure root directory to apps/web/
    - Add custom domain www.onefocusafrica.com
    - Add environment variables from apps/web/.env.example
    - _Requirements: 8.5, 8.6, 8.11_

  - [ ] 20.2 Create Vercel project for admin application
    - Create new Vercel project linked to repository
    - Configure root directory to apps/admin/
    - Add custom domain admin.onefocusafrica.com
    - Add environment variables from apps/admin/.env.example
    - _Requirements: 8.5, 8.6, 8.12_

  - [ ] 20.3 Configure production database
    - Verify PostgreSQL database is in production-ready tier
    - Configure connection pooling limits for production load
    - Set up database backups
    - _Requirements: 2.12, 19.3, 19.4, 19.5, 19.9_

  - [ ] 20.4 Configure shared services
    - Verify Vercel Blob storage is accessible from both domains
    - Configure CORS headers for cross-domain media access
    - Test media upload from admin and display on web
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 15.7, 15.9, 15.10_

- [ ] 21. Production Deployment and Smoke Testing
  - [ ] 21.1 Deploy web application to production
    - Trigger deployment from Vercel dashboard or git push
    - Monitor build logs for errors
    - Verify successful deployment
    - _Requirements: 8.7, 8.8_

  - [ ] 21.2 Deploy admin application to production
    - Trigger deployment from Vercel dashboard or git push
    - Monitor build logs for errors
    - Verify successful deployment
    - _Requirements: 8.7, 8.8_

  - [ ] 21.3 Run production smoke tests on web application
    - Access www.onefocusafrica.com and verify home page loads
    - Test all navigation links
    - Test blog listing and individual post pages
    - Test contact form submission
    - Test newsletter subscription
    - Verify all published content appears correctly
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

  - [ ] 21.4 Run production smoke tests on admin application
    - Access admin.onefocusafrica.com/admin/login
    - Test login with admin credentials
    - Test dashboard access
    - Test blog post creation
    - Test blog post publishing
    - Test media upload
    - Test portfolio management
    - Test inquiries access
    - _Requirements: 12.6, 12.7, 12.8, 12.9, 12.10, 12.11, 12.12, 12.13_

  - [ ] 21.5 Verify content synchronization in production
    - Create and publish a test blog post in admin
    - Verify it appears on web within 60 seconds
    - Create and publish a test case study
    - Verify it appears on /work
    - _Requirements: 7.1, 7.10_

  - [ ] 21.6 Monitor production applications
    - Check Vercel logs for errors in both applications
    - Monitor database connection pool usage
    - Verify no authentication errors
    - Verify no CORS errors for media files
    - _Requirements: 19.4, 19.5, 19.10_

- [ ] 22. Post-Migration Validation Period
  - [ ] 22.1 Monitor applications for 7 days
    - Track error rates in Vercel dashboards
    - Monitor database performance
    - Monitor content synchronization reliability
    - Track user-reported issues
    - _Requirements: 13.10_

  - [ ] 22.2 Validate independent deployment capability
    - Make a change only to admin application
    - Deploy admin only and verify web is unaffected
    - Make a change only to web application
    - Deploy web only and verify admin is unaffected
    - _Requirements: 8.7, 8.8_

  - [ ] 22.3 Document lessons learned and optimization opportunities
    - Document any issues encountered during migration
    - Document performance improvements identified
    - Document potential future enhancements
    - Update MIGRATION.md with findings
    - _Requirements: 20.9_

## Notes

- Migration must be performed in a feature branch separate from main
- Original SQLite database backup must be retained until production verification is complete
- All tests must pass before deploying to production
- Content synchronization relies on ISR with webhook-based revalidation for near-real-time updates
- Database connection pooling configuration varies by provider (Vercel Postgres, Supabase, Railway, Neon)
- UI components are intentionally duplicated between applications to maintain build independence
- Security boundaries enforce strict separation: web has no admin routes, admin has no public authentication exposure
- Rollback procedure documented in MIGRATION.md provides safety net for first 7 days post-migration
- Both applications run on separate ports locally: web on 3000, admin on 3001
- TypeScript path aliases ensure clean imports: @/* for local, @onefocus/database, @onefocus/shared

## Task Dependency Graph

```json
{
  "waves": [
    {
      "id": 0,
      "tasks": ["1", "2.1"]
    },
    {
      "id": 1,
      "tasks": ["2.2", "2.3", "2.4"]
    },
    {
      "id": 2,
      "tasks": ["3.1", "3.2", "3.3", "4.1", "4.2", "4.3"]
    },
    {
      "id": 3,
      "tasks": ["3.4", "3.5", "4.4", "4.5"]
    },
    {
      "id": 4,
      "tasks": ["5.1", "5.2"]
    },
    {
      "id": 5,
      "tasks": ["7.1", "7.2", "7.3", "7.4", "7.5", "10.1", "10.2", "10.3", "10.4", "10.5"]
    },
    {
      "id": 6,
      "tasks": ["8.1", "8.2", "11.1", "11.2"]
    },
    {
      "id": 7,
      "tasks": ["8.3", "8.4", "8.5", "11.3"]
    },
    {
      "id": 8,
      "tasks": ["8.6", "8.7", "9.1", "11.4", "11.5", "11.6", "11.7"]
    },
    {
      "id": 9,
      "tasks": ["9.2", "9.3", "11.8", "12.1"]
    },
    {
      "id": 10,
      "tasks": ["12.2", "12.3", "12.4", "12.5"]
    },
    {
      "id": 11,
      "tasks": ["13.1", "13.2"]
    },
    {
      "id": 12,
      "tasks": ["13.3", "13.4", "13.5"]
    },
    {
      "id": 13,
      "tasks": ["15.1"]
    },
    {
      "id": 14,
      "tasks": ["15.2", "15.3"]
    },
    {
      "id": 15,
      "tasks": ["15.4"]
    },
    {
      "id": 16,
      "tasks": ["15.5", "16.1", "16.2"]
    },
    {
      "id": 17,
      "tasks": ["16.3", "17.1", "17.2", "17.3"]
    },
    {
      "id": 18,
      "tasks": ["18.1", "18.2"]
    },
    {
      "id": 19,
      "tasks": ["18.3", "18.4", "18.5"]
    },
    {
      "id": 20,
      "tasks": ["19.1", "19.2", "19.3", "19.4"]
    },
    {
      "id": 21,
      "tasks": ["20.1", "20.2", "20.3", "20.4"]
    },
    {
      "id": 22,
      "tasks": ["21.1", "21.2"]
    },
    {
      "id": 23,
      "tasks": ["21.3", "21.4"]
    },
    {
      "id": 24,
      "tasks": ["21.5", "21.6"]
    },
    {
      "id": 25,
      "tasks": ["22.1", "22.2", "22.3"]
    }
  ]
}
```
