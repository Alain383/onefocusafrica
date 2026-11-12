'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createCategory, updateCategory, deleteCategory, createTag } from './actions'

type Category = { id: string; name: string; slug: string }
type Tag = { id: string; name: string; slug: string }

interface Props {
  categories: Category[]
  tags: Tag[]
}

export default function CategoriesClient({ categories: initialCategories, tags: initialTags }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [newCategoryName, setNewCategoryName] = useState('')
  const [newTagName, setNewTagName] = useState('')
  const [editId, setEditId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [error, setError] = useState<string | null>(null)

  function refresh() { router.refresh() }

  async function handleCreateCategory() {
    setError(null)
    const result = await createCategory({ name: newCategoryName })
    if (result.success) { setNewCategoryName(''); refresh() }
    else setError(result.error ?? 'Failed to create category')
  }

  async function handleUpdateCategory() {
    if (!editId) return
    setError(null)
    const result = await updateCategory(editId, { name: editName })
    if (result.success) { setEditId(null); setEditName(''); refresh() }
    else setError(result.error ?? 'Failed to update category')
  }

  function handleDeleteCategory(id: string) {
    startTransition(async () => {
      setError(null)
      const result = await deleteCategory(id)
      if (!result.success) setError(result.error ?? 'Failed to delete category')
      else refresh()
    })
  }

  async function handleCreateTag() {
    setError(null)
    const result = await createTag({ name: newTagName })
    if (result.success) { setNewTagName(''); refresh() }
    else setError(result.error ?? 'Failed to create tag')
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {error && (
        <div className="col-span-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* Categories */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Categories</h2>

        <div className="flex gap-2 mb-4">
          <input
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="New category name"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F99ED]"
            onKeyDown={(e) => e.key === 'Enter' && handleCreateCategory()}
          />
          <button
            onClick={handleCreateCategory}
            disabled={!newCategoryName.trim() || isPending}
            className="bg-[#1F99ED] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#1a87d4] disabled:opacity-50"
          >
            Add
          </button>
        </div>

        <ul className="space-y-2">
          {initialCategories.map((cat) => (
            <li key={cat.id} className="flex items-center gap-2">
              {editId === cat.id ? (
                <>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                    onKeyDown={(e) => e.key === 'Enter' && handleUpdateCategory()}
                    autoFocus
                  />
                  <button onClick={handleUpdateCategory} className="text-xs text-green-600 hover:underline">Save</button>
                  <button onClick={() => setEditId(null)} className="text-xs text-gray-400 hover:underline">Cancel</button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm text-gray-800">{cat.name}</span>
                  <button
                    onClick={() => { setEditId(cat.id); setEditName(cat.name) }}
                    className="text-xs text-[#1F99ED] hover:underline"
                  >
                    Rename
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    disabled={isPending}
                    className="text-xs text-red-500 hover:underline disabled:opacity-50"
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
          {initialCategories.length === 0 && (
            <li className="text-sm text-gray-400">No categories yet.</li>
          )}
        </ul>
      </div>

      {/* Tags */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Tags</h2>

        <div className="flex gap-2 mb-4">
          <input
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="New tag name"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F99ED]"
            onKeyDown={(e) => e.key === 'Enter' && handleCreateTag()}
          />
          <button
            onClick={handleCreateTag}
            disabled={!newTagName.trim() || isPending}
            className="bg-[#1F99ED] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#1a87d4] disabled:opacity-50"
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {initialTags.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
            >
              {tag.name}
            </span>
          ))}
          {initialTags.length === 0 && (
            <span className="text-sm text-gray-400">No tags yet.</span>
          )}
        </div>
      </div>
    </div>
  )
}
