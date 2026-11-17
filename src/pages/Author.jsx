import { useParams } from 'react-router-dom'
import { useAuthors } from '../useContent.js'
import { usePosts } from '../usePosts.js'
import { authorSlug } from '../siteText.js'
import PostCard from '../components/PostCard.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import NotFound from './NotFound.jsx'

export default function Author() {
  const { slug } = useParams()
  const { authors, loading: aLoading } = useAuthors()
  const { posts, loading } = usePosts()
  if (aLoading) return <p className="muted">Loading...</p>
  const a = authors.find((x) => authorSlug(x.name) === slug)
  if (!a) return <NotFound />
  const list = posts.filter((p) => p.author === a.name)
  return (
    <>
      <Breadcrumbs items={[['Home', '/'], ['Authors', '/about'], [a.name]]} />
      <div className="author-head">
        {a.avatar_url && <img src={a.avatar_url} alt={a.name} />}
        <div><h1 className="section-title">{a.name}</h1><p className="muted">{a.role}</p><p>{a.bio}</p></div>
      </div>
      <h2 className="section-title">Articles by {a.name}</h2>
      <div className="grid">{list.map((p) => <PostCard key={p.slug} p={p} />)}</div>
      {loading && <p className="muted">Loading...</p>}
      {!loading && !list.length && <p className="muted">No articles yet.</p>}
    </>
  )
}
