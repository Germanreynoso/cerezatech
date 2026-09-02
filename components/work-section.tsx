"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, MessageCircle } from "lucide-react"
import { BrowserFrame, PhoneFrame } from "@/components/browser-frame"
import { useMotionVariants, VIEWPORT } from "@/lib/motion"
import {
  FEATURED_PROJECTS,
  OTHER_PROJECTS,
  VISIBLE_PROJECTS,
  projectShot,
  waLink,
  type Project,
} from "@/lib/site-config"

function domainOf(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "")
}

/** Tarjeta grande: captura de escritorio, vista de celular y descripción. */
function FeaturedCard({ project }: { project: Project }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card/50 transition-colors hover:border-primary/40">
      <div className="relative p-5 pb-0">
        <BrowserFrame
          src={projectShot(project.slug, "desktop")}
          alt={`Vista de escritorio del sitio de ${project.name}`}
          label={domainOf(project.url)}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 88vw"
        />
        <PhoneFrame
          src={projectShot(project.slug, "mobile")}
          alt={`Vista en celular del sitio de ${project.name}`}
          sizes="90px"
          className="absolute bottom-0 right-7 w-[3.25rem] translate-y-5 lg:w-16"
        />
      </div>

      <div className="flex flex-1 flex-col p-6 pt-8">
        <span className="w-fit rounded-full bg-primary/12 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">
          {project.category}
        </span>

        <h3 className="mt-3 text-lg font-bold text-foreground">{project.name}</h3>

        <p className="mt-2.5 flex-1 text-pretty text-sm leading-relaxed text-muted-foreground">
          {project.summary}
        </p>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {project.highlights.map((h) => (
            <li
              key={h}
              className="rounded-lg border border-border px-2 py-0.5 text-[11px] text-muted-foreground"
            >
              {h}
            </li>
          ))}
        </ul>

        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
        >
          Visitar sitio
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </a>
      </div>
    </article>
  )
}

/** Tarjeta compacta: la pieza entera es el enlace al sitio. */
function CompactCard({ project }: { project: Project }) {
  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card/40 transition-colors hover:border-primary/40 hover:bg-card"
    >
      <div className="relative aspect-[1440/900] overflow-hidden border-b border-border">
        <BrowserFrame
          src={projectShot(project.slug, "desktop")}
          alt={`Sitio de ${project.name}`}
          label={domainOf(project.url)}
          sizes="(min-width: 1024px) 23vw, (min-width: 640px) 45vw, 88vw"
          chromeless
          className="h-full rounded-none border-0 shadow-none"
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-foreground">{project.name}</h3>
            <p className="mt-0.5 text-xs text-primary">{project.category}</p>
          </div>
          <ArrowUpRight
            className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
            aria-hidden
          />
        </div>

        <p className="mt-2.5 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
          {project.summary}
        </p>
      </div>
    </a>
  )
}

export function WorkSection() {
  const { fadeUp, stagger } = useMotionVariants()

  if (VISIBLE_PROJECTS.length === 0) return null

  return (
    <section id="trabajos" aria-labelledby="trabajos-titulo" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          variants={fadeUp}
          className="mx-auto max-w-2xl text-center"
        >
          <h2
            id="trabajos-titulo"
            className="text-balance text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Sitios que ya están <span className="text-gradient">funcionando</span>
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            No son maquetas. Son {VISIBLE_PROJECTS.length} sitios en producción que podés abrir
            ahora mismo y recorrer.
          </p>
        </motion.div>

        {FEATURED_PROJECTS.length > 0 && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            variants={stagger}
            className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {FEATURED_PROJECTS.map((project) => (
              <motion.div key={project.slug} variants={fadeUp} className="flex">
                <div className="flex w-full">
                  <FeaturedCard project={project} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {OTHER_PROJECTS.length > 0 && (
          <>
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT}
              variants={fadeUp}
              className="mt-16 text-sm font-semibold uppercase tracking-widest text-muted-foreground"
            >
              Más trabajos
            </motion.p>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT}
              variants={stagger}
              className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
            >
              {OTHER_PROJECTS.map((project) => (
                <motion.div key={project.slug} variants={fadeUp} className="flex">
                  <div className="flex w-full">
                    <CompactCard project={project} />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          variants={fadeUp}
          className="mt-14 text-center text-muted-foreground"
        >
          ¿Querés algo parecido para tu negocio?{" "}
          <a
            href={waLink("Hola! Vi los trabajos en la web y quiero algo parecido para mi negocio.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-semibold text-primary underline-offset-4 hover:underline"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            Contanos qué necesitás
          </a>
        </motion.p>
      </div>
    </section>
  )
}
