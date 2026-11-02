# Requirements Document

## Introduction

This feature adds a secure private admin dashboard and blog content management system (CMS) to the existing ONEFOCUS AFRICA Next.js website. The existing public website — its pages, design, Prisma schema, API routes, and database records — must be preserved intact. The admin area, blog management, and public blog are layered on top.

The system covers:
- Authenticated admin access with role-based permissions
- A multi-module dashboard (overview, content, media, inquiries, settings)
- Full blog authoring workflow (create, draft, review, schedule, publish)
- A public-facing blog section at `/blog` and `/blog/[slug]`
- CMS controls for updating live website content sections
- Business inquiry management connected to the existing contact form
- Production-compatible media storage with optimised public delivery

### Architecture Audit Summary

The existing application is a Next.js 15 / React 19 app deployed on Vercel. It uses:
- **Prisma ORM** with PostgreSQL — existing models: `Inquiry`, `CommunityMember`, `NewsletterSubscriber`, `CaseStudy`
- **Nodemailer** via SMTP for transactional email
- **Zod** for server-side validation
- **Tailwind CSS** (brand tokens: Picton Blue `#1F99ED`, Persian Blue `#2E3192`, dark `#10183F`, light `#EEF6FD`)
- **Framer Motion** for animations
- **No existing authentication library, CMS, or admin area**

Recommended additions (reuse-first):
- **NextAuth.js v5** (Auth.js) — credentials provider for staff login, server-side session via JWT
- **Extend the existing Prisma schema** — add `AdminUser`, `Post`, `PostCategory`, `PostTag`, `MediaAsset`, `SiteContent`, `Event`, `Program`, `TeamMember` models
- **Vercel Blob** (or compatible S3-compatible storage) for media uploads, consistent with the existing Vercel deployment
- **Tiptap** rich-text editor (framework-agnostic, works in Next.js App Router)
- **No external CMS platform** (Contentful, Sanity, etc.) — keep everything in the existing PostgreSQL database

---

## Glossary

- **Admin_System**: The combined admin dashboard and CMS layered onto the ONEFOCUS AFRICA website.
- **Admin_User**: An authenticated staff account with either the `ADMIN` or `EDITOR` role.
- **Admin_Session**: A server-side validated session proving an Admin_User is authenticated.
- **ADMIN**: A role that can perform all operations including user management and settings.
- **EDITOR**: A role that can create and manage content but cannot manage Admin_Users or Site_Settings.
- **Post**: A blog article entity stored in the database with content, metadata, and a publication lifecycle.
- **Post_Status**: One of `DRAFT`, `REVIEW`, `SCHEDULED`, or `PUBLISHED`.
- **Slug**: A unique, URL-safe string identifier derived from a Post title, used in public URLs.
- **Rich_Text_Editor**: The Tiptap editor component used for authoring Post body content.
- **Media_Asset**: A file (image, document) stored in production object storage with a persisted database record.
- **Object_Storage**: A production-compatible file storage service (Vercel Blob or S3-compatible), not the local filesystem.
- **Site_Content**: Editable text and media references for specific public website sections.
- **Inquiry**: The existing `Inquiry` Prisma model capturing business lead data from the contact form.
- **Inquiry_Status**: One of `new`, `contacted`, `qualified`, `proposal`, `closed`.
- **CaseStudy**: The existing `CaseStudy` Prisma model for portfolio projects.
- **Public_Blog**: The publicly accessible `/blog` listing and `/blog/[slug]` article pages.
- **XML_Sitemap**: The auto-generated sitemap at `/sitemap.xml` including all published Post URLs.
- **Structured_Data**: JSON-LD metadata embedded in Post pages for search engine article markup.

---

## Requirements

### Requirement 1: Architecture — No Disruption to Existing Public Site

**User Story:** As a developer, I want the admin dashboard and CMS to be additive to the existing codebase, so that existing public pages, database records, API routes, and integrations continue to operate without modification.

#### Acceptance Criteria

1. THE Admin_System SHALL be implemented under the `/admin` route prefix, isolated from all existing public routes (`/`, `/about`, `/solutions`, `/work`, `/talent`, `/contact`, `/privacy`, `/terms`).
2. THE Admin_System SHALL extend the existing Prisma schema by adding new models without altering or removing the `Inquiry`, `CommunityMember`, `NewsletterSubscriber`, or `CaseStudy` models or their fields.
3. THE Admin_System SHALL not modify the existing API routes at `/api/inquiries` or `/api/community`.
4. THE Admin_System SHALL not modify, remove, or override any existing public-facing component, layout, or page.
5. WHEN the Admin_System is deployed, THE existing public website SHALL pass a production build (`next build`) without new errors or warnings attributable to admin changes.

---

### Requirement 2: Admin User Authentication

**User Story:** As a staff member, I want to log in securely with my email and password, so that only authorised people can access the admin area.

#### Acceptance Criteria

1. THE Admin_System SHALL provide a login page at `/admin/login` that accepts an email address and a password.
2. WHEN valid credentials are submitted, THE Admin_System SHALL create an Admin_Session and redirect the Admin_User to `/admin`.
3. WHEN invalid credentials are submitted, THE Admin_System SHALL return a generic error message without specifying which credential was incorrect, within 3 seconds.
4. WHEN a non-authenticated request is made to any `/admin/*` route (excluding `/admin/login`), THE Admin_System SHALL redirect the request to `/admin/login`.
5. THE Admin_System SHALL hash all Admin_User passwords using bcrypt with a cost factor of at least 12 before storing them in the database.
6. THE Admin_System SHALL enforce Admin_Session expiry after 8 hours of inactivity.
7. THE Admin_System SHALL provide a logout action that invalidates the Admin_Session and redirects to `/admin/login`.
8. IF an Admin_User submits more than 5 failed login attempts within 15 minutes from the same IP address, THEN THE Admin_System SHALL block further login attempts from that IP address for 15 minutes and return an appropriate error message.
9. THE Admin_System SHALL not expose a public registration endpoint for Admin_User accounts.
10. THE Admin_System SHALL seed at least one default ADMIN account via an environment variable or a one-time CLI seed command, so that a first admin can be created without database access.

---

### Requirement 3: Role-Based Access Control

**User Story:** As an administrator, I want to assign roles to staff accounts, so that editors can manage content without being able to change user accounts or critical settings.

#### Acceptance Criteria

1. THE Admin_System SHALL support exactly two roles: `ADMIN` and `EDITOR`.
2. WHILE an Admin_User holds the `EDITOR` role, THE Admin_System SHALL prevent access to the Team & Roles module and the Website Settings module.
3. WHILE an Admin_User holds the `ADMIN` role, THE Admin_System SHALL permit access to all dashboard modules.
4. THE Admin_System SHALL enforce role permissions on the server side in every API route and Server Action.
5. IF a request to a restricted action is made by an Admin_User without sufficient role, THEN THE Admin_System SHALL return a 403 response and SHALL NOT execute the action.
6. THE Admin_System SHALL display only the navigation items accessible to the authenticated Admin_User's role.

---

### Requirement 4: Admin Dashboard Overview

**User Story:** As an admin, I want to see a summary of key metrics when I first log in, so that I can quickly assess the current state of the site and business.

#### Acceptance Criteria

1. WHEN an Admin_User accesses `/admin`, THE Admin_System SHALL display a dashboard overview page.
2. THE dashboard overview SHALL display the total count of published Posts.
3. THE dashboard overview SHALL display the total count of Inquiries and the count of Inquiries with status `new`.
4. THE dashboard overview SHALL display the total count of active CommunityMembers.
5. THE dashboard overview SHALL display the 5 most recently created Inquiries, showing lead name, company, service area, and created date.
6. THE dashboard overview SHALL display the 5 most recent Posts with their Post_Status and published date.
7. WHEN counts or lists are loaded, THE Admin_System SHALL fetch data server-side so the page is rendered without requiring a client-side loading state for initial data.

---

### Requirement 5: Blog Post Authoring

**User Story:** As an editor, I want to create and edit blog articles with rich formatting, so that I can publish well-structured content on the website.

#### Acceptance Criteria

1. THE Admin_System SHALL provide a post editor page accessible at `/admin/blog/new` for creating a new Post and `/admin/blog/[id]/edit` for editing an existing Post.
2. THE post editor SHALL include a Rich_Text_Editor that supports headings (H2, H3), bold, italic, bullet lists, numbered lists, block quotes, hyperlinks, and inline code.
3. THE post editor SHALL include a text field for the SEO title (separate from the Post title), with a visible character counter that indicates when the value exceeds 60 characters.
4. THE post editor SHALL include a text field for the SEO meta description, with a visible character counter that indicates when the value exceeds 160 characters.
5. WHEN an Admin_User enters a Post title, THE Admin_System SHALL automatically generate a Slug from the title by lowercasing, replacing spaces with hyphens, and removing non-alphanumeric characters, and SHALL display it in an editable field.
6. IF a Slug already exists for another Post, THEN THE Admin_System SHALL append a numeric suffix to make it unique before saving.
7. THE post editor SHALL allow selection of one or more PostCategories and one or more PostTags for the Post.
8. THE post editor SHALL allow upload and display of a cover image for the Post.
9. THE post editor SHALL display the author name, defaulting to the authenticated Admin_User's display name.
10. THE post editor SHALL include a date-time picker for setting a scheduled publish date.
11. THE post editor SHALL include a status selector with options: `DRAFT`, `REVIEW`, `SCHEDULED`, `PUBLISHED`.
12. WHEN an Admin_User saves a Post with status `DRAFT` or `REVIEW`, THE Admin_System SHALL persist the Post without making it publicly visible.
13. WHEN an Admin_User saves a Post with status `PUBLISHED`, THE Admin_System SHALL make the Post publicly visible on the Public_Blog immediately.
14. WHEN a Post has status `SCHEDULED` and the scheduled publish date is reached, THE Admin_System SHALL transition the Post status to `PUBLISHED` and make it publicly visible.
15. THE post editor SHALL provide a preview button that opens a read-only rendering of the Post content in a new browser tab, styled with the public blog article layout, before the Post is published.

---

### Requirement 6: Blog Post Management

**User Story:** As an editor, I want to view, filter, and manage all blog posts from a single list, so that I can maintain the article library efficiently.

#### Acceptance Criteria

1. THE Admin_System SHALL provide a post list page at `/admin/blog` displaying all Posts in reverse chronological order.
2. THE post list SHALL display for each Post: title, author, Post_Status, category, and created date.
3. THE post list SHALL allow filtering by Post_Status.
4. THE post list SHALL allow filtering by PostCategory.
5. THE post list SHALL support text search by Post title, returning results within 1 second for a dataset of up to 1000 Posts.
6. THE Admin_System SHALL allow an Admin_User to delete a Post from the list view after explicit confirmation.
7. WHEN a Post is deleted, THE Admin_System SHALL remove it from the database and it SHALL no longer appear in the Public_Blog.
8. THE post list SHALL support pagination showing 20 Posts per page.

---

### Requirement 7: Post Categories and Tags

**User Story:** As an editor, I want to organise articles into categories and apply tags, so that readers can browse content by topic.

#### Acceptance Criteria

1. THE Admin_System SHALL allow Admin_Users with the `ADMIN` role to create, rename, and delete PostCategories.
2. THE Admin_System SHALL allow any Admin_User to create PostTags when authoring a Post.
3. WHEN a PostCategory is deleted, THE Admin_System SHALL not delete Posts assigned to it but SHALL remove the category association from those Posts.
4. THE Admin_System SHALL enforce that PostCategory names are unique (case-insensitive).
5. THE Admin_System SHALL enforce that each PostCategory has a unique URL-safe slug used for public filtering.

---

### Requirement 8: Media Library

**User Story:** As an editor, I want to upload and manage images and files in a central media library, so that I can reuse assets across posts and pages without re-uploading.

#### Acceptance Criteria

1. THE Admin_System SHALL provide a media library page at `/admin/media`.
2. WHEN an Admin_User uploads a file, THE Admin_System SHALL store the file in Object_Storage and persist a Media_Asset record in the database.
3. THE Admin_System SHALL accept uploads of the following file types only: JPEG, PNG, WebP, GIF, SVG, and PDF.
4. THE Admin_System SHALL reject any file exceeding 10 MB and return a descriptive error message to the Admin_User.
5. THE Admin_System SHALL generate a unique, unpredictable filename for each uploaded file to prevent enumeration.
6. THE Admin_System SHALL make uploaded images publicly accessible via an Object_Storage CDN URL for use in posts and site content.
7. THE media library SHALL display uploaded Media_Assets as a grid with filename, file type, file size, and upload date.
8. THE Admin_System SHALL allow Admin_Users to delete a Media_Asset, which SHALL remove the record from the database.
9. THE Admin_System SHALL restrict media upload and delete actions to authenticated Admin_Users only; unauthenticated requests to upload endpoints SHALL receive a 401 response.

---

### Requirement 9: Public Blog — Article Listing

**User Story:** As a website visitor, I want to browse published blog articles on a dedicated page, so that I can read ONEFOCUS AFRICA's content and insights.

#### Acceptance Criteria

1. THE Admin_System SHALL serve a public blog listing page at `/blog` displaying all Posts with status `PUBLISHED`.
2. THE blog listing SHALL display each Post as a card showing: cover image, category, title, author, publication date, and a short excerpt (first 160 characters of body text).
3. THE blog listing SHALL support pagination showing 9 articles per page, with visible previous and next controls.
4. THE blog listing SHALL allow visitors to filter Posts by PostCategory using visible category tabs or buttons.
5. THE blog listing SHALL include a search input that filters Posts by title or body text, returning results within 1 second for up to 1000 published Posts.
6. THE blog listing page SHALL include appropriate HTML `<title>` and `<meta name="description">` tags.
7. WHEN there are no published Posts, THE blog listing SHALL display a meaningful empty-state message rather than an empty grid.

---

### Requirement 10: Public Blog — Article Pages

**User Story:** As a website visitor, I want to read a full blog article on its own page, so that I can engage with detailed content and share it.

#### Acceptance Criteria

1. THE Admin_System SHALL serve each published Post at `/blog/[slug]` where `[slug]` is the Post's Slug.
2. WHEN a visitor requests a slug that does not match any published Post, THE Admin_System SHALL return a 404 response and render the existing not-found page.
3. THE article page SHALL render the full Post body content as HTML, preserving the Rich_Text_Editor formatting.
4. THE article page SHALL display: cover image, title, author name, publication date, PostCategories, and PostTags.
5. THE article page SHALL display a section of up to 3 related Posts from the same PostCategory, excluding the current Post.
6. THE article page SHALL include an HTML `<title>` tag using the Post's SEO title field.
7. THE article page SHALL include a `<meta name="description">` tag using the Post's SEO meta description field.
8. THE article page SHALL include a JSON-LD Structured_Data block of type `Article` with headline, author, datePublished, dateModified, image, and publisher fields.
9. THE article page SHALL be statically generated (Next.js `generateStaticParams`) for all published Posts at build time, with revalidation on Post publish or update.

---

### Requirement 11: XML Sitemap

**User Story:** As a site owner, I want all published blog articles included in the XML sitemap, so that search engines discover and index new content automatically.

#### Acceptance Criteria

1. THE Admin_System SHALL extend the site's XML_Sitemap at `/sitemap.xml` to include a `<url>` entry for every Post with status `PUBLISHED`.
2. WHEN a new Post is published, THE XML_Sitemap SHALL include the new Post URL within one revalidation cycle (within 60 seconds for ISR-configured routes).
3. WHEN a Post is deleted or its status changes from `PUBLISHED`, THE XML_Sitemap SHALL no longer include that Post's URL within one revalidation cycle.
4. THE XML_Sitemap entry for each Post SHALL include `<loc>`, `<lastmod>`, and `<changefreq>` elements.

---

### Requirement 12: Website Content Management

**User Story:** As an admin, I want to update the text and featured content on public website sections through the dashboard, so that the live site reflects current information without requiring a developer.

#### Acceptance Criteria

1. THE Admin_System SHALL provide a website content editor at `/admin/content` allowing Admin_Users with the `ADMIN` role to edit Site_Content records.
2. THE Admin_System SHALL support editable Site_Content sections corresponding to: homepage hero text, services list (title, tagline, description per service), portfolio/case studies (using the existing `CaseStudy` model), team members, programs, events, and contact information.
3. WHEN an Admin_User saves a Site_Content update, THE Admin_System SHALL persist the change and trigger revalidation of the affected public route so the update is live within 60 seconds without a full redeploy.
4. THE Admin_System SHALL prevent Site_Content edits from changing CSS classes, layout structure, or HTML element order on public pages.
5. THE Admin_System SHALL validate that contact information fields (email, phone) contain correctly formatted values before saving.
6. WHEN a Site_Content record does not exist for a section, THE public website SHALL fall back to the hardcoded default value in the component, preserving the current behaviour.

---

### Requirement 13: Portfolio and Case Study Management

**User Story:** As an admin, I want to create and manage real portfolio case studies through the dashboard, so that the Our Work page displays verified client projects.

#### Acceptance Criteria

1. THE Admin_System SHALL provide a case study editor at `/admin/portfolio` using the existing `CaseStudy` Prisma model.
2. THE case study editor SHALL allow creating, editing, and deleting `CaseStudy` records with fields: title, slug, category, clientName, challenge, solution, deliverables, outcome, publishedAssets, and isPublished.
3. WHEN `isPublished` is set to `true`, THE Admin_System SHALL make the CaseStudy available via API or server data fetch for the public `/work` page.
4. THE Admin_System SHALL validate that a CaseStudy slug is unique before saving.
5. WHEN a CaseStudy is deleted, THE Admin_System SHALL remove it from the database and it SHALL no longer appear on the public `/work` page.

---

### Requirement 14: Business Inquiry Management

**User Story:** As an admin, I want to view, update, and track all business inquiries submitted through the contact form, so that the team can follow up effectively.

#### Acceptance Criteria

1. THE Admin_System SHALL provide an inquiry management page at `/admin/inquiries` listing all `Inquiry` records from the database.
2. THE inquiry list SHALL display for each Inquiry: lead name, company, service area, Inquiry_Status, and created date.
3. THE inquiry list SHALL support filtering by Inquiry_Status.
4. THE inquiry list SHALL support text search by lead name or company.
5. THE inquiry list SHALL support pagination showing 25 records per page.
6. WHEN an Admin_User opens an Inquiry detail view, THE Admin_System SHALL display all Inquiry fields: fullName, workEmail, company, industry, country, website, serviceArea, challenge, objective, timeline, consent, status, source, and createdAt.
7. THE Admin_System SHALL allow Admin_Users to update an Inquiry's status to any value in the Inquiry_Status lifecycle.
8. THE Admin_System SHALL allow Admin_Users to add a private notes field to an Inquiry record; the notes field SHALL be stored in the database and SHALL NOT be visible to the lead submitter.
9. THE Admin_System SHALL allow Admin_Users to assign an Inquiry to a team member by name.
10. THE Admin_System SHALL enforce that Inquiry personal data (workEmail, challenge, objective) is displayed only to authenticated Admin_Users.
11. THE existing `/api/inquiries` POST route SHALL continue to accept submissions and create `Inquiry` records without modification.

---

### Requirement 15: Programs and Events Management

**User Story:** As an admin, I want to create and manage program and event listings, so that the talent section of the website reflects current offerings.

#### Acceptance Criteria

1. THE Admin_System SHALL provide a programs management page at `/admin/programs` for creating, editing, and deleting Program records.
2. THE Admin_System SHALL provide an events management page at `/admin/events` for creating, editing, and deleting Event records.
3. THE Program record SHALL include: title, description, icon, status (`active` or `inactive`), and URL anchor.
4. THE Event record SHALL include: title, description, eventDate, location, status (`upcoming`, `past`, `cancelled`), and registration link.
5. WHEN a Program or Event is saved with active or upcoming status, THE Admin_System SHALL make it available for display on the public `/talent` page.
6. THE Admin_System SHALL validate that eventDate is a valid future or past date before saving.

---

### Requirement 16: Team and Roles Management

**User Story:** As an admin, I want to manage staff admin accounts and team member profiles, so that I can onboard new editors and keep the team section accurate.

#### Acceptance Criteria

1. THE Admin_System SHALL restrict the Team & Roles module to Admin_Users with the `ADMIN` role.
2. THE Admin_System SHALL allow ADMIN users to create new Admin_User accounts by providing name, email, password, and role.
3. WHEN a new Admin_User is created, THE Admin_System SHALL hash the password using bcrypt with a cost factor of at least 12 before storing it.
4. THE Admin_System SHALL allow ADMIN users to deactivate or delete existing Admin_User accounts.
5. THE Admin_System SHALL prevent an ADMIN user from deleting their own account.
6. THE Admin_System SHALL allow ADMIN users to manage TeamMember profile records (name, role title, bio, photo) used for public display.
7. WHEN the last ADMIN account is deactivated, THE Admin_System SHALL reject the action and return a descriptive error.

---

### Requirement 17: Website Settings

**User Story:** As an admin, I want to manage global site settings through the dashboard, so that I can update configuration without editing environment files.

#### Acceptance Criteria

1. THE Admin_System SHALL restrict the Website Settings module to Admin_Users with the `ADMIN` role.
2. THE Admin_System SHALL provide a settings page at `/admin/settings` with editable fields for: site name, site URL, contact email, contact phone, WhatsApp number, SMTP configuration preview (no raw passwords displayed), and social media links.
3. WHEN an Admin_User saves settings, THE Admin_System SHALL persist the values as Site_Content records and make them available to the mailer and contact components.
4. THE Admin_System SHALL not store raw SMTP passwords in the Site_Content table; SMTP credentials SHALL remain in environment variables only.

---

### Requirement 18: Media Storage and Delivery

**User Story:** As an editor, I want uploaded files to be stored durably and served efficiently, so that images load quickly for public visitors and are not lost between deployments.

#### Acceptance Criteria

1. THE Admin_System SHALL store all uploaded files in Object_Storage (Vercel Blob or an S3-compatible service), not on the local filesystem.
2. THE Admin_System SHALL serve uploaded images through a CDN-backed public URL, not directly through the Next.js server.
3. THE Admin_System SHALL validate uploaded file MIME type server-side against an allowlist (image/jpeg, image/png, image/webp, image/gif, image/svg+xml, application/pdf) and reject files with non-allowlisted MIME types with a 415 response.
4. THE Admin_System SHALL reject uploaded files exceeding 10 MB with a 413 response.
5. WHEN a Media_Asset is deleted, THE Admin_System SHALL delete the corresponding file from Object_Storage and the database record.
6. THE Admin_System SHALL generate a non-guessable filename (UUID-prefixed) for each uploaded file to prevent direct enumeration of the storage bucket.

---

### Requirement 19: SEO and Accessibility

**User Story:** As a site owner, I want blog pages and the admin UI to meet baseline SEO and accessibility standards, so that content is discoverable and usable by all visitors.

#### Acceptance Criteria

1. THE Public_Blog listing page and each article page SHALL include valid `<title>`, `<meta name="description">`, and Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`).
2. THE article page SHALL include JSON-LD Structured_Data of type `Article` as specified in Requirement 10.
3. THE Admin_System SHALL include `/blog` and all published Post URLs in the XML_Sitemap.
4. THE Public_Blog pages SHALL meet WCAG 2.1 Level AA colour contrast requirements using the existing brand colour palette.
5. THE Public_Blog pages SHALL include descriptive `alt` attributes on all images.
6. THE admin dashboard pages SHALL be navigable by keyboard and SHALL use semantic HTML landmark elements (`<main>`, `<nav>`, `<header>`, `<aside>`).

---

### Requirement 20: Security Baseline

**User Story:** As a site owner, I want the admin system to follow security best practices, so that staff accounts and visitor data are protected.

#### Acceptance Criteria

1. THE Admin_System SHALL use HTTP-only, Secure, SameSite=Lax cookies for Admin_Session storage.
2. THE Admin_System SHALL include CSRF protection on all state-mutating server actions and API routes.
3. THE Admin_System SHALL sanitise all rich-text content before rendering it in public blog pages to prevent cross-site scripting.
4. THE Admin_System SHALL use parameterised queries (via Prisma ORM) for all database operations; raw SQL SHALL not be used.
5. THE Admin_System SHALL not expose Admin_User password hashes, session tokens, or SMTP credentials in any API response or client-side bundle.
6. THE Admin_System SHALL enforce HTTPS-only access in production by checking the deployment environment; development may use HTTP.
7. IF an unauthenticated request reaches any admin API route or Server Action, THEN THE Admin_System SHALL return 401 and SHALL NOT execute the operation.

---

### Requirement 21: Production Build and Quality Gates

**User Story:** As a developer, I want the completed system to pass a production build and key quality checks, so that it can be deployed to Vercel without manual intervention.

#### Acceptance Criteria

1. WHEN `next build` is executed, THE Admin_System SHALL produce zero TypeScript compilation errors.
2. WHEN `next build` is executed, THE Admin_System SHALL produce zero ESLint errors using the existing `.eslintrc.json` configuration.
3. THE Admin_System SHALL not introduce new peer-dependency conflicts or breaking changes to `package.json`.
4. THE Admin_System SHALL include at least one end-to-end test covering the login → create post → publish → verify public URL flow.
5. THE Admin_System SHALL include unit tests covering: password hashing, slug generation, MIME type validation, and role permission checks.
