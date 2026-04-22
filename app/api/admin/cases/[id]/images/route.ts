import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabase } from '@/lib/supabase'

async function requireAuth() {
  const cookieStore = await cookies()
  return cookieStore.get('jkn_admin')?.value === 'authenticated'
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  const { id } = await params

  const { data: caseData, error: fetchError } = await supabase
    .from('cases')
    .select('gallery, images, cover_image')
    .eq('id', id)
    .single()
  if (fetchError || !caseData) return NextResponse.json({ error: 'Case not found' }, { status: 404 })

  const formData = await req.formData()
  const file = formData.get('file') as File
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const path = `${caseData.gallery}/${id}/${Date.now()}.${ext}`

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const { error: uploadError } = await supabase.storage
    .from('before-after')
    .upload(path, buffer, { contentType: file.type })
  if (uploadError) return NextResponse.json({ error: 'Upload failed' }, { status: 500 })

  const { data: { publicUrl } } = supabase.storage
    .from('before-after')
    .getPublicUrl(path)

  const existingImages: string[] = caseData.images ?? []
  const newImages = [...existingImages, publicUrl]
  const isFirst = existingImages.length === 0

  await supabase.from('cases').update({
    images: newImages,
    ...(isFirst ? { cover_image: publicUrl } : {}),
  }).eq('id', id)

  return NextResponse.json({ url: publicUrl })
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  const { id } = await params
  const { url } = await req.json()

  const marker = '/object/public/before-after/'
  const path = url.slice(url.indexOf(marker) + marker.length)
  await supabase.storage.from('before-after').remove([path])

  const { data: caseData } = await supabase
    .from('cases')
    .select('images, cover_image')
    .eq('id', id)
    .single()

  const newImages = (caseData?.images ?? []).filter((u: string) => u !== url)
  const newCover = caseData?.cover_image === url ? (newImages[0] ?? null) : caseData?.cover_image

  await supabase.from('cases').update({ images: newImages, cover_image: newCover }).eq('id', id)
  return NextResponse.json({ ok: true })
}
