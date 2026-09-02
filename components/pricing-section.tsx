"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, Mail, MessageCircle } from "lucide-react"
import { useMotionVariants, VIEWPORT } from "@/lib/motion"
import {
  BUYOUT_MONTHS,
  CUSTOM_TIER,
  MIN_TERM_MONTHS,
  PLANS,
  PRICES_UPDATED,
  billingExtras,
  mailLink,
  waLink,
  type BillingMode,
} from "@/lib/site-config"
import { cn } from "@/lib/utils"

const MODES: { key: BillingMode; label: string; hint: string }[] = [
  { key: "contado", label: "Pago único", hint: "Pagás una vez y la web es tuya" },
  { key: "suscripcion", label: "Suscripción", hint: "Entrás con menos y pagás por mes" },
]

export function PricingSection() {
  const { fadeUp, stagger } = useMotionVariants()
  const [mode, setMode] = useState<BillingMode>("contado")

  const isSub = mode === "suscripcion"
  const activeMode = MODES.find((m) => m.key === mode)!

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
            Elegí cómo te conviene pagar. Estos valores son el punto de partida: el precio final
            depende del alcance que definamos juntos.
          </p>
        </motion.div>

        {/* Selector de modalidad */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          variants={fadeUp}
          className="mt-10 flex flex-col items-center"
        >
          <div
            role="tablist"
            aria-label="Forma de pago"
            className="inline-flex rounded-xl border border-border bg-card/60 p-1"
          >
            {MODES.map((m) => (
              <button
                key={m.key}
                type="button"
                role="tab"
                aria-selected={mode === m.key}
                onClick={() => setMode(m.key)}
                className={cn(
                  "rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors",
                  mode === m.key
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {m.label}
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{activeMode.hint}</p>
        </motion.div>

        <motion.div
          key={mode}
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="mt-10 grid items-start gap-6 lg:grid-cols-3"
        >
          {PLANS.map((plan) => {
            const extras = billingExtras(plan, mode)
            const waMessage = isSub
              ? `Hola! Me interesa el plan ${plan.name} por suscripción (${plan.pricing.setup} de setup + ${plan.pricing.monthly} por mes). ¿Me pasás más información?`
              : `Hola! Me interesa el plan ${plan.name} (${plan.pricing.oneOff}, pago único). ¿Me pasás más información?`

            return (
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

                {isSub ? (
                  <div className="mt-6">
                    <p className="flex items-baseline gap-1.5">
                      <span className="text-4xl font-bold tracking-tight text-foreground">
                        {plan.pricing.monthly}
                      </span>
                      <span className="text-sm text-muted-foreground">por mes</span>
                    </p>
                    <p className="mt-1.5 text-sm text-muted-foreground">
                      + {plan.pricing.setup} de pago inicial
                    </p>
                    <p className="mt-2 inline-flex rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                      o {plan.pricing.annual} al año — 2 meses bonificados
                    </p>
                  </div>
                ) : (
                  <div className="mt-6">
                    <p className="flex items-baseline gap-2">
                      <span className="text-sm text-muted-foreground">desde</span>
                      <span className="text-4xl font-bold tracking-tight text-foreground">
                        {plan.pricing.oneOff}
                      </span>
                    </p>
                    <p className="mt-1.5 text-sm text-muted-foreground">
                      pago único, según el alcance
                    </p>
                  </div>
                )}

                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {plan.description}
                </p>

                <ul className="mt-7 flex-1 space-y-3.5">
                  {[...plan.features, ...extras].map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={waLink(waMessage)}
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
            )
          })}
        </motion.div>

        {/* Condiciones de la suscripción. Van a la vista, no en letra chica:
            es la primera pregunta que hace todo el que evalúa este modelo. */}
        {isSub && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 rounded-2xl border border-border bg-card/40 p-8"
          >
            <h3 className="text-lg font-semibold text-foreground">
              Cómo funciona la suscripción
            </h3>
            <dl className="mt-5 grid gap-6 sm:grid-cols-3">
              <div>
                <dt className="text-sm font-semibold text-primary">Permanencia</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  Mínimo {MIN_TERM_MONTHS} meses. Después seguís mes a mes y podés dar de baja
                  avisando con 30 días.
                </dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-primary">Si querés quedártela</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  Cumplidos los {MIN_TERM_MONTHS} meses, transferimos el sitio y el dominio a tu
                  nombre abonando {BUYOUT_MONTHS} mensualidades.
                </dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-primary">Si das de baja</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  El sitio se da de baja y te entregamos tus contenidos —textos, fotos y datos— y
                  el dominio. Nada queda retenido.
                </dd>
              </div>
            </dl>
          </motion.div>
        )}

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
