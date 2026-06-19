// Definiciones SVG (logo + íconos) reutilizadas vía <use href="#id">.
// Se montan una sola vez a nivel app. Markup crudo = fidelidad 1:1 con el original.
const DEFS = `
<symbol id="logo-mark" viewBox="0 0 120 120">
  <path id="halt-arc" d="M 18 56 A 42 42 0 0 1 102 56" fill="none"></path>
  <path id="catch-arc" d="M 18 64 A 42 42 0 0 0 102 64" fill="none"></path>
  <g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M 60 36 C 49 36 41 44 41 55 C 41 62 44 67 49 72 L 49 80 L 71 80 L 71 72 C 76 67 79 62 79 55 C 79 44 71 36 60 36 Z"></path>
    <path d="M 53 62 L 56 56 L 60 64 L 64 56 L 67 62"></path>
    <line x1="50" y1="84" x2="70" y2="84"></line>
    <line x1="52" y1="88" x2="68" y2="88"></line>
    <path d="M 55 91 L 65 91 L 63 95 L 57 95 Z"></path>
  </g>
  <text font-family="'Outfit', sans-serif" font-size="9" letter-spacing="0.3em" fill="currentColor" font-weight="600">
    <textPath href="#halt-arc" startOffset="50%" text-anchor="middle">HALT</textPath>
  </text>
  <text font-family="'Outfit', sans-serif" font-size="9" letter-spacing="0.3em" fill="currentColor" font-weight="600">
    <textPath href="#catch-arc" startOffset="50%" text-anchor="middle">CATCH</textPath>
  </text>
</symbol>

<symbol id="i-finance" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="24" cy="24" r="14"></circle>
  <path d="M24 14 V34"></path>
  <path d="M29 18.5 a5 4.5 0 0 0 -5 -3 h-2 a3.5 3.5 0 0 0 0 7 h4 a3.5 3.5 0 0 1 0 7 h-2 a5 4.5 0 0 1 -5 -3"></path>
</symbol>
<symbol id="i-trade" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 21 L28 13 V35 L12 27 Z"></path>
  <path d="M12 21 H8 a2 2 0 0 0 -2 2 v2 a2 2 0 0 0 2 2 H12"></path>
  <path d="M15 28 v4 a2 2 0 0 0 2 2 h1 a2 2 0 0 0 2 -2 v-1.5"></path>
  <path d="M33 19 a8 8 0 0 1 0 10"></path>
  <path d="M37 16 a13 13 0 0 1 0 16"></path>
</symbol>
<symbol id="i-comex" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="24" cy="24" r="14"></circle>
  <line x1="10" y1="24" x2="38" y2="24"></line>
  <ellipse cx="24" cy="24" rx="6" ry="14"></ellipse>
  <path d="M13 16.5 H35"></path>
  <path d="M13 31.5 H35"></path>
</symbol>
<symbol id="i-product" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M24 7 L38 15 V33 L24 41 L10 33 V15 Z"></path>
  <path d="M10 15 L24 23 L38 15"></path>
  <line x1="24" y1="23" x2="24" y2="41"></line>
</symbol>
<symbol id="i-ecom" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 17 H36 L34 38 H14 Z"></path>
  <path d="M18 20 V15 a6 6 0 0 1 12 0 V20"></path>
</symbol>
<symbol id="i-bi" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M11 9 V37 H39"></path>
  <path d="M16 31 L23 23 L28 27 L36 16"></path>
  <circle cx="36" cy="16" r="1.6"></circle>
</symbol>
<symbol id="i-strategy" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="22" cy="26" r="13"></circle>
  <circle cx="22" cy="26" r="7.5"></circle>
  <circle cx="22" cy="26" r="2"></circle>
  <path d="M22 26 L37 11"></path>
  <path d="M30 11 H38 V19"></path>
</symbol>
<symbol id="i-database" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <ellipse cx="24" cy="13" rx="13" ry="4.5"></ellipse>
  <path d="M11 13 V35 c0 2.5 5.8 4.5 13 4.5 s13 -2 13 -4.5 V13"></path>
  <path d="M11 24 c0 2.5 5.8 4.5 13 4.5 s13 -2 13 -4.5"></path>
</symbol>
<symbol id="i-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="12" x2="20" y2="12"></line><polyline points="14 6 20 12 14 18"></polyline></symbol>
<symbol id="i-arrow-down" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="4" x2="12" y2="20"></line><polyline points="6 14 12 20 18 14"></polyline></symbol>
`

export function SvgDefs() {
  // dangerouslySetInnerHTML es seguro acá: DEFS es una constante estática del
  // propio código (no proviene de input de usuario ni de la red). Se usa para
  // preservar el markup SVG exacto del diseño original sin convertir atributos.
  return (
    <svg
      width="0"
      height="0"
      style={{ position: 'absolute' }}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: `<defs>${DEFS}</defs>` }}
    />
  )
}
