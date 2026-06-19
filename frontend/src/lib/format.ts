export const MESES = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
]

// 2025-01-13 -> "13 · Ene · 2025" (mismo formato que el diseño original)
export function fmtFecha(iso: string): string {
  if (!iso) return ''
  const p = iso.split('-')
  if (p.length < 3) return iso
  const m = Math.max(0, Math.min(11, (parseInt(p[1], 10) || 1) - 1))
  return `${p[2]} · ${MESES[m]} · ${p[0]}`
}

// Trunca igual que el home original: corte en 190 chars sin partir palabras.
export function truncate(text: string, max = 190): string {
  const t = (text || '').trim()
  if (t.length <= max) return t
  return t.slice(0, max).replace(/\s+\S*$/, '') + '…'
}
