import { Link } from 'react-router-dom'
import { Logo } from './Navbar.jsx'
import { useCategories } from '../useContent.js'

const link = (c) => ({ label: c.name, to: `/category/${c.slug}` })

export default function Footer() {
  const { categories } = useCategories(true)
  const footerCols = {
    Categories: categories.slice(0, 5).map(link),
    Company: [{ label: 'Contact', to: '/contact' }, { label: 'All articles', to: '/articles' }],
    Resources: categories.slice(5, 8).map(link),
    Legal: [{ label: 'Terms', to: '/terms' }, { label: 'Privacy', to: '/privacy' }],
  }
  return (
    <footer className="container">
      <div className="cta">
        <h2>Join 10,000+ pet lovers</h2>
        <p className="sub">Get weekly care tips, vet advice and adoption stories.</p>
        <div className="cta-btns">
          <Link to="/#subscribe" className="btn outline">Subscribe</Link>
          <Link to="/articles" className="btn light">Read articles</Link>
        </div>
        <div className="cols">
          {Object.entries(footerCols).map(([h, links]) => (
            <div key={h}>
              <h4>{h}</h4>
              <ul>{links.map((l) => <li key={l.label}><Link to={l.to}>{l.label}</Link></li>)}</ul>
            </div>
          ))}
        </div>
        <div className="bottom">
          <Logo light />
          <span>© 2026 PawTheory. All rights reserved.</span>
        </div>
      </div>
    </footer>
  )
}
