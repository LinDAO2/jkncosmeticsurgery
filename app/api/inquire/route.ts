import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { transporter, MAIL_FROM } from '@/lib/mailer'
import type { InquiryPayload } from '@/lib/types'

export async function POST(req: Request) {
  let body: Partial<InquiryPayload>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { first_name, last_name, email, phone, procedure_interest, message } = body

  if (!first_name || !last_name || !email) {
    return NextResponse.json(
      { error: 'first_name, last_name, and email are required' },
      { status: 400 }
    )
  }

  const payload: InquiryPayload = { first_name, last_name, email, phone, procedure_interest, message }

  const { error: dbError } = await supabase.from('inquiries').insert([payload])
  if (dbError) {
    console.error('Supabase insert error:', dbError)
    return NextResponse.json({ error: 'Failed to save inquiry' }, { status: 500 })
  }

  // Use dynamic email list from DB, fall back to sender
  const { data: emailRows } = await supabase.from('notification_emails').select('email')
  const recipients = emailRows && emailRows.length > 0
    ? emailRows.map((r: { email: string }) => r.email)
    : [MAIL_FROM]

  try {
    await transporter.sendMail({
      from: `JKN Cosmetic Surgery <${MAIL_FROM}>`,
      to: recipients,
      replyTo: email,
      subject: `New inquiry from ${first_name} ${last_name}`,
      text: [
        `Name: ${first_name} ${last_name}`,
        `Email: ${email}`,
        phone ? `Phone: ${phone}` : '',
        procedure_interest ? `Procedure: ${procedure_interest}` : '',
        message ? `Message: ${message}` : '',
      ]
        .filter(Boolean)
        .join('\n'),
    })
    console.log('Email sent to:', recipients.join(', '))
  } catch (emailError) {
    console.error('Mail error:', emailError)
  }

  return NextResponse.json({ ok: true })
}
