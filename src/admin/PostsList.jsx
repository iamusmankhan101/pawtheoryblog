import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCategories } from '../useContent.js'
import { supabase } from '../supabase.js'
import { useAdminPosts, fmtDate } from './useAdminPosts.js'
import Modal from './Modal.jsx'
import { useToast } from './Toast.jsx'
import '../admin.css'

// Shared table; onDelete optional (omitted on dashboard).
export function PostsTable({ rows, onDelete }) {
  const { categories } = useCategories()
  const catName = (s) => categories.find((c) => c.slug === s)?.name || s
  if (!rows.length) return <p className="adm-empty">No posts to show.</p>
  return (
    <table className="adm-table">
      <thead><tr><th></th><th>Title</th><th>Category</th><th>Author</th><th>Status</th><th>Date</th><th></th></tr></thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.id}>
            <td>{r.cover_url ? <img className="adm-thumb" src={r.cover_url} alt="" /> : <span className="adm-thumb" />}</td>
            <td className="adm-title">{r.title}</td>
            <td><span className="adm-badge">{catName(r.category)}</span></td>
            <td>{r.author || '-'}</td>
            <td><span className={`adm-badge ${r.status}`}>{r.status === 'published' ? 'Published' : 'Draft'}</span></td>
            <td className="adm-nowrap">{fmtDate(r.created_at)}</td>
            <td className="adm-actions">
              <Link to={`/admin/posts/${r.id}/edit`}>Edit</Link>
              <a href={`/article/${r.slug}`} target="_blank" rel="noreferrer">View</a>
              {onDelete && <button className="adm-link danger" onClick={() => onDelete(r)}>Delete</button>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default function PostsList() {
  const { rows, loading, error, reload } = useAdminPosts()
  const toast = useToast()
  const { categories } = useCategories()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('')
  const [status, setStatus] = useState('')
  const [target, setTarget] = useState(null)
  const [busy, setBusy] = useState(false)

  const shown = rows.filter((r) =>
    r.title.toLowerCase().includes(q.toLowerCase()) && (!cat || r.category === cat) && (!status || r.status === status))

  const del = async () => {
    setBusy(true)
    const { error } = await supabase.from('posts').delete().eq('id', target.id)
    setBusy(false)
    if (error) toast(`Delete failed: ${error.message}`, 'error')
    else { toast('Post deleted'); reload() }
    setTarget(null)
  }

  return (
    <>
      <div className="adm-head"><h1>Posts</h1><Link className="adm-btn primary" to="/admin/posts/new">New post</Link></div>
      <div className="adm-filters">
        <input type="search" placeholder="Search by title" value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>
      {error && <p className="adm-error">{error}</p>}
      <div className="adm-card adm-tablewrap">
        {loading ? <p className="adm-empty">Loading...</p>
          : !rows.length ? <p className="adm-empty">No posts yet. <Link to="/admin/posts/new">Write your first post</Link>.</p>
          : <PostsTable rows={shown} onDelete={setTarget} />}
      </div>
      {target && (
        <Modal title="Delete post?" onClose={() => !busy && setTarget(null)} actions={<>
          <button className="adm-btn" disabled={busy} onClick={() => setTarget(null)}>Cancel</button>
          <button className="adm-btn danger" disabled={busy} onClick={del}>{busy ? 'Deleting...' : 'Delete'}</button>
        </>}>
          <p>"{target.title}" will be permanently removed. This cannot be undone.</p>
        </Modal>
      )}
    </>
  )
}
