# Contributing to ONEFOCUS AFRICA Website

## Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/onefocus-africa.git`
3. Install dependencies: `npm install`
4. Set up environment variables (see QUICKSTART.md)
5. Create a branch: `git checkout -b feature/your-feature-name`

## Code Standards

### TypeScript
- Use TypeScript for all new files
- Define proper types/interfaces
- Avoid `any` types

### React Components
- Use functional components with hooks
- Keep components small and focused
- Use proper prop types
- Add JSDoc comments for complex logic

### Styling
- Use Tailwind CSS utility classes
- Follow existing design system
- Maintain responsive design
- Keep accessibility in mind

### File Naming
- Components: PascalCase (e.g., `Button.tsx`)
- Utilities: camelCase (e.g., `formatDate.ts`)
- Pages: kebab-case for URLs, lowercase for files

## Git Workflow

### Commit Messages
Follow conventional commits:
```
feat: add new contact form validation
fix: resolve mobile menu not closing
docs: update deployment guide
style: format pricing card spacing
refactor: simplify email sending logic
test: add inquiry form tests
```

### Pull Requests
1. Update from main: `git pull origin main`
2. Test your changes thoroughly
3. Run linter: `npm run lint`
4. Build successfully: `npm run build`
5. Write clear PR description
6. Link related issues

## Testing

### Manual Testing Checklist
- [ ] Test on mobile, tablet, desktop
- [ ] Test all form submissions
- [ ] Verify email notifications (if SMTP configured)
- [ ] Check all navigation links
- [ ] Test with slow 3G connection
- [ ] Run Lighthouse audit (aim for 90+ scores)

### Browser Testing
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile Safari (iOS)
- Mobile Chrome (Android)

## Content Guidelines

### Writing Style
- Clear, concise, professional
- Active voice over passive
- Short paragraphs
- Scannable content

### Images
- Optimize before adding (use WebP format)
- Add alt text for accessibility
- Use descriptive file names
- Store in `public/images/`

### Case Studies
- Always get client permission
- Use real, verifiable data
- Include measurable outcomes
- Provide context and challenge

## Security

### What to Check
- Never commit `.env` files
- Validate all user inputs
- Sanitize data before database storage
- Use parameterized queries (Prisma handles this)
- Keep dependencies updated

### Reporting Security Issues
Email security concerns to: onefocusafrica@gmail.com

## Database Changes

### Schema Changes
1. Update `prisma/schema.prisma`
2. Create migration: `npx prisma migrate dev --name your_migration_name`
3. Test migration locally
4. Include migration in PR

### Data Seeding
- Add seed scripts to `prisma/seed.ts` (if needed)
- Document any required seed data

## Documentation

### Update Documentation When:
- Adding new features
- Changing configuration
- Updating dependencies
- Modifying deployment process

### Documentation Files
- `README.md` - Project overview
- `QUICKSTART.md` - Getting started
- `DEPLOYMENT.md` - Deployment guide
- `CONTRIBUTING.md` - This file

## Performance

### Best Practices
- Use Next.js Image component for images
- Lazy load heavy components
- Minimize bundle size
- Implement proper caching
- Optimize database queries

## Accessibility

### Requirements
- WCAG 2.1 Level AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Proper heading hierarchy
- Sufficient color contrast
- Focus indicators

## Need Help?

- Read existing code for patterns
- Check documentation files
- Ask questions in PR comments
- Email: onefocusafrica@gmail.com

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.
