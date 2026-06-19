import Database from 'better-sqlite3'
import fs from 'node:fs'
import path from 'node:path'
import { slugify } from './slug'
import type { Nota, NotaInput } from './types'

export type DB = Database.Database

const SCHEMA = `
CREATE TABLE IF NOT EXISTS notas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  fecha TEXT NOT NULL,
  categoria TEXT NOT NULL,
  titulo TEXT NOT NULL,
  texto TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'publicado',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_notas_estado_fecha ON notas (estado, fecha DESC);
`

// Notas iniciales (las mismas que traía el diseño original).
const SEED: NotaInput[] = [
  {
    fecha: '2025-01-13',
    categoria: 'Receta digital',
    titulo: 'Entra en vigencia la receta digital, como único medio de prescripción',
    texto:
      'Según el Decreto 345/2024, la emisión de recetas deberá realizarse exclusivamente a través de plataformas registradas en el Registro Nacional de Plataformas Digitales Sanitarias (ReNaPDiS).',
    estado: 'publicado',
  },
  {
    fecha: '2025-01-13',
    categoria: 'Venta libre',
    titulo: 'Más medicamentos migran a venta libre, y no tendrán descuento de seguridad social',
    texto:
      'El listado de medicamentos sin receta sigue expandiéndose: los productos con Senósido A y B ya no requerirán prescripción médica y dejarán de contar con descuentos de obras sociales y prepagas.',
    estado: 'publicado',
  },
  {
    fecha: '2025-01-13',
    categoria: 'PAMI',
    titulo: 'PAMI: nuevos medicamentos que dejan de ser gratuitos',
    texto:
      'Desde enero de 2025, PAMI implementó cambios en su plan de entrega gratuita de medicamentos para jubilados y pensionados, concentrando los recursos en patologías graves o crónicas.',
    estado: 'publicado',
  },
]

export function initDb(dbPath: string): DB {
  if (dbPath !== ':memory:') {
    fs.mkdirSync(path.dirname(path.resolve(dbPath)), { recursive: true })
  }
  const db = new Database(dbPath)
  db.pragma('journal_mode = WAL')
  db.exec(SCHEMA)
  seedIfEmpty(db)
  return db
}

function seedIfEmpty(db: DB): void {
  const row = db.prepare('SELECT COUNT(*) AS n FROM notas').get() as { n: number }
  if (row.n > 0) return
  for (const n of SEED) create(db, n)
}

// ---------------- slug único ----------------
function uniqueSlug(db: DB, titulo: string, excludeId?: number): string {
  const base = slugify(titulo)
  let candidate = base
  let i = 2
  const stmt = db.prepare('SELECT id FROM notas WHERE slug = ?')
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const found = stmt.get(candidate) as { id: number } | undefined
    if (!found || found.id === excludeId) return candidate
    candidate = `${base}-${i++}`
  }
}

// ---------------- consultas ----------------
const ORDER = 'ORDER BY fecha DESC, id DESC'

export function listPublicadas(db: DB): Nota[] {
  return db.prepare(`SELECT * FROM notas WHERE estado = 'publicado' ${ORDER}`).all() as Nota[]
}

export function getBySlugPublic(db: DB, slug: string): Nota | undefined {
  return db
    .prepare(`SELECT * FROM notas WHERE slug = ? AND estado = 'publicado'`)
    .get(slug) as Nota | undefined
}

export function listAll(db: DB): Nota[] {
  return db.prepare(`SELECT * FROM notas ${ORDER}`).all() as Nota[]
}

export function getById(db: DB, id: number): Nota | undefined {
  return db.prepare('SELECT * FROM notas WHERE id = ?').get(id) as Nota | undefined
}

export function create(db: DB, input: NotaInput): Nota {
  const slug = uniqueSlug(db, input.titulo)
  const info = db
    .prepare(
      `INSERT INTO notas (slug, fecha, categoria, titulo, texto, estado)
       VALUES (@slug, @fecha, @categoria, @titulo, @texto, @estado)`,
    )
    .run({ slug, ...input })
  return getById(db, Number(info.lastInsertRowid)) as Nota
}

export function update(db: DB, id: number, patch: Partial<NotaInput>): Nota | undefined {
  // El slug se genera una sola vez al crear y NO se regenera al editar el título:
  // así las URLs de las notas ya publicadas se mantienen estables (no se rompen
  // enlaces ni el SEO si se corrige un título).
  const current = getById(db, id)
  if (!current) return undefined
  const merged: NotaInput = {
    fecha: patch.fecha ?? current.fecha,
    categoria: patch.categoria ?? current.categoria,
    titulo: patch.titulo ?? current.titulo,
    texto: patch.texto ?? current.texto,
    estado: patch.estado ?? current.estado,
  }
  db.prepare(
    `UPDATE notas
       SET fecha = @fecha, categoria = @categoria, titulo = @titulo,
           texto = @texto, estado = @estado, updated_at = datetime('now')
     WHERE id = @id`,
  ).run({ id, ...merged })
  return getById(db, id)
}

export function remove(db: DB, id: number): boolean {
  const info = db.prepare('DELETE FROM notas WHERE id = ?').run(id)
  return info.changes > 0
}
