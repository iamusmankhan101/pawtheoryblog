// After vite build: write static HTML (real title/meta/text) for every public page, so crawlers
// that don't run JS (most AI bots) can read them. React replaces #root on load.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { renderMd } from '../src/markdown.js'
import { ABOUT_INTRO, LEGAL, authorSlug } from '../src/siteText.js'
import { SITE, get } from './lib.js'

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const tpl = readFileSync('dist/index.html', 'utf8')
const NAME = 'PawTheory'
const TAGLINE = 'Pets & Animal Care'

let seo = {} // admin overrides from the page_seo table, keyed by path
const ldTag = (o) => `\n    <script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`
const crumbLd = (items) => ldTag({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, ...(path ? { item: SITE + path } : {}) })),
})
const crumbHtml = (items) => `<nav aria-label="Breadcrumb">${items.map(([n, p]) => (p ? `<a href="${p}">${esc(n)}</a>` : esc(n))).join(' › ')}</nav>`

const page = (path, d) => {
  const o = seo[path] || {}
  const { type = 'website', crumbs } = d
  const extraHead = (d.extraHead || '') + (crumbs ? crumbLd(crumbs) : '')
  // breadcrumbs go right after the site nav
  const body = crumbs ? d.body.replace('</nav>', `</nav>${crumbHtml(crumbs)}`) : d.body
  const title = o.title || d.title, desc = o.description || d.desc, image = o.og_image || d.image
  const url = o.canonical || SITE + path
  const head = `<title>${esc(title)}</title>
    <meta name="description" content="${esc(desc)}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="${type}" /><meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(desc)}" /><meta property="og:url" content="${url}" />${o.noindex ? '<meta name="robots" content="noindex, follow" />' : ''}${image ? `<meta property="og:image" content="${esc(image)}" />` : ''}${extraHead}`
  const html = tpl.replace(/<title>.*?<\/title>/, head).replace('<div id="root"></div>', `<div id="root">${body}</div>`)
  if (path !== '/') mkdirSync(`dist${path}`, { recursive: true })
  writeFileSync(path === '/' ? 'dist/index.html' : `dist${path}/index.html`, html)
}

const [posts, cats, authors, seoRows] = await Promise.all([
  get('posts?select=*&status=eq.published&order=created_at.desc'),
  get('categories?select=slug,name,description&order=sort'),
  get('authors?select=*&order=name'),
  get('page_seo?select=*'),
])
seo = Object.fromEntries(seoRows.map((r) => [r.path, r]))
const used = cats.filter((c) => posts.some((p) => p.category === c.slug))

const nav = `<nav><a href="/">Home</a> <a href="/articles">Articles</a> ${used.map((c) => `<a href="/category/${c.slug}">${esc(c.name)}</a>`).join(' ')} <a href="/about">About</a> <a href="/contact">Contact</a></nav>`
const list = (ps) => `<ul>${ps.map((p) => `<li><a href="/article/${p.slug}">${esc(p.title)}</a> – ${esc(p.excerpt)}</li>`).join('')}</ul>`

// Articles
const ld = (p, url) => JSON.stringify({
  '@context': 'https://schema.org', '@type': 'Article',
  headline: p.title, description: p.excerpt || undefined, image: p.cover_url || undefined,
  datePublished: p.created_at, dateModified: p.updated_at || p.created_at, mainEntityOfPage: url,
  author: p.author ? { '@type': 'Person', name: p.author, url: `${SITE}/author/${authorSlug(p.author)}` } : undefined,
  publisher: { '@type': 'Organization', name: NAME, url: SITE },
}).replace(/</g, '\\u003c')
for (const p of posts) {
  const path = `/article/${p.slug}`
  page(path, {
    title: `${p.title} – ${NAME}`, desc: p.excerpt, type: 'article', image: p.cover_url,
    extraHead: `\n    <script type="application/ld+json">${ld(p, SITE + path)}</script>`,
    crumbs: [['Home', '/'], ...(cats.find((c) => c.slug === p.category) ? [[cats.find((c) => c.slug === p.category).name, `/category/${p.category}`]] : []), [p.title]],
    body: `${nav}<article><h1>${esc(p.title)}</h1><p><a href="/author/${authorSlug(p.author)}">${esc(p.author)}</a> • <time datetime="${p.created_at}">${p.created_at.slice(0, 10)}</time>${p.updated_at && new Date(p.updated_at) - new Date(p.created_at) > 864e5 ? ` • Updated <time datetime="${p.updated_at}">${p.updated_at.slice(0, 10)}</time>` : ''}</p>${renderMd(p.body || '')}</article>`,
  })
}

// Home, listings, categories, static pages
page('/', {
  title: `${NAME} – ${TAGLINE}`, desc: ABOUT_INTRO,
  extraHead: ldTag({ '@context': 'https://schema.org', '@graph': [
    { '@type': 'Organization', '@id': `${SITE}/#org`, name: NAME, url: SITE, logo: `${SITE}/logo.png`, description: ABOUT_INTRO },
    { '@type': 'WebSite', '@id': `${SITE}/#site`, name: NAME, url: SITE, publisher: { '@id': `${SITE}/#org` } },
  ] }),
  body: `${nav}<h1>${NAME} – ${TAGLINE}</h1><p>${esc(ABOUT_INTRO)}</p><h2>Latest articles</h2>${list(posts)}`,
})
page('/articles', {
  crumbs: [['Home', '/'], ['All articles']],
  title: `All articles – ${NAME}`, desc: `Every ${NAME} article on dogs, cats, small pets, birds, fish and reptiles.`,
  body: `${nav}<h1>All articles</h1>${list(posts)}`,
})
for (const c of used)
  page(`/category/${c.slug}`, {
    crumbs: [['Home', '/'], [c.name]],
    title: `${c.name} – ${NAME}`, desc: c.description || `${c.name} articles from ${NAME}.`,
    body: `${nav}<h1>${esc(c.name)}</h1><p>${esc(c.description)}</p>${list(posts.filter((p) => p.category === c.slug))}`,
  })
const authorNames = [...new Set(posts.map((p) => p.author).filter(Boolean))]
for (const name of authorNames) {
  const a = authors.find((x) => x.name === name) || { name }
  const path = `/author/${authorSlug(name)}`
  page(path, {
    title: `${name}${a.role ? `, ${a.role}` : ''} – ${NAME}`, desc: a.bio || `Articles by ${name} on ${NAME}.`,
    image: a.avatar_url, crumbs: [['Home', '/'], ['Authors', '/about'], [name]],
    extraHead: ldTag({ '@context': 'https://schema.org', '@type': 'ProfilePage', mainEntity: {
      '@type': 'Person', name, jobTitle: a.role || undefined, description: a.bio || undefined, image: a.avatar_url || undefined, url: SITE + path,
      worksFor: { '@type': 'Organization', name: NAME, url: SITE } } }),
    body: `${nav}<h1>${esc(name)}</h1><p>${esc(a.role)}</p><p>${esc(a.bio)}</p><h2>Articles by ${esc(name)}</h2>${list(posts.filter((p) => p.author === name))}`,
  })
}
page('/about', {
  title: `About ${NAME}`, desc: ABOUT_INTRO,
  body: `${nav}<h1>About ${NAME}</h1><p>${esc(ABOUT_INTRO)}</p><h2>Our experts</h2><ul>${authors.map((a) => `<li><strong><a href="/author/${authorSlug(a.name)}">${esc(a.name)}</a></strong>, ${esc(a.role)}. ${esc(a.bio)}</li>`).join('')}</ul>`,
})
page('/contact', {
  title: `Contact us – ${NAME}`, desc: `Get in touch with the ${NAME} team with questions, feedback or story ideas.`,
  body: `${nav}<h1>Contact us</h1><p>Send us a message with your name, email and question, and we will get back to you soon.</p>`,
})
for (const [slug, l] of Object.entries(LEGAL))
  page(`/${slug}`, {
    title: `${l.title} – ${NAME}`, desc: `${l.title} for ${NAME}. ${l.updated}.`,
    body: `${nav}<h1>${esc(l.title)}</h1><p>${esc(l.updated)}</p>${l.sections.map(([h, t], i) => `<h2>${i + 1}. ${esc(h)}</h2><p>${esc(t)}</p>`).join('')}`,
  })

console.log(`prerender: ${posts.length} articles + ${used.length} categories + ${authorNames.length} authors + 6 pages`)
