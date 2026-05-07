"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Calendar, MapPin, Music, Camera, Users, Clock, Send, Gift, Eye, X } from "lucide-react"

const features = [
  {
    icon: <Calendar className="w-6 h-6 text-primary" />,
    title: "Fecha y Hora",
    description: "Cuenta regresiva en tiempo real para el gran día."
  },
  {
    icon: <MapPin className="w-6 h-6 text-primary" />,
    title: "Ubicación",
    description: "Botón con acceso directo a Google Maps y Waze."
  },
  {
    icon: <Send className="w-6 h-6 text-primary" />,
    title: "RSVP Online",
    description: "Confirmación de asistencia directo a tu WhatsApp."
  },
  {
    icon: <Music className="w-6 h-6 text-primary" />,
    title: "Música",
    description: "Acompañá la invitación con tu canción favorita."
  },
  {
    icon: <Camera className="w-6 h-6 text-primary" />,
    title: "Galería",
    description: "Compartí tus fotos favoritas antes del evento."
  },
  {
    icon: <Gift className="w-6 h-6 text-primary" />,
    title: "Lista de Regalos",
    description: "Datos bancarios o links a tiendas de regalos."
  }
]

export function InvitationsSection() {
  const [showDemo, setShowDemo] = useState(false)

  return (
    <section id="invitaciones" className="relative py-24 overflow-hidden bg-background">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4"
          >
            <Heart className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Novedad</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold mb-6"
          >
            Invitaciones Digitales <br />
            <span className="text-gradient">Para tus mejores momentos</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Transformamos tus eventos en una experiencia digital única. 
            Perfecto para Casamientos, Cumpleaños de 15, Bautismos y Aniversarios.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ y: -5 }}
              className="p-8 rounded-2xl glass border border-white/10 hover:border-primary/30 transition-all group"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Call to action for invitations */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 p-8 md:p-12 rounded-3xl glass border border-primary/20 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-primary/5 -z-10" />
          <h3 className="text-2xl md:text-3xl font-bold mb-4">¿Tenés un evento pronto?</h3>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Creamos tu tarjeta personalizada en menos de 48hs. Ecológica, moderna y siempre disponible.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDemo(true)}
              className="flex items-center gap-2 bg-foreground text-background px-8 py-4 rounded-xl font-bold hover:opacity-90 transition-all"
            >
              <Eye className="w-5 h-5" />
              Ver Ejemplo de Casamiento
            </motion.button>
            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold hover:opacity-90 transition-all glow-yellow"
            >
              Consultar Presupuesto
            </a>
          </div>
        </motion.div>
      </div>

      {/* Modal Demo */}
      <AnimatePresence>
        {showDemo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
            onClick={() => setShowDemo(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative max-w-md w-full glass rounded-3xl overflow-hidden border border-primary/30"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowDemo(false)}
                className="absolute top-4 right-4 p-2 rounded-full glass hover:bg-primary/20 transition-colors z-10"
              >
                <X className="w-6 h-6 text-foreground" />
              </button>
              
              <div className="aspect-[9/16] relative">
                <img 
                  src="/wedding-demo.png" 
                  alt="Wedding Invitation Demo" 
                  className="w-full h-full object-cover"
                />
                {/* Simulated interactivity overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8 pointer-events-none">
                  <p className="text-white/80 text-sm mb-2">Simulación de interfaz móvil</p>
                  <div className="h-1 w-24 bg-primary rounded-full mb-4" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
