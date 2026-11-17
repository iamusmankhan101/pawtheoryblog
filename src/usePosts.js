import { useState, useEffect } from 'react'
import { supabase } from './supabase.js'
import { posts as staticPosts } from './data.js'

const fmt = (d) => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

// authors: optional array of author rows; joined by name for avatar_url.
export const mapRow = (r, authors = []) => ({
  slug: r.slug,
  title: r.title,
  excerpt: r.excerpt || '',
  category: r.category,
  author: r.author || '',
  date: fmt(r.created_at),
  readTime: r.read_time || '',
  image: r.cover_url || `https://picsum.photos/seed/${r.slug}/800/600`,
  body: (r.body || '').split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean),
  featured: !!r.featured,
  avatar: authors.find((a) => a.name === r.author)?.avatar_url || `https://i.pravatar.cc/40?u=${encodeURIComponent(r.author || '')}`,
})

const getAuthors = () => supabase.from('authors').select('name,avatar_url').then(({ data }) => data || [])

export function usePosts() {
  const [posts, setPosts] = useState(supabase ? [] : staticPosts)
  const [loading, setLoading] = useState(!!supabase)
  useEffect(() => {
    if (!supabase) return
    Promise.all([
      supabase.from('posts').select('*').eq('status', 'published').order('created_at', { ascending: false }),
      getAuthors(),
    ]).then(([{ data }, authors]) => {
      setPosts((data || []).map((r) => mapRow(r, authors)))
      setLoading(false)
    })
  }, [])
  return { posts, loading }
}

export function usePost(slug) {
  const [post, setPost] = useState(supabase ? null : staticPosts.find((p) => p.slug === slug) || null)
  const [loading, setLoading] = useState(!!supabase)
  useEffect(() => {
    if (!supabase) { setPost(staticPosts.find((p) => p.slug === slug) || null); return }
    setLoading(true)
    Promise.all([
      supabase.from('posts').select('*').eq('slug', slug).eq('status', 'published').maybeSingle(),
      getAuthors(),
    ]).then(([{ data }, authors]) => {
      setPost(data ? mapRow(data, authors) : null)
      setLoading(false)
    })
  }, [slug])
  return { post, loading }
}
