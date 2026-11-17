import { useParams } from 'react-router-dom'
import { useCategories } from '../useContent.js'
import { usePosts } from '../usePosts.js'
import PostCard from '../components/PostCard.jsx'
import NotFound from './NotFound.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'

export default function Category() {
  const { slug } = useParams()
  const { posts, loading } = usePosts()
  const { categories, loading: catLoading } = useCategories()
  const c = categories.find((x) => x.slug === slug)
  if (catLoading) return <p className="muted">Loading...</p>
  if (!c) return <NotFound />
  const list = posts.filter((p) => p.category === slug)
  return (
    <>
      <Breadcrumbs items={[['Home', '/'], [c.name]]} />
      <h1 className="section-title">{c.name}</h1>
      <p className="muted">{c.description}</p>
      <div className="grid" style={{ marginTop: 32 }}>{list.map((p) => <PostCard key={p.slug} p={p} />)}</div>
      {loading && <p className="muted">Loading...</p>}
      {!loading && !list.length && <p className="muted">No articles in this category yet.</p>}
    </>
  )
}
