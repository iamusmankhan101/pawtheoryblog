import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabase.js'

// Admin queries: all posts, drafts included.
export function useAdminPosts() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const reload = useCallback(() => {
    setLoading(true)
    return supabase.from('posts').select('*').order('created_at', { ascending: false }).then(({ data, error }) => {
      setRows(data || [])
      setError(error ? error.message : '')
      setLoading(false)
    })
  }, [])
  useEffect(() => { reload() }, [reload])
  return { rows, loading, error, reload }
}

export const fmtDate = (d) => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
