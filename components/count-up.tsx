"use client"

import { useEffect, useState } from "react"
import { useReducedMotion } from "framer-motion"
import { useInView } from "@/hooks/use-in-view"

/**
 * Número que cuenta desde cero al entrar en pantalla.
 *
 * Se dispara una sola vez y termina: no es movimiento continuo, así que no
 * consume nada después. Hace que un dato se lea como logro.
 *
 * El valor final va en `aria-label` porque el texto cambia mientras anima y un
 * lector de pantalla anunciaría números intermedios.
 */
export function CountUp({
  value,
  suffix = "",
  duration = 1200,
  className,
}: {
  value: number
  suffix?: string
  duration?: number
  className?: string
}) {
  const reduced = useReducedMotion()
  const { ref, inView } = useInView<HTMLSpanElement>({ once: true, rootMargin: "-40px" })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return

    if (reduced) {
      setDisplay(value)
      return
    }

    let frame = 0
    const start = performance.now()

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      if (progress >= 1) {
        // Se fija el valor exacto en lugar de dejar el último redondeo: con la
        // curva de desaceleración, el frame final podía quedar en 99.
        setDisplay(value)
        return
      }
      // Desaceleración al final, para que el número "aterrice".
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(value * eased))
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, reduced, value, duration])

  return (
    <span ref={ref} className={className} aria-label={`${value}${suffix}`}>
      <span aria-hidden>
        {display}
        {suffix}
      </span>
    </span>
  )
}
