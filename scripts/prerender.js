// After vite build: write static HTML (real title/meta/text) for every public page, so crawlers
// that don't run JS (most AI bots) can read them. React replaces #root on load.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { renderMd } from '../src/markdown.js'
import { ABOUT_INTRO, LEGAL } from '../src/siteText.js'
import { SITE, get } from './lib.js'

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const tpl = readFileSync('dist/index.html', 'utf8')
const NAME = 'PawTheory'
const TAGLINE = 'Pets & Animal Care'

const page = (path, { title, desc, body, extraHead = '', type = 'website', image }) => {
  const url = SITE + path
  const head = `<title>${esc(title)}</title>
    <meta name="description" content="${esc(desc)}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="${type}" /><meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(desc)}" /><meta property="og:url" content="${url}" />${image ? `<meta property="og:image" content="${esc(image)}" />` : ''}${extraHead}`
  const html = tpl.replace(/<title>.*?<\/title>/, head).replace('<div id="root"></div>', `<div id="root">${body}</div>`)
  if (path !== '/') mkdirSync(`dist${path}`, { recursive: true })
  writeFileSync(path === '/' ? 'dist/index.html' : `dist${path}/index.html`, html)
}

const [posts, cats, authors] = await Promise.all([
  get('posts?select=slug,title,excerpt,author,body,cover_url,category,created_at&status=eq.published&order=created_at.desc'),
  get('categories?select=slug,name,description&order=sort'),
  get('authors?select=name,role,bio&order=name'),
])
const used = cats.filter((c) => posts.some((p) => p.category === c.slug))

const nav = `<nav><a href="/">Home</a> <a href="/articles">Articles</a> ${used.map((c) => `<a href="/category/${c.slug}">${esc(c.name)}</a>`).join(' ')} <a href="/about">About</a> <a href="/contact">Contact</a></nav>`
const list = (ps) => `<ul>${ps.map((p) => `<li><a href="/article/${p.slug}">${esc(p.title)}</a> – ${esc(p.excerpt)}</li>`).join('')}</ul>`

// Articles
const ld = (p, url) => JSON.stringify({
  '@context': 'https://schema.org', '@type': 'Article',
  headline: p.title, description: p.excerpt || undefined, image: p.cover_url || undefined,
  datePublished: p.created_at, mainEntityOfPage: url,
  author: p.author ? { '@type': 'Person', name: p.author } : undefined,
  publisher: { '@type': 'Organization', name: NAME, url: SITE },
}).replace(/</g, '\\u003c') // ponytail: no updated_at column, so dateModified is omitted
for (const p of posts) {
  const path = `/article/${p.slug}`
  page(path, {
    title: `${p.title} – ${NAME}`, desc: p.excerpt, type: 'article', image: p.cover_url,
    extraHead: `\n    <script type="application/ld+json">${ld(p, SITE + path)}</script>`,
    body: `${nav}<article><h1>${esc(p.title)}</h1><p>${esc(p.author)} • <time datetime="${p.created_at}">${p.created_at.slice(0, 10)}</time></p>${renderMd(p.body || '')}</article>`,
  })
}

// Home, listings, categories, static pages
page('/', {
  title: `${NAME} – ${TAGLINE}`, desc: ABOUT_INTRO,
  body: `${nav}<h1>${NAME} – ${TAGLINE}</h1><p>${esc(ABOUT_INTRO)}</p><h2>Latest articles</h2>${list(posts)}`,
})
page('/articles', {
  title: `All articles – ${NAME}`, desc: `Every ${NAME} article on dogs, cats, small pets, birds, fish and reptiles.`,
  body: `${nav}<h1>All articles</h1>${list(posts)}`,
})
for (const c of used)
  page(`/category/${c.slug}`, {
    title: `${c.name} – ${NAME}`, desc: c.description || `${c.name} articles from ${NAME}.`,
    body: `${nav}<h1>${esc(c.name)}</h1><p>${esc(c.description)}</p>${list(posts.filter((p) => p.category === c.slug))}`,
  })
page('/about', {
  title: `About ${NAME}`, desc: ABOUT_INTRO,
  body: `${nav}<h1>About ${NAME}</h1><p>${esc(ABOUT_INTRO)}</p><h2>Our experts</h2><ul>${authors.map((a) => `<li><strong>${esc(a.name)}</strong>, ${esc(a.role)}. ${esc(a.bio)}</li>`).join('')}</ul>`,
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

console.log(`prerender: ${posts.length} articles + ${used.length} categories + 6 pages`)
