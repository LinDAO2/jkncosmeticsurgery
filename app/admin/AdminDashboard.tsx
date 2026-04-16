'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

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
        <button className="admin-logout-btn" onClick={handleLogout}>Sign Out</button>
      </aside>

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
