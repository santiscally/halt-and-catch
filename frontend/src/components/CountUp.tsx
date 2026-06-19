import { useEffect, useRef, useState } from 'react'

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))

interface Props {
  target: number
  from?: number
  dur?: number
}

/** Anima el número de 0 al target cuando entra en viewport. */
export function CountUp({ target, from = 0, dur = 1500 }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const [val, setVal] = useState(from)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let cancelled = false

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting || started.current) return
          started.current = true
          io.unobserve(e.target)
          if (reduce) {
            setVal(target)
            return
          }
          const t0 = performance.now()
          const tick = (now: number) => {
            if (cancelled) return
            const p = Math.min((now - t0) / dur, 1)
            setVal(Math.round(from + (target - from) * easeOutExpo(p)))
            if (p < 1) requestAnimationFrame(tick)
            else setVal(target)
          }
          requestAnimationFrame(tick)
        })
      },
      { threshold: 0.5 },
    )
    io.observe(el)
    return () => {
      cancelled = true
      io.disconnect()
    }
  }, [target, from, dur])

  return (
    <span className="count" ref={ref}>
      {val}
    </span>
  )
}
