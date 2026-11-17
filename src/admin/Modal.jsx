import { useEffect } from 'react'
import '../admin.css'

export default function Modal({ title, children, onClose, actions }) {
  useEffect(() => {
    const h = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])
  return (
    <div className="adm-overlay" onClick={onClose}>
      <div className="adm-modal" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <div className="adm-modal-body">{children}</div>
        <div className="adm-modal-actions">{actions}</div>
      </div>
    </div>
  )
}
