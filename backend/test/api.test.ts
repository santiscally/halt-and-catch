import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import type { Express } from 'express'
import { createApp } from '../src/app'
import { initDb, type DB } from '../src/db'
import type { Nota } from '../src/types'

// Credenciales de dev (config usa estos defaults cuando NODE_ENV !== 'production').
const USER = 'admin'
const PASS = 'changeme'

let db: DB
let app: Express

beforeAll(() => {
  db = initDb(':memory:')
  app = createApp(db)
})

afterAll(() => {
  db.close()
})

async function loginAgent() {
  const agent = request.agent(app)
  const res = await agent.post('/api/auth/login').send({ usuario: USER, password: PASS })
  expect(res.status).toBe(200)
  return agent
}

describe('salud y notas públicas', () => {
  it('GET /api/health responde ok', async () => {
    const res = await request(app).get('/api/health')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ ok: true })
  })

  it('GET /api/notas devuelve las 3 notas seed publicadas', async () => {
    const res = await request(app).get('/api/notas')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBe(3)
    for (const n of res.body as Nota[]) expect(n.estado).toBe('publicado')
  })

  it('GET /api/notas/:slug devuelve una nota y 404 si no existe', async () => {
    const list = (await request(app).get('/api/notas')).body as Nota[]
    const slug = list[0].slug
    const ok = await request(app).get(`/api/notas/${slug}`)
    expect(ok.status).toBe(200)
    expect(ok.body.slug).toBe(slug)

    const missing = await request(app).get('/api/notas/no-existe-xyz')
    expect(missing.status).toBe(404)
  })
})

describe('autenticación', () => {
  it('rechaza el panel sin sesión', async () => {
    const res = await request(app).get('/api/admin/notas')
    expect(res.status).toBe(401)
  })

  it('rechaza credenciales incorrectas', async () => {
    const res = await request(app).post('/api/auth/login').send({ usuario: USER, password: 'mal' })
    expect(res.status).toBe(401)
  })

  it('login correcto habilita la sesión', async () => {
    const agent = await loginAgent()
    const session = await agent.get('/api/auth/session')
    expect(session.body.authenticated).toBe(true)
    const panel = await agent.get('/api/admin/notas')
    expect(panel.status).toBe(200)
  })

  it('logout cierra la sesión', async () => {
    const agent = await loginAgent()
    await agent.post('/api/auth/logout')
    const panel = await agent.get('/api/admin/notas')
    expect(panel.status).toBe(401)
  })
})

describe('ABM de notas (admin)', () => {
  it('crea una nota publicada y aparece en el listado público', async () => {
    const agent = await loginAgent()
    const res = await agent.post('/api/admin/notas').send({
      fecha: '2026-03-10',
      categoria: 'Test',
      titulo: 'Una nota de prueba publicada',
      texto: 'Contenido de prueba.',
      estado: 'publicado',
    })
    expect(res.status).toBe(201)
    expect(res.body.slug).toBeTruthy()

    const pub = (await request(app).get('/api/notas')).body as Nota[]
    expect(pub.some((n) => n.slug === res.body.slug)).toBe(true)
  })

  it('una nota en borrador no se ve públicamente pero sí en el admin', async () => {
    const agent = await loginAgent()
    const res = await agent.post('/api/admin/notas').send({
      fecha: '2026-03-11',
      categoria: 'Test',
      titulo: 'Borrador oculto',
      texto: 'No debería verse en público.',
      estado: 'borrador',
    })
    expect(res.status).toBe(201)
    const slug = res.body.slug as string

    const pub = await request(app).get(`/api/notas/${slug}`)
    expect(pub.status).toBe(404)

    const admin = (await agent.get('/api/admin/notas')).body as Nota[]
    expect(admin.some((n) => n.slug === slug)).toBe(true)
  })

  it('genera slugs únicos para títulos repetidos', async () => {
    const agent = await loginAgent()
    const body = {
      fecha: '2026-04-01',
      categoria: 'Test',
      titulo: 'Titulo repetido',
      texto: 'x',
      estado: 'publicado' as const,
    }
    const a = await agent.post('/api/admin/notas').send(body)
    const b = await agent.post('/api/admin/notas').send(body)
    expect(a.body.slug).not.toBe(b.body.slug)
  })

  it('actualiza el estado (toggle) con PUT parcial', async () => {
    const agent = await loginAgent()
    const created = await agent.post('/api/admin/notas').send({
      fecha: '2026-05-01',
      categoria: 'Test',
      titulo: 'Para despublicar',
      texto: 'x',
      estado: 'publicado',
    })
    const id = created.body.id
    const upd = await agent.put(`/api/admin/notas/${id}`).send({ estado: 'borrador' })
    expect(upd.status).toBe(200)
    expect(upd.body.estado).toBe('borrador')
  })

  it('borra una nota y luego responde 404', async () => {
    const agent = await loginAgent()
    const created = await agent.post('/api/admin/notas').send({
      fecha: '2026-06-01',
      categoria: 'Test',
      titulo: 'Para borrar',
      texto: 'x',
      estado: 'publicado',
    })
    const id = created.body.id
    const del = await agent.delete(`/api/admin/notas/${id}`)
    expect(del.status).toBe(204)
    const del2 = await agent.delete(`/api/admin/notas/${id}`)
    expect(del2.status).toBe(404)
  })

  it('valida los campos al crear', async () => {
    const agent = await loginAgent()
    const sinCampos = await agent.post('/api/admin/notas').send({})
    expect(sinCampos.status).toBe(400)

    const fechaMala = await agent.post('/api/admin/notas').send({
      fecha: '01/01/2026',
      categoria: 'Test',
      titulo: 'x',
      texto: 'x',
      estado: 'publicado',
    })
    expect(fechaMala.status).toBe(400)

    const estadoMalo = await agent.post('/api/admin/notas').send({
      fecha: '2026-01-01',
      categoria: 'Test',
      titulo: 'x',
      texto: 'x',
      estado: 'archivado',
    })
    expect(estadoMalo.status).toBe(400)
  })
})
