import { useState } from 'react'
import { supabase } from '../supabase.js'
import { useCategories } from '../useContent.js'
import Modal from './Modal.jsx'
import { useToast } from './Toast.jsx'
import '../admin.css'

const slugify = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export default function Categories() {
  const { categories: rows, loading, reload } = useCategories()
  const toast = useToast()
  const [edit, setEdit] = useState(null) // {isNew, slug, name, description}
  const [del, setDel] = useState(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const save = async () => {
    const name = edit.name.trim(), slug = edit.isNew ? slugify(edit.slug || name) : edit.slug
    if (!name || !slug) return setErr('Name is required')
    setBusy(true)
    const description = edit.description.trim()
    const { error } = edit.isNew
      ? await supabase.from('categories').insert({ slug, name, description, sort: Math.max(0, ...rows.map((r) => r.sort)) + 10 })
      : await supabase.from('categories').update({ name, description }).eq('slug', slug)
    setBusy(false)
    if (error) return setErr(error.code === '23505' ? 'A category with this slug already exists.' : error.message)
    toast(edit.isNew ? 'Category added' : 'Category updated'); setEdit(null); reload()
  }

  const remove = async () => {
    setBusy(true)
    const { count } = await supabase.from('posts').select('id', { count: 'exact', head: true }).eq('category', del.slug)
    if (count) { setBusy(false); setDel(null); return toast(`"${del.name}" is used by ${count} post(s). Move or delete them first.`, 'error') }
    const { error } = await supabase.from('categories').delete().eq('slug', del.slug)
    setBusy(false); setDel(null)
    if (error) toast(`Delete failed: ${error.message}`, 'error'); else { toast('Category deleted'); reload() }
  }

  const move = async (i, d) => {
    const list = [...rows]; const [x] = list.splice(i, 1); list.splice(i + d, 0, x)
    const changed = list.map((r, n) => [r, (n + 1) * 10]).filter(([r, s]) => r.sort !== s)
    const res = await Promise.all(changed.map(([r, s]) => supabase.from('categories').update({ sort: s }).eq('slug', r.slug)))
    if (res.some((r) => r.error)) toast('Reorder failed', 'error')
    reload()
  }

  return (
    <>
      <div className="adm-head"><h1>Categories</h1>
        <button className="adm-btn primary" onClick={() => { setErr(''); setEdit({ isNew: true, slug: '', name: '', description: '' }) }}>Add category</button>
      </div>
      <div className="adm-card adm-tablewrap">
        {loading ? <p className="adm-empty">Loading...</p> : !rows.length ? <p className="adm-empty">No categories yet.</p> : (
          <table className="adm-table">
            <thead><tr><th>Order</th><th>Name</th><th>Slug</th><th>Description</th><th></th></tr></thead>
            <tbody>{rows.map((r, i) => (
              <tr key={r.slug}>
                <td className="adm-nowrap">
                  <button className="adm-btn" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)}>↑</button>{' '}
                  <button className="adm-btn" aria-label="Move down" disabled={i === rows.length - 1} onClick={() => move(i, 1)}>↓</button>
                </td>
                <td className="adm-title">{r.name}</td><td>{r.slug}</td><td>{r.description}</td>
                <td className="adm-actions">
                  <button className="adm-link" onClick={() => { setErr(''); setEdit({ ...r, isNew: false, description: r.description || '' }) }}>Edit</button>
                  <button className="adm-link danger" onClick={() => setDel(r)}>Delete</button>
                </td>
              </tr>))}
            </tbody>
          </table>)}
      </div>
      {edit && (
        <Modal title={edit.isNew ? 'Add category' : 'Edit category'} onClose={() => !busy && setEdit(null)} actions={<>
          <button className="adm-btn" disabled={busy} onClick={() => setEdit(null)}>Cancel</button>
          <button className="adm-btn primary" disabled={busy} onClick={save}>{busy ? 'Saving...' : 'Save'}</button>
        </>}>
          <div className="adm-col">
            <label className="adm-field">Name<input value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></label>
            <label className="adm-field">Slug
              <input value={edit.isNew ? (edit.slug || slugify(edit.name)) : edit.slug} disabled={!edit.isNew} onChange={(e) => setEdit({ ...edit, slug: slugify(e.target.value) })} />
            </label>
            <label className="adm-field">Description<textarea rows="3" value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} /></label>
            {err && <span className="adm-error">{err}</span>}
          </div>
        </Modal>)}
      {del && (
        <Modal title="Delete category?" onClose={() => !busy && setDel(null)} actions={<>
          <button className="adm-btn" disabled={busy} onClick={() => setDel(null)}>Cancel</button>
          <button className="adm-btn danger" disabled={busy} onClick={remove}>{busy ? 'Deleting...' : 'Delete'}</button>
        </>}><p>"{del.name}" will be removed. Categories used by posts cannot be deleted.</p></Modal>)}
    </>
  )
}
