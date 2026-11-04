# Requirements Document

## Introduction

This document specifies the requirements for migrating the ONEFOCUS AFRICA single-application Next.js CMS into a dual-application monorepo architecture with independent deployments. The migration will separate the public-facing website from the private admin dashboard while preserving all existing functionality and data.

The current application is a fully functional Next.js 15 app with 17 admin pages, 10 public routes, 5 API endpoints, SQLite database with Prisma ORM, NextAuth v5 authentication, Vercel Blob storage, and TipTap blog editor. This migration will create two independently deployable applications sharing a PostgreSQL database and common packages.

## Glossary

- **Monorepo**: A single repository containing multiple applications and shared packages
- **ONEFOCUS_WEB**: The public-facing website application deployed at www.onefocusafrica.com
- **ONEFOCUS_ADMIN**: The private admin dashboard application deployed at admin.onefocusafrica.com
- **Database_Package**: Shared package containing Prisma schema, client, and migrations
- **Shared_Package**: Shared package containing TypeScript types, validation schemas, and utilities
- **Content_Synchronization**: Mechanism for making published content appear on ONEFOCUS_WEB without code deployment
- **ISR**: Incremental Static Regeneration - Next.js feature for updating static pages without rebuilding
- **Revalidation_Webhook**: Authenticated API endpoint that triggers cache invalidation on ONEFOCUS_WEB
- **Migration_Script**: Automated script for transferring data from SQLite to PostgreSQL
- **Workspace**: npm workspace configuration enabling multiple packages in a single repository
- **Build_Independence**: Ability to build and deploy one application without affecting the other
- **Rollback_Procedure**: Documented steps to revert to the single-application architecture
- **Source_Application**: The current single Next.js application before migration
- **Target_Architecture**: The dual-application monorepo structure after migration
- **Admin_Route**: Any route starting with /admin/* in the current application
- **Public_Route**: Any route not starting with /admin/* in the current application
- **Shared_API_Route**: API routes (/api/inquiries, /api/community) accessible from public website
- **Admin_API_Route**: API routes (/api/auth/*, /api/admin/*) restricted to admin application
- **PostgreSQL_Provider**: Production database provider (Railway, Supabase, Neon, or Vercel Postgres)
- **Environment_Variable**: Configuration value stored in .env files for each application
- **Vercel_Project**: Separate deployment project on Vercel platform for each application
- **Data_Integrity**: Guarantee that all database records are preserved during migration
- **Feature_Parity**: Guarantee that all functionality works identically after migration

## Requirements

### Requirement 1: Monorepo Structure Setup

**User Story:** As a developer, I want to restructure the codebase into a monorepo with workspace configuration, so that I can manage multiple applications and shared packages in a single repository.

#### Acceptance Criteria

1. THE Monorepo SHALL contain an apps/ directory with two subdirectories: web/ and admin/
2. THE Monorepo SHALL contain a packages/ directory with two subdirectories: database/ and shared/
3. THE Monorepo SHALL contain a root package.json with workspaces configured for apps/* and packages/*
4. WHEN the developer runs npm install at the root, THE Monorepo SHALL install dependencies for all workspaces
5. THE apps/web/ directory SHALL contain its own package.json with name "@onefocus/web"
6. THE apps/admin/ directory SHALL contain its own package.json with name "@onefocus/admin"
7. THE packages/database/ directory SHALL contain its own package.json with name "@onefocus/database"
8. THE packages/shared/ directory SHALL contain its own package.json with name "@onefocus/shared"
9. THE root package.json SHALL define build scripts: build:web, build:admin, and build:all
10. WHEN the developer runs npm run build:web, THE Monorepo SHALL build only ONEFOCUS_WEB without building ONEFOCUS_ADMIN
11. WHEN the developer runs npm run build:admin, THE Monorepo SHALL build only ONEFOCUS_ADMIN without building ONEFOCUS_WEB
12. THE Monorepo SHALL preserve the existing .gitignore file with additional entries for workspace-specific build artifacts

### Requirement 2: Database Migration from SQLite to PostgreSQL

**User Story:** As a developer, I want to migrate all database records from SQLite to PostgreSQL without data loss, so that both applications can share a production-ready database.

#### Acceptance Criteria

1. THE Database_Package SHALL contain a Prisma schema file with provider set to "postgresql"
2. THE Database_Package SHALL preserve all 13 models from the Source_Application schema (Inquiry, CommunityMember, NewsletterSubscriber, CaseStudy, AdminUser, Post, PostCategory, PostTag, MediaAsset, SiteContent, Program, Event, TeamMember)
3. THE Database_Package SHALL preserve all field names, types, and constraints from the Source_Application schema
4. THE Database_Package SHALL preserve all indexes, relations, and enums from the Source_Application schema
5. THE Migration_Script SHALL export all records from the SQLite database
6. THE Migration_Script SHALL import all exported records into the PostgreSQL database
7. WHEN the Migration_Script completes, THE PostgreSQL database SHALL contain the same number of records as the SQLite database for each model
8. WHEN the Migration_Script encounters an error, THE Migration_Script SHALL log the error and halt execution without partial data corruption
9. THE Migration_Script SHALL create a timestamped backup of the SQLite database before migration begins
10. THE Database_Package SHALL generate a Prisma Client accessible to both ONEFOCUS_WEB and ONEFOCUS_ADMIN
11. THE Database_Package SHALL provide a connection string environment variable DATABASE_URL for PostgreSQL
12. WHERE connection pooling is required, THE Database_Package SHALL support Prisma connection pooling configuration

### Requirement 3: Public Website Application Structure

**User Story:** As a developer, I want to move all public-facing routes, components, and logic into ONEFOCUS_WEB, so that the public website can be built and deployed independently.

#### Acceptance Criteria

1. THE ONEFOCUS_WEB SHALL contain routes for /, /about, /solutions, /work, /talent, /contact, /blog, /blog/[slug], /privacy, /terms, and /sitemap.xml
2. THE ONEFOCUS_WEB SHALL contain API routes for /api/inquiries and /api/community
3. THE ONEFOCUS_WEB SHALL contain all components from components/sections/ of the Source_Application
4. THE ONEFOCUS_WEB SHALL contain all components from components/forms/ of the Source_Application
5. THE ONEFOCUS_WEB SHALL contain the public layout from app/layout.tsx of the Source_Application
6. THE ONEFOCUS_WEB SHALL NOT contain any routes starting with /admin
7. THE ONEFOCUS_WEB SHALL NOT contain any API routes starting with /api/admin or /api/auth
8. THE ONEFOCUS_WEB SHALL have read-only database access to published content
9. THE ONEFOCUS_WEB SHALL display only records where isPublished equals true for CaseStudy model
10. THE ONEFOCUS_WEB SHALL display only records where status equals "PUBLISHED" for Post model
11. THE ONEFOCUS_WEB SHALL depend on @onefocus/database package for Prisma Client access
12. THE ONEFOCUS_WEB SHALL depend on @onefocus/shared package for types and utilities
13. WHEN a visitor accesses any public route, THE ONEFOCUS_WEB SHALL render the page without authentication
14. WHEN a visitor submits a contact inquiry, THE ONEFOCUS_WEB SHALL create a record in the Inquiry model via /api/inquiries
15. WHEN a visitor subscribes to the newsletter, THE ONEFOCUS_WEB SHALL create a record in the NewsletterSubscriber model via /api/community

### Requirement 4: Admin Dashboard Application Structure

**User Story:** As a developer, I want to move all admin routes, components, and authentication logic into ONEFOCUS_ADMIN, so that the admin dashboard can be built and deployed independently.

#### Acceptance Criteria

1. THE ONEFOCUS_ADMIN SHALL contain all 17 routes from app/admin/* of the Source_Application
2. THE ONEFOCUS_ADMIN SHALL contain API routes for /api/auth/[...nextauth], /api/admin/media, and /api/admin/slug-check
3. THE ONEFOCUS_ADMIN SHALL contain all components from components/admin/ of the Source_Application
4. THE ONEFOCUS_ADMIN SHALL contain the admin layout from app/admin/layout.tsx of the Source_Application
5. THE ONEFOCUS_ADMIN SHALL contain authentication logic from lib/auth.ts and lib/auth-utils.ts
6. THE ONEFOCUS_ADMIN SHALL contain media upload logic from lib/upload.ts
7. THE ONEFOCUS_ADMIN SHALL NOT contain any public-facing routes except /admin/login
8. THE ONEFOCUS_ADMIN SHALL have full CRUD database access to all models
9. THE ONEFOCUS_ADMIN SHALL depend on @onefocus/database package for Prisma Client access
10. THE ONEFOCUS_ADMIN SHALL depend on @onefocus/shared package for types and utilities
11. WHEN an unauthenticated user accesses any admin route except /admin/login, THE ONEFOCUS_ADMIN SHALL redirect to /admin/login
12. WHEN an authenticated user accesses any admin route, THE ONEFOCUS_ADMIN SHALL render the page with full functionality
13. WHEN an admin user creates a blog post, THE ONEFOCUS_ADMIN SHALL create a record in the Post model
14. WHEN an admin user publishes a blog post, THE ONEFOCUS_ADMIN SHALL update the Post status to "PUBLISHED" and set publishedAt timestamp
15. WHEN an admin user uploads media, THE ONEFOCUS_ADMIN SHALL store the file in Vercel Blob and create a MediaAsset record

### Requirement 5: Shared Database Package

**User Story:** As a developer, I want to create a shared database package with Prisma schema and client, so that both applications can access the same database without code duplication.

#### Acceptance Criteria

1. THE Database_Package SHALL export a configured Prisma Client instance
2. THE Database_Package SHALL contain the prisma/schema.prisma file with all 13 models
3. THE Database_Package SHALL contain migration files in prisma/migrations/
4. THE Database_Package SHALL provide a generateClient script that runs prisma generate
5. THE Database_Package SHALL provide a migrate script that runs prisma migrate dev
6. THE Database_Package SHALL provide a migrateDeploy script that runs prisma migrate deploy for production
7. WHEN ONEFOCUS_WEB imports from @onefocus/database, THE Database_Package SHALL provide the Prisma Client
8. WHEN ONEFOCUS_ADMIN imports from @onefocus/database, THE Database_Package SHALL provide the Prisma Client
9. THE Database_Package SHALL use a single DATABASE_URL environment variable shared by both applications
10. WHEN the prisma generate command runs, THE Database_Package SHALL generate TypeScript types for all models
11. THE Database_Package package.json SHALL declare @prisma/client and prisma as dependencies

### Requirement 6: Shared Utilities Package

**User Story:** As a developer, I want to create a shared utilities package with types, validation schemas, and helper functions, so that both applications use consistent logic without code duplication.

#### Acceptance Criteria

1. THE Shared_Package SHALL contain Zod validation schemas from lib/validations.ts of the Source_Application
2. THE Shared_Package SHALL contain TypeScript type definitions used by both applications
3. THE Shared_Package SHALL contain the email utility from lib/email.ts
4. THE Shared_Package SHALL contain the slug utility from lib/slug.ts
5. THE Shared_Package SHALL contain the sanitize utility from lib/sanitize.ts
6. THE Shared_Package SHALL export all utilities from a single index file
7. WHEN ONEFOCUS_WEB imports from @onefocus/shared, THE Shared_Package SHALL provide access to utilities
8. WHEN ONEFOCUS_ADMIN imports from @onefocus/shared, THE Shared_Package SHALL provide access to utilities
9. THE Shared_Package SHALL NOT depend on @onefocus/database to avoid circular dependencies
10. THE Shared_Package SHALL NOT depend on @onefocus/web or @onefocus/admin to avoid circular dependencies
11. THE Shared_Package package.json SHALL declare zod, nodemailer, and dompurify as dependencies

### Requirement 7: Content Synchronization via Revalidation

**User Story:** As a site admin, I want to publish a blog post from the admin dashboard and see it appear on the public website within 60 seconds without deploying code, so that content updates are instant.

#### Acceptance Criteria

1. WHEN an admin user publishes a blog post in ONEFOCUS_ADMIN, THE ONEFOCUS_ADMIN SHALL trigger a revalidation request to ONEFOCUS_WEB
2. THE Revalidation_Webhook SHALL be an API route in ONEFOCUS_WEB at /api/revalidate
3. WHEN the Revalidation_Webhook receives a request, THE Revalidation_Webhook SHALL validate an authentication token
4. IF the authentication token is invalid, THEN THE Revalidation_Webhook SHALL return a 401 Unauthorized response
5. WHEN the Revalidation_Webhook receives a valid request with path parameter, THE Revalidation_Webhook SHALL call revalidatePath for the specified path
6. WHEN a blog post is published, THE ONEFOCUS_ADMIN SHALL send a revalidation request for /blog and /blog/[slug]
7. WHEN a case study is published, THE ONEFOCUS_ADMIN SHALL send a revalidation request for /work
8. WHEN site content is updated, THE ONEFOCUS_ADMIN SHALL send a revalidation request for the affected page
9. THE ONEFOCUS_WEB SHALL use Incremental Static Regeneration with a revalidate time of 3600 seconds for blog pages
10. WITHIN 60 seconds of publishing, THE published content SHALL appear on ONEFOCUS_WEB without manual deployment
11. THE ONEFOCUS_ADMIN environment SHALL contain an ADMIN_REVALIDATION_TOKEN variable
12. THE ONEFOCUS_WEB environment SHALL contain an ADMIN_REVALIDATION_TOKEN variable matching the admin token

### Requirement 8: Independent Deployment Configuration

**User Story:** As a developer, I want to deploy the admin app and public website to separate Vercel projects independently, so that admin changes do not require public website rebuilds.

#### Acceptance Criteria

1. THE ONEFOCUS_WEB SHALL have a vercel.json configuration file in apps/web/
2. THE ONEFOCUS_ADMIN SHALL have a vercel.json configuration file in apps/admin/
3. THE ONEFOCUS_WEB vercel.json SHALL set buildCommand to "npm run build --workspace=@onefocus/web"
4. THE ONEFOCUS_ADMIN vercel.json SHALL set buildCommand to "npm run build --workspace=@onefocus/admin"
5. THE ONEFOCUS_WEB SHALL deploy to a Vercel_Project with domain www.onefocusafrica.com
6. THE ONEFOCUS_ADMIN SHALL deploy to a Vercel_Project with domain admin.onefocusafrica.com
7. WHEN a developer pushes changes only to apps/admin/, THE Vercel deployment SHALL build and deploy only ONEFOCUS_ADMIN
8. WHEN a developer pushes changes only to apps/web/, THE Vercel deployment SHALL build and deploy only ONEFOCUS_WEB
9. WHEN a developer pushes changes to packages/database/, THE Vercel deployment SHALL build and deploy both applications
10. WHEN a developer pushes changes to packages/shared/, THE Vercel deployment SHALL build and deploy both applications
11. THE ONEFOCUS_WEB Vercel_Project SHALL have environment variables: DATABASE_URL, BLOB_READ_WRITE_TOKEN, ADMIN_REVALIDATION_TOKEN, NEXT_PUBLIC_SITE_URL
12. THE ONEFOCUS_ADMIN Vercel_Project SHALL have environment variables: DATABASE_URL, BLOB_READ_WRITE_TOKEN, NEXTAUTH_SECRET, NEXTAUTH_URL, ADMIN_REVALIDATION_TOKEN, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS

### Requirement 9: Security Boundaries and Access Control

**User Story:** As a security-conscious developer, I want to enforce strict security boundaries between the admin and public applications, so that unauthorized users cannot access admin functionality.

#### Acceptance Criteria

1. THE ONEFOCUS_WEB SHALL NOT expose any routes starting with /api/admin
2. THE ONEFOCUS_WEB SHALL NOT expose any routes starting with /api/auth
3. THE ONEFOCUS_ADMIN SHALL NOT share session cookies with ONEFOCUS_WEB
4. THE NEXTAUTH_URL environment variable in ONEFOCUS_ADMIN SHALL point to admin.onefocusafrica.com
5. THE NEXTAUTH_SECRET environment variable SHALL be unique and at least 32 characters long
6. WHEN ONEFOCUS_ADMIN calls the Revalidation_Webhook, THE ONEFOCUS_ADMIN SHALL include the ADMIN_REVALIDATION_TOKEN in the Authorization header
7. THE ADMIN_REVALIDATION_TOKEN SHALL be a randomly generated string of at least 32 characters
8. THE ONEFOCUS_WEB /api/revalidate endpoint SHALL reject requests without a valid Authorization header
9. THE ONEFOCUS_ADMIN SHALL require authentication for all routes except /admin/login
10. THE ONEFOCUS_WEB SHALL allow anonymous access to all routes
11. THE ONEFOCUS_ADMIN SHALL use secure, httpOnly cookies for session management
12. THE ONEFOCUS_ADMIN SHALL set sameSite to "lax" for session cookies to prevent CSRF attacks

### Requirement 10: Environment Variable Management

**User Story:** As a developer, I want clear documentation of which environment variables are required for each application, so that I can configure both applications correctly.

#### Acceptance Criteria

1. THE ONEFOCUS_WEB SHALL have an .env.example file listing all required environment variables
2. THE ONEFOCUS_ADMIN SHALL have an .env.example file listing all required environment variables
3. THE ONEFOCUS_WEB .env.example SHALL document: DATABASE_URL, BLOB_READ_WRITE_TOKEN, ADMIN_REVALIDATION_TOKEN, NEXT_PUBLIC_SITE_URL
4. THE ONEFOCUS_ADMIN .env.example SHALL document: DATABASE_URL, BLOB_READ_WRITE_TOKEN, NEXTAUTH_SECRET, NEXTAUTH_URL, ADMIN_REVALIDATION_TOKEN, WEB_APP_URL, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
5. THE Database_Package SHALL NOT require its own environment variables beyond DATABASE_URL
6. THE Shared_Package SHALL NOT require any environment variables
7. WHEN DATABASE_URL is set, THE Database_Package SHALL connect to the PostgreSQL database
8. WHEN BLOB_READ_WRITE_TOKEN is set, THE applications SHALL authenticate with Vercel Blob storage
9. THE ONEFOCUS_ADMIN SHALL use WEB_APP_URL to construct revalidation webhook URLs
10. THE documentation SHALL specify example values for all environment variables

### Requirement 11: Data Integrity Preservation

**User Story:** As a site administrator, I want all existing database records preserved during migration, so that no content or user data is lost.

#### Acceptance Criteria

1. THE Migration_Script SHALL verify that the SQLite database is accessible before starting migration
2. THE Migration_Script SHALL verify that the PostgreSQL database is accessible before starting migration
3. THE Migration_Script SHALL count records in each SQLite table before migration
4. THE Migration_Script SHALL count records in each PostgreSQL table after migration
5. WHEN record counts do not match for any table, THE Migration_Script SHALL log an error and report which tables have discrepancies
6. THE Migration_Script SHALL preserve all UUID primary keys from the SQLite database
7. THE Migration_Script SHALL preserve all foreign key relationships
8. THE Migration_Script SHALL preserve all timestamps in the original timezone
9. THE Migration_Script SHALL preserve all enum values (AdminRole, PostStatus, ProgramStatus, EventStatus)
10. WHEN a record fails to insert into PostgreSQL, THE Migration_Script SHALL log the record details and error message
11. THE Migration_Script SHALL create a backup file at backups/sqlite-backup-{timestamp}.db before migration
12. THE Migration_Script SHALL generate a migration report listing record counts and any errors

### Requirement 12: Feature Parity Verification

**User Story:** As a quality assurance tester, I want to verify that all features work identically after migration, so that I can confirm the migration was successful.

#### Acceptance Criteria

1. WHEN a tester accesses the home page at ONEFOCUS_WEB root route, THE page SHALL render without errors
2. WHEN a tester accesses /blog at ONEFOCUS_WEB, THE page SHALL display all published blog posts
3. WHEN a tester accesses /blog/[slug] for a published post, THE page SHALL display the post content
4. WHEN a tester submits a contact form at /contact, THE form SHALL create an Inquiry record
5. WHEN a tester subscribes to the newsletter, THE form SHALL create a NewsletterSubscriber record
6. WHEN a tester accesses /admin/login at ONEFOCUS_ADMIN, THE login page SHALL render
7. WHEN a tester logs in with valid admin credentials, THE ONEFOCUS_ADMIN SHALL redirect to /admin dashboard
8. WHEN a tester accesses /admin/blog at ONEFOCUS_ADMIN, THE page SHALL display all blog posts regardless of status
9. WHEN a tester creates a new blog post, THE ONEFOCUS_ADMIN SHALL save the post with status "DRAFT"
10. WHEN a tester publishes a blog post, THE post SHALL appear on ONEFOCUS_WEB within 60 seconds
11. WHEN a tester uploads an image in the media library, THE ONEFOCUS_ADMIN SHALL store the image in Vercel Blob
12. WHEN a tester accesses /admin/inquiries, THE page SHALL display all inquiry records
13. WHEN a tester accesses /admin/portfolio, THE page SHALL display all case studies
14. WHEN a tester creates a case study and publishes it, THE case study SHALL appear on /work at ONEFOCUS_WEB
15. WHEN a tester runs npm run build:web, THE build SHALL complete without TypeScript errors
16. WHEN a tester runs npm run build:admin, THE build SHALL complete without TypeScript errors

### Requirement 13: Rollback Procedure

**User Story:** As a project manager, I want a documented rollback procedure, so that I can revert to the original architecture if critical issues arise during migration.

#### Acceptance Criteria

1. THE migration documentation SHALL contain a "Rollback Procedure" section
2. THE Rollback_Procedure SHALL document how to restore the SQLite database from backup
3. THE Rollback_Procedure SHALL document how to revert code changes to the pre-migration state
4. THE Rollback_Procedure SHALL document how to switch Vercel deployments back to the Source_Application
5. THE Rollback_Procedure SHALL document the expected downtime during rollback
6. THE developer SHALL work in a migration branch separate from the main branch
7. THE main branch SHALL contain the working Source_Application until migration is verified
8. WHEN critical issues are discovered, THE team SHALL execute the Rollback_Procedure within 30 minutes
9. THE Rollback_Procedure SHALL include steps to verify the Source_Application is functioning after rollback
10. THE migration SHALL NOT delete the Source_Application code until Target_Architecture is production-verified for at least 7 days

### Requirement 14: UI Component Sharing Strategy

**User Story:** As a developer, I want a clear strategy for sharing UI components between applications, so that I can avoid code duplication while maintaining application independence.

#### Acceptance Criteria

1. THE components/ui/ directory from the Source_Application SHALL be evaluated for sharing potential
2. WHERE a UI component is used only by ONEFOCUS_ADMIN, THE component SHALL reside in apps/admin/components/
3. WHERE a UI component is used only by ONEFOCUS_WEB, THE component SHALL reside in apps/web/components/
4. WHERE a UI component is used by both applications, THE component SHALL be duplicated in both apps/admin/components/ and apps/web/components/
5. THE Shared_Package SHALL NOT contain React components to avoid build complexity
6. THE DataTable component SHALL reside in apps/admin/components/ as it is admin-only
7. THE RichTextEditor component SHALL reside in apps/admin/components/ as it is admin-only
8. THE PageHeader component SHALL reside in apps/admin/components/ as it is admin-only
9. WHEN a component is duplicated, THE documentation SHALL note it as intentionally duplicated
10. THE component duplication strategy SHALL prioritize Build_Independence over code reuse

### Requirement 15: Media Storage Access

**User Story:** As a content manager, I want both applications to access the same media storage, so that images uploaded in the admin dashboard appear on the public website.

#### Acceptance Criteria

1. THE ONEFOCUS_WEB SHALL have read access to Vercel Blob storage
2. THE ONEFOCUS_ADMIN SHALL have read and write access to Vercel Blob storage
3. WHEN ONEFOCUS_ADMIN uploads a file, THE file SHALL be stored with a public URL
4. WHEN ONEFOCUS_WEB displays an image, THE image URL SHALL resolve to the Vercel Blob storage
5. THE BLOB_READ_WRITE_TOKEN environment variable SHALL be the same for both applications
6. WHEN a media file is uploaded, THE MediaAsset record SHALL store the public URL
7. THE ONEFOCUS_WEB SHALL NOT have access to delete or upload media files
8. THE ONEFOCUS_ADMIN /api/admin/media endpoint SHALL handle file uploads
9. THE uploaded files SHALL have CORS headers allowing access from both application domains
10. WHEN a user accesses a media URL, THE file SHALL be served regardless of which application domain they are on

### Requirement 16: TypeScript Path Aliases

**User Story:** As a developer, I want consistent TypeScript path aliases in both applications, so that imports are clean and maintainable.

#### Acceptance Criteria

1. THE ONEFOCUS_WEB tsconfig.json SHALL define a path alias "@/*" mapping to "./\*"
2. THE ONEFOCUS_ADMIN tsconfig.json SHALL define a path alias "@/*" mapping to "./\*"
3. THE ONEFOCUS_WEB SHALL define a path alias "@onefocus/database" mapping to the Database_Package
4. THE ONEFOCUS_ADMIN SHALL define a path alias "@onefocus/database" mapping to the Database_Package
5. THE ONEFOCUS_WEB SHALL define a path alias "@onefocus/shared" mapping to the Shared_Package
6. THE ONEFOCUS_ADMIN SHALL define a path alias "@onefocus/shared" mapping to the Shared_Package
7. WHEN a developer imports from "@/components", THE import SHALL resolve to the application's components directory
8. WHEN a developer imports from "@onefocus/database", THE import SHALL resolve to the Database_Package exports
9. WHEN a developer imports from "@onefocus/shared", THE import SHALL resolve to the Shared_Package exports
10. THE root tsconfig.json SHALL define workspace references for type checking across packages

### Requirement 17: Testing Infrastructure Preservation

**User Story:** As a quality engineer, I want the existing test infrastructure preserved, so that I can continue running tests after migration.

#### Acceptance Criteria

1. THE ONEFOCUS_WEB SHALL contain a vitest.config.ts file
2. THE ONEFOCUS_ADMIN SHALL contain a vitest.config.ts file
3. THE root package.json SHALL define test scripts: test:web, test:admin, and test:all
4. WHEN the developer runs npm run test:web, THE Monorepo SHALL run tests only for ONEFOCUS_WEB
5. WHEN the developer runs npm run test:admin, THE Monorepo SHALL run tests only for ONEFOCUS_ADMIN
6. THE test configuration SHALL support importing from @onefocus/database and @onefocus/shared
7. THE existing Playwright configuration SHALL be preserved for end-to-end testing
8. THE fast-check dependency SHALL be available for property-based testing in both applications
9. WHERE existing tests reference the Source_Application structure, THE tests SHALL be updated to reference the Target_Architecture
10. WHEN all tests run, THE test suite SHALL pass without errors

### Requirement 18: API Route Migration Strategy

**User Story:** As a developer, I want a clear strategy for migrating API routes, so that client applications continue to function correctly.

#### Acceptance Criteria

1. THE /api/inquiries route SHALL be moved to ONEFOCUS_WEB at apps/web/app/api/inquiries/route.ts
2. THE /api/community route SHALL be moved to ONEFOCUS_WEB at apps/web/app/api/community/route.ts
3. THE /api/auth/[...nextauth] route SHALL be moved to ONEFOCUS_ADMIN at apps/admin/app/api/auth/[...nextauth]/route.ts
4. THE /api/admin/media route SHALL be moved to ONEFOCUS_ADMIN at apps/admin/app/api/admin/media/route.ts
5. THE /api/admin/slug-check route SHALL be moved to ONEFOCUS_ADMIN at apps/admin/app/api/admin/slug-check/route.ts
6. THE /api/revalidate route SHALL be created in ONEFOCUS_WEB at apps/web/app/api/revalidate/route.ts
7. WHEN a public user calls /api/inquiries from ONEFOCUS_WEB, THE API SHALL create an Inquiry record
8. WHEN a public user calls /api/community from ONEFOCUS_WEB, THE API SHALL create a NewsletterSubscriber record
9. WHEN an admin user calls /api/admin/media from ONEFOCUS_ADMIN, THE API SHALL upload a file to Vercel Blob
10. WHEN an admin application calls /api/revalidate on ONEFOCUS_WEB, THE API SHALL trigger ISR revalidation

### Requirement 19: Database Connection Pooling

**User Story:** As a database administrator, I want proper connection pooling configured, so that the PostgreSQL database handles concurrent requests efficiently.

#### Acceptance Criteria

1. WHERE the PostgreSQL_Provider requires connection pooling, THE Database_Package SHALL configure connection limits
2. THE Database_Package SHALL set a maximum connection pool size appropriate for serverless environments
3. THE Database_Package SHALL use Prisma Data Proxy OR direct connection pooling based on provider requirements
4. WHEN ONEFOCUS_WEB receives high traffic, THE Database_Package SHALL not exhaust database connections
5. WHEN ONEFOCUS_ADMIN and ONEFOCUS_WEB run simultaneously, THE total connections SHALL not exceed provider limits
6. THE Database_Package documentation SHALL specify recommended connection pool settings for each PostgreSQL_Provider
7. WHERE Vercel Postgres is used, THE Database_Package SHALL use @vercel/postgres connection pooling
8. WHERE Supabase is used, THE Database_Package SHALL use connection pooling via DATABASE_URL with pgbouncer
9. WHEN a database query completes, THE connection SHALL be returned to the pool
10. THE Database_Package SHALL configure query timeout to prevent long-running queries from blocking connections

### Requirement 20: Migration Documentation

**User Story:** As a team member, I want comprehensive documentation of the migration process, so that I can understand, execute, and troubleshoot the migration.

#### Acceptance Criteria

1. THE migration documentation SHALL contain a "Prerequisites" section listing required tools and access
2. THE migration documentation SHALL contain a "Step-by-Step Migration Guide" with numbered instructions
3. THE migration documentation SHALL contain a "Deployment Guide" for both Vercel projects
4. THE migration documentation SHALL contain an "Environment Variables Reference" table
5. THE migration documentation SHALL contain a "Troubleshooting" section with common issues and solutions
6. THE migration documentation SHALL contain a "Verification Checklist" for post-migration testing
7. THE migration documentation SHALL contain architecture diagrams showing the Target_Architecture
8. THE migration documentation SHALL document the expected migration duration
9. THE migration documentation SHALL document required downtime windows
10. THE migration documentation SHALL document rollback procedures
11. THE migration documentation SHALL document how to set up local development environment for both applications
12. THE migration documentation SHALL document how to run both applications simultaneously for local testing

### Requirement 21: Scheduled Publishing Mechanism

**User Story:** As a content editor, I want scheduled blog posts to publish automatically at the specified time across both applications, so that content publishing is automated.

#### Acceptance Criteria

1. WHEN a blog post has status "SCHEDULED" and scheduledAt is in the past, THE system SHALL change status to "PUBLISHED"
2. THE ONEFOCUS_ADMIN SHALL provide a cron job or serverless function to check scheduled posts every 5 minutes
3. WHEN a scheduled post becomes published, THE system SHALL trigger revalidation on ONEFOCUS_WEB
4. THE scheduled publishing mechanism SHALL update the publishedAt timestamp
5. THE scheduled publishing mechanism SHALL NOT require manual intervention
6. WHERE Vercel Cron Jobs are available, THE ONEFOCUS_ADMIN SHALL use them for scheduled publishing
7. THE scheduled publishing endpoint SHALL require authentication to prevent unauthorized publishing
8. WHEN scheduled publishing fails, THE system SHALL log the error for admin review
9. THE ONEFOCUS_ADMIN dashboard SHALL display upcoming scheduled posts
10. WHEN a scheduled post is published, THE post SHALL appear on ONEFOCUS_WEB within 60 seconds

### Requirement 22: CSS and Styling Migration

**User Story:** As a frontend developer, I want all styles and Tailwind configuration preserved, so that both applications maintain visual consistency.

#### Acceptance Criteria

1. THE ONEFOCUS_WEB SHALL contain a tailwind.config.js file with the same configuration as Source_Application
2. THE ONEFOCUS_ADMIN SHALL contain a tailwind.config.js file with the same configuration as Source_Application
3. THE ONEFOCUS_WEB SHALL contain globals.css with all global styles from Source_Application
4. THE ONEFOCUS_ADMIN SHALL contain globals.css with all global styles from Source_Application
5. THE Tailwind configuration SHALL preserve all custom colors, fonts, and spacing values
6. WHEN a developer builds ONEFOCUS_WEB, THE styles SHALL compile without errors
7. WHEN a developer builds ONEFOCUS_ADMIN, THE styles SHALL compile without errors
8. THE admin layout styles SHALL be preserved in ONEFOCUS_ADMIN
9. THE public website styles SHALL be preserved in ONEFOCUS_WEB
10. WHERE Tailwind classes are used in shared components, THE classes SHALL work in both applications

### Requirement 23: Next.js Configuration Preservation

**User Story:** As a developer, I want all Next.js configurations preserved, so that both applications maintain the same behavior and features.

#### Acceptance Criteria

1. THE ONEFOCUS_WEB SHALL contain a next.config.js file
2. THE ONEFOCUS_ADMIN SHALL contain a next.config.js file
3. WHEN the Source_Application has image optimization settings, THE settings SHALL be preserved in both applications
4. WHEN the Source_Application has redirects configured, THE redirects SHALL be preserved in the appropriate application
5. WHEN the Source_Application has headers configured, THE headers SHALL be preserved in the appropriate application
6. THE ONEFOCUS_WEB next.config.js SHALL configure output: 'standalone' for Vercel deployment
7. THE ONEFOCUS_ADMIN next.config.js SHALL configure output: 'standalone' for Vercel deployment
8. THE experimental features from Source_Application SHALL be preserved where applicable
9. THE webpack configuration customizations SHALL be preserved where applicable
10. WHEN Next.js 15 features are used, THE configurations SHALL support them in both applications

### Requirement 24: Error Handling and Logging

**User Story:** As a developer, I want consistent error handling and logging across both applications, so that I can debug issues effectively.

#### Acceptance Criteria

1. THE ONEFOCUS_WEB SHALL preserve error.tsx and not-found.tsx pages from Source_Application
2. THE ONEFOCUS_ADMIN SHALL preserve error handling patterns from Source_Application admin routes
3. WHEN a database error occurs in ONEFOCUS_WEB, THE application SHALL log the error without exposing sensitive details to users
4. WHEN a database error occurs in ONEFOCUS_ADMIN, THE application SHALL log the error with full details for debugging
5. THE Revalidation_Webhook SHALL log all revalidation requests with timestamp and status
6. THE Migration_Script SHALL log all operations with INFO, WARN, and ERROR levels
7. WHERE the Source_Application uses console.log, THE code SHALL be preserved or replaced with structured logging
8. WHEN API routes encounter errors, THE routes SHALL return appropriate HTTP status codes
9. THE ONEFOCUS_ADMIN SHALL log authentication failures for security monitoring
10. THE error logs SHALL include sufficient context for debugging without exposing passwords or tokens

### Requirement 25: Performance Optimization Preservation

**User Story:** As a performance engineer, I want all performance optimizations preserved, so that both applications maintain fast load times.

#### Acceptance Criteria

1. THE ONEFOCUS_WEB SHALL use static generation for all pages where possible
2. THE ONEFOCUS_WEB SHALL use ISR with appropriate revalidate times for dynamic content
3. THE ONEFOCUS_WEB blog list page SHALL use pagination to limit records per page
4. THE ONEFOCUS_WEB SHALL optimize images using Next.js Image component
5. THE ONEFOCUS_ADMIN SHALL use dynamic imports for heavy components where appropriate
6. THE Database_Package SHALL use Prisma select statements to fetch only required fields
7. WHEN ONEFOCUS_WEB fetches blog posts, THE query SHALL include only published posts to reduce data transfer
8. THE ONEFOCUS_WEB SHALL implement caching headers for static assets
9. THE ONEFOCUS_ADMIN SHALL implement request deduplication for parallel queries
10. WHEN Lighthouse audits run on ONEFOCUS_WEB, THE performance score SHALL be comparable to Source_Application

### Requirement 26: SEO Preservation

**User Story:** As a marketing manager, I want all SEO features preserved, so that search engine rankings are not negatively affected by the migration.

#### Acceptance Criteria

1. THE ONEFOCUS_WEB SHALL preserve the sitemap.xml generation from Source_Application
2. THE ONEFOCUS_WEB SHALL preserve meta tags for seoTitle and seoDescription on blog posts
3. THE ONEFOCUS_WEB SHALL preserve robots.txt configuration if present in Source_Application
4. THE ONEFOCUS_WEB SHALL preserve canonical URLs for all pages
5. THE ONEFOCUS_WEB SHALL preserve Open Graph tags for social media sharing
6. THE ONEFOCUS_WEB blog post pages SHALL include structured data (JSON-LD) for articles
7. WHEN a blog post URL is shared, THE preview SHALL display the correct title, description, and image
8. THE ONEFOCUS_WEB SHALL generate the sitemap dynamically based on published content
9. THE ONEFOCUS_WEB SHALL set appropriate cache headers for SEO-critical pages
10. THE /blog/[slug] URLs SHALL remain unchanged to preserve existing search engine rankings

### Requirement 27: Development Workflow Setup

**User Story:** As a developer, I want to run both applications locally for development, so that I can test cross-application functionality.

#### Acceptance Criteria

1. THE root package.json SHALL define a dev:web script that runs ONEFOCUS_WEB on port 3000
2. THE root package.json SHALL define a dev:admin script that runs ONEFOCUS_ADMIN on port 3001
3. THE root package.json SHALL define a dev:all script that runs both applications concurrently
4. WHEN a developer runs npm run dev:web, THE ONEFOCUS_WEB SHALL start without starting ONEFOCUS_ADMIN
5. WHEN a developer runs npm run dev:admin, THE ONEFOCUS_ADMIN SHALL start without starting ONEFOCUS_WEB
6. WHEN a developer runs npm run dev:all, THE both applications SHALL start on different ports
7. THE developer documentation SHALL specify how to configure .env.local files for local development
8. THE local DATABASE_URL SHALL point to a local PostgreSQL instance or development database
9. WHEN a developer makes changes to Database_Package, THE changes SHALL reflect in both running applications
10. WHEN a developer makes changes to Shared_Package, THE changes SHALL reflect in both running applications with hot reload

### Requirement 28: Dependency Management

**User Story:** As a developer, I want clear separation of dependencies between applications and packages, so that each workspace only includes necessary dependencies.

#### Acceptance Criteria

1. THE ONEFOCUS_WEB package.json SHALL include next, react, and react-dom as dependencies
2. THE ONEFOCUS_ADMIN package.json SHALL include next, react, react-dom, next-auth, and @tiptap/* packages as dependencies
3. THE Database_Package package.json SHALL include @prisma/client and prisma as dependencies
4. THE Shared_Package package.json SHALL include zod, nodemailer, dompurify, and jsdom as dependencies
5. THE root package.json SHALL declare devDependencies used across all workspaces (@types/node, typescript, eslint)
6. WHEN npm install runs at the root, THE node_modules SHALL be hoisted where possible to save disk space
7. WHERE a package is used by only one application, THE package SHALL be declared in that application's dependencies
8. WHERE a package is used by both applications, THE package SHALL be declared in both applications' dependencies
9. THE Tailwind CSS packages SHALL be declared in both ONEFOCUS_WEB and ONEFOCUS_ADMIN
10. THE framer-motion package SHALL be declared where animation components are used

### Requirement 29: Git History Preservation

**User Story:** As a project historian, I want git history preserved during migration, so that we maintain the complete development history.

#### Acceptance Criteria

1. THE migration SHALL preserve all git commit history from Source_Application
2. THE migration SHALL be performed in a feature branch named "migration/monorepo-dual-apps"
3. THE git history SHALL show clear commit messages documenting each migration step
4. WHEN files are moved, THE git log SHALL preserve file history using git mv commands
5. THE migration commits SHALL be organized logically (structure setup, file moves, configuration updates, testing)
6. THE .gitignore file SHALL be updated to exclude workspace-specific build artifacts
7. THE final migration commit SHALL include a summary of all changes
8. WHEN the migration is complete, THE branch SHALL be merged to main with a merge commit
9. THE git tags from Source_Application SHALL be preserved
10. THE git history SHALL be linear without force-pushes or rebases that lose information

### Requirement 30: Backup and Recovery Strategy

**User Story:** As a risk manager, I want comprehensive backups before migration, so that we can recover from any catastrophic failure.

#### Acceptance Criteria

1. THE Migration_Script SHALL create a backup of the SQLite database at backups/sqlite-{timestamp}.db
2. THE developer SHALL create a git tag "pre-migration" before starting the migration
3. THE developer SHALL export all environment variables to a secure backup location
4. THE developer SHALL document the current Vercel project configuration before changes
5. WHEN the backup is complete, THE backup files SHALL be stored in a secure location separate from the repository
6. THE backup procedure SHALL include verification that backups are restorable
7. THE backup SHALL include the current node_modules/ checksums for dependency version verification
8. THE backup documentation SHALL include instructions for restoring from each backup type
9. WHEN a catastrophic failure occurs, THE team SHALL be able to restore the Source_Application within 2 hours
10. THE backup files SHALL be retained for at least 90 days after successful migration
