import { Link } from 'react-router-dom'
import type { Nota } from '../types'
import { fmtFecha, truncate } from '../lib/format'

/** Sección "Notas" del home: muestra las últimas notas (las pasa el Home). */
export function NotesSection({ notas }: { notas: Nota[] }) {
  return (
    <section className="section" id="notas">
      <div className="container">
        <div className="notes-head">
          <div>
            <span className="section-eyebrow reveal">
              <span className="section-num">04 ·</span> Notas
            </span>
            <h2 className="section-title reveal">
              Novedades del mundo
              <br />
              retail y <em>empresarial</em>.
            </h2>
          </div>
          <Link to="/notas" className="notes-link reveal d1">
            Ver todas las notas{' '}
            <svg style={{ width: 14, height: 14 }}>
              <use href="#i-arrow" />
            </svg>
          </Link>
        </div>

        <div className="notes-list">
          {notas.map((n, i) => {
            const d = i ? ' d' + Math.min(i, 3) : ''
            return (
              <Link className={`note-row reveal${d}`} to={`/notas/${n.slug}`} key={n.id}>
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
            )
          })}
        </div>
      </div>
    </section>
  )
}
