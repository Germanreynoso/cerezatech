"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { QrCode, Smartphone, Send, Zap, Store, PartyPopper } from "lucide-react"

export function QRSection() {
  const [activeTab, setActiveTab] = useState<'business' | 'events'>('events')

  const content = {
    events: {
      title: "Invitaciones Físicas",
      subtitle: "con acceso QR",
      description: "No tenés que elegir entre lo físico y lo digital. Creamos el diseño de tu tarjeta impresa con un QR que lleva a tus invitados directo a la experiencia interactiva.",
      image: "/qr-mockup.png",
      badge: "Puente al mundo digital",
      icon: <PartyPopper className="w-5 h-5" />
    },
    business: {
      title: "Tu Negocio Físico",
      subtitle: "ahora es digital",
      description: "Llevá tus clientes de la calle a tu web en un segundo. Ideal para tarjetas personales, menús en mesas, vinilos para vidrieras o flyers publicitarios.",
      image: "/business-qr-mockup.png",
      badge: "Escaneo = Venta",
      icon: <Store className="w-5 h-5" />
    }
  }

  return (
    <section className="py-24 relative overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tab Switcher */}
        <div className="flex justify-center mb-12">
          <div className="glass p-1 rounded-2xl flex gap-1">
            <button
              onClick={() => setActiveTab('events')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'events' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <PartyPopper className="w-4 h-4" />
              Eventos
            </button>
            <button
              onClick={() => setActiveTab('business')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'business' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Store className="w-4 h-4" />
              Negocios
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side: Visual representation with Animation */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden glass border border-primary/20 shadow-2xl">
              <img 
                src={content[activeTab].image} 
                alt={content[activeTab].title} 
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent pointer-events-none" />
            </div>
            
            {/* Floating QR Badge */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -right-6 glass p-6 rounded-2xl border border-primary shadow-xl z-10"
            >
              <QrCode className="w-12 h-12 text-primary" />
            </motion.div>
          </motion.div>

          {/* Right side: Text content */}
          <motion.div
            key={`text-${activeTab}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">{content[activeTab].badge}</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              {content[activeTab].title} <br />
              <span className="text-gradient">{content[activeTab].subtitle}</span>
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8">
              {content[activeTab].description}
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <QrCode className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-foreground mb-1">QR de Marca</h4>
                  <p className="text-muted-foreground">Incluimos tu logo en el centro del código QR para reforzar tu identidad visual.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-foreground mb-1">Acceso Directo</h4>
                  <p className="text-muted-foreground">Sin descargar apps. Tus clientes o invitados escanean y ven tu contenido al toque.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Send className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-foreground mb-1">Archivos de Alta Calidad</h4>
                  <p className="text-muted-foreground">Entregamos el código en formatos vectoriales para que lo pongas donde quieras.</p>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-12 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold glow-yellow hover:opacity-90 transition-all"
            >
              Consultar por mi QR
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
