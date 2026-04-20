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
        <p>Submitted — we will be in touch.</p>
        <p style={{ fontSize: '14px', fontFamily: 'var(--sans)', color: 'var(--mid)' }}>
          All submissions are reviewed personally and responded to within 48 hours.
        </p>
      </div>
    )
  }

  return (
    <form ref={formRef} className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">First Name</label>
          <input className="form-input" name="first_name" type="text" placeholder="First name" required />
        </div>
        <div className="form-group">
          <label className="form-label">Last Name</label>
          <input className="form-input" name="last_name" type="text" placeholder="Last name" required />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Email Address</label>
        <input className="form-input" name="email" type="email" placeholder="your@email.com" required />
      </div>
      <div className="form-group">
        <label className="form-label">Phone Number</label>
        <input className="form-input" name="phone" type="tel" placeholder="+1 (000) 000-0000" />
      </div>
      <div className="form-group">
        <label className="form-label">Area of Interest</label>
        <select className="form-select form-input" name="procedure_interest">
          <option value="" disabled>Select a procedure</option>
          <option>Face & Neck Lift</option>
          <option>Invisible Access Mid Facelift</option>
          <option>Eyelid & Brow Rejuvenation</option>
          <option>Lip Lifting</option>
          <option>Facial Contouring</option>
          <option>Scar Revision</option>
          <option>Hair Restoration</option>
          <option>Skin Cancer Reconstruction</option>
          <option>Not sure — general enquiry</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Tell us about your goals</label>
        <textarea className="form-textarea" name="message" placeholder="Share any context about what you're hoping to achieve, any previous procedures, or questions you have for Dr. Nia." />
      </div>
      {status === 'error' && (
        <p style={{ color: '#c0392b', fontFamily: 'var(--sans)', fontSize: '13px' }}>{errorMsg}</p>
      )}
      <button type="submit" className="form-submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending…' : 'Submit Enquiry →'}
      </button>
      <p className="form-note">All submissions are reviewed personally and responded to within 48 hours. Your information is kept strictly confidential.</p>
    </form>
  )
}
