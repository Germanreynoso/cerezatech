"use client"

import { motion } from "framer-motion"
import { Search, MessageCircle, Smartphone, ShoppingBag, MapPin, Shield } from "lucide-react"

const benefits = [
  {
    icon: Search,
    title: "Te encuentran en Google",
    description: "Optimización SEO para que tus clientes te encuentren fácilmente cuando buscan lo que ofreces."
  },
  {
    icon: MessageCircle,
    title: "Botón directo de WhatsApp",
    description: "Tus clientes pueden contactarte con un solo clic, aumentando las conversiones."
  },
  {
    icon: Smartphone,
    title: "Diseño responsive",
    description: "Tu web se ve perfecta en celulares, tablets y computadoras."
  },
  {
    icon: ShoppingBag,
    title: "Catálogo de productos",
    description: "Muestra tus productos o servicios de forma profesional y atractiva."
  },
  {
    icon: MapPin,
    title: "Google Maps y reseñas",
    description: "Integración con ubicación y testimonios para generar más confianza."
  },
  {
    icon: Shield,
    title: "Más confianza para tu marca",
    description: "Una web profesional transmite credibilidad y seriedad a tus clientes."
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
