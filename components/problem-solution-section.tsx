"use client"

import { motion } from "framer-motion"
import { Check, X } from "lucide-react"
import { useMotionVariants, VIEWPORT } from "@/lib/motion"
import { SITE } from "@/lib/site-config"

const WITHOUT = [
  "Tu único canal es un perfil de Instagram",
  "Te preguntan el precio por mensaje privado, una y otra vez",
  "Cuando te buscan en Google, no aparecés",
  "Tu competencia sí aparece, y se queda con el cliente",
]

const WITH = [
  "Tu catálogo disponible las 24 horas, sin que atiendas",
  "El cliente llega a WhatsApp ya sabiendo qué quiere",
  "Aparecés cuando buscan tu rubro en tu zona",
  "Una presencia que da confianza antes de la primera charla",
]

export function ProblemSolutionSection() {
  const { fadeUp } = useMotionVariants()

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          variants={fadeUp}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Si no te encuentran, <span className="text-gradient">no existís</span>
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            La diferencia entre un negocio que crece y uno que se estanca casi nunca es el
            producto. Es dónde lo pueden ver.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2 lg:gap-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            variants={fadeUp}
            className="rounded-2xl border border-border bg-card/40 p-8"
          >
            <h3 className="text-lg font-semibold text-muted-foreground">Sin página web</h3>
            <ul className="mt-6 space-y-4">
              {WITHOUT.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted">
                    <X className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                  </span>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            variants={fadeUp}
            className="rounded-2xl border border-primary/35 bg-card p-8"
          >
            <h3 className="text-lg font-semibold text-primary">Con {SITE.name}</h3>
            <ul className="mt-6 space-y-4">
              {WITH.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15">
                    <Check className="h-3.5 w-3.5 text-primary" aria-hidden />
                  </span>
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
