import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useCategories } from '../useContent.js'

export const Logo = ({ light }) => (
  <Link to="/" className={`logo${light ? ' light' : ''}`}>
    <img src={light ? '/logo-white.png' : '/logo.png'} alt="PawTheory" />
  </Link>
)

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { categories } = useCategories(true)
  const [dd, setDd] = useState(false)
  const { pathname, hash } = useLocation()
  const close = () => { setOpen(false); setDd(false) }
  useEffect(close, [pathname, hash])
  return (
    <header className="nav container">
      <Logo />
      <nav className={`links${open ? ' open' : ''}`} onClick={close}>
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/articles">Articles</NavLink>
        <div className={`dropdown${dd ? ' open' : ''}`}>
          <button type="button" className="dd-label" aria-expanded={dd} onClick={(e) => { e.stopPropagation(); setDd(!dd) }}>Categories ▾</button>
          <ul className="dd-menu">
            {categories.map((c) => <li key={c.slug}><Link to={`/category/${c.slug}`}>{c.name}</Link></li>)}
          </ul>
        </div>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/contact">Contact</NavLink>
      </nav>
      <div className="auth">
        <Link to="/#subscribe" className="btn dark">Subscribe</Link>
        <button className="burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>☰</button>
      </div>
    </header>
  )
}
