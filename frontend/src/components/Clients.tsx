import { clients } from '../lib/clients'

export function Clients() {
  // Lista duplicada para el loop infinito sin cortes (igual que el original).
  const loop = [...clients, ...clients]

  return (
    <section className="section" id="clientes" style={{ paddingBottom: 80 }}>
      <div className="container">
        <div className="head-split" style={{ marginBottom: 16 }}>
          <div>
            <span className="section-eyebrow reveal">
              <span className="section-num">03 ·</span> Clientes
            </span>
            <h2 className="section-title reveal">
              Empresas que <em>confiaron</em>
              <br />
              en nosotros.
            </h2>
          </div>
          <p className="head-split-text reveal d1">
            Una muestra de las organizaciones que acompañamos en estrategia, BI y desarrollo
            comercial.
          </p>
        </div>
      </div>

      <div className="clients-strip reveal">
        <div className="clients-track">
          {loop.map((c, i) => (
            <span className="client-logo" key={`${c.name}-${i}`}>
              <img src={c.img} alt={c.name} />
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
