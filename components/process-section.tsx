"use client"

import { motion } from "framer-motion"
import { MessageSquare, PenTool, Rocket, LifeBuoy, type LucideIcon } from "lucide-react"
import { useMotionVariants, VIEWPORT } from "@/lib/motion"

const STEPS: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: MessageSquare,
    title: "Charlamos",
    description: "Nos contás qué hacés y qué necesitás. Sin compromiso y sin tecnicismos.",
  },
  {
    icon: PenTool,
    title: "Diseñamos",
    description: "Te mostramos una propuesta antes de escribir una sola línea de código.",
  },
  {
    icon: Rocket,
    title: "Publicamos",
    description: "Dominio, hosting y tu web en vivo en 7 días. Nos ocupamos de todo.",
  },
  {
    icon: LifeBuoy,
    title: "Acompañamos",
    description: "Cambios y soporte después del lanzamiento. No te dejamos solo.",
  },
]

export function ProcessSection() {
  const { fadeUp, stagger, reduced } = useMotionVariants()

  return (
    <section
      id="proceso"
      aria-labelledby="proceso-titulo"
      className="border-y border-border bg-card/40 py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          variants={fadeUp}
          className="mx-auto max-w-2xl text-center"
        >
          <h2
            id="proceso-titulo"
            className="text-balance text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Cómo <span className="text-gradient">trabajamos</span>
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Cuatro pasos, sin sorpresas. Sabés en qué punto está tu proyecto en todo momento.
          </p>
        </motion.div>

        <div className="relative mt-16">
          {/* Línea que une los pasos, solo en escritorio. */}
          <motion.div
            aria-hidden
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={VIEWPORT}
            transition={{ duration: reduced ? 0 : 0.9, ease: "easeOut" }}
            className="absolute left-[12.5%] right-[12.5%] top-7 hidden h-px origin-left bg-gradient-to-r from-primary/50 via-primary/50 to-transparent lg:block"
          />

          <motion.ol
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            variants={stagger}
            className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8"
          >
            {STEPS.map((step, index) => (
              <motion.li key={step.title} variants={fadeUp} className="text-center lg:px-3">
                <span className="relative z-10 mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/30 bg-background text-primary">
                  <step.icon className="h-6 w-6" aria-hidden />
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {index + 1}
                  </span>
                </span>
                <h3 className="mt-5 text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-pretty text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  )
}
