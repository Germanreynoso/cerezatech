"use client"

import { motion } from "framer-motion"
import { Check, Sparkles } from "lucide-react"

const plans = [
  {
    name: "Básico",
    price: "$299",
    period: "USD",
    description: "Perfecto para emprendedores que recién comienzan",
    features: [
      "Página web de 1-3 secciones",
      "Diseño responsive",
      "Botón de WhatsApp",
      "Optimización SEO básica",
      "1 mes de soporte",
      "Dominio .com incluido"
    ],
    featured: false
  },
  {
    name: "Profesional",
    price: "$499",
    period: "USD",
    description: "El más elegido por pequeños negocios",
    features: [
      "Página web de 5-7 secciones",
      "Diseño responsive premium",
      "Botón de WhatsApp",
      "Optimización SEO avanzada",
      "Integración Google Maps",
      "Catálogo de productos",
      "Formulario de contacto",
      "3 meses de soporte",
      "Dominio .com incluido"
    ],
    featured: true
  },
  {
    name: "Premium",
    price: "$799",
    period: "USD",
    description: "Para negocios que quieren destacar",
    features: [
      "Página web ilimitada",
      "Diseño responsive premium",
      "Botón de WhatsApp",
      "Optimización SEO completa",
      "Integración Google Maps",
      "Catálogo de productos",
      "Formulario de contacto",
      "Sistema de reservas",
      "Blog integrado",
      "6 meses de soporte",
      "Dominio .com incluido",
      "Hosting 1 año incluido"
    ],
    featured: false
  }
]

export function PricingSection() {
  return (
    <section id="planes" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Planes que se adaptan a <span className="text-gradient">tu negocio</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Elegí el plan perfecto para tu emprendimiento. Todos incluyen diseño profesional y soporte personalizado.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative glass rounded-2xl p-8 ${plan.featured ? 'border-2 border-primary glow-yellow' : ''}`}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Más popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${plan.featured ? 'bg-primary' : 'bg-primary/20'}`}>
                      <Check className={`w-3 h-3 ${plan.featured ? 'text-primary-foreground' : 'text-primary'}`} />
                    </div>
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <motion.a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`block w-full text-center py-3 rounded-xl font-semibold transition-all ${
                  plan.featured
                    ? 'bg-primary text-primary-foreground hover:opacity-90'
                    : 'bg-secondary text-foreground hover:bg-secondary/80'
                }`}
              >
                Empezar ahora
              </motion.a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
