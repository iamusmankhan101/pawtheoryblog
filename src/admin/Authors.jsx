import { useState, useRef } from 'react'
import { supabase } from '../supabase.js'
import { useAuthors } from '../useContent.js'
import Modal from './Modal.jsx'
import { useToast } from './Toast.jsx'
import '../admin.css'

const blank = { id: null, name: '', role: '', bio: '', avatar_url: '' }

export default function Authors() {
  const { authors: rows, loading, reload } = useAuthors()
  const toast = useToast()
  const [edit, setEdit] = useState(null)
  const [del, setDel] = useState(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const fileRef = useRef()

  const upload = async (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) return toast('File must be an image', 'error')
    if (file.size > 5 * 1024 * 1024) return toast('Image must be under 5MB', 'error')
    setBusy(true)
    const path = `authors/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]+/g, '-')}`
    const { error } = await supabase.storage.from('covers').upload(path, file)
    setBusy(false)
    if (error) return toast(`Upload failed: ${error.message}`, 'error')
    setEdit((p) => ({ ...p, avatar_url: supabase.storage.from('covers').getPublicUrl(path).data.publicUrl }))
  }

  const save = async () => {
    const name = edit.name.trim()
    if (!name) return setErr('Name is required')
    setBusy(true)
    const row = { name, role: edit.role.trim(), bio: edit.bio.trim(), avatar_url: edit.avatar_url || null }
    let error
    if (edit.id) {
      ;({ error } = await supabase.from('authors').update(row).eq('id', edit.id))
      const old = rows.find((r) => r.id === edit.id)?.name
      // posts reference authors by name, keep them in sync on rename
      if (!error && old && old !== name) await supabase.from('posts').update({ author: name }).eq('author', old)
    } else ({ error } = await supabase.from('authors').insert(row))
    setBusy(false)
    if (error) return setErr(error.code === '23505' ? 'An author with this name already exists.' : error.message)
    toast(edit.id ? 'Author updated' : 'Author added'); setEdit(null); reload()
  }

  const remove = async () => {
    setBusy(true)
    const { count } = await supabase.from('posts').select('id', { count: 'exact', head: true }).eq('author', del.name)
    if (count) { setBusy(false); setDel(null); return toast(`${del.name} has ${count} post(s). Reassign them first.`, 'error') }
    const { error } = await supabase.from('authors').delete().eq('id', del.id)
    setBusy(false); setDel(null)
    if (error) toast(`Delete failed: ${error.message}`, 'error'); else { toast('Author deleted'); reload() }
  }

  return (
    <>
      <div className="adm-head"><h1>Authors</h1>
        <button className="adm-btn primary" onClick={() => { setErr(''); setEdit({ ...blank }) }}>Add author</button>
      </div>
      <div className="adm-card adm-tablewrap">
        {loading ? <p className="adm-empty">Loading...</p> : !rows.length ? <p className="adm-empty">No authors yet.</p> : (
          <table className="adm-table">
            <thead><tr><th></th><th>Name</th><th>Role</th><th>Bio</th><th></th></tr></thead>
            <tbody>{rows.map((r) => (
              <tr key={r.id}>
                <td>{r.avatar_url ? <img className="adm-avatar" src={r.avatar_url} alt="" /> : <span className="adm-avatar" />}</td>
                <td className="adm-title">{r.name}</td><td>{r.role}</td><td>{r.bio}</td>
                <td className="adm-actions">
                  <button className="adm-link" onClick={() => { setErr(''); setEdit({ ...blank, ...r, role: r.role || '', bio: r.bio || '', avatar_url: r.avatar_url || '' }) }}>Edit</button>
                  <button className="adm-link danger" onClick={() => setDel(r)}>Delete</button>
                </td>
              </tr>))}
            </tbody>
          </table>)}
      </div>
      {edit && (
        <Modal title={edit.id ? 'Edit author' : 'Add author'} onClose={() => !busy && setEdit(null)} actions={<>
          <button className="adm-btn" disabled={busy} onClick={() => setEdit(null)}>Cancel</button>
          <button className="adm-btn primary" disabled={busy} onClick={save}>{busy ? 'Saving...' : 'Save'}</button>
        </>}>
          <div className="adm-col">
            <label className="adm-field">Name<input value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></label>
            <label className="adm-field">Role<input value={edit.role} onChange={(e) => setEdit({ ...edit, role: e.target.value })} /></label>
            <label className="adm-field">Bio<textarea rows="3" value={edit.bio} onChange={(e) => setEdit({ ...edit, bio: e.target.value })} /></label>
            <div className="adm-row">
              {edit.avatar_url && <img className="adm-avatar" src={edit.avatar_url} alt="Avatar preview" />}
              <button type="button" className="adm-btn" disabled={busy} onClick={() => fileRef.current.click()}>{edit.avatar_url ? 'Change avatar' : 'Upload avatar'}</button>
              {edit.avatar_url && <button type="button" className="adm-btn" onClick={() => setEdit({ ...edit, avatar_url: '' })}>Remove</button>}
            </div>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => { upload(e.target.files[0]); e.target.value = '' }} />
            {err && <span className="adm-error">{err}</span>}
          </div>
        </Modal>)}
      {del && (
        <Modal title="Delete author?" onClose={() => !busy && setDel(null)} actions={<>
          <button className="adm-btn" disabled={busy} onClick={() => setDel(null)}>Cancel</button>
          <button className="adm-btn danger" disabled={busy} onClick={remove}>{busy ? 'Deleting...' : 'Delete'}</button>
        </>}><p>{del.name} will be removed. Authors with posts cannot be deleted.</p></Modal>)}
    </>
  )
}
