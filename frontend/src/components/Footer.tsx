import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="nav-logo" style={{ gap: 14, flexShrink: 0 }}>
              <img
                src="/img/logo.png"
                alt="Halt & Catch"
                className="logo-img"
                style={{ height: 84 }}
              />
            </Link>
            <p className="footer-tagline">
              Consultoría en inteligencia de negocio, analytics y gestión estratégica.
              Buenos Aires, Argentina.
            </p>
          </div>
          <div className="footer-contact-block">
            <h4>Contacto</h4>
            <ul className="footer-contact">
              <li>
                <a href="https://wa.link/94wlfy" target="_blank" rel="noreferrer">
                  <span className="fc-ico">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 5 5L19 13l2 5v3a1 1 0 0 1-1 1A16 16 0 0 1 4 6a1 1 0 0 1 1-2z" />
                    </svg>
                  </span>
                  +54 9 11 4195-8706
                </a>
              </li>
              <li>
                <a href="mailto:info@haltcatch.com.ar">
                  <span className="fc-ico">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="M3.5 7l8.5 6 8.5-6" />
                    </svg>
                  </span>
                  info@haltcatch.com.ar
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/haltcatch/" target="_blank" rel="noreferrer">
                  <span className="fc-ico">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.2" cy="6.8" r="1" />
                    </svg>
                  </span>
                  @haltcatch
                </a>
              </li>
              <li>
                <span className="fc-text">
                  <span className="fc-ico">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                  </span>
                  Buenos Aires · Argentina
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Halt &amp; Catch · Todos los derechos reservados</span>
          <div className="footer-bottom-links">
            <a href="#">Privacidad</a>
            <a href="#">Términos</a>
            <a href="#">Hecho con criterio en Buenos Aires</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
