import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabase.js'
import { categories as staticCats, authors as staticAuthors } from './data.js'

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

export function useCategories() {
  const { rows, loading, reload } = useTable('categories', ['sort', 'name'], staticCats)
  return { categories: rows, loading, reload }
}

export function useAuthors() {
  const { rows, loading, reload } = useTable('authors', ['name'], staticAuthors)
  return { authors: rows, loading, reload }
}
