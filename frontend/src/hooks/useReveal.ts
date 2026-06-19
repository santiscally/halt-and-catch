import { useEffect } from 'react'

/**
 * Fade-up al entrar en viewport (≈ Framer Motion whileInView).
 * Observa los `.reveal:not(.in)` presentes y les agrega `.in`.
 * Pasá deps (ej: notas cargadas) para re-observar contenido async.
 * Misma config de IntersectionObserver que el diseño original.
 */
export function useReveal(deps: unknown[] = []) {
  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>('.reveal:not(.in)'),
    )
    if (!els.length) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
