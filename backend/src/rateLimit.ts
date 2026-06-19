import type { NextFunction, Request, Response } from 'express'

interface Bucket {
  count: number
  resetAt: number
}

/**
 * Rate limiter en memoria, suficiente para una sola instancia.
 * Pensado para proteger el login de fuerza bruta.
 */
export function rateLimit(opts: { windowMs: number; max: number; message?: string }) {
  const buckets = new Map<string, Bucket>()
  const message = opts.message || 'Demasiados intentos. Probá de nuevo más tarde.'

  // Barrido periódico para no acumular buckets de IPs que no vuelven (evita fuga de memoria).
  const sweep = setInterval(() => {
    const now = Date.now()
    for (const [key, b] of buckets) {
      if (now > b.resetAt) buckets.delete(key)
    }
  }, opts.windowMs)
  sweep.unref()

  return (req: Request, res: Response, next: NextFunction): void => {
    const now = Date.now()
    const key = req.ip || req.socket.remoteAddress || 'unknown'
    let b = buckets.get(key)
    if (!b || now > b.resetAt) {
      b = { count: 0, resetAt: now + opts.windowMs }
      buckets.set(key, b)
    }
    b.count += 1
    if (b.count > opts.max) {
      const retry = Math.ceil((b.resetAt - now) / 1000)
      res.setHeader('Retry-After', String(retry))
      res.status(429).json({ error: message })
      return
    }
    next()
  }
}
