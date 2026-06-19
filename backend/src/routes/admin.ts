import { Router } from 'express'
import type { DB } from '../db'
import { create, listAll, remove, update } from '../db'
import { requireAuth } from '../auth'
import { validateNota } from '../validation'
import type { NotaInput } from '../types'

/** Rutas de administración (CRUD de notas). Todas requieren sesión. */
export function adminRouter(db: DB): Router {
  const router = Router()
  router.use(requireAuth)

  router.get('/notas', (_req, res) => {
    res.json(listAll(db))
  })

  router.post('/notas', (req, res) => {
    const result = validateNota(req.body, true)
    if (!result.ok) {
      res.status(400).json({ error: result.error })
      return
    }
    const nota = create(db, result.data as NotaInput)
    res.status(201).json(nota)
  })

  router.put('/notas/:id', (req, res) => {
    const id = parseInt(req.params.id, 10)
    if (!Number.isInteger(id) || String(id) !== req.params.id) {
      res.status(400).json({ error: 'Id inválido' })
      return
    }
    const result = validateNota(req.body, false)
    if (!result.ok) {
      res.status(400).json({ error: result.error })
      return
    }
    const nota = update(db, id, result.data as Partial<NotaInput>)
    if (!nota) {
      res.status(404).json({ error: 'Nota no encontrada' })
      return
    }
    res.json(nota)
  })

  router.delete('/notas/:id', (req, res) => {
    const id = parseInt(req.params.id, 10)
    if (!Number.isInteger(id) || String(id) !== req.params.id) {
      res.status(400).json({ error: 'Id inválido' })
      return
    }
    const ok = remove(db, id)
    if (!ok) {
      res.status(404).json({ error: 'Nota no encontrada' })
      return
    }
    res.status(204).end()
  })

  return router
}
