"use client"

import { useEffect, useState } from "react"

/**
 * Devuelve el id de la sección visible más cercana al tope del viewport.
 *
 * Usa un único IntersectionObserver para todas las secciones en lugar de uno
 * por sección, y una banda de observación en el tercio superior de la pantalla
 * para que el resaltado cambie cuando la sección realmente ocupa la vista.
 */
export function useScrollSpy(ids: readonly string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    const visible = new Set<string>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        }
        // El primero en orden del documento gana, para que el resaltado no
        // salte hacia atrás cuando dos secciones se solapan.
        const first = ids.find((id) => visible.has(id))
        setActiveId(first ?? null)
      },
      { rootMargin: "-20% 0px -70% 0px" }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ids])

  return activeId
}

/** `true` cuando la página se desplazó más de `threshold` píxeles. */
export function useScrolled(threshold = 24): boolean {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [threshold])

  return scrolled
}
