import type { AdminIconName } from './AdminIcon'
import type { AdminRole } from './admin-nav'

export interface AdminQuickAction {
  label: string
  description: string
  href: string
  icon: AdminIconName
  roles: AdminRole[]
}

export const ADMIN_QUICK_ACTIONS: AdminQuickAction[] = [
  {
    label: 'Write a post',
    description: 'Draft or publish an article',
    href: '/admin/blog/new',
    icon: 'blog',
    roles: ['ADMIN', 'EDITOR'],
  },
  {
    label: 'Add case study',
    description: 'Publish verified proof',
    href: '/admin/case-studies/new',
    icon: 'case',
    roles: ['ADMIN', 'EDITOR'],
  },
  {
    label: 'Review messages',
    description: 'Check new inquiries',
    href: '/admin/inquiries',
    icon: 'inbox',
    roles: ['ADMIN', 'EDITOR'],
  },
  {
    label: 'Update page text',
    description: 'Headings and buttons',
    href: '/admin/content',
    icon: 'text',
    roles: ['ADMIN'],
  },
  {
    label: 'Manage gallery',
    description: 'Add images and captions',
    href: '/admin/gallery',
    icon: 'image',
    roles: ['ADMIN'],
  },
  {
    label: 'Add client logo',
    description: 'Show trusted teams on home',
    href: '/admin/client-logos',
    icon: 'image',
    roles: ['ADMIN'],
  },
]
