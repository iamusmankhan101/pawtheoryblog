import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useCategories, useAuthors } from '../useContent.js'
import { supabase } from '../supabase.js'
import { useToast } from './Toast.jsx'
import '../admin.css'

const slugify = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const readTime = (body) => `${Math.max(1, Math.round(body.trim().split(/\s+/).filter(Boolean).length / 200))} min read`
const empty = { title: '', slug: '', excerpt: '', body: '', category: '', author: '', read_time: '', featured: false, status: 'draft', cover_url: '' }
const EXCERPT_MAX = 200

export default function PostEditor() {
  const { id } = useParams()
  const nav = useNavigate()
  const toast = useToast()
  const { categories } = useCategories()
  const { authors } = useAuthors()
  const [f, setF] = useState(empty)
  const [loading, setLoading] = useState(!!id)
  const [slugEdited, setSlugEdited] = useState(!!id)
  const [rtEdited, setRtEdited] = useState(!!id)
  const [errs, setErrs] = useState({})
  const [tab, setTab] = useState('write')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [drag, setDrag] = useState(false)
  const dirty = useRef(false)
  const fileRef = useRef()

  useEffect(() => {
    if (!id) return
    supabase.from('posts').select('*').eq('id', id).maybeSingle().then(({ data }) => {
      if (data) setF({ ...empty, ...data })
      else toast('Post not found', 'error')
      setLoading(false)
    })
  }, [id])

  useEffect(() => {
    const h = (e) => { if (dirty.current) { e.preventDefault(); e.returnValue = '' } }
    window.addEventListener('beforeunload', h)
    return () => window.removeEventListener('beforeunload', h)
  }, [])

  const set = (k, v) => { dirty.current = true; setF((p) => ({ ...p, [k]: v })); setErrs((e) => ({ ...e, [k]: '' })) }
  const onTitle = (v) => { set('title', v); if (!slugEdited) set('slug', slugify(v)) }
  const onBody = (v) => { set('body', v); if (!rtEdited) set('read_time', readTime(v)) }

  const upload = async (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) return toast('File must be an image', 'error')
    if (file.size > 5 * 1024 * 1024) return toast('Image must be under 5MB', 'error')
    setUploading(true)
    const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]+/g, '-')}`
    const { error } = await supabase.storage.from('covers').upload(path, file)
    setUploading(false)
    if (error) return toast(`Upload failed: ${error.message}`, 'error')
    set('cover_url', supabase.storage.from('covers').getPublicUrl(path).data.publicUrl)
  }

  const save = async (e) => {
    e.preventDefault()
    const v = {}
    if (!f.title.trim()) v.title = 'Title is required'
    if (!f.slug.trim()) v.slug = 'Slug is required'
    if (!f.category) v.category = 'Choose a category'
    if (!f.body.trim()) v.body = 'Body is required'
    setErrs(v)
    if (Object.keys(v).length) return
    setSaving(true)
    const { id: _i, created_at, ...row } = f
    const { error } = id ? await supabase.from('posts').update(row).eq('id', id) : await supabase.from('posts').insert(row)
    setSaving(false)
    if (error) {
      if (error.code === '23505') return setErrs({ slug: 'This slug is already used by another post. Choose a different one.' })
      return toast(`Save failed: ${error.message}`, 'error')
    }
    dirty.current = false
    toast(id ? 'Post updated' : 'Post created')
    nav('/admin/posts')
  }

  if (loading) return <p className="adm-muted">Loading...</p>
  const paras = f.body.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean)
  const err = (k) => errs[k] && <span className="adm-error">{errs[k]}</span>

  return (
    <form onSubmit={save} noValidate>
      <div className="adm-head"><h1>{id ? 'Edit post' : 'New post'}</h1><button className="adm-btn primary adm-top-save" disabled={saving || uploading}>{saving ? 'Saving...' : 'Save'}</button></div>
      <div className="adm-editor">
        <div className="adm-card adm-col">
          <label className="adm-field">Title
            <input value={f.title} onChange={(e) => onTitle(e.target.value)} />{err('title')}
          </label>
          <label className="adm-field">Slug
            <span className="adm-pw">
              <input value={f.slug} onChange={(e) => { setSlugEdited(true); set('slug', slugify(e.target.value)) }} />
              <button type="button" className="adm-link" onClick={() => { setSlugEdited(false); set('slug', slugify(f.title)) }}>Regenerate</button>
            </span>{err('slug')}
          </label>
          <label className="adm-field">Excerpt
            <textarea rows="3" maxLength={EXCERPT_MAX} value={f.excerpt || ''} onChange={(e) => set('excerpt', e.target.value)} />
            <small className="adm-muted">{(f.excerpt || '').length}/{EXCERPT_MAX}</small>
          </label>
          <div className="adm-field">
            <div className="adm-tabs">
              <button type="button" className={tab === 'write' ? 'active' : ''} onClick={() => setTab('write')}>Write</button>
              <button type="button" className={tab === 'preview' ? 'active' : ''} onClick={() => setTab('preview')}>Preview</button>
            </div>
            {tab === 'write'
              ? <textarea rows="16" aria-label="Body" value={f.body || ''} onChange={(e) => onBody(e.target.value)} />
              : <div className="adm-preview">{paras.length ? paras.map((p, i) => <p key={i}>{p}</p>) : <p className="adm-muted">Nothing to preview.</p>}</div>}
            <small className="adm-muted">Blank line = new paragraph</small>{err('body')}
          </div>
        </div>
        <div className="adm-col">
          <div className="adm-card adm-col">
            <h3>Publish</h3>
            <label className="adm-field">Status
              <select value={f.status} onChange={(e) => set('status', e.target.value)}>
                <option value="draft">Draft</option><option value="published">Published</option>
              </select>
            </label>
            <label className="adm-check"><input type="checkbox" checked={!!f.featured} onChange={(e) => set('featured', e.target.checked)} /> Featured</label>
            <div className="adm-row">
              <button className="adm-btn primary" disabled={saving || uploading}>{saving ? 'Saving...' : 'Save'}</button>
              <Link className="adm-btn" to="/admin/posts">Cancel</Link>
            </div>
          </div>
          <div className="adm-card adm-col">
            <h3>Details</h3>
            <label className="adm-field">Category
              <select value={f.category} onChange={(e) => set('category', e.target.value)}>
                <option value="">Select...</option>
                {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>{err('category')}
            </label>
            <label className="adm-field">Author
              <select value={f.author || ''} onChange={(e) => set('author', e.target.value)}>
                <option value="">Select...</option>
                {f.author && !authors.some((a) => a.name === f.author) && <option value={f.author}>{f.author}</option>}
                {authors.map((a) => <option key={a.id || a.name} value={a.name}>{a.name}</option>)}
              </select>
            </label>
            <label className="adm-field">Read time
              <input value={f.read_time || ''} onChange={(e) => { setRtEdited(true); set('read_time', e.target.value) }} placeholder="5 min read" />
            </label>
          </div>
          <div className="adm-card adm-col">
            <h3>Cover image</h3>
            {f.cover_url && <img className="adm-cover" src={f.cover_url} alt="Cover preview" />}
            <div className={'adm-drop' + (drag ? ' over' : '')} onClick={() => fileRef.current.click()}
              onDragOver={(e) => { e.preventDefault(); setDrag(true) }} onDragLeave={() => setDrag(false)}
              onDrop={(e) => { e.preventDefault(); setDrag(false); upload(e.dataTransfer.files[0]) }}>
              {uploading ? 'Uploading...' : 'Drag an image here or click to upload (max 5MB)'}
            </div>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => { upload(e.target.files[0]); e.target.value = '' }} />
            {f.cover_url && <button type="button" className="adm-btn" onClick={() => set('cover_url', '')}>Remove image</button>}
          </div>
        </div>
      </div>
      <div className="adm-savebar"><Link className="adm-btn" to="/admin/posts">Cancel</Link><button className="adm-btn primary" disabled={saving || uploading}>{saving ? 'Saving...' : 'Save'}</button></div>
    </form>
  )
}
