import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabase.js'
import { posts as staticPosts } from '../data.js'
import { useCategories } from '../useContent.js'
import { useAdminPosts, fmtDate } from './useAdminPosts.js'
import { PostsTable } from './PostsList.jsx'
import { useToast } from './Toast.jsx'
import '../admin.css'

export default function Dashboard() {
  const { rows, loading, error, reload } = useAdminPosts()
  const { categories } = useCategories()
  const toast = useToast()
  const [subs, setSubs] = useState({ count: 0, recent: [] })
  const [msgs, setMsgs] = useState({ unread: 0, recent: [] })
  const [importing, setImporting] = useState(false)

  useEffect(() => {
    supabase.from('subscribers').select('*', { count: 'exact' }).order('created_at', { ascending: false }).limit(5)
      .then(({ data, count }) => setSubs({ count: count || 0, recent: data || [] }))
    supabase.from('messages').select('*').order('created_at', { ascending: false }).limit(20)
      .then(({ data }) => setMsgs({ unread: (data || []).filter((m) => !m.read).length, recent: (data || []).slice(0, 5) }))
    supabase.from('messages').select('id', { count: 'exact', head: true }).eq('read', false)
      .then(({ count }) => setMsgs((m) => ({ ...m, unread: count || 0 })))
  }, [])

  const importSamples = useCallback(async () => {
    setImporting(true)
    const payload = staticPosts.map((p) => ({
      slug: p.slug, title: p.title, excerpt: p.excerpt, category: p.category, author: p.author,
      read_time: p.readTime, cover_url: p.image, body: p.body.join('\n\n'), featured: p.featured, status: 'published',
    }))
    const { error } = await supabase.from('posts').insert(payload)
    setImporting(false)
    if (error) toast(`Import failed: ${error.message}`, 'error'); else { toast('Sample articles imported'); reload() }
  }, [])

  const published = rows.filter((r) => r.status === 'published').length
  const counts = {}
  rows.forEach((r) => { counts[r.category] = (counts[r.category] || 0) + 1 })
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 3)
  const catName = (s) => categories.find((c) => c.slug === s)?.name || s
  return (
    <>
      <div className="adm-head"><h1>Dashboard</h1><Link className="adm-btn primary" to="/admin/posts/new">New post</Link></div>
      {error && <p className="adm-error">{error}</p>}
      {!loading && !rows.length && (
        <div className="adm-card adm-row" style={{ marginBottom: 16, alignItems: 'center', justifyContent: 'space-between' }}>
          <span>No posts yet. Import the sample articles (needs the categories and authors seed from the SQL).</span>
          <button className="adm-btn primary" disabled={importing} onClick={importSamples}>{importing ? 'Importing...' : 'Import sample articles'}</button>
        </div>
      )}
      <div className="adm-stats">
        <div className="adm-card adm-stat"><span>Total posts</span><b>{rows.length}</b></div>
        <div className="adm-card adm-stat"><span>Published</span><b>{published}</b></div>
        <div className="adm-card adm-stat"><span>Drafts</span><b>{rows.length - published}</b></div>
        <div className="adm-card adm-stat"><span>Subscribers</span><b>{subs.count}</b></div>
        <div className="adm-card adm-stat"><span>Unread messages</span><b>{msgs.unread}</b></div>
        <div className="adm-card adm-stat"><span>Top categories</span>
          {top.length ? top.map(([s, n]) => <small key={s}>{catName(s)}: {n}</small>) : <small>None yet</small>}
        </div>
      </div>
      <h2 className="adm-h2">Recent posts</h2>
      <div className="adm-card adm-tablewrap">
        {loading ? <p className="adm-empty">Loading...</p> : <PostsTable rows={rows.slice(0, 5)} />}
      </div>
      <div className="adm-grid2">
        <div>
          <h2 className="adm-h2">Recent messages</h2>
          <div className="adm-card adm-mini">
            {msgs.recent.length ? msgs.recent.map((m) => <div key={m.id}><span>{m.read ? '' : '● '}{m.name}</span><span className="adm-muted">{fmtDate(m.created_at)}</span></div>) : <span className="adm-muted">None yet</span>}
            <Link to="/admin/messages" className="adm-link">Open inbox</Link>
          </div>
        </div>
        <div>
          <h2 className="adm-h2">Recent subscribers</h2>
          <div className="adm-card adm-mini">
            {subs.recent.length ? subs.recent.map((s) => <div key={s.id}><span>{s.email}</span><span className="adm-muted">{fmtDate(s.created_at)}</span></div>) : <span className="adm-muted">None yet</span>}
            <Link to="/admin/subscribers" className="adm-link">All subscribers</Link>
          </div>
        </div>
      </div>
    </>
  )
}
