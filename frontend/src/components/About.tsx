import { CountUp } from './CountUp'

export function About() {
  return (
    <section className="section" id="nosotros">
      <div className="container">
        <div className="about-layout">
          <div className="about-head">
            <span className="section-eyebrow reveal">
              <span className="section-num">01 ·</span> Nosotros
            </span>
            <h2 className="section-title reveal">
              El <em>futuro</em> de tu organización.
            </h2>
            <p className="about-standfirst reveal d1">
              Más de 15 años de retail farmacéutico, hoy al servicio de tu empresa.
            </p>
          </div>

          <div className="about-cols">
            <div className="about-entry reveal">
              <span className="about-entry-num">01</span>
              <div>
                <h3>¿Quiénes somos?</h3>
                <p>
                  Somos una consultora integral fundada en 2021, cuyos dueños acompañaron por más
                  de 15 años al retail farmacéutico más importante del país a crecer
                  exponencialmente, en áreas de logística, comercial, marketing y CX, entre otras.
                </p>
                <p>
                  Hoy nuestra mayor motivación es compartir todo ese conocimiento con las empresas
                  —tanto de retail como de otros rubros— para ayudar al camino de la
                  profesionalización, con procesos claros y bases sólidas que permiten crecimientos
                  sostenidos en el tiempo.
                </p>
              </div>
            </div>
            <div className="about-entry reveal d1">
              <span className="about-entry-num">02</span>
              <div>
                <h3>¿Cómo trabajamos?</h3>
                <p>
                  Nos tomamos el tiempo para analizar y relevar los retails y empresas, en las áreas
                  que el cliente desea optimizar o considera que tienen potencial de mejora; y desde
                  nuestro expertise ofrecemos un pantallazo general completo.
                </p>
                <p>
                  Según el desafío, se arman equipos de trabajo —interdisciplinarios o no— y con un
                  objetivo claro y fechas estipuladas se avanza con el proyecto. Priorizamos la
                  comunicación clara vía PM de nuestro lado y de la empresa, para evitar ruidos
                  comunicacionales y ser más eficientes.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="stats reveal d2">
          <div>
            <div className="stat-num">
              <CountUp target={2021} />
            </div>
            <div className="stat-label">Año de fundación de la consultora</div>
          </div>
          <div className="stat-divider">
            <div className="stat-num">
              <sup>+</sup>
              <CountUp target={15} />
            </div>
            <div className="stat-label">
              Años acompañando al retail farmacéutico más importante del país
            </div>
          </div>
          <div className="stat-divider">
            <div className="stat-num">
              <CountUp target={8} />
            </div>
            <div className="stat-label">Áreas de práctica, de lo macro a lo micro</div>
          </div>
        </div>

        <div className="meet reveal">
          <div className="meet-img">
            <img id="meet-image" className="photo-img" src="/img/meet.jpg" alt="" />
          </div>
          <div>
            <span className="meet-eyebrow">Trabajemos juntos</span>
            <h3>
              ¿Querés <em>reunirte</em>
              <br />
              con nosotros?
            </h3>
            <p>
              Envianos tu consulta y nos pondremos en contacto a la brevedad, para brindarte el
              mejor servicio.
            </p>
            <a href="https://wa.link/94wlfy" className="btn-primary" target="_blank" rel="noreferrer">
              Agendar una reunión{' '}
              <svg>
                <use href="#i-arrow" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
