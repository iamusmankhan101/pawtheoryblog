import { useAuthors } from '../useContent.js'
import { ABOUT_INTRO } from '../siteText.js'

export default function About() {
  const { authors } = useAuthors()
  return (
    <div className="article">
      <h1>About PawTheory</h1>
      <p className="body">{ABOUT_INTRO}</p>
      <h2 className="section-title">Our experts</h2>
      <ul>{authors.map((a) => (
        <li key={a.name} className="body">
          {a.avatar_url && <img src={a.avatar_url} alt="" width="40" height="40" style={{ borderRadius: '50%', objectFit: 'cover', verticalAlign: 'middle', marginRight: 8 }} />}
          <strong>{a.name}</strong>, {a.role}. {a.bio}
        </li>
      ))}</ul>
    </div>
  )
}
