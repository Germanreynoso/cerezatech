"use client"

import { motion } from "framer-motion"
import { Check, Sparkles, Music, MessageCircle, Play, Image as ImageIcon, MapPin, Download, Heart, Video, Globe, Film } from "lucide-react"

const packs = [
  {
    name: "Pack Básico",
    description: "Lo esencial para una invitación moderna y funcional.",
    features: [
      { text: "Landing page simple", icon: <Globe className="w-4 h-4" /> },
      { text: "Música de fondo", icon: <Music className="w-4 h-4" /> },
      { text: "Botón de WhatsApp (RSVP)", icon: <MessageCircle className="w-4 h-4" /> }
    ],
    color: "bg-blue-500/10 border-blue-500/20",
    iconColor: "text-blue-500"
  },
  {
    name: "Pack Premium",
    description: "Una experiencia completa e interactiva para tus invitados.",
    features: [
      { text: "Animaciones de entrada", icon: <Sparkles className="w-4 h-4" /> },
      { text: "Galería de fotos", icon: <ImageIcon className="w-4 h-4" /> },
      { text: "Confirmación de asistencia", icon: <Check className="w-4 h-4" /> },
      { text: "Mapa interactivo", icon: <MapPin className="w-4 h-4" /> },
      { text: "Video MP4 descargable", icon: <Download className="w-4 h-4" /> }
    ],
    color: "bg-primary/10 border-primary/20",
    iconColor: "text-primary",
    featured: true
  },
  {
    name: "Pack Ultra Termo Emocional",
    description: "Para los que quieren contar su historia y emocionar a todos.",
    features: [
      { text: "Historia de la pareja", icon: <Heart className="w-4 h-4" /> },
      { text: "Videos integrados", icon: <Video className="w-4 h-4" /> },
      { text: "Transiciones cinematográficas", icon: <Film className="w-4 h-4" /> },
      { text: "Dominio personalizado", icon: <Globe className="w-4 h-4" /> }
    ],
    color: "bg-purple-500/10 border-purple-500/20",
    iconColor: "text-purple-500"
  }
]

export function InvitationPacks() {
  return (
    <section className="py-24 relative overflow-hidden bg-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Elegí tu <span className="text-gradient">Pack de Invitación</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Desde lo esencial hasta experiencias cinematográficas. 
            Hacé que tus invitados se emocionen desde el primer clic.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {packs.map((pack, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className={`relative p-8 rounded-3xl border glass transition-all ${pack.color} ${pack.featured ? 'scale-105 z-10 border-primary shadow-2xl' : ''}`}
            >
              {pack.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                    <Sparkles className="w-3 h-3" />
                    RECOMENDADO
                  </div>
                </div>
              )}

              <h3 className="text-2xl font-bold mb-3 text-foreground">{pack.name}</h3>
              <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
                {pack.description}
              </p>

              <ul className="space-y-4 mb-8">
                {pack.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${pack.color}`}>
                      <div className={pack.iconColor}>{feature.icon}</div>
                    </div>
                    <span className="text-sm text-foreground/80">{feature.text}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-4 rounded-2xl font-bold transition-all ${
                pack.featured 
                  ? 'bg-primary text-primary-foreground glow-yellow hover:opacity-90' 
                  : 'bg-foreground text-background hover:opacity-90'
              }`}>
                Consultar por este Pack
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
