import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabase } from '@/lib/supabase'

async function requireAuth() {
  const cookieStore = await cookies()
  return cookieStore.get('jkn_admin')?.value === 'authenticated'
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  const { quote, attribution, display_order } = await req.json()
  if (!quote?.trim() || !attribution?.trim()) {
    return NextResponse.json({ error: 'Quote and attribution are required' }, { status: 400 })
  }
  const { error } = await supabase
    .from('testimonials')
    .update({ quote: quote.trim(), attribution: attribution.trim(), display_order: display_order ?? 0 })
    .eq('id', params.id)
  if (error) return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  const { error } = await supabase.from('testimonials').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
