# Deployment Guide

This guide covers deploying the ONEFOCUS AFRICA website to production.

## Prerequisites

- GitHub account (for code hosting)
- Vercel account (for hosting)
- PostgreSQL database (Railway, Supabase, or similar)
- Email SMTP credentials (Gmail or similar)

## Step 1: Database Setup

### Option A: Railway

1. Go to [railway.app](https://railway.app)
2. Create new project → Add PostgreSQL
3. Copy the `DATABASE_URL` connection string
4. Note: Include `?sslmode=require` at the end if required

### Option B: Supabase

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → Database → Connection string
4. Use the connection pooling URL for better performance

### Option C: Neon

1. Go to [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string from dashboard

## Step 2: Email Setup (Gmail)

1. Enable 2-factor authentication on your Google account
2. Go to Google Account → Security → App passwords
3. Generate new app password
4. Save this password for `SMTP_PASS`

## Step 3: Push Code to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/onefocus-africa.git
git push -u origin main
```

## Step 4: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables (see below)
5. Click "Deploy"

### Environment Variables for Vercel

Add these in Vercel Dashboard → Settings → Environment Variables:

```
DATABASE_URL=postgresql://...
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=onefocusafrica@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=onefocusafrica@gmail.com
CONTACT_EMAIL=onefocusafrica@gmail.com
CONTACT_PHONE=+250 781 102 667
WHATSAPP_NUMBER=+250781102667
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_NAME=ONEFOCUS AFRICA
```

## Step 5: Run Database Migrations

After first deployment:

1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Link project: `vercel link`
4. Run migrations:
   ```bash
   vercel env pull .env.local
   npx prisma migrate deploy
   ```

Or use Vercel's integrated Prisma support:
1. Go to Vercel Dashboard → Settings → Build & Development Settings
2. Install Command: `npm install && npx prisma generate`

## Step 6: Custom Domain (Optional)

1. In Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `NEXT_PUBLIC_SITE_URL` environment variable

## Step 7: Post-Deployment Checklist

- [ ] Test all forms (contact, community registration)
- [ ] Verify email notifications are working
- [ ] Check mobile responsiveness
- [ ] Test all navigation links
- [ ] Verify environment variables are set correctly
- [ ] Check database connection
- [ ] Test error pages (404, 500)
- [ ] Run Lighthouse audit
- [ ] Set up monitoring (Vercel Analytics, Sentry)
- [ ] Configure error tracking
- [ ] Set up uptime monitoring

## Continuous Deployment

Once connected to GitHub:
- Push to `main` branch → Automatic production deployment
- Push to other branches → Automatic preview deployment
- Pull requests → Automatic preview URLs

## Monitoring & Maintenance

### Vercel Analytics
Enable in Vercel Dashboard → Analytics

### Database Backups
- Railway: Automatic backups included
- Supabase: Configure under Settings → Database
- Neon: Automatic point-in-time recovery

### Error Tracking
Consider integrating:
- [Sentry](https://sentry.io) for error tracking
- [LogRocket](https://logrocket.com) for session replay

## Troubleshooting

### Build Failures

**Prisma errors:**
```bash
# Ensure Prisma is generated during build
vercel env pull .env.local
npx prisma generate
```

**Type errors:**
```bash
npm run build
# Fix any TypeScript errors before deploying
```

### Database Connection Issues

**SSL Certificate errors:**
```
DATABASE_URL="postgresql://...?sslmode=require"
```

**Connection pooling:**
Use connection pooling URLs for better performance

### Email Not Sending

1. Verify SMTP credentials
2. Check Gmail app password is correct
3. Ensure 2FA is enabled on Google account
4. Check Vercel logs for errors

## Scaling Considerations

As traffic grows:

1. **Database**: Upgrade to paid tier with more connections
2. **CDN**: Vercel handles this automatically
3. **Image Optimization**: Use Next.js Image component
4. **Caching**: Implement Redis for session/data caching
5. **Rate Limiting**: Add rate limiting to API routes

## Security Checklist

- [ ] All environment variables are set in Vercel (not in code)
- [ ] `.env` files are in `.gitignore`
- [ ] Database uses SSL connection
- [ ] SMTP credentials are secure
- [ ] Forms have CSRF protection
- [ ] Input validation on all forms
- [ ] Rate limiting on API routes
- [ ] Security headers configured

## Support

For deployment issues:
- Vercel Support: support@vercel.com
- Railway Support: [railway.app/help](https://railway.app/help)
- Project Issues: onefocusafrica@gmail.com
