'use client'

import { useState, useRef, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import SlugField from '@/components/admin/editor/SlugField'
import SeoFields from '@/components/admin/editor/SeoFields'
import StatusSelector from '@/components/admin/editor/StatusSelector'
import CoverImageUploader from '@/components/admin/editor/CoverImageUploader'
import ImagePickerModal from '@/components/admin/editor/ImagePickerModal'
import { generateSlug } from '@/lib/slug'
import { savePost } from './actions'

// Lazy load the rich text editor (heavy dependency)
const RichTextEditor = dynamic(
  () => import('@/components/admin/editor/RichTextEditor'),
  { ssr: false }
)

type Category = { id: string; name: string }
type Tag = { id: string; name: string }

interface PostEditorProps {
  post?: {
    id: string
    title: string
    slug: string
    content: string
    excerpt: string | null
    coverImage: string | null
    seoTitle: string | null
    seoDescription: string | null
    status: string
    scheduledAt: Date | null
    categories: Category[]
    tags: Tag[]
  }
  allCategories: Category[]
  allTags: Tag[]
  siteUrl: string
  authorName: string
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'unsaved' | 'error'

export default function PostEditor({
  post,
  allCategories,
  allTags,
  siteUrl,
  authorName,
}: PostEditorProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showMediaPicker, setShowMediaPicker] = useState(false)

  const [title, setTitle] = useState(post?.title ?? '')
  const [slug, setSlug] = useState(post?.slug ?? '')
  const [content, setContent] = useState(post?.content ?? '')
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? '')
  const [seoTitle, setSeoTitle] = useState(post?.seoTitle ?? '')
  const [seoDescription, setSeoDescription] = useState(post?.seoDescription ?? '')
  const [status, setStatus] = useState(post?.status ?? 'DRAFT')
  const [scheduledAt, setScheduledAt] = useState<string | null>(
    post?.scheduledAt ? new Date(post.scheduledAt).toISOString().slice(0, 16) : null
  )
  const [categoryIds, setCategoryIds] = useState<string[]>(
    post?.categories.map((c) => c.id) ?? []
  )
  const [tagIds, setTagIds] = useState<string[]>(post?.tags.map((t) => t.id) ?? [])
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? '')
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [postId, setPostId] = useState(post?.id)

  // Auto-generate slug from title (only when creating a new post and slug hasn't been manually set)
  const slugManuallySet = useRef(!!post?.id)

  function handleTitleChange(val: string) {
    setTitle(val)
    if (!slugManuallySet.current) {
      setSlug(generateSlug(val))
    }
  }

  function handleSlugChange(val: string) {
    slugManuallySet.current = true
    setSlug(val)
  }

  // Auto-save DRAFT every 30 seconds
  const autoSaveRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function scheduleAutoSave() {
    if (!title) return
    setSaveStatus('unsaved')
    if (autoSaveRef.current) clearTimeout(autoSaveRef.current)
    autoSaveRef.current = setTimeout(() => {
      if (status === 'DRAFT') {
        void doSave(true)
      }
    }, 30000)
  }

  async function doSave(isAutoSave = false) {
    setSaveStatus('saving')
    const result = await savePost({
      id: postId,
      title,
      slug,
      content,
      excerpt: excerpt || null,
      coverImage: coverImage || null,
      seoTitle: seoTitle || null,
      seoDescription: seoDescription || null,
      status: isAutoSave ? 'DRAFT' : status,
      scheduledAt,
      categoryIds,
      tagIds,
    })
    if (result.success) {
      setPostId(result.data.id)
      setSaveStatus('saved')
      if (!isAutoSave) {
        router.push('/admin/blog')
      }
    } else {
      setSaveStatus('error')
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(() => {
      void doSave(false)
    })
  }

  const saveLabel = {
    idle: 'Save',
    saving: 'Saving…',
    saved: 'Saved ✓',
    unsaved: 'Save',
    error: 'Retry',
  }[saveStatus]

  return (
    <>
      <form
        onSubmit={handleSubmit}
        onChange={scheduleAutoSave}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Main content — 2/3 */}
        <div className="lg:col-span-2 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              placeholder="Post title"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-[#1F99ED]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <SlugField value={slug} onChange={handleSlugChange} postId={postId} siteUrl={siteUrl} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <RichTextEditor content={content} onChange={setContent} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              placeholder="Brief summary (optional)"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1F99ED]"
            />
          </div>

          <SeoFields
            seoTitle={seoTitle}
            seoDescription={seoDescription}
            onChangeSeoTitle={setSeoTitle}
            onChangeSeoDescription={setSeoDescription}
          />
        </div>

        {/* Sidebar — 1/3 */}
        <div className="space-y-5">
          {/* Save / Status bar */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">
                {saveStatus === 'saving'
                  ? 'Saving…'
                  : saveStatus === 'saved'
                    ? 'All changes saved'
                    : saveStatus === 'unsaved'
                      ? 'Unsaved changes'
                      : saveStatus === 'error'
                        ? 'Save failed'
                        : ''}
              </span>
              <span className="text-xs text-gray-400">by {authorName}</span>
            </div>
            <StatusSelector
              status={status}
              scheduledAt={scheduledAt}
              onChangeStatus={setStatus}
              onChangeScheduledAt={setScheduledAt}
            />
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#1F99ED] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#1a87d4] disabled:opacity-60 transition-colors"
            >
              {saveLabel}
            </button>
          </div>

          {/* Cover Image */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Cover Image</h3>
            <CoverImageUploader
              value={coverImage}
              onChange={setCoverImage}
              onOpenMediaLibrary={() => setShowMediaPicker(true)}
            />
          </div>

          {/* Categories */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Categories</h3>
            <div className="space-y-1.5">
              {allCategories.map((cat) => (
                <label key={cat.id} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={categoryIds.includes(cat.id)}
                    onChange={(e) =>
                      setCategoryIds(
                        e.target.checked
                          ? [...categoryIds, cat.id]
                          : categoryIds.filter((id) => id !== cat.id)
                      )
                    }
                    className="rounded border-gray-300 text-[#1F99ED] focus:ring-[#1F99ED]"
                  />
                  {cat.name}
                </label>
              ))}
              {allCategories.length === 0 && (
                <p className="text-xs text-gray-400">No categories yet.</p>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() =>
                    setTagIds(
                      tagIds.includes(tag.id)
                        ? tagIds.filter((id) => id !== tag.id)
                        : [...tagIds, tag.id]
                    )
                  }
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                    tagIds.includes(tag.id)
                      ? 'bg-[#1F99ED] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag.name}
                </button>
              ))}
              {allTags.length === 0 && <p className="text-xs text-gray-400">No tags yet.</p>}
            </div>
          </div>
        </div>
      </form>

      <ImagePickerModal
        open={showMediaPicker}
        onClose={() => setShowMediaPicker(false)}
        onSelect={(url) => {
          setCoverImage(url)
          setShowMediaPicker(false)
        }}
      />
    </>
  )
}