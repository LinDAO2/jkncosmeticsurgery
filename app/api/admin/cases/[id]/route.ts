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
