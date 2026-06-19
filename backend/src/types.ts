export type EstadoNota = 'publicado' | 'borrador'

export interface Nota {
  id: number
  slug: string
  fecha: string
  categoria: string
  titulo: string
  texto: string
  estado: EstadoNota
  created_at: string
  updated_at: string
}

export interface NotaInput {
  fecha: string
  categoria: string
  titulo: string
  texto: string
  estado: EstadoNota
}
