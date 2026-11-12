'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import ProgramForm from './ProgramForm'
import { deleteProgram } from './actions'

type Program = {
  id: string
  title: string
  description: string
  icon: string | null
  status: string
  urlAnchor: string | null
}

interface Props {
  programs: Program[]
}

export default function ProgramsClient({ programs }: Props) {
  const router = useRouter()
  const [showNew, setShowNew] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!deleteId) return
    startTransition(async () => {
      await deleteProgram(deleteId)
      setDeleteId(null)
      router.refresh()
    })
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex justify-end">
        <button
          onClick={() => { setShowNew(!showNew); setEditId(null) }}
          className="bg-[#1F99ED] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1a87d4] transition-colors"
        >
          {showNew ? 'Cancel' : 'Add Program'}
        </button>
      </div>

      {/* New program form */}
      {showNew && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">New Program</h2>
          <ProgramForm
            onDone={() => {
              setShowNew(false)
              router.refresh()
            }}
          />
        </div>
      )}

      {/* Programs table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Icon</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Title</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">URL Anchor</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {programs.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-400">
                  No programs yet. Add one above.
                </td>
              </tr>
            )}
            {programs.map(prog => (
              <tr key={prog.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-xl">{prog.icon || '—'}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{prog.title}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      prog.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {prog.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">{prog.urlAnchor || '—'}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setEditId(editId === prog.id ? null : prog.id)
                        setShowNew(false)
                      }}
                      className="text-[#1F99ED] hover:underline text-xs font-medium"
                    >
                      {editId === prog.id ? 'Cancel' : 'Edit'}
                    </button>
                    <button
                      onClick={() => setDeleteId(prog.id)}
                      className="text-red-500 hover:underline text-xs font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit form */}
      {editId && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Edit Program</h2>
          <ProgramForm
            program={programs.find(p => p.id === editId)}
            onDone={() => {
              setEditId(null)
              router.refresh()
            }}
          />
        </div>
      )}

      {/* Delete confirm */}
      <ConfirmDialog
        open={deleteId !== null}
        title="Delete Program"
        message="This will permanently delete the program. This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={isPending}
      />
    </div>
  )
}
