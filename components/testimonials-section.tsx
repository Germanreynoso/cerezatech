"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Carolina García",
    business: "Emprendedora",
    text: "Mi negocio ahora se ve mucho más profesional y los clientes me encuentran más fácil.",
    avatar: "CG"
  },
  {
    name: "Alejandro Martínez",
    business: "Dueño de Local",
    text: "La página quedó increíble y empecé a recibir más consultas desde Google.",
    avatar: "AM"
  },
  {
    name: "Julieta Sosa",
    business: "Organizadora de Eventos",
    text: "La invitación virtual fue un éxito, todos quedaron sorprendidos.",
    avatar: "JS"
  }
]

export function TestimonialsSection() {
  return (
    <section className="py-24 relative bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Lo que dicen nuestros <span className="text-gradient">clientes</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Emprendedores reales que transformaron su negocio con una página web profesional
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass rounded-2xl p-6"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-foreground mb-6 leading-relaxed">
                {`"${testimonial.text}"`}
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-primary font-semibold">{testimonial.avatar}</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.business}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
