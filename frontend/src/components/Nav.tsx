import { useEffect, useRef, useState, type MouseEvent } from 'react'
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
  const toggleRef = useRef<HTMLButtonElement>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const scrolled = useScrollNav(overHero)

  // Cierra el menú y devuelve el foco al botón (para teclado / lectores de pantalla).
  const closeMenu = () => {
    setMenuOpen(false)
    toggleRef.current?.focus()
  }

  // Bloquea el scroll del body y permite cerrar con Escape mientras el menú móvil está abierto.
  useEffect(() => {
    if (!menuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

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
    <header className={`nav${scrolled ? ' scrolled' : ''}${menuOpen ? ' menu-open' : ''}`} id="nav">
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
          ref={toggleRef}
          className={`nav-mobile-toggle${menuOpen ? ' open' : ''}`}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
          aria-controls="nav-mobile-menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="bar" />
          <span className="bar" />
        </button>
      </div>

      <div
        className={`nav-backdrop${menuOpen ? ' show' : ''}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      <div
        className={`nav-mobile-menu${menuOpen ? ' open' : ''}`}
        id="nav-mobile-menu"
        aria-hidden={!menuOpen}
      >
        <nav className="nav-mobile-links" aria-label="Menú móvil">
          {SECTIONS.map((s, i) => (
            <a
              key={s.id}
              href={`/#${s.id}`}
              className={activeSection === s.id ? 'active' : ''}
              onClick={(e) => goToSection(e, s.id)}
            >
              <span className="nmm-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="nmm-label">{s.label}</span>
              <svg className="nmm-arrow" aria-hidden="true">
                <use href="#i-arrow" />
              </svg>
            </a>
          ))}
        </nav>
        <a
          href="https://wa.link/94wlfy"
          className="nav-mobile-cta"
          target="_blank"
          rel="noreferrer"
          onClick={() => setMenuOpen(false)}
        >
          Agendar llamada
          <svg aria-hidden="true">
            <use href="#i-arrow" />
          </svg>
        </a>
      </div>
    </header>
  )
}
