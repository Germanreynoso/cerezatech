"use client"

import { motion } from "framer-motion"
import { Quote, Star } from "lucide-react"
import { useMotionVariants, VIEWPORT } from "@/lib/motion"

/**
 * TODO: reemplazar por testimonios reales con nombre y autorización del cliente.
 *
 * Hasta entonces se identifican solo por rubro y localidad: no inventamos
 * nombres propios ni fotos de personas que no existen.
 */
const TESTIMONIALS = [
  {
    text: "Antes vendía solo por Instagram y me pasaba el día respondiendo el mismo precio. Ahora el cliente entra, mira todo y me escribe sabiendo qué quiere.",
    author: "Comercio de tecnología",
    location: "Tafí del Valle",
  },
  {
    text: "Necesitábamos un lugar donde el vecino y el turista encontraran la información sin tener que preguntar. Lo resolvieron rápido y quedó muy claro de usar.",
    author: "Organismo público",
    location: "Tucumán",
  },
  {
    text: "Lo que más valoro es que no me dejaron sola después de publicar. Cada vez que necesité un cambio, lo hicieron el mismo día.",
    author: "Estudio de terapias holísticas",
    location: "Tucumán",
  },
]

export function TestimonialsSection() {
  const { fadeUp, stagger } = useMotionVariants()

  return (
    <section aria-labelledby="testimonios-titulo" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          variants={fadeUp}
          className="mx-auto max-w-2xl text-center"
        >
          <h2
            id="testimonios-titulo"
            className="text-balance text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Lo que dicen los <span className="text-gradient">clientes</span>
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Negocios y organismos que hoy tienen su sitio funcionando.
          </p>
        </motion.div>

        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          variants={stagger}
          className="mt-14 grid gap-6 md:grid-cols-3"
        >
          {TESTIMONIALS.map((testimonial) => (
            <motion.li
              key={testimonial.text}
              variants={fadeUp}
              className="flex flex-col rounded-2xl border border-border bg-card/40 p-7"
            >
              <Quote className="h-7 w-7 shrink-0 text-primary/50" aria-hidden />

              <blockquote className="mt-4 flex-1 text-pretty leading-relaxed text-foreground">
                {testimonial.text}
              </blockquote>

              <div className="mt-6 border-t border-border pt-5">
                <div className="flex gap-0.5" role="img" aria-label="5 de 5 estrellas">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" aria-hidden />
                  ))}
                </div>
                <p className="mt-2.5 font-semibold text-foreground">{testimonial.author}</p>
                <p className="text-sm text-muted-foreground">{testimonial.location}</p>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
