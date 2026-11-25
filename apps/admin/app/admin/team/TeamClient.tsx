'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { createAdminUser, deleteAdminUser } from './actions'

type AdminUser = { id: string; name: string; email: string; role: string; isActive: boolean; lastLoginAt: Date | null }

interface Props {
  adminUsers: AdminUser[]
  currentUserId: string
}

export default function TeamClient({ adminUsers, currentUserId }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null)
  const [showNewAdmin, setShowNewAdmin] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newRole, setNewRole] = useState<'ADMIN' | 'EDITOR'>('EDITOR')

  async function handleCreateAdmin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const res = await createAdminUser({ name: newName, email: newEmail, password: newPassword, role: newRole })
    if (res.success) {
      setShowNewAdmin(false)
      setNewName('')
      setNewEmail('')
      setNewPassword('')
      router.refresh()
    } else {
      setError(res.error)
    }
  }

  function handleDeleteUser() {
    if (!deleteUserId) return
    startTransition(async () => {
      const res = await deleteAdminUser(deleteUserId)
      if (!res.success) setError(res.error)
      setDeleteUserId(null)
      router.refresh()
    })
  }

  return (
    <div className="space-y-8">
      {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</div>}

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Admin users</h2>
          <button onClick={() => setShowNewAdmin(!showNewAdmin)} className="bg-[#1F99ED] text-white px-3 py-1.5 rounded-lg text-sm">
            {showNewAdmin ? 'Cancel' : 'Add User'}
          </button>
        </div>

        {showNewAdmin && (
          <form onSubmit={handleCreateAdmin} className="bg-white rounded-xl border border-gray-200 p-5 mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Name" required
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F99ED]" />
            <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="Email" required
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F99ED]" />
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Password (min 8)" required minLength={8}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F99ED]" />
            <select value={newRole} onChange={e => setNewRole(e.target.value as 'ADMIN' | 'EDITOR')}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F99ED]">
              <option value="EDITOR">Editor</option><option value="ADMIN">Admin</option>
            </select>
            <button type="submit" className="sm:col-span-2 bg-[#1F99ED] text-white py-2 rounded-lg text-sm font-medium">Add User</button>
          </form>
        )}

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Email</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Role</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Active</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {adminUsers.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                  <td className="px-4 py-3 text-gray-600">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>{u.role}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{u.isActive ? 'Active' : 'Inactive'}</td>
                  <td className="px-4 py-3">
                    {u.id !== currentUserId && (
                      <button onClick={() => setDeleteUserId(u.id)} className="text-red-500 hover:underline text-xs">Delete</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <ConfirmDialog open={deleteUserId !== null} title="Delete Admin User" message="Permanently delete this admin user?" onConfirm={handleDeleteUser} onCancel={() => setDeleteUserId(null)} loading={isPending} />
    </div>
  )
}
