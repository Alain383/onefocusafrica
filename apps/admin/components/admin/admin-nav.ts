import type { AdminIconName } from './AdminIcon'

export type AdminRole = 'ADMIN' | 'EDITOR'

export interface AdminNavChild {
  label: string
  description: string
  href: string
  icon: AdminIconName
  roles: AdminRole[]
}

export interface AdminNavParent {
  id: string
  label: string
  icon: AdminIconName
  children: AdminNavChild[]
}

export const ADMIN_NAV_PARENTS: AdminNavParent[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: 'dashboard',
    children: [
      {
        label: 'Dashboard',
        description: 'Counts and recent activity',
        href: '/admin',
        icon: 'dashboard',
        roles: ['ADMIN', 'EDITOR'],
      },
    ],
  },
  {
    id: 'content',
    label: 'Content studio',
    icon: 'text',
    children: [
      {
        label: 'Page text',
        description: 'Headings, buttons and lists',
        href: '/admin/content',
        icon: 'text',
        roles: ['ADMIN'],
      },
      {
        label: 'Site images',
        description: 'Photos, video and slideshows',
        href: '/admin/cms',
        icon: 'image',
        roles: ['ADMIN'],
      },
      {
        label: 'Uploaded files',
        description: 'Shared asset library',
        href: '/admin/media',
        icon: 'upload',
        roles: ['ADMIN', 'EDITOR'],
      },
      {
        label: 'Blog posts',
        description: 'Articles and drafts',
        href: '/admin/blog',
        icon: 'blog',
        roles: ['ADMIN', 'EDITOR'],
      },
      {
        label: 'Blog categories & tags',
        description: 'Filters above the articles',
        href: '/admin/blog/categories',
        icon: 'folder',
        roles: ['ADMIN', 'EDITOR'],
      },
      {
        label: 'Case studies',
        description: 'Proof shown at /work',
        href: '/admin/case-studies',
        icon: 'case',
        roles: ['ADMIN', 'EDITOR'],
      },
      {
        label: 'Gallery',
        description: 'Images shown at /gallery',
        href: '/admin/gallery',
        icon: 'image',
        roles: ['ADMIN'],
      },
      {
        label: 'Client logos',
        description: 'Logos shown on the home page',
        href: '/admin/client-logos',
        icon: 'image',
        roles: ['ADMIN'],
      },
    ],
  },
  {
    id: 'inbox',
    label: 'Inbox',
    icon: 'inbox',
    children: [
      {
        label: 'Contact form submissions',
        description: 'Messages from the website',
        href: '/admin/inquiries',
        icon: 'inbox',
        roles: ['ADMIN', 'EDITOR'],
      },
    ],
  },
  {
    id: 'access',
    label: 'Access',
    icon: 'users',
    children: [
      {
        label: 'Admin users & access',
        description: 'Who can sign in',
        href: '/admin/team',
        icon: 'users',
        roles: ['ADMIN'],
      },
    ],
  },
]
