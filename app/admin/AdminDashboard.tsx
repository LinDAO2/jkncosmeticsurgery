'use client'

import { useState, useEffect } from 'react'
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

type NotifEmail = { id: string; email: string }

function EmailRoutingView() {
  const [emails, setEmails] = useState<NotifEmail[]>([])
  const [newEmail, setNewEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  async function load() {
    setFetching(true)
    const res = await fetch('/api/admin/email-routing')
    const data = await res.json()
    setEmails(data.emails ?? [])
    setFetching(false)
  }

  useEffect(() => { load() }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await fetch('/api/admin/email-routing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: newEmail }),
    })
    const data = await res.json()
    if (res.ok) { setNewEmail(''); await load() }
    else { setError(data.error || 'Failed to add email') }
    setLoading(false)
  }

  async function handleRemove(id: string) {
    await fetch('/api/admin/email-routing', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    await load()
  }

  return (
    <div>
      <div className="admin-header">
        <div>
          <span className="admin-header-label">Settings</span>
          <h1 className="admin-header-title">Email Routing</h1>
        </div>
      </div>

      <div style={{ maxWidth: 540, padding: '0 40px' }}>
        <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 12, color: '#888', marginBottom: 28, lineHeight: 1.7 }}>
          New patient inquiries will be forwarded to every email address listed here.
          If none are set, the default address on file will be used.
        </p>

        {fetching ? (
          <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 12, color: '#aaa' }}>Loading…</p>
        ) : emails.length === 0 ? (
          <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 12, color: '#aaa', marginBottom: 28 }}>No addresses added yet.</p>
        ) : (
          <div style={{ marginBottom: 28, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {emails.map(e => (
              <div key={e.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '0.5px solid #e5e5e5', padding: '10px 14px' }}>
                <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 13, color: '#3d3530' }}>{e.email}</span>
                <button
                  onClick={() => handleRemove(e.id)}
                  style={{ background: 'none', border: 'none', fontFamily: 'Montserrat, sans-serif', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#aaa', cursor: 'pointer' }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <label style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888' }}>Add Email Address</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="email"
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              placeholder="doctor@example.com"
              required
              style={{ flex: 1, border: '0.5px solid #ddd', padding: '10px 12px', fontFamily: 'Montserrat, sans-serif', fontSize: 13 }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{ background: '#1c1917', color: '#fff', border: 'none', padding: '10px 20px', fontFamily: 'Montserrat, sans-serif', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              {loading ? '…' : 'Add'}
            </button>
          </div>
          {error && <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 12, color: '#c00' }}>{error}</p>}
        </form>
      </div>
    </div>
  )
}

type Testimonial = { id: string; quote: string; attribution: string; display_order: number }

function ReviewsView() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [fetching, setFetching] = useState(true)
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [quote, setQuote] = useState('')
  const [procedure, setProcedure] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function load() {
    setFetching(true)
    const res = await fetch('/api/admin/testimonials')
    const data = await res.json()
    setTestimonials(data.testimonials ?? [])
    setFetching(false)
  }

  useEffect(() => { load() }, [])

  function openAdd() { setQuote(''); setProcedure(''); setEditing(null); setShowAdd(true); setError('') }
  function openEdit(t: Testimonial) { setQuote(t.quote); setProcedure(t.attribution.replace(/^Patient\s*[—-]\s*/i, '')); setEditing(t); setShowAdd(false); setError('') }
  function cancel() { setShowAdd(false); setEditing(null); setError('') }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)
    const maxOrder = testimonials.length ? Math.max(...testimonials.map(t => t.display_order)) : 0

    const attribution = `Patient — ${procedure.trim()}`
    const res = editing
      ? await fetch(`/api/admin/testimonials/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ quote, attribution, display_order: editing.display_order }) })
      : await fetch('/api/admin/testimonials', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ quote, attribution, display_order: maxOrder + 1 }) })

    if (res.ok) { cancel(); await load() }
    else { const d = await res.json(); setError(d.error || 'Failed to save') }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' })
    await load()
  }

  const s = { fontFamily: 'Montserrat, sans-serif' }

  return (
    <div>
      <div className="admin-header">
        <div>
          <span className="admin-header-label">Content</span>
          <h1 className="admin-header-title">Reviews</h1>
        </div>
        <button onClick={openAdd} style={{ ...s, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', background: '#1c1917', color: '#fff', border: 'none', padding: '10px 20px', cursor: 'pointer' }}>
          + Add Review
        </button>
      </div>

      <div style={{ maxWidth: 680, padding: '0 40px' }}>
        {(showAdd || editing) && (
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 36, padding: 24, border: '0.5px solid #e5e5e5' }}>
            <p style={{ ...s, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', margin: 0 }}>{editing ? 'Edit Review' : 'New Review'}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ ...s, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888' }}>Review</label>
              <textarea value={quote} onChange={e => setQuote(e.target.value)} required rows={4} style={{ border: '0.5px solid #ddd', padding: '10px 12px', ...s, fontSize: 13, resize: 'vertical' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ ...s, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888' }}>Procedure</label>
              <div style={{ display: 'flex', alignItems: 'center', border: '0.5px solid #ddd' }}>
                <span style={{ ...s, fontSize: 13, color: '#aaa', padding: '10px 12px', borderRight: '0.5px solid #ddd', whiteSpace: 'nowrap' }}>Patient —</span>
                <input value={procedure} onChange={e => setProcedure(e.target.value)} required placeholder="Deep Plane Face and Neck Lift" style={{ border: 'none', padding: '10px 12px', ...s, fontSize: 13, flex: 1, outline: 'none' }} />
              </div>
            </div>
            {error && <p style={{ ...s, fontSize: 12, color: '#c00', margin: 0 }}>{error}</p>}
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" disabled={saving} style={{ background: '#1c1917', color: '#fff', border: 'none', padding: '10px 20px', ...s, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer' }}>
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button type="button" onClick={cancel} style={{ background: 'none', border: '0.5px solid #ddd', padding: '10px 20px', ...s, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer', color: '#888' }}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {fetching ? (
          <p style={{ ...s, fontSize: 12, color: '#aaa' }}>Loading…</p>
        ) : testimonials.length === 0 ? (
          <p style={{ ...s, fontSize: 12, color: '#aaa' }}>No reviews yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {testimonials.map(t => (
              <div key={t.id} style={{ border: '0.5px solid #e5e5e5', padding: '16px 20px' }}>
                <p style={{ ...s, fontSize: 13, color: '#3d3530', lineHeight: 1.6, marginBottom: 8 }}>"{t.quote}"</p>
                <p style={{ ...s, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa', marginBottom: 12 }}>{t.attribution}</p>
                <div style={{ display: 'flex', gap: 16 }}>
                  <button onClick={() => openEdit(t)} style={{ background: 'none', border: 'none', ...s, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#3d3530', cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => handleDelete(t.id)} style={{ background: 'none', border: 'none', ...s, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#aaa', cursor: 'pointer' }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
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

type View = 'inquiries' | 'reviews' | 'email-routing'

export default function AdminDashboard({ inquiries }: { inquiries: Inquiry[] }) {
  const [view, setView] = useState<View>('inquiries')
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
          <span className={`admin-nav-item${view === 'inquiries' ? ' active' : ''}`} onClick={() => setView('inquiries')}>Inquiries</span>
          <span className={`admin-nav-item${view === 'reviews' ? ' active' : ''}`} onClick={() => setView('reviews')}>Reviews</span>
          <span className={`admin-nav-item${view === 'email-routing' ? ' active' : ''}`} onClick={() => setView('email-routing')}>Email Routing</span>
        </div>
        <button className="admin-change-password-btn" onClick={() => setShowChangePassword(true)}>Change Password</button>
        <button className="admin-logout-btn" onClick={handleLogout}>Sign Out</button>
      </aside>

      {showChangePassword && <ChangePasswordModal onClose={() => setShowChangePassword(false)} />}

      <main className="admin-main">
        {view === 'email-routing' ? (
          <EmailRoutingView />
        ) : view === 'reviews' ? (
          <ReviewsView />
        ) : (
<>
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
          </>
        )}
      </main>
    </div>
  )
}
