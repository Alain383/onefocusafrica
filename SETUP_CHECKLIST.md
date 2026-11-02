# Setup Checklist - ONEFOCUS AFRICA Website

Use this checklist to get your website from development to production.

## ✅ Development Setup

### Local Environment
- [ ] Node.js 18+ installed
- [ ] PostgreSQL installed (or Docker)
- [ ] Git installed
- [ ] Code editor (VS Code recommended)

### Initial Setup
- [ ] Clone repository
- [ ] Run `npm install`
- [ ] Copy `.env.example` to `.env`
- [ ] Set `DATABASE_URL` in `.env`
- [ ] Run `npm run prisma:generate`
- [ ] Run `npm run prisma:push`
- [ ] Run `npm run dev`
- [ ] Verify site loads at localhost:3000

### Test Locally
- [ ] Homepage loads correctly
- [ ] All navigation links work
- [ ] Mobile menu opens/closes
- [ ] Contact form displays
- [ ] Form validation works
- [ ] Can submit test inquiry
- [ ] Check database for test entry (`npx prisma studio`)

## 📧 Email Configuration (Optional for Dev)

### Gmail Setup
- [ ] Enable 2FA on Google account
- [ ] Generate app password
- [ ] Add SMTP settings to `.env`:
  ```
  SMTP_HOST="smtp.gmail.com"
  SMTP_PORT=587
  SMTP_USER="your-email@gmail.com"
  SMTP_PASS="your-app-password"
  ```
- [ ] Test form submission with email

## 🎨 Content Preparation

### Text Content
- [ ] Write/review homepage copy
- [ ] Prepare About page content
- [ ] Define service descriptions
- [ ] Write case studies (with client permission)
- [ ] Create compelling CTAs
- [ ] Prepare talent program details

### Visual Assets
- [ ] Logo (SVG or high-res PNG)
- [ ] Service icons/graphics
- [ ] Team photos (if applicable)
- [ ] Client logos (with permission)
- [ ] Case study images
- [ ] Hero section imagery
- [ ] Favicon set (multiple sizes)

### Case Studies
- [ ] Get client permission for each
- [ ] Document challenge/solution/outcome
- [ ] Collect measurable results
- [ ] Gather testimonials
- [ ] Prepare project images
- [ ] Verify all claims

## 🗄️ Database Setup (Production)

### Choose Provider
- [ ] Railway.app (recommended, $5/mo)
- [ ] Supabase (free tier available)
- [ ] Neon (free tier available)
- [ ] Or your own PostgreSQL server

### Configure Database
- [ ] Create database instance
- [ ] Copy connection string
- [ ] Test connection locally
- [ ] Run migrations: `npx prisma migrate deploy`
- [ ] Verify tables created
- [ ] Set up automated backups

## 🚀 Deployment Preparation

### GitHub
- [ ] Create GitHub repository
- [ ] Push code to GitHub
- [ ] Verify all files committed
- [ ] Check `.gitignore` (no `.env` files!)
- [ ] Add repository description
- [ ] Add README badges (optional)

### Vercel Account
- [ ] Create Vercel account
- [ ] Connect GitHub account
- [ ] Verify billing (free tier OK to start)

### Environment Variables
Prepare these for Vercel:
- [ ] `DATABASE_URL`
- [ ] `SMTP_HOST`
- [ ] `SMTP_PORT`
- [ ] `SMTP_USER`
- [ ] `SMTP_PASS`
- [ ] `SMTP_FROM`
- [ ] `CONTACT_EMAIL`
- [ ] `CONTACT_PHONE`
- [ ] `WHATSAPP_NUMBER`
- [ ] `NEXT_PUBLIC_SITE_URL`
- [ ] `NEXT_PUBLIC_SITE_NAME`

## 🌐 Domain & DNS

### Domain Registration
- [ ] Purchase domain (Namecheap, Google Domains, etc.)
- [ ] Verify domain ownership
- [ ] Configure nameservers

### DNS Configuration
- [ ] Add domain to Vercel
- [ ] Copy DNS records from Vercel
- [ ] Update DNS at registrar
- [ ] Wait for propagation (up to 48hrs)
- [ ] Verify HTTPS works

## 📋 Pre-Launch Testing

### Functionality
- [ ] Test all pages load
- [ ] Test all links work
- [ ] Test contact form submission
- [ ] Verify email notifications
- [ ] Test mobile menu
- [ ] Check form validation
- [ ] Test error pages (404, 500)

### Cross-Browser Testing
- [ ] Chrome (desktop)
- [ ] Firefox (desktop)
- [ ] Safari (desktop)
- [ ] Edge (desktop)
- [ ] Chrome (mobile)
- [ ] Safari (mobile)

### Performance
- [ ] Run Lighthouse audit
- [ ] Check page load times
- [ ] Optimize images
- [ ] Test on slow 3G
- [ ] Verify bundle size
- [ ] Check Core Web Vitals

### SEO
- [ ] Verify page titles
- [ ] Check meta descriptions
- [ ] Add Open Graph tags
- [ ] Create sitemap.xml
- [ ] Add robots.txt
- [ ] Submit to Google Search Console
- [ ] Add structured data (optional)

### Accessibility
- [ ] Test keyboard navigation
- [ ] Check color contrast
- [ ] Verify ARIA labels
- [ ] Test with screen reader
- [ ] Check heading hierarchy
- [ ] Verify focus indicators

### Security
- [ ] Verify no secrets in code
- [ ] Test form CSRF protection
- [ ] Check rate limiting
- [ ] Verify HTTPS works
- [ ] Test SQL injection prevention
- [ ] Check XSS protection

## 📊 Analytics & Monitoring

### Analytics Setup
- [ ] Create Google Analytics account
- [ ] Add tracking code
- [ ] Set up goals/conversions
- [ ] Test event tracking
- [ ] Configure dashboards

### Error Monitoring
- [ ] Set up Sentry (optional)
- [ ] Configure error alerts
- [ ] Test error reporting
- [ ] Set up Slack notifications

### Uptime Monitoring
- [ ] Set up UptimeRobot (free)
- [ ] Configure status checks
- [ ] Set up alert email
- [ ] Test notifications

## ⚖️ Legal & Compliance

### Legal Pages
- [ ] Review Privacy Policy
- [ ] Review Terms of Service
- [ ] Add GDPR compliance (if EU traffic)
- [ ] Add cookie notice (if needed)
- [ ] Get legal review (recommended)

### Content Verification
- [ ] Verify all case studies have permission
- [ ] Remove any placeholder text
- [ ] Check all claims are accurate
- [ ] Verify contact information
- [ ] Confirm pricing accuracy

## 🎯 Launch Day

### Final Checks
- [ ] All environment variables set
- [ ] Database connected and working
- [ ] Email sending works
- [ ] Forms submit correctly
- [ ] Mobile experience smooth
- [ ] No console errors
- [ ] Lighthouse score 90+

### Deploy
- [ ] Merge to main branch
- [ ] Verify Vercel auto-deployment
- [ ] Check production URL
- [ ] Test production site thoroughly
- [ ] Monitor error logs
- [ ] Check analytics setup

### Announce
- [ ] Update social media profiles
- [ ] Send announcement email
- [ ] Post on LinkedIn
- [ ] Update Google Business Profile
- [ ] Share on WhatsApp Business

## 📈 Post-Launch (Week 1)

### Monitoring
- [ ] Check error logs daily
- [ ] Review form submissions
- [ ] Monitor page views
- [ ] Check conversion rates
- [ ] Review performance metrics

### Optimization
- [ ] Address any errors
- [ ] Fix broken links
- [ ] Optimize slow pages
- [ ] Improve mobile experience
- [ ] A/B test CTAs (optional)

### Marketing
- [ ] Submit to directories
- [ ] Start content marketing
- [ ] Engage on social media
- [ ] Reach out to network
- [ ] Request testimonials

## 🔄 Ongoing Maintenance

### Weekly
- [ ] Review form submissions
- [ ] Check error logs
- [ ] Monitor uptime
- [ ] Review analytics
- [ ] Backup database

### Monthly
- [ ] Update dependencies
- [ ] Review performance
- [ ] Check broken links
- [ ] Update content
- [ ] Review SEO rankings
- [ ] Test all forms

### Quarterly
- [ ] Security audit
- [ ] Performance optimization
- [ ] Content refresh
- [ ] Update case studies
- [ ] Review analytics trends
- [ ] User feedback review

## 📞 Support Contacts

### Technical Issues
- Email: onefocusafrica@gmail.com
- WhatsApp: +250 781 102 667

### Service Providers
- Domain: [Your registrar]
- Hosting: Vercel Support
- Database: [Railway/Supabase/Neon]
- Email: Gmail/SendGrid Support

## 📚 Resources

- [QUICKSTART.md](./QUICKSTART.md) - Local setup
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Production deployment
- [README.md](./README.md) - Full documentation
- [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - Project overview

---

**Estimated Timeline:**
- Development setup: 30 minutes
- Content preparation: 1-2 weeks
- Testing: 3-5 days
- Deployment: 1 day
- **Total: 2-3 weeks to launch**

Good luck! 🚀
