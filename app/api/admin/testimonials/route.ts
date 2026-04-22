import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabase } from '@/lib/supabase'

async function requireAuth() {
  const cookieStore = await cookies()
  return cookieStore.get('jkn_admin')?.value === 'authenticated'
}

export async function GET() {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('display_order')
  if (error) return NextResponse.json({ error: 'Failed to load' }, { status: 500 })
  return NextResponse.json({ testimonials: data })
}

export async function POST(req: Request) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  const { quote, attribution, display_order } = await req.json()
  if (!quote?.trim() || !attribution?.trim()) {
    return NextResponse.json({ error: 'Quote and attribution are required' }, { status: 400 })
  }
  if (quote.trim().length > 272) {
    return NextResponse.json({ error: 'Review must be 272 characters or fewer' }, { status: 400 })
  }
  const { data, error } = await supabase
    .from('testimonials')
    .insert({ quote: quote.trim(), attribution: attribution.trim(), display_order: display_order ?? 0 })
    .select()
    .single()
  if (error) return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  return NextResponse.json({ testimonial: data })
}
