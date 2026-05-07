"use client"

import { motion } from "framer-motion"
import { Layout, ShoppingCart, BookOpen, PartyPopper, Search, MessageSquare, Smartphone, Wrench } from "lucide-react"

const services = [
  { title: "Landing Pages modernas", icon: <Layout className="w-6 h-6" /> },
  { title: "Tiendas online", icon: <ShoppingCart className="w-6 h-6" /> },
  { title: "Catálogos digitales", icon: <BookOpen className="w-6 h-6" /> },
  { title: "Invitaciones virtuales", icon: <PartyPopper className="w-6 h-6" /> },
  { title: "Optimización para Google", icon: <Search className="w-6 h-6" /> },
  { title: "Integración con WhatsApp", icon: <MessageSquare className="w-6 h-6" /> },
  { title: "Diseño responsive", icon: <Smartphone className="w-6 h-6" /> },
  { title: "Mantenimiento y soporte", icon: <Wrench className="w-6 h-6" /> }
]

export function ServicesSection() {
  return (
    <section id="servicios" className="py-24 relative bg-secondary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Todo lo que tu negocio <br />
            <span className="text-gradient">necesita para crecer online</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="p-6 rounded-2xl glass border border-white/5 flex flex-col items-center text-center group hover:border-primary/50 transition-all"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform">
                {service.icon}
              </div>
              <h3 className="text-sm font-bold text-foreground">{service.title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
