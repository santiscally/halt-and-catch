import { useState, type FormEvent } from 'react'

const CONTACT_EMAIL = 'info@haltcatch.com.ar'

export function Contact() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [sent, setSent] = useState(false)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    // Abre el cliente de correo del visitante precargado con la consulta.
    const subject = `Consulta web${nombre ? ` — ${nombre}` : ''}`
    const body = `Nombre: ${nombre}\nEmail: ${email}\n\n${mensaje}`
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailto
    setSent(true)
  }

  return (
    <section className="contact" id="contacto">
      <div className="container">
        <div className="contact-grid">
          <div>
            <span className="section-eyebrow reveal">
              <span className="section-num" style={{ color: 'rgba(245,241,230,0.5)' }}>
                05 ·
              </span>{' '}
              Contacto
            </span>
            <h2 className="contact-title reveal">
              Conectamos
              <br />
              con tu <em>negocio</em>.
            </h2>
            <p className="contact-copy reveal d1">
              Envianos tu consulta y nos pondremos en contacto a la brevedad para brindarte el mejor
              servicio. Una primera conversación, sin compromiso.
            </p>
            <div className="contact-note reveal d2">
              <span className="contact-note-label">Respondemos en</span>
              <span className="contact-note-value">24 — 48 hs hábiles</span>
            </div>
          </div>

          <form className="form reveal d1" onSubmit={onSubmit}>
            <div className="form-field">
              <label htmlFor="f-name">Nombre y apellido</label>
              <input
                id="f-name"
                type="text"
                placeholder="Cómo te llamás"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label htmlFor="f-email">Correo electrónico</label>
              <input
                id="f-email"
                type="email"
                placeholder="tu@empresa.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label htmlFor="f-msg">Sobre qué querés conversar</label>
              <textarea
                id="f-msg"
                placeholder="Una o dos líneas alcanzan."
                required
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
              />
            </div>
            <button type="submit" className="form-submit">
              <span>{sent ? 'Abrimos tu correo para enviar la consulta' : 'Enviar mensaje'}</span>{' '}
              <svg>
                <use href="#i-arrow" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
