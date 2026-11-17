import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabase.js'
import { categories as staticCats } from '../data.js'

// one shared fetch for all cards on the page
let namesPromise
const loadNames = () => (namesPromise ||= supabase
  ? supabase.from('categories').select('slug,name').then(({ data }) => Object.fromEntries((data || []).map((c) => [c.slug, c.name])))
  : Promise.resolve(Object.fromEntries(staticCats.map((c) => [c.slug, c.name]))))

export default function PostCard({ p }) {
  const [names, setNames] = useState({})
  useEffect(() => { loadNames().then(setNames) }, [])
  const to = `/article/${p.slug}`
  return (
    <article className="card">
      <Link to={to} className="card-img">
        <img src={p.image} alt={p.title} loading="lazy" />
        <span className="card-badge">{names[p.category] || p.category}</span>
      </Link>
      <div className="card-body">
        <div className="card-meta">{p.date}{p.readTime ? ` · ${p.readTime}` : ''}</div>
        <h3><Link to={to}>{p.title}</Link></h3>
        <p className="excerpt">{p.excerpt}</p>
        <div className="author">
          <img src={p.avatar} alt="" />
          <span>{p.author}</span>
        </div>
      </div>
    </article>
  )
}
