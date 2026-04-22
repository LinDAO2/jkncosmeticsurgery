import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabase } from '@/lib/supabase'

async function requireAuth() {
  const cookieStore = await cookies()
  return cookieStore.get('jkn_admin')?.value === 'authenticated'
}

export async function POST(req: Request) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const path = `about/doctor-photo.${ext}`

  const arrayBuffer = await file.arrayBuffer()
  const { error: uploadError } = await supabase.storage
    .from('before-after')
    .upload(path, arrayBuffer, { contentType: file.type, upsert: true })

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 })

  const { data: { publicUrl } } = supabase.storage.from('before-after').getPublicUrl(path)

  // Cache-bust with timestamp
  const urlWithBust = `${publicUrl}?t=${Date.now()}`

  await supabase.from('site_content').upsert(
    { section: 'about', key: 'photo_url', value: urlWithBust },
    { onConflict: 'section,key' }
  )

  return NextResponse.json({ url: urlWithBust })
}
