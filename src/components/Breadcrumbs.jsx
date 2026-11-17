import { Link } from 'react-router-dom'

// items: [[name, path], ...]; the last item is the current page (no link).
export default function Breadcrumbs({ items }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      {items.map(([name, to], i) => (
        <span key={name}>{i < items.length - 1 ? <Link to={to}>{name}</Link> : <span aria-current="page">{name}</span>}{i < items.length - 1 && ' › '}</span>
      ))}
    </nav>
  )
}
