import { useState } from 'react'
import { useCategories } from '../useContent.js'
import { usePosts } from '../usePosts.js'
import PostCard from '../components/PostCard.jsx'

export default function Articles() {
  const { posts, loading } = usePosts()
  const { categories } = useCategories()
  const [cat, setCat] = useState('all')
  const [q, setQ] = useState('')
  const shown = posts.filter((p) => (cat === 'all' || p.category === cat) && p.title.toLowerCase().includes(q.toLowerCase()))
  return (
    <>
      <h1 className="section-title">All articles</h1>
      <input className="search" type="search" placeholder="Search by title" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="chips">
        {[{ slug: 'all', name: 'All' }, ...categories].map((c) => (
          <button key={c.slug} className={`chip${cat === c.slug ? ' active' : ''}`} onClick={() => setCat(c.slug)}>{c.name}</button>
        ))}
      </div>
      {loading ? <p className="muted">Loading...</p> : shown.length ? <div className="grid">{shown.map((p) => <PostCard key={p.slug} p={p} />)}</div> : <p className="muted">No articles found.</p>}
    </>
  )
}
