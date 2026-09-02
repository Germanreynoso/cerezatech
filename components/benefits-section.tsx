"use client"

import { motion } from "framer-motion"
import {
  MapPin,
  MessageCircle,
  Search,
  ShoppingBag,
  Smartphone,
  Zap,
  type LucideIcon,
} from "lucide-react"
import { useMotionVariants, VIEWPORT } from "@/lib/motion"

const BENEFITS: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: MessageCircle,
    title: "Te escriben en un clic",
    description:
      "Botón de WhatsApp en cada sección, con el mensaje ya escrito. El cliente no tiene que buscarte.",
  },
  {
    icon: Smartphone,
    title: "Se ve bien en cualquier celular",
    description:
      "8 de cada 10 visitas llegan desde el teléfono. Diseñamos pensando en esa pantalla primero.",
  },
  {
    icon: Search,
    title: "Te encuentran en Google",
    description:
      "Optimizamos títulos, textos y velocidad para que aparezcas cuando buscan tu rubro en tu zona.",
  },
  {
    icon: ShoppingBag,
    title: "Mostrás todo lo que vendés",
    description:
      "Tus productos o servicios ordenados, con fotos y precios, sin depender de una historia que caduca.",
  },
  {
    icon: Zap,
    title: "Carga en menos de 2 segundos",
    description:
      "Una web lenta pierde la mitad de las visitas. Las nuestras están optimizadas de fábrica.",
  },
  {
    icon: MapPin,
    title: "Generás confianza",
    description:
      "Ubicación, horarios y reseñas a la vista. El cliente llega sabiendo que existís de verdad.",
  },
]

export function BenefitsSection() {
  const { fadeUp, stagger } = useMotionVariants()

  return (
    <section aria-labelledby="beneficios-titulo" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          variants={fadeUp}
          className="mx-auto max-w-2xl text-center"
        >
          <h2
            id="beneficios-titulo"
            className="text-balance text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Todo lo que tu web <span className="text-gradient">tiene que hacer</span>
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Una página no es una tarjeta de presentación. Es tu vendedor trabajando las 24 horas.
          </p>
        </motion.div>

        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          variants={stagger}
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {BENEFITS.map((benefit) => (
            <motion.li
              key={benefit.title}
              variants={fadeUp}
              className="flex gap-4 rounded-2xl border border-border bg-card/40 p-6"
            >
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
                <benefit.icon className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h3 className="font-semibold text-foreground">{benefit.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
