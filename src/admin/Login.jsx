import { useState } from 'react'
import { supabase } from '../supabase.js'
import '../admin.css'

export default function Login() {
  const [f, setF] = useState({ email: '', password: '' })
  const [show, setShow] = useState(false)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async (e) => {
    e.preventDefault()
    setBusy(true); setErr('')
    const { error } = await supabase.auth.signInWithPassword(f)
    if (error) { setErr(error.message); setBusy(false) }
  }
  return (
    <div className="adm-center">
      <form className="adm-card adm-login" onSubmit={submit}>
        <div className="adm-logo"><img src="/logo.png" alt="PawTheory" /></div>
        <h1>Admin sign in</h1>
        <label className="adm-field">Email
          <input required type="email" autoComplete="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
        </label>
        <label className="adm-field">Password
          <span className="adm-pw">
            <input required type={show ? 'text' : 'password'} autoComplete="current-password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
            <button type="button" className="adm-link" onClick={() => setShow(!show)}>{show ? 'Hide' : 'Show'}</button>
          </span>
        </label>
        {err && <p className="adm-error">{err}</p>}
        <button className="adm-btn primary" disabled={busy}>{busy ? 'Signing in...' : 'Sign in'}</button>
      </form>
    </div>
  )
}
