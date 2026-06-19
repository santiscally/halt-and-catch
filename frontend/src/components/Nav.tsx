import { useState, type MouseEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useScrollNav } from '../hooks/useScrollNav'

const SECTIONS = [
  { id: 'nosotros', label: 'Nosotros' },
  { id: 'servicios', label: 'Servicios' },
  { id: 'clientes', label: 'Clientes' },
  { id: 'notas', label: 'Notas' },
  { id: 'contacto', label: 'Contacto' },
]

interface Props {
  /** true en el Home (nav transparente sobre el hero); false en el resto (siempre sólido). */
  overHero?: boolean
  /** id de la sección activa para el subrayado (solo Home). */
  activeSection?: string | null
}

export function Nav({ overHero = false, activeSection = null }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const scrolled = useScrollNav(overHero)

  const goToSection = (e: MouseEvent, id: string) => {
    e.preventDefault()
    setMenuOpen(false)
    if (location.pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/', { state: { scrollTo: id } })
    }
  }

  const goHome = (e: MouseEvent) => {
    e.preventDefault()
    setMenuOpen(false)
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate('/')
    }
  }

  return (
    <header className={`nav${scrolled ? ' scrolled' : ''}`} id="nav">
      <div className="container nav-inner">
        <a href="/" className="nav-logo" aria-label="Halt & Catch inicio" onClick={goHome}>
          <img src="/img/bulb.png" alt="" className="bulb" />
          <span className="wordmark">
            Halt <span className="amp">&amp;</span> Catch
          </span>
        </a>

        <nav className="nav-links" aria-label="Principal">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`/#${s.id}`}
              data-section={s.id}
              className={activeSection === s.id ? 'active' : ''}
              onClick={(e) => goToSection(e, s.id)}
            >
              {s.label}
            </a>
          ))}
        </nav>

        <a href="https://wa.link/94wlfy" className="nav-cta" target="_blank" rel="noreferrer">
          Agendar llamada
          <svg>
            <use href="#i-arrow" />
          </svg>
        </a>

        <button
          className="nav-mobile-toggle"
          aria-label="Menú"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="4" y1="8" x2="20" y2="8" />
            <line x1="4" y1="16" x2="20" y2="16" />
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="nav-mobile-menu">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`/#${s.id}`} onClick={(e) => goToSection(e, s.id)}>
              {s.label}
            </a>
          ))}
          <a href="https://wa.link/94wlfy" target="_blank" rel="noreferrer">
            Agendar llamada
          </a>
        </div>
      )}
    </header>
  )
}
