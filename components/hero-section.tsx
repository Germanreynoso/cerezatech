"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight, Check, MessageCircle } from "lucide-react"
import { BrowserFrame } from "@/components/browser-frame"
import { useMotionVariants } from "@/lib/motion"
import { VISIBLE_PROJECTS, projectShot, waLink } from "@/lib/site-config"

const TRUST_POINTS = [
  "Entrega en 7 días",
  "Dominio y hosting incluidos",
  "Soporte post-lanzamiento",
]

const WA_MESSAGE = "Hola! Quiero información sobre una página web para mi negocio."

/** Quita el protocolo y la barra final para mostrar el dominio en la barra del navegador. */
function domainOf(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "")
}

export function HeroSection() {
  const { reduced, fadeUp, stagger } = useMotionVariants()
  const [index, setIndex] = useState(0)
  const projects = VISIBLE_PROJECTS

  // Rota entre los proyectos disponibles. Con uno solo no hay nada que rotar,
  // y con movimiento reducido la rotación se desactiva por completo.
  useEffect(() => {
    if (reduced || projects.length < 2) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % projects.length)
    }, 5000)
    return () => clearInterval(id)
  }, [reduced, projects.length])

  const current = projects[index]

  return (
    <section
      id="inicio"
      className="relative flex min-h-[92svh] items-center overflow-hidden pt-24 pb-16 md:pt-28"
    >
      {/* Halo dorado de fondo. Estático: no consume presupuesto de animación. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-primary/12 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 h-[28rem] w-[28rem] translate-x-1/3 rounded-full bg-primary/8 blur-[120px]"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-12 lg:px-8">
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          <motion.p
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
            </span>
            Sitios reales, funcionando hoy
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="mt-6 text-balance text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
          >
            Tu negocio necesita una web que{" "}
            <span className="text-gradient">venda</span>, no una que solo exista.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground"
          >
            Diseñamos y publicamos páginas web rápidas, que se ven bien en cualquier celular y
            convierten visitas en clientes por WhatsApp.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#planes"
              className="glow-gold inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Quiero mi página web
              <ArrowRight className="h-5 w-5" aria-hidden />
            </a>
            <a
              href="#trabajos"
              className="glass inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              Ver trabajos
            </a>
          </motion.div>

          <motion.ul
            variants={fadeUp}
            className="mt-8 flex flex-wrap gap-x-6 gap-y-2.5 text-sm text-muted-foreground"
          >
            {TRUST_POINTS.map((point) => (
              <li key={point} className="flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                {point}
              </li>
            ))}
          </motion.ul>

          <motion.a
            variants={fadeUp}
            href={waLink(WA_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            ¿Dudas? Escribinos por WhatsApp, respondemos el mismo día
          </motion.a>
        </motion.div>

        {current && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="relative lg:pl-4"
          >
            {/* Imagen y epígrafe comparten el mismo `key`: con `mode="wait"` el
                epígrafe cambiaría antes que la captura y quedarían desfasados. */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current.slug}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduced ? 0 : 0.4 }}
              >
                <BrowserFrame
                  src={projectShot(current.slug, "desktop")}
                  alt={`Sitio web de ${current.name} hecho por Luckywebs`}
                  label={domainOf(current.url)}
                  priority
                  sizes="(min-width: 1024px) 46vw, 92vw"
                />
                <p className="mt-4 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{current.name}</span>
                  {" · "}
                  {current.category}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="-mt-6 flex justify-end">
              {projects.length > 1 && (
                <div className="flex gap-2" role="tablist" aria-label="Proyectos destacados">
                  {projects.map((project, i) => (
                    <button
                      key={project.slug}
                      type="button"
                      role="tab"
                      aria-selected={i === index}
                      aria-label={`Ver ${project.name}`}
                      onClick={() => setIndex(i)}
                      className={`h-2 rounded-full transition-all ${
                        i === index ? "w-6 bg-primary" : "w-2 bg-border hover:bg-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
