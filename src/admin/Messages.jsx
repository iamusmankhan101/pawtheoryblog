import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabase.js'
import { fmtDate } from './useAdminPosts.js'
import { useToast } from './Toast.jsx'
import '../admin.css'

export const pingUnread = () => window.dispatchEvent(new Event('adm:msgs'))

export default function Messages() {
  const toast = useToast()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(null)
  const load = useCallback(() => supabase.from('messages').select('*').order('created_at', { ascending: false })
    .then(({ data, error }) => { if (error) toast(error.message, 'error'); setRows(data || []); setLoading(false); pingUnread() }), [])
  useEffect(() => { load() }, [load])

  const setRead = async (r, read) => {
    const { error } = await supabase.from('messages').update({ read }).eq('id', r.id)
    if (error) toast(error.message, 'error'); else load()
  }
  const toggle = (r) => { setOpen(open === r.id ? null : r.id); if (!r.read && open !== r.id) setRead(r, true) }
  const remove = async (r) => {
    if (!window.confirm('Delete this message?')) return
    const { error } = await supabase.from('messages').delete().eq('id', r.id)
    if (error) toast(error.message, 'error'); else { toast('Message deleted'); load() }
  }

  return (
    <>
      <div className="adm-head"><h1>Messages ({rows.filter((r) => !r.read).length} unread)</h1></div>
      <div className="adm-card adm-tablewrap">
        {loading ? <p className="adm-empty">Loading...</p> : !rows.length ? <p className="adm-empty">Inbox is empty.</p> : rows.map((r) => (
          <div key={r.id} className={'adm-msg' + (r.read ? '' : ' unread')}>
            <button className="adm-msg-head" onClick={() => toggle(r)}>
              <b>{r.name}</b><span className="adm-muted">{r.email}</span>
              <span className="adm-msg-snip">{open === r.id ? '' : r.message}</span>
              <span className="adm-muted adm-nowrap">{fmtDate(r.created_at)}</span>
            </button>
            {open === r.id && (
              <div className="adm-msg-body">
                <p>{r.message}</p>
                <div className="adm-row">
                  <a className="adm-btn" href={`mailto:${r.email}`}>Reply</a>
                  <button className="adm-btn" onClick={() => setRead(r, !r.read)}>Mark {r.read ? 'unread' : 'read'}</button>
                  <button className="adm-btn danger" onClick={() => remove(r)}>Delete</button>
                </div>
              </div>)}
          </div>))}
      </div>
    </>
  )
}
