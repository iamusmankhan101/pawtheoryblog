import { LEGAL as PAGES } from '../siteText.js'

export default function Legal({ page }) {
  const { title, updated, sections } = PAGES[page]
  return (
    <div className="article">
      <h1>{title}</h1>
      <p className="muted">{updated}</p>
      {sections.map(([h, t], i) => (
        <section key={h}>
          <h3 style={{ margin: '28px 0 8px' }}>{i + 1}. {h}</h3>
          <p className="body">{t}</p>
        </section>
      ))}
    </div>
  )
}
