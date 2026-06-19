interface Service {
  num: string
  icon: string
  title: string[]
  desc: string
  delay: string
}

const SERVICES: Service[] = [
  {
    num: '/01',
    icon: 'i-finance',
    title: ['Administración', 'y finanzas'],
    desc: 'EBITDA, CAPEX, Cash Flow, sistemas de gestión e inversiones. Consejos para una gestión correcta del flujo de capital del negocio.',
    delay: '',
  },
  {
    num: '/02',
    icon: 'i-trade',
    title: ['Marketing', 'trade'],
    desc: 'Medios digitales y tradicionales, armado de diseños, compra de medios, influencers y email marketing. El marketing es pilar fundamental para destacarse en un mundo completamente digital y con cambios constantes.',
    delay: 'd1',
  },
  {
    num: '/03',
    icon: 'i-comex',
    title: ['Comex'],
    desc: 'Importaciones y exportaciones. Acompañamiento en registros, marcas y todo lo necesario para desembarcar en otros países, como también mejorar costos mediante importación de servicios e insumos productivos/no productivos.',
    delay: 'd2',
  },
  {
    num: '/04',
    icon: 'i-product',
    title: ['Desarrollo', 'de productos'],
    desc: 'Marcas propias, branding, desarrollo de nuevas categorías y diseños, estrategias de comercialización. Todo lo necesario para contar con productos atractivos para el consumidor.',
    delay: 'd3',
  },
  {
    num: '/05',
    icon: 'i-ecom',
    title: ['Ecommerce'],
    desc: 'Desarrollo de tiendas propias, catalogación en tiendas de terceros, estrategias de marketing y comerciales, fechas especiales. Las empresas tienen cada vez más llegada directa al consumidor, y debe seguir potenciándose.',
    delay: '',
  },
  {
    num: '/06',
    icon: 'i-bi',
    title: ['BI y analytics'],
    desc: 'Creación de dashboards, clustering, forecasting, algoritmos de clasificación y regresión. La aplicación de data science y machine learning es fundamental para conseguir insights, atacar problemas y desarrollar nuevas oportunidades.',
    delay: 'd1',
  },
  {
    num: '/07',
    icon: 'i-strategy',
    title: ['Estrategia y', 'desarrollo comercial'],
    desc: 'Análisis de formatos macro y por zonas socioeconómicas. Análisis de departamentos comerciales, definiciones de estrategia por categorías y sugerencias de surtidos. Vamos de macro a micro.',
    delay: 'd2',
  },
  {
    num: '/08',
    icon: 'i-database',
    title: ['Armado', 'de bases'],
    desc: 'Maestros de artículos, catalogaciones, estructuración de árboles de categorías y definición de perfiles de artículos en base al shopper. Para que la información de la empresa sea clara y prolija.',
    delay: 'd3',
  },
]

export function Services() {
  return (
    <section className="section" id="servicios">
      <div className="container">
        <div className="services-feature">
          <div>
            <span className="section-eyebrow reveal">
              <span className="section-num">02 ·</span> Servicios
            </span>
            <h2 className="section-title reveal">
              ¡Nuestros servicios
              <br />
              al alcance de <em>tu mano</em>!
            </h2>
            <p className="services-intro-text reveal d1">
              Ocho prácticas que pueden contratarse por separado o integrarse a un mandato más
              amplio de estrategia y datos. Vamos de lo macro a lo micro para obtener los mejores
              resultados.
            </p>
          </div>
          <div className="services-img reveal d2">
            <img id="services-image" className="photo-img" src="/img/services.jpg" alt="" />
          </div>
        </div>

        <div className="services-grid">
          {SERVICES.map((s) => (
            <article key={s.num} className={`service-card reveal${s.delay ? ' ' + s.delay : ''}`}>
              <span className="service-num">{s.num}</span>
              <svg className="service-icon">
                <use href={`#${s.icon}`} />
              </svg>
              <h3 className="service-title">
                {s.title.map((line, i) => (
                  <span key={i}>
                    {i > 0 && <br />}
                    {line}
                  </span>
                ))}
              </h3>
              <p className="service-desc">{s.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
