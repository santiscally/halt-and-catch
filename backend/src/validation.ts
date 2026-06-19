import type { EstadoNota, NotaInput } from './types'

const FECHA_RE = /^\d{4}-\d{2}-\d{2}$/
const ESTADOS: EstadoNota[] = ['publicado', 'borrador']
const MAX = { categoria: 120, titulo: 300, texto: 20000 }

export interface ValidationResult {
  ok: boolean
  error?: string
  data?: Partial<NotaInput>
}

function str(v: unknown): string | null {
  return typeof v === 'string' ? v.trim() : null
}

/**
 * Valida el cuerpo de una nota.
 * requireAll=true para crear (todos los campos), false para actualizar (parcial).
 */
export function validateNota(body: unknown, requireAll: boolean): ValidationResult {
  if (typeof body !== 'object' || body === null) {
    return { ok: false, error: 'Cuerpo inválido' }
  }
  const b = body as Record<string, unknown>
  const data: Partial<NotaInput> = {}

  const has = (k: string) => b[k] !== undefined

  // fecha
  if (requireAll || has('fecha')) {
    const fecha = str(b.fecha)
    if (!fecha || !FECHA_RE.test(fecha)) return { ok: false, error: 'Fecha inválida (use AAAA-MM-DD)' }
    data.fecha = fecha
  }
  // categoria
  if (requireAll || has('categoria')) {
    const categoria = str(b.categoria)
    if (!categoria) return { ok: false, error: 'La categoría es obligatoria' }
    if (categoria.length > MAX.categoria) return { ok: false, error: 'Categoría demasiado larga' }
    data.categoria = categoria
  }
  // titulo
  if (requireAll || has('titulo')) {
    const titulo = str(b.titulo)
    if (!titulo) return { ok: false, error: 'El título es obligatorio' }
    if (titulo.length > MAX.titulo) return { ok: false, error: 'Título demasiado largo' }
    data.titulo = titulo
  }
  // texto
  if (requireAll || has('texto')) {
    const texto = str(b.texto)
    if (!texto) return { ok: false, error: 'El texto es obligatorio' }
    if (texto.length > MAX.texto) return { ok: false, error: 'Texto demasiado largo' }
    data.texto = texto
  }
  // estado
  if (requireAll || has('estado')) {
    const estado = str(b.estado)
    if (!estado || !ESTADOS.includes(estado as EstadoNota)) {
      return { ok: false, error: 'Estado inválido (publicado | borrador)' }
    }
    data.estado = estado as EstadoNota
  }

  if (!requireAll && Object.keys(data).length === 0) {
    return { ok: false, error: 'No se enviaron campos para actualizar' }
  }
  return { ok: true, data }
}
