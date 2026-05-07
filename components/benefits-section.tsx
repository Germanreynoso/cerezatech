"use client"

import { motion } from "framer-motion"
import { Search, MessageCircle, Smartphone, ShoppingBag, MapPin, Shield } from "lucide-react"

const benefits = [
  {
    icon: MessageCircle,
    title: "TUS CLIENTES TE ESCRIBEN EN UN CLIC",
    description: "Integración directa con WhatsApp para consultas y ventas rápidas."
  },
  {
    icon: Smartphone,
    title: "SE VE PERFECTA EN CUALQUIER CELULAR",
    description: "Tu página adaptada para móviles, tablets y computadoras."
  },
  {
    icon: Search,
    title: "TE ENCUENTRAN EN GOOGLE",
    description: "Optimizamos tu web para que más personas descubran tu negocio."
  },
  {
    icon: ShoppingBag,
    title: "MOSTRÁ TODO LO QUE VENDÉS",
    description: "Exhibí tus productos o servicios de forma clara y profesional."
  },
  {
    icon: MapPin,
    title: "GENERÁ MÁS CONFIANZA",
    description: "Mostrá ubicación, reseñas y presencia profesional online."
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
}

export function BenefitsSection() {
  return (
    <section id="beneficios" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Todo lo que tu negocio <span className="text-gradient">necesita</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Creamos páginas web completas con todas las herramientas para que vendas más
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group glass rounded-2xl p-6 hover:bg-secondary/50 transition-all cursor-pointer"
            >
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                <benefit.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground text-sm">{benefit.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
