import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabase } from '@/lib/supabase'

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function POST(req: Request) {
  const { password } = await req.json()

  // Check Supabase for a custom password first
  const { data } = await supabase.from('admin_credentials').select('password_hash').limit(1)
  const storedHash = data?.[0]?.password_hash

  let valid = false
  if (storedHash) {
    const hash = await hashPassword(password)
    valid = hash === storedHash
  } else {
    // Fall back to env var if no custom password set yet
    valid = password === process.env.ADMIN_PASSWORD
  }

  if (!valid) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
  }

  const cookieStore = await cookies()
  cookieStore.set('jkn_admin', 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  return NextResponse.json({ ok: true })
}
