import { useEffect, useState } from 'react'

/**
 * Devuelve el id de la sección actualmente en vista (para el subrayado del nav).
 * Misma config de rootMargin/threshold que el diseño original.
 */
export function useScrollSpy(ids: string[], enabled: boolean): string | null {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled) return
    const targets = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el))
    if (!targets.length) return

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible.length) setActive(visible[0].target.id)
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.25, 0.5, 1] },
    )
    targets.forEach((t) => io.observe(t))
    return () => io.disconnect()
  }, [enabled, ids.join(',')])

  return active
}
