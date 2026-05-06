"use client"

import { motion } from "framer-motion"
import { ExternalLink } from "lucide-react"

const projects = [
  {
    title: "Dulce Momentos",
    category: "Pastelería",
    description: "Pastelería artesanal con pedidos online y catálogo de productos.",
    color: "from-pink-500/20 to-purple-500/20"
  },
  {
    title: "BarberKing",
    category: "Barbería",
    description: "Sistema de reservas online y galería de trabajos realizados.",
    color: "from-blue-500/20 to-cyan-500/20"
  },
  {
    title: "Urban Style",
    category: "Tienda de Ropa",
    description: "E-commerce con catálogo completo y carrito de compras.",
    color: "from-orange-500/20 to-red-500/20"
  },
  {
    title: "PowerGym",
    category: "Gimnasio",
    description: "Planes de entrenamiento, horarios y sistema de membresías.",
    color: "from-green-500/20 to-emerald-500/20"
  },
  {
    title: "Manos Creativas",
    category: "Artesanías",
    description: "Portfolio de productos artesanales con tienda integrada.",
    color: "from-amber-500/20 to-yellow-500/20"
  }
]

export function PortfolioSection() {
  return (
    <section id="portfolio" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Proyectos que <span className="text-gradient">inspiran</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Mirá algunos ejemplos de páginas web que creamos para emprendedores como vos
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group glass rounded-2xl overflow-hidden"
            >
              {/* Project preview mockup */}
              <div className={`h-48 bg-gradient-to-br ${project.color} p-4 relative overflow-hidden`}>
                <div className="bg-card/80 backdrop-blur rounded-lg p-3 h-full">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-primary/30 rounded w-1/2" />
                    <div className="h-2 bg-muted rounded w-full" />
                    <div className="h-2 bg-muted rounded w-3/4" />
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <div className="h-12 bg-primary/20 rounded" />
                      <div className="h-12 bg-primary/20 rounded" />
                    </div>
                  </div>
                </div>
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-12 h-12 bg-primary rounded-full flex items-center justify-center cursor-pointer"
                  >
                    <ExternalLink className="w-5 h-5 text-primary-foreground" />
                  </motion.div>
                </div>
              </div>

              {/* Project info */}
              <div className="p-5">
                <span className="text-xs text-primary font-medium uppercase tracking-wider">
                  {project.category}
                </span>
                <h3 className="text-lg font-semibold text-foreground mt-1 mb-2">{project.title}</h3>
                <p className="text-sm text-muted-foreground">{project.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
