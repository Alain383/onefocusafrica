'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import TiptapImage from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect, useState } from 'react'
import ImagePickerModal from './ImagePickerModal'

interface RichTextEditorProps {
  content: string
  onChange: (html: string) => void
  placeholder?: string
}

type Editor = NonNullable<ReturnType<typeof useEditor>>

function ToolbarButton({
  onClick,
  active,
  label,
  children,
}: {
  onClick: () => void
  active?: boolean
  label: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={`p-1.5 rounded text-sm transition-colors ${
        active ? 'bg-[#1F99ED] text-white' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  )
}

function Toolbar({ editor, onInsertImage }: { editor: Editor; onInsertImage: () => void }) {
  function setLink() {
    const url = window.prompt('URL', editor.getAttributes('link').href ?? '')
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-gray-200 bg-gray-50">
      <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} label="Heading 2">H2</ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} label="Heading 3">H3</ToolbarButton>
      <span className="w-px h-5 bg-gray-300 mx-1" aria-hidden="true" />
      <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} label="Bold"><strong>B</strong></ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} label="Italic"><em>I</em></ToolbarButton>
      <span className="w-px h-5 bg-gray-300 mx-1" aria-hidden="true" />
      <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} label="Bullet List">• List</ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} label="Ordered List">1. List</ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} label="Blockquote">❝</ToolbarButton>
      <ToolbarButton onClick={setLink} active={editor.isActive('link')} label="Link">🔗</ToolbarButton>
      <ToolbarButton onClick={onInsertImage} label="Insert Image">🖼️</ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} label="Inline Code">`code`</ToolbarButton>
      <span className="w-px h-5 bg-gray-300 mx-1" aria-hidden="true" />
      <ToolbarButton onClick={() => editor.chain().focus().undo().run()} label="Undo">↩</ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().redo().run()} label="Redo">↪</ToolbarButton>
    </div>
  )
}

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const [showImagePicker, setShowImagePicker] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer' } }),
      TiptapImage.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto',
        },
      }),
      Placeholder.configure({ placeholder: placeholder ?? 'Write your article here…' }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  // Sync external content changes (e.g., load existing post)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, { emitUpdate: false })
    }
  }, [content, editor])

  function handleImageSelect(url: string) {
    if (editor) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  if (!editor) return null

  return (
    <>
      <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#1F99ED] focus-within:border-transparent">
        <Toolbar editor={editor} onInsertImage={() => setShowImagePicker(true)} />
        <EditorContent
          editor={editor}
          className="min-h-[400px] px-4 py-3 prose prose-sm max-w-none focus:outline-none"
        />
      </div>

      <ImagePickerModal
        open={showImagePicker}
        onClose={() => setShowImagePicker(false)}
        onSelect={handleImageSelect}
      />
    </>
  )
}
