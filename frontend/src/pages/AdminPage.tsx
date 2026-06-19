import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  ApiError,
  adminCreateNota,
  adminDeleteNota,
  adminGetNotas,
  adminUpdateNota,
  getSession,
  login,
  logout,
} from '../lib/api'
import type { EstadoNota, Nota } from '../types'
import { fmtFecha } from '../lib/format'

type Auth = 'checking' | 'out' | 'in'

interface FormState {
  fecha: string
  categoria: string
  titulo: string
  texto: string
  estado: EstadoNota
}

const emptyForm: FormState = {
  fecha: '',
  categoria: '',
  titulo: '',
  texto: '',
  estado: 'publicado',
}

export function AdminPage() {
  const [auth, setAuth] = useState<Auth>('checking')

  useEffect(() => {
    getSession()
      .then((s) => setAuth(s.authenticated ? 'in' : 'out'))
      .catch(() => setAuth('out'))
  }, [])

  if (auth === 'checking') {
    return (
      <main className="admin admin-center">
        <p className="admin-muted">Cargando…</p>
      </main>
    )
  }

  if (auth === 'out') {
    return <LoginView onLogged={() => setAuth('in')} />
  }

  return <PanelView onLogout={() => setAuth('out')} />
}

// ---------------- Login ----------------
function LoginView({ onLogged }: { onLogged: () => void }) {
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await login(usuario, password)
      onLogged()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo iniciar sesión')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="admin admin-center">
      <form className="admin-login" onSubmit={onSubmit}>
        <div className="admin-login-brand">
          <img src="/img/bulb.png" alt="" />
          <span>
            Halt <span className="amp">&amp;</span> Catch
          </span>
        </div>
        <h1>Panel de novedades</h1>
        <p className="admin-muted">Ingresá para administrar las notas del sitio.</p>

        <label className="admin-field">
          <span>Usuario</span>
          <input value={usuario} onChange={(e) => setUsuario(e.target.value)} autoComplete="username" required />
        </label>
        <label className="admin-field">
          <span>Contraseña</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        {error && <p className="admin-error">{error}</p>}

        <button className="admin-btn admin-btn-primary" type="submit" disabled={busy}>
          {busy ? 'Ingresando…' : 'Ingresar'}
        </button>
        <Link to="/" className="admin-back-link">
          ← Volver al sitio
        </Link>
      </form>
    </main>
  )
}

// ---------------- Panel ----------------
function PanelView({ onLogout }: { onLogout: () => void }) {
  const [notas, setNotas] = useState<Nota[]>([])
  const [form, setForm] = useState<FormState>(emptyForm)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)

  const refresh = useCallback(() => {
    adminGetNotas()
      .then(setNotas)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Error al cargar notas'))
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
    setError('')
  }

  const startEdit = (n: Nota) => {
    setForm({ fecha: n.fecha, categoria: n.categoria, titulo: n.titulo, texto: n.texto, estado: n.estado })
    setEditingId(n.id)
    setError('')
    setMsg('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setMsg('')
    setBusy(true)
    try {
      if (editingId != null) {
        await adminUpdateNota(editingId, form)
        setMsg('Nota actualizada.')
      } else {
        await adminCreateNota(form)
        setMsg('Nota creada.')
      }
      resetForm()
      refresh()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo guardar')
    } finally {
      setBusy(false)
    }
  }

  const onDelete = async (n: Nota) => {
    if (!window.confirm(`¿Borrar la nota “${n.titulo}”?`)) return
    try {
      await adminDeleteNota(n.id)
      if (editingId === n.id) resetForm()
      refresh()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo borrar')
    }
  }

  const toggleEstado = async (n: Nota) => {
    const estado: EstadoNota = n.estado === 'publicado' ? 'borrador' : 'publicado'
    try {
      await adminUpdateNota(n.id, { estado })
      refresh()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo cambiar el estado')
    }
  }

  const onLogoutClick = async () => {
    try {
      await logout()
    } finally {
      onLogout()
    }
  }

  return (
    <main className="admin">
      <header className="admin-header">
        <div className="admin-login-brand">
          <img src="/img/bulb.png" alt="" />
          <span>
            Halt <span className="amp">&amp;</span> Catch · Novedades
          </span>
        </div>
        <div className="admin-header-actions">
          <Link to="/" className="admin-link">
            Ver sitio
          </Link>
          <button className="admin-btn" onClick={onLogoutClick}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <div className="admin-grid">
        <section className="admin-card">
          <h2>{editingId != null ? 'Editar nota' : 'Nueva nota'}</h2>
          <form onSubmit={onSubmit} className="admin-form">
            <label className="admin-field">
              <span>Fecha</span>
              <input
                type="date"
                value={form.fecha}
                onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                required
              />
            </label>
            <label className="admin-field">
              <span>Categoría</span>
              <input
                value={form.categoria}
                onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                placeholder="Ej: Receta digital"
                required
              />
            </label>
            <label className="admin-field">
              <span>Título</span>
              <input
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                placeholder="Título de la nota"
                required
              />
            </label>
            <label className="admin-field">
              <span>Texto</span>
              <textarea
                value={form.texto}
                onChange={(e) => setForm({ ...form, texto: e.target.value })}
                rows={8}
                placeholder="Contenido de la nota. Dejá una línea en blanco para separar párrafos."
                required
              />
            </label>
            <label className="admin-field">
              <span>Estado</span>
              <select
                value={form.estado}
                onChange={(e) => setForm({ ...form, estado: e.target.value as EstadoNota })}
              >
                <option value="publicado">Publicado</option>
                <option value="borrador">Borrador</option>
              </select>
            </label>

            {error && <p className="admin-error">{error}</p>}
            {msg && <p className="admin-ok">{msg}</p>}

            <div className="admin-form-actions">
              <button className="admin-btn admin-btn-primary" type="submit" disabled={busy}>
                {busy ? 'Guardando…' : editingId != null ? 'Guardar cambios' : 'Crear nota'}
              </button>
              {editingId != null && (
                <button type="button" className="admin-btn" onClick={resetForm}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="admin-card">
          <h2>Notas ({notas.length})</h2>
          {notas.length === 0 && <p className="admin-muted">Todavía no hay notas.</p>}
          <ul className="admin-list">
            {notas.map((n) => (
              <li key={n.id} className="admin-item">
                <div className="admin-item-main">
                  <div className="admin-item-meta">
                    <span className={`admin-badge admin-badge-${n.estado}`}>{n.estado}</span>
                    <span className="admin-item-date">{fmtFecha(n.fecha)}</span>
                    <span className="admin-item-cat">{n.categoria}</span>
                  </div>
                  <h3 className="admin-item-title">{n.titulo}</h3>
                </div>
                <div className="admin-item-actions">
                  <button className="admin-btn admin-btn-sm" onClick={() => startEdit(n)}>
                    Editar
                  </button>
                  <button className="admin-btn admin-btn-sm" onClick={() => toggleEstado(n)}>
                    {n.estado === 'publicado' ? 'Despublicar' : 'Publicar'}
                  </button>
                  <button
                    className="admin-btn admin-btn-sm admin-btn-danger"
                    onClick={() => onDelete(n)}
                  >
                    Borrar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  )
}
