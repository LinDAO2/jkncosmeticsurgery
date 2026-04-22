import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabase } from '@/lib/supabase'

async function requireAuth() {
  const cookieStore = await cookies()
  return cookieStore.get('jkn_admin')
}

export async function GET() {
  if (!await requireAuth()) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  const { data, error } = await supabase.from('notification_emails').select('id, email, created_at').order('created_at')
  if (error) return NextResponse.json({ error: 'Failed to load emails' }, { status: 500 })
  return NextResponse.json({ emails: data })
}

export async function POST(req: Request) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  const { email } = await req.json()
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }
  const { error } = await supabase.from('notification_emails').insert({ email })
  if (error) {
    if (error.code === '23505') return NextResponse.json({ error: 'That email is already added' }, { status: 409 })
    return NextResponse.json({ error: 'Failed to add email' }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: Request) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  const { id } = await req.json()
  const { error } = await supabase.from('notification_emails').delete().eq('id', id)
  if (error) return NextResponse.json({ error: 'Failed to remove email' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
