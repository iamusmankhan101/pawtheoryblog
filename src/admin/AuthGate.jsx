import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { supabase } from '../supabase.js'
import Login from './Login.jsx'
import { ToastProvider } from './Toast.jsx'
import '../admin.css'

export default function AuthGate() {
  const [session, setSession] = useState(undefined)
  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])
  if (!supabase) return <div className="adm-center"><div className="adm-card adm-login"><p>Supabase is not configured. Copy <code>.env.example</code> to <code>.env</code>, fill in your URL and anon key, then restart the dev server.</p></div></div>
  if (session === undefined) return <div className="adm-center"><p className="adm-muted">Loading...</p></div>
  if (!session) return <Login />
  return <ToastProvider><Outlet context={{ session }} /></ToastProvider>
}
