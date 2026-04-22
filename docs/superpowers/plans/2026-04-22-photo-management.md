# Before/After Photo Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a photo management system in the admin panel letting the doctor upload new before/after cases to Supabase Storage, while existing static cases remain with a hide/show toggle.

**Architecture:** New cases are stored in a Supabase `cases` table with image URLs pointing to a public Supabase Storage bucket. The gallery page fetches DB cases (shown first by display_order) alongside existing static cases (filtered by hidden_cases table). Clicking a new case navigates to a dynamic detail page. Existing static cases are unchanged, served from `public/ba/`.

**Tech Stack:** Next.js App Router, Supabase (PostgreSQL + Storage), TypeScript, React

---

## File Structure

**New files:**
- `app/api/admin/cases/route.ts` — GET list, POST create case
- `app/api/admin/cases/[id]/route.ts` — PUT update, DELETE case + storage cleanup
- `app/api/admin/cases/[id]/images/route.ts` — POST upload image, DELETE remove image
- `app/api/admin/hidden-cases/route.ts` — GET/POST/DELETE hidden static case slugs
- `components/DynamicCaseClient.tsx` — detail page client component for Supabase cases

**Modified files:**
- `app/admin/AdminDashboard.tsx` — add CasesView component and nav item
- `app/before-after/page.tsx` — also fetch DB cases + hidden cases, pass as props
- `components/BeforeAfter.tsx` — accept dbCases + hiddenSlugs props, show DB cases first
- `app/before-after/comprehensive/[case]/page.tsx` — add dynamicParams, Supabase fallback
- `app/before-after/eyelid/[case]/page.tsx` — same
- `app/before-after/midfacelift/[case]/page.tsx` — same

---

### Task 1: Supabase Setup (Manual)

**Files:** Supabase dashboard (no code changes)

- [ ] **Step 1: Create the `before-after` storage bucket**

In the Supabase dashboard → Storage → New bucket:
- Name: `before-after`
- Public bucket: ✅ checked
- File size limit: 10 MB

- [ ] **Step 2: Create the `cases` table**

Run in Supabase SQL editor:

```sql
create table cases (
  id uuid primary key default gen_random_uuid(),
  gallery text not null check (gallery in ('comprehensive', 'eyelid', 'midfacelift')),
  procedures text[] not null default '{}',
  images text[] not null default '{}',
  cover_image text,
  display_order int not null default 0,
  instagram_videos jsonb not null default '[]',
  created_at timestamptz not null default now()
);
```

- [ ] **Step 3: Create the `hidden_cases` table**

```sql
create table hidden_cases (
  slug text not null,
  gallery text not null,
  primary key (slug, gallery)
);
```

- [ ] **Step 4: Commit**

```bash
git commit --allow-empty -m "chore: supabase cases + hidden_cases tables and before-after storage bucket created"
```

---

### Task 2: Case CRUD API Routes

**Files:**
- Create: `app/api/admin/cases/route.ts`
- Create: `app/api/admin/cases/[id]/route.ts`

- [ ] **Step 1: Create `app/api/admin/cases/route.ts`**

```typescript
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabase } from '@/lib/supabase'

async function requireAuth() {
  const cookieStore = await cookies()
  return cookieStore.get('jkn_admin')?.value === 'authenticated'
}

export async function GET() {
  if (!await requireAuth()) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  const { data, error } = await supabase
    .from('cases')
    .select('*')
    .order('display_order', { ascending: true })
  if (error) return NextResponse.json({ error: 'Failed to load' }, { status: 500 })
  return NextResponse.json({ cases: data })
}

export async function POST(req: Request) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  const { gallery, procedures, display_order } = await req.json()
  if (!gallery || !['comprehensive', 'eyelid', 'midfacelift'].includes(gallery)) {
    return NextResponse.json({ error: 'Invalid gallery' }, { status: 400 })
  }
  const { data, error } = await supabase
    .from('cases')
    .insert({ gallery, procedures: procedures ?? [], display_order: display_order ?? 0 })
    .select()
    .single()
  if (error) return NextResponse.json({ error: 'Failed to create' }, { status: 500 })
  return NextResponse.json({ case: data })
}
```

- [ ] **Step 2: Create `app/api/admin/cases/[id]/route.ts`**

```typescript
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabase } from '@/lib/supabase'

async function requireAuth() {
  const cookieStore = await cookies()
  return cookieStore.get('jkn_admin')?.value === 'authenticated'
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  const allowed = ['procedures', 'images', 'cover_image', 'display_order', 'instagram_videos']
  const update = Object.fromEntries(Object.entries(body).filter(([k]) => allowed.includes(k)))
  const { error } = await supabase.from('cases').update(update).eq('id', id)
  if (error) return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  const { id } = await params

  const { data: caseData } = await supabase
    .from('cases')
    .select('images')
    .eq('id', id)
    .single()

  if (caseData?.images?.length) {
    const paths = caseData.images.map((url: string) => {
      const marker = '/object/public/before-after/'
      return url.slice(url.indexOf(marker) + marker.length)
    })
    await supabase.storage.from('before-after').remove(paths)
  }

  const { error } = await supabase.from('cases').delete().eq('id', id)
  if (error) return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
```

- [ ] **Step 3: Check types compile**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add app/api/admin/cases/route.ts "app/api/admin/cases/[id]/route.ts"
git commit -m "feat: case CRUD API routes"
```

---

### Task 3: Image Upload/Delete API

**Files:**
- Create: `app/api/admin/cases/[id]/images/route.ts`

- [ ] **Step 1: Create the file**

```typescript
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabase } from '@/lib/supabase'

async function requireAuth() {
  const cookieStore = await cookies()
  return cookieStore.get('jkn_admin')?.value === 'authenticated'
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  const { id } = await params

  const { data: caseData, error: fetchError } = await supabase
    .from('cases')
    .select('gallery, images, cover_image')
    .eq('id', id)
    .single()
  if (fetchError || !caseData) return NextResponse.json({ error: 'Case not found' }, { status: 404 })

  const formData = await req.formData()
  const file = formData.get('file') as File
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const path = `${caseData.gallery}/${id}/${Date.now()}.${ext}`

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const { error: uploadError } = await supabase.storage
    .from('before-after')
    .upload(path, buffer, { contentType: file.type })
  if (uploadError) return NextResponse.json({ error: 'Upload failed' }, { status: 500 })

  const { data: { publicUrl } } = supabase.storage
    .from('before-after')
    .getPublicUrl(path)

  const existingImages: string[] = caseData.images ?? []
  const newImages = [...existingImages, publicUrl]
  const isFirst = existingImages.length === 0

  await supabase.from('cases').update({
    images: newImages,
    ...(isFirst ? { cover_image: publicUrl } : {}),
  }).eq('id', id)

  return NextResponse.json({ url: publicUrl })
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  const { id } = await params
  const { url } = await req.json()

  const marker = '/object/public/before-after/'
  const path = url.slice(url.indexOf(marker) + marker.length)
  await supabase.storage.from('before-after').remove([path])

  const { data: caseData } = await supabase
    .from('cases')
    .select('images, cover_image')
    .eq('id', id)
    .single()

  const newImages = (caseData?.images ?? []).filter((u: string) => u !== url)
  const newCover = caseData?.cover_image === url ? (newImages[0] ?? null) : caseData?.cover_image

  await supabase.from('cases').update({ images: newImages, cover_image: newCover }).eq('id', id)
  return NextResponse.json({ ok: true })
}
```

- [ ] **Step 2: Commit**

```bash
git add "app/api/admin/cases/[id]/images/route.ts"
git commit -m "feat: image upload and delete API"
```

---

### Task 4: Hidden Cases API

**Files:**
- Create: `app/api/admin/hidden-cases/route.ts`

- [ ] **Step 1: Create the file**

```typescript
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabase } from '@/lib/supabase'

async function requireAuth() {
  const cookieStore = await cookies()
  return cookieStore.get('jkn_admin')?.value === 'authenticated'
}

export async function GET() {
  const { data } = await supabase.from('hidden_cases').select('slug, gallery')
  return NextResponse.json({ hidden: data ?? [] })
}

export async function POST(req: Request) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  const { slug, gallery } = await req.json()
  await supabase.from('hidden_cases').upsert({ slug, gallery })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: Request) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  const { slug, gallery } = await req.json()
  await supabase.from('hidden_cases').delete().eq('slug', slug).eq('gallery', gallery)
  return NextResponse.json({ ok: true })
}
```

- [ ] **Step 2: Commit**

```bash
git add app/api/admin/hidden-cases/route.ts
git commit -m "feat: hidden cases API"
```

---

### Task 5: Admin UI — CasesView

**Files:**
- Modify: `app/admin/AdminDashboard.tsx`

- [ ] **Step 1: Add `'cases'` to the View type**

Find the line with `type View =` and add `'cases'`:

```typescript
type View = 'inquiries' | 'reviews' | 'email-routing' | 'cases'
```

- [ ] **Step 2: Add Cases nav button**

In the sidebar nav (find where `'email-routing'` button is), add after it:

```tsx
<button
  onClick={() => setView('cases')}
  className={`admin-nav-btn${view === 'cases' ? ' active' : ''}`}
>
  Cases
</button>
```

- [ ] **Step 3: Add Cases to the view switcher**

Find where `{view === 'reviews' && <ReviewsView />}` is and add:

```tsx
{view === 'cases' && <CasesView />}
```

- [ ] **Step 4: Add types near the top of the file (after the `Testimonial` type)**

```typescript
type DbCase = {
  id: string
  gallery: 'comprehensive' | 'eyelid' | 'midfacelift'
  procedures: string[]
  images: string[]
  cover_image: string | null
  display_order: number
  instagram_videos: { url: string; label: string }[]
}

type HiddenCase = { slug: string; gallery: string }

const STATIC_CASES_BY_GALLERY: Record<string, string[]> = {
  comprehensive: ['case-01','case-02','case-03','case-04','case-05','case-06','case-07','case-08','case-09'],
  eyelid: ['case-01','case-02','case-03','case-04','case-05','case-06','case-07','case-08','case-09','case-10','case-11','case-12','case-13','case-14','case-15'],
  midfacelift: ['case-01','case-02'],
}
```

- [ ] **Step 5: Add the `CasesView` component after `ReviewsView`**

```tsx
function CasesView() {
  const s = { fontFamily: 'Montserrat, sans-serif' }
  const [gallery, setGallery] = useState<'comprehensive' | 'eyelid' | 'midfacelift'>('comprehensive')
  const [dbCases, setDbCases] = useState<DbCase[]>([])
  const [hidden, setHidden] = useState<HiddenCase[]>([])
  const [fetching, setFetching] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [procedures, setProcedures] = useState<string[]>([''])
  const [displayOrder, setDisplayOrder] = useState(0)
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function load() {
    setFetching(true)
    const [casesRes, hiddenRes] = await Promise.all([
      fetch('/api/admin/cases'),
      fetch('/api/admin/hidden-cases'),
    ])
    const casesData = await casesRes.json()
    const hiddenData = await hiddenRes.json()
    setDbCases(casesData.cases ?? [])
    setHidden(hiddenData.hidden ?? [])
    setFetching(false)
  }

  useEffect(() => { load() }, [])

  function resetForm() {
    setShowAdd(false)
    setProcedures([''])
    setDisplayOrder(0)
    setPendingFiles([])
    setPreviewUrls([])
    setCoverPreview(null)
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

    const res = await fetch('/api/admin/cases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gallery, procedures: filteredProcs, display_order: displayOrder }),
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

    // Set cover: use the preview that was selected as cover, mapped to its uploaded URL by index
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

  async function toggleHide(slug: string, gal: string) {
    const isHidden = hidden.some(h => h.slug === slug && h.gallery === gal)
    await fetch('/api/admin/hidden-cases', {
      method: isHidden ? 'DELETE' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, gallery: gal }),
    })
    await load()
  }

  const filteredDbCases = dbCases.filter(c => c.gallery === gallery)
  const staticSlugs = STATIC_CASES_BY_GALLERY[gallery] ?? []

  return (
    <div>
      <div className="admin-header">
        <div>
          <span className="admin-header-label">Content</span>
          <h1 className="admin-header-title">Cases</h1>
        </div>
        <button
          onClick={() => { resetForm(); setShowAdd(true) }}
          style={{ ...s, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', background: '#1c1917', color: '#fff', border: 'none', padding: '10px 20px', cursor: 'pointer' }}
        >
          + Add Case
        </button>
      </div>

      <div style={{ maxWidth: 720, padding: '0 40px' }}>
        {/* Gallery tabs */}
        <div style={{ display: 'flex', gap: 2, marginBottom: 32 }}>
          {(['comprehensive', 'eyelid', 'midfacelift'] as const).map(g => (
            <button
              key={g}
              onClick={() => setGallery(g)}
              style={{ ...s, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', padding: '8px 16px', border: '0.5px solid #ddd', background: gallery === g ? '#1c1917' : '#fff', color: gallery === g ? '#fff' : '#888', cursor: 'pointer' }}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Add case form */}
        {showAdd && (
          <div style={{ border: '0.5px solid #e5e5e5', padding: 24, marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ ...s, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', margin: 0 }}>
              New Case — {gallery}
            </p>

            {/* Procedures */}
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

            {/* Display order */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ ...s, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888' }}>Display Order (lower = shown first)</label>
              <input
                type="number"
                value={displayOrder}
                onChange={e => setDisplayOrder(Number(e.target.value))}
                style={{ border: '0.5px solid #ddd', padding: '8px 12px', ...s, fontSize: 13, width: 80, outline: 'none' }}
              />
            </div>

            {/* Photos */}
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
        ) : (
          <>
            {filteredDbCases.length > 0 && (
              <div style={{ marginBottom: 40 }}>
                <p style={{ ...s, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#aaa', marginBottom: 16 }}>Uploaded Cases</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {filteredDbCases.map(c => (
                    <div key={c.id} style={{ border: '0.5px solid #e5e5e5', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                      {c.cover_image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={c.cover_image} alt="Cover" style={{ width: 56, height: 56, objectFit: 'cover', flexShrink: 0 }} />
                      )}
                      <div style={{ flex: 1 }}>
                        <p style={{ ...s, fontSize: 12, color: '#3d3530', margin: '0 0 4px' }}>{c.procedures.join(', ') || '—'}</p>
                        <p style={{ ...s, fontSize: 10, color: '#aaa', margin: 0 }}>{c.images.length} photo{c.images.length !== 1 ? 's' : ''} · order {c.display_order}</p>
                      </div>
                      <button onClick={() => handleDelete(c.id)}
                        style={{ ...s, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', background: 'none', border: '0.5px solid #ddd', padding: '6px 12px', cursor: 'pointer', color: '#c00' }}>
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p style={{ ...s, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#aaa', marginBottom: 16 }}>Existing Cases</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {staticSlugs.map(slug => {
                  const isHidden = hidden.some(h => h.slug === slug && h.gallery === gallery)
                  return (
                    <div key={slug} style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', border: '0.5px solid #e5e5e5', gap: 16, opacity: isHidden ? 0.4 : 1 }}>
                      <span style={{ ...s, fontSize: 12, color: '#3d3530', flex: 1 }}>{slug}</span>
                      <button onClick={() => toggleHide(slug, gallery)}
                        style={{ ...s, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', background: 'none', border: '0.5px solid #ddd', padding: '6px 12px', cursor: 'pointer', color: isHidden ? '#2d7a2d' : '#888' }}>
                        {isHidden ? 'Show' : 'Hide'}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Check types compile**

```bash
npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors

- [ ] **Step 7: Commit**

```bash
git add app/admin/AdminDashboard.tsx
git commit -m "feat: cases management view in admin panel"
```

---

### Task 6: Gallery Page — Show DB Cases + Hidden Toggle

**Files:**
- Modify: `app/before-after/page.tsx`
- Modify: `components/BeforeAfter.tsx`

- [ ] **Step 1: Update `app/before-after/page.tsx`**

Replace the entire file with:

```typescript
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { client } from '@/sanity/lib/client'
import { beforeAftersQuery } from '@/sanity/lib/queries'
import type { BeforeAfterCase } from '@/lib/types'
import { supabase } from '@/lib/supabase'
import Nav from '@/components/Nav'
import BeforeAfter from '@/components/BeforeAfter'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Before and After Gallery — JKN Cosmetic Surgery | Dr. John K. Nia',
  description: 'Before and after results from Dr. John K. Nia\'s surgical practice in New York City. Comprehensive facial rejuvenation, eyelid surgery, mid facelift, and Mohs reconstruction cases.',
  alternates: { canonical: 'https://jkncosmeticsurgery.com/before-after' },
}

export default async function BeforeAfterPage() {
  const [cases, { data: dbCases }, { data: hiddenRows }] = await Promise.all([
    client.fetch<BeforeAfterCase[]>(beforeAftersQuery).catch(() => []),
    supabase.from('cases').select('id, gallery, procedures, cover_image, display_order').order('display_order'),
    supabase.from('hidden_cases').select('slug, gallery'),
  ])

  return (
    <>
      <Nav />
      <Suspense fallback={null}>
        <BeforeAfter
          cases={cases}
          dbCases={dbCases ?? []}
          hiddenSlugs={(hiddenRows ?? []).map((h: { slug: string; gallery: string }) => `${h.gallery}:${h.slug}`)}
        />
      </Suspense>
      <Footer />
    </>
  )
}
```

- [ ] **Step 2: Update `components/BeforeAfter.tsx` — add new prop types**

Replace the function signature and add types. Find the existing export line:

```typescript
export default function BeforeAfter({ cases }: { cases: BeforeAfterCase[] }) {
```

Replace with:

```typescript
type DbCaseSummary = {
  id: string
  gallery: 'comprehensive' | 'eyelid' | 'midfacelift'
  procedures: string[]
  cover_image: string | null
  display_order: number
}

export default function BeforeAfter({
  cases,
  dbCases = [],
  hiddenSlugs = [],
}: {
  cases: BeforeAfterCase[]
  dbCases?: DbCaseSummary[]
  hiddenSlugs?: string[]
}) {
```

- [ ] **Step 3: Add DB case conversion logic inside the component**

Add this block right after the `useState` declarations (before `hasSanityCases`):

```typescript
  const GALLERY_TO_CATEGORY: Record<string, string> = {
    comprehensive: 'comprehensive',
    eyelid: 'bleph',
    midfacelift: 'ponytail',
  }
  const GALLERY_TO_HREF: Record<string, string> = {
    comprehensive: '/before-after/comprehensive',
    eyelid: '/before-after/eyelid',
    midfacelift: '/before-after/midfacelift',
  }
  const GALLERY_TO_PROCEDURE: Record<string, string> = {
    comprehensive: 'Comprehensive Rejuvenation',
    eyelid: 'Upper and Lower Blepharoplasty',
    midfacelift: 'Invisible Access Mid Facelift',
  }
  const GALLERY_TO_SUB: Record<string, string | undefined> = {
    comprehensive: 'Face, Neck and Eyes',
    eyelid: undefined,
    midfacelift: undefined,
  }

  const dbStaticCases: StaticCase[] = dbCases
    .filter(c => c.cover_image)
    .map(c => ({
      thumbnail: c.cover_image!,
      images: [],
      procedure: c.procedures[0] ?? GALLERY_TO_PROCEDURE[c.gallery],
      sub: GALLERY_TO_SUB[c.gallery],
      category: GALLERY_TO_CATEGORY[c.gallery],
      href: `${GALLERY_TO_HREF[c.gallery]}/${c.id}`,
    }))
```

- [ ] **Step 4: Filter hidden static cases and update visible computation**

Replace the existing `const ALL_NON_SC` and `const visible` lines with:

```typescript
  const visibleBleph = BLEPH_CASES.filter(c => {
    const slug = c.href?.split('/').pop()
    return !slug || !hiddenSlugs.includes(`eyelid:${slug}`)
  })
  const visiblePonytail = PONYTAIL_CASES.filter(c => {
    const slug = c.href?.split('/').pop()
    return !slug || !hiddenSlugs.includes(`midfacelift:${slug}`)
  })
  const visibleComprehensive = COMPREHENSIVE_CASES.filter(c => {
    const slug = c.href?.split('/').pop()
    return !slug || !hiddenSlugs.includes(`comprehensive:${slug}`)
  })

  const ALL_NON_SC: StaticCase[] = [
    ...dbStaticCases,
    ...visiblePonytail,
    ...visibleComprehensive,
    ...visibleBleph,
    SKINCANCER_CASES[0],
  ]

  const dbForFilter = filter === 'all' ? [] : dbStaticCases.filter(c => c.category === filter)

  const allFilteredStatic = [
    ...visiblePonytail,
    ...visibleComprehensive,
    ...visibleBleph,
    ...SKINCANCER_CASES,
  ]

  const visible = hasSanityCases
    ? cases
    : filter === 'skincancer'
      ? SKINCANCER_CASES.slice(0, scVisible)
      : filter === 'all'
        ? ALL_NON_SC
        : [...dbForFilter, ...allFilteredStatic.filter(c => c.category === filter)]
```

- [ ] **Step 5: Check types compile**

```bash
npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors

- [ ] **Step 6: Commit**

```bash
git add app/before-after/page.tsx components/BeforeAfter.tsx
git commit -m "feat: show Supabase cases first in gallery, hide/show static cases"
```

---

### Task 7: Dynamic Case Detail Pages

**Files:**
- Create: `components/DynamicCaseClient.tsx`
- Modify: `app/before-after/comprehensive/[case]/page.tsx`
- Modify: `app/before-after/eyelid/[case]/page.tsx`
- Modify: `app/before-after/midfacelift/[case]/page.tsx`

- [ ] **Step 1: Create `components/DynamicCaseClient.tsx`**

```tsx
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ImageWatermark from '@/components/ImageWatermark'

type LightboxState = { srcs: string[]; index: number } | null

export type DynamicCase = {
  id: string
  gallery: 'comprehensive' | 'eyelid' | 'midfacelift'
  procedures: string[]
  images: string[]
  cover_image: string | null
  display_order: number
  instagram_videos: { url: string; label: string }[]
}

const GALLERY_META: Record<string, { title: string; subtitle: string; backHref: string }> = {
  comprehensive: {
    title: 'Comprehensive Rejuvenation',
    subtitle: 'Face, Neck and Eyes',
    backHref: '/before-after?category=comprehensive',
  },
  eyelid: {
    title: 'Eyelid Rejuvenation',
    subtitle: 'Upper and Lower Blepharoplasty',
    backHref: '/before-after?category=bleph',
  },
  midfacelift: {
    title: 'Mid Facelift',
    subtitle: 'Invisible Access Mid Facelift',
    backHref: '/before-after?category=ponytail',
  },
}

export default function DynamicCaseClient({ dbCase }: { dbCase: DynamicCase }) {
  const [lightbox, setLightbox] = useState<LightboxState>(null)
  const meta = GALLERY_META[dbCase.gallery]

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!lightbox) return
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowLeft') setLightbox(lb => lb && { ...lb, index: (lb.index - 1 + lb.srcs.length) % lb.srcs.length })
      if (e.key === 'ArrowRight') setLightbox(lb => lb && { ...lb, index: (lb.index + 1) % lb.srcs.length })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox])

  return (
    <>
      <Nav />
      <section className="case-detail-section">
        <a className="case-detail-back" href={meta.backHref}>← Before and After</a>

        <div className="case-detail-header">
          <span className="section-label">Patient Case</span>
          <h1 className="case-detail-title">{meta.title}</h1>
          <p className="case-detail-subtitle">{meta.subtitle}</p>
        </div>

        {dbCase.procedures.length > 0 && (
          <div className="case-detail-procedures">
            <span className="section-label">Procedure Details</span>
            <ul className="case-proc-list">
              {dbCase.procedures.map(p => (
                <li key={p} className="case-proc-item">{p}</li>
              ))}
            </ul>
          </div>
        )}

        {dbCase.instagram_videos?.length > 0 && (
          <div className="case-detail-video-link">
            {dbCase.instagram_videos.map(v => (
              <a key={v.url} href={v.url} target="_blank" rel="noopener noreferrer" className="case-video-btn">
                {v.label}
              </a>
            ))}
          </div>
        )}

        <div className="case-detail-grid">
          {dbCase.images.map((src, i) => (
            <div
              key={src}
              className="case-detail-img-wrap"
              onClick={() => setLightbox({ srcs: dbCase.images, index: i })}
              style={{ cursor: 'pointer' }}
            >
              <Image
                src={src}
                alt={`${meta.title} photo ${i + 1}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 33vw"
                style={{ objectFit: 'cover', objectPosition: 'center top' }}
                priority={i === 0}
              />
              <ImageWatermark />
            </div>
          ))}
        </div>
      </section>

      {lightbox && (
        <div className="ba-modal-backdrop" onClick={e => e.target === e.currentTarget && setLightbox(null)}>
          <div className="ba-lightbox">
            <button className="ba-modal-close" onClick={() => setLightbox(null)}>✕</button>
            <div style={{ position: 'relative', width: '100%', maxWidth: '680px', aspectRatio: '3/4' }}>
              <Image
                key={lightbox.srcs[lightbox.index]}
                src={lightbox.srcs[lightbox.index]}
                alt={`${meta.title} photo ${lightbox.index + 1}`}
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
            {lightbox.srcs.length > 1 && (
              <>
                <button className="ba-slide-prev" onClick={() => setLightbox(lb => lb && { ...lb, index: (lb.index - 1 + lb.srcs.length) % lb.srcs.length })}>‹</button>
                <button className="ba-slide-next" onClick={() => setLightbox(lb => lb && { ...lb, index: (lb.index + 1) % lb.srcs.length })}>›</button>
                <div className="ba-slide-dots">
                  {lightbox.srcs.map((_, i) => (
                    <button
                      key={i}
                      className={`ba-slide-dot${i === lightbox.index ? ' active' : ''}`}
                      onClick={() => setLightbox(lb => lb && { ...lb, index: i })}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
      <Footer />
    </>
  )
}
```

- [ ] **Step 2: Update `app/before-after/comprehensive/[case]/page.tsx`**

Replace the entire file with:

```typescript
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { COMPREHENSIVE_CASES_DATA, getCaseBySlug } from '@/lib/comprehensiveCases'
import { supabase } from '@/lib/supabase'
import CaseClient from './CaseClient'
import DynamicCaseClient from '@/components/DynamicCaseClient'

export const dynamicParams = true

export function generateStaticParams() {
  return COMPREHENSIVE_CASES_DATA.map(c => ({ case: c.slug }))
}

export default async function ComprehensiveCasePage({ params }: { params: Promise<{ case: string }> }) {
  const { case: slug } = await params

  const staticData = getCaseBySlug(slug)
  if (staticData) return <CaseClient data={staticData} />

  const { data: dbCase } = await supabase
    .from('cases')
    .select('*')
    .eq('id', slug)
    .eq('gallery', 'comprehensive')
    .single()

  if (dbCase) return <DynamicCaseClient dbCase={dbCase} />

  return (
    <>
      <Nav />
      <section style={{ padding: '160px 40px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 12, color: '#888' }}>Case not found.</p>
      </section>
      <Footer />
    </>
  )
}
```

- [ ] **Step 3: Update `app/before-after/eyelid/[case]/page.tsx`**

Replace the entire file with:

```typescript
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { EYELID_CASES_DATA, getCaseBySlug } from '@/lib/eyelidCases'
import { supabase } from '@/lib/supabase'
import CaseClient from './CaseClient'
import DynamicCaseClient from '@/components/DynamicCaseClient'

export const dynamicParams = true

export function generateStaticParams() {
  return EYELID_CASES_DATA.map(c => ({ case: c.slug }))
}

export default async function EyelidCasePage({ params }: { params: Promise<{ case: string }> }) {
  const { case: slug } = await params

  const staticData = getCaseBySlug(slug)
  if (staticData) return <CaseClient data={staticData} />

  const { data: dbCase } = await supabase
    .from('cases')
    .select('*')
    .eq('id', slug)
    .eq('gallery', 'eyelid')
    .single()

  if (dbCase) return <DynamicCaseClient dbCase={dbCase} />

  return (
    <>
      <Nav />
      <section style={{ padding: '160px 40px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 12, color: '#888' }}>Case not found.</p>
      </section>
      <Footer />
    </>
  )
}
```

- [ ] **Step 4: Update `app/before-after/midfacelift/[case]/page.tsx`**

Replace the entire file with:

```typescript
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { MIDFACELIFT_CASES_DATA, getCaseBySlug } from '@/lib/midfaceliftCases'
import { supabase } from '@/lib/supabase'
import CaseClient from './CaseClient'
import DynamicCaseClient from '@/components/DynamicCaseClient'

export const dynamicParams = true

export function generateStaticParams() {
  return MIDFACELIFT_CASES_DATA.map(c => ({ case: c.slug }))
}

export default async function MidfaceliftCasePage({ params }: { params: Promise<{ case: string }> }) {
  const { case: slug } = await params

  const staticData = getCaseBySlug(slug)
  if (staticData) return <CaseClient data={staticData} />

  const { data: dbCase } = await supabase
    .from('cases')
    .select('*')
    .eq('id', slug)
    .eq('gallery', 'midfacelift')
    .single()

  if (dbCase) return <DynamicCaseClient dbCase={dbCase} />

  return (
    <>
      <Nav />
      <section style={{ padding: '160px 40px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 12, color: '#888' }}>Case not found.</p>
      </section>
      <Footer />
    </>
  )
}
```

- [ ] **Step 5: Verify build**

```bash
npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors

- [ ] **Step 6: Commit and push**

```bash
git add components/DynamicCaseClient.tsx \
  "app/before-after/comprehensive/[case]/page.tsx" \
  "app/before-after/eyelid/[case]/page.tsx" \
  "app/before-after/midfacelift/[case]/page.tsx"
git commit -m "feat: dynamic case detail page for Supabase-uploaded cases"
git push
```

---

### Task 8: Verify End-to-End

- [ ] **Step 1: Confirm Supabase tables exist**

In Supabase dashboard → Table Editor: confirm `cases` and `hidden_cases` tables are present.

- [ ] **Step 2: Confirm storage bucket exists**

In Supabase dashboard → Storage: confirm `before-after` bucket is public.

- [ ] **Step 3: Test in admin**

1. Go to `/admin` → Cases
2. Select "Comprehensive" tab
3. Click "+ Add Case"
4. Enter a procedure name
5. Select 1-2 photos
6. Click a photo to set cover
7. Click "Save Case"
8. Case appears in "Uploaded Cases" list

- [ ] **Step 4: Test gallery display**

1. Go to `/before-after`
2. Uploaded case appears first with its cover image
3. Click it → navigates to `/before-after/comprehensive/{uuid}`
4. Photos display in grid with lightbox

- [ ] **Step 5: Test hide/show**

1. In admin Cases → Existing Cases
2. Click "Hide" on case-01
3. Go to `/before-after` → case-01 no longer shows
4. Back in admin → click "Show" → case-01 reappears

- [ ] **Step 6: Delete test case**

In admin, delete the test case created in Step 3. Confirm it disappears from gallery.
