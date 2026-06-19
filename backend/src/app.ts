import express, { type NextFunction, type Request, type Response } from 'express'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import type { DB } from './db'
import { config } from './config'
import { notasRouter } from './routes/notas'
import { authRouter } from './routes/auth'
import { adminRouter } from './routes/admin'
import { rateLimit } from './rateLimit'

export function createApp(db: DB): express.Express {
  const app = express()

  // Detrás de proxy: confiar en N saltos para que req.ip sea el real (rate limit).
  app.set('trust proxy', config.trustProxy)

  app.use(helmet())
  app.use(express.json({ limit: '256kb' }))
  app.use(cookieParser())

  // Límite global de solicitudes por IP (protección básica ante floods).
  app.use(
    '/api',
    rateLimit({ windowMs: 60 * 1000, max: 300, message: 'Demasiadas solicitudes. Esperá un momento.' }),
  )

  app.get('/api/health', (_req, res) => res.json({ ok: true }))
  app.use('/api/notas', notasRouter(db))
  app.use('/api/auth', authRouter())
  app.use('/api/admin', adminRouter(db))

  // 404 para rutas /api desconocidas
  app.use('/api', (_req, res) => res.status(404).json({ error: 'No encontrado' }))

  // Manejador de errores
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    // eslint-disable-next-line no-console
    console.error('[error]', err)
    res.status(500).json({ error: 'Error interno del servidor' })
  })

  return app
}
