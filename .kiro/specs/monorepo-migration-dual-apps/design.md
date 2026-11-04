# Design Document: Monorepo Migration for Dual Applications

## Overview

This design specifies the architecture for migrating the ONEFOCUS AFRICA single Next.js application into a dual-application monorepo structure. The migration will separate the public-facing website (www.onefocusafrica.com) from the private admin dashboard (admin.onefocusafrica.com) while enabling independent deployments and shared database/package resources.

### Goals

1. **Application Separation**: Isolate public and admin applications for independent deployment
2. **Build Independence**: Enable building and deploying one application without affecting the other
3. **Code Sharing**: Share database schema, Prisma client, types, and utilities through workspace packages
4. **Zero Data Loss**: Preserve all database records during SQLite → PostgreSQL migration
5. **Feature Parity**: Maintain 100% functional equivalence post-migration
6. **Content Synchronization**: Enable real-time content publishing from admin to web (< 60 seconds)
7. **Security Boundaries**: Enforce strict separation between admin and public authentication/authorization

### Migration Scope

**Source Application:**
- Single Next.js 15 app with 17 admin pages + 10 public routes
- SQLite database with 13 models
- NextAuth v5 authentication
- Vercel Blob storage
- TipTap rich text editor

**Target Architecture:**
- Monorepo with npm workspaces
- Two applications: `@onefocus/web` and `@onefocus/admin`
- Two packages: `@onefocus/database` and `@onefocus/shared`
- PostgreSQL database with connection pooling
- Independent Vercel deployments
- ISR-based content synchronization

## Architecture

### Monorepo Structure

```
onefocus-africa/
├── apps/
│   ├── web/                    # Public website (@onefocus/web)
│   │   ├── app/
│   │   │   ├── (routes)/
│   │   │   │   ├── page.tsx           # Home
│   │   │   │   ├── about/
│   │   │   │   ├── solutions/
│   │   │   │   ├── work/
│   │   │   │   ├── talent/
│   │   │   │   ├── contact/
│   │   │   │   ├── blog/
│   │   │   │   │   ├── page.tsx        # Blog index
│   │   │   │   │   └── [slug]/page.tsx # Blog post
│   │   │   │   ├── privacy/
│   │   │   │   └── terms/
│   │   │   ├── api/
│   │   │   │   ├── inquiries/route.ts
│   │   │   │   ├── community/route.ts
│   │   │   │   └── revalidate/route.ts  # NEW: Content sync
│   │   │   ├── layout.tsx
│   │   │   ├── globals.css
│   │   │   ├── error.tsx
│   │   │   ├── loading.tsx
│   │   │   ├── not-found.tsx
│   │   │   └── sitemap.ts
│   │   ├── components/
│   │   │   ├── sections/       # Hero, Features, CTA, etc.
│   │   │   └── forms/          # ContactForm, NewsletterForm
│   │   ├── lib/
│   │   │   └── (web-specific utilities)
│   │   ├── public/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── tailwind.config.js
│   │   ├── next.config.js
│   │   ├── vercel.json
│   │   └── .env.example
│   │
│   └── admin/                  # Admin dashboard (@onefocus/admin)
│       ├── app/
│       │   ├── admin/
│       │   │   ├── page.tsx            # Dashboard
│       │   │   ├── login/page.tsx
│       │   │   ├── blog/
│       │   │   │   ├── page.tsx
│       │   │   │   ├── new/page.tsx
│       │   │   │   ├── [id]/edit/page.tsx
│       │   │   │   ├── categories/page.tsx
│       │   │   │   ├── BlogTable.tsx
│       │   │   │   ├── BlogFilters.tsx
│       │   │   │   ├── PostEditor.tsx
│       │   │   │   └── actions.ts
│       │   │   ├── portfolio/
│       │   │   │   ├── page.tsx
│       │   │   │   ├── new/page.tsx
│       │   │   │   ├── [id]/edit/page.tsx
│       │   │   │   ├── PortfolioTable.tsx
│       │   │   │   ├── CaseStudyForm.tsx
│       │   │   │   └── actions.ts
│       │   │   ├── inquiries/
│       │   │   │   ├── page.tsx
│       │   │   │   ├── [id]/page.tsx
│       │   │   │   ├── InquiryDetailClient.tsx
│       │   │   │   └── actions.ts
│       │   │   ├── programs/
│       │   │   ├── events/
│       │   │   ├── team/
│       │   │   ├── media/
│       │   │   ├── content/
│       │   │   ├── settings/
│       │   │   └── layout.tsx
│       │   ├── api/
│       │   │   ├── auth/
│       │   │   │   └── [...nextauth]/route.ts
│       │   │   └── admin/
│       │   │       ├── media/route.ts
│       │   │       └── slug-check/route.ts
│       │   ├── layout.tsx
│       │   ├── globals.css
│       │   └── error.tsx
│       ├── components/
│       │   └── admin/          # DataTable, RichTextEditor, etc.
│       │       └── editor/
│       ├── lib/
│       │   ├── auth.ts
│       │   ├── auth-utils.ts
│       │   ├── upload.ts
│       │   └── revalidation.ts  # NEW: Trigger web revalidation
│       ├── package.json
│       ├── tsconfig.json
│       ├── tailwind.config.js
│       ├── next.config.js
│       ├── vercel.json
│       └── .env.example
│
├── packages/
│   ├── database/               # Shared Prisma client (@onefocus/database)
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # PostgreSQL schema
│   │   │   └── migrations/
│   │   ├── src/
│   │   │   └── index.ts        # Exports Prisma client
│   │   ├── scripts/
│   │   │   └── migrate-sqlite-to-postgres.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── shared/                 # Shared utilities (@onefocus/shared)
│       ├── src/
│       │   ├── types/          # TypeScript types
│       │   ├── validation/     # Zod schemas
│       │   ├── utils/
│       │   │   ├── email.ts
│       │   │   ├── slug.ts
│       │   │   └── sanitize.ts
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
│
├── scripts/
│   └── (root-level scripts)
├── package.json                # Root workspace config
├── tsconfig.json               # Base TypeScript config
├── .gitignore
├── README.md
└── MIGRATION.md                # Migration guide
```

### Architecture Diagram

```mermaid
graph TB
    subgraph "Public Domain: www.onefocusafrica.com"
        WEB["@onefocus/web<br/>Next.js App<br/>Port 3000"]
        WEB_API["Public APIs<br/>/api/inquiries<br/>/api/community<br/>/api/revalidate"]
    end

    subgraph "Admin Domain: admin.onefocusafrica.com"
        ADMIN["@onefocus/admin<br/>Next.js App<br/>Port 3001"]
        ADMIN_API["Admin APIs<br/>/api/auth/*<br/>/api/admin/*"]
    end

    subgraph "Shared Packages"
        DB["@onefocus/database<br/>Prisma Client<br/>Schema & Migrations"]
        SHARED["@onefocus/shared<br/>Types, Validation<br/>Utilities"]
    end

    subgraph "External Services"
        POSTGRES[(PostgreSQL<br/>Railway/Supabase)]
        BLOB[Vercel Blob<br/>Media Storage]
    end

    WEB --> DB
    WEB --> SHARED
    WEB_API --> DB
    
    ADMIN --> DB
    ADMIN --> SHARED
    ADMIN_API --> DB
    ADMIN_API --> BLOB
    
    DB --> POSTGRES
    
    ADMIN -.->|"Revalidation Webhook<br/>(Authenticated)"| WEB_API
    
    WEB --> BLOB
    
    style WEB fill:#4CAF50
    style ADMIN fill:#2196F3
    style DB fill:#FF9800
    style SHARED fill:#FF9800
    style POSTGRES fill:#336791
    style BLOB fill:#000000
```

### Deployment Architecture

```mermaid
graph LR
    subgraph "Vercel Project 1: Web"
        WEB_DEPLOY[Build: npm run build:web<br/>Deploy: www.onefocusafrica.com]
    end

    subgraph "Vercel Project 2: Admin"
        ADMIN_DEPLOY[Build: npm run build:admin<br/>Deploy: admin.onefocusafrica.com]
    end

    subgraph "Database Provider"
        DB_PROD[(PostgreSQL<br/>Production)]
    end

    subgraph "Media Storage"
        BLOB_PROD[Vercel Blob<br/>Shared Storage]
    end

    GIT[Git Push] --> WEB_DEPLOY
    GIT --> ADMIN_DEPLOY
    
    WEB_DEPLOY --> DB_PROD
    ADMIN_DEPLOY --> DB_PROD
    
    WEB_DEPLOY --> BLOB_PROD
    ADMIN_DEPLOY --> BLOB_PROD
    
    style WEB_DEPLOY fill:#4CAF50
    style ADMIN_DEPLOY fill:#2196F3
    style DB_PROD fill:#336791
```

## Components and Interfaces

### Workspace Configuration

#### Root package.json

```json
{
  "name": "onefocus-monorepo",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev:web": "npm run dev --workspace=@onefocus/web",
    "dev:admin": "npm run dev --workspace=@onefocus/admin",
    "dev:all": "concurrently \"npm run dev:web\" \"npm run dev:admin\"",
    
    "build:web": "npm run build --workspace=@onefocus/web",
    "build:admin": "npm run build --workspace=@onefocus/admin",
    "build:all": "npm run build:web && npm run build:admin",
    
    "test:web": "npm run test --workspace=@onefocus/web",
    "test:admin": "npm run test --workspace=@onefocus/admin",
    "test:all": "npm run test:web && npm run test:admin",
    
    "db:generate": "npm run generate --workspace=@onefocus/database",
    "db:migrate": "npm run migrate --workspace=@onefocus/database",
    "db:migrate:deploy": "npm run migrate:deploy --workspace=@onefocus/database",
    "db:studio": "npm run studio --workspace=@onefocus/database"
  },
  "devDependencies": {
    "@types/node": "^22.10.5",
    "typescript": "^5.7.2",
    "eslint": "^9.18.0",
    "concurrently": "^9.0.0"
  }
}
```

#### Root tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowJs": true,
    "checkJs": false,
    "jsx": "preserve",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "incremental": true
  },
  "references": [
    { "path": "./apps/web" },
    { "path": "./apps/admin" },
    { "path": "./packages/database" },
    { "path": "./packages/shared" }
  ],
  "exclude": ["node_modules"]
}
```

### Application Packages

#### apps/web/package.json

```json
{
  "name": "@onefocus/web",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest --run"
  },
  "dependencies": {
    "@onefocus/database": "*",
    "@onefocus/shared": "*",
    "next": "^15.1.6",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "framer-motion": "^12.0.0",
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "@types/node": "^22.10.5",
    "@types/react": "^19.0.6",
    "@vitejs/plugin-react": "^6.2.1",
    "typescript": "^5.7.2",
    "tailwindcss": "3.4.1",
    "autoprefixer": "10.4.17",
    "postcss": "8.4.35",
    "vitest": "^5.1.0",
    "fast-check": "^4.10.2"
  }
}
```

#### apps/admin/package.json

```json
{
  "name": "@onefocus/admin",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start -p 3001",
    "lint": "next lint",
    "test": "vitest --run"
  },
  "dependencies": {
    "@onefocus/database": "*",
    "@onefocus/shared": "*",
    "next": "^15.1.6",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next-auth": "^5.0.0-beta.32",
    "@auth/prisma-adapter": "^2.11.3",
    "bcryptjs": "^3.0.3",
    "@tiptap/react": "^3.32.2",
    "@tiptap/starter-kit": "^3.32.2",
    "@tiptap/extension-link": "^3.32.2",
    "@tiptap/extension-placeholder": "^3.32.2",
    "@tiptap/pm": "^3.32.2",
    "@vercel/blob": "^2.8.2",
    "framer-motion": "^12.0.0",
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "@types/node": "^22.10.5",
    "@types/react": "^19.0.6",
    "@types/bcryptjs": "^2.4.6",
    "@vitejs/plugin-react": "^6.2.1",
    "typescript": "^5.7.2",
    "tailwindcss": "3.4.1",
    "autoprefixer": "10.4.17",
    "postcss": "8.4.35",
    "vitest": "^5.1.0",
    "fast-check": "^4.10.2"
  }
}
```

### Shared Packages

#### packages/database/package.json

```json
{
  "name": "@onefocus/database",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "generate": "prisma generate",
    "migrate": "prisma migrate dev",
    "migrate:deploy": "prisma migrate deploy",
    "studio": "prisma studio",
    "push": "prisma db push"
  },
  "dependencies": {
    "@prisma/client": "^6.2.0"
  },
  "devDependencies": {
    "prisma": "^6.2.0",
    "typescript": "^5.7.2"
  }
}
```

#### packages/database/src/index.ts

```typescript
import { PrismaClient } from '@prisma/client'

// Singleton pattern for Prisma Client
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
}

// Re-export Prisma types
export * from '@prisma/client'
```

#### packages/shared/package.json

```json
{
  "name": "@onefocus/shared",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "dependencies": {
    "zod": "^3.24.1",
    "nodemailer": "^8.0.11",
    "dompurify": "^3.4.17",
    "jsdom": "^30.1.3"
  },
  "devDependencies": {
    "@types/nodemailer": "^6.4.16",
    "@types/dompurify": "^3.0.5",
    "@types/jsdom": "^30.0.0",
    "typescript": "^5.7.2"
  }
}
```

#### packages/shared/src/index.ts

```typescript
// Re-export all utilities
export * from './validation'
export * from './utils/email'
export * from './utils/slug'
export * from './utils/sanitize'
export * from './types'
```

### Application TypeScript Configurations

#### apps/web/tsconfig.json

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@onefocus/database": ["../../packages/database/src"],
      "@onefocus/shared": ["../../packages/shared/src"]
    },
    "plugins": [{ "name": "next" }]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

#### apps/admin/tsconfig.json

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@onefocus/database": ["../../packages/database/src"],
      "@onefocus/shared": ["../../packages/shared/src"]
    },
    "plugins": [{ "name": "next" }]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Vercel Deployment Configuration

#### apps/web/vercel.json

```json
{
  "buildCommand": "cd ../.. && npm run build:web",
  "outputDirectory": ".next",
  "installCommand": "cd ../.. && npm install",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

#### apps/admin/vercel.json

```json
{
  "buildCommand": "cd ../.. && npm run build:admin",
  "outputDirectory": ".next",
  "installCommand": "cd ../.. && npm install",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

## Data Models

### Database Schema Migration

The schema migrates from SQLite to PostgreSQL with the following changes:

#### packages/database/prisma/schema.prisma

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// All 13 models preserved with PostgreSQL-specific optimizations

model Inquiry {
  id          String   @id @default(uuid()) @db.Uuid
  fullName    String   @db.VarChar(255)
  workEmail   String   @db.VarChar(255)
  company     String?  @db.VarChar(255)
  industry    String?  @db.VarChar(255)
  country     String?  @db.VarChar(100)
  website     String?  @db.VarChar(500)
  serviceArea String   @db.VarChar(100)
  challenge   String   @db.Text
  objective   String?  @db.Text
  timeline    String?  @db.VarChar(100)
  consent     Boolean  @default(false)
  status      String   @default("new") @db.VarChar(50)
  source      String   @default("website") @db.VarChar(50)
  assignedTo  String?  @db.VarChar(255)
  notes       String?  @db.Text
  followUpDate DateTime? @db.Timestamptz
  createdAt   DateTime @default(now()) @db.Timestamptz
  updatedAt   DateTime @updatedAt @db.Timestamptz

  @@index([status])
  @@index([createdAt])
}

model CommunityMember {
  id            String   @id @default(uuid()) @db.Uuid
  fullName      String   @db.VarChar(255)
  email         String   @unique @db.VarChar(255)
  whatsappPhone String?  @db.VarChar(50)
  membershipFee Float    @default(2.00) @db.DoublePrecision
  paymentStatus String   @default("pending") @db.VarChar(50)
  interests     String   @db.Text
  joinedAt      DateTime @default(now()) @db.Timestamptz
  isActive      Boolean  @default(true)

  @@index([email])
  @@index([paymentStatus])
}

model NewsletterSubscriber {
  id          String   @id @default(uuid()) @db.Uuid
  email       String   @unique @db.VarChar(255)
  subscribedAt DateTime @default(now()) @db.Timestamptz
  isActive    Boolean  @default(true)
}

model CaseStudy {
  id            String   @id @default(uuid()) @db.Uuid
  title         String   @db.VarChar(500)
  slug          String   @unique @db.VarChar(255)
  category      String   @db.VarChar(100)
  clientName    String?  @db.VarChar(255)
  challenge     String   @db.Text
  solution      String   @db.Text
  deliverables  String   @db.Text
  outcome       String   @db.Text
  publishedAssets String @db.Text
  isPublished   Boolean  @default(false)
  publishedAt   DateTime? @db.Timestamptz
  createdAt     DateTime @default(now()) @db.Timestamptz
  updatedAt     DateTime @updatedAt @db.Timestamptz

  @@index([slug])
  @@index([category])
  @@index([isPublished])
}

enum AdminRole {
  ADMIN
  EDITOR
}

enum PostStatus {
  DRAFT
  REVIEW
  SCHEDULED
  PUBLISHED
}

enum ProgramStatus {
  active
  inactive
}

enum EventStatus {
  upcoming
  past
  cancelled
}

model AdminUser {
  id             String    @id @default(uuid()) @db.Uuid
  name           String    @db.VarChar(255)
  email          String    @unique @db.VarChar(255)
  hashedPassword String    @db.VarChar(255)
  role           AdminRole @default(EDITOR)
  isActive       Boolean   @default(true)
  lastLoginAt    DateTime? @db.Timestamptz
  createdAt      DateTime  @default(now()) @db.Timestamptz
  updatedAt      DateTime  @updatedAt @db.Timestamptz

  posts          Post[]
  mediaAssets    MediaAsset[]
  siteContents   SiteContent[]

  @@index([email])
  @@index([role])
}

model Post {
  id             String     @id @default(uuid()) @db.Uuid
  title          String     @db.VarChar(500)
  slug           String     @unique @db.VarChar(255)
  content        String     @db.Text
  excerpt        String?    @db.Text
  coverImage     String?    @db.VarChar(1000)
  seoTitle       String?    @db.VarChar(255)
  seoDescription String?    @db.VarChar(500)
  status         PostStatus @default(DRAFT)
  scheduledAt    DateTime?  @db.Timestamptz
  publishedAt    DateTime?  @db.Timestamptz
  authorId       String     @db.Uuid
  author         AdminUser  @relation(fields: [authorId], references: [id])
  categories     PostCategory[] @relation("PostToCategory")
  tags           PostTag[]      @relation("PostToTag")
  createdAt      DateTime   @default(now()) @db.Timestamptz
  updatedAt      DateTime   @updatedAt @db.Timestamptz

  @@index([slug])
  @@index([status])
  @@index([publishedAt])
  @@index([authorId])
}

model PostCategory {
  id    String @id @default(uuid()) @db.Uuid
  name  String @unique @db.VarChar(255)
  slug  String @unique @db.VarChar(255)
  posts Post[] @relation("PostToCategory")

  @@index([slug])
}

model PostTag {
  id    String @id @default(uuid()) @db.Uuid
  name  String @unique @db.VarChar(255)
  slug  String @unique @db.VarChar(255)
  posts Post[] @relation("PostToTag")
}

model MediaAsset {
  id            String    @id @default(uuid()) @db.Uuid
  filename      String    @db.VarChar(255)
  originalName  String    @db.VarChar(255)
  url           String    @db.VarChar(1000)
  mimeType      String    @db.VarChar(100)
  size          Int       @db.Integer
  uploadedById  String    @db.Uuid
  uploadedBy    AdminUser @relation(fields: [uploadedById], references: [id])
  createdAt     DateTime  @default(now()) @db.Timestamptz

  @@index([uploadedById])
  @@index([mimeType])
}

model SiteContent {
  id          String    @id @default(uuid()) @db.Uuid
  section     String    @db.VarChar(100)
  key         String    @db.VarChar(100)
  value       String    @db.Text
  updatedById String    @db.Uuid
  updatedBy   AdminUser @relation(fields: [updatedById], references: [id])
  updatedAt   DateTime  @updatedAt @db.Timestamptz

  @@unique([section, key])
  @@index([section])
}

model Program {
  id          String        @id @default(uuid()) @db.Uuid
  title       String        @db.VarChar(255)
  description String        @db.Text
  icon        String?       @db.VarChar(100)
  status      ProgramStatus @default(active)
  urlAnchor   String?       @db.VarChar(100)
  createdAt   DateTime      @default(now()) @db.Timestamptz
  updatedAt   DateTime      @updatedAt @db.Timestamptz

  @@index([status])
}

model Event {
  id               String      @id @default(uuid()) @db.Uuid
  title            String      @db.VarChar(255)
  description      String      @db.Text
  eventDate        DateTime    @db.Timestamptz
  location         String?     @db.VarChar(255)
  status           EventStatus @default(upcoming)
  registrationLink String?     @db.VarChar(1000)
  createdAt        DateTime    @default(now()) @db.Timestamptz
  updatedAt        DateTime    @updatedAt @db.Timestamptz

  @@index([status])
  @@index([eventDate])
}

model TeamMember {
  id        String   @id @default(uuid()) @db.Uuid
  name      String   @db.VarChar(255)
  roleTitle String   @db.VarChar(255)
  bio       String?  @db.Text
  photo     String?  @db.VarChar(1000)
  sortOrder Int      @default(0) @db.Integer
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now()) @db.Timestamptz
  updatedAt DateTime @updatedAt @db.Timestamptz

  @@index([isActive])
  @@index([sortOrder])
}
```

### Migration Script Design

#### packages/database/scripts/migrate-sqlite-to-postgres.ts

```typescript
import { PrismaClient as SQLiteClient } from '@prisma/client'
import { PrismaClient as PostgresClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

interface MigrationReport {
  startTime: Date
  endTime?: Date
  sqliteBackupPath?: string
  recordCounts: {
    model: string
    sqlite: number
    postgres: number
    status: 'success' | 'failed' | 'mismatch'
  }[]
  errors: { model: string; error: string; details?: any }[]
}

async function migrateData() {
  const report: MigrationReport = {
    startTime: new Date(),
    recordCounts: [],
    errors: []
  }

  try {
    // 1. Create backup of SQLite database
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupDir = path.join(process.cwd(), 'backups')
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true })
    }
    
    const sqlitePath = process.env.SQLITE_DATABASE_URL?.replace('file:', '') || './prisma/dev.db'
    const backupPath = path.join(backupDir, `sqlite-backup-${timestamp}.db`)
    fs.copyFileSync(sqlitePath, backupPath)
    report.sqliteBackupPath = backupPath
    
    console.log(`✓ Backup created: ${backupPath}`)

    // 2. Initialize clients
    const sqliteDb = new SQLiteClient({
      datasources: { db: { url: process.env.SQLITE_DATABASE_URL } }
    })
    
    const postgresDb = new PostgresClient({
      datasources: { db: { url: process.env.DATABASE_URL } }
    })

    // 3. Test connections
    await sqliteDb.$connect()
    await postgresDb.$connect()
    console.log('✓ Database connections established')

    // 4. Migrate each model
    const models = [
      'inquiry',
      'communityMember',
      'newsletterSubscriber',
      'caseStudy',
      'adminUser',
      'post',
      'postCategory',
      'postTag',
      'mediaAsset',
      'siteContent',
      'program',
      'event',
      'teamMember'
    ]

    for (const model of models) {
      try {
        // Count records in SQLite
        const sqliteCount = await (sqliteDb as any)[model].count()
        
        // Fetch all records
        const records = await (sqliteDb as any)[model].findMany()
        
        // Insert into PostgreSQL
        for (const record of records) {
          await (postgresDb as any)[model].create({
            data: record
          })
        }
        
        // Verify count in PostgreSQL
        const postgresCount = await (postgresDb as any)[model].count()
        
        report.recordCounts.push({
          model,
          sqlite: sqliteCount,
          postgres: postgresCount,
          status: sqliteCount === postgresCount ? 'success' : 'mismatch'
        })
        
        console.log(`✓ Migrated ${model}: ${postgresCount}/${sqliteCount} records`)
      } catch (error) {
        report.errors.push({
          model,
          error: error instanceof Error ? error.message : String(error),
          details: error
        })
        console.error(`✗ Failed to migrate ${model}:`, error)
      }
    }

    // 5. Disconnect
    await sqliteDb.$disconnect()
    await postgresDb.$disconnect()

    report.endTime = new Date()

    // 6. Generate report
    const reportPath = path.join(backupDir, `migration-report-${timestamp}.json`)
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
    
    console.log('\n=== Migration Complete ===')
    console.log(`Duration: ${(report.endTime.getTime() - report.startTime.getTime()) / 1000}s`)
    console.log(`Report: ${reportPath}`)
    
    // Check for errors
    if (report.errors.length > 0) {
      console.error(`\n⚠️  ${report.errors.length} errors occurred during migration`)
      process.exit(1)
    }
    
    // Check for mismatches
    const mismatches = report.recordCounts.filter(r => r.status === 'mismatch')
    if (mismatches.length > 0) {
      console.error(`\n⚠️  Record count mismatches detected:`)
      mismatches.forEach(m => {
        console.error(`  - ${m.model}: SQLite=${m.sqlite}, PostgreSQL=${m.postgres}`)
      })
      process.exit(1)
    }
    
    console.log('\n✓ All data migrated successfully')
  } catch (error) {
    console.error('Migration failed:', error)
    report.errors.push({
      model: 'global',
      error: error instanceof Error ? error.message : String(error),
      details: error
    })
    process.exit(1)
  }
}

migrateData()
```

### Connection Pooling Configuration

For PostgreSQL providers, connection pooling is configured as follows:

**Vercel Postgres:**
```typescript
// Use @vercel/postgres with built-in pooling
import { sql } from '@vercel/postgres'
```

**Supabase:**
```env
# Use connection pooling mode in DATABASE_URL
DATABASE_URL="postgresql://user:pass@host:6543/db?pgbouncer=true&connection_limit=1"
```

**Railway/Neon:**
```env
# Direct connection with connection_limit
DATABASE_URL="postgresql://user:pass@host:5432/db?connection_limit=5"
```

## Content Synchronization Design

### Revalidation Webhook

#### apps/web/app/api/revalidate/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function POST(request: NextRequest) {
  try {
    // 1. Validate authentication token
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token || token !== process.env.ADMIN_REVALIDATION_TOKEN) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 2. Parse request body
    const body = await request.json()
    const { path, tag } = body

    // 3. Perform revalidation
    if (path) {
      await revalidatePath(path)
      console.log(`Revalidated path: ${path}`)
    }
    
    if (tag) {
      await revalidateTag(tag)
      console.log(`Revalidated tag: ${tag}`)
    }

    return NextResponse.json({
      revalidated: true,
      path,
      tag,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### Revalidation Client Utility

#### apps/admin/lib/revalidation.ts

```typescript
export async function triggerRevalidation(paths: string[]) {
  const webAppUrl = process.env.WEB_APP_URL || 'https://www.onefocusafrica.com'
  const token = process.env.ADMIN_REVALIDATION_TOKEN

  if (!token) {
    console.error('ADMIN_REVALIDATION_TOKEN not configured')
    return
  }

  for (const path of paths) {
    try {
      const response = await fetch(`${webAppUrl}/api/revalidate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ path })
      })

      if (!response.ok) {
        console.error(`Failed to revalidate ${path}: ${response.statusText}`)
      } else {
        console.log(`✓ Revalidated: ${path}`)
      }
    } catch (error) {
      console.error(`Error revalidating ${path}:`, error)
    }
  }
}

// Usage in admin actions
export async function onBlogPostPublish(slug: string) {
  await triggerRevalidation([
    '/blog',
    `/blog/${slug}`
  ])
}

export async function onCaseStudyPublish() {
  await triggerRevalidation(['/work'])
}

export async function onContentUpdate(section: string) {
  // Revalidate the specific page
  const pageMap: Record<string, string> = {
    'home-hero': '/',
    'about-hero': '/about',
    'solutions-hero': '/solutions'
  }
  
  const path = pageMap[section]
  if (path) {
    await triggerRevalidation([path])
  }
}
```

### ISR Configuration

#### apps/web/app/blog/page.tsx

```typescript
export const revalidate = 3600 // Revalidate every hour

export default async function BlogPage() {
  const posts = await db.post.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { publishedAt: 'desc' }
  })
  
  return <BlogList posts={posts} />
}
```

#### apps/web/app/blog/[slug]/page.tsx

```typescript
export const revalidate = 3600 // Revalidate every hour

export async function generateStaticParams() {
  const posts = await db.post.findMany({
    where: { status: 'PUBLISHED' },
    select: { slug: true }
  })
  
  return posts.map(post => ({ slug: post.slug }))
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await db.post.findUnique({
    where: { slug: params.slug, status: 'PUBLISHED' }
  })
  
  if (!post) notFound()
  
  return <BlogPost post={post} />
}
```

### Synchronization Flow

```mermaid
sequenceDiagram
    participant Admin as Admin User
    participant AdminApp as @onefocus/admin
    participant WebhookAPI as Web /api/revalidate
    participant WebApp as @onefocus/web
    participant Visitor as Website Visitor

    Admin->>AdminApp: Publish blog post
    AdminApp->>AdminApp: Update status to PUBLISHED
    AdminApp->>AdminApp: Set publishedAt timestamp
    AdminApp->>WebhookAPI: POST /api/revalidate<br/>{path: "/blog/[slug]"}<br/>Authorization: Bearer token
    WebhookAPI->>WebhookAPI: Validate token
    WebhookAPI->>WebApp: revalidatePath("/blog/[slug]")
    WebApp->>WebApp: Clear Next.js cache
    WebhookAPI-->>AdminApp: 200 OK {revalidated: true}
    
    Note over WebApp: Next request rebuilds page
    
    Visitor->>WebApp: GET /blog/[slug]
    WebApp->>WebApp: Page not in cache
    WebApp->>WebApp: Fetch from database
    WebApp->>WebApp: Render page
    WebApp->>WebApp: Cache for 3600s
    WebApp-->>Visitor: Fresh HTML with new post
```

## Security Design

### Authentication Boundaries

```mermaid
graph TB
    subgraph "Public Domain (No Auth)"
        WEB_PUBLIC[Public Routes<br/>/, /about, /blog, etc.]
        WEB_API[Public APIs<br/>/api/inquiries<br/>/api/community]
    end

    subgraph "Admin Domain (Auth Required)"
        ADMIN_LOGIN[/admin/login<br/>Public]
        ADMIN_PROTECTED[Protected Routes<br/>/admin/*]
        ADMIN_API[Admin APIs<br/>/api/auth/*<br/>/api/admin/*]
    end

    subgraph "Security Layer"
        NEXTAUTH[NextAuth v5<br/>Session Management]
        MIDDLEWARE[Admin Middleware<br/>Route Protection]
    end

    ADMIN_LOGIN -->|Credentials| NEXTAUTH
    NEXTAUTH -->|Session Cookie| ADMIN_PROTECTED
    MIDDLEWARE -->|Validates| ADMIN_PROTECTED
    ADMIN_PROTECTED --> ADMIN_API
    
    style WEB_PUBLIC fill:#90EE90
    style WEB_API fill:#90EE90
    style ADMIN_LOGIN fill:#FFD700
    style ADMIN_PROTECTED fill:#FF6B6B
    style ADMIN_API fill:#FF6B6B
    style NEXTAUTH fill:#4169E1
```

### Token Configuration

#### Admin Revalidation Token

```typescript
// Generate secure token (run once, store in env vars)
import crypto from 'crypto'

const generateToken = () => {
  return crypto.randomBytes(32).toString('hex')
}

// Example: e8f2a1c4d6b9e0f3a7c5d9e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2c4d6e8f0a2
```

**Environment Variables:**

```env
# apps/admin/.env.local
ADMIN_REVALIDATION_TOKEN=e8f2a1c4d6b9e0f3a7c5d9e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2c4d6e8f0a2
WEB_APP_URL=https://www.onefocusafrica.com

# apps/web/.env.local
ADMIN_REVALIDATION_TOKEN=e8f2a1c4d6b9e0f3a7c5d9e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2c4d6e8f0a2
```

#### NextAuth Configuration

```typescript
// apps/admin/lib/auth.ts
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { db } from '@onefocus/database'
import bcrypt from 'bcryptjs'

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await db.adminUser.findUnique({
          where: { email: credentials.email as string }
        })

        if (!user || !user.isActive) {
          return null
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.hashedPassword
        )

        if (!isValid) {
          return null
        }

        // Update last login
        await db.adminUser.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() }
        })

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role
      }
      return session
    }
  },
  pages: {
    signIn: '/admin/login'
  }
})
```

### Middleware for Route Protection

#### apps/admin/middleware.ts

```typescript
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isAuthPage = req.nextUrl.pathname === '/admin/login'
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')

  // Allow access to login page
  if (isAuthPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/admin', req.url))
    }
    return NextResponse.next()
  }

  // Protect all admin routes
  if (isAdminRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/admin/:path*']
}
```

### CORS and Security Headers

#### apps/web/next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: process.env.ADMIN_APP_URL || 'https://admin.onefocusafrica.com' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Authorization, Content-Type' }
        ]
      }
    ]
  }
}

module.exports = nextConfig
```

## Error Handling

### Error Pages

Both applications preserve error handling from the source:

**apps/web/app/error.tsx** - Friendly public error page  
**apps/admin/app/error.tsx** - Detailed admin error page with debug info

### Logging Strategy

```typescript
// Shared logging utility
export function logError(context: string, error: unknown, metadata?: Record<string, any>) {
  const errorMessage = error instanceof Error ? error.message : String(error)
  const errorStack = error instanceof Error ? error.stack : undefined
  
  console.error({
    context,
    message: errorMessage,
    stack: errorStack,
    metadata,
    timestamp: new Date().toISOString()
  })
  
  // In production, send to monitoring service (e.g., Sentry)
  if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
    // Send to Sentry
  }
}
```

### Revalidation Error Handling

```typescript
// apps/admin/lib/revalidation.ts
export async function triggerRevalidation(paths: string[]) {
  const results = await Promise.allSettled(
    paths.map(path => revalidatePath(path))
  )
  
  const failed = results.filter(r => r.status === 'rejected')
  
  if (failed.length > 0) {
    logError('revalidation', new Error('Some paths failed to revalidate'), {
      totalPaths: paths.length,
      failedCount: failed.length,
      paths
    })
  }
}
```

## Testing Strategy

### Why Property-Based Testing is Not Applicable

**Property-Based Testing (PBT) is explicitly NOT used** for this migration project because:
1. **Infrastructure as Code**: Monorepo structure, Vercel config, and deployment setup are declarative configurations, not functions with input/output behavior
2. **Migration Operations**: Database migration is a one-time operation with specific input data, not a universal transformation
3. **Side-Effect Operations**: Revalidation webhooks, authentication, and file operations have external side effects

**Alternative Testing Strategies:**

1. **Example-Based Unit Tests**: Test specific scenarios for utilities, API routes, and business logic
2. **Integration Tests**: Verify database operations, API endpoints, and cross-application communication
3. **Migration Verification**: Automated script to verify data integrity post-migration
4. **Smoke Tests**: Ensure both applications start and render critical pages

### Testing Structure

```
apps/web/
  __tests__/
    api/
      inquiries.test.ts
      community.test.ts
      revalidate.test.ts
    pages/
      blog.test.ts

apps/admin/
  __tests__/
    api/
      auth.test.ts
      media.test.ts
    actions/
      blog-actions.test.ts
      portfolio-actions.test.ts
    lib/
      revalidation.test.ts

packages/database/
  __tests__/
    migration.test.ts
    connection.test.ts

packages/shared/
  __tests__/
    validation.test.ts
    utils.test.ts
```

### Critical Test Cases

#### 1. Database Migration Verification

```typescript
// packages/database/__tests__/migration.test.ts
describe('Database Migration', () => {
  it('should preserve all record counts', async () => {
    // Compare SQLite backup counts with PostgreSQL
  })
  
  it('should preserve UUID primary keys', async () => {
    // Verify IDs match between databases
  })
  
  it('should preserve foreign key relationships', async () => {
    // Verify all relations intact
  })
})
```

#### 2. Revalidation Webhook

```typescript
// apps/web/__tests__/api/revalidate.test.ts
describe('Revalidation Webhook', () => {
  it('should reject requests without valid token', async () => {
    const response = await POST(mockRequest({ path: '/blog' }))
    expect(response.status).toBe(401)
  })
  
  it('should revalidate path with valid token', async () => {
    const response = await POST(mockRequest({
      path: '/blog',
      token: process.env.ADMIN_REVALIDATION_TOKEN
    }))
    expect(response.status).toBe(200)
  })
})
```

#### 3. Authentication Boundaries

```typescript
// apps/admin/__tests__/middleware.test.ts
describe('Admin Middleware', () => {
  it('should redirect unauthenticated users to login', async () => {
    // Test middleware redirects
  })
  
  it('should allow authenticated users to access admin routes', async () => {
    // Test with valid session
  })
})
```

#### 4. Build Independence

```bash
# Verify builds work independently
npm run build:web    # Should succeed without admin dependencies
npm run build:admin  # Should succeed without web dependencies
```

### End-to-End Testing

Using Playwright to verify feature parity:

```typescript
// e2e/migration.spec.ts
test.describe('Post-Migration Feature Parity', () => {
  test('public website renders home page', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await expect(page.locator('h1')).toBeVisible()
  })
  
  test('admin dashboard requires authentication', async ({ page }) => {
    await page.goto('http://localhost:3001/admin/blog')
    await expect(page).toHaveURL(/\/admin\/login/)
  })
  
  test('publishing blog post triggers revalidation', async ({ page }) => {
    // Login to admin
    // Create and publish post
    // Verify appears on web within 60s
  })
})
```

## Migration Execution Plan

### Phase 1: Pre-Migration (Days 1-2)

**Day 1: Preparation**
1. ✓ Create migration branch: `git checkout -b migration/monorepo-dual-apps`
2. ✓ Create pre-migration tag: `git tag pre-migration`
3. ✓ Backup SQLite database
4. ✓ Document current Vercel configuration
5. ✓ Export all environment variables to secure location
6. ✓ Set up PostgreSQL database (Railway/Supabase/Neon)
7. ✓ Create `.env.local` files for both apps with new DATABASE_URL

**Day 2: Structure Setup**
1. ✓ Create monorepo directory structure
2. ✓ Create root `package.json` with workspace configuration
3. ✓ Create `packages/database/` with PostgreSQL schema
4. ✓ Create `packages/shared/` with utilities
5. ✓ Run `npm install` at root to set up workspaces
6. ✓ Verify workspace linking works

### Phase 2: Database Migration (Day 3)

**Day 3: Data Transfer**
1. ✓ Run `npx prisma migrate dev` in packages/database to create PostgreSQL schema
2. ✓ Execute migration script: `npm run db:migrate-from-sqlite`
3. ✓ Verify migration report shows zero errors and matching counts
4. ✓ Test database connections from both apps
5. ✓ Run Prisma Studio to visually verify data
6. ✓ Create PostgreSQL backup after successful migration

### Phase 3: Application Separation (Days 4-6)

**Day 4: Web Application**
1. ✓ Move public routes to `apps/web/app/`
2. ✓ Move public API routes to `apps/web/app/api/`
3. ✓ Move section components to `apps/web/components/`
4. ✓ Move form components to `apps/web/components/`
5. ✓ Update imports to use `@onefocus/database` and `@onefocus/shared`
6. ✓ Create `apps/web/.env.example`
7. ✓ Test build: `npm run build:web`
8. ✓ Run locally: `npm run dev:web` and verify all pages render

**Day 5: Admin Application**
1. ✓ Move admin routes to `apps/admin/app/admin/`
2. ✓ Move admin API routes to `apps/admin/app/api/`
3. ✓ Move admin components to `apps/admin/components/`
4. ✓ Move auth logic to `apps/admin/lib/`
5. ✓ Update imports to use `@onefocus/database` and `@onefocus/shared`
6. ✓ Create `apps/admin/.env.example`
7. ✓ Test build: `npm run build:admin`
8. ✓ Run locally: `npm run dev:admin` and verify all pages render

**Day 6: Content Synchronization**
1. ✓ Create `/api/revalidate` endpoint in web app
2. ✓ Create revalidation utility in admin app
3. ✓ Generate `ADMIN_REVALIDATION_TOKEN`
4. ✓ Integrate revalidation calls in admin actions (blog publish, case study publish)
5. ✓ Test revalidation flow locally
6. ✓ Add ISR configuration to web pages
7. ✓ Verify content appears within 60 seconds

### Phase 4: Configuration & Testing (Days 7-8)

**Day 7: Configuration**
1. ✓ Create `vercel.json` for both apps
2. ✓ Configure Next.js settings (next.config.js)
3. ✓ Configure Tailwind (tailwind.config.js)
4. ✓ Update TypeScript configs (tsconfig.json)
5. ✓ Set up ESLint for monorepo
6. ✓ Update `.gitignore` for workspace artifacts
7. ✓ Create comprehensive environment variable documentation

**Day 8: Testing**
1. ✓ Run full test suite: `npm run test:all`
2. ✓ Fix any test failures
3. ✓ Run E2E tests with Playwright
4. ✓ Verify build independence (build:web, build:admin)
5. ✓ Test concurrent development (dev:all)
6. ✓ Manual feature parity testing using checklist
7. ✓ Performance testing (Lighthouse audits)

### Phase 5: Deployment (Days 9-10)

**Day 9: Vercel Setup**
1. ✓ Create new Vercel project for web app
2. ✓ Create new Vercel project for admin app
3. ✓ Configure build settings in Vercel dashboard
4. ✓ Add environment variables to both projects
5. ✓ Configure custom domains (www.onefocusafrica.com, admin.onefocusafrica.com)
6. ✓ Deploy to preview environments
7. ✓ Test preview deployments thoroughly

**Day 10: Production Deployment**
1. ✓ Merge migration branch to main
2. ✓ Deploy admin app to production first
3. ✓ Verify admin app functionality
4. ✓ Deploy web app to production
5. ✓ Verify web app functionality
6. ✓ Test content synchronization in production
7. ✓ Monitor for errors and performance issues
8. ✓ Update DNS records if needed
9. ✓ Document deployment configuration
10. ✓ Create post-deployment verification report

### Phase 6: Monitoring & Optimization (Days 11-14)

**Days 11-14: Post-Deployment**
1. ✓ Monitor application logs for errors
2. ✓ Monitor database connection pooling
3. ✓ Monitor revalidation webhook success rate
4. ✓ Gather user feedback
5. ✓ Address any critical issues
6. ✓ Optimize performance if needed
7. ✓ Create backup and disaster recovery documentation
8. ✓ Archive SQLite database and migration artifacts

### Rollback Procedure

If critical issues are discovered:

**Within 2 hours of deployment:**
1. Switch Vercel deployments back to previous production version
2. Revert DNS changes if applicable
3. Update environment variables to point to SQLite database
4. Verify source application functionality
5. Investigate issues in migration branch
6. Document what went wrong
7. Plan remediation

**Emergency rollback commands:**
```bash
# Revert to pre-migration code
git checkout pre-migration

# Restore SQLite database from backup
cp backups/sqlite-backup-{timestamp}.db prisma/dev.db

# Deploy old version
vercel --prod
```

## Verification Checklist

### Post-Migration Verification

#### Database Integrity
- [ ] All 13 models have matching record counts (SQLite vs PostgreSQL)
- [ ] All UUID primary keys preserved
- [ ] All foreign key relationships intact
- [ ] All enum values preserved
- [ ] All timestamps converted correctly
- [ ] No records lost or corrupted

#### Web Application (@onefocus/web)
- [ ] Home page renders correctly
- [ ] About page renders correctly
- [ ] Solutions page renders correctly
- [ ] Work page displays published case studies
- [ ] Talent page renders correctly
- [ ] Contact form submits successfully
- [ ] Blog index shows published posts
- [ ] Blog post pages render correctly
- [ ] Newsletter subscription works
- [ ] SEO meta tags present
- [ ] Sitemap.xml generates correctly
- [ ] Images load from Vercel Blob
- [ ] No console errors on any page
- [ ] Lighthouse performance score >= 90

#### Admin Application (@onefocus/admin)
- [ ] Login page renders
- [ ] Authentication works with valid credentials
- [ ] Dashboard loads after login
- [ ] Blog management page displays all posts
- [ ] Can create new blog post
- [ ] Can edit existing blog post
- [ ] Can publish blog post
- [ ] Publishing triggers revalidation
- [ ] Portfolio management works
- [ ] Inquiries page displays records
- [ ] Programs page works
- [ ] Events page works
- [ ] Team page works
- [ ] Media library works
- [ ] File upload to Vercel Blob works
- [ ] Settings page works
- [ ] Can logout successfully
- [ ] Unauthenticated users redirected to login

#### Content Synchronization
- [ ] Publishing blog post appears on web within 60 seconds
- [ ] Unpublishing blog post removes from web within 60 seconds
- [ ] Publishing case study appears on work page within 60 seconds
- [ ] Updating site content reflects on web within 60 seconds
- [ ] Revalidation webhook returns 401 without token
- [ ] Revalidation webhook returns 200 with valid token
- [ ] Revalidation errors logged properly

#### Build & Deployment
- [ ] `npm run build:web` succeeds
- [ ] `npm run build:admin` succeeds
- [ ] Web app builds without admin dependencies
- [ ] Admin app builds without web-only dependencies
- [ ] Both apps run concurrently with `npm run dev:all`
- [ ] Vercel web project deploys successfully
- [ ] Vercel admin project deploys successfully
- [ ] Custom domains configured correctly
- [ ] SSL certificates active
- [ ] Environment variables set in both Vercel projects

#### Security
- [ ] Admin routes protected by authentication
- [ ] Public routes accessible without authentication
- [ ] Session cookies httpOnly and secure
- [ ] CSRF protection enabled
- [ ] Revalidation token validated
- [ ] No sensitive data in client-side code
- [ ] No API keys exposed in source
- [ ] Database credentials secure

#### Performance
- [ ] Database connection pooling configured
- [ ] ISR working for blog pages
- [ ] Static generation working for pages
- [ ] Images optimized via Next.js Image
- [ ] CSS minified
- [ ] JavaScript bundled efficiently
- [ ] No console warnings in production

## Appendix

### Environment Variables Reference

#### Web Application (.env.example)

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/onefocus?connection_limit=5"

# Media Storage
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."

# Revalidation
ADMIN_REVALIDATION_TOKEN="generate-with-crypto.randomBytes(32).toString('hex')"

# Public Site URL
NEXT_PUBLIC_SITE_URL="https://www.onefocusafrica.com"

# Admin App URL (for CORS)
ADMIN_APP_URL="https://admin.onefocusafrica.com"
```

#### Admin Application (.env.example)

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/onefocus?connection_limit=5"

# Media Storage
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."

# NextAuth
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="https://admin.onefocusafrica.com"

# Revalidation
ADMIN_REVALIDATION_TOKEN="same-as-web-app-token"
WEB_APP_URL="https://www.onefocusafrica.com"

# Email (for notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="admin@onefocusafrica.com"
SMTP_PASS="app-specific-password"
```

### File Mapping Reference

| Source Application Path | Target Path | Application |
|------------------------|-------------|-------------|
| `app/page.tsx` | `apps/web/app/page.tsx` | Web |
| `app/about/page.tsx` | `apps/web/app/about/page.tsx` | Web |
| `app/blog/page.tsx` | `apps/web/app/blog/page.tsx` | Web |
| `app/blog/[slug]/page.tsx` | `apps/web/app/blog/[slug]/page.tsx` | Web |
| `app/contact/page.tsx` | `apps/web/app/contact/page.tsx` | Web |
| `app/admin/login/page.tsx` | `apps/admin/app/admin/login/page.tsx` | Admin |
| `app/admin/blog/page.tsx` | `apps/admin/app/admin/blog/page.tsx` | Admin |
| `app/admin/portfolio/page.tsx` | `apps/admin/app/admin/portfolio/page.tsx` | Admin |
| `app/api/inquiries/route.ts` | `apps/web/app/api/inquiries/route.ts` | Web |
| `app/api/auth/[...nextauth]/route.ts` | `apps/admin/app/api/auth/[...nextauth]/route.ts` | Admin |
| `components/sections/` | `apps/web/components/sections/` | Web |
| `components/forms/` | `apps/web/components/forms/` | Web |
| `components/admin/` | `apps/admin/components/admin/` | Admin |
| `lib/auth.ts` | `apps/admin/lib/auth.ts` | Admin |
| `lib/upload.ts` | `apps/admin/lib/upload.ts` | Admin |
| `lib/validations.ts` | `packages/shared/src/validation/index.ts` | Shared |
| `lib/email.ts` | `packages/shared/src/utils/email.ts` | Shared |
| `lib/slug.ts` | `packages/shared/src/utils/slug.ts` | Shared |
| `prisma/schema.prisma` | `packages/database/prisma/schema.prisma` | Database |

### PostgreSQL Provider Recommendations

#### Option 1: Railway (Recommended for MVP)
- **Pros**: Simple setup, generous free tier, automatic backups
- **Cons**: Requires credit card for production use
- **Setup**: `railway.app` → New Project → Add PostgreSQL → Copy DATABASE_URL

#### Option 2: Supabase
- **Pros**: Free tier includes connection pooling, built-in dashboard
- **Cons**: Connection limits on free tier
- **Setup**: `supabase.com` → New Project → Settings → Database → Connection pooling

#### Option 3: Neon
- **Pros**: Serverless, autoscaling, generous free tier
- **Cons**: Cold starts on free tier
- **Setup**: `neon.tech` → New Project → Copy connection string

#### Option 4: Vercel Postgres
- **Pros**: Native Vercel integration, optimized for Edge
- **Cons**: More expensive, requires Vercel Pro plan
- **Setup**: Vercel Dashboard → Storage → Create Database → Postgres

**Recommendation:** Start with Railway for development and MVP. Evaluate Supabase or Neon for production based on traffic patterns.

### Troubleshooting Guide

#### Issue: "Module not found: Can't resolve '@onefocus/database'"

**Solution:**
```bash
# Regenerate Prisma client
npm run db:generate

# Reinstall dependencies
rm -rf node_modules
npm install
```

#### Issue: Database connection errors in production

**Solution:**
1. Verify DATABASE_URL is set in both Vercel projects
2. Check connection pooling configuration
3. Ensure database allows connections from Vercel IP ranges
4. Test connection with `npx prisma db pull`

#### Issue: Revalidation not working (content not updating)

**Solution:**
1. Verify ADMIN_REVALIDATION_TOKEN matches in both apps
2. Check admin app logs for webhook call errors
3. Check web app logs for revalidation errors
4. Test webhook manually with curl:
```bash
curl -X POST https://www.onefocusafrica.com/api/revalidate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"path": "/blog"}'
```

#### Issue: Build fails with TypeScript errors

**Solution:**
1. Ensure all `@onefocus/*` packages build first
2. Check for circular dependencies
3. Verify path aliases in tsconfig.json
4. Run `npm run db:generate` before building

#### Issue: Images not loading from Vercel Blob

**Solution:**
1. Verify BLOB_READ_WRITE_TOKEN is set correctly
2. Check Vercel Blob dashboard for uploaded files
3. Ensure URLs in database are complete (https://)
4. Test direct URL access in browser

### Migration Duration Estimate

**Total estimated time: 10-14 days**

- Phase 1 (Pre-Migration): 2 days
- Phase 2 (Database Migration): 1 day
- Phase 3 (Application Separation): 3 days
- Phase 4 (Configuration & Testing): 2 days
- Phase 5 (Deployment): 2 days
- Phase 6 (Monitoring & Optimization): 3-4 days

**Critical path items:**
- Database migration (must complete before app separation)
- Authentication setup (blocks admin testing)
- Revalidation webhook (blocks content synchronization testing)

**Expected downtime:** Zero (blue-green deployment strategy)

### Success Criteria

The migration is considered successful when:

1. ✅ All 13 database models migrated with 100% data integrity
2. ✅ Both applications build and deploy independently
3. ✅ All 27 existing routes render correctly
4. ✅ Content synchronization works (< 60 seconds)
5. ✅ Authentication and authorization function correctly
6. ✅ All admin features work (CRUD operations, media upload)
7. ✅ All public features work (forms, blog, case studies)
8. ✅ Zero data loss
9. ✅ Performance comparable to source application
10. ✅ No console errors in production
11. ✅ Rollback procedure documented and tested
12. ✅ Team trained on new development workflow

---

**Document Version:** 1.0  
**Last Updated:** 2025-01-09  
**Author:** Kiro AI System  
**Status:** Ready for Review
