import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { supabase } from '../supabase.js'
import { useCategories } from '../useContent.js'
import { usePosts } from '../usePosts.js'
import PostCard from '../components/PostCard.jsx'

export default function Home() {
  const { posts, loading } = usePosts()
  const { categories } = useCategories()
  const f = posts.find((p) => p.featured) || posts[0]
  const [email, setEmail] = useState('')
  const [done, setDone] = useState('')
  const [busy, setBusy] = useState(false)
  const subscribe = async (e) => {
    e.preventDefault()
    const v = email.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return setDone('Please enter a valid email address.')
    if (supabase) {
      setBusy(true)
      const { error } = await supabase.from('subscribers').insert({ email: v })
      setBusy(false)
      if (error) return setDone(error.code === '23505' ? "You're already subscribed" : 'Sorry, something went wrong. Please try again.')
    }
    setDone('Thanks for subscribing!'); setEmail('')
  }
  const { hash } = useLocation()
  useEffect(() => { if (hash) document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }) }, [hash])
  return (
    <>
      {loading && <p className="muted">Loading...</p>}
      {f && <Link to={`/article/${f.slug}`} className="hero" style={{ backgroundImage: `url(${f.image})` }}>
        <div className="hero-inner">
          <div>
            <span className="label">Featured</span>
            <h1>{f.title}</h1>
            <p>{f.excerpt}</p>
          </div>
          <svg className="arrow" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </div>
      </Link>}

      <h2 className="section-title">Browse by category</h2>
      <div className="tiles">
        {categories.map((c) => <Link key={c.slug} to={`/category/${c.slug}`} className="tile">{c.name}</Link>)}
      </div>

      <h2 className="section-title">Recent articles</h2>
      <div className="grid">{posts.slice(0, 6).map((p) => <PostCard key={p.slug} p={p} />)}</div>
      <div className="more"><Link to="/articles" className="btn dark">View all articles</Link></div>

      <section id="subscribe" className="newsletter">
        <h2>Get pet care tips in your inbox</h2>
        <form onSubmit={subscribe} noValidate>
          <input type="email" required placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button className="btn dark" disabled={busy}>Subscribe</button>
        </form>
        {done && <p role="status" style={{ marginTop: 16 }}>{done}</p>}
      </section>
    </>
  )
}
