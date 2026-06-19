import { Router } from 'express'
import type { DB } from '../db'
import { getBySlugPublic, listPublicadas } from '../db'

/** Rutas públicas de notas (solo publicadas). */
export function notasRouter(db: DB): Router {
  const router = Router()

  router.get('/', (_req, res) => {
    res.json(listPublicadas(db))
  })

  router.get('/:slug', (req, res) => {
    const nota = getBySlugPublic(db, req.params.slug)
    if (!nota) {
      res.status(404).json({ error: 'Nota no encontrada' })
      return
    }
    res.json(nota)
  })

  return router
}
