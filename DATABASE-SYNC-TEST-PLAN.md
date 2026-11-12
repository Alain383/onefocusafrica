# DATABASE SYNCHRONIZATION TEST PLAN

## Test Scenario: Admin → Web Publishing Workflow

This test verifies that content created in the admin dashboard appears correctly on the public website.

═══════════════════════════════════════════════════════════════════════

## PREREQUISITE: Both Apps Connected to Same Database

✅ Web App DATABASE_URL: postgresql://...
✅ Admin App DATABASE_URL: postgresql://... (SAME as above)

═══════════════════════════════════════════════════════════════════════

## TEST 1: Blog Post Publishing

### Steps:
1. **In Admin Dashboard** (http://localhost:3001 or production URL)
   - Navigate to: Blog & Articles
   - Click: "New Post"
   - Enter:
     * Title: "Test Post - [Current Date]"
     * Content: "This is a test to verify publishing workflow works correctly."
     * Category: Select any category
     * Status: PUBLISHED
     * Published Date: Today
   - Upload cover image (optional)
   - Click: "Save & Publish"
   - Note the slug generated (e.g., "test-post-[date]")

2. **In Web App** (http://localhost:3000 or production URL)
   - Navigate to: /blog
   - **Expected:** Post appears in blog listing
   - **Verify:**
     * ✓ Title displays correctly
     * ✓ Excerpt displays (if provided)
     * ✓ Cover image displays (if uploaded)
     * ✓ Published date shows
     * ✓ Category badge appears
   
3. **Click the post**
   - Navigate to: /blog/test-post-[date]
   - **Expected:** Full post content displays
   - **Verify:**
     * ✓ Title displays
     * ✓ Content renders correctly
     * ✓ Cover image displays full size
     * ✓ No author name displayed (per requirements)
     * ✓ Published date shows
     * ✓ Categories are clickable

### Result:
- [ ] PASS: Post appears on web immediately after publishing
- [ ] FAIL: Post does not appear (check DATABASE_URL consistency)

═══════════════════════════════════════════════════════════════════════

## TEST 2: Portfolio Item Publishing

### Steps:
1. **In Admin Dashboard**
   - Navigate to: Portfolio
   - Click: "New Case Study"
   - Enter:
     * Title: "Test Project - [Date]"
     * Client: "Test Client"
     * Description: "Test project description"
     * Services: Add at least one service
     * Status: PUBLISHED
   - Upload featured image
   - Click: "Save"

2. **In Web App**
   - Navigate to: /work
   - **Expected:** Project appears in portfolio grid
   - **Verify:**
     * ✓ Title displays
     * ✓ Client name shows
     * ✓ Featured image displays
     * ✓ Services/tags display

### Result:
- [ ] PASS: Portfolio item appears on web
- [ ] FAIL: Item does not appear

═══════════════════════════════════════════════════════════════════════

## TEST 3: Draft vs Published Behavior

### Steps:
1. **In Admin Dashboard**
   - Create new blog post
   - Set Status: DRAFT
   - Save post

2. **In Web App**
   - Navigate to: /blog
   - **Expected:** Draft post does NOT appear
   - **Verify:**
     * ✓ Only published posts visible
     * ✓ Draft count in admin shows correctly

3. **Back in Admin**
   - Edit the draft post
   - Change Status: PUBLISHED
   - Save

4. **In Web App**
   - Refresh /blog
   - **Expected:** Post now appears
   - **Verify:**
     * ✓ Post immediately visible
     * ✓ No caching issues

### Result:
- [ ] PASS: Status filtering works correctly
- [ ] FAIL: Drafts are visible or published posts are hidden

═══════════════════════════════════════════════════════════════════════

## TEST 4: Edit and Update Synchronization

### Steps:
1. **In Admin Dashboard**
   - Edit an existing published post
   - Change title to: "[Original Title] - UPDATED"
   - Modify content
   - Save changes

2. **In Web App**
   - Navigate to the post
   - **Expected:** Changes appear immediately
   - **Verify:**
     * ✓ Updated title displays
     * ✓ Updated content displays
     * ✓ No caching delays

### Result:
- [ ] PASS: Updates sync immediately
- [ ] FAIL: Old content still shows (check ISR/caching)

═══════════════════════════════════════════════════════════════════════

## TEST 5: Inquiry Form → Admin Dashboard

### Steps:
1. **In Web App**
   - Navigate to: /contact
   - Fill out inquiry form:
     * Name: "Test User"
     * Email: "test@example.com"
     * Message: "Test inquiry submission"
   - Submit form

2. **In Admin Dashboard**
   - Navigate to: Business Inquiries
   - **Expected:** New inquiry appears in list
   - **Verify:**
     * ✓ Inquiry visible
     * ✓ Status: "New"
     * ✓ All form data captured
     * ✓ Timestamp correct

3. **Click on inquiry**
   - View inquiry details
   - **Expected:** Full details visible
   - Change status to "In Progress"
   - Add note
   - Save

### Result:
- [ ] PASS: Inquiries sync from web to admin
- [ ] FAIL: Inquiries not appearing

═══════════════════════════════════════════════════════════════════════

## TEST 6: Image Upload and Display

### Steps:
1. **In Admin Dashboard**
   - Create new blog post
   - Click "Upload Cover Image"
   - Upload test image (JPG, PNG, or WebP)
   - **Expected:** Upload succeeds
   - **Verify:**
     * ✓ Progress bar shows
     * ✓ Image preview appears
     * ✓ URL is saved to database
   - Publish post

2. **In Web App**
   - Navigate to blog post
   - **Expected:** Cover image displays
   - **Verify:**
     * ✓ Image loads (not broken)
     * ✓ Correct aspect ratio
     * ✓ Image is optimized

### Result:
- [ ] PASS: Images upload and display correctly
- [ ] FAIL: Images not uploading or displaying

### Note for Production:
⚠️  Vercel uses ephemeral filesystem. Images uploaded locally won't persist.
✅  Solution: Configure Vercel Blob storage (see deployment guide)

═══════════════════════════════════════════════════════════════════════

## TEST 7: Database Connection Resilience

### Steps:
1. **Simulate Database Connection Issue:**
   - Temporarily set invalid DATABASE_URL in one app
   - Try to access the app

2. **Expected Behavior:**
   - Graceful error handling
   - Error message (not blank page)
   - No app crash

3. **Restore DATABASE_URL**
   - App should recover automatically
   - No data loss

### Result:
- [ ] PASS: Error handling works
- [ ] FAIL: App crashes or shows blank page

═══════════════════════════════════════════════════════════════════════

## TEST RESULTS SUMMARY

Date Tested: ___________
Tested By: ___________
Environment: [ ] Local [ ] Production

| Test | Status | Notes |
|------|--------|-------|
| 1. Blog Post Publishing | ⬜ PASS ⬜ FAIL | |
| 2. Portfolio Publishing | ⬜ PASS ⬜ FAIL | |
| 3. Draft vs Published | ⬜ PASS ⬜ FAIL | |
| 4. Edit Sync | ⬜ PASS ⬜ FAIL | |
| 5. Inquiry Form | ⬜ PASS ⬜ FAIL | |
| 6. Image Upload | ⬜ PASS ⬜ FAIL | |
| 7. Error Handling | ⬜ PASS ⬜ FAIL | |

**Overall Status:** ⬜ ALL TESTS PASSED - Ready for Production

═══════════════════════════════════════════════════════════════════════

## TROUBLESHOOTING FAILED TESTS

### If Test 1-4 Fail (Publishing Issues):

**Problem:** Content not appearing on web app

**Diagnosis:**
```bash
# Check if both apps use same DATABASE_URL
# In web app:
echo $DATABASE_URL

# In admin app:
echo $DATABASE_URL

# Should be IDENTICAL
```

**Solutions:**
1. Verify DATABASE_URL matches exactly in both .env files
2. Restart both dev servers
3. Check Prisma is using same client
4. Verify no caching issues (clear browser cache)

### If Test 5 Fails (Inquiry Form):

**Problem:** Inquiries not reaching admin

**Diagnosis:**
```bash
# Check inquiry API endpoint
curl -X POST http://localhost:3000/api/inquiries \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","message":"Test"}'

# Should return 200 OK
```

**Solutions:**
1. Check API route exists in apps/web/app/api/inquiries/route.ts
2. Verify database connection in web app
3. Check CORS settings if testing from different domain

### If Test 6 Fails (Image Upload):

**Problem:** Images not uploading or displaying

**Diagnosis:**
1. Check browser console for upload errors
2. Check network tab for failed requests
3. Verify upload API endpoint exists
4. Check file permissions on uploads directory

**Solutions:**
1. Verify apps/admin/app/api/admin/media/route.ts exists
2. Check apps/web/public/uploads directory is writable
3. For production: Configure Vercel Blob (see deployment guide)

═══════════════════════════════════════════════════════════════════════

## AUTOMATED TESTING (Future Enhancement)

Consider adding these automated tests:

```javascript
// tests/integration/publishing.test.ts
describe('Publishing Workflow', () => {
  it('should create post in admin and appear on web', async () => {
    // Create post via admin API
    const post = await createPost({
      title: 'Test Post',
      status: 'PUBLISHED'
    });
    
    // Query web app API
    const response = await fetch('/api/blog');
    const posts = await response.json();
    
    expect(posts).toContainEqual(
      expect.objectContaining({ id: post.id })
    );
  });
});
```

═══════════════════════════════════════════════════════════════════════