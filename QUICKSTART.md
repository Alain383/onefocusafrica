# Quick Start Guide

Get the ONEFOCUS AFRICA website running locally in 5 minutes.

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up Environment

```bash
# Copy the example env file
cp .env.example .env
```

Edit `.env` and add your database URL:
```
DATABASE_URL="postgresql://user:password@localhost:5432/onefocus"
```

**Quick Database Options:**

### Local PostgreSQL
```bash
# Install PostgreSQL locally, then:
createdb onefocus
# Update DATABASE_URL in .env
```

### Docker PostgreSQL (Easiest)
```bash
docker run --name onefocus-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=onefocus -p 5432:5432 -d postgres

# Update .env:
DATABASE_URL="postgresql://postgres:password@localhost:5432/onefocus"
```

### Cloud (No Local Install)
Use [Railway](https://railway.app), [Supabase](https://supabase.com), or [Neon](https://neon.tech) - all have free tiers.

## 3. Set Up Database

```bash
# Generate Prisma client
npm run prisma:generate

# Push schema to database
npm run prisma:push
```

## 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## 5. Test the Forms

### Contact Form
1. Go to [http://localhost:3000/contact](http://localhost:3000/contact)
2. Fill out the form
3. Submit (will save to database)

**Note:** Email sending requires SMTP setup. Forms will work without it, but emails won't send. To enable emails, add to `.env`:

```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-gmail-app-password"
```

## Troubleshooting

### "Cannot connect to database"
- Check DATABASE_URL is correct
- Ensure PostgreSQL is running
- Try `telnet localhost 5432` to test connection

### "Prisma Client Not Generated"
```bash
npm run prisma:generate
```

### Port 3000 Already in Use
```bash
# Use different port
npm run dev -- -p 3001
```

### Type Errors
```bash
# Rebuild TypeScript
npm run build
```

## What's Next?

1. **Customize Content**: Edit pages in `app/` directory
2. **Update Styles**: Modify `tailwind.config.ts` for brand colors
3. **Add Images**: Place in `public/images/`
4. **View Database**: Run `npx prisma studio`
5. **Deploy**: See [DEPLOYMENT.md](./DEPLOYMENT.md)

## Project Structure

```
app/              - Next.js pages and routes
components/       - Reusable React components
lib/             - Utility functions (email, database)
prisma/          - Database schema
public/          - Static assets
```

## Useful Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run linter
npx prisma studio    # Open database GUI
npx prisma migrate   # Create database migration
```

## Need Help?

- Read the full [README.md](./README.md)
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment
- Email: onefocusafrica@gmail.com
