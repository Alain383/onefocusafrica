'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { mediaFirstImage, parseMediaBlock } from '@onefocus/shared/media'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import MediaField from '@/components/admin/editor/MediaField'
import { deletePartner, savePartner } from './actions'

type PartnerRow = {
  id: string
  name: string
  logo: string | null
  website: string | null
  sortOrder: number
  isActive: boolean
  updatedAt: Date
}

type Draft = {
  id?: string
  name: string
  logo: string
  website: string
  sortOrder: number
  isActive: boolean
}

const emptyDraft: Draft = {
  name: '',
  logo: '',
  website: '',
  sortOrder: 0,
  isActive: true,
}

const field =
  'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F99ED]'

export default function ClientLogosClient({ items }: { items: PartnerRow[] }) {
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

  function openEdit(item: PartnerRow) {
    setDraft({
      id: item.id,
      name: item.name,
      logo: item.logo ?? '',
      website: item.website ?? '',
      sortOrder: item.sortOrder,
      isActive: item.isActive,
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
      const result = await savePartner({
        id: draft.id,
        name: draft.name,
        logo: draft.logo,
        website: draft.website.trim() || null,
        sortOrder: draft.sortOrder,
        isActive: draft.isActive,
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
      const result = await deletePartner(deleteId)
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
          Add logo
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Logo</th>
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
                  No client logos yet. Add one to show it on the home page.
                </td>
              </tr>
            )}
            {items.map((item) => {
              const imageUrl = mediaFirstImage(parseMediaBlock(item.logo, '', item.name))
              return (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {imageUrl ? (
                      <div className="flex h-14 w-28 items-center justify-center rounded-md border border-gray-100 bg-white p-2">
                        <Image
                          src={imageUrl}
                          alt={item.name}
                          width={112}
                          height={40}
                          unoptimized
                          className="max-h-10 max-w-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="flex h-14 w-28 items-center justify-center rounded-md bg-gray-100 text-[10px] text-gray-400">
                        No logo
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{item.name}</div>
                    {item.website && (
                      <a
                        href={item.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-0.5 block max-w-xl truncate text-xs text-[#1F99ED] hover:underline"
                      >
                        {item.website}
                      </a>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{item.sortOrder}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        item.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {item.isActive ? 'Visible' : 'Hidden'}
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
                  {draft.id ? 'Edit client logo' : 'Add client logo'}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Use a simple logo image. Upload it or choose from Uploaded files.
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
                <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
                <input
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  maxLength={255}
                  required
                  className={field}
                  placeholder="Client or organisation name"
                />
              </div>

              <MediaField
                value={draft.logo}
                onChange={(logo) => setDraft({ ...draft, logo })}
                label="Logo image"
                types={['image']}
              />

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Website (optional)</label>
                <input
                  type="url"
                  value={draft.website}
                  onChange={(e) => setDraft({ ...draft, website: e.target.value })}
                  className={field}
                  placeholder="https://example.com"
                />
              </div>

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
                    checked={draft.isActive}
                    onChange={(e) => setDraft({ ...draft, isActive: e.target.checked })}
                    className="rounded border-gray-300 text-[#1F99ED] focus:ring-[#1F99ED]"
                  />
                  Show on the home page
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
                  disabled={isPending || !draft.name.trim() || !draft.logo.trim()}
                  className="rounded-lg bg-[#1F99ED] px-5 py-2 text-sm font-medium text-white hover:bg-[#1a87d4] disabled:opacity-60"
                >
                  {isPending ? 'Saving…' : 'Save logo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete client logo"
        message="Permanently remove this logo from the home page?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={isPending}
      />
    </div>
  )
}
