# Deploy en un VPS de Hostinger (Docker + HTTPS)

Guía para poner el sitio en producción en un **VPS de Hostinger**, dar de baja WordPress y
apuntar el dominio al servidor nuevo. Todo corre en Docker; no se usa nada de WordPress/PHP.

> ⚠️ El hosting **compartido** donde está hoy WordPress **no sirve** para esta app (no corre
> Node ni Docker). Hace falta un **VPS** (plan KVM; el KVM 1 alcanza para este sitio).

---

## 0. Antes de empezar

- **No des de baja WordPress** hasta verificar que el sitio nuevo funciona.
- **Backup de WordPress** por las dudas (hPanel → tu hosting → Backups / exportar).
- **Email:** si tenés casillas `@tudominio` en ese hosting, ojo: el registro **A** (web) es
  independiente del **MX** (email), así que cambiar el A no rompe el correo, pero si **cancelás
  el plan** revisá antes dónde queda alojado el email.

---

## 1. Crear el VPS

- hPanel → **VPS** → comprar un plan (KVM 1 alcanza).
- Plantilla / SO: elegí **Ubuntu 24.04 con Docker** (o "Ubuntu 24.04" limpio e instalás Docker
  en el paso 3).
- Anotá la **IP del VPS** y la contraseña root (o cargá tu clave SSH).
- **Firewall:** que estén abiertos los puertos **80** y **443** (hPanel → VPS → Firewall, o
  dentro del VPS: `ufw allow 80 && ufw allow 443`).

---

## 2. Apuntar el dominio (DNS)

Recomendado: probar primero en un **subdominio** para no tocar el sitio actual.

- hPanel → **Dominios → DNS / Zona DNS**.
- Registro **A**: `app` (subdominio) → **IP del VPS**. TTL bajo (300) mientras probás.
- La propagación tarda de minutos a un par de horas.
- Tip para probar sin esperar DNS: editá el archivo `hosts` de tu compu apuntando el dominio a
  la IP del VPS.

---

## 3. Entrar al VPS e instalar Docker (si hace falta)

- Consola: hPanel → VPS → **Browser terminal**, o por SSH: `ssh root@IP_DEL_VPS`.
- Si elegiste Ubuntu **sin** Docker:
  ```bash
  curl -fsSL https://get.docker.com | sh
  ```
- Verificá:
  ```bash
  docker --version && docker compose version
  ```

---

## 4. Traer el proyecto

```bash
git clone https://github.com/santiscally/halt-and-catch.git
cd halt-and-catch
```

---

## 5. Configurar variables

```bash
cp .env.example .env
nano .env
```
Completá:
- `ADMIN_USER` / `ADMIN_PASSWORD` — tu usuario del panel `/admin`.
- `JWT_SECRET` — generá uno: `openssl rand -hex 48`
- `COOKIE_SECURE=true`
- `DOMAIN=app.tudominio.com` — el (sub)dominio que apuntaste en el paso 2.
- `ACME_EMAIL=` — opcional (avisos del certificado).

Guardá con `Ctrl+O`, `Enter`, `Ctrl+X`.

---

## 6. Levantar

```bash
docker compose -f docker-compose.prod.yml up -d --build
```
- La primera vez compila las imágenes (unos minutos) y **Caddy saca el certificado HTTPS solo**
  al primer acceso.
- Probá: `https://app.tudominio.com` y `https://app.tudominio.com/admin`.
- Si algo falla, mirá los logs:
  ```bash
  docker compose -f docker-compose.prod.yml logs -f
  ```

---

## 7. Pasar al dominio definitivo (cuando confirmes que anda)

1. Cambiá el registro **A** del dominio principal (`@` y `www`) a la IP del VPS.
2. En `.env` poné `DOMAIN=tudominio.com` y reaplicá:
   ```bash
   docker compose -f docker-compose.prod.yml up -d
   ```
3. Verificá `https://tudominio.com`.
4. **Recién ahí** podés dar de baja el hosting de WordPress.

---

## 8. Operación del día a día

- **Actualizar el sitio** (cuando haya cambios en el repo):
  ```bash
  cd halt-and-catch
  git pull
  docker compose -f docker-compose.prod.yml up -d --build
  ```
- **Estado / logs:** `docker compose -f docker-compose.prod.yml ps` · `... logs -f`
- **Reiniciar:** `docker compose -f docker-compose.prod.yml restart`
- **Backup de la base (notas):** la DB vive en un volumen Docker. Verificá el nombre con
  `docker volume ls` (suele ser `halt-and-catch_notas_data`) y:
  ```bash
  docker run --rm -v halt-and-catch_notas_data:/data -v "$(pwd)":/backup alpine \
    tar czf /backup/notas-backup.tar.gz -C /data .
  ```

---

## Notas

- Arquitectura en prod: **Caddy** (TLS/HTTPS) → **frontend nginx** (sirve la SPA y proxya
  `/api`) → **backend** (Express + SQLite). Definido en `docker-compose.prod.yml` + `Caddyfile`.
- Las imágenes se compilan en el VPS (incluye `better-sqlite3`, ya contemplado en el Dockerfile).
- Alternativa más "panel y menos consola": Hostinger tiene plantillas de **Coolify/Dokploy**
  (deploy desde GitHub con HTTPS automático). Si preferís ese camino, avisá y lo adapto.
