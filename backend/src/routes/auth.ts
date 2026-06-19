import { Router } from 'express'
import { checkCredentials, cookieOptions, readToken, signToken, verifyToken } from '../auth'
import { config } from '../config'
import { rateLimit } from '../rateLimit'

/** Rutas de autenticación del único usuario admin. */
export function authRouter(): Router {
  const router = Router()

  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 12,
    message: 'Demasiados intentos de ingreso. Esperá unos minutos.',
  })

  router.post('/login', loginLimiter, (req, res) => {
    const { usuario, password } = (req.body || {}) as { usuario?: unknown; password?: unknown }
    if (typeof usuario !== 'string' || typeof password !== 'string') {
      res.status(400).json({ error: 'Datos inválidos' })
      return
    }
    if (!checkCredentials(usuario, password)) {
      res.status(401).json({ error: 'Usuario o contraseña incorrectos' })
      return
    }
    res.cookie(config.cookieName, signToken(), cookieOptions())
    res.json({ ok: true })
  })

  router.post('/logout', (_req, res) => {
    res.clearCookie(config.cookieName, { ...cookieOptions(), maxAge: undefined })
    res.json({ ok: true })
  })

  router.get('/session', (req, res) => {
    const token = readToken(req)
    res.json({ authenticated: Boolean(token && verifyToken(token)) })
  })

  return router
}
