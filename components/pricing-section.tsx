"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { useMotionVariants, VIEWPORT } from "@/lib/motion"
import { PLANS, waLink } from "@/lib/site-config"
import { cn } from "@/lib/utils"

export function PricingSection() {
  const { fadeUp, stagger } = useMotionVariants()

  return (
    <section id="planes" aria-labelledby="planes-titulo" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          variants={fadeUp}
          className="mx-auto max-w-2xl text-center"
        >
          <h2
            id="planes-titulo"
            className="text-balance text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Planes <span className="text-gradient">claros</span>, sin letra chica
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Pago único por el desarrollo. Todos los planes incluyen dominio y hosting el primer
            año.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          variants={stagger}
          className="mt-14 grid items-start gap-6 lg:grid-cols-3"
        >
          {PLANS.map((plan) => (
            <motion.div
              key={plan.name}
              variants={fadeUp}
              className={cn(
                "relative flex h-full flex-col rounded-2xl border p-8",
                plan.featured
                  ? "border-primary/45 bg-card lg:-mt-4 lg:pb-10 lg:pt-12"
                  : "border-border bg-card/40"
              )}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground">
                  Más elegido
                </span>
              )}

              <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{plan.audience}</p>

              <p className="mt-6 flex items-baseline gap-2">
                <span className="text-4xl font-bold tracking-tight text-foreground">
                  {plan.price}
                </span>
                <span className="text-sm text-muted-foreground">pago único</span>
              </p>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {plan.description}
              </p>

              <ul className="mt-7 flex-1 space-y-3.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href={waLink(
                  `Hola! Me interesa el plan ${plan.name} (${plan.price}). ¿Me pasás más información?`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "mt-8 inline-flex items-center justify-center rounded-xl px-5 py-3.5 font-semibold transition-all",
                  plan.featured
                    ? "glow-gold bg-primary text-primary-foreground hover:opacity-90"
                    : "border border-border text-foreground hover:border-primary hover:text-primary"
                )}
              >
                Quiero el plan {plan.name}
              </a>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          variants={fadeUp}
          className="mt-10 text-center text-sm text-muted-foreground"
        >
          ¿Tu proyecto no entra en ninguno?{" "}
          <a
            href={waLink("Hola! Tengo un proyecto que no entra en los planes. ¿Lo charlamos?")}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            Armamos un presupuesto a medida
          </a>
        </motion.p>
      </div>
    </section>
  )
}
