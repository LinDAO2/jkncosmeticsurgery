'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
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
  const [otherProcedure, setOtherProcedure] = useState('')
  const [saving, setSaving] = useState(false)
  const [misspelled, setMisspelled] = useState<{ word: string; suggestions: string[] }[]>([])
  const spellTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const checkSpelling = useCallback((text: string) => {
    if (spellTimer.current) clearTimeout(spellTimer.current)
    if (!text.trim()) { setMisspelled([]); return }
    spellTimer.current = setTimeout(async () => {
      const res = await fetch('/api/admin/spellcheck', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) })
      const data = await res.json()
      setMisspelled(data.misspelled ?? [])
    }, 600)
  }, [])

  const PROCEDURES = [
    'Deep Plane Face and Neck Lift',
    'Mid Facelift',
    'Eyelid Rejuvenation',
    'Lip Lifting',
    'Facial Contouring',
    'Hair Restoration',
    'Skin Cancer Reconstruction',
    'Comprehensive Rejuvenation',
    'Other',
  ]
  const [error, setError] = useState('')

  async function load() {
    setFetching(true)
    const res = await fetch('/api/admin/testimonials')
    const data = await res.json()
    setTestimonials(data.testimonials ?? [])
    setFetching(false)
  }

  useEffect(() => { load() }, [])

  function toTitleCase(str: string) { return str.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1)) }

  function openAdd() { setQuote(''); setProcedure(''); setOtherProcedure(''); setEditing(null); setShowAdd(true); setError('') }
  function openEdit(t: Testimonial) {
    const proc = t.attribution.replace(/^Patient\s*[—-]\s*/i, '')
    const isKnown = PROCEDURES.slice(0, -1).includes(proc)
    setQuote(t.quote)
    setProcedure(isKnown ? proc : 'Other')
    setOtherProcedure(isKnown ? '' : proc)
    setEditing(t)
    setShowAdd(false)
    setError('')
  }
  function cancel() { setShowAdd(false); setEditing(null); setError(''); setMisspelled([]) }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (quote.length > 272) { setError('Review must be 272 characters or fewer.'); return }
    setSaving(true)
    const maxOrder = testimonials.length ? Math.max(...testimonials.map(t => t.display_order)) : 0

    const finalQuote = quote.trim().charAt(0).toUpperCase() + quote.trim().slice(1)
    const finalProc = procedure === 'Other' ? otherProcedure.trim().toUpperCase() : procedure.toUpperCase()
    const attribution = `Patient — ${finalProc}`
    const res = editing
      ? await fetch(`/api/admin/testimonials/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ quote: finalQuote, attribution, display_order: editing.display_order }) })
      : await fetch('/api/admin/testimonials', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ quote: finalQuote, attribution, display_order: maxOrder + 1 }) })

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
              <textarea value={quote} onChange={e => { setQuote(e.target.value); checkSpelling(e.target.value) }} required rows={4} spellCheck={false} style={{ border: `0.5px solid ${quote.length > 272 ? '#c00' : '#ddd'}`, padding: '10px 12px', ...s, fontSize: 13, resize: 'vertical' }} />
              {misspelled.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4 }}>
                  {misspelled.map(({ word, suggestions }) => (
                    <div key={word} style={{ ...s, fontSize: 11, color: '#c00' }}>
                      <span style={{ textDecoration: 'underline wavy #c00' }}>{word}</span>
                      {suggestions.length > 0 && <span style={{ color: '#888' }}> → {suggestions.join(', ')}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ ...s, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888' }}>Procedure</label>
              <div style={{ display: 'flex', alignItems: 'center', border: '0.5px solid #ddd' }}>
                <span style={{ ...s, fontSize: 13, color: '#aaa', padding: '10px 12px', borderRight: '0.5px solid #ddd', whiteSpace: 'nowrap' }}>Patient —</span>
                <select value={procedure} onChange={e => { setProcedure(e.target.value); setOtherProcedure('') }} required style={{ border: 'none', padding: '10px 12px', ...s, fontSize: 13, flex: 1, outline: 'none', background: 'transparent', color: procedure ? '#0a0a0a' : '#aaa', appearance: 'none' }}>
                  <option value="" disabled>Select a procedure</option>
                  {PROCEDURES.map(p => <option key={p} value={p}>{p.toUpperCase()}</option>)}
                </select>
              </div>
              {procedure === 'Other' && (
                <input value={otherProcedure} onChange={e => setOtherProcedure(e.target.value)} required placeholder="Enter procedure name" style={{ border: '0.5px solid #ddd', padding: '10px 12px', ...s, fontSize: 13, outline: 'none' }} />
              )}
            </div>
            {error && <p style={{ ...s, fontSize: 12, color: '#c00', margin: 0 }}>{error}</p>}
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" disabled={saving || quote.length > 272} style={{ background: quote.length > 272 ? '#ccc' : '#1c1917', color: '#fff', border: 'none', padding: '10px 20px', ...s, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', cursor: quote.length > 272 ? 'not-allowed' : 'pointer' }}>
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button type="button" onClick={cancel} style={{ background: 'none', border: '0.5px solid #ddd', padding: '10px 20px', ...s, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer', color: '#888' }}>
                Cancel
              </button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <span style={{ ...s, fontSize: 10, color: quote.length > 272 ? '#c00' : '#aaa' }}>
                {quote.length > 272 ? `${quote.length - 272} over limit` : `${quote.length}/272`}
              </span>
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
                <p style={{ ...s, fontSize: 13, color: '#3d3530', lineHeight: 1.6, marginBottom: 8 }}>{t.quote}</p>
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

function CaseDetailView({ c, onBack, onUpdated }: { c: DbCase; onBack: () => void; onUpdated: () => Promise<void> }) {
  const s = { fontFamily: 'Montserrat, sans-serif' }
  const [procs, setProcs] = useState(c.procedures)
  const [links, setLinks] = useState(c.instagram_videos)
  const [images, setImages] = useState(c.images)
  const [savingMeta, setSavingMeta] = useState(false)
  const [metaSaved, setMetaSaved] = useState(false)
  const [addingPhotos, setAddingPhotos] = useState(false)
  const [draggedImgIdx, setDraggedImgIdx] = useState<number | null>(null)
  const [dragOverImgIdx, setDragOverImgIdx] = useState<number | null>(null)
  const [coverImage, setCoverImageState] = useState(c.cover_image)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setImages(c.images)
    setCoverImageState(c.cover_image)
  }, [c.images, c.cover_image])

  async function saveMeta() {
    setSavingMeta(true)
    setMetaSaved(false)
    await fetch(`/api/admin/cases/${c.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ procedures: procs.filter(Boolean), instagram_videos: links.filter(l => l.url.trim()) }),
    })
    setSavingMeta(false)
    setMetaSaved(true)
    setTimeout(() => setMetaSaved(false), 2000)
    await onUpdated()
  }

  async function handleImgDrop(targetIdx: number) {
    if (draggedImgIdx === null || draggedImgIdx === targetIdx) return
    const imgs = [...images]
    const [moved] = imgs.splice(draggedImgIdx, 1)
    imgs.splice(targetIdx, 0, moved)
    setImages(imgs)
    setDraggedImgIdx(null)
    setDragOverImgIdx(null)
    await fetch(`/api/admin/cases/${c.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ images: imgs }),
    })
    await onUpdated()
  }

  async function setCover(url: string) {
    setCoverImageState(url)
    await fetch(`/api/admin/cases/${c.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cover_image: url }),
    })
    await onUpdated()
  }

  async function deleteImage(url: string) {
    if (!confirm('Delete this photo?')) return
    await fetch(`/api/admin/cases/${c.id}/images`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    })
    const next = images.filter(i => i !== url)
    setImages(next)
    if (coverImage === url) setCoverImageState(next[0] ?? null)
    await onUpdated()
  }

  async function addPhotos(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setAddingPhotos(true)
    for (const file of files) {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch(`/api/admin/cases/${c.id}/images`, { method: 'POST', body: fd })
      if (res.ok) {
        const { url } = await res.json()
        setImages(prev => [...prev, url])
      }
    }
    setAddingPhotos(false)
    await onUpdated()
    e.target.value = ''
  }

  return (
    <div style={{ padding: '0 40px', maxWidth: 820 }}>
      <button onClick={onBack} style={{ ...s, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer', color: '#888', marginBottom: 32, padding: 0 }}>
        ← Back to Cases
      </button>

      <div style={{ marginBottom: 32 }}>
        <span style={{ ...s, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#aaa' }}>Patient Case</span>
        <h2 style={{ ...s, fontSize: 22, fontWeight: 300, letterSpacing: '0.04em', color: '#1c1917', margin: '6px 0 0' }}>{GALLERY_LABELS[c.gallery]}</h2>
      </div>

      <div style={{ borderTop: '0.5px solid #e5e5e5', paddingTop: 28, marginBottom: 28 }}>
        <span style={{ ...s, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#aaa', display: 'block', marginBottom: 14 }}>Procedure Details</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 560 }}>
          {procs.map((p, i) => (
            <div key={i} style={{ display: 'flex', gap: 8 }}>
              <input value={p} onChange={e => { const n = [...procs]; n[i] = e.target.value; setProcs(n) }}
                style={{ border: '0.5px solid #ddd', padding: '9px 12px', ...s, fontSize: 13, flex: 1, outline: 'none', color: '#1c1917' }} />
              <button onClick={() => setProcs(procs.filter((_, j) => j !== i))}
                style={{ border: '0.5px solid #ddd', background: 'none', padding: '9px 12px', cursor: 'pointer', ...s, fontSize: 13, color: '#aaa' }}>✕</button>
            </div>
          ))}
          <button onClick={() => setProcs([...procs, ''])}
            style={{ ...s, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', background: 'none', border: '0.5px solid #ddd', padding: '7px 14px', cursor: 'pointer', color: '#888', alignSelf: 'flex-start', marginTop: 4 }}>
            + Add Procedure
          </button>
        </div>
      </div>

      {c.gallery !== 'skincancer' && (
        <div style={{ borderTop: '0.5px solid #e5e5e5', paddingTop: 28, marginBottom: 28 }}>
          <span style={{ ...s, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#aaa', display: 'block', marginBottom: 14 }}>Links</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 560 }}>
            {links.map((l, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 12, border: '0.5px solid #e5e5e5' }}>
                <input value={l.label} onChange={e => { const n = [...links]; n[i] = { ...n[i], label: e.target.value }; setLinks(n) }}
                  placeholder="Description (e.g. Watch patient one week post op)"
                  style={{ border: '0.5px solid #ddd', padding: '8px 12px', ...s, fontSize: 12, outline: 'none' }} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <input value={l.url} onChange={e => { const n = [...links]; n[i] = { ...n[i], url: e.target.value }; setLinks(n) }}
                    placeholder="https://www.instagram.com/reel/..."
                    style={{ border: '0.5px solid #ddd', padding: '8px 12px', ...s, fontSize: 12, flex: 1, outline: 'none' }} />
                  <button onClick={() => setLinks(links.filter((_, j) => j !== i))}
                    style={{ border: '0.5px solid #ddd', background: 'none', padding: '8px 12px', cursor: 'pointer', ...s, fontSize: 13, color: '#aaa' }}>✕</button>
                </div>
              </div>
            ))}
            <button onClick={() => setLinks([...links, { url: '', label: '' }])}
              style={{ ...s, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', background: 'none', border: '0.5px solid #ddd', padding: '7px 14px', cursor: 'pointer', color: '#888', alignSelf: 'flex-start' }}>
              + Add Link
            </button>
          </div>
        </div>
      )}

      <div style={{ marginBottom: 48 }}>
        <button onClick={saveMeta} disabled={savingMeta}
          style={{ ...s, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', background: savingMeta ? '#ccc' : '#1c1917', color: '#fff', border: 'none', padding: '11px 28px', cursor: savingMeta ? 'not-allowed' : 'pointer' }}>
          {savingMeta ? 'Saving…' : metaSaved ? 'Saved ✓' : 'Save Changes'}
        </button>
      </div>

      <div style={{ borderTop: '0.5px solid #e5e5e5', paddingTop: 32 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <span style={{ ...s, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#aaa', display: 'block' }}>Before and After</span>
            <p style={{ ...s, fontSize: 11, color: '#aaa', margin: '5px 0 0' }}>Drag to reorder · gold border = gallery cover</p>
          </div>
          <div>
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={addPhotos} style={{ display: 'none' }} />
            <button onClick={() => fileRef.current?.click()} disabled={addingPhotos}
              style={{ ...s, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', background: 'none', border: '0.5px solid #ddd', padding: '8px 16px', cursor: addingPhotos ? 'not-allowed' : 'pointer', color: '#888' }}>
              {addingPhotos ? 'Uploading…' : '+ Add Photos'}
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {images.map((url, i) => (
            <div key={url}
              draggable
              onDragStart={() => setDraggedImgIdx(i)}
              onDragOver={e => { e.preventDefault(); setDragOverImgIdx(i) }}
              onDrop={() => handleImgDrop(i)}
              onDragEnd={() => { setDraggedImgIdx(null); setDragOverImgIdx(null) }}
              style={{
                opacity: draggedImgIdx === i ? 0.35 : 1,
                outline: dragOverImgIdx === i && draggedImgIdx !== i ? '2px solid #1c1917' : url === coverImage ? '2px solid #c9a96e' : '2px solid transparent',
                transition: 'opacity 0.15s',
              }}
            >
              <div style={{ position: 'relative', paddingBottom: '125%', overflow: 'hidden', background: '#f0ede9', cursor: 'grab' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Image ${i + 1}`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', pointerEvents: 'none' }} />
                {url === coverImage && (
                  <div style={{ position: 'absolute', top: 8, left: 8, background: '#c9a96e', ...s, fontSize: 8, letterSpacing: '0.1em', color: '#fff', padding: '3px 7px', textTransform: 'uppercase' }}>Cover</div>
                )}
              </div>
              <div style={{ display: 'flex', gap: 4, marginTop: 5 }}>
                <button onClick={() => setCover(url)} disabled={url === coverImage}
                  style={{ ...s, fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', background: 'none', border: '0.5px solid #ddd', padding: '5px 8px', cursor: url === coverImage ? 'default' : 'pointer', color: url === coverImage ? '#c9a96e' : '#888', flex: 1 }}>
                  {url === coverImage ? 'Cover ✓' : 'Set Cover'}
                </button>
                <button onClick={() => deleteImage(url)}
                  style={{ ...s, fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', background: 'none', border: '0.5px solid #ddd', padding: '5px 8px', cursor: 'pointer', color: '#c00' }}>
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CasesView() {
  const s = { fontFamily: 'Montserrat, sans-serif' }
  const [gallery, setGallery] = useState<'comprehensive' | 'eyelid' | 'midfacelift' | 'skincancer'>('midfacelift')
  const [dbCases, setDbCases] = useState<DbCase[]>([])
  const [localCases, setLocalCases] = useState<DbCase[]>([])
  const [fetching, setFetching] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [procedures, setProcedures] = useState<string[]>([''])
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [links, setLinks] = useState<{ url: string; label: string }[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [editingLinksId, setEditingLinksId] = useState<string | null>(null)
  const [draftLinks, setDraftLinks] = useState<{ url: string; label: string }[]>([])
  const [savingLinks, setSavingLinks] = useState(false)
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null)

  async function load() {
    setFetching(true)
    const res = await fetch('/api/admin/cases')
    const data = await res.json()
    setDbCases(data.cases ?? [])
    setFetching(false)
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    setLocalCases(dbCases.filter(c => c.gallery === gallery).sort((a, b) => a.display_order - b.display_order))
    setEditingLinksId(null)
    setSelectedCaseId(null)
  }, [dbCases, gallery])

  function resetForm() {
    setShowAdd(false)
    setProcedures([''])
    setPendingFiles([])
    setPreviewUrls([])
    setCoverPreview(null)
    setLinks([])
    setError('')
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setPendingFiles(prev => [...prev, ...files])
    const previews = files.map(f => URL.createObjectURL(f))
    setPreviewUrls(prev => [...prev, ...previews])
    e.target.value = ''
  }

  async function handleCreate() {
    const filteredProcs = procedures.map(p => p.trim()).filter(Boolean)
    if (!filteredProcs.length) { setError('Add at least one procedure.'); return }
    setSaving(true)
    setError('')

    const maxOrder = localCases.length ? Math.max(...localCases.map(c => c.display_order)) : -10
    const res = await fetch('/api/admin/cases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gallery, procedures: filteredProcs, display_order: maxOrder + 10, instagram_videos: links.filter(l => l.url.trim()) }),
    })
    if (!res.ok) { setError('Failed to create case.'); setSaving(false); return }
    const { case: newCase } = await res.json()

    const uploadedUrls: string[] = []
    for (const file of pendingFiles) {
      const fd = new FormData()
      fd.append('file', file)
      const upRes = await fetch(`/api/admin/cases/${newCase.id}/images`, { method: 'POST', body: fd })
      if (upRes.ok) {
        const { url } = await upRes.json()
        uploadedUrls.push(url)
      }
    }

    const coverIdx = coverPreview ? previewUrls.indexOf(coverPreview) : 0
    const finalCover = uploadedUrls[coverIdx] ?? uploadedUrls[0] ?? null
    if (finalCover) {
      await fetch(`/api/admin/cases/${newCase.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cover_image: finalCover }),
      })
    }

    setSaving(false)
    resetForm()
    await load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this case and all its photos?')) return
    await fetch(`/api/admin/cases/${id}`, { method: 'DELETE' })
    await load()
  }

  function openEditLinks(c: DbCase) {
    setEditingLinksId(c.id)
    setDraftLinks(c.instagram_videos.length ? c.instagram_videos : [{ url: '', label: '' }])
  }

  async function saveLinks(id: string) {
    setSavingLinks(true)
    const filtered = draftLinks.filter(l => l.url.trim())
    await fetch(`/api/admin/cases/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ instagram_videos: filtered }),
    })
    setSavingLinks(false)
    setEditingLinksId(null)
    await load()
  }

  async function handleDrop(targetId: string) {
    if (!draggedId || draggedId === targetId) return
    const cases = [...localCases]
    const fromIdx = cases.findIndex(c => c.id === draggedId)
    const toIdx = cases.findIndex(c => c.id === targetId)
    if (fromIdx === -1 || toIdx === -1) return
    const [moved] = cases.splice(fromIdx, 1)
    cases.splice(toIdx, 0, moved)
    const updated = cases.map((c, i) => ({ ...c, display_order: i * 10 }))
    setLocalCases(updated)
    setDraggedId(null)
    setDragOverId(null)
    await Promise.all(updated.map(c =>
      fetch(`/api/admin/cases/${c.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ display_order: c.display_order }),
      })
    ))
    await load()
  }

  const selectedCase = localCases.find(c => c.id === selectedCaseId)

  if (selectedCase) {
    return (
      <div>
        <div className="admin-header">
          <div>
            <span className="admin-header-label">Content</span>
            <h1 className="admin-header-title">Cases</h1>
          </div>
        </div>
        <CaseDetailView c={selectedCase} onBack={() => setSelectedCaseId(null)} onUpdated={load} />
      </div>
    )
  }

  return (
    <div>
      <div className="admin-header">
        <div>
          <span className="admin-header-label">Content</span>
          <h1 className="admin-header-title">Cases</h1>
        </div>
        {gallery !== 'skincancer' && (
          <button
            onClick={() => { resetForm(); setShowAdd(true) }}
            style={{ ...s, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', background: '#1c1917', color: '#fff', border: 'none', padding: '10px 20px', cursor: 'pointer' }}
          >
            + Add Case
          </button>
        )}
      </div>

      <div style={{ padding: '0 40px' }}>
        <div style={{ display: 'flex', gap: 2, marginBottom: 32, flexWrap: 'wrap' }}>
          {(['midfacelift', 'comprehensive', 'eyelid', 'skincancer'] as const).map(g => (
            <button
              key={g}
              onClick={() => setGallery(g)}
              style={{ ...s, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', padding: '8px 16px', border: '0.5px solid #ddd', background: gallery === g ? '#1c1917' : '#fff', color: gallery === g ? '#fff' : '#888', cursor: 'pointer' }}
            >
              {GALLERY_LABELS[g]}
            </button>
          ))}
        </div>

        {showAdd && gallery !== 'skincancer' && (
          <div style={{ border: '0.5px solid #e5e5e5', padding: 24, marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 560 }}>
            <p style={{ ...s, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', margin: 0 }}>New Case — {GALLERY_LABELS[gallery]}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ ...s, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888' }}>Procedures</label>
              {procedures.map((p, i) => (
                <div key={i} style={{ display: 'flex', gap: 8 }}>
                  <input
                    value={p}
                    onChange={e => { const next = [...procedures]; next[i] = e.target.value; setProcedures(next) }}
                    placeholder="e.g. Deep Plane Face and Neck Lift"
                    style={{ border: '0.5px solid #ddd', padding: '8px 12px', ...s, fontSize: 13, flex: 1, outline: 'none' }}
                  />
                  {procedures.length > 1 && (
                    <button type="button" onClick={() => setProcedures(procedures.filter((_, j) => j !== i))}
                      style={{ border: '0.5px solid #ddd', background: 'none', padding: '8px 12px', cursor: 'pointer', ...s, fontSize: 13, color: '#888' }}>✕</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => setProcedures([...procedures, ''])}
                style={{ ...s, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', background: 'none', border: '0.5px solid #ddd', padding: '8px 16px', cursor: 'pointer', color: '#888', alignSelf: 'flex-start' }}>
                + Add Procedure
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ ...s, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888' }}>Photos</label>
              <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileSelect} style={{ display: 'none' }} />
              <button type="button" onClick={() => fileInputRef.current?.click()}
                style={{ ...s, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', background: 'none', border: '0.5px dashed #ddd', padding: 16, cursor: 'pointer', color: '#888' }}>
                {pendingFiles.length > 0
                  ? `${pendingFiles.length} photo${pendingFiles.length > 1 ? 's' : ''} selected — click to add more`
                  : 'Click to select photos'}
              </button>
              {previewUrls.length > 0 && (
                <div>
                  <p style={{ ...s, fontSize: 10, color: '#888', marginBottom: 8 }}>Click a photo to set it as the cover image</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {previewUrls.map((url, i) => (
                      <div key={url} onClick={() => setCoverPreview(url)}
                        style={{ position: 'relative', width: 80, height: 80, cursor: 'pointer', outline: coverPreview === url ? '2px solid #1c1917' : '2px solid transparent' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt={`Photo ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        {coverPreview === url && (
                          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(28,25,23,0.75)', ...s, fontSize: 8, letterSpacing: '0.1em', color: '#fff', textAlign: 'center', padding: 3 }}>COVER</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ ...s, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888' }}>Links (optional)</label>
              {links.map((l, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 12, border: '0.5px solid #e5e5e5' }}>
                  <input
                    value={l.label}
                    onChange={e => { const next = [...links]; next[i] = { ...next[i], label: e.target.value }; setLinks(next) }}
                    placeholder="Description (e.g. Watch patient one week post op)"
                    style={{ border: '0.5px solid #ddd', padding: '8px 12px', ...s, fontSize: 12, outline: 'none' }}
                  />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      value={l.url}
                      onChange={e => { const next = [...links]; next[i] = { ...next[i], url: e.target.value }; setLinks(next) }}
                      placeholder="https://www.instagram.com/reel/..."
                      style={{ border: '0.5px solid #ddd', padding: '8px 12px', ...s, fontSize: 12, flex: 1, outline: 'none' }}
                    />
                    <button type="button" onClick={() => setLinks(links.filter((_, j) => j !== i))}
                      style={{ border: '0.5px solid #ddd', background: 'none', padding: '8px 12px', cursor: 'pointer', ...s, fontSize: 13, color: '#888' }}>✕</button>
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => setLinks([...links, { url: '', label: '' }])}
                style={{ ...s, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', background: 'none', border: '0.5px solid #ddd', padding: '8px 16px', cursor: 'pointer', color: '#888', alignSelf: 'flex-start' }}>
                + Add Link
              </button>
            </div>

            {error && <p style={{ ...s, fontSize: 12, color: '#c00', margin: 0 }}>{error}</p>}

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={handleCreate} disabled={saving}
                style={{ ...s, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', background: saving ? '#ccc' : '#1c1917', color: '#fff', border: 'none', padding: '10px 20px', cursor: saving ? 'not-allowed' : 'pointer' }}>
                {saving ? 'Saving…' : 'Save Case'}
              </button>
              <button onClick={resetForm}
                style={{ ...s, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', background: 'none', border: '0.5px solid #ddd', padding: '10px 20px', cursor: 'pointer', color: '#888' }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {fetching ? (
          <p style={{ ...s, fontSize: 12, color: '#aaa' }}>Loading…</p>
        ) : localCases.length === 0 ? (
          <p style={{ ...s, fontSize: 12, color: '#aaa' }}>No cases yet. Add one above.</p>
        ) : (() => {
              const featuredCount = dbCases.filter(c => c.featured && c.gallery !== 'skincancer').length
              const atLimit = featuredCount >= 3
              return (
              <>
                <p style={{ ...s, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#aaa', marginBottom: 16 }}>
                  Drag to reorder · {localCases.length} case{localCases.length !== 1 ? 's' : ''} · <span style={{ color: atLimit ? '#c9a96e' : '#aaa' }}>{featuredCount}/3 featured on homepage</span>
                </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 32 }}>
              {localCases.map(c => (
                <div key={c.id}>
                  <div
                    draggable
                    onDragStart={e => { e.stopPropagation(); setDraggedId(c.id) }}
                    onDragOver={e => { e.preventDefault(); setDragOverId(c.id) }}
                    onDrop={() => handleDrop(c.id)}
                    onDragEnd={() => { setDraggedId(null); setDragOverId(null) }}
                    onClick={() => { if (!draggedId) setSelectedCaseId(c.id) }}
                    style={{
                      position: 'relative',
                      paddingBottom: '125%',
                      overflow: 'hidden',
                      background: '#f0ede9',
                      cursor: draggedId ? 'grab' : 'pointer',
                      opacity: draggedId === c.id ? 0.35 : 1,
                      outline: dragOverId === c.id && draggedId !== c.id ? '2px solid #1c1917' : '2px solid transparent',
                      transition: 'opacity 0.15s, outline 0.1s',
                    }}
                  >
                    {c.cover_image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={c.cover_image}
                        alt={c.procedures[0]}
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', pointerEvents: 'none' }}
                      />
                    )}
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)', padding: '32px 10px 10px' }}>
                      <p style={{ ...s, fontSize: 9, letterSpacing: '0.08em', color: '#fff', margin: 0, textTransform: 'uppercase' }}>{c.procedures[0]}</p>
                      {c.images.length > 1 && <p style={{ ...s, fontSize: 8, color: 'rgba(255,255,255,0.65)', margin: '2px 0 0' }}>{c.images.length} photos</p>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                    <button
                      disabled={!c.featured && atLimit && gallery !== 'skincancer'}
                      onClick={async () => {
                        if (!c.featured && atLimit && gallery !== 'skincancer') return
                        const next = !c.featured
                        await fetch(`/api/admin/cases/${c.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ featured: next }) })
                        await load()
                      }}
                      style={{ ...s, fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', background: c.featured ? '#c9a96e' : 'none', color: c.featured ? '#fff' : (!c.featured && atLimit && gallery !== 'skincancer' ? '#ccc' : '#888'), border: '0.5px solid #ddd', padding: '5px 8px', cursor: (!c.featured && atLimit && gallery !== 'skincancer') ? 'not-allowed' : 'pointer', flex: 1, opacity: (!c.featured && atLimit && gallery !== 'skincancer') ? 0.5 : 1 }}
                    >
                      {c.featured ? '★ Featured' : '☆ Feature'}
                    </button>
                    {gallery !== 'skincancer' && (
                      <button
                        onClick={() => editingLinksId === c.id ? setEditingLinksId(null) : openEditLinks(c)}
                        style={{ ...s, fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', background: editingLinksId === c.id ? '#1c1917' : 'none', color: editingLinksId === c.id ? '#fff' : '#888', border: '0.5px solid #ddd', padding: '5px 8px', cursor: 'pointer', flex: 1 }}
                      >
                        Links{c.instagram_videos.length > 0 ? ` (${c.instagram_videos.length})` : ''}
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(c.id)}
                      style={{ ...s, fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', background: 'none', border: '0.5px solid #ddd', padding: '5px 8px', cursor: 'pointer', color: '#c00', flex: gallery === 'skincancer' ? 1 : 'none' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {editingLinksId && (
              <div style={{ border: '0.5px solid #e5e5e5', padding: 20, marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 560 }}>
                <p style={{ ...s, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', margin: 0 }}>
                  Links — {localCases.find(c => c.id === editingLinksId)?.procedures[0]}
                </p>
                {draftLinks.map((l, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 12, border: '0.5px solid #e5e5e5' }}>
                    <input
                      value={l.label}
                      onChange={e => { const next = [...draftLinks]; next[i] = { ...next[i], label: e.target.value }; setDraftLinks(next) }}
                      placeholder="Description (e.g. Watch patient one week post op)"
                      style={{ border: '0.5px solid #ddd', padding: '8px 12px', ...s, fontSize: 12, outline: 'none' }}
                    />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        value={l.url}
                        onChange={e => { const next = [...draftLinks]; next[i] = { ...next[i], url: e.target.value }; setDraftLinks(next) }}
                        placeholder="https://www.instagram.com/reel/..."
                        style={{ border: '0.5px solid #ddd', padding: '8px 12px', ...s, fontSize: 12, flex: 1, outline: 'none' }}
                      />
                      <button type="button" onClick={() => setDraftLinks(draftLinks.filter((_, j) => j !== i))}
                        style={{ border: '0.5px solid #ddd', background: 'none', padding: '8px 12px', cursor: 'pointer', ...s, fontSize: 13, color: '#888' }}>✕</button>
                    </div>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <button type="button" onClick={() => setDraftLinks([...draftLinks, { url: '', label: '' }])}
                    style={{ ...s, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', background: 'none', border: '0.5px solid #ddd', padding: '6px 12px', cursor: 'pointer', color: '#888' }}>
                    + Add Link
                  </button>
                  <button type="button" onClick={() => saveLinks(editingLinksId)} disabled={savingLinks}
                    style={{ ...s, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', background: savingLinks ? '#ccc' : '#1c1917', color: '#fff', border: 'none', padding: '6px 12px', cursor: savingLinks ? 'not-allowed' : 'pointer' }}>
                    {savingLinks ? 'Saving…' : 'Save Links'}
                  </button>
                  <button type="button" onClick={() => setEditingLinksId(null)}
                    style={{ ...s, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', background: 'none', border: '0.5px solid #ddd', padding: '6px 12px', cursor: 'pointer', color: '#888' }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
              </>
              )
            })()}
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

type View = 'inquiries' | 'reviews' | 'email-routing' | 'cases' | 'services' | 'about' | 'homepage'

type DbCase = {
  id: string
  gallery: 'comprehensive' | 'eyelid' | 'midfacelift' | 'skincancer'
  procedures: string[]
  images: string[]
  cover_image: string | null
  display_order: number
  instagram_videos: { url: string; label: string }[]
  featured: boolean
}

type HiddenCase = { slug: string; gallery: string }

const GALLERY_LABELS: Record<string, string> = {
  midfacelift: 'Invisible Access Mid Facelift',
  comprehensive: 'Comprehensive Rejuvenation',
  eyelid: 'Eyelid and Brow',
  skincancer: 'Skin Cancer Reconstruction',
}

const STATIC_CASES_BY_GALLERY: Record<string, string[]> = {
  comprehensive: ['case-01','case-02','case-03','case-04','case-05','case-06','case-07','case-08','case-09'],
  eyelid: ['case-01','case-02','case-03','case-04','case-05','case-06','case-07','case-08','case-09','case-10','case-11','case-12','case-13','case-14','case-15'],
  midfacelift: ['case-01','case-02'],
  skincancer: Array.from({ length: 76 }, (_, i) => String(i + 1).padStart(2, '0')),
}

// ─── ContentEditable helper ────────────────────────────────────────────────────
function CE({ tag = 'p', className, style, value, onSave }: {
  tag?: 'p' | 'h2' | 'h1' | 'span' | 'blockquote' | 'li'
  className?: string
  style?: React.CSSProperties
  value: string
  onSave: (v: string) => void
}) {
  const ref = useRef<HTMLElement>(null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (ref.current) ref.current.innerText = value }, [])
  const Tag = tag as any
  return (
    <Tag
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      className={className}
      style={{ outline: 'none', cursor: 'text', minWidth: 20, ...style }}
      onBlur={(e: React.FocusEvent<HTMLElement>) => onSave(e.currentTarget.innerText.trim())}
    />
  )
}

// ─── Homepage editor ──────────────────────────────────────────────────────────

function HomepageView() {
  const s = { fontFamily: 'Montserrat, sans-serif' }
  const [fields, setFields] = useState<Record<string, string>>({})
  const [fetching, setFetching] = useState(true)
  const [allCases, setAllCases] = useState<DbCase[]>([])
  const [editingSection, setEditingSection] = useState<'philosophy' | 'quote' | 'contact' | null>(null)
  const [draft, setDraft] = useState<Record<string, string>>({})
  const [sectionSaving, setSectionSaving] = useState(false)
  const [draggedFeaturedId, setDraggedFeaturedId] = useState<string | null>(null)
  const [dragOverFeaturedId, setDragOverFeaturedId] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/site-content').then(r => r.json()),
      fetch('/api/admin/cases').then(r => r.json()),
    ]).then(([contentData, casesData]) => {
      const map: Record<string, string> = {}
      for (const row of contentData.content ?? []) map[`${row.section}__${row.key}`] = row.value
      setFields(map)
      setFetching(false)
      setAllCases(casesData.cases ?? [])
    })
  }, [])

  function get(section: string, key: string) { return fields[`${section}__${key}`] ?? '' }

  async function saveField(section: string, key: string, value: string) {
    setFields(f => ({ ...f, [`${section}__${key}`]: value }))
    await fetch('/api/admin/site-content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ section, key, value }) })
  }

  async function toggleFeatured(c: DbCase) {
    await fetch(`/api/admin/cases/${c.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ featured: !c.featured }) })
    const d = await fetch('/api/admin/cases').then(r => r.json())
    setAllCases(d.cases ?? [])
  }

  async function handleFeaturedDrop(targetId: string) {
    if (!draggedFeaturedId || draggedFeaturedId === targetId) { setDraggedFeaturedId(null); setDragOverFeaturedId(null); return }
    const list = [...featuredCases]
    const fromIdx = list.findIndex(c => c.id === draggedFeaturedId)
    const toIdx = list.findIndex(c => c.id === targetId)
    if (fromIdx === -1 || toIdx === -1) return
    const [moved] = list.splice(fromIdx, 1)
    list.splice(toIdx, 0, moved)
    const updated = list.map((c, i) => ({ ...c, display_order: i * 10 }))
    setAllCases(prev => {
      const nonFeat = prev.filter(c => !c.featured || c.gallery === 'skincancer')
      return [...nonFeat, ...updated]
    })
    setDraggedFeaturedId(null)
    setDragOverFeaturedId(null)
    await Promise.all(updated.map(c =>
      fetch(`/api/admin/cases/${c.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ display_order: c.display_order }) })
    ))
  }

  if (fetching) return <div style={{ padding: 40, fontFamily: 'Montserrat, sans-serif', fontSize: 12, color: '#aaa' }}>Loading…</div>

  const editBtnStyle = { fontFamily: 'Montserrat, sans-serif', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase' as const, background: 'none', border: '0.5px solid var(--jkn-divider)', padding: '6px 14px', cursor: 'pointer', color: 'var(--jkn-light)' }
  const saveBtnStyle = { fontFamily: 'Montserrat, sans-serif', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase' as const, background: '#1c1917', color: '#fff', border: 'none', padding: '7px 16px', cursor: 'pointer' }
  const cancelBtnStyle = { fontFamily: 'Montserrat, sans-serif', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase' as const, background: 'none', border: '0.5px solid rgba(255,255,255,0.3)', padding: '7px 12px', cursor: 'pointer', color: 'var(--jkn-light)' }

  const featuredCases = allCases.filter(c => c.featured && c.gallery !== 'skincancer')
  const nonFeatured = allCases.filter(c => !c.featured && c.gallery !== 'skincancer' && (c.cover_image || c.images.length > 0))

  return (
    <div>
      <div className="admin-header">
        <div><span className="admin-header-label">Content</span><h1 className="admin-header-title">Homepage</h1></div>
      </div>

      {/* Full-bleed — escape admin-main padding on sides/bottom */}
      <div style={{ margin: '0 -48px -48px' }}>

        {/* ── SELECTED CASES ─────────────────────────────────────────── */}
        <section className="cases-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span className="section-label">Selected Cases</span>
            <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: featuredCases.length >= 3 ? '#c9a96e' : '#aaa' }}>
              {featuredCases.length}/3 on homepage
            </span>
          </div>

          <div className="cases-grid">
            {/* Featured slots */}
            {featuredCases.map(c => {
              const img = c.cover_image ?? c.images[0] ?? null
              const title = GALLERY_LABELS[c.gallery] ?? c.procedures[0] ?? 'Case Study'
              return (
                <div
                  key={c.id}
                  draggable
                  onDragStart={() => setDraggedFeaturedId(c.id)}
                  onDragOver={e => { e.preventDefault(); setDragOverFeaturedId(c.id) }}
                  onDrop={() => handleFeaturedDrop(c.id)}
                  onDragEnd={() => { setDraggedFeaturedId(null); setDragOverFeaturedId(null) }}
                  style={{ position: 'relative', opacity: draggedFeaturedId === c.id ? 0.35 : 1, outline: dragOverFeaturedId === c.id && draggedFeaturedId !== c.id ? '2px solid #c9a96e' : 'none', transition: 'opacity 0.15s', cursor: 'grab' }}
                >
                  <a className="case-card wipe-revealed" href="#" onClick={e => e.preventDefault()} style={{ cursor: 'inherit' }}>
                    <div className="case-img">
                      {img
                        ? <img src={img} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', transition: 'transform 0.5s ease' }} className="case-img-inner" /> // eslint-disable-line @next/next/no-img-element
                        : <div className="case-img-placeholder" />}
                    </div>
                    <div className="case-meta">
                      <span className="case-title">{title}</span>
                      <div className="case-tags">{c.procedures.slice(0, 3).map(t => <span key={t} className="case-tag">{t}</span>)}</div>
                      <span className="case-link">View Case &nbsp;→</span>
                    </div>
                  </a>
                  <button onClick={() => toggleFeatured(c)} style={{ fontFamily: 'Montserrat, sans-serif', position: 'absolute', top: 12, left: 52, background: '#c9a96e', color: '#fff', border: 'none', padding: '5px 12px', fontSize: 8, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer' }}>
                    ★ Remove
                  </button>
                </div>
              )
            })}

            {/* Empty slots */}
            {Array.from({ length: Math.max(0, 3 - featuredCases.length) }).map((_, i) => (
              <div key={`empty-${i}`} className="case-card" style={{ cursor: 'default' }}>
                <div className="case-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
                  <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#bbb' }}>Empty slot</span>
                </div>
                <div className="case-meta" style={{ paddingTop: 16 }}>
                  <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 9, color: '#bbb', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Select a case below ↓</span>
                </div>
              </div>
            ))}
          </div>

          {/* Case picker — shown when slots are available */}
          {featuredCases.length < 3 && nonFeatured.length > 0 && (
            <div style={{ marginTop: 56, paddingTop: 40, borderTop: '0.5px solid var(--jkn-divider)' }}>
              <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 9, letterSpacing: '0.26em', textTransform: 'uppercase', color: '#aaa', display: 'block', marginBottom: 24 }}>
                Click a case to add it to the homepage
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 8 }}>
                {nonFeatured.slice(0, 30).map(c => {
                  const img = c.cover_image ?? c.images[0]
                  return (
                    <div key={c.id} onClick={() => toggleFeatured(c)} style={{ cursor: 'pointer' }}>
                      <div style={{ position: 'relative', paddingBottom: '125%', overflow: 'hidden', background: '#f0ede9' }}>
                        {img && <img src={img} alt={c.procedures[0]} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />} {/* eslint-disable-line @next/next/no-img-element */}
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)', padding: '24px 8px 8px' }}>
                          <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 8, color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1.3 }}>{c.procedures[0]?.slice(0, 24)}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </section>

        {/* ── PHILOSOPHY ─────────────────────────────────────────────── */}
        <div className="philosophy-bg">
          <div className="philosophy-inner">
            <div className="philosophy-header">
              <div className="philosophy-header-left">
                <span className="section-label">Our Approach</span>
                {editingSection === 'philosophy'
                  ? <textarea value={draft.heading ?? ''} onChange={e => setDraft(d => ({ ...d, heading: e.target.value }))} className="philosophy-heading" rows={2} style={{ background: 'transparent', border: '0.5px solid rgba(255,255,255,0.3)', outline: 'none', resize: 'vertical', width: '100%', color: 'inherit', padding: 4 }} />
                  : <h2 className="philosophy-heading">{get('philosophy', 'heading') || 'Elevation Through Precision'}</h2>}
              </div>
              <div className="philosophy-header-right">
                {editingSection === 'philosophy'
                  ? <textarea value={draft.body ?? ''} onChange={e => setDraft(d => ({ ...d, body: e.target.value }))} className="philosophy-teaser-body" rows={4} style={{ background: 'transparent', border: '0.5px solid rgba(255,255,255,0.3)', outline: 'none', resize: 'vertical', width: '100%', color: 'inherit', padding: 4 }} />
                  : <p className="philosophy-teaser-body">{get('philosophy', 'body')}</p>}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              {editingSection === 'philosophy' ? (
                <>
                  <button onClick={async () => { setSectionSaving(true); await Promise.all([saveField('philosophy', 'heading', draft.heading ?? ''), saveField('philosophy', 'body', draft.body ?? '')]); setSectionSaving(false); setEditingSection(null) }} disabled={sectionSaving} style={saveBtnStyle}>{sectionSaving ? 'Saving…' : 'Save'}</button>
                  <button onClick={() => setEditingSection(null)} style={cancelBtnStyle}>Cancel</button>
                </>
              ) : (
                <button onClick={() => { setDraft({ heading: get('philosophy', 'heading') || 'Elevation Through Precision', body: get('philosophy', 'body') }); setEditingSection('philosophy') }} style={editBtnStyle}>Edit</button>
              )}
            </div>
          </div>
        </div>

        {/* ── QUOTE ──────────────────────────────────────────────────── */}
        <section className="quote-section">
          <span className="quote-mark">&ldquo;</span>
          {editingSection === 'quote'
            ? <textarea value={draft.text ?? ''} onChange={e => setDraft(d => ({ ...d, text: e.target.value }))} className="quote-text" rows={3} style={{ background: 'transparent', border: '0.5px solid var(--jkn-divider)', outline: 'none', resize: 'vertical', width: '100%', color: 'inherit', padding: 4 }} />
            : <p className="quote-text">{get('quote', 'text')}</p>}
          {editingSection === 'quote'
            ? <textarea value={draft.attribution ?? ''} onChange={e => setDraft(d => ({ ...d, attribution: e.target.value }))} className="quote-attr" rows={1} style={{ background: 'transparent', border: '0.5px solid var(--jkn-divider)', outline: 'none', resize: 'none', width: '100%', color: 'inherit', display: 'block', marginTop: 20, padding: 4 }} />
            : <span className="quote-attr" style={{ display: 'block', marginTop: 20 }}>{get('quote', 'attribution')}</span>}
          <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
            {editingSection === 'quote' ? (
              <>
                <button onClick={async () => { setSectionSaving(true); await Promise.all([saveField('quote', 'text', draft.text ?? ''), saveField('quote', 'attribution', draft.attribution ?? '')]); setSectionSaving(false); setEditingSection(null) }} disabled={sectionSaving} style={saveBtnStyle}>{sectionSaving ? 'Saving…' : 'Save'}</button>
                <button onClick={() => setEditingSection(null)} style={cancelBtnStyle}>Cancel</button>
              </>
            ) : (
              <button onClick={() => { setDraft({ text: get('quote', 'text'), attribution: get('quote', 'attribution') }); setEditingSection('quote') }} style={editBtnStyle}>Edit</button>
            )}
          </div>
        </section>

        {/* ── CONTACT (Begin page) ────────────────────────────────────── */}
        <section className="contact-section">
          <span className="section-label">Begin</span>
          <div className="contact-grid">
            <div className="contact-left">
              <h2 className="contact-heading">Begin Your Journey</h2>
              {editingSection === 'contact' ? (
                <>
                  <textarea value={draft.body1 ?? ''} onChange={e => setDraft(d => ({ ...d, body1: e.target.value }))} className="contact-body" rows={3} style={{ background: 'transparent', border: '0.5px solid var(--jkn-divider)', outline: 'none', resize: 'vertical', width: '100%', color: 'inherit', padding: 4 }} />
                  <textarea value={draft.body2 ?? ''} onChange={e => setDraft(d => ({ ...d, body2: e.target.value }))} className="contact-body" rows={3} style={{ background: 'transparent', border: '0.5px solid var(--jkn-divider)', outline: 'none', resize: 'vertical', width: '100%', color: 'inherit', padding: 4, marginTop: 8 }} />
                </>
              ) : (
                <>
                  <p className="contact-body">{get('contact', 'body1')}</p>
                  <p className="contact-body">{get('contact', 'body2')}</p>
                </>
              )}
              <div className="contact-detail">
                <div className="contact-detail-row" style={{ borderBottom: 'none' }}>
                  <span className="contact-detail-label">Availability</span>
                  {editingSection === 'contact'
                    ? <input value={draft.availability ?? ''} onChange={e => setDraft(d => ({ ...d, availability: e.target.value }))} className="contact-detail-value" style={{ background: 'transparent', border: 'none', borderBottom: '0.5px solid var(--jkn-divider)', outline: 'none', color: 'inherit', flex: 1 }} />
                    : <span className="contact-detail-value">{get('contact', 'availability')}</span>}
                </div>
              </div>
              <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {(['instagram_handle', 'instagram_url', 'email'] as const).map(key => {
                  const labels: Record<string, string> = { instagram_handle: 'Instagram handle', instagram_url: 'Instagram URL', email: 'Email' }
                  return (
                    <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--jkn-mid)', width: 110, flexShrink: 0 }}>{labels[key]}</span>
                      {editingSection === 'contact'
                        ? <input value={draft[key] ?? ''} onChange={e => setDraft(d => ({ ...d, [key]: e.target.value }))} style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 13, color: 'var(--jkn-black)', background: 'transparent', border: 'none', borderBottom: '0.5px solid var(--jkn-divider)', outline: 'none', flex: 1 }} />
                        : <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 13, color: 'var(--jkn-black)' }}>{get('contact', key)}</span>}
                    </div>
                  )
                })}
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                {editingSection === 'contact' ? (
                  <>
                    <button onClick={async () => { setSectionSaving(true); await Promise.all(['body1','body2','availability','instagram_handle','instagram_url','email'].map(k => saveField('contact', k, draft[k] ?? ''))); setSectionSaving(false); setEditingSection(null) }} disabled={sectionSaving} style={saveBtnStyle}>{sectionSaving ? 'Saving…' : 'Save'}</button>
                    <button onClick={() => setEditingSection(null)} style={{ ...cancelBtnStyle, border: '0.5px solid #ddd', color: '#888' }}>Cancel</button>
                  </>
                ) : (
                  <button onClick={() => { setDraft({ body1: get('contact','body1'), body2: get('contact','body2'), availability: get('contact','availability'), instagram_handle: get('contact','instagram_handle'), instagram_url: get('contact','instagram_url'), email: get('contact','email') }); setEditingSection('contact') }} style={{ ...editBtnStyle, border: '0.5px solid #ddd', color: '#888' }}>Edit</button>
                )}
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}

// ─── Services editor ──────────────────────────────────────────────────────────

type AdminService = { id: string; name: string; price: string; description: string; display_order: number }

function ServicesAdminView() {
  const s = { fontFamily: 'Montserrat, sans-serif' }
  const [services, setServices] = useState<AdminService[]>([])
  const [localServices, setLocalServices] = useState<AdminService[]>([])
  const [fetching, setFetching] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [newSvc, setNewSvc] = useState({ name: '', price: '', description: '' })
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState<{ name: string; price: string; description: string }>({ name: '', price: '', description: '' })
  const [svcSaving, setSvcSaving] = useState(false)

  async function load() {
    setFetching(true)
    const res = await fetch('/api/admin/services')
    const data = await res.json()
    setServices(data.services ?? [])
    setFetching(false)
  }

  useEffect(() => { load() }, [])
  useEffect(() => { setLocalServices([...services]) }, [services])

  async function saveSvcField(id: string, field: 'name' | 'price' | 'description', value: string) {
    await fetch(`/api/admin/services/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ [field]: value }) })
  }

  async function deleteSvc(id: string) {
    if (!confirm('Delete this service?')) return
    await fetch(`/api/admin/services/${id}`, { method: 'DELETE' })
    await load()
  }

  async function addSvc() {
    if (!newSvc.name.trim()) return
    setSaving(true)
    const maxOrder = localServices.length ? Math.max(...localServices.map(sv => sv.display_order)) : -10
    await fetch('/api/admin/services', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...newSvc, display_order: maxOrder + 10 }) })
    setNewSvc({ name: '', price: '', description: '' })
    setShowAdd(false)
    setSaving(false)
    await load()
  }

  async function handleDrop(targetId: string) {
    if (!draggedId || draggedId === targetId) return
    const list = [...localServices]
    const fromIdx = list.findIndex(sv => sv.id === draggedId)
    const toIdx = list.findIndex(sv => sv.id === targetId)
    const [moved] = list.splice(fromIdx, 1)
    list.splice(toIdx, 0, moved)
    const updated = list.map((sv, i) => ({ ...sv, display_order: i * 10 }))
    setLocalServices(updated)
    setDraggedId(null); setDragOverId(null)
    await Promise.all(updated.map(sv => fetch(`/api/admin/services/${sv.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ display_order: sv.display_order }) })))
    await load()
  }

  function startEditSvc(svc: AdminService) {
    setEditDraft({ name: svc.name, price: svc.price, description: svc.description })
    setEditingId(svc.id)
  }

  async function saveEditSvc(id: string) {
    setSvcSaving(true)
    await Promise.all([
      saveSvcField(id, 'name', editDraft.name),
      saveSvcField(id, 'price', editDraft.price),
      saveSvcField(id, 'description', editDraft.description),
    ])
    setLocalServices(prev => prev.map(sv => sv.id === id ? { ...sv, ...editDraft } : sv))
    setSvcSaving(false)
    setEditingId(null)
  }

  if (fetching) return <div style={{ padding: 40, ...s, fontSize: 12, color: '#aaa' }}>Loading…</div>

  const svcEditBtn = { fontFamily: 'Montserrat, sans-serif', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase' as const, background: 'none', border: '0.5px solid var(--jkn-divider)', padding: '5px 12px', cursor: 'pointer', color: 'var(--jkn-light)' }
  const svcSaveBtn = { fontFamily: 'Montserrat, sans-serif', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase' as const, background: '#1c1917', color: '#fff', border: 'none', padding: '6px 14px', cursor: 'pointer' }
  const svcCancelBtn = { fontFamily: 'Montserrat, sans-serif', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase' as const, background: 'none', border: '0.5px solid #ddd', padding: '6px 10px', cursor: 'pointer', color: '#888' }

  return (
    <div>
      <div className="admin-header">
        <div><span className="admin-header-label">Content</span><h1 className="admin-header-title">Services</h1></div>
        <button onClick={() => setShowAdd(true)} style={{ ...s, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', background: '#1c1917', color: '#fff', border: 'none', padding: '10px 20px', cursor: 'pointer' }}>
          + Add Service
        </button>
      </div>

      <div style={{ margin: '0 -48px -48px', padding: '0 48px 48px' }}>
        <span style={{ ...s, fontSize: 9, letterSpacing: '0.26em', textTransform: 'uppercase', color: 'var(--jkn-light)', display: 'block', marginBottom: 36 }}>
          Drag to reorder
        </span>

        {showAdd && (
          <div style={{ border: '0.5px solid var(--jkn-divider)', padding: 28, marginBottom: 40, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p style={{ ...s, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--jkn-mid)', margin: 0 }}>New Service</p>
            <input value={newSvc.name} onChange={e => setNewSvc(n => ({ ...n, name: e.target.value }))} placeholder="Service name"
              style={{ border: '0.5px solid #ddd', padding: '9px 12px', fontFamily: 'var(--font-display, Georgia)', fontSize: 22, outline: 'none', color: 'var(--jkn-black)' }} />
            <input value={newSvc.price} onChange={e => setNewSvc(n => ({ ...n, price: e.target.value }))} placeholder="Price range"
              style={{ border: '0.5px solid #ddd', padding: '9px 12px', fontFamily: 'var(--font-display, Georgia)', fontSize: 15, outline: 'none', color: 'var(--jkn-black)' }} />
            <textarea value={newSvc.description} onChange={e => setNewSvc(n => ({ ...n, description: e.target.value }))} placeholder="Description" rows={4}
              style={{ border: '0.5px solid #ddd', padding: '9px 12px', ...s, fontSize: 14, resize: 'vertical', outline: 'none', lineHeight: 1.8, color: 'var(--jkn-body)' }} />
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={addSvc} disabled={saving} style={{ ...s, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', background: saving ? '#ccc' : '#1c1917', color: '#fff', border: 'none', padding: '10px 20px', cursor: saving ? 'not-allowed' : 'pointer' }}>
                {saving ? 'Saving…' : 'Add Service'}
              </button>
              <button onClick={() => setShowAdd(false)} style={{ ...s, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', background: 'none', border: '0.5px solid #ddd', padding: '10px 20px', cursor: 'pointer', color: '#888' }}>Cancel</button>
            </div>
          </div>
        )}

        {localServices.map(svc => (
          <div
            key={svc.id}
            className="service-row row-revealed"
            draggable={editingId !== svc.id}
            onDragStart={() => { if (editingId !== svc.id) setDraggedId(svc.id) }}
            onDragOver={e => { e.preventDefault(); setDragOverId(svc.id) }}
            onDrop={() => handleDrop(svc.id)}
            onDragEnd={() => { setDraggedId(null); setDragOverId(null) }}
            style={{ opacity: draggedId === svc.id ? 0.35 : 1, outline: dragOverId === svc.id && draggedId !== svc.id ? '1.5px solid var(--jkn-black)' : 'none', cursor: editingId === svc.id ? 'default' : draggedId ? 'grabbing' : 'grab', transition: 'opacity 0.15s' }}
          >
            <div className="service-row-left">
              {editingId === svc.id ? (
                <>
                  <input value={editDraft.name} onChange={e => setEditDraft(d => ({ ...d, name: e.target.value }))} className="service-row-name" style={{ display: 'block', background: 'transparent', border: 'none', borderBottom: '0.5px solid var(--jkn-divider)', outline: 'none', width: '100%', color: 'inherit' }} />
                  <input value={editDraft.price} onChange={e => setEditDraft(d => ({ ...d, price: e.target.value }))} className="service-row-price" style={{ display: 'block', marginTop: 8, background: 'transparent', border: 'none', borderBottom: '0.5px solid var(--jkn-divider)', outline: 'none', width: '100%', color: 'inherit' }} />
                </>
              ) : (
                <>
                  <span className="service-row-name" style={{ display: 'block' }}>{svc.name}</span>
                  <span className="service-row-price" style={{ display: 'block', marginTop: 8 }}>{svc.price}</span>
                </>
              )}
            </div>
            <div className="service-row-right">
              {editingId === svc.id ? (
                <textarea value={editDraft.description} onChange={e => setEditDraft(d => ({ ...d, description: e.target.value }))} className="service-row-desc" rows={4} style={{ background: 'transparent', border: 'none', borderBottom: '0.5px solid var(--jkn-divider)', outline: 'none', resize: 'vertical', width: '100%', color: 'inherit', padding: 0 }} />
              ) : (
                <p className="service-row-desc">{svc.description}</p>
              )}
              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                {editingId === svc.id ? (
                  <>
                    <button onClick={() => saveEditSvc(svc.id)} disabled={svcSaving} style={svcSaveBtn}>{svcSaving ? 'Saving…' : 'Save'}</button>
                    <button onClick={() => setEditingId(null)} style={svcCancelBtn}>Cancel</button>
                  </>
                ) : (
                  <button onClick={() => startEditSvc(svc)} style={svcEditBtn}>Edit</button>
                )}
                <button onClick={() => deleteSvc(svc.id)} style={{ ...s, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', background: 'none', border: 'none', color: 'var(--jkn-light)', cursor: 'pointer', padding: '5px 0' }}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── About editor ─────────────────────────────────────────────────────────────

type AboutItem = { id: string; type: string; content: string; url?: string | null; display_order: number }

function AboutAdminView() {
  const s = { fontFamily: 'Montserrat, sans-serif' }
  const [items, setItems] = useState<AboutItem[]>([])
  const [nameTitle, setNameTitle] = useState({ name: '', title: '' })
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [fetching, setFetching] = useState(true)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const photoInputRef = useRef<HTMLInputElement>(null)
  const [editingNameTitle, setEditingNameTitle] = useState(false)
  const [nameTitleDraft, setNameTitleDraft] = useState({ name: '', title: '' })
  const [nameTitleSaving, setNameTitleSaving] = useState(false)
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [itemDraft, setItemDraft] = useState({ content: '', url: '' })
  const [itemSaving, setItemSaving] = useState(false)
  const [addingBio, setAddingBio] = useState(false)
  const [newBioDraft, setNewBioDraft] = useState('')
  const [newBioSaving, setNewBioSaving] = useState(false)
  const [addingTagInProgress, setAddingTagInProgress] = useState(false)

  async function load() {
    setFetching(true)
    const [itemsRes, contentRes] = await Promise.all([
      fetch('/api/admin/about-items').then(r => r.json()),
      fetch('/api/admin/site-content').then(r => r.json()),
    ])
    setItems(itemsRes.items ?? [])
    const content: Record<string, string> = {}
    for (const row of contentRes.content ?? []) if (row.section === 'about') content[row.key] = row.value
    setNameTitle({ name: content.name ?? 'Dr. John K. Nia', title: content.title ?? 'Fellowship-Trained Cosmetic and Reconstructive Surgeon' })
    setPhotoUrl(content.photo_url ?? null)
    setFetching(false)
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingPhoto(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/admin/about-photo', { method: 'POST', body: fd })
    if (res.ok) { const { url } = await res.json(); setPhotoUrl(url) }
    setUploadingPhoto(false)
    e.target.value = ''
  }

  useEffect(() => { load() }, [])

  async function saveAboutField(key: 'name' | 'title', value: string) {
    await fetch('/api/admin/site-content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ section: 'about', key, value }) })
  }

  async function saveItemContent(id: string, content: string) {
    await fetch(`/api/admin/about-items/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content }) })
  }

  async function saveItemUrl(id: string, url: string) {
    await fetch(`/api/admin/about-items/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: url || null }) })
  }

  async function deleteItem(id: string) {
    if (!confirm('Delete this item?')) return
    await fetch(`/api/admin/about-items/${id}`, { method: 'DELETE' })
    await load()
  }

  async function addItem(type: string, content = ''): Promise<AboutItem | null> {
    const typeItems = items.filter(i => i.type === type)
    const maxOrder = typeItems.length ? Math.max(...typeItems.map(i => i.display_order)) : -10
    const res = await fetch('/api/admin/about-items', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type, content, display_order: maxOrder + 10 }) })
    const data = await res.json()
    await load()
    return data.item ?? null
  }

  const byType = (type: string) => items.filter(i => i.type === type).sort((a, b) => a.display_order - b.display_order)

  async function saveNameTitleFields() {
    setNameTitleSaving(true)
    await Promise.all([saveAboutField('name', nameTitleDraft.name), saveAboutField('title', nameTitleDraft.title)])
    setNameTitle(nameTitleDraft)
    setNameTitleSaving(false)
    setEditingNameTitle(false)
  }

  function startEditItem(item: AboutItem) {
    setItemDraft({ content: item.content, url: item.url ?? '' })
    setEditingItemId(item.id)
  }

  async function saveItem(item: AboutItem) {
    setItemSaving(true)
    await saveItemContent(item.id, itemDraft.content)
    if (item.type === 'recognition') await saveItemUrl(item.id, itemDraft.url)
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, content: itemDraft.content, url: item.type === 'recognition' ? (itemDraft.url || null) : i.url } : i))
    setItemSaving(false)
    setEditingItemId(null)
  }

  if (fetching) return <div style={{ padding: 40, fontFamily: 'Montserrat, sans-serif', fontSize: 12, color: '#aaa' }}>Loading…</div>

  const bioItems = byType('bio')
  const credItems = byType('credential')
  const certItems = byType('cert')
  const recogItems = byType('recognition')
  const tagItems = byType('tag')

  const aEditBtn = { fontFamily: 'Montserrat, sans-serif', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase' as const, background: 'none', border: '0.5px solid var(--jkn-divider)', padding: '4px 10px', cursor: 'pointer', color: 'var(--jkn-light)' }
  const aSaveBtn = { fontFamily: 'Montserrat, sans-serif', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase' as const, background: '#1c1917', color: '#fff', border: 'none', padding: '5px 12px', cursor: 'pointer' }
  const aCancelBtn = { fontFamily: 'Montserrat, sans-serif', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase' as const, background: 'none', border: '0.5px solid #ddd', padding: '5px 8px', cursor: 'pointer', color: '#888' }

  return (
    <div>
      <div className="admin-header">
        <div><span className="admin-header-label">Content</span><h1 className="admin-header-title">About</h1></div>
      </div>

      <div style={{ margin: '0 -48px -48px' }}>
        <section className="about-section">
          <span className="section-label">The Surgeon</span>
          <div className="about-grid">

            {/* ── Photo column ─────────────────── */}
            <div>
              <div className="about-photo" style={{ position: 'relative' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photoUrl ?? '/dr-nia-portrait.png'} alt={nameTitle.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%' }} />
                <div
                  style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', transition: 'background 0.25s', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: 20 }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.45)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0)' }}
                >
                  <button onClick={() => photoInputRef.current?.click()} disabled={uploadingPhoto}
                    style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', background: 'rgba(247,245,242,0.96)', color: '#1c1917', border: 'none', padding: '10px 22px', cursor: uploadingPhoto ? 'not-allowed' : 'pointer' }}>
                    {uploadingPhoto ? 'Uploading…' : 'Replace Photo'}
                  </button>
                  <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                </div>
              </div>
            </div>

            {/* ── Content column ───────────────── */}
            <div className="about-content">
              <span className="section-label">About</span>
              {editingNameTitle ? (
                <>
                  <input value={nameTitleDraft.name} onChange={e => setNameTitleDraft(d => ({ ...d, name: e.target.value }))} className="about-name" style={{ display: 'block', background: 'transparent', border: 'none', borderBottom: '0.5px solid var(--jkn-divider)', outline: 'none', width: '100%', color: 'inherit' }} />
                  <input value={nameTitleDraft.title} onChange={e => setNameTitleDraft(d => ({ ...d, title: e.target.value }))} className="about-title" style={{ display: 'block', marginTop: 4, background: 'transparent', border: 'none', borderBottom: '0.5px solid var(--jkn-divider)', outline: 'none', width: '100%', color: 'inherit' }} />
                  <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                    <button onClick={saveNameTitleFields} disabled={nameTitleSaving} style={aSaveBtn}>{nameTitleSaving ? 'Saving…' : 'Save'}</button>
                    <button onClick={() => setEditingNameTitle(false)} style={aCancelBtn}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="about-name">{nameTitle.name}</h2>
                  <span className="about-title">{nameTitle.title}</span>
                  <div style={{ marginTop: 8 }}>
                    <button onClick={() => { setNameTitleDraft({ name: nameTitle.name, title: nameTitle.title }); setEditingNameTitle(true) }} style={aEditBtn}>Edit Name & Title</button>
                  </div>
                </>
              )}

              {bioItems.map(item => (
                <div key={item.id} style={{ marginBottom: 4 }}>
                  {editingItemId === item.id ? (
                    <>
                      <textarea value={itemDraft.content} onChange={e => setItemDraft(d => ({ ...d, content: e.target.value }))} className="about-body" rows={4} style={{ background: 'transparent', border: '0.5px solid var(--jkn-divider)', outline: 'none', resize: 'vertical', width: '100%', color: 'inherit', padding: 4 }} />
                      <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                        <button onClick={() => saveItem(item)} disabled={itemSaving} style={aSaveBtn}>{itemSaving ? 'Saving…' : 'Save'}</button>
                        <button onClick={() => setEditingItemId(null)} style={aCancelBtn}>Cancel</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="about-body">{item.content}</p>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => startEditItem(item)} style={aEditBtn}>Edit</button>
                        <button onClick={() => deleteItem(item.id)} style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', background: 'none', border: 'none', color: 'var(--jkn-light)', cursor: 'pointer', padding: '4px 0' }}>Delete</button>
                      </div>
                    </>
                  )}
                </div>
              ))}
              {addingBio ? (
                <div style={{ marginBottom: 8 }}>
                  <textarea
                    value={newBioDraft}
                    onChange={e => setNewBioDraft(e.target.value)}
                    autoFocus
                    rows={4}
                    placeholder="Type paragraph text…"
                    className="about-body"
                    style={{ background: 'transparent', border: '0.5px solid var(--jkn-divider)', outline: 'none', resize: 'vertical', width: '100%', color: 'inherit', padding: 4 }}
                  />
                  <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                    <button
                      disabled={newBioSaving || !newBioDraft.trim()}
                      onClick={async () => {
                        if (!newBioDraft.trim()) return
                        setNewBioSaving(true)
                        await addItem('bio', newBioDraft.trim())
                        setNewBioDraft('')
                        setAddingBio(false)
                        setNewBioSaving(false)
                      }}
                      style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', background: '#1c1917', color: '#fff', border: 'none', padding: '5px 12px', cursor: 'pointer', opacity: !newBioDraft.trim() ? 0.4 : 1 }}
                    >
                      {newBioSaving ? 'Saving…' : 'Save'}
                    </button>
                    <button onClick={() => { setAddingBio(false); setNewBioDraft('') }} style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', background: 'none', border: '0.5px solid #ddd', padding: '5px 8px', cursor: 'pointer', color: '#888' }}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setAddingBio(true)} style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', background: 'none', border: '0.5px dashed var(--jkn-divider)', color: 'var(--jkn-light)', padding: '7px 16px', cursor: 'pointer', marginBottom: 8 }}>
                  + Add paragraph
                </button>
              )}

              <div className="about-rule" />
              <span className="about-block-label">Education and Training</span>
              <ul className="about-list">
                {credItems.map(item => (
                  <li key={item.id} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
                    {editingItemId === item.id ? (
                      <>
                        <input value={itemDraft.content} onChange={e => setItemDraft(d => ({ ...d, content: e.target.value }))} style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '0.5px solid var(--jkn-divider)', outline: 'none', color: 'inherit', fontFamily: 'Montserrat, sans-serif', fontSize: 14, padding: '2px 0' }} />
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => saveItem(item)} disabled={itemSaving} style={aSaveBtn}>{itemSaving ? 'Saving…' : 'Save'}</button>
                          <button onClick={() => setEditingItemId(null)} style={aCancelBtn}>Cancel</button>
                        </div>
                      </>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                        <span style={{ flex: 1 }}>{item.content}</span>
                        <button onClick={() => startEditItem(item)} style={aEditBtn}>Edit</button>
                        <button onClick={() => deleteItem(item.id)} style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 11, color: 'var(--jkn-light)', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}>×</button>
                      </div>
                    )}
                  </li>
                ))}
                <li style={{ border: 'none', padding: '8px 0 0' }}>
                  <button onClick={() => addItem('credential', 'New credential…')} style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', background: 'none', border: '0.5px dashed var(--jkn-divider)', color: 'var(--jkn-light)', padding: '6px 14px', cursor: 'pointer' }}>+ Add</button>
                </li>
              </ul>

              <div className="about-rule" />
              <span className="about-block-label">Certifications</span>
              <ul className="about-list">
                {certItems.map(item => (
                  <li key={item.id} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
                    {editingItemId === item.id ? (
                      <>
                        <input value={itemDraft.content} onChange={e => setItemDraft(d => ({ ...d, content: e.target.value }))} style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '0.5px solid var(--jkn-divider)', outline: 'none', color: 'inherit', fontFamily: 'Montserrat, sans-serif', fontSize: 14, padding: '2px 0' }} />
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => saveItem(item)} disabled={itemSaving} style={aSaveBtn}>{itemSaving ? 'Saving…' : 'Save'}</button>
                          <button onClick={() => setEditingItemId(null)} style={aCancelBtn}>Cancel</button>
                        </div>
                      </>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                        <span style={{ flex: 1 }}>{item.content}</span>
                        <button onClick={() => startEditItem(item)} style={aEditBtn}>Edit</button>
                        <button onClick={() => deleteItem(item.id)} style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 11, color: 'var(--jkn-light)', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}>×</button>
                      </div>
                    )}
                  </li>
                ))}
                <li style={{ border: 'none', padding: '8px 0 0' }}>
                  <button onClick={() => addItem('cert', 'New certification…')} style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', background: 'none', border: '0.5px dashed var(--jkn-divider)', color: 'var(--jkn-light)', padding: '6px 14px', cursor: 'pointer' }}>+ Add</button>
                </li>
              </ul>

              <div className="about-rule" />
              <span className="about-block-label">Recognition</span>
              <div className="about-recognition">
                {recogItems.map(item => (
                  <div key={item.id} className="recognition-item" style={{ alignItems: 'flex-start' }}>
                    <div className="recognition-dash" style={{ marginTop: 6 }} />
                    {editingItemId === item.id ? (
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <input value={itemDraft.content} onChange={e => setItemDraft(d => ({ ...d, content: e.target.value }))} className="recognition-text" style={{ display: 'block', background: 'transparent', border: 'none', borderBottom: '0.5px solid var(--jkn-divider)', outline: 'none', color: 'inherit', width: '100%' }} />
                        <input value={itemDraft.url} onChange={e => setItemDraft(d => ({ ...d, url: e.target.value }))} placeholder="https://…" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 10, color: 'var(--jkn-light)', border: 'none', borderBottom: '0.5px solid var(--jkn-divider)', outline: 'none', background: 'transparent', padding: '2px 0', width: '100%' }} />
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => saveItem(item)} disabled={itemSaving} style={aSaveBtn}>{itemSaving ? 'Saving…' : 'Save'}</button>
                          <button onClick={() => setEditingItemId(null)} style={aCancelBtn}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <span className="recognition-text" style={{ display: 'block' }}>{item.content}</span>
                        {item.url && <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 10, color: 'var(--jkn-light)' }}>{item.url}</span>}
                        <button onClick={() => startEditItem(item)} style={aEditBtn}>Edit</button>
                      </div>
                    )}
                    <button onClick={() => deleteItem(item.id)} style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 11, color: 'var(--jkn-light)', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0, marginLeft: 8 }}>×</button>
                  </div>
                ))}
                <button onClick={() => addItem('recognition', 'New recognition…')} style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', background: 'none', border: '0.5px dashed var(--jkn-divider)', color: 'var(--jkn-light)', padding: '6px 14px', cursor: 'pointer', marginTop: 8 }}>+ Add</button>
              </div>

              <div className="about-rule" />
              <span className="about-block-label">Areas of Expertise</span>
              <div className="about-expertise" style={{ marginTop: 16 }}>
                {tagItems.map(item => (
                  <div key={item.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                    {editingItemId === item.id ? (
                      <>
                        <input value={itemDraft.content} onChange={e => setItemDraft(d => ({ ...d, content: e.target.value }))} className="expertise-tag" style={{ background: 'transparent', border: '0.5px solid var(--jkn-divider)', outline: 'none' }} />
                        <button onClick={() => saveItem(item)} disabled={itemSaving} style={aSaveBtn}>{itemSaving ? '…' : 'Save'}</button>
                        <button onClick={() => setEditingItemId(null)} style={aCancelBtn}>×</button>
                      </>
                    ) : (
                      <>
                        <span className="expertise-tag">{item.content}</span>
                        <button onClick={() => startEditItem(item)} style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 10, color: 'var(--jkn-light)', background: 'none', border: 'none', cursor: 'pointer', padding: '0 2px', lineHeight: 1 }}>✎</button>
                        <button onClick={() => deleteItem(item.id)} style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 11, color: 'var(--jkn-light)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 1 }}>×</button>
                      </>
                    )}
                  </div>
                ))}
                <button
                  disabled={addingTagInProgress}
                  onClick={async () => {
                    setAddingTagInProgress(true)
                    const newItem = await addItem('tag', '')
                    if (newItem) startEditItem(newItem)
                    setAddingTagInProgress(false)
                  }}
                  className="expertise-tag"
                  style={{ cursor: addingTagInProgress ? 'wait' : 'pointer', borderStyle: 'dashed', color: 'var(--jkn-light)' }}
                >
                  {addingTagInProgress ? '…' : '+ Add tag'}
                </button>
              </div>

              <div style={{ marginTop: 40 }}>
                <a className="btn-navy" href="/begin">Request a Consultation</a>
              </div>
            </div>

          </div>
        </section>
      </div>
    </div>
  )
}

const VALID_VIEWS: View[] = ['inquiries', 'reviews', 'cases', 'services', 'about', 'homepage', 'email-routing']

export default function AdminDashboard({ inquiries }: { inquiries: Inquiry[] }) {
  const [view, setView] = useState<View>('inquiries')
  const [selected, setSelected] = useState<Inquiry | null>(null)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const router = useRouter()

  // Read view from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const v = params.get('view') as View | null
    if (v && VALID_VIEWS.includes(v)) setView(v)
  }, [])

  // Sync browser back/forward
  useEffect(() => {
    function onPop() {
      const params = new URLSearchParams(window.location.search)
      const v = params.get('view') as View | null
      setView(v && VALID_VIEWS.includes(v) ? v : 'inquiries')
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  function navigate(v: View) {
    setView(v)
    const url = new URL(window.location.href)
    url.searchParams.set('view', v)
    history.pushState({}, '', url.toString())
  }

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
          <span className={`admin-nav-item${view === 'inquiries' ? ' active' : ''}`} onClick={() => navigate('inquiries')}>Inquiries</span>
          <span className={`admin-nav-item${view === 'reviews' ? ' active' : ''}`} onClick={() => navigate('reviews')}>Reviews</span>
          <span className={`admin-nav-item${view === 'cases' ? ' active' : ''}`} onClick={() => navigate('cases')}>Cases</span>
          <span className={`admin-nav-item${view === 'services' ? ' active' : ''}`} onClick={() => navigate('services')}>Services</span>
          <span className={`admin-nav-item${view === 'about' ? ' active' : ''}`} onClick={() => navigate('about')}>About</span>
          <span className={`admin-nav-item${view === 'homepage' ? ' active' : ''}`} onClick={() => navigate('homepage')}>Homepage</span>
          <span className={`admin-nav-item${view === 'email-routing' ? ' active' : ''}`} onClick={() => navigate('email-routing')}>Email Routing</span>
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
        ) : view === 'cases' ? (
          <CasesView />
        ) : view === 'services' ? (
          <ServicesAdminView />
        ) : view === 'about' ? (
          <AboutAdminView />
        ) : view === 'homepage' ? (
          <HomepageView />
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
