import crypto from 'node:crypto'

const isProd = process.env.NODE_ENV === 'production'

/** Lee una variable obligatoria. En producción falla si falta; en dev usa un default inseguro con aviso. */
function requiredSecret(name: string, devDefault: string): string {
  const v = process.env[name]
  if (v && v.length > 0) return v
  if (isProd) {
    throw new Error(`Falta la variable de entorno ${name} (obligatoria en producción).`)
  }
  // eslint-disable-next-line no-console
  console.warn(
    `[config] ${name} no está definida; usando un valor de desarrollo inseguro. NO usar en producción.`,
  )
  return devDefault
}

function resolveJwtSecret(): string {
  const v = process.env.JWT_SECRET
  if (v && v.length > 0) return v
  if (isProd) {
    throw new Error('Falta la variable de entorno JWT_SECRET (obligatoria en producción).')
  }
  // En dev: secreto efímero (las sesiones no sobreviven a un reinicio, suficiente para desarrollo).
  return crypto.randomBytes(32).toString('hex')
}

export const config = {
  isProd,
  port: parseInt(process.env.PORT || '4000', 10),
  dbPath: process.env.DB_PATH || './data/notas.db',
  adminUser: requiredSecret('ADMIN_USER', 'admin'),
  adminPassword: requiredSecret('ADMIN_PASSWORD', 'changeme'),
  jwtSecret: resolveJwtSecret(),
  cookieName: 'hc_session',
  cookieSecure: process.env.COOKIE_SECURE === 'true',
  sessionHours: 12,
}
