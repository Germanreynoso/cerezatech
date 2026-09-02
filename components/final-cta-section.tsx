"use client"

import { motion } from "framer-motion"
import { MessageCircle } from "lucide-react"
import { useMotionVariants, VIEWPORT } from "@/lib/motion"
import { CONTACT, waLink } from "@/lib/site-config"

const WA_MESSAGE = "Hola! Quiero empezar con mi página web. ¿Me pasás información?"

export function FinalCtaSection() {
  const { fadeUp } = useMotionVariants()

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          variants={fadeUp}
          className="relative overflow-hidden rounded-3xl border border-primary/25 bg-card px-6 py-16 text-center sm:px-12"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/18 blur-[100px]"
          />

          <div className="relative">
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Tu próximo cliente te está <span className="text-gradient">buscando</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
              Contanos qué hacés y te decimos qué necesita tu negocio. La primera charla no cuesta
              nada y no te compromete a nada.
            </p>

            <a
              href={waLink(WA_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="glow-gold mt-9 inline-flex items-center gap-2.5 rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <MessageCircle className="h-5 w-5" aria-hidden />
              Escribinos por WhatsApp
            </a>

            <p className="mt-5 text-sm text-muted-foreground">
              {CONTACT.whatsappDisplay} · Respondemos el mismo día
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
