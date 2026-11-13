# Vercel Blob Storage Migration Guide

## Overview

ONEFOCUS AFRICA has been migrated from local filesystem storage to **Vercel Blob Storage** for production-ready, persistent media management. This ensures uploaded images remain available across deployments and server restarts.

## What Changed

### 1. Media Upload API (`apps/admin/app/api/admin/media/route.ts`)

**Before:**
- Saved files to `apps/web/public/uploads/` directory
- Files were lost on redeployment
- Required filesystem access

**After:**
- Uses Vercel Blob Storage via `@vercel/blob` SDK
- Returns permanent CDN URLs (e.g., `https://[hash].public.blob.vercel-storage.com/[filename]`)
- Files persist across deployments
- Automatic CDN distribution

**Key Features Preserved:**
- ✅ Session-based authentication (admin/editor only)
- ✅ File type validation (JPG, PNG, WebP only)
- ✅ 10MB size limit
- ✅ Server-side validation

**New Features:**
- ✅ Permanent storage with CDN URLs
- ✅ Automatic random suffix to prevent naming conflicts
- ✅ Database integration with `MediaAsset` model
- ✅ Stores metadata: filename, original name, URL, MIME type, size, uploader ID

### 2. Database Integration

All uploaded media is now tracked in PostgreSQL:

```sql
MediaAsset {
  id: UUID
  filename: String (blob pathname)
  originalName: String
  url: String (permanent blob URL)
  mimeType: String
  size: Int
  uploadedById: String
  createdAt: DateTime
}
```

### 3. Next.js Image Configuration

Both `apps/admin/next.config.ts` and `apps/web/next.config.ts` already include:

```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '**.public.blob.vercel-storage.com',
    },
  ],
}
```

This allows Next.js `<Image>` components to load and optimize blob URLs.

### 4. Media List API

`apps/admin/app/api/admin/media/list/route.ts` remains unchanged and works seamlessly with blob URLs by querying the `MediaAsset` table.

## Existing Images

**Important:** The `apps/web/public/uploads/` directory and its contents have been preserved.

- Old images at `/uploads/[filename]` continue to work for backward compatibility
- New uploads will use Vercel Blob storage
- To migrate existing images:
  1. Re-upload through the admin interface
  2. Update references in blog posts, services, etc.
  3. Delete old files once migration is verified

## Setup Instructions

### 1. Create Vercel Blob Store

After deploying to Vercel:

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project (e.g., `onefocus-admin`)
3. Navigate to **Storage** tab
4. Click **Create Database** → **Blob**
5. Name it (e.g., `onefocus-media`)
6. Click **Create**

### 2. Get the Token

1. In the Blob storage page, click **Connect**
2. Copy the `BLOB_READ_WRITE_TOKEN` value
3. Add it to your environment variables:
   - **Option A (Vercel Dashboard):**
     - Go to **Settings** → **Environment Variables**
     - Add key: `BLOB_READ_WRITE_TOKEN`
     - Paste the token value
     - Apply to: Production, Preview, Development
     - **Important:** Add to BOTH projects (`onefocus-admin` and `onefocus-web`)
   
   - **Option B (Local Development):**
     - Create `.env.local` in `apps/admin/`
     - Add: `BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."`

### 3. Redeploy

After adding the environment variable:
- Trigger a new deployment (Vercel auto-deploys on push)
- Or manually redeploy from the Vercel dashboard

### 4. Verify

1. Log into ONEFOCUS ADMIN: https://admin.onefocusafrica.co
2. Navigate to Media Library
3. Upload a test image
4. Confirm:
   - Upload succeeds
   - Image appears in media list
   - URL is a blob URL (`https://[hash].public.blob.vercel-storage.com/...`)
   - Image displays correctly in the admin panel
5. Use the image in a blog post
6. Verify it displays on ONEFOCUS WEB: https://onefocusafrica.co

## Security

### Authentication
Only authenticated users (role: ADMIN or EDITOR) can upload media. The API enforces:
```typescript
const session = await auth()
if (!session) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

### Validation
- **Allowed types:** `image/jpeg`, `image/png`, `image/webp`
- **Max size:** 10 MB
- Server-side validation before upload

### Access Control
- Blob files use `access: 'public'` to enable web delivery
- No authentication required to view published images
- Only authorized users can upload/manage

## Cost Considerations

Vercel Blob pricing (as of 2024):
- **Pro Plan:** 100 GB storage, 1 TB bandwidth included
- **Overage:** $0.15/GB storage, $0.10/GB bandwidth

For typical usage:
- 1000 images × 500 KB average = ~500 MB storage
- 10,000 monthly views × 500 KB = ~5 GB bandwidth
- Well within Pro plan limits

## Troubleshooting

### Error: "BLOB_READ_WRITE_TOKEN is not set"

**Cause:** Environment variable missing  
**Solution:** Add `BLOB_READ_WRITE_TOKEN` to Vercel environment variables (see Setup Instructions)

### Error: "Failed to upload to blob storage"

**Cause:** Invalid token or network issue  
**Solution:**
1. Verify token is correct in Vercel dashboard
2. Ensure token has read/write permissions
3. Check Vercel status page for outages

### Old images not displaying

**Cause:** Local uploads only work in development  
**Solution:**
- Re-upload images through admin interface
- Or manually migrate to blob storage
- Update references in content

### Image optimization fails

**Cause:** Missing remotePatterns in next.config  
**Solution:** Already configured in both apps, but verify:
```typescript
remotePatterns: [
  { protocol: 'https', hostname: '**.public.blob.vercel-storage.com' }
]
```

## Migration Checklist

- [x] Install `@vercel/blob` (already at v2.8.2)
- [x] Update media upload API to use blob storage
- [x] Add database integration with MediaAsset model
- [x] Preserve authentication and validation
- [x] Configure Next.js for blob URLs
- [x] Document BLOB_READ_WRITE_TOKEN setup
- [x] Preserve existing local images for backward compatibility
- [ ] Create Vercel Blob store (done during deployment)
- [ ] Add BLOB_READ_WRITE_TOKEN to Vercel environment variables
- [ ] Test upload workflow in production
- [ ] Verify images display on public website
- [ ] Re-upload existing images (optional, for full migration)

## Support

For issues or questions:
- Check Vercel Blob documentation: https://vercel.com/docs/storage/vercel-blob
- Review error logs in Vercel dashboard
- Verify environment variables are set correctly

## Summary

The media storage system is now production-ready with:
- ✅ Persistent storage across deployments
- ✅ CDN-backed delivery for performance
- ✅ Database tracking for all uploads
- ✅ Secure, authenticated upload workflow
- ✅ Support for blog, service, portfolio, and team images
- ✅ Backward compatibility with existing local images

**Next step:** Set `BLOB_READ_WRITE_TOKEN` after Vercel deployment.
