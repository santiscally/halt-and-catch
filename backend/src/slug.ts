// Marcas diacríticas combinantes (U+0300–U+036F) — construidas con escapes para evitar
// ambigüedad de codificación en el archivo fuente.
const COMBINING_MARKS = new RegExp('[\\u0300-\\u036f]', 'g')

/** Convierte un título en un slug ASCII apto para URL. */
export function slugify(s: string): string {
  const base = (s || '')
    .normalize('NFD')
    .replace(COMBINING_MARKS, '') // quita acentos
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '')
  return base || 'nota'
}
