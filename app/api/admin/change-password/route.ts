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
  const cookieStore = await cookies()
  const session = cookieStore.get('jkn_admin')
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { currentPassword, newPassword } = await req.json()

  if (!newPassword || newPassword.length < 8) {
    return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 })
  }

  const currentHash = await hashPassword(currentPassword)

  // Check against stored password or env fallback
  const { data } = await supabase.from('admin_credentials').select('password_hash').limit(1)
  const storedHash = data?.[0]?.password_hash

  const envHash = await hashPassword(process.env.ADMIN_PASSWORD ?? '')
  const currentHashMatchesEnv = currentPassword === process.env.ADMIN_PASSWORD
  const currentHashMatchesStored = storedHash && currentHash === storedHash

  if (!currentHashMatchesEnv && !currentHashMatchesStored) {
    return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 })
  }

  const newHash = await hashPassword(newPassword)
  await supabase.from('admin_credentials').delete().neq('id', 0)
  const { error } = await supabase.from('admin_credentials').insert({ password_hash: newHash })

  if (error) return NextResponse.json({ error: 'Failed to update password' }, { status: 500 })

  return NextResponse.json({ ok: true })
}
