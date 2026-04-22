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
  const { email, password } = await req.json()

  // Run DB lookup and password hash in parallel, with a 5s timeout on the DB call
  const dbQuery = supabase.from('admin_credentials').select('email, password_hash').limit(1)
  const timeout = new Promise<{ data: null }>((resolve) => setTimeout(() => resolve({ data: null }), 5000))

  const [{ data }, hash] = await Promise.all([
    Promise.race([dbQuery, timeout]),
    hashPassword(password),
  ])
  const stored = data?.[0]

  let valid = false
  if (stored?.password_hash) {
    const emailMatch = stored.email ? stored.email === email : true
    valid = emailMatch && hash === stored.password_hash
  } else {
    // Fall back to env var if no account set up yet
    valid = password === process.env.ADMIN_PASSWORD
  }

  if (!valid) {
    return NextResponse.json({ error: 'Incorrect email or password' }, { status: 401 })
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
