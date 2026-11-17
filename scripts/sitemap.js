// Generates public/sitemap.xml at build time from published posts + categories.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'

const SITE = 'https://pawtheory.site'
const env = { ...process.env }
if (existsSync('.env'))
  for (const l of readFileSync('.env', 'utf8').split('\n')) {
    const m = l.match(/^(\w+)=(.*)$/)
    if (m && !(m[1] in env)) env[m[1]] = m[2].trim()
  }
const url = env.VITE_SUPABASE_URL, key = env.VITE_SUPABASE_ANON_KEY

const get = async (q) => {
  if (!url || !key) return []
  const r = await fetch(`${url}/rest/v1/${q}`, { headers: { apikey: key, Authorization: `Bearer ${key}` } })
  return r.ok ? r.json() : []
}

const [posts, cats] = await Promise.all([
  get('posts?select=slug,title,created_at&status=eq.published&order=created_at.desc'),
  get('categories?select=slug'),
])

const urls = [
  ...['/', '/articles', '/about', '/contact', '/terms', '/privacy'].map((p) => [p]),
  ...cats.map((c) => [`/category/${c.slug}`]),
  ...posts.map((p) => [`/article/${p.slug}`, p.created_at?.slice(0, 10)]),
]
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map(([p, d]) => `  <url><loc>${SITE}${p}</loc>${d ? `<lastmod>${d}</lastmod>` : ''}</url>`).join('\n') + '\n</urlset>\n'

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
