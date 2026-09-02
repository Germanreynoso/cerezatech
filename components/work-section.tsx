"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, MessageCircle } from "lucide-react"
import { BrowserFrame, PhoneFrame } from "@/components/browser-frame"
import { useMotionVariants, VIEWPORT } from "@/lib/motion"
import { VISIBLE_PROJECTS, projectShot, waLink } from "@/lib/site-config"
import { cn } from "@/lib/utils"

function domainOf(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "")
}

export function WorkSection() {
  const { fadeUp, stagger } = useMotionVariants()
  const projects = VISIBLE_PROJECTS

  if (projects.length === 0) return null

  // Con un número impar de proyectos, el último ocupa el ancho completo para
  // que no quede una celda vacía en la grilla.
  const lastIsWide = projects.length % 2 === 1 && projects.length > 1

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
            No son maquetas. Son sitios en producción que podés abrir ahora mismo y recorrer.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          variants={stagger}
          className="mt-14 grid gap-8 lg:grid-cols-2"
        >
          {projects.map((project, index) => {
            const isWide = lastIsWide && index === projects.length - 1

            return (
              <motion.article
                key={project.slug}
                variants={fadeUp}
                className={cn(
                  "group overflow-hidden rounded-2xl border border-border bg-card/50 transition-colors hover:border-primary/40",
                  // La tarjeta ancha reparte el ancho entre captura e info en
                  // vez de estirar el screenshot a toda la fila.
                  isWide
                    ? "flex flex-col lg:col-span-2 lg:grid lg:grid-cols-[3fr_2fr] lg:items-center"
                    : "flex flex-col"
                )}
              >
                <div className="relative p-5 pb-0 sm:p-7 sm:pb-0 lg:pb-0">
                  <BrowserFrame
                    src={projectShot(project.slug, "desktop")}
                    alt={`Vista de escritorio del sitio de ${project.name}`}
                    label={domainOf(project.url)}
                    sizes={
                      isWide
                        ? "(min-width: 1024px) 46vw, 88vw"
                        : "(min-width: 1024px) 42vw, 88vw"
                    }
                  />

                  <PhoneFrame
                    src={projectShot(project.slug, "mobile")}
                    alt={`Vista en celular del sitio de ${project.name}`}
                    sizes="140px"
                    className="absolute bottom-0 right-8 hidden w-[5.5rem] translate-y-6 sm:block lg:w-[6.5rem]"
                  />
                </div>

                <div
                  className={cn(
                    "flex flex-1 flex-col p-7 pt-9 sm:pt-11",
                    isWide && "lg:pt-7"
                  )}
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-primary/12 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                      {project.category}
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl font-bold text-foreground sm:text-2xl">
                    {project.name}
                  </h3>

                  <p className="mt-3 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
                    {project.summary}
                  </p>

                  <ul className="mt-5 flex flex-wrap gap-2">
                    {project.highlights.map((highlight) => (
                      <li
                        key={highlight}
                        className="rounded-lg border border-border px-2.5 py-1 text-xs text-muted-foreground"
                      >
                        {highlight}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-7 inline-flex w-fit items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    Visitar sitio
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </a>
                </div>
              </motion.article>
            )
          })}
        </motion.div>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          variants={fadeUp}
          className="mt-12 text-center text-muted-foreground"
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
