"use client"

import { ArrowUpRight } from "lucide-react"
import { useInView } from "@/hooks/use-in-view"
import { VISIBLE_PROJECTS, type Project } from "@/lib/site-config"
import { cn } from "@/lib/utils"

/**
 * Cinta de clientes.
 *
 * El movimiento acá tiene una función: con diez proyectos en fila, el
 * desplazamiento continuo comunica volumen de un vistazo, cosa que una lista
 * estática de tres nombres no hacía.
 *
 * No hay logos de terceros: nombre y rubro en texto, porque no tenemos derecho
 * de uso sobre las marcas de los clientes.
 */

function Item({ project }: { project: Project }) {
  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex shrink-0 items-center gap-3 rounded-xl border border-border bg-card/50 px-5 py-3 transition-colors hover:border-primary/40"
    >
      <div className="min-w-0">
        <p className="whitespace-nowrap text-sm font-semibold text-foreground">
          {project.name}
        </p>
        <p className="whitespace-nowrap text-xs text-muted-foreground">{project.category}</p>
      </div>
      <ArrowUpRight
        className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
        aria-hidden
      />
    </a>
  )
}

export function SocialProofSection() {
  const { ref, inView } = useInView<HTMLDivElement>()

  const projects = VISIBLE_PROJECTS
  if (projects.length === 0) return null

  return (
    <section
      aria-label="Clientes"
      className="overflow-hidden border-y border-border bg-card/40 py-10"
    >
      <p className="mb-6 text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground">
        Ya confiaron en nosotros
      </p>

      {/*
        El markup es siempre el mismo. La variante sin movimiento la resuelve
        el CSS: `useReducedMotion` devuelve false en el servidor y el valor real
        tras hidratar, así que ramificar la estructura acá rompería la
        hidratación. Con movimiento reducido la pista pasa a envolverse en
        varias líneas y el duplicado se oculta.
      */}
      <div ref={ref} className="marquee-mask marquee-track px-4">
        <div className={cn("animate-marquee flex w-max gap-3", !inView && "is-paused")}>
          {projects.map((p) => (
            <Item key={p.slug} project={p} />
          ))}
          {/* Copia para que el bucle sea continuo. Oculta a lectores de pantalla. */}
          <span aria-hidden className="marquee-dup flex gap-3">
            {projects.map((p) => (
              <Item key={`dup-${p.slug}`} project={p} />
            ))}
          </span>
        </div>
      </div>
    </section>
  )
}
