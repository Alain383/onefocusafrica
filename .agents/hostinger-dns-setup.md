# Hostinger DNS Configuration Guide

## Overview

This guide documents the exact DNS records required to connect your Hostinger domains to Vercel's hosting infrastructure.

**Domains:**
- Public website: `onefocusafrica.co`
- Admin dashboard: `admin.onefocusafrica.co`

**DNS Provider:** Hostinger

---

## Prerequisites

✅ Both Vercel projects deployed (onefocus-web and onefocus-admin)  
✅ Vercel DNS targets obtained from project settings  
✅ Hostinger account access with DNS management permissions

---

## Step 1: Obtain Vercel DNS Targets

### For onefocusafrica.co (ONEFOCUS WEB)

1. Go to Vercel Dashboard → **onefocus-web** project
2. Navigate to: **Settings → Domains**
3. Click "Add Domain"
4. Enter: `onefocusafrica.co`
5. Vercel will display the required DNS records

**Expected format:**
```
Type: CNAME
Name: @ (or www)
Value: cname.vercel-dns.com
```

**Note:** The actual target may be `cname.vercel-dns.com`, `76.76.21.21` (A record), or a project-specific CNAME. Follow Vercel's exact instructions.

### For admin.onefocusafrica.co (ONEFOCUS ADMIN)

1. Go to Vercel Dashboard → **onefocus-admin** project
2. Navigate to: **Settings → Domains**
3. Click "Add Domain"
4. Enter: `admin.onefocusafrica.co`
5. Vercel will display the required DNS records

**Expected format:**
```
Type: CNAME
Name: admin
Value: cname.vercel-dns.com
```

---

## Step 2: Configure DNS in Hostinger

### Access Hostinger DNS Management

1. Log in to [Hostinger Control Panel](https://hpanel.hostinger.com)
2. Navigate to: **Domains → onefocusafrica.co**
3. Click **DNS / Name Servers**
4. Select **Manage DNS Records**

---

## Step 3: Add CNAME Records

### Record 1: Root Domain (onefocusafrica.co)

**If Vercel provides a CNAME:**

```
Type: CNAME
Name: @ (or leave blank for root)
Value: cname.vercel-dns.com
TTL: 3600 (or Auto)
```

**If Vercel provides an A record (IP address):**

```
Type: A
Name: @ (or leave blank for root)
Value: 76.76.21.21 (use the IP Vercel provides)
TTL: 3600 (or Auto)
```

**Important:** If an existing A record exists for `@` pointing elsewhere, you must:
1. Delete the old A record
2. Add the new Vercel A record

### Record 2: Admin Subdomain (admin.onefocusafrica.co)

```
Type: CNAME
Name: admin
Value: cname.vercel-dns.com (use exact target from Vercel)
TTL: 3600 (or Auto)
```

### Record 3: WWW Subdomain (Optional)

If you want `www.onefocusafrica.co` to work:

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600 (or Auto)
```

Then configure `www.onefocusafrica.co` as a domain in Vercel and set up a redirect to the root domain.

---

## Step 4: Preserve Existing Email Records

**⚠️ CRITICAL WARNING:** Do NOT modify or delete existing email-related DNS records.

### Records to Leave Untouched

- **MX records** (mail exchange)
- **TXT records** containing:
  - `v=spf1` (Sender Policy Framework)
  - `v=DKIM1` (DomainKeys Identified Mail)
  - `v=DMARC1` (Domain-based Message Authentication)
- **CNAME records** for:
  - `mail`
  - `webmail`
  - `autoconfig`
  - `autodiscover`

**Verification:** Before saving DNS changes, review all existing records and confirm you are **only adding** the Vercel CNAME/A records for `@`, `admin`, and optionally `www`.

---

## Step 5: Verify DNS Propagation

### Immediate Verification (from your machine)

```bash
# Check root domain
nslookup onefocusafrica.co

# Check admin subdomain
nslookup admin.onefocusafrica.co
```

**Expected result:** Should resolve to Vercel's IP addresses (76.76.x.x range or 2600:1f18:x:x IPv6)

### Using Online Tools

- [DNSChecker.org](https://dnschecker.org)
- [WhatsMyDNS.net](https://whatsmydns.net)

**Test both:**
- `onefocusafrica.co`
- `admin.onefocusafrica.co`

**Propagation time:** Typically 5-30 minutes, up to 48 hours in rare cases

---

## Step 6: Verify in Vercel Dashboard

### For onefocusafrica.co

1. Vercel Dashboard → **onefocus-web** → **Settings → Domains**
2. Status should show: ✅ **Valid Configuration**
3. SSL certificate should auto-provision within 5 minutes

### For admin.onefocusafrica.co

1. Vercel Dashboard → **onefocus-admin** → **Settings → Domains**
2. Status should show: ✅ **Valid Configuration**
3. SSL certificate should auto-provision within 5 minutes

---

## Step 7: Test Production URLs

Once DNS propagation completes and SSL certificates are issued:

### Test Public Website

Visit: https://onefocusafrica.co

**Expected result:**
- Homepage loads correctly
- No SSL certificate warnings
- Images display properly
- Navigation works

### Test Admin Dashboard

Visit: https://admin.onefocusafrica.co

**Expected result:**
- Login page displays
- No SSL certificate warnings
- Can log in with admin credentials
- Dashboard loads after authentication

---

## Troubleshooting

### DNS records not propagating

**Symptoms:** `nslookup` returns old IP or "NXDOMAIN"

**Solutions:**
1. Verify records saved correctly in Hostinger
2. Clear local DNS cache:
   ```bash
   # Windows
   ipconfig /flushdns
   
   # Mac/Linux
   sudo dscacheutil -flushcache
   ```
3. Wait longer (propagation can take up to 48 hours)
4. Check if Hostinger nameservers are correctly set (should be Hostinger's, not transferred to Vercel)

### Vercel shows "Invalid Configuration"

**Symptoms:** Domain status shows warning in Vercel dashboard

**Solutions:**
1. Confirm CNAME target matches exactly (case-sensitive, no trailing dot)
2. Ensure you're using the correct record type (A vs CNAME)
3. Remove any conflicting DNS records
4. Click "Refresh" in Vercel domain settings after DNS changes

### SSL certificate not provisioning

**Symptoms:** "Your connection is not private" browser warning

**Solutions:**
1. Wait 5-15 minutes after DNS propagates
2. Verify domain shows "Valid Configuration" in Vercel
3. Check no CAA records block Let's Encrypt (Vercel uses Let's Encrypt)
4. Try clicking "Refresh" in Vercel domain settings

### Email stops working after DNS changes

**Symptoms:** Cannot send/receive emails after DNS update

**Solutions:**
1. Verify MX records are still present and unchanged
2. Check SPF/DKIM/DMARC TXT records intact
3. Restore any accidentally deleted email records from Hostinger DNS backup
4. Contact Hostinger support if email records were overwritten

### Admin subdomain redirects to main site

**Symptoms:** `admin.onefocusafrica.co` loads the public website

**Solutions:**
1. Verify `admin` CNAME points to the **onefocus-admin** project, not onefocus-web
2. Confirm both projects have correct domains configured in Vercel
3. Check for wildcard CNAME (`*`) that might be catching the subdomain

---

## DNS Record Summary

| **Hostname**        | **Type** | **Value**                  | **Purpose**              |
|---------------------|----------|----------------------------|--------------------------|
| `@` or (blank)      | A/CNAME  | Vercel target              | Public website           |
| `admin`             | CNAME    | Vercel target              | Admin dashboard          |
| `www` (optional)    | CNAME    | Vercel target              | WWW redirect             |
| *(existing records)*| MX/TXT   | *(leave unchanged)*        | Email functionality      |

---

## Reference

- **Vercel Custom Domains Docs:** https://vercel.com/docs/concepts/projects/domains
- **Hostinger DNS Guide:** https://support.hostinger.com/en/articles/1583227-how-to-edit-dns-zone
- **Vercel Deployment Guide:** `.agents/vercel-deployment-guide.md`
- **Environment Variables:** `.agents/production-env-checklist.md`

---

## Next Steps

After DNS configuration succeeds:

1. ✅ Verify SSL certificates active for both domains
2. ✅ Test all functionality using post-deployment checklist
3. ✅ Monitor Vercel logs for any errors
4. ✅ Set up Vercel monitoring/alerts (optional)

**Full verification checklist:** `.agents/post-deployment-checklist.md`
