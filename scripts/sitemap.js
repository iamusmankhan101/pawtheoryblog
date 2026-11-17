// Generates public/sitemap.xml at build time from published posts + categories.
import { writeFileSync } from 'node:fs'
import { SITE, get } from './lib.js'
const [posts, cats] = await Promise.all([
  get('posts?select=slug,title,created_at&status=eq.published&order=created_at.desc'),
  get('categories?select=slug'),
])

const used = new Set((await get('posts?select=category&status=eq.published')).map((r) => r.category))
const skip = new Set((await get('page_seo?select=path&noindex=eq.true')).map((r) => r.path)) // noindex pages stay out of the sitemap
const urls = [
  ...['/', '/articles', '/about', '/contact', '/terms', '/privacy'].map((p) => [p]),
  ...cats.filter((c) => used.has(c.slug)).map((c) => [`/category/${c.slug}`]),
  ...posts.map((p) => [`/article/${p.slug}`, p.created_at?.slice(0, 10)]),
]
const keep = urls.filter(([p]) => !skip.has(p))
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  keep.map(([p, d]) => `  <url><loc>${SITE}${p}</loc>${d ? `<lastmod>${d}</lastmod>` : ''}</url>`).join('\n') + '\n</urlset>\n'

writeFileSync('public/sitemap.xml', xml)
const bots = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'CCBot', 'cohere-ai', 'Meta-ExternalAgent', 'Bytespider']
writeFileSync('public/robots.txt',
  `User-agent: *\nDisallow: /admin\n\n` + bots.map((b) => `User-agent: ${b}\nAllow: /\nDisallow: /admin\n`).join('\n') + `\nSitemap: ${SITE}/sitemap.xml\n`)

// llms.txt: plain-markdown site map for LLM crawlers
writeFileSync('public/llms.txt',
  `# PawTheory\n\n> Pets & animal care blog.\n\n## Articles\n\n` +
  (posts.map((p) => `- [${p.title || p.slug}](${SITE}/article/${p.slug})`).join('\n') || '- (none yet)') +
  `\n\n## Pages\n\n- [All articles](${SITE}/articles)\n- [About](${SITE}/about)\n- [Contact](${SITE}/contact)\n`)
console.log(`sitemap: ${urls.length} urls`)
