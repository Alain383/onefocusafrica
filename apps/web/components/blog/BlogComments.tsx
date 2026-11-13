'use client'

import { useState } from 'react'

interface Comment {
  id: string
  name: string
  email: string
  content: string
  createdAt: Date
}

interface BlogCommentsProps {
  postId: string
  postSlug: string
}

export default function BlogComments({ postId, postSlug }: BlogCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      // TODO: Replace with actual API endpoint
      // const response = await fetch('/api/comments', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ postSlug, name, email, content }),
      // })
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setMessage({ type: 'success', text: 'Thank you! Your comment has been submitted and will appear after review.' })
      setName('')
      setEmail('')
      setContent('')
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to submit comment. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-xl p-6 lg:p-8 shadow-sm border border-gray-100">
      <h3 className="text-2xl font-bold text-[#0F172A] mb-6">Leave a Comment</h3>
      
      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F99ED] focus:border-transparent transition-all"
              placeholder="Your name"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F99ED] focus:border-transparent transition-all"
              placeholder="your@email.com"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Comment <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={5}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F99ED] focus:border-transparent transition-all resize-none"
            placeholder="Share your thoughts..."
          />
        </div>

        {message && (
          <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full md:w-auto px-8 py-3 bg-[#1F99ED] text-white font-semibold rounded-lg hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Post Comment'}
        </button>
      </form>

      {/* Comments List */}
      {comments.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-gray-200">
          <h4 className="text-xl font-bold text-[#0F172A]">
            {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
          </h4>
          {comments.map((comment) => (
            <div key={comment.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-[#1F99ED] text-white flex items-center justify-center font-bold">
                  {comment.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{comment.name}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
