"use client"

import { motion } from "framer-motion"
import { useMotionVariants, VIEWPORT } from "@/lib/motion"
import { VISIBLE_PROJECTS } from "@/lib/site-config"

/**
 * Banda de confianza. Nombres y rubros en texto, sin logos de terceros:
 * no tenemos derecho de uso sobre las marcas de los clientes.
 */
export function SocialProofSection() {
  const { fadeUp, stagger } = useMotionVariants()

  if (VISIBLE_PROJECTS.length === 0) return null

  return (
    <section className="border-y border-border bg-card/50 py-10">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        variants={stagger}
        className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 sm:px-6 lg:flex-row lg:gap-12 lg:px-8"
      >
        <motion.p
          variants={fadeUp}
          className="shrink-0 text-sm font-semibold uppercase tracking-widest text-muted-foreground"
        >
          Ya confiaron en nosotros
        </motion.p>

        <motion.ul
          variants={fadeUp}
          className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 lg:justify-start"
        >
          {VISIBLE_PROJECTS.map((project) => (
            <li key={project.slug} className="text-center lg:text-left">
              <p className="font-semibold text-foreground">{project.name}</p>
              <p className="text-sm text-muted-foreground">{project.category}</p>
            </li>
          ))}
        </motion.ul>
      </motion.div>
    </section>
  )
}
