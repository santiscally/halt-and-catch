# Halt & Catch — sitio + CMS de novedades

Réplica en **React (Vite + TypeScript)** del diseño original de Halt & Catch, con un **backend Express + SQLite** y un **CMS mínimo** para administrar las notas que se ven en el home.

## Qué incluye

- **Home** (`/`): réplica 1:1 del diseño (hero, nosotros, servicios, clientes, notas, contacto). Muestra las **últimas 3 notas**.
- **Todas las notas** (`/notas`): listado completo de notas publicadas + **buscador** simple.
- **Detalle de nota** (`/notas/:slug`): la nota completa.
- **Panel admin** (`/admin`): ABM de notas (crear, editar, borrar, publicar/despublicar), protegido por **un único usuario**.

## Estructura

```
halt-and-catch/
├── frontend/     # Vite + React + TS (SPA). nginx en producción.
├── backend/      # Express + SQLite (better-sqlite3). API REST + auth.
├── reference/    # HTML original del diseño (referencia, no se usa en runtime).
├── docker-compose.yml
└── .env.example
```

## Desarrollo local (sin Docker)

Requiere Node 22+.

**Backend** (puerto 4000):
```bash
cd backend
npm install
npm run dev
```
Sin variables de entorno usa credenciales de desarrollo (`admin` / `changeme`) y avisa por consola.

**Frontend** (puerto 5173, proxya `/api` al backend):
```bash
cd frontend
npm install
npm run dev
```
Abrí http://localhost:5173 — y el panel en http://localhost:5173/admin

**Tests del backend:**
```bash
cd backend && npm test
```

## Producción con Docker (puerto 80)

1. Configurá las variables:
   ```bash
   cp .env.example .env
   # editá .env: ADMIN_USER, ADMIN_PASSWORD, JWT_SECRET (largo y aleatorio)
   ```
   Generar un `JWT_SECRET`:
   ```bash
   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
   ```

2. Levantá el stack:
   ```bash
   docker compose up -d --build
   ```

3. El sitio queda en **http://localhost** (puerto 80). El panel en **http://localhost/admin**.

- El **frontend** (nginx) sirve la SPA y reenvía `/api` al **backend** (interno, puerto 4000).
- La base SQLite persiste en el volumen `notas_data` (sobrevive a reinicios y rebuilds).
- Para cambiar el puerto público: `HTTP_PORT=8080 docker compose up -d`.

### DNS / dominio (más adelante)

El sitio escucha en el puerto 80, listo para apuntar un dominio (registro `A` al IP del server).
Cuando agregues HTTPS (por ej. con un reverse proxy / certbot delante), poné `COOKIE_SECURE=true` en `.env`.

## El CMS

- Entrá a `/admin`, iniciá sesión con el usuario configurado en `.env`.
- Cada nota tiene: **fecha**, **categoría**, **título**, **texto** y **estado** (`publicado` / `borrador`).
- Solo las **publicadas** se ven en el sitio. Los **borradores** quedan ocultos al público.
- El home muestra las 3 más recientes; el resto en `/notas`.
- No hay registro ni gestión de usuarios: es un único usuario definido por vos en `.env`, solo para evitar accesos no deseados al panel.

## Notas técnicas

- **Fidelidad visual**: el CSS del diseño original se portó tal cual (`frontend/src/styles/global.css`); los estilos propios (páginas nuevas, admin, menú móvil) viven aparte en `extra.css`.
- **Fuentes** (JetBrains Mono, Outfit, Zilla Slab) self-hosteadas en `frontend/public/fonts`.
- **Imágenes** (logos, fotos, logos de clientes) en `frontend/public/img`.
