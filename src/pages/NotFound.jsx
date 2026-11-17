import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="article">
      <h1>Page not found</h1>
      <p className="body">Sorry, we could not find that page.</p>
      <Link to="/" className="btn dark">Back home</Link>
    </div>
  )
}
