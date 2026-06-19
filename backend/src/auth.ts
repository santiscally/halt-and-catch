import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'
import type { CookieOptions, NextFunction, Request, Response } from 'express'
import { config } from './config'

function safeEqual(a: string, b: string): boolean {
  // Comparación de tiempo constante independiente de la longitud de la entrada:
  // se copia `a` dentro de un buffer del tamaño de `b` para que timingSafeEqual
  // siempre se ejecute, y la igualdad de longitud se verifica aparte.
  const target = Buffer.from(b)
  const input = Buffer.alloc(target.length)
  Buffer.from(a).copy(input)
  const match = crypto.timingSafeEqual(input, target)
  return match && a.length === b.length
}

export function checkCredentials(usuario: string, password: string): boolean {
  // Se evalúan ambas comparaciones siempre para no filtrar cuál falló.
  const okUser = safeEqual(usuario, config.adminUser)
  const okPass = safeEqual(password, config.adminPassword)
  return okUser && okPass
}

export function signToken(): string {
  return jwt.sign({ sub: config.adminUser }, config.jwtSecret, {
    expiresIn: `${config.sessionHours}h`,
  })
}

export function verifyToken(token: string): boolean {
  try {
    jwt.verify(token, config.jwtSecret)
    return true
  } catch {
    return false
  }
}

export function readToken(req: Request): string | undefined {
  const cookies = (req as Request & { cookies?: Record<string, string> }).cookies
  return cookies ? cookies[config.cookieName] : undefined
}

export function cookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    sameSite: 'strict',
    secure: config.cookieSecure,
    path: '/',
    maxAge: config.sessionHours * 60 * 60 * 1000,
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token = readToken(req)
  if (token && verifyToken(token)) {
    next()
    return
  }
  res.status(401).json({ error: 'No autorizado' })
}
