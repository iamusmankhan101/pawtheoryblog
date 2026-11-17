import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabase.js'
import { fmtDate } from './useAdminPosts.js'
import Modal from './Modal.jsx'
import { useToast } from './Toast.jsx'
import '../admin.css'

export default function Subscribers() {
  const toast = useToast()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [del, setDel] = useState(null)
  const load = useCallback(() => supabase.from('subscribers').select('*').order('created_at', { ascending: false })
    .then(({ data, error }) => { if (error) toast(error.message, 'error'); setRows(data || []); setLoading(false) }), [])
  useEffect(() => { load() }, [load])

  const shown = rows.filter((r) => r.email.toLowerCase().includes(q.toLowerCase()))
  const remove = async () => {
    const { error } = await supabase.from('subscribers').delete().eq('id', del.id)
    setDel(null)
    if (error) toast(`Delete failed: ${error.message}`, 'error'); else { toast('Subscriber deleted'); load() }
  }
  const exportCsv = () => {
    const csv = 'email,subscribed_at\n' + shown.map((r) => `"${r.email.replace(/"/g, '""')}",${r.created_at}`).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = 'subscribers.csv'; a.click(); URL.revokeObjectURL(a.href)
  }

  return (
    <>
      <div className="adm-head"><h1>Subscribers ({rows.length})</h1>
        <button className="adm-btn primary" disabled={!shown.length} onClick={exportCsv}>Export CSV</button>
      </div>
      <div className="adm-filters"><input type="search" placeholder="Search by email" value={q} onChange={(e) => setQ(e.target.value)} /></div>
      <div className="adm-card adm-tablewrap">
        {loading ? <p className="adm-empty">Loading...</p> : !shown.length ? <p className="adm-empty">No subscribers found.</p> : (
          <table className="adm-table">
            <thead><tr><th>Email</th><th>Subscribed</th><th></th></tr></thead>
            <tbody>{shown.map((r) => (
              <tr key={r.id}><td className="adm-title">{r.email}</td><td className="adm-nowrap">{fmtDate(r.created_at)}</td>
                <td className="adm-actions"><button className="adm-link danger" onClick={() => setDel(r)}>Delete</button></td></tr>))}
            </tbody>
          </table>)}
      </div>
      {del && (
        <Modal title="Delete subscriber?" onClose={() => setDel(null)} actions={<>
          <button className="adm-btn" onClick={() => setDel(null)}>Cancel</button>
          <button className="adm-btn danger" onClick={remove}>Delete</button>
        </>}><p>{del.email} will be removed from the list.</p></Modal>)}
    </>
  )
}
