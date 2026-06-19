import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Nav } from '../components/Nav'
import { Hero } from '../components/Hero'
import { About } from '../components/About'
import { Services } from '../components/Services'
import { Clients } from '../components/Clients'
import { NotesSection } from '../components/NotesSection'
import { Contact } from '../components/Contact'
import { Footer } from '../components/Footer'
import { useReveal } from '../hooks/useReveal'
import { useScrollSpy } from '../hooks/useScrollSpy'
import { getNotas } from '../lib/api'
import type { Nota } from '../types'

const SECTION_IDS = ['nosotros', 'servicios', 'clientes', 'notas', 'contacto']
const HOME_NOTES = 3

export function Home() {
  const [notas, setNotas] = useState<Nota[]>([])
  const location = useLocation()
  const active = useScrollSpy(SECTION_IDS, true)
  useReveal([notas.length])

  useEffect(() => {
    const controller = new AbortController()
    getNotas(controller.signal)
      .then((d) => setNotas(d.slice(0, HOME_NOTES)))
      .catch((e) => {
        if (e instanceof DOMException && e.name === 'AbortError') return
        setNotas([])
      })
    return () => controller.abort()
  }, [])

  // Scroll a una sección al llegar desde otra página (state) o por hash directo (/#servicios)
  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null
    const target = state?.scrollTo || (location.hash ? location.hash.slice(1) : null)
    if (!target) return
    const t = window.setTimeout(() => {
      document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' })
    }, 60)
    return () => window.clearTimeout(t)
  }, [location])

  return (
    <>
      <Nav overHero activeSection={active} />
      <Hero />
      <About />
      <Services />
      <Clients />
      <NotesSection notas={notas} />
      <Contact />
      <Footer />
    </>
  )
}
