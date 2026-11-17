import { useState } from 'react'
import { supabase } from '../supabase.js'

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [f, setF] = useState({ name: '', email: '', message: '' })
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const on = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    if (supabase) {
      setBusy(true)
      const { error } = await supabase.from('messages').insert({ name: f.name.trim(), email: f.email.trim(), message: f.message.trim() })
      setBusy(false)
      if (error) return setErr('Sorry, your message could not be sent. Please try again later.')
    }
    setSent(true)
  }
  return (
    <div className="article">
      <h1>Contact us</h1>
      {sent ? <p className="body">Thanks! We will get back to you soon.</p> : (
        <form className="form" onSubmit={submit}>
          <input required placeholder="Your name" value={f.name} onChange={on('name')} />
          <input required type="email" placeholder="Email" value={f.email} onChange={on('email')} />
          <textarea required rows="5" placeholder="Message" value={f.message} onChange={on('message')} />
          {err && <p className="muted">{err}</p>}
          <button className="btn dark" disabled={busy}>{busy ? 'Sending...' : 'Send message'}</button>
        </form>
      )}
    </div>
  )
}
