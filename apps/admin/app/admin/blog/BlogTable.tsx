'use client'

import Link from 'next/link'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useState, useTransition } from 'react'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import DateDisplay from '@/components/admin/DateDisplay'
import { deletePost } from './actions'

type Post = {
  id: string
  title: string
  status: string
  createdAt: Date
  author: { name: string }
  categories: { name: string }[]
}

interface BlogTableProps {
  posts: Post[]
  total: number
  page: number
  pageSize: number
}

const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-600',
  REVIEW: 'bg-yellow-100 text-yellow-700',
  SCHEDULED: 'bg-blue-100 text-blue-700',
  PUBLISHED: 'bg-green-100 text-green-700',
}

export default function BlogTable({ posts, total, page, pageSize }: BlogTableProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const totalPages = Math.ceil(total / pageSize)

  function goToPage(p: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(p))
    router.push(`${pathname}?${params.toString()}`)
  }

  function handleDelete() {
    if (!deleteId) return
    startTransition(async () => {
      await deletePost(deleteId)
      setDeleteId(null)
      router.refresh()
    })
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Title</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Author</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Categories</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">No posts found.</td></tr>
              )}
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900 max-w-[220px] truncate">{post.title}</td>
                  <td className="px-4 py-3 text-gray-600">{post.author.name}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[post.status] ?? ''}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{post.categories.map(c => c.name).join(', ') || '—'}</td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    <DateDisplay date={post.createdAt} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/blog/${post.id}/edit`} className="text-[#1F99ED] hover:underline text-xs">Edit</Link>
                      <button onClick={() => setDeleteId(post.id)} className="text-red-500 hover:underline text-xs">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t text-sm text-gray-600">
            <span>Page {page} of {totalPages} ({total} total)</span>
            <div className="flex gap-2">
              <button onClick={() => goToPage(page - 1)} disabled={page <= 1} className="px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-40">Previous</button>
              <button onClick={() => goToPage(page + 1)} disabled={page >= totalPages} className="px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-40">Next</button>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete Post"
        message="Are you sure you want to permanently delete this post? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={isPending}
      />
    </>
  )
}
