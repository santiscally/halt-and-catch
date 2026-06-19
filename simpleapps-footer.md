# Agregar el crédito "powered by `<s/a>`" (Simple Apps) al footer

Guía para sumar el crédito de **Simple Apps** en el footer de un sitio, respetando la
identidad de la marca pero **combinándola con los colores de TU página** (no con los de
otro proyecto). Pensada para que un asistente (Claude) la siga y lo implemente igual en
cualquier stack (HTML/CSS, React, etc.).

---

## 1. Qué hay que agregar

Una "píldora" chica en la fila inferior del footer, al lado del copyright, que dice:

```
powered by <s/a>
```

y que es un link a **https://simpleapps.com.ar**. `<s/a>` es el logotipo de Simple Apps.

---

## 2. Identidad de marca de Simple Apps (respetar)

- **Color del logo `<s/a>`:** navy 900 **`#092F70`** (azul marino primario) sobre fondos
  **claros**; **blanco `#FFFFFF`** sobre fondos **oscuros/navy**.
- **Tipografía del logo:** **General Sans, peso Bold (700)** — la tipografía display de la
  marca (gratis, de Fontshare).
- **Importante:** solo el logo `<s/a>` lleva el navy de Simple Apps. **El resto de la
  píldora** (el texto "powered by", el fondo, el borde) debe usar **los colores de TU
  sitio** para que se integre, no los de Simple Apps.

---

## 3. Decisiones de diseño (seguir igual)

Estas son lecciones ya aprendidas, conviene respetarlas:

1. **Renderizar `<s/a>` como TEXTO** en General Sans Bold, todo del mismo color y peso.
   Que sea uniforme: `<`, `s`, `/`, `a`, `>` con la misma fuente/peso/color. La `s` y la
   `a` son minúsculas y deben tener la misma altura.
   - ❌ No mezclar un glyph SVG para la "s" con texto para los brackets: queda disparejo.
2. **La píldora usa la paleta del footer anfitrión:** fondo sutil (un tono apenas distinto
   al del footer), borde si tu UI usa bordes, y "powered by" en el color de texto tenue
   del footer.
3. **Tamaño:** el logo un toque más grande que "powered by" (jerarquía), pero sin dominar.
4. **Hover:** leve elevación (`translateY(-2px)`) + cambio sutil de fondo/borde.
5. **Ubicación:** fila inferior del footer, alineado con el copyright
   (`display:flex; justify-content:space-between; align-items:center`).

---

## 4. Markup

### HTML
```html
<a
  class="powered-by"
  href="https://simpleapps.com.ar"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="powered by Simple Apps"
>
  <span class="powered-text">powered by</span>
  <span class="powered-logo">&lt;s/a&gt;</span>
</a>
```

### React / JSX
```jsx
<a
  className="powered-by"
  href="https://simpleapps.com.ar"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="powered by Simple Apps"
>
  <span className="powered-text">powered by</span>
  <span className="powered-logo">{'<s/a>'}</span>
</a>
```
> En JSX usá `{'<s/a>'}` (o las entidades `&lt;s/a&gt;`) para que no rompa el parser.

---

## 5. Fuente: General Sans Bold (gratis, Fontshare)

**Opción A — Self-host (recomendado, sin dependencia externa):**
1. Abrí `https://api.fontshare.com/v2/css?f[]=general-sans@700&display=swap`
2. Copiá la URL del `.woff2` que aparece en el `@font-face`, descargá ese archivo y
   guardalo como `general-sans-700.woff2` en tu carpeta de fuentes (ej: `/public/fonts`).
3. Declaralo:
```css
@font-face {
  font-family: 'General Sans';
  src: url('/fonts/general-sans-700.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

**Opción B — CDN rápido (si no querés self-host):**
```html
<link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=general-sans@700&display=swap">
```

---

## 6. CSS (adaptá los colores a TU paleta)

Reemplazá los valores `<...>` por las variables/colores de tu sitio. **Lo único fijo es
`#092F70`** (el navy del logo). Si tu proyecto usa variables CSS, usá las tuyas.

```css
.powered-by {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  background: <FONDO_SUTIL>;        /* un tono apenas distinto al del footer */
  border: 1px solid <BORDE>;        /* opcional, si tu UI usa bordes */
  border-radius: 20px;
  text-decoration: none;
  /* si tu footer hereda uppercase / letter-spacing, reseteá para la píldora: */
  text-transform: none;
  letter-spacing: normal;
  transition: background .3s ease, border-color .3s ease, transform .3s ease;
}
.powered-by:hover {
  background: <FONDO_HOVER>;
  border-color: <ACENTO>;           /* opcional: tu color de acento */
  transform: translateY(-2px);
}
.powered-text {
  color: <TEXTO_TENUE>;             /* el gris/tenue que ya usa tu footer */
  font-size: 0.6875rem;
}
.powered-logo {
  font-family: 'General Sans', sans-serif;
  font-weight: 700;
  color: #092F70;                   /* navy de Simple Apps (para fondos CLAROS) */
  font-size: 0.9375rem;             /* un toque más grande que "powered by" */
  letter-spacing: -0.01em;
  white-space: nowrap;
}
```

### Si tu footer es OSCURO
El logo va en blanco y la píldora con un fondo translúcido claro:
```css
.powered-logo { color: #FFFFFF; }
.powered-by   { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.12); }
.powered-text { color: rgba(255,255,255,0.55); }
```

---

## 7. Link

- URL: `https://simpleapps.com.ar`
- Siempre con `target="_blank"` + `rel="noopener noreferrer"`.
- `aria-label="powered by Simple Apps"` en el `<a>` para accesibilidad (el texto visible
  es corto).

---

## 8. Checklist final

- [ ] El `<s/a>` se ve **uniforme**: una sola fuente (General Sans Bold), un solo color,
      `s` y `a` a la misma altura.
- [ ] Logo en navy `#092F70` (o **blanco** si el footer es oscuro).
- [ ] El **resto de la píldora** usa los colores de TU página (no los de Simple Apps).
- [ ] General Sans Bold cargada (self-host o CDN) y aplicándose al logo.
- [ ] Link a `simpleapps.com.ar` con `target`/`rel`/`aria-label`.
- [ ] Píldora alineada con el copyright en la fila inferior del footer.
- [ ] Hover con leve elevación.

---

## 9. (Opcional / avanzado) Glyph "s" custom

Simple Apps tiene un glyph SVG propio para la "s" del logo. **No es necesario** y, salvo
que lo calibres con cuidado, queda disparejo frente a los brackets de texto — por eso la
recomendación es usar texto en General Sans Bold (sección 3). Si igual lo querés usar:

- Estructurá el logo como `<` + `[SVG de la s]` + `/a>`, con `<` y `/a>` en General Sans
  Bold y el SVG con `fill="currentColor"` (hereda el color del contenedor).
- Calibrá el alto del SVG contra la **"s" real** de General Sans Bold a tu tamaño para que
  iguale la altura-x de la "a" (suele andar por `height: 0.58em`, `vertical-align: baseline`).
- Pedile el archivo `logo-s-glyph.svg` a Simple Apps (no está público en el sitio).
