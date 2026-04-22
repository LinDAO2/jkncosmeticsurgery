import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function GET() {
  const { data } = await supabase.from('admin_credentials').select('id').limit(1)
  return NextResponse.json({ hasPassword: data && data.length > 0 })
}

export async function POST(req: Request) {
  const { password, masterPassword } = await req.json()

  // Require master password to set up a new account
  if (masterPassword !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Invalid master password' }, { status: 401 })
  }

  if (!password || password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
  }

  const hash = await hashPassword(password)

  // Delete any existing credentials and insert new ones
  await supabase.from('admin_credentials').delete().neq('id', 0)
  const { error } = await supabase.from('admin_credentials').insert({ password_hash: hash })

  if (error) return NextResponse.json({ error: 'Failed to save password' }, { status: 500 })

  return NextResponse.json({ ok: true })
}
