import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabase.js'
import { categories as staticCats, authors as staticAuthors, posts as staticPosts } from './data.js'

// Generic table loader. Static data.js is the fallback ONLY when supabase is null.
function useTable(table, orders, fallback) {
  const [rows, setRows] = useState(supabase ? [] : fallback)
  const [loading, setLoading] = useState(!!supabase)
  const reload = useCallback(() => {
    if (!supabase) return Promise.resolve()
    let q = supabase.from(table).select('*')
    orders.forEach((o) => { q = q.order(o) })
    return q.then(({ data }) => { setRows(data || []); setLoading(false) })
  }, [table])
  useEffect(() => { reload() }, [reload])
  return { rows, loading, reload }
}

// usedOnly: public site passes true to hide categories that have no published posts.
export function useCategories(usedOnly = false) {
  const { rows, loading, reload } = useTable('categories', ['sort', 'name'], staticCats)
  const [used, setUsed] = useState(supabase ? null : new Set(staticPosts.map((p) => p.category)))
  useEffect(() => {
    if (!usedOnly || !supabase) return
    supabase.from('posts').select('category').eq('status', 'published')
      .then(({ data }) => setUsed(new Set((data || []).map((r) => r.category))))
  }, [usedOnly])
  const categories = usedOnly ? rows.filter((c) => used?.has(c.slug)) : rows
  return { categories, loading: loading || (usedOnly && !used), reload }
}

export function useAuthors() {
  const { rows, loading, reload } = useTable('authors', ['name'], staticAuthors)
  return { authors: rows, loading, reload }
}
