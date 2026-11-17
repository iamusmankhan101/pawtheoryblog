import { useState, useEffect } from 'react'
import { NavLink, Outlet, useOutletContext, useLocation } from 'react-router-dom'
import { supabase } from '../supabase.js'
import '../admin.css'

export default function AdminLayout() {
  const { session } = useOutletContext()
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const [unread, setUnread] = useState(0)
  useEffect(() => {
    const count = () => supabase.from('messages').select('id', { count: 'exact', head: true }).eq('read', false).then(({ count }) => setUnread(count || 0))
    count()
    window.addEventListener('adm:msgs', count)
    return () => window.removeEventListener('adm:msgs', count)
  }, [pathname])
  useEffect(() => setOpen(false), [pathname])
  const cls = ({ isActive }) => 'adm-nav' + (isActive ? ' active' : '')
  return (
    <div className="adm">
      <aside className={'adm-side' + (open ? ' open' : '')}>
        <div className="adm-logo"><img src="/logo.png" alt="PawTheory" /></div>
        <nav>
          <NavLink end to="/admin" className={cls}>Dashboard</NavLink>
          <NavLink end to="/admin/posts" className={cls}>Posts</NavLink>
          <NavLink to="/admin/posts/new" className={cls}>New post</NavLink>
          <NavLink to="/admin/categories" className={cls}>Categories</NavLink>
          <NavLink to="/admin/authors" className={cls}>Authors</NavLink>
          <NavLink to="/admin/subscribers" className={cls}>Subscribers</NavLink>
          <NavLink to="/admin/messages" className={cls}>Messages{unread > 0 && <span className="adm-count">{unread}</span>}</NavLink>
          <a className="adm-nav" href="/" target="_blank" rel="noreferrer">View site ↗</a>
        </nav>
      </aside>
      {open && <div className="adm-scrim" onClick={() => setOpen(false)} />}
      <div className="adm-main">
        <header className="adm-top">
          <button className="adm-burger" aria-label="Menu" onClick={() => setOpen(!open)}>☰</button>
          <span className="adm-spacer" />
          <span className="adm-muted adm-email" title={session.user.email}>{session.user.email}</span>
          <button className="adm-btn" onClick={() => supabase.auth.signOut()}>Log out</button>
        </header>
        <div className="adm-content"><Outlet /></div>
      </div>
    </div>
  )
}
