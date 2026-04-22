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
  const { gallery, procedures, display_order, instagram_videos } = await req.json()
  if (!gallery || !['comprehensive', 'eyelid', 'midfacelift'].includes(gallery)) {
    return NextResponse.json({ error: 'Invalid gallery' }, { status: 400 })
  }
  const { data, error } = await supabase
    .from('cases')
    .insert({ gallery, procedures: procedures ?? [], display_order: display_order ?? 0, instagram_videos: instagram_videos ?? [] })
    .select()
    .single()
  if (error) return NextResponse.json({ error: 'Failed to create' }, { status: 500 })
  return NextResponse.json({ case: data })
}
