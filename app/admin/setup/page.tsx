'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminSetup() {
  const [masterPassword, setMasterPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (newPassword !== confirm) {
      setError('Passwords do not match')
      return
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    const res = await fetch('/api/admin/setup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ masterPassword, password: newPassword }),
    })

    const data = await res.json()
    if (res.ok) {
      setDone(true)
      setTimeout(() => router.push('/admin/login'), 2000)
    } else {
      setError(data.error || 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-box">
        <div className="admin-login-brand">
          <span className="admin-login-logo">JKN</span>
          <span className="admin-login-sub">Practice Portal — Setup</span>
        </div>

        {done ? (
          <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 13, color: '#3d3530', textAlign: 'center', marginTop: 24 }}>
            Password set successfully. Redirecting to login…
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="admin-login-field">
              <label className="admin-login-label">Master Password</label>
              <input
                className="admin-login-input"
                type="password"
                value={masterPassword}
                onChange={(e) => setMasterPassword(e.target.value)}
                placeholder="Current master password"
                required
              />
            </div>
            <div className="admin-login-field">
              <label className="admin-login-label">New Password</label>
              <input
                className="admin-login-input"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
              />
            </div>
            <div className="admin-login-field">
              <label className="admin-login-label">Confirm New Password</label>
              <input
                className="admin-login-input"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat new password"
                required
              />
            </div>
            {error && <p className="admin-login-error">{error}</p>}
            <button className="admin-login-btn" type="submit" disabled={loading}>
              {loading ? 'Saving…' : 'Set Password →'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
