import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../supabase.js'
import { useCategories } from '../useContent.js'
import Modal from './Modal.jsx'
import { useToast } from './Toast.jsx'
import '../admin.css'

const STATIC = [['/', 'Home'], ['/articles', 'All articles'], ['/about', 'About'], ['/contact', 'Contact'], ['/terms', 'Terms'], ['/privacy', 'Privacy']]
const blank = { title: '', description: '', canonical: '', og_image: '', noindex: false }

export default function SeoPages() {
  const toast = useToast()
  const { categories } = useCategories()
  const [posts, setPosts] = useState([])
  const [seo, setSeo] = useState({})
  const [loading, setLoading] = useState(true)
  const [edit, setEdit] = useState(null) // { path, label, ...fields }
  const [busy, setBusy] = useState(false)
  const [filter, setFilter] = useState('')

  const load = useCallback(async () => {
    const [p, s] = await Promise.all([
      supabase.from('posts').select('slug,title').order('created_at', { ascending: false }),
      supabase.from('page_seo').select('*'),
    ])
    if (s.error) toast(`SEO table missing? Run the page_seo migration in supabase/schema.sql. (${s.error.message})`, 'error')
    setPosts(p.data || [])
    setSeo(Object.fromEntries((s.data || []).map((r) => [r.path, r])))
    setLoading(false)
  }, [])
  useEffect(() => { load() }, [load])

  const rows = [
    ...STATIC.map(([path, label]) => ({ path, label, kind: 'Page' })),
    ...categories.map((c) => ({ path: `/category/${c.slug}`, label: c.name, kind: 'Category' })),
    ...posts.map((p) => ({ path: `/article/${p.slug}`, label: p.title, kind: 'Article' })),
  ].filter((r) => !filter || (r.label + r.path).toLowerCase().includes(filter.toLowerCase()))

  const save = async () => {
    const { path, label, ...f } = edit
    const v = Object.fromEntries(Object.entries(f).map(([k, x]) => [k, typeof x === 'string' ? x.trim() : x]))
    setBusy(true)
    const empty = !v.title && !v.description && !v.canonical && !v.og_image && !v.noindex
    const { error } = empty
      ? await supabase.from('page_seo').delete().eq('path', path)
      : await supabase.from('page_seo').upsert({ path, ...v, updated_at: new Date().toISOString() })
    setBusy(false)
    if (error) return toast(`Save failed: ${error.message}`, 'error')
    toast('SEO saved. Changes reach crawlers after the next site rebuild.'); setEdit(null); load()
  }

  const set = (k) => (e) => setEdit({ ...edit, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })
  const n = (s, max) => <small className={'adm-muted'} style={s.length > max ? { color: '#b42318' } : undefined}>{s.length}/{max}</small>

  return (
    <>
      <div className="adm-head"><h1>SEO</h1></div>
      <p className="adm-muted">Override the title, meta description, canonical URL and social image for any page. Leave a field blank to keep the default.</p>
      <input placeholder="Filter pages..." value={filter} onChange={(e) => setFilter(e.target.value)} style={{ margin: '12px 0' }} />
      <div className="adm-card adm-tablewrap">
        {loading ? <p className="adm-empty">Loading...</p> : (
          <table className="adm-table">
            <thead><tr><th>Page</th><th>Type</th><th>URL</th><th>SEO title</th><th></th></tr></thead>
            <tbody>{rows.map((r) => {
              const s = seo[r.path]
              return (
                <tr key={r.path}>
                  <td className="adm-title">{r.label}</td><td>{r.kind}</td><td>{r.path}</td>
                  <td>{s ? (s.title || 'Custom') + (s.noindex ? ' · noindex' : '') : <span className="adm-muted">Default</span>}</td>
                  <td className="adm-actions"><button className="adm-link" onClick={() => setEdit({ ...blank, ...s, path: r.path, label: r.label })}>Edit</button></td>
                </tr>)
            })}</tbody>
          </table>)}
      </div>
      {edit && (
        <Modal title={`SEO: ${edit.label}`} onClose={() => !busy && setEdit(null)} actions={<>
          <button className="adm-btn" disabled={busy} onClick={() => setEdit(null)}>Cancel</button>
          <button className="adm-btn primary" disabled={busy} onClick={save}>{busy ? 'Saving...' : 'Save'}</button>
        </>}>
          <div className="adm-col">
            <label className="adm-field">SEO title<input value={edit.title || ''} onChange={set('title')} />{n(edit.title || '', 60)}</label>
            <label className="adm-field">Meta description<textarea rows="3" value={edit.description || ''} onChange={set('description')} />{n(edit.description || '', 160)}</label>
            <label className="adm-field">Canonical URL<input value={edit.canonical || ''} onChange={set('canonical')} placeholder={`https://www.pawtheory.site${edit.path}`} /></label>
            <label className="adm-field">Social image URL<input value={edit.og_image || ''} onChange={set('og_image')} placeholder="https://..." /></label>
            <label className="adm-check"><input type="checkbox" checked={!!edit.noindex} onChange={set('noindex')} /> Hide from search engines (noindex, removed from sitemap)</label>
          </div>
        </Modal>)}
    </>
  )
}
