import type { MouseEvent } from 'react'

function scrollToId(e: MouseEvent, id: string) {
  e.preventDefault()
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg">
        <img id="hero-image" className="hero-bg-img" src="/img/hero.jpg" alt="" />
      </div>
      <div className="hero-scrim" />
      <div className="hero-grain" />

      <div className="container hero-inner">
        <div className="hero-content">
          <h1 className="hero-h1">
            <span className="hl">
              <span>Perfeccionamos y</span>
            </span>
            <span className="hl">
              <span>
                <em>potenciamos</em> tu negocio<span className="dot">.</span>
              </span>
            </span>
          </h1>
          <p className="hero-sub">
            Retails farmacéuticos, consumo masivo, laboratorios y empresas que buscan dar
            un salto de calidad. La inteligencia de negocio y la analítica para la toma de
            decisiones son el futuro de tu organización.
          </p>
          <div className="hero-actions">
            <a href="#contacto" className="btn-primary" onClick={(e) => scrollToId(e, 'contacto')}>
              Conversemos{' '}
              <svg>
                <use href="#i-arrow" />
              </svg>
            </a>
            <a
              href="#servicios"
              className="btn-ghost-light"
              onClick={(e) => scrollToId(e, 'servicios')}
            >
              Ver servicios{' '}
              <svg>
                <use href="#i-arrow-down" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
