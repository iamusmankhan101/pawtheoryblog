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
  get('posts?select=slug,created_at&status=eq.published'),
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
writeFileSync('public/robots.txt', `User-agent: *\nDisallow: /admin\n\nSitemap: ${SITE}/sitemap.xml\n`)
console.log(`sitemap: ${urls.length} urls`)
