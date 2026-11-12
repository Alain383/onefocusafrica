'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { createAdminUser, deleteAdminUser, saveTeamMember, deleteTeamMember } from './actions'

type AdminUser = { id: string; name: string; email: string; role: string; isActive: boolean; lastLoginAt: Date | null }
type TeamMember = { id: string; name: string; roleTitle: string; bio: string | null; photo: string | null; sortOrder: number; isActive: boolean }

interface Props { adminUsers: AdminUser[]; teamMembers: TeamMember[]; currentUserId: string }

export default function TeamClient({ adminUsers, teamMembers, currentUserId }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null)
  const [deleteMemberId, setDeleteMemberId] = useState<string | null>(null)

  // New admin user form state
  const [showNewAdmin, setShowNewAdmin] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newRole, setNewRole] = useState<'ADMIN' | 'EDITOR'>('EDITOR')

  // New team member form state
  const [showNewMember, setShowNewMember] = useState(false)
  const [memberName, setMemberName] = useState('')
  const [memberRole, setMemberRole] = useState('')
  const [memberBio, setMemberBio] = useState('')
  const [memberPhoto, setMemberPhoto] = useState('')

  async function handleCreateAdmin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const res = await createAdminUser({ name: newName, email: newEmail, password: newPassword, role: newRole })
    if (res.success) { setShowNewAdmin(false); setNewName(''); setNewEmail(''); setNewPassword(''); router.refresh() }
    else setError(res.error)
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

  async function handleCreateMember(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const res = await saveTeamMember({ name: memberName, roleTitle: memberRole, bio: memberBio || null, photo: memberPhoto || null })
    if (res.success) { setShowNewMember(false); setMemberName(''); setMemberRole(''); setMemberBio(''); setMemberPhoto(''); router.refresh() }
    else setError(res.error)
  }

  function handleDeleteMember() {
    if (!deleteMemberId) return
    startTransition(async () => {
      const res = await deleteTeamMember(deleteMemberId)
      if (!res.success) setError(res.error)
      setDeleteMemberId(null)
      router.refresh()
    })
  }

  return (
    <div className="space-y-8">
      {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</div>}

      {/* Admin Users */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Admin Users</h2>
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
                  <td className="px-4 py-3 text-gray-500">{u.isActive ? '✓' : '—'}</td>
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

      {/* Team Members */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
          <button onClick={() => setShowNewMember(!showNewMember)} className="bg-[#1F99ED] text-white px-3 py-1.5 rounded-lg text-sm">
            {showNewMember ? 'Cancel' : 'Add Member'}
          </button>
        </div>

        {showNewMember && (
          <form onSubmit={handleCreateMember} className="bg-white rounded-xl border border-gray-200 p-5 mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input value={memberName} onChange={e => setMemberName(e.target.value)} placeholder="Full name" required
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F99ED]" />
            <input value={memberRole} onChange={e => setMemberRole(e.target.value)} placeholder="Job title" required
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F99ED]" />
            <input value={memberPhoto} onChange={e => setMemberPhoto(e.target.value)} placeholder="Photo URL"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F99ED]" />
            <textarea value={memberBio} onChange={e => setMemberBio(e.target.value)} placeholder="Bio" rows={2}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1F99ED]" />
            <button type="submit" className="sm:col-span-2 bg-[#1F99ED] text-white py-2 rounded-lg text-sm font-medium">Add Member</button>
          </form>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {teamMembers.length === 0 && <p className="text-sm text-gray-400 col-span-3">No team members yet.</p>}
          {teamMembers.map(m => (
            <div key={m.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                {m.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.photo} alt={m.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#1F99ED] flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {m.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">{m.name}</p>
                  <p className="text-xs text-gray-500">{m.roleTitle}</p>
                </div>
              </div>
              <button onClick={() => setDeleteMemberId(m.id)} className="text-red-500 hover:underline text-xs flex-shrink-0">Delete</button>
            </div>
          ))}
        </div>
      </section>

      <ConfirmDialog open={deleteUserId !== null} title="Delete Admin User" message="Permanently delete this admin user?" onConfirm={handleDeleteUser} onCancel={() => setDeleteUserId(null)} loading={isPending} />
      <ConfirmDialog open={deleteMemberId !== null} title="Delete Team Member" message="Permanently delete this team member?" onConfirm={handleDeleteMember} onCancel={() => setDeleteMemberId(null)} loading={isPending} />
    </div>
  )
}
