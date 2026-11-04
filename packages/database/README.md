# @onefocus/database

Shared database package for ONEFOCUS AFRICA monorepo. Provides a singleton Prisma Client instance and PostgreSQL schema for both web and admin applications.

## Structure

```
packages/database/
├── src/
│   └── index.ts          # Prisma client singleton export
├── prisma/
│   └── schema.prisma     # PostgreSQL schema (13 models)
├── scripts/
│   └── (migration scripts)
├── package.json
└── tsconfig.json
```

## Usage

### In Web or Admin App

```typescript
import { prisma } from '@onefocus/database'

// Query the database
const posts = await prisma.post.findMany({
  where: { status: 'PUBLISHED' }
})
```

### Type Exports

```typescript
import type { Prisma, AdminUser, Post } from '@onefocus/database'
```

## Scripts

```bash
# Generate Prisma Client
npm run generate

# Create a migration (development)
npm run migrate

# Apply migrations (production)
npm run migrate:deploy

# Open Prisma Studio
npm run studio

# Push schema without migration (development only)
npm run push
```

## Database Models

### Content Models
- **Post** - Blog posts with categories and tags
- **PostCategory** - Blog categories
- **PostTag** - Blog tags
- **CaseStudy** - Portfolio case studies
- **MediaAsset** - Uploaded media files
- **SiteContent** - Dynamic site content

### User Models
- **AdminUser** - Admin dashboard users
- **CommunityMember** - Community membership records
- **NewsletterSubscriber** - Newsletter subscriptions
- **Inquiry** - Contact form inquiries

### Configuration Models
- **Program** - Service programs
- **Event** - Event listings
- **TeamMember** - Team member profiles

## PostgreSQL Features

- UUID primary keys with `@db.Uuid`
- Optimized string types (`@db.VarChar`, `@db.Text`)
- Timezone-aware timestamps (`@db.Timestamptz`)
- Proper numeric types (`@db.DoublePrecision`)
- Indexed fields for performance
- Enum types for status fields

## Environment Variables

```env
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
```

## Migration from SQLite

This package represents the PostgreSQL migration of the original SQLite schema. Key changes:

1. **Provider**: `sqlite` → `postgresql`
2. **UUID generation**: `cuid()` → `uuid()`
3. **Type annotations**: Added PostgreSQL-specific types
4. **Timestamps**: `DateTime` → `@db.Timestamptz(3)`
5. **Strings**: Added `@db.VarChar` and `@db.Text` hints

## Connection Pooling

The singleton pattern ensures only one PrismaClient instance exists across the monorepo, preventing connection pool exhaustion.

## Logging

- **Development**: Logs queries, errors, and warnings
- **Production**: Logs errors only

## Requirements Met

- 2.1, 2.2, 2.3, 2.4 - PostgreSQL schema with optimizations
- 5.1, 5.2, 5.3 - Package structure
- 5.4, 5.5, 5.6 - Package configuration
- 5.7, 5.8, 5.9 - Prisma client singleton
- 5.10, 5.11 - TypeScript and scripts