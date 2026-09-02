"use client"

import { motion } from "framer-motion"
import { MessageCircle } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useMotionVariants, VIEWPORT } from "@/lib/motion"
import { waLink } from "@/lib/site-config"

const FAQS = [
  {
    question: "¿Cuánto tarda en estar lista mi página?",
    answer:
      "Entre 7 y 15 días hábiles según el plan. El Básico suele salir en una semana; una tienda completa lleva un poco más. Te damos una fecha concreta antes de arrancar.",
  },
  {
    question: "¿Necesito saber de tecnología para administrarla?",
    answer:
      "No. Te la entregamos funcionando y, si tu plan incluye panel de carga, te enseñamos a usarlo en una videollamada. Si preferís no tocar nada, los cambios los hacemos nosotros.",
  },
  {
    question: "¿El precio incluye dominio y hosting?",
    answer:
      "Sí, el primer año está incluido en todos los planes. A partir del segundo año el costo de renovación es aparte y te avisamos con anticipación cuánto es.",
  },
  {
    question: "¿La página es mía? ¿Qué pasa si dejo de trabajar con ustedes?",
    answer:
      "La página y el dominio son tuyos. Si en algún momento querés llevártela a otro lado, te entregamos todo el código y las credenciales sin costo ni condiciones.",
  },
  {
    question: "¿Qué pasa con el dominio y el hosting al año siguiente?",
    answer:
      "Podés renovarlos con nosotros o gestionarlos por tu cuenta. Si elegís renovar, te pasamos el detalle de lo que cuesta cada cosa, sin recargo por administrarlo.",
  },
  {
    question: "¿Funciona bien en celulares?",
    answer:
      "Es lo primero que diseñamos. La mayoría de tus visitas van a llegar desde el teléfono, así que probamos cada página en pantallas chicas antes de publicar.",
  },
  {
    question: "¿Puedo actualizar el contenido después?",
    answer:
      "Sí. Según el plan tenés un panel para cargar productos y noticias, o nos escribís por WhatsApp y lo hacemos nosotros. El plan Profesional incluye un mes de cambios sin costo.",
  },
  {
    question: "¿Qué pasa si no me gusta el diseño?",
    answer:
      "Te mostramos una propuesta antes de programar nada. Trabajamos sobre ella hasta que te convenza, y recién ahí avanzamos. No pagás por un diseño que no aprobaste.",
  },
]

export function FAQSection() {
  const { fadeUp } = useMotionVariants()

  return (
    <section
      id="faq"
      aria-labelledby="faq-titulo"
      className="border-y border-border bg-card/40 py-20 md:py-28"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          variants={fadeUp}
          className="text-center"
        >
          <h2 id="faq-titulo" className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Preguntas <span className="text-gradient">frecuentes</span>
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Lo que nos consultan antes de empezar. Si te queda alguna duda, escribinos.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          variants={fadeUp}
          className="mt-12"
        >
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((faq, index) => (
              <AccordionItem
                key={faq.question}
                value={`item-${index}`}
                className="border-border"
              >
                <AccordionTrigger className="text-left text-base font-medium hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-pretty leading-relaxed text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          variants={fadeUp}
          className="mt-10 text-center text-sm text-muted-foreground"
        >
          ¿Tenés otra pregunta?{" "}
          <a
            href={waLink("Hola! Tengo una consulta sobre las páginas web.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-semibold text-primary underline-offset-4 hover:underline"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            Preguntanos por WhatsApp
          </a>
        </motion.p>
      </div>
    </section>
  )
}
