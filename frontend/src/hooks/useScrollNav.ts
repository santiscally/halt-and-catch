import { useEffect, useState } from 'react'

/**
 * Nav transparente sobre el hero, sólido (crema) una vez pasado.
 * En páginas sin hero (enabled=false) queda siempre sólido.
 */
export function useScrollNav(enabled: boolean): boolean {
  const [scrolled, setScrolled] = useState(!enabled)

  useEffect(() => {
    if (!enabled) {
      setScrolled(true)
      return
    }
    const hero = document.querySelector<HTMLElement>('.hero')
    const onScroll = () => {
      const threshold = hero ? hero.offsetHeight - 90 : 12
      setScrolled(window.scrollY > threshold)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [enabled])

  return scrolled
}
