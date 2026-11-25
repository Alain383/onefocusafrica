'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { deleteCaseStudy } from './actions'

type Row = {
  id: string
  title: string
  slug: string
  category: string
  isPublished: boolean
  updatedAt: Date
}

export default function CaseStudiesClient({ studies }: { studies: Row[] }) {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!deleteId) return
    startTransition(async () => {
      const result = await deleteCaseStudy(deleteId)
      if (!result.success) window.alert(result.error)
      setDeleteId(null)
      router.refresh()
    })
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Title</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Category</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Updated</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {studies.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-12 text-gray-400">
                  No case studies yet. Add one to show proof on /work.
                </td>
              </tr>
            )}
            {studies.map((study) => (
              <tr key={study.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{study.title}</td>
                <td className="px-4 py-3 text-gray-600">{study.category}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${study.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {study.isPublished ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">{new Date(study.updatedAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <Link href={`/admin/case-studies/${study.id}/edit`} className="text-[#1F99ED] hover:underline text-xs">Edit</Link>
                    {study.isPublished && (
                      <Link href={`/work/${study.slug}`} target="_blank" className="text-[#2E3192] hover:underline text-xs">View</Link>
                    )}
                    <button onClick={() => setDeleteId(study.id)} className="text-red-500 hover:underline text-xs">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete case study"
        message="Permanently delete this case study?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={isPending}
      />
    </>
  )
}
