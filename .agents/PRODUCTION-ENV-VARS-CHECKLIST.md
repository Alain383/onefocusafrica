# Production Environment Variables Checklist

## Quick Reference for Vercel Deployment

---

## PROJECT 1: ONEFOCUS WEB (`apps/web`)

### Vercel Project Settings → Environment Variables

#### ✅ REQUIRED (Build will fail without these)

```
DATABASE_URL
```
**Value:** Neon PostgreSQL pooled connection string  
**Example:** `postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require`  
**Where:** Neon Console → Project → Connection Details → Pooled Connection  
**Scope:** Production, Preview, Development

```
NEXT_PUBLIC_SITE_URL
```
**Value:** `https://onefocusafrica.co`  
**Scope:** Production, Preview, Development

---

#### ⚪ OPTIONAL (Email functionality - can add later)

```
RESEND_API_KEY
```
**Value:** `re_xxxxxxxxxxxx`  
**Where:** https://resend.com → API Keys  
**Purpose:** Send inquiry notification emails  
**Scope:** Production

```
RESEND_FROM_EMAIL
```
**Value:** `noreply@onefocusafrica.co`  
**Purpose:** Email sender address  
**Scope:** Production

```
RESEND_INQUIRY_RECIPIENT
```
**Value:** `inquiries@onefocusafrica.co`  
**Purpose:** Where to send inquiry notifications  
**Scope:** Production

---

#### 🔵 AUTO-ADDED (Vercel adds this when you connect Blob Storage)

```
BLOB_READ_WRITE_TOKEN
```
**Value:** Auto-added by Vercel  
**Purpose:** Upload and serve media files  
**Action:** Connect Vercel Blob Store to project (Phase 3)

---

## PROJECT 2: ONEFOCUS ADMIN (`apps/admin`)

### Vercel Project Settings → Environment Variables

#### ✅ REQUIRED (Build will fail without these)

```
DATABASE_URL
```
**Value:** IDENTICAL to web project (shared database)  
**Example:** `postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require`  
**⚠️ MUST BE EXACTLY THE SAME as web project**  
**Scope:** Production, Preview, Development

```
NEXT_PUBLIC_SITE_URL
```
**Value:** `https://admin.onefocusafrica.co`  
**Scope:** Production, Preview, Development

```
NEXTAUTH_URL
```
**Value:** `https://admin.onefocusafrica.co`  
**⚠️ NO trailing slash**  
**Purpose:** NextAuth callback URL  
**Scope:** Production, Preview, Development

```
AUTH_SECRET
```
**Generate with:**
```bash
# Git Bash / WSL / macOS / Linux:
openssl rand -base64 32

# PowerShell / Node.js (any OS):
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```
**⚠️ CRITICAL:**
- Generate NEW secret for production (don't reuse development)
- Must be strong (32+ characters)
- Never commit to GitHub
- Save in password manager

**Purpose:** NextAuth JWT signing and encryption  
**Scope:** Production, Preview, Development

---

#### 🔵 AUTO-ADDED (Vercel adds this when you connect Blob Storage)

```
BLOB_READ_WRITE_TOKEN
```
**Value:** Auto-added by Vercel  
**Purpose:** Upload and serve media files  
**Action:** Connect Vercel Blob Store to project (Phase 3)  
**⚠️ Same Blob Store must be connected to BOTH projects**

---

## SECURITY CHECKLIST

### ✅ Before Deployment

- [ ] Generate NEW `AUTH_SECRET` for production (not from .env.local)
- [ ] Use production `DATABASE_URL` (not development)
- [ ] Verify no secrets committed to GitHub
- [ ] Save all production credentials in password manager

### ✅ After Deployment

- [ ] Rotate `DATABASE_URL` in Neon (create new password)
- [ ] Update `DATABASE_URL` in both Vercel projects
- [ ] Verify old credentials no longer work
- [ ] Confirm no default admin passwords in use

---

## COMMON MISTAKES TO AVOID

❌ **DO NOT:**
- Use different `DATABASE_URL` for web vs admin (they must be identical)
- Add trailing slash to `NEXTAUTH_URL` (use `https://admin.onefocusafrica.co` not `https://admin.onefocusafrica.co/`)
- Reuse `AUTH_SECRET` from development
- Commit any of these values to GitHub
- Set `NEXT_PUBLIC_SITE_URL` to localhost in production
- Forget to connect Blob Storage to BOTH projects

✅ **DO:**
- Use the SAME `DATABASE_URL` for both projects (shared database)
- Generate strong, unique `AUTH_SECRET` for production
- Use HTTPS URLs (not HTTP) for production
- Save credentials in secure password manager
- Connect Blob Storage to both projects before testing uploads

---

## VERIFICATION COMMANDS

### Check if DATABASE_URL works:
```bash
# Using psql (install from https://www.postgresql.org/)
psql "postgresql://user:password@host/db?sslmode=require" -c "SELECT 1;"
```
**Expected:** Returns `1` (connection successful)

### Verify AUTH_SECRET strength:
```bash
echo -n "your-secret-here" | wc -c
```
**Expected:** 43+ characters for base64-encoded 32 bytes

### Test Blob Storage connection:
After connecting in Vercel, redeploy and check deployment logs for:
```
BLOB_READ_WRITE_TOKEN: [Set]
```

---

## QUICK COPY TEMPLATE

Use this template when adding variables in Vercel:

### For ONEFOCUS WEB:
```
DATABASE_URL=[paste from Neon]
NEXT_PUBLIC_SITE_URL=https://onefocusafrica.co
RESEND_API_KEY=[paste from Resend - optional]
RESEND_FROM_EMAIL=noreply@onefocusafrica.co
RESEND_INQUIRY_RECIPIENT=inquiries@onefocusafrica.co
```

### For ONEFOCUS ADMIN:
```
DATABASE_URL=[SAME as web - paste from Neon]
NEXT_PUBLIC_SITE_URL=https://admin.onefocusafrica.co
NEXTAUTH_URL=https://admin.onefocusafrica.co
AUTH_SECRET=[generate with: openssl rand -base64 32]
```

---

## ENVIRONMENT VARIABLE TROUBLESHOOTING

### Build fails: "Environment variable not found: DATABASE_URL"
**Solution:** 
1. Go to Vercel → Project → Settings → Environment Variables
2. Click "Add New"
3. Add `DATABASE_URL` with your Neon connection string
4. Select scope: Production, Preview, Development
5. Click "Save"
6. Go to Deployments → Redeploy

### Build fails: "Environment variable not found: AUTH_SECRET"
**Solution:** Admin project missing `AUTH_SECRET` - add it following steps above

### Variables not taking effect
**Solution:** 
- Environment variables only apply to NEW deployments
- After adding/changing variables, you MUST redeploy
- Go to Deployments tab → Click "Redeploy" on latest deployment

### How to update an existing variable
**Solution:**
1. Go to Settings → Environment Variables
2. Find the variable
3. Click "Edit" (pencil icon)
4. Update value
5. Click "Save"
6. Go to Deployments → Redeploy

### Variable shows in settings but not in logs
**Solution:**
- Vercel redacts sensitive values in logs for security
- `DATABASE_URL`, `AUTH_SECRET`, `BLOB_READ_WRITE_TOKEN` won't show full value
- Check deployment logs for: `Environment variables: [Set]`

---

## NEXT STEPS

1. ✅ Add all REQUIRED variables for both projects
2. ⚪ Optionally add email variables (RESEND_*)
3. 🚀 Deploy both projects (Phase 1 & 2)
4. 🔵 Connect Blob Storage (Phase 3 - auto-adds BLOB_READ_WRITE_TOKEN)
5. 🔁 Redeploy both projects after Blob connection
6. ✅ Proceed to domain configuration (Phase 5)

---

**Reference:** See `TWO-PROJECT-DEPLOYMENT-GUIDE.md` for complete deployment steps.
