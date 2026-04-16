'use client'

import { useState, useRef } from 'react'
import type { InquiryPayload } from '@/lib/types'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')

    const fd = new FormData(e.currentTarget)
    const payload: InquiryPayload = {
      first_name: fd.get('first_name') as string,
      last_name: fd.get('last_name') as string,
      email: fd.get('email') as string,
      phone: fd.get('phone') as string || undefined,
      procedure_interest: fd.get('procedure_interest') as string || undefined,
      message: fd.get('message') as string || undefined,
    }

    try {
      const res = await fetch('/api/inquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Something went wrong')
      }
      setStatus('success')
      formRef.current?.reset()
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  if (status === 'success') {
    return (
      <div className="form-success">
        <p className="form-success__icon">✦</p>
        <h3>Thank you for reaching out.</h3>
        <p>Dr. Nia's office will contact you within one business day.</p>
      </div>
    )
  }

  return (
    <form ref={formRef} className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="contact-form__row">
        <div className="contact-form__field">
          <label htmlFor="first_name">First Name *</label>
          <input id="first_name" name="first_name" type="text" required />
        </div>
        <div className="contact-form__field">
          <label htmlFor="last_name">Last Name *</label>
          <input id="last_name" name="last_name" type="text" required />
        </div>
      </div>
      <div className="contact-form__field">
        <label htmlFor="email">Email Address *</label>
        <input id="email" name="email" type="email" required />
      </div>
      <div className="contact-form__field">
        <label htmlFor="phone">Phone (optional)</label>
        <input id="phone" name="phone" type="tel" />
      </div>
      <div className="contact-form__field">
        <label htmlFor="procedure_interest">Procedure of Interest</label>
        <input id="procedure_interest" name="procedure_interest" type="text" placeholder="e.g. Rhinoplasty" />
      </div>
      <div className="contact-form__field">
        <label htmlFor="message">Message (optional)</label>
        <textarea id="message" name="message" rows={4} />
      </div>
      {status === 'error' && (
        <p className="contact-form__error">{errorMsg}</p>
      )}
      <button type="submit" className="btn" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending…' : 'Request Consultation'}
      </button>
    </form>
  )
}
