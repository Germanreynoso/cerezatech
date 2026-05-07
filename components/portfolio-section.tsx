"use client"

import { motion } from "framer-motion"
import { ExternalLink } from "lucide-react"

const projects = [
  {
    title: "Urban Style",
    category: "Tienda de Ropa",
    description: "E-commerce minimalista con catálogo de temporada y pagos integrados.",
    image: "/portfolio-fashion.png",
    color: "from-orange-500/20 to-red-500/20"
  },
  {
    title: "Luxury Homes",
    category: "Inmobiliaria",
    description: "Plataforma de propiedades con filtros avanzados y tours virtuales.",
    image: "/portfolio-real-estate.png",
    color: "from-blue-500/20 to-cyan-500/20"
  },
  {
    title: "La Table Gourmet",
    category: "Restaurante",
    description: "Menú digital interactivo y sistema de reservas en tiempo real.",
    image: "/portfolio-restaurant.png",
    color: "from-green-500/20 to-emerald-500/20"
  },
  {
    title: "Serenity Spa",
    category: "Estética & Bienestar",
    description: "Sitio premium con reserva de turnos y venta de productos orgánicos.",
    image: "/portfolio-beauty.png",
    color: "from-pink-500/20 to-purple-500/20"
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

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group glass rounded-2xl overflow-hidden flex flex-col"
            >
              {/* Project preview image */}
              <div className="relative h-64 overflow-hidden bg-muted">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold cursor-pointer shadow-xl"
                  >
                    Ver proyecto
                    <ExternalLink className="w-4 h-4" />
                  </motion.div>
                </div>
              </div>

              {/* Project info */}
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs text-primary font-bold uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
                    {project.category}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">{project.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
