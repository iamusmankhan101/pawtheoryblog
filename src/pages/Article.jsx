import { Link, useParams } from 'react-router-dom'
import { renderMd } from '../markdown.js'
import { useCategories } from '../useContent.js'
import { usePosts, usePost } from '../usePosts.js'
import PostCard from '../components/PostCard.jsx'
import NotFound from './NotFound.jsx'

export default function Article() {
  const { slug } = useParams()
  const { post: p, loading } = usePost(slug)
  const { posts } = usePosts()
  const { categories } = useCategories()
  if (loading) return <p className="muted">Loading...</p>
  if (!p) return <NotFound />
  const c = categories.find((x) => x.slug === p.category) || { slug: p.category, name: p.category }
  const related = posts.filter((x) => x.category === p.category && x.slug !== p.slug).slice(0, 3)
  return (
    <>
      <article className="article">
        <img className="cover" src={p.image} alt={p.title} />
        <Link to={`/category/${c.slug}`} className="cat-badge">{c.name}</Link>
        <h1>{p.title}</h1>
        <div className="author"><img src={p.avatar} alt="" /><span>{p.author} • {p.date} • {p.readTime}</span></div>
        {p.md
          ? <div className="md" dangerouslySetInnerHTML={{ __html: renderMd(p.md) }} />
          : p.body.map((t, i) => <p key={i} className="body">{t}</p>)}
      </article>
      {related.length > 0 && (
        <>
          <h2 className="section-title">Related articles</h2>
          <div className="grid">{related.map((r) => <PostCard key={r.slug} p={r} />)}</div>
        </>
      )}
    </>
  )
}
