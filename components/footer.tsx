"use client"

import { motion } from "framer-motion"
import { Zap, MessageCircle, Instagram, ArrowRight } from "lucide-react"

export function Footer() {
  return (
    <footer className="py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass rounded-3xl p-8 md:p-12 text-center mb-16 relative overflow-hidden"
        >
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
          
          <div className="relative z-10">
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4 text-balance">
              Tu web puede convertirse en tu <span className="text-gradient">mejor vendedor</span>
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Dejá de perder clientes. Empezá hoy a construir tu presencia online profesional.
            </p>
            <motion.a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-all glow-yellow"
            >
              Quiero mi página web
              <ArrowRight className="w-5 h-5" />
            </motion.a>
          </div>
        </motion.div>

        {/* Footer content */}
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Logo & description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">LuckyTech</span>
            </div>
            <p className="text-muted-foreground max-w-sm mb-6">
              Creamos páginas web modernas y accesibles para emprendedores que quieren verse profesionales y conseguir más clientes.
            </p>
            <div className="flex gap-4">
              <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-foreground" />
              </a>
              <a
                href="https://instagram.com/luckytech"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Instagram className="w-5 h-5 text-foreground" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Links rápidos</h4>
            <ul className="space-y-3">
              <li>
                <a href="#beneficios" className="text-muted-foreground hover:text-foreground transition-colors">
                  Beneficios
                </a>
              </li>
              <li>
                <a href="#portfolio" className="text-muted-foreground hover:text-foreground transition-colors">
                  Portfolio
                </a>
              </li>
              <li>
                <a href="#planes" className="text-muted-foreground hover:text-foreground transition-colors">
                  Planes
                </a>
              </li>
              <li>
                <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://wa.me/1234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href="mailto:hola@luckytech.com"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  hola@luckytech.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} LuckyTech. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
