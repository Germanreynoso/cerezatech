"use client"

import { motion } from "framer-motion"
import { Code2, Eye, LifeBuoy, Wallet, type LucideIcon } from "lucide-react"
import { useMotionVariants, VIEWPORT } from "@/lib/motion"
import { VISIBLE_PROJECTS } from "@/lib/site-config"

/**
 * Reemplaza a la sección de testimonios.
 *
 * Los testimonios anteriores eran inventados, y eran lo único no verificable
 * de una página que se apoya en que todo se puede comprobar. Acá van hechos
 * que el visitante puede chequear —los sitios están online— y compromisos que
 * se pueden reclamar.
 *
 * TODO: cuando haya testimonios reales, con nombre y autorización del cliente,
 * agregarlos como complemento de esta sección, no en lugar de ella.
 */

const COMMITMENTS: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Code2,
    title: "La web es tuya",
    description:
      "El código y el dominio quedan a tu nombre. Si algún día querés llevártelos a otro lado, te los entregamos sin costo ni condiciones.",
  },
  {
    icon: Eye,
    title: "Aprobás antes de que programemos",
    description:
      "Primero ves el diseño. Trabajamos sobre esa propuesta hasta que te convenza, y recién ahí escribimos código.",
  },
  {
    icon: Wallet,
    title: "Precio cerrado antes de empezar",
    description:
      "Acordamos el alcance y el monto por escrito. No aparecen adicionales a mitad de camino.",
  },
  {
    icon: LifeBuoy,
    title: "No desaparecemos al publicar",
    description:
      "Después del lanzamiento seguimos disponibles por WhatsApp para los cambios que vayan surgiendo.",
  },
]

export function TrustSection() {
  const { fadeUp, stagger } = useMotionVariants()

  const total = VISIBLE_PROJECTS.length
  const sectors = new Set(VISIBLE_PROJECTS.map((p) => p.sector)).size

  const STATS = [
    { value: String(total), label: "sitios en producción" },
    { value: String(sectors), label: "rubros distintos" },
    { value: "100%", label: "abribles ahora mismo" },
  ]

  return (
    <section aria-labelledby="confianza-titulo" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          variants={fadeUp}
          className="mx-auto max-w-2xl text-center"
        >
          <h2
            id="confianza-titulo"
            className="text-balance text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Por qué podés <span className="text-gradient">confiar</span>
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            No te pedimos que nos creas. Todos los trabajos de esta página están online: entrá,
            recorrelos y sacá tus conclusiones.
          </p>
        </motion.div>

        <motion.dl
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          variants={stagger}
          className="mt-12 grid gap-6 rounded-2xl border border-border bg-card/40 p-8 sm:grid-cols-3"
        >
          {STATS.map((stat) => (
            <motion.div key={stat.label} variants={fadeUp} className="text-center">
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="block text-4xl font-bold tracking-tight text-primary">
                  {stat.value}
                </span>
                <span className="mt-1 block text-sm text-muted-foreground">{stat.label}</span>
              </dd>
            </motion.div>
          ))}
        </motion.dl>

        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          variants={stagger}
          className="mt-6 grid gap-5 sm:grid-cols-2"
        >
          {COMMITMENTS.map((item) => (
            <motion.li
              key={item.title}
              variants={fadeUp}
              className="flex gap-4 rounded-2xl border border-border bg-card/40 p-6"
            >
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
                <item.icon className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="mt-1.5 text-pretty text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
