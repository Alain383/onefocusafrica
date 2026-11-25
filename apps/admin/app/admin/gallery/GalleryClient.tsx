'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { mediaFirstImage, parseMediaBlock } from '@onefocus/shared/media'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import MediaField from '@/components/admin/editor/MediaField'
import { deleteGalleryItem, saveGalleryItem } from './actions'

type GalleryRow = {
  id: string
  title: string | null
  description: string | null
  image: string
  sortOrder: number
  isPublished: boolean
  updatedAt: Date
}

type Draft = {
  id?: string
  title: string
  description: string
  image: string
  sortOrder: number
  isPublished: boolean
}

const emptyDraft: Draft = {
  title: '',
  description: '',
  image: '',
  sortOrder: 0,
  isPublished: true,
}

const field =
  'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F99ED]'

export default function GalleryClient({ items }: { items: GalleryRow[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [creating, setCreating] = useState(false)
  const [draft, setDraft] = useState<Draft>(emptyDraft)
  const [error, setError] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  function openCreate() {
    setDraft(emptyDraft)
    setError(null)
    setCreating(true)
  }

  function openEdit(item: GalleryRow) {
    setDraft({
      id: item.id,
      title: item.title ?? '',
      description: item.description ?? '',
      image: item.image,
      sortOrder: item.sortOrder,
      isPublished: item.isPublished,
    })
    setError(null)
    setCreating(true)
  }

  function closeForm() {
    setCreating(false)
    setDraft(emptyDraft)
    setError(null)
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await saveGalleryItem({
        id: draft.id,
        title: draft.title || null,
        description: draft.description || null,
        image: draft.image,
        sortOrder: draft.sortOrder,
        isPublished: draft.isPublished,
      })
      if (result.success) {
        closeForm()
        router.refresh()
      } else {
        setError(result.error)
      }
    })
  }

  function handleDelete() {
    if (!deleteId) return
    startTransition(async () => {
      const result = await deleteGalleryItem(deleteId)
      if (!result.success) window.alert(result.error)
      setDeleteId(null)
      router.refresh()
    })
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={openCreate}
          className="rounded-lg bg-[#1F99ED] px-4 py-2 text-sm font-medium text-white hover:bg-[#1a87d4] disabled:opacity-60"
        >
          Add image
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Image</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Details</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Order</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-gray-400">
                  No gallery images yet. Add one to show it on /gallery.
                </td>
              </tr>
            )}
            {items.map((item) => {
              const imageUrl = mediaFirstImage(parseMediaBlock(item.image, '', ''))
              return (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={item.title ?? ''}
                        width={80}
                        height={56}
                        unoptimized
                        className="h-14 w-20 rounded-md object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-20 items-center justify-center rounded-md bg-gray-100 text-[10px] text-gray-400">
                        No image
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{item.title || 'Untitled image'}</div>
                    {item.description && (
                      <div className="mt-0.5 line-clamp-2 max-w-xl text-xs text-gray-500">
                        {item.description}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{item.sortOrder}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        item.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {item.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => openEdit(item)}
                        className="text-xs text-[#1F99ED] hover:underline"
                      >
                        Edit
                      </button>
                      {item.isPublished && (
                        <a href="/gallery" target="_blank" rel="noopener noreferrer" className="text-xs text-[#2E3192] hover:underline">
                          View
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => setDeleteId(item.id)}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {creating && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-8 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {draft.id ? 'Edit gallery image' : 'Add gallery image'}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Upload from your device or choose from Uploaded files.
                </p>
              </div>
              <button type="button" onClick={closeForm} className="text-sm text-gray-500 hover:text-gray-700">
                Close
              </button>
            </div>

            <form onSubmit={submit} className="space-y-4">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Title (optional)</label>
                <input
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  maxLength={255}
                  className={field}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Description (optional)</label>
                <textarea
                  value={draft.description}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                  rows={3}
                  className={field}
                />
              </div>

              <MediaField
                value={draft.image}
                onChange={(image) => setDraft({ ...draft, image })}
                label="Image"
                types={['image']}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Order</label>
                  <input
                    type="number"
                    min={0}
                    max={9999}
                    value={draft.sortOrder}
                    onChange={(e) => setDraft({ ...draft, sortOrder: Number(e.target.value) || 0 })}
                    className={field}
                  />
                </div>
                <label className="flex items-end gap-2 pb-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={draft.isPublished}
                    onChange={(e) => setDraft({ ...draft, isPublished: e.target.checked })}
                    className="rounded border-gray-300 text-[#1F99ED] focus:ring-[#1F99ED]"
                  />
                  Show on the public gallery
                </label>
              </div>

              <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending || !draft.image.trim()}
                  className="rounded-lg bg-[#1F99ED] px-5 py-2 text-sm font-medium text-white hover:bg-[#1a87d4] disabled:opacity-60"
                >
                  {isPending ? 'Saving…' : 'Save image'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete gallery image"
        message="Permanently remove this image from the gallery?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={isPending}
      />
    </div>
  )
}
