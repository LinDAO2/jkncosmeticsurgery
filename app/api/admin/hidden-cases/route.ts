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
