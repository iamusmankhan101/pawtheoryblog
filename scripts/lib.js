import { readFileSync, existsSync } from 'node:fs'

export const SITE = 'https://pawtheory.site'
const env = { ...process.env }
if (existsSync('.env'))
  for (const l of readFileSync('.env', 'utf8').split('\n')) {
    const m = l.match(/^(\w+)=(.*)$/)
    if (m && !(m[1] in env)) env[m[1]] = m[2].trim()
  }
const url = env.VITE_SUPABASE_URL, key = env.VITE_SUPABASE_ANON_KEY

export const get = async (q) => {
  if (!url || !key) return []
  const r = await fetch(`${url}/rest/v1/${q}`, { headers: { apikey: key, Authorization: `Bearer ${key}` } })
  return r.ok ? r.json() : []
}

