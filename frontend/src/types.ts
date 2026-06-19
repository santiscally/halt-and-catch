export type EstadoNota = 'publicado' | 'borrador'

export interface Nota {
  id: number
  slug: string
  fecha: string // ISO yyyy-mm-dd
  categoria: string
  titulo: string
  texto: string
  estado: EstadoNota
  created_at?: string
  updated_at?: string
}
