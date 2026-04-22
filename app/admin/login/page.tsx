'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [view, setView] = useState<'signin' | 'signup'>('signin')

  // Sign in state
  const [loginEmail, setLoginEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  // Sign up state
  const [masterPassword, setMasterPassword] = useState('')
  const [setupEmail, setSetupEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [setupError, setSetupError] = useState('')
  const [setupLoading, setSetupLoading] = useState(false)
  const [setupDone, setSetupDone] = useState(false)

  const router = useRouter()

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError('')

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: loginEmail, password }),
    })

    if (res.ok) {
      router.push('/admin')
    } else {
      const data = await res.json()
      setLoginError(data.error || 'Incorrect password')
      setLoginLoading(false)
    }
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setSetupError('')

    if (newPassword !== confirm) { setSetupError('Passwords do not match'); return }
    if (newPassword.length < 8) { setSetupError('Password must be at least 8 characters'); return }

    setSetupLoading(true)
    const res = await fetch('/api/admin/setup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ masterPassword, email: setupEmail, password: newPassword }),
    })

    const data = await res.json()
    if (res.ok) {
      setSetupDone(true)
      setTimeout(() => { setView('signin'); setSetupDone(false) }, 2000)
    } else {
      setSetupError(data.error || 'Something went wrong')
      setSetupLoading(false)
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-box">
        <div className="admin-login-brand">
          <span className="admin-login-logo">JKN</span>
          <span className="admin-login-sub">Practice Portal</span>
        </div>

        <div className="admin-login-tabs">
          <button
            className={`admin-login-tab${view === 'signin' ? ' active' : ''}`}
            onClick={() => setView('signin')}
            type="button"
          >
            Sign In
          </button>
          <button
            className={`admin-login-tab${view === 'signup' ? ' active' : ''}`}
            onClick={() => setView('signup')}
            type="button"
          >
            Set Up Account
          </button>
        </div>

        {view === 'signin' ? (
          <form onSubmit={handleSignIn} className="admin-login-form">
            <div className="admin-login-field">
              <label className="admin-login-label">Email</label>
              <input
                className="admin-login-input"
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="your@email.com"
                autoFocus
                required
              />
            </div>
            <div className="admin-login-field">
              <label className="admin-login-label">Password</label>
              <input
                className="admin-login-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>
            {loginError && <p className="admin-login-error">{loginError}</p>}
            <button className="admin-login-btn" type="submit" disabled={loginLoading}>
              {loginLoading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>
        ) : setupDone ? (
          <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 13, color: '#3d3530', textAlign: 'center', marginTop: 24 }}>
            Password set successfully. Redirecting to sign in…
          </p>
        ) : (
          <form onSubmit={handleSignUp} className="admin-login-form">
            <div className="admin-login-field">
              <label className="admin-login-label">Master Password</label>
              <input
                className="admin-login-input"
                type="password"
                value={masterPassword}
                onChange={(e) => setMasterPassword(e.target.value)}
                placeholder="Provided by your admin"
                required
              />
            </div>
            <div className="admin-login-field">
              <label className="admin-login-label">Email</label>
              <input
                className="admin-login-input"
                type="email"
                value={setupEmail}
                onChange={(e) => setSetupEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>
            <div className="admin-login-field">
              <label className="admin-login-label">New Password</label>
              <input
                className="admin-login-input"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
              />
            </div>
            <div className="admin-login-field">
              <label className="admin-login-label">Confirm Password</label>
              <input
                className="admin-login-input"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat new password"
                required
              />
            </div>
            {setupError && <p className="admin-login-error">{setupError}</p>}
            <button className="admin-login-btn" type="submit" disabled={setupLoading}>
              {setupLoading ? 'Saving…' : 'Create Password →'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
