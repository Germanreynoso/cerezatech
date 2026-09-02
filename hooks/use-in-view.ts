"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Indica si el elemento está en pantalla.
 *
 * Se usa para detener animaciones continuas cuando no se ven: una cinta que
 * sigue corriendo tres pantallas más abajo consume CPU y batería sin que nadie
 * la mire.
 *
 * Con `once` se convierte en un disparador de una sola vez, para animaciones
 * de entrada que no deben repetirse al volver a subir.
 */
export function useInView<T extends HTMLElement>(
  options: { once?: boolean; rootMargin?: string } = {}
) {
  const { once = false, rootMargin = "0px" } = options
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [once, rootMargin])

  return { ref, inView }
}
