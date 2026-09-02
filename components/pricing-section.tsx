"use client"

import { motion } from "framer-motion"
import { Check, Mail, MessageCircle } from "lucide-react"
import { useMotionVariants, VIEWPORT } from "@/lib/motion"
import { CUSTOM_TIER, PLANS, PRICES_UPDATED, mailLink, waLink } from "@/lib/site-config"
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
            Pago único por el desarrollo, sin cuotas ni permanencia. Estos valores son el punto
            de partida: el precio final depende del alcance que definamos juntos.
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
                <span className="text-sm text-muted-foreground">desde</span>
                <span className="text-4xl font-bold tracking-tight text-foreground">
                  {plan.price}
                </span>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                pago único, según el alcance
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

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          variants={fadeUp}
          className="mt-8 rounded-2xl border border-border bg-card/40 p-8 lg:p-10"
        >
          <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-center">
            <div>
              <span className="inline-block rounded-full border border-primary/40 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                Proyectos grandes
              </span>
              <h3 className="mt-4 text-2xl font-bold text-foreground">{CUSTOM_TIER.name}</h3>
              <p className="mt-3 max-w-xl text-pretty leading-relaxed text-muted-foreground">
                {CUSTOM_TIER.description}
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href={waLink(
                    "Hola! Tengo un proyecto que no entra en los planes y quiero un presupuesto a medida."
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden />
                  Pedir presupuesto
                </a>
                <a
                  href={mailLink(
                    "Consulta por un proyecto a medida",
                    "Hola! Te escribo por un proyecto a medida.\n\nDe qué se trata:\n\nPara cuándo lo necesito:\n"
                  )}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <Mail className="h-4 w-4" aria-hidden />
                  Escribir por mail
                </a>
              </div>
            </div>

            <ul className="space-y-3 lg:border-l lg:border-border lg:pl-8">
              {CUSTOM_TIER.examples.map((example) => (
                <li key={example} className="flex items-start gap-3 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                  <span className="text-muted-foreground">{example}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          variants={fadeUp}
          className="mt-8 text-center text-sm text-muted-foreground"
        >
          Precios de referencia actualizados a {PRICES_UPDATED}. Escribinos y te pasamos el valor
          vigente para tu proyecto.
        </motion.p>
      </div>
    </section>
  )
}
