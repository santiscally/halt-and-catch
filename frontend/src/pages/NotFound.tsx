import { Link } from 'react-router-dom'
import { Nav } from '../components/Nav'
import { Footer } from '../components/Footer'

export function NotFound() {
  return (
    <>
      <Nav />
      <section className="section page-top notfound">
        <div className="container">
          <span className="section-eyebrow">
            <span className="section-num">404</span>
          </span>
          <h1 className="section-title">
            Esta página <em>no existe</em>.
          </h1>
          <p className="notfound-copy">
            Puede que el enlace esté roto o que la nota ya no esté disponible.
          </p>
          <Link to="/" className="btn-primary">
            Volver al inicio{' '}
            <svg>
              <use href="#i-arrow" />
            </svg>
          </Link>
        </div>
      </section>
      <Footer />
    </>
  )
}
