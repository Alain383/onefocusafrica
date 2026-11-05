# ONEFOCUS AFRICA - Admin Login Portal Documentation

## 📍 Access Information

**Login URL:** http://localhost:3000/admin/login
**Dashboard URL:** http://localhost:3000/admin

**Default Credentials:**
- Email: admin@onefocusafrica.com
- Password: admin123

---

## 🎨 Login Portal Design

### Visual Design
- **Background:** Dark navy (#101D3A)
- **Card:** White with rounded corners (border-radius: 16px)
- **Brand Colors:** 
  - Primary Blue: #1F99ED (buttons, focus states)
  - Dark: #101D3A (headings, background)
- **Typography:** Clean, modern sans-serif
- **Shadow:** Elevated card with shadow-xl

### Layout
- Centered on screen (vertical & horizontal)
- Maximum width: 28rem (448px)
- Padding: 2rem (32px)
- Responsive design

### Form Elements
1. **Email Input**
   - Type: email
   - Required: Yes
   - Autocomplete: email
   - Placeholder: admin@onefocusafrica.com

2. **Password Input**
   - Type: password
   - Required: Yes
   - Autocomplete: current-password
   - Placeholder: ••••••••

3. **Submit Button**
   - Text: "Sign in" (changes to "Signing in…" when loading)
   - Color: Primary Blue (#1F99ED)
   - Hover: Darker blue (#1a87d4)
   - Disabled state: 60% opacity

4. **Error Messages**
   - Red background (#FEF2F2)
   - Red text (#DC2626)
   - Red border (#FECACA)
   - Rounded corners

---

## 🔐 Authentication Flow

### 1. User Submits Login Form
\\\
User enters email & password → Click "Sign in"
\\\

### 2. NextAuth Credentials Provider
\\\	ypescript
// Location: lib/auth.ts
- Validates credentials
- Checks rate limiting (5 attempts per 15 minutes)
- Queries database for user
- Verifies password with bcrypt
- Updates last login timestamp
- Returns user object or null
\\\

### 3. Session Creation
\\\	ypescript
// JWT Strategy
- Creates JWT token with user data (id, email, role)
- Token valid for 8 hours
- Stored in httpOnly cookie
\\\

### 4. Redirect to Dashboard
\\\
Successful login → router.push('/admin')
Failed login → Display error message
\\\

---

## 🛡️ Security Features

### Rate Limiting
- **Max attempts:** 5 failed logins
- **Time window:** 15 minutes
- **Lockout message:** "Too many attempts. Try again in X minute(s)."
- **Implementation:** In-memory map (suitable for single-instance)

### Password Security
- **Hashing:** bcrypt with 12 rounds
- **Storage:** Only hashed passwords stored in database
- **Validation:** Server-side comparison with bcrypt.compare()

### Session Security
- **Strategy:** JWT (JSON Web Tokens)
- **Storage:** httpOnly cookies (prevents XSS)
- **Expiry:** 8 hours maximum
- **Refresh:** Session extends on activity

### Route Protection
- **Middleware:** Protects all /admin/* routes
- **Unauthenticated:** Redirect to /admin/login
- **Authenticated:** Allow access to dashboard

---

## 📁 File Structure

\\\
app/
├── admin/
│   └── login/
│       └── page.tsx          # Login UI component
├── api/
│   └── auth/
│       └── [...nextauth]/
│           └── route.ts      # NextAuth API handlers
lib/
├── auth.ts                   # NextAuth configuration
├── auth-utils.ts             # Auth helper functions
└── prisma.ts                 # Database client
middleware.ts                 # Route protection
types/
└── next-auth.d.ts           # NextAuth type definitions
\\\

---

## 🔧 Configuration Files

### Environment Variables (.env.local)
\\\env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="development-secret-key-change-in-production-1819007088"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAIL="admin@onefocusafrica.com"
ADMIN_PASSWORD="admin123"
\\\

### NextAuth Configuration (lib/auth.ts)
- Provider: Credentials
- Session: JWT (8 hours)
- Custom login page: /admin/login
- Rate limiting enabled
- Password hashing with bcrypt

### Middleware (middleware.ts)
- Protects: /admin/:path*
- Excludes: /admin/login
- Redirects unauthenticated users to login

---

## 🎯 User Roles

### ADMIN Role
- Full access to all features
- User management
- Content publishing
- Settings configuration

### EDITOR Role
- Content creation/editing
- Media uploads
- Limited access (no user management)

---

## 🧪 Testing the Login

### Manual Test Steps

1. **Start server:**
   \\\powershell
   .\start-dev.ps1
   \\\

2. **Open login page:**
   \\\
   http://localhost:3000/admin/login
   \\\

3. **Test valid credentials:**
   - Email: admin@onefocusafrica.com
   - Password: admin123
   - Expected: Redirect to dashboard

4. **Test invalid credentials:**
   - Email: wrong@example.com
   - Password: wrongpass
   - Expected: Error message "Invalid email or password."

5. **Test rate limiting:**
   - Enter wrong password 5 times
   - Expected: "Too many attempts. Try again in X minute(s)."

6. **Test protected routes:**
   - Try accessing http://localhost:3000/admin (without login)
   - Expected: Redirect to /admin/login

---

## 🐛 Common Issues & Solutions

### Issue: Can't access login page (redirect loop)
**Solution:** 
- Clear browser cache (Ctrl+F5)
- Restart development server
- Check middleware.ts is properly configured

### Issue: "Invalid email or password" for correct credentials
**Solution:**
- Verify admin user exists: check database
- Re-run seed script: \
pm run seed:admin\
- Check DATABASE_URL is set correctly

### Issue: "Too many attempts" blocking login
**Solution:**
- Wait 15 minutes OR
- Restart server (clears in-memory rate limiter)

### Issue: Stuck on "Signing in…"
**Solution:**
- Check browser console for errors (F12)
- Verify API route: http://localhost:3000/api/auth/signin
- Check database connection

---

## 📊 Database Schema (AdminUser)

\\\prisma
model AdminUser {
  id             String    @id @default(uuid())
  name           String
  email          String    @unique
  hashedPassword String
  role           AdminRole @default(EDITOR)
  isActive       Boolean   @default(true)
  lastLoginAt    DateTime?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
}

enum AdminRole {
  ADMIN
  EDITOR
}
\\\

---

## 🚀 Production Considerations

### Before Deployment:

1. **Change NEXTAUTH_SECRET**
   - Generate: \openssl rand -base64 32\
   - Set in production environment

2. **Update NEXTAUTH_URL**
   - Set to: https://admin.onefocusafrica.com

3. **Secure Password Policy**
   - Enforce minimum 12 characters
   - Require uppercase, lowercase, numbers, symbols
   - Implement password reset flow

4. **Enhanced Rate Limiting**
   - Use Redis for distributed rate limiting
   - Implement IP-based blocking
   - Add CAPTCHA after 3 failed attempts

5. **Session Management**
   - Implement session revocation
   - Add "Remember me" option
   - Force re-login for sensitive actions

6. **Audit Logging**
   - Log all login attempts
   - Track user actions
   - Monitor suspicious activity

---

## 📱 Screenshots

### Login Page View
\\\
┌─────────────────────────────────────┐
│                                     │
│       ONEFOCUS AFRICA              │
│       Admin Dashboard              │
│                                     │
│  Email address                     │
│  ┌─────────────────────────────┐  │
│  │ admin@onefocusafrica.com    │  │
│  └─────────────────────────────┘  │
│                                     │
│  Password                          │
│  ┌─────────────────────────────┐  │
│  │ ••••••••                    │  │
│  └─────────────────────────────┘  │
│                                     │
│  ┌─────────────────────────────┐  │
│  │        Sign in              │  │
│  └─────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
\\\

### After Login → Dashboard
\\\
http://localhost:3000/admin
- Shows admin sidebar
- Displays dashboard metrics
- Navigation to all admin sections
\\\

---

## 📞 Support

For issues with the login portal:
1. Check browser console (F12)
2. Verify database connection
3. Check server logs in terminal
4. Review middleware configuration
5. Ensure environment variables are set

---

**Created:** November 05, 2026
**Version:** 1.0
**Status:** ✅ Operational