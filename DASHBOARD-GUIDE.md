# ONEFOCUS AFRICA - Admin Dashboard Complete Guide

**Version:** 1.0  
**Created:** November 4, 2026  
**Access:** http://localhost:3000/admin

---

## 🎯 Dashboard Overview

After logging in, you'll see the **Admin Dashboard** - your central hub for managing all ONEFOCUS AFRICA content, inquiries, and settings.

---

## 📊 Main Dashboard (Homepage)

**URL:** http://localhost:3000/admin

### What You'll See:

#### 1. **Stat Cards** (Top Row)
Four key metrics displayed as cards:

- **Published Posts** - Number of live blog articles
  - Click to → Blog management
  
- **Total Inquiries** - All business inquiries received
  - Click to → Inquiries list
  
- **New Inquiries** - Unread/new inquiries needing attention
  - Click to → Inquiries list (filtered)
  
- **Active Members** - Community members count
  - Display only (no link)

#### 2. **Recent Inquiries** (Bottom Left)
- Shows last 5 business inquiries
- Displays: Name, Service Area, Date
- Click any inquiry → View full details
- "View all" link → Full inquiries page

#### 3. **Recent Posts** (Bottom Right)
- Shows last 5 blog posts created
- Displays: Title, Status badge (DRAFT/PUBLISHED/etc.)
- Click any post → Edit post
- "View all" link → Blog management page

---

## 🎨 Dashboard Layout

### Sidebar Navigation (Left - Dark Navy)
`
┌────────────────────┐
│  ONEFOCUS Admin    │  ← Logo/Brand
├────────────────────┤
│ 📊 Overview        │  ← Dashboard home
│ 📝 Blog & Articles │  ← Blog management
│ 🖼️  Media Library   │  ← Images/files
│ 🌐 Website Content │  ← Programs, events
│ 💼 Portfolio        │  ← Case studies
│ 📧 Business Inq... │  ← CRM/Inquiries
│ 📅 Programs & Ev..│  ← Events
│ 👥 Team & Settings │  ← Team, admins
├────────────────────┤
│ 👤 Admin User      │  ← Your username
└────────────────────┘
`

**Features:**
- Dark navy background (#101D3A)
- White text with icons
- Active page = Light blue highlight
- Fixed width: 240px
- Always visible (no collapse)

### Top Bar (Header)
`
┌──────────────────────────────────────────────────┐
│ Admin / Blog              👤 Admin User | Sign out │
└──────────────────────────────────────────────────┘
`

**Features:**
- Breadcrumb navigation (shows current path)
- User name display
- Sign out button (logs out → redirects to login)
- White background, gray border

### Main Content Area
- White background
- Padding: 24px
- Scrollable (if content exceeds viewport)
- Responsive to window size

---

## 📑 All Admin Pages

### 1. 📊 Overview (Dashboard)
**URL:** /admin  
**Access:** All roles (ADMIN + EDITOR)

**Features:**
- 4 stat cards with metrics
- Recent inquiries list (5 items)
- Recent posts list (5 items)
- Quick links to main sections

---

### 2. 📝 Blog & Articles
**URL:** /admin/blog  
**Access:** All roles (ADMIN + EDITOR)

**Features:**
- **List View:**
  - Search posts by title
  - Filter by status (Draft, Review, Scheduled, Published)
  - Filter by category
  - Shows: Title, Author, Categories, Status, Date
  - Actions: Edit, Delete
  - "New Post" button (top right)
  - Pagination (20 posts per page)

- **Create/Edit Post:** /admin/blog/new or /admin/blog/[id]/edit
  - TipTap rich text editor
  - Title, slug, excerpt fields
  - Cover image upload
  - Category & tag assignment
  - SEO fields (meta title, description)
  - Status selection (Draft, Review, Scheduled, Published)
  - Schedule publishing date
  - Preview mode
  - Auto-save drafts

- **Categories Management:** /admin/blog/categories
  - List all categories
  - Create new categories
  - Edit/delete categories
  - Slug auto-generation

**What You Can Do:**
✅ Write blog posts with rich formatting  
✅ Upload cover images  
✅ Organize with categories and tags  
✅ Schedule posts for future publishing  
✅ Manage SEO metadata  
✅ Preview before publishing  

---

### 3. 🖼️ Media Library
**URL:** /admin/media  
**Access:** All roles (ADMIN + EDITOR)

**Features:**
- Grid view of all uploaded files
- Shows: Thumbnail, filename, size, upload date
- Upload button (supports drag & drop)
- File types: Images (jpg, png, webp, gif), PDFs
- Max size: 10MB per file
- Storage: Vercel Blob
- Click image → Copy URL
- Delete files
- Filter by type

**What You Can Do:**
✅ Upload images for blog posts  
✅ Upload documents/PDFs  
✅ Organize media assets  
✅ Copy URLs for use in content  
✅ Delete unused files  

---

### 4. 🌐 Website Content
**URL:** /admin/content  
**Access:** ADMIN only

**Features:**
- **Programs Management:**
  - List all service programs
  - Add/edit/delete programs
  - Fields: Title, Description, Icon, Status

- **Events Management:**
  - List upcoming and past events
  - Add/edit/delete events
  - Fields: Title, Description, Date, Location, Registration link
  - Status: Upcoming, Past, Cancelled

- **Site Content (Key-Value):**
  - Edit dynamic site content
  - Sections: Homepage, About, Contact
  - Fields by section

**What You Can Do:**
✅ Manage service programs  
✅ Add upcoming events  
✅ Update dynamic site content  
✅ Control what appears on public site  

---

### 5. 💼 Portfolio
**URL:** /admin/portfolio  
**Access:** ADMIN only

**Features:**
- List all case studies
- Add/edit/delete case studies
- Fields:
  - Title, Slug
  - Category (Brand, Media, Web, Training)
  - Client name
  - Challenge, Solution, Outcome
  - Deliverables (list)
  - Published assets (images/links)
  - Publish status

**What You Can Do:**
✅ Showcase client work  
✅ Add portfolio case studies  
✅ Upload project images  
✅ Publish/unpublish projects  

---

### 6. 📧 Business Inquiries (CRM)
**URL:** /admin/inquiries  
**Access:** All roles (ADMIN + EDITOR)

**Features:**
- **List View:**
  - Table with all inquiries
  - Shows: Name, Email, Company, Service, Status, Date
  - Status colors:
    - New = Blue
    - Contacted = Yellow
    - Qualified = Purple
    - Proposal = Orange
    - Closed = Green
  - Click any row → View full details

- **Detail View:** /admin/inquiries/[id]
  - Full inquiry information
  - Contact details
  - Challenge/objective described
  - Timeline and budget (if provided)
  - Status management
  - Assign to team member
  - Add internal notes
  - Follow-up date reminder
  - Email client (if configured)

**What You Can Do:**
✅ View all business inquiries  
✅ Track inquiry status  
✅ Assign to team members  
✅ Add internal notes  
✅ Set follow-up reminders  
✅ Move through sales pipeline  

---

### 7. 📅 Programs & Events
**URL:** /admin/programs  
**Access:** All roles (ADMIN + EDITOR)

**Features:**
- Dual view: Programs + Events
- Add/edit/delete both types
- Programs: Service offerings
- Events: Upcoming events/webinars
- Status management
- Date scheduling

**What You Can Do:**
✅ Manage service programs  
✅ Schedule events  
✅ Update event details  
✅ Mark events as past/cancelled  

---

### 8. 👥 Team & Settings
**URL:** /admin/team  
**Access:** ADMIN only

**Features:**
- **Team Members Management:**
  - Add/edit/delete team profiles
  - Fields: Name, Role/Title, Bio, Photo
  - Sort order (drag to reorder)
  - Active/inactive status

- **Admin Users:** /admin/settings
  - Create admin accounts
  - Roles: ADMIN or EDITOR
  - Email-based login
  - Password management
  - Active/inactive status
  - Last login tracking

**What You Can Do:**
✅ Add team member profiles  
✅ Create admin accounts  
✅ Manage user permissions  
✅ Deactivate users  

---

## 🎨 Design System

### Colors
- **Primary Blue:** #1F99ED (buttons, links, active states)
- **Dark Navy:** #101D3A (sidebar, headings)
- **Gray Scale:** 50-900 (backgrounds, text, borders)

### Typography
- **Headings:** Bold, 18-24px
- **Body:** Regular, 14-16px
- **Small:** 12px (meta info, dates)

### Components
- **Cards:** White, rounded-xl (12px), border
- **Buttons:** Blue primary, gray secondary
- **Tables:** Striped hover states
- **Forms:** Labeled inputs, focus rings
- **Status Badges:** Colored pills (rounded-full)

---

## 🔐 User Roles & Permissions

### ADMIN Role (Full Access)
✅ All pages accessible  
✅ Create/edit/delete all content  
✅ Manage admin users  
✅ Access settings  
✅ View all analytics  

### EDITOR Role (Limited Access)
✅ Blog management (create/edit posts)  
✅ Media library (upload/manage files)  
✅ View inquiries  
✅ Programs & events management  
❌ Cannot create admin users  
❌ Cannot access team settings  
❌ Cannot delete certain content  

---

## ⌨️ Keyboard Shortcuts

### Navigation
- \Tab\ - Move through form fields
- \Enter\ - Submit forms
- \Esc\ - Close modals/dialogs

### Editor (TipTap)
- \Ctrl+B\ - Bold
- \Ctrl+I\ - Italic
- \Ctrl+K\ - Insert link
- \Ctrl+Z\ - Undo
- \Ctrl+Shift+Z\ - Redo

---

## 📱 Responsive Design

### Desktop (> 1024px)
- Full sidebar visible
- Multi-column layouts
- Wide tables

### Tablet (768px - 1024px)
- Sidebar collapsible
- Adjusted column widths
- Horizontal scroll tables

### Mobile (< 768px)
- Hidden sidebar (hamburger menu)
- Single column layouts
- Card-based views

---

## 🚀 Quick Actions

### From Dashboard:
1. **Create Blog Post** → Click "New Post" button
2. **View Inquiry** → Click inquiry name in list
3. **Upload Media** → Go to Media Library → Click "Upload"
4. **Publish Content** → Edit post → Change status to "Published"

### Common Workflows:

#### Publish a Blog Post
1. Click "Blog & Articles" in sidebar
2. Click "New Post" button
3. Write title and content
4. Upload cover image
5. Select category
6. Set status to "Published"
7. Click "Save"

#### Manage Inquiry
1. Click "Business Inquiries" in sidebar
2. Click inquiry name
3. Change status (e.g., "new" → "contacted")
4. Add notes
5. Set follow-up date
6. Click "Save Changes"

#### Upload Media
1. Click "Media Library" in sidebar
2. Click "Upload Files" button
3. Select files or drag & drop
4. Wait for upload completion
5. Copy URL for use in content

---

## 🎯 Dashboard Features Summary

### Content Management
✅ Blog posts with rich text editor  
✅ Categories and tags organization  
✅ Media library for images/files  
✅ Portfolio case studies  
✅ Dynamic site content  

### Operations
✅ Business inquiries (CRM)  
✅ Community member tracking  
✅ Lead status management  
✅ Follow-up reminders  

### Administration
✅ User role management (ADMIN/EDITOR)  
✅ Team member profiles  
✅ Authentication & authorization  
✅ Activity tracking (last login)  

### Analytics
✅ Dashboard metrics (posts, inquiries, members)  
✅ Recent activity feeds  
✅ Status distribution  

---

## 💡 Tips & Best Practices

### Blog Management
- Use descriptive titles (SEO)
- Always add cover images
- Choose relevant categories
- Preview before publishing
- Schedule posts for consistency

### Inquiry Management
- Respond within 24 hours
- Update status regularly
- Add detailed notes
- Set follow-up reminders
- Move through pipeline systematically

### Media Library
- Use descriptive filenames
- Optimize images before upload
- Delete unused files regularly
- Organize by type/project

### Security
- Sign out when finished
- Use strong passwords
- Don't share admin credentials
- Review admin users regularly

---

## 🐛 Troubleshooting

### Page Won't Load
- Check internet connection
- Refresh page (Ctrl+F5)
- Clear browser cache
- Check server is running

### Can't Upload Files
- Check file size (< 10MB)
- Verify file type allowed
- Check Vercel Blob token configured
- Try different browser

### Changes Not Saving
- Check form validation errors
- Verify all required fields filled
- Check database connection
- Review server logs

### Session Expired
- Session lasts 8 hours
- Sign in again at /admin/login
- Work will auto-save (draft mode)

---

## 📞 Support & Resources

### Documentation
- LOGIN-PORTAL-DOCUMENTATION.md
- This file (DASHBOARD-GUIDE.md)
- PRE-MIGRATION-AUDIT.md

### Get Help
1. Check browser console (F12)
2. Review server logs in terminal
3. Verify environment variables
4. Check database connection

---

**Last Updated:** November 05, 2026  
**Dashboard Status:** ✅ Fully Operational  
**All Features:** ✅ Working