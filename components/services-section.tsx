"use client"

import { motion } from "framer-motion"
import {
  BookOpen,
  Layout,
  type LucideIcon,
  Building2,
  Search,
  ShoppingCart,
  Wrench,
} from "lucide-react"
import { useMotionVariants, VIEWPORT } from "@/lib/motion"
import { SERVICES } from "@/lib/site-config"

/** Los iconos viven acá y no en site-config para que la config quede libre de JSX. */
const ICONS: Record<string, LucideIcon> = {
  "Landing page": Layout,
  "Tienda online": ShoppingCart,
  "Web institucional": Building2,
  "Catálogo digital": BookOpen,
  "SEO local": Search,
  Mantenimiento: Wrench,
}

export function ServicesSection() {
  const { fadeUp, stagger } = useMotionVariants()

  return (
    <section id="servicios" aria-labelledby="servicios-titulo" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          variants={fadeUp}
          className="mx-auto max-w-2xl text-center"
        >
          <h2
            id="servicios-titulo"
            className="text-balance text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Qué <span className="text-gradient">hacemos</span>
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Desde una página simple hasta una tienda completa. Elegimos juntos lo que tu negocio
            necesita hoy, sin pagar de más por lo que no vas a usar.
          </p>
        </motion.div>

        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          variants={stagger}
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {SERVICES.map((service) => {
            const Icon = ICONS[service.title] ?? Layout
            return (
              <motion.li
                key={service.title}
                variants={fadeUp}
                className="group rounded-2xl border border-border bg-card/50 p-7 transition-colors hover:border-primary/40 hover:bg-card"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/12 text-primary transition-colors group-hover:bg-primary/20">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-foreground">{service.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
              </motion.li>
            )
          })}
        </motion.ul>
      </div>
    </section>
  )
}
