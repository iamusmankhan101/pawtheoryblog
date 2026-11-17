import { createContext, useContext, useState, useCallback } from 'react'
import './../admin.css'

const Ctx = createContext(() => {})
export const useToast = () => useContext(Ctx)

export function ToastProvider({ children }) {
  const [items, setItems] = useState([])
  const toast = useCallback((msg, type = 'success') => {
    const id = Math.random()
    setItems((t) => [...t, { id, msg, type }])
    setTimeout(() => setItems((t) => t.filter((x) => x.id !== id)), 4000)
  }, [])
  return (
    <Ctx.Provider value={toast}>
      {children}
      <div className="adm-toasts" role="status" aria-live="polite">
        {items.map((t) => <div key={t.id} className={`adm-toast ${t.type}`}>{t.msg}</div>)}
      </div>
    </Ctx.Provider>
  )
}
