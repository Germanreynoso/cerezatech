"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

const faqs = [
  {
    question: "¿Cuánto tiempo tarda en estar lista mi página web?",
    answer: "Dependiendo del plan que elijas, tu página web puede estar lista entre 7 y 15 días hábiles. Te mantenemos informado en todo momento del avance."
  },
  {
    question: "¿Necesito conocimientos técnicos para administrarla?",
    answer: "¡Para nada! Creamos páginas web fáciles de administrar. Además, te damos una capacitación personalizada para que puedas hacer cambios básicos vos mismo."
  },
  {
    question: "¿El precio incluye dominio y hosting?",
    answer: "Sí, todos nuestros planes incluyen el dominio .com por 1 año. El plan Premium también incluye hosting por 1 año. Después podés renovarlo a un precio preferencial."
  },
  {
    question: "¿La página funciona bien en celulares?",
    answer: "Absolutamente. Todas nuestras páginas son 100% responsive, lo que significa que se ven y funcionan perfectamente en celulares, tablets y computadoras."
  },
  {
    question: "¿Puedo actualizar el contenido después?",
    answer: "Sí, podés hacer cambios básicos vos mismo o pedirnos a nosotros. Ofrecemos paquetes de mantenimiento mensual para quienes prefieren delegar las actualizaciones."
  },
  {
    question: "¿Qué pasa si no me gusta el diseño?",
    answer: "Trabajamos con vos en cada paso del proceso. Incluimos hasta 3 rondas de revisiones para asegurarnos de que el diseño final te encante."
  }
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="py-24 relative bg-secondary/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Preguntas <span className="text-gradient">frecuentes</span>
          </h2>
          <p className="text-muted-foreground">
            Resolvemos tus dudas para que tomes la mejor decisión
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="glass rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-medium text-foreground pr-4">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="px-5 pb-5 text-muted-foreground">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
