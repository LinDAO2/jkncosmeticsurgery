import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabase } from '@/lib/supabase'

async function requireAuth() {
  const cookieStore = await cookies()
  return cookieStore.get('jkn_admin')?.value === 'authenticated'
}

export async function GET() {
  if (!await requireAuth()) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  const { data, error } = await supabase.from('services').select('*').order('display_order', { ascending: true })
  if (error) return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  return NextResponse.json({ services: data })
}

export async function POST(req: Request) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  const body = await req.json()
  const { data, error } = await supabase
    .from('services')
    .insert({ name: body.name, price: body.price ?? '', description: body.description ?? '', display_order: body.display_order ?? 0 })
    .select()
    .single()
  if (error) return NextResponse.json({ error: 'Failed to create' }, { status: 500 })
  return NextResponse.json({ service: data })
}
