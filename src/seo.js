import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { supabase } from './supabase.js'

const BASE_TITLE = 'PawTheory – Pets & Animal Care'
const q = (sel) => document.head.querySelector(sel)

function setTag(sel, make, val) {
  let el = q(sel)
  if (!val) return el?.remove()
  if (!el) { el = make(); document.head.appendChild(el) }
  el.setAttribute(el.tagName === 'LINK' ? 'href' : 'content', val)
}
const meta = (attr, key) => () => { const m = document.createElement('meta'); m.setAttribute(attr, key); return m }
const link = () => { const l = document.createElement('link'); l.rel = 'canonical'; return l }

// Applies admin-defined overrides (page_seo table) to <head> on every route change.
// Without an override: the first page keeps its prerendered tags, later pages fall back to the site default.
export function SeoHead() {
  const { pathname } = useLocation()
  const [map, setMap] = useState({})
  const init = useRef(null)
  if (!init.current) init.current = {
    path: pathname, title: document.title,
    desc: q('meta[name="description"]')?.content, canon: q('link[rel="canonical"]')?.href,
  }
  useEffect(() => {
    if (supabase) supabase.from('page_seo').select('*').then(({ data }) => setMap(Object.fromEntries((data || []).map((r) => [r.path, r]))))
  }, [])
  useEffect(() => {
    if (pathname.startsWith('/admin')) return
    const s = map[pathname.replace(/(.)\/$/, '$1')] || {}
    const first = pathname === init.current.path, i = init.current
    document.title = s.title || (first ? i.title : BASE_TITLE)
    setTag('meta[name="description"]', meta('name', 'description'), s.description || (first ? i.desc : ''))
    setTag('link[rel="canonical"]', link, s.canonical || (first ? i.canon : ''))
    setTag('meta[name="robots"]', meta('name', 'robots'), s.noindex ? 'noindex, follow' : '')
    setTag('meta[property="og:title"]', meta('property', 'og:title'), s.title)
    setTag('meta[property="og:description"]', meta('property', 'og:description'), s.description)
    setTag('meta[property="og:image"]', meta('property', 'og:image'), s.og_image)
  }, [pathname, map])
  return null
}
