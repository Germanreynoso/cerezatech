"use client"

import { AnimatePresence, motion } from "framer-motion"
import { MessageCircle } from "lucide-react"
import { useScrolled } from "@/hooks/use-scroll-spy"
import { waLink } from "@/lib/site-config"

const WA_MESSAGE = "Hola! Quiero información sobre una página web para mi negocio."

/**
 * Acceso permanente a WhatsApp en celular.
 *
 * Aparece recién después de 400 px para no tapar el CTA del hero, y se esconde
 * mientras el menú está abierto.
 */
export function WhatsAppFab({ hidden = false }: { hidden?: boolean }) {
  const scrolled = useScrolled(400)
  const visible = scrolled && !hidden

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          href={waLink(WA_MESSAGE)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Hablar por WhatsApp"
          className="glow-gold fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg md:hidden"
        >
          <MessageCircle className="h-6 w-6" aria-hidden />
        </motion.a>
      )}
    </AnimatePresence>
  )
}
