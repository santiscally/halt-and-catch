import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Nav } from '../components/Nav'
import { Footer } from '../components/Footer'
import { getNotas } from '../lib/api'
import type { Nota } from '../types'
import { fmtFecha, truncate } from '../lib/format'
import { useReveal } from '../hooks/useReveal'

export function NotesListPage() {
  const [notas, setNotas] = useState<Nota[]>([])
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    getNotas(controller.signal)
      .then((d) => {
        setNotas(d)
        setLoading(false)
      })
      .catch((e) => {
        if (e instanceof DOMException && e.name === 'AbortError') return
        setNotas([])
        setLoading(false)
      })
    return () => controller.abort()
  }, [])

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return notas
    return notas.filter((n) =>
      [n.titulo, n.categoria, n.texto].some((f) => (f || '').toLowerCase().includes(term)),
    )
  }, [q, notas])

  useReveal([filtered.length])

  return (
    <>
      <Nav />
      <section className="section page-top" id="notas">
        <div className="container">
          <div className="notes-head">
            <div>
              <span className="section-eyebrow">
                <span className="section-num">04 ·</span> Notas
              </span>
              <h2 className="section-title">
                Todas las <em>novedades</em>.
              </h2>
            </div>
          </div>

          <div className="notes-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.5" y2="16.5" />
            </svg>
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por título, categoría o contenido…"
              aria-label="Buscar notas"
            />
          </div>

          <div className="notes-list">
            {!loading && notas.length === 0 && (
              <p className="notes-empty">Todavía no hay notas publicadas.</p>
            )}
            {!loading && notas.length > 0 && filtered.length === 0 && (
              <p className="notes-empty">No encontramos notas para “{q.trim()}”.</p>
            )}
            {filtered.map((n) => (
              <Link className="note-row reveal" to={`/notas/${n.slug}`} key={n.id}>
                <div className="note-meta">
                  <span className="note-date">{fmtFecha(n.fecha)}</span>
                  <span className="note-cat">{n.categoria}</span>
                </div>
                <div className="note-main">
                  <h3 className="note-title">{n.titulo}</h3>
                  <p className="note-lead">{truncate(n.texto)}</p>
                </div>
                <div className="note-arrow">
                  <svg>
                    <use href="#i-arrow" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
