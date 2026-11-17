// After vite build: write dist/article/<slug>/index.html with real title/meta/text so
// crawlers that don't run JS (most AI bots) still see the article. React replaces #root on load.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { SITE, get } from './lib.js'

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const tpl = readFileSync('dist/index.html', 'utf8')
const posts = await get('posts?select=slug,title,excerpt,author,body,cover_url,created_at&status=eq.published')

for (const p of posts) {
  const url = `${SITE}/article/${p.slug}`
  const head = `<title>${esc(p.title)} – PawTheory</title>
    <meta name="description" content="${esc(p.excerpt)}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="article" /><meta property="og:title" content="${esc(p.title)}" />
    <meta property="og:description" content="${esc(p.excerpt)}" />${p.cover_url ? `<meta property="og:image" content="${esc(p.cover_url)}" />` : ''}`
  const body = `<article><h1>${esc(p.title)}</h1><p>${esc(p.author)}</p>` +
    (p.body || '').split(/\n\s*\n/).filter((t) => t.trim()).map((t) => `<p>${esc(t.trim())}</p>`).join('') + '</article>'
  const html = tpl.replace(/<title>.*?<\/title>/, head).replace('<div id="root"></div>', `<div id="root">${body}</div>`)
  mkdirSync(`dist/article/${p.slug}`, { recursive: true })
  writeFileSync(`dist/article/${p.slug}/index.html`, html)
}
console.log(`prerender: ${posts.length} articles`)
