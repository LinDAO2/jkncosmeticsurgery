'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (next !== confirm) { setError('Passwords do not match'); return }
    if (next.length < 8) { setError('Password must be at least 8 characters'); return }
    setLoading(true)
    const res = await fetch('/api/admin/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: current, newPassword: next }),
    })
    const data = await res.json()
    if (res.ok) { setDone(true) }
    else { setError(data.error || 'Something went wrong'); setLoading(false) }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', padding: '40px', borderRadius: '2px', width: '100%', maxWidth: '400px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#888' }}>✕</button>
        <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 14, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 24 }}>Change Password</h2>
        {done ? (
          <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 13, color: '#3d3530' }}>Password updated successfully.</p>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888' }}>Current Password</label>
              <input type="password" value={current} onChange={e => setCurrent(e.target.value)} required style={{ border: '0.5px solid #ddd', padding: '10px 12px', fontFamily: 'Montserrat, sans-serif', fontSize: 13 }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888' }}>New Password</label>
              <input type="password" value={next} onChange={e => setNext(e.target.value)} required style={{ border: '0.5px solid #ddd', padding: '10px 12px', fontFamily: 'Montserrat, sans-serif', fontSize: 13 }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888' }}>Confirm New Password</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required style={{ border: '0.5px solid #ddd', padding: '10px 12px', fontFamily: 'Montserrat, sans-serif', fontSize: 13 }} />
            </div>
            {error && <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 12, color: '#c00' }}>{error}</p>}
            <button type="submit" disabled={loading} style={{ background: '#1c1917', color: '#fff', border: 'none', padding: '12px', fontFamily: 'Montserrat, sans-serif', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer' }}>
              {loading ? 'Saving…' : 'Update Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

type Inquiry = {
  id: number
  created_at: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  procedure_interest?: string
  message?: string
}

export default function AdminDashboard({ inquiries }: { inquiries: Inquiry[] }) {
  const [selected, setSelected] = useState<Inquiry | null>(null)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    })
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <span className="admin-sidebar-logo">JKN</span>
          <span className="admin-sidebar-sub">Practice Portal</span>
        </div>
        <div className="admin-nav">
          <span className="admin-nav-item active">Inquiries</span>
        </div>
        <button className="admin-change-password-btn" onClick={() => setShowChangePassword(true)}>Change Password</button>
        <button className="admin-logout-btn" onClick={handleLogout}>Sign Out</button>
      </aside>

      {showChangePassword && <ChangePasswordModal onClose={() => setShowChangePassword(false)} />}

      <main className="admin-main">
        <div className="admin-header">
          <div>
            <span className="admin-header-label">Inquiries</span>
            <h1 className="admin-header-title">Patient Inquiries</h1>
          </div>
          <span className="admin-header-count">{inquiries.length} total</span>
        </div>

        {inquiries.length === 0 ? (
          <div className="admin-empty">No inquiries yet.</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Procedure</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inq) => (
                  <tr key={inq.id} className={selected?.id === inq.id ? 'selected' : ''}>
                    <td>{inq.first_name} {inq.last_name}</td>
                    <td><a href={`mailto:${inq.email}`}>{inq.email}</a></td>
                    <td>{inq.phone ?? '—'}</td>
                    <td>{inq.procedure_interest ?? '—'}</td>
                    <td>{formatDate(inq.created_at)}</td>
                    <td>
                      <button
                        className="admin-view-btn"
                        onClick={() => setSelected(selected?.id === inq.id ? null : inq)}
                      >
                        {selected?.id === inq.id ? 'Close' : 'View'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selected && (
          <div className="admin-detail">
            <div className="admin-detail-header">
              <h2 className="admin-detail-name">{selected.first_name} {selected.last_name}</h2>
              <button className="admin-detail-close" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="admin-detail-grid">
              <div className="admin-detail-row">
                <span className="admin-detail-label">Email</span>
                <a className="admin-detail-value" href={`mailto:${selected.email}`}>{selected.email}</a>
              </div>
              {selected.phone && (
                <div className="admin-detail-row">
                  <span className="admin-detail-label">Phone</span>
                  <a className="admin-detail-value" href={`tel:${selected.phone}`}>{selected.phone}</a>
                </div>
              )}
              {selected.procedure_interest && (
                <div className="admin-detail-row">
                  <span className="admin-detail-label">Procedure</span>
                  <span className="admin-detail-value">{selected.procedure_interest}</span>
                </div>
              )}
              <div className="admin-detail-row">
                <span className="admin-detail-label">Submitted</span>
                <span className="admin-detail-value">{formatDate(selected.created_at)}</span>
              </div>
              {selected.message && (
                <div className="admin-detail-row" style={{ flexDirection: 'column', gap: '8px' }}>
                  <span className="admin-detail-label">Message</span>
                  <p className="admin-detail-message">{selected.message}</p>
                </div>
              )}
            </div>
            <a className="admin-reply-btn" href={`mailto:${selected.email}?subject=Re: Your JKN Cosmetic Surgery Enquiry`}>
              Reply by Email →
            </a>
          </div>
        )}
      </main>
    </div>
  )
}
