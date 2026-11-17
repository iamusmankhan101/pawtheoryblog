import { Link } from 'react-router-dom'

export default function PostCard({ p }) {
  return (
    <article className="card">
      <Link to={`/article/${p.slug}`}>
        <img src={p.image} alt={p.title} loading="lazy" />
        <h3>{p.title}</h3>
      </Link>
      <p className="excerpt">{p.excerpt}</p>
      <div className="author">
        <img src={p.avatar} alt="" />
        <span>{p.author} • {p.date}</span>
      </div>
    </article>
  )
}
