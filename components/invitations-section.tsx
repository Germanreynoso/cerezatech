"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Calendar, MapPin, Music, Camera, Users, Clock, Send, Gift, Eye, X, Star } from "lucide-react"

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
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null)
  const [isBookOpen, setIsBookOpen] = useState(false)

  const demos = [
    {
      id: "wedding",
      label: "Casamiento",
      image: "/wedding-demo.png",
      color: "bg-primary text-primary-foreground"
    },
    {
      id: "dog-birthday",
      label: "Cumple Perruno",
      image: "/dog-birthday-demo.png",
      color: "bg-orange-400 text-white"
    }
  ]

  // Reset book state when closing modal
  const handleClose = () => {
    setSelectedDemo(null)
    setIsBookOpen(false)
  }

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
            Invitaciones digitales <br />
            <span className="text-gradient">que sorprenden</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Creamos invitaciones virtuales animadas para cumpleaños, bodas y eventos especiales, con música, fotos, animaciones y confirmación por WhatsApp.
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
            {demos.map((demo) => (
              <motion.button
                key={demo.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDemo(demo.image)}
                className={`flex items-center gap-2 px-8 py-4 rounded-xl font-bold hover:opacity-90 transition-all ${demo.color}`}
              >
                <Eye className="w-5 h-5" />
                Ver ejemplo {demo.label}
              </motion.button>
            ))}
            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-foreground text-background px-8 py-4 rounded-xl font-bold hover:opacity-90 transition-all"
            >
              Consultar Presupuesto
            </a>
          </div>
        </motion.div>
      </div>

      {/* Modal Demo with 3D Book Animation */}
      <AnimatePresence>
        {selectedDemo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/90 backdrop-blur-xl"
            onClick={handleClose}
          >
            <button
              onClick={handleClose}
              className="absolute top-8 right-8 p-3 rounded-full glass hover:bg-primary/20 transition-colors z-[110]"
            >
              <X className="w-8 h-8 text-foreground" />
            </button>

            <div 
              className="relative w-full max-w-4xl aspect-[4/3] flex items-center justify-center perspective-[2000px]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* The Book Container */}
              <motion.div 
                initial={{ rotateY: 0 }}
                animate={{ rotateY: isBookOpen ? -20 : 0 }} 
                className="relative w-[300px] h-[450px] md:w-[400px] md:h-[600px] transition-transform duration-1000 transform-style-3d"
              >
                {/* Right Page (Fixed - Content) */}
                <div className="absolute inset-0 bg-card rounded-r-2xl shadow-2xl overflow-hidden border-y border-r border-white/10">
                  <img 
                    src={selectedDemo} 
                    alt="Invitation Content" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent pointer-events-none" />
                </div>

                {/* Left Page (The Cover that opens) */}
                <motion.div
                  animate={{ rotateY: isBookOpen ? -145 : 0 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  style={{ transformOrigin: "left" }}
                  onClick={() => setIsBookOpen(!isBookOpen)}
                  className="absolute inset-0 z-20 transform-style-3d cursor-pointer"
                >
                  {/* Front Cover */}
                  <div className="absolute inset-0 backface-hidden bg-primary rounded-l-2xl shadow-xl flex flex-col items-center justify-center p-12 border border-white/20">
                    <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-6">
                      <Heart className="w-12 h-12 text-primary-foreground animate-pulse" />
                    </div>
                    <h3 className="text-3xl font-bold text-primary-foreground text-center leading-tight">
                      {selectedDemo.includes('wedding') ? 'Nuestra Boda' : 'Mi Cumple Perruno'}
                    </h3>
                    <div className="mt-8 h-px w-20 bg-primary-foreground/30" />
                    <p className="mt-4 text-primary-foreground/80 font-medium tracking-[0.2em] uppercase text-sm">
                      {isBookOpen ? 'Cerrar' : 'Hacé clic para abrir'}
                    </p>
                  </div>

                  {/* Back of Cover (Inside Left Page) */}
                  <div 
                    className="absolute inset-0 backface-hidden bg-secondary rounded-l-2xl border border-white/10 flex flex-col items-center justify-center p-8"
                    style={{ transform: "rotateY(180deg)" }}
                  >
                    <div className="space-y-6 text-center">
                      <h4 className="text-xl font-bold text-primary italic">Agendá la Fecha</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Estamos muy felices de compartir este momento tan especial con vos. 
                        ¡Te esperamos para celebrar juntos!
                      </p>
                      <div className="flex justify-center gap-2">
                        <Star className="w-4 h-4 text-primary" />
                        <Star className="w-4 h-4 text-primary" />
                        <Star className="w-4 h-4 text-primary" />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Book Spine Shadow */}
                <div className="absolute top-0 bottom-0 left-0 w-4 bg-black/40 blur-sm z-30 pointer-events-none" />
              </motion.div>

              {/* Instructions text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute bottom-4 text-muted-foreground text-sm"
              >
                {isBookOpen ? 'Hacé clic en la tapa para cerrar' : 'Hacé clic en el libro para abrir la invitación'}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
