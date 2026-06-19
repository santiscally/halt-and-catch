import type { Nota } from '../types'

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

async function http<T>(url: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
    },
    ...opts,
  })
  if (!res.ok) {
    let msg = `Error ${res.status}`
    try {
      const body = await res.json()
      if (body && body.error) msg = body.error
    } catch {
      /* sin cuerpo JSON */
    }
    throw new ApiError(msg, res.status)
  }
  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

// ----- público -----
export const getNotas = (signal?: AbortSignal) => http<Nota[]>('/api/notas', { signal })
export const getNota = (slug: string, signal?: AbortSignal) =>
  http<Nota>(`/api/notas/${encodeURIComponent(slug)}`, { signal })

// ----- auth (un solo usuario) -----
export const login = (usuario: string, password: string) =>
  http<{ ok: true }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ usuario, password }),
  })
export const logout = () => http<{ ok: true }>('/api/auth/logout', { method: 'POST' })
export const getSession = () =>
  http<{ authenticated: boolean }>('/api/auth/session')

// ----- admin (protegido) -----
export const adminGetNotas = () => http<Nota[]>('/api/admin/notas')
export const adminCreateNota = (n: Partial<Nota>) =>
  http<Nota>('/api/admin/notas', { method: 'POST', body: JSON.stringify(n) })
export const adminUpdateNota = (id: number, n: Partial<Nota>) =>
  http<Nota>(`/api/admin/notas/${id}`, { method: 'PUT', body: JSON.stringify(n) })
export const adminDeleteNota = (id: number) =>
  http<void>(`/api/admin/notas/${id}`, { method: 'DELETE' })
