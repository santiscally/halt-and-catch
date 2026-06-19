import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Nav } from '../components/Nav'
import { Footer } from '../components/Footer'
import { ApiError, getNota } from '../lib/api'
import type { Nota } from '../types'
import { fmtFecha } from '../lib/format'
import { NotFound } from './NotFound'

type Status = 'loading' | 'ok' | 'notfound' | 'error'

export function NoteDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [nota, setNota] = useState<Nota | null>(null)
  const [status, setStatus] = useState<Status>('loading')

  useEffect(() => {
    if (!slug) return
    const controller = new AbortController()
    setStatus('loading')
    window.scrollTo(0, 0)
    getNota(slug, controller.signal)
      .then((n) => {
        setNota(n)
        setStatus('ok')
      })
      .catch((e) => {
        if (e instanceof DOMException && e.name === 'AbortError') return
        setStatus(e instanceof ApiError && e.status === 404 ? 'notfound' : 'error')
      })
    return () => controller.abort()
  }, [slug])

  if (status === 'notfound') return <NotFound />

  // Párrafos: separar por líneas en blanco; conservar el resto del texto.
  const paragraphs = nota
    ? nota.texto.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
    : []

  return (
    <>
      <Nav />
      <section className="section page-top note-detail">
        <div className="container">
          <Link to="/notas" className="note-back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="20" y1="12" x2="4" y2="12" />
              <polyline points="10 6 4 12 10 18" />
            </svg>
            Volver a notas
          </Link>

          {status === 'loading' && <p className="note-detail-loading">Cargando…</p>}
          {status === 'error' && (
            <p className="note-detail-loading">No pudimos cargar la nota. Probá de nuevo.</p>
          )}

          {status === 'ok' && nota && (
            <article className="note-article">
              <div className="note-detail-meta">
                <span className="note-date">{fmtFecha(nota.fecha)}</span>
                <span className="note-cat">{nota.categoria}</span>
              </div>
              <h1 className="note-detail-title">{nota.titulo}</h1>
              <div className="note-detail-body">
                {paragraphs.length > 0 ? (
                  paragraphs.map((p, i) => <p key={i}>{p}</p>)
                ) : (
                  <p>{nota.texto}</p>
                )}
              </div>
            </article>
          )}
        </div>
      </section>
      <Footer />
    </>
  )
}
