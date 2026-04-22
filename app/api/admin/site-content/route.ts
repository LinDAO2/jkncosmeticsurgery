import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabase } from '@/lib/supabase'

async function requireAuth() {
  const cookieStore = await cookies()
  return cookieStore.get('jkn_admin')?.value === 'authenticated'
}

export async function GET() {
  if (!await requireAuth()) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  const { data, error } = await supabase.from('site_content').select('*')
  if (error) return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  return NextResponse.json({ content: data })
}

export async function PUT(req: Request) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  const { section, key, value } = await req.json()
  if (!section || !key) return NextResponse.json({ error: 'Missing section or key' }, { status: 400 })
  const { error } = await supabase
    .from('site_content')
    .upsert({ section, key, value: value ?? '' }, { onConflict: 'section,key' })
  if (error) return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
