"use client"

import { useReducedMotion } from "framer-motion"
import type { Variants } from "framer-motion"

/**
 * Variants compartidas por todas las secciones.
 *
 * Cuando el usuario pide movimiento reducido, las transiciones pasan a duración 0
 * y sin desplazamiento: el contenido aparece, no se mueve. Ninguna sección debe
 * definir animaciones de entrada ad-hoc.
 */

export const VIEWPORT = { once: true, margin: "-80px" } as const

export function useMotionVariants() {
  const reduced = useReducedMotion()

  // `useReducedMotion` devuelve false en el servidor y el valor real tras
  // hidratar, así que el estado `hidden` —lo único que llega al HTML del
  // servidor— no puede depender de él: hacerlo produce un mismatch de
  // hidratación. Solo la transición varía, y con duración 0 el contenido
  // aparece de golpe al entrar en viewport, sin movimiento perceptible.
  const DISTANCE = 24
  const duration = reduced ? 0 : 0.5

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: DISTANCE },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration, ease: [0.22, 1, 0.36, 1] },
    },
  }

  const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration } },
  }

  const stagger: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: reduced ? 0 : 0.08 },
    },
  }

  return { reduced, fadeUp, fadeIn, stagger }
}
