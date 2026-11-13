# Requirements Document

## Introduction

This document specifies the requirements for enhancing the blog post detail page with a Facebook/Instagram-style comment system and a sidebar containing social media follow links, share buttons, and related content widgets. The enhancement will improve user engagement by simplifying comment display (showing only names, not emails) and adding persistent sidebar content with social media integration.

## Glossary

- **Blog_Detail_Page**: The page that displays a single blog post with its full content, metadata, and comments
- **Comment_System**: The user interface and functionality for displaying and submitting comments on blog posts
- **Sidebar**: A vertical column displayed alongside the main content that contains supplementary information and widgets
- **Social_Follow_Widget**: A component displaying links to ONEFOCUS AFRICA's social media profiles
- **Social_Share_Widget**: A component allowing users to share the current blog post on social media platforms
- **Related_Posts_Widget**: A component displaying links to other relevant blog posts
- **Comment_Form**: The input form where users submit their name, email, and comment content
- **Comment_Display**: The visual presentation of submitted comments including avatar, name, timestamp, and content
- **Avatar**: A circular visual element displaying the first letter of a commenter's name
- **Relative_Timestamp**: A human-readable time format showing how long ago a comment was posted (e.g., "2 days ago")
- **Sticky_Sidebar**: A sidebar that remains visible as the user scrolls down the page
- **Database**: The PostgreSQL database accessed via Prisma ORM storing blog posts and comments
- **Comment_Model**: The Prisma database model representing a blog comment with fields: id, postId, name, email, content, createdAt, approved

## Requirements

### Requirement 1: Simplified Comment Display

**User Story:** As a blog reader, I want to see comments in a clean, social media-style format with only commenter names visible, so that I can easily read and engage with discussions without being distracted by email addresses.

#### Acceptance Criteria

1. WHEN a comment is displayed, THE Comment_Display SHALL show only the commenter's name and SHALL NOT display the email address
2. THE Comment_Display SHALL include a circular Avatar containing the first letter of the commenter's name in uppercase
3. THE Avatar SHALL have a colored background and white text for visual contrast
4. WHEN displaying the comment timestamp, THE Comment_Display SHALL show a Relative_Timestamp (e.g., "2 days ago", "1 hour ago", "just now")
5. THE Comment_Display SHALL show the commenter's name and Relative_Timestamp on the same line adjacent to the Avatar
6. THE Comment_Display SHALL show the comment content below the name and timestamp
7. WHEN multiple comments exist, THE Comment_System SHALL display them in chronological order (oldest first)
8. THE Comment_Display SHALL maintain the existing visual style with rounded corners and subtle background colors

### Requirement 2: Comment Form Data Collection

**User Story:** As the system administrator, I want to collect both name and email from commenters while keeping emails private, so that I have contact information for moderation purposes without exposing user privacy.

#### Acceptance Criteria

1. THE Comment_Form SHALL collect three fields: name, email, and content
2. THE Comment_Form SHALL mark name and email fields as required with a red asterisk
3. WHEN a user submits the Comment_Form, THE Comment_System SHALL store the name field in the Database
4. WHEN a user submits the Comment_Form, THE Comment_System SHALL store the email field in the Database
5. THE Comment_Form SHALL validate that the email field contains a valid email format before submission
6. WHEN the comment is stored in the Database, THE email field SHALL be stored in the Comment_Model but SHALL NOT be displayed in any public Comment_Display

### Requirement 3: Blog Detail Page Layout with Sidebar

**User Story:** As a blog reader, I want to see a sidebar with social media links and related content while reading blog posts, so that I can easily follow ONEFOCUS AFRICA on social media and discover other relevant content.

#### Acceptance Criteria

1. WHEN the Blog_Detail_Page is viewed on desktop (viewport width >= 1024px), THE Blog_Detail_Page SHALL display a two-column layout with main content and Sidebar
2. THE main content column SHALL occupy approximately 66% of the container width
3. THE Sidebar SHALL occupy approximately 33% of the container width
4. THE Sidebar SHALL be positioned to the right of the main content
5. WHEN the Blog_Detail_Page is viewed on mobile (viewport width < 1024px), THE Sidebar SHALL be displayed below the main content in a single-column layout
6. THE Sidebar SHALL contain three widgets: Social_Follow_Widget, Social_Share_Widget, and Related_Posts_Widget

### Requirement 4: Sticky Sidebar Behavior

**User Story:** As a blog reader, I want the sidebar to remain visible as I scroll through long articles, so that I can access social sharing and related content at any time.

#### Acceptance Criteria

1. WHEN the user scrolls down the Blog_Detail_Page on desktop, THE Sidebar SHALL stick to the viewport and remain visible
2. THE Sticky_Sidebar SHALL start sticking when the user scrolls past the sidebar's initial position
3. THE Sticky_Sidebar SHALL stop sticking when it reaches the end of the main content area
4. WHEN the Blog_Detail_Page is viewed on mobile, THE Sidebar SHALL NOT exhibit sticky behavior
5. THE Sticky_Sidebar SHALL maintain a fixed distance from the top of the viewport (e.g., 20px) when scrolling

### Requirement 5: Social Follow Widget

**User Story:** As a marketing manager, I want readers to see our social media profile links prominently in the sidebar, so that we can grow our social media following and maintain engagement with our audience.

#### Acceptance Criteria

1. THE Social_Follow_Widget SHALL display icons for four social media platforms: Facebook, Twitter, LinkedIn, and Instagram
2. THE Facebook icon SHALL link to https://facebook.com/onefocusafrica
3. THE Twitter icon SHALL link to https://twitter.com/onefocusafrica
4. THE LinkedIn icon SHALL link to https://linkedin.com/company/onefocus-africa
5. THE Instagram icon SHALL link to https://instagram.com/onefocusafrica
6. WHEN a user hovers over a social media icon, THE icon's background SHALL change to pure black (#000000) and the icon graphic SHALL change to white
7. THE Social_Follow_Widget SHALL display icons in a horizontal or grid layout depending on available space
8. THE social media links SHALL open in a new browser tab with rel="noopener noreferrer" for security
9. THE Social_Follow_Widget SHALL include a heading "Follow Us" or similar descriptive text
10. THE Social_Follow_Widget SHALL have rounded corners and a subtle border or background color consistent with the site design

### Requirement 6: Social Share Widget in Sidebar

**User Story:** As a content creator, I want readers to have easy access to sharing tools throughout their reading experience, so that they can share our content at any moment without scrolling to the bottom of the article.

#### Acceptance Criteria

1. THE Sidebar SHALL include the existing Social_Share_Widget component
2. THE Social_Share_Widget in the Sidebar SHALL provide the same sharing options as the inline version: Facebook, Twitter, LinkedIn, WhatsApp, Email, and Copy Link
3. THE Social_Share_Widget SHALL use the current blog post's URL, title, description, and cover image for sharing
4. THE Social_Share_Widget SHALL include a heading "Share This Article" or similar descriptive text
5. THE Social_Share_Widget SHALL maintain the existing visual styling with circular icon buttons
6. WHEN the Social_Share_Widget is placed in the Sidebar, THE inline Social_Share_Widget after the article content MAY be removed to avoid duplication

### Requirement 7: Related Posts Widget

**User Story:** As a blog reader, I want to see links to related or popular blog posts in the sidebar, so that I can easily discover other relevant content without navigating away from the current page.

#### Acceptance Criteria

1. THE Related_Posts_Widget SHALL display a list of 3-5 related or popular blog posts
2. THE Related_Posts_Widget SHALL include a heading "Related Posts" or "Popular Posts"
3. FOR EACH post in the Related_Posts_Widget, THE widget SHALL display the post title and a thumbnail image (if available)
4. WHEN a user clicks on a post in the Related_Posts_Widget, THE Blog_Detail_Page SHALL navigate to that blog post
5. WHEN selecting posts for the Related_Posts_Widget, THE system SHALL prioritize posts from the same categories or tags as the current post
6. IF no posts share categories or tags with the current post, THE Related_Posts_Widget SHALL display the most recently published posts
7. THE Related_Posts_Widget SHALL exclude the current post from the list
8. THE Related_Posts_Widget SHALL display posts in order of relevance (most related first) or by publish date (most recent first)

### Requirement 8: Database Schema for Comments

**User Story:** As a developer, I want a properly structured database schema for storing blog comments, so that comments can be persisted, retrieved, and moderated effectively.

#### Acceptance Criteria

1. THE Database SHALL include a Comment_Model with the following fields: id (UUID), postId (UUID), name (string), email (string), content (text), createdAt (timestamp), approved (boolean)
2. THE Comment_Model SHALL establish a foreign key relationship between postId and the Post model's id field
3. THE Comment_Model id field SHALL be a UUID and SHALL serve as the primary key
4. THE Comment_Model postId field SHALL reference the Post model to link comments to specific blog posts
5. THE Comment_Model name field SHALL store the commenter's name with a maximum length of 255 characters
6. THE Comment_Model email field SHALL store the commenter's email with a maximum length of 255 characters
7. THE Comment_Model content field SHALL store the comment text without a maximum length restriction
8. THE Comment_Model createdAt field SHALL automatically store the timestamp when the comment is created
9. THE Comment_Model approved field SHALL default to false and indicate whether the comment has been approved for public display
10. THE Database SHALL create an index on the postId field for efficient comment retrieval by blog post

### Requirement 9: Comment Moderation

**User Story:** As an administrator, I want comments to require approval before being publicly displayed, so that I can prevent spam and inappropriate content from appearing on the blog.

#### Acceptance Criteria

1. WHEN a user submits a comment via the Comment_Form, THE Comment_System SHALL store the comment with approved set to false
2. WHEN displaying comments on the Blog_Detail_Page, THE Comment_System SHALL only retrieve and display comments where approved is true
3. THE Comment_System SHALL show a confirmation message to the user after submission indicating "Your comment has been submitted and will appear after review"
4. THE Comment_System SHALL NOT display pending (unapproved) comments to regular blog readers
5. An administrator interface for approving comments is outside the scope of this requirement but SHALL be implemented in a future phase

### Requirement 10: Relative Timestamp Calculation

**User Story:** As a blog reader, I want to see how long ago comments were posted in natural language, so that I can quickly understand the recency and context of the discussion.

#### Acceptance Criteria

1. WHEN displaying a comment's createdAt timestamp, THE Comment_System SHALL calculate the time difference between the current time and createdAt
2. IF the time difference is less than 1 minute, THE Comment_Display SHALL show "just now"
3. IF the time difference is less than 1 hour, THE Comment_Display SHALL show "{n} minutes ago" where {n} is the number of minutes
4. IF the time difference is less than 24 hours, THE Comment_Display SHALL show "{n} hours ago" where {n} is the number of hours
5. IF the time difference is less than 7 days, THE Comment_Display SHALL show "{n} days ago" where {n} is the number of days
6. IF the time difference is 7 days or more, THE Comment_Display SHALL show the formatted date in "Month Day, Year" format (e.g., "January 15, 2024")
7. THE Comment_System SHALL update relative timestamps dynamically if the comment display remains visible over time (client-side calculation)

### Requirement 11: Responsive Social Icon Layout

**User Story:** As a mobile user, I want social media icons and sharing buttons to be appropriately sized and laid out on my device, so that I can easily tap them without accidentally clicking adjacent icons.

#### Acceptance Criteria

1. WHEN the Sidebar is displayed on mobile devices, THE Social_Follow_Widget icons SHALL be sized at least 44x44 pixels for touch accessibility
2. WHEN the Sidebar is displayed on mobile devices, THE Social_Share_Widget icons SHALL be sized at least 44x44 pixels for touch accessibility
3. THE Social_Follow_Widget and Social_Share_Widget SHALL maintain adequate spacing between icons (minimum 8px) to prevent mis-taps
4. WHEN the viewport width is less than 640px, THE icon layouts SHALL stack or wrap appropriately to fit the screen width
5. THE icons SHALL maintain their circular shape and hover effects across all device sizes

### Requirement 12: Accessibility for Comment System

**User Story:** As a user with assistive technology, I want the comment system to be fully accessible, so that I can read comments and submit my own comments using screen readers or keyboard navigation.

#### Acceptance Criteria

1. THE Comment_Form SHALL include proper label elements associated with each input field (name, email, content)
2. THE Comment_Form required fields SHALL be indicated with both visual markers (asterisk) and aria-required="true" attributes
3. WHEN a comment submission fails validation, THE Comment_System SHALL display error messages that are announced to screen readers
4. THE Comment_Display Avatar SHALL include an aria-label describing the commenter's name
5. THE Social_Follow_Widget and Social_Share_Widget icons SHALL include descriptive aria-label attributes (e.g., "Share on Facebook", "Follow us on Twitter")
6. THE Comment_Form submit button SHALL be keyboard accessible and activate on Enter key press
7. WHEN the Comment_Form is successfully submitted, THE success message SHALL be announced to screen readers using aria-live regions

