"use client"

import { motion } from "framer-motion"
import { ArrowRight, MessageCircle, TrendingUp, Users, ShoppingCart, Monitor, Smartphone } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary" />
      
      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-glow" style={{ animationDelay: '1s' }} />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6"
            >
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-muted-foreground">+50 emprendedores confían en nosotros</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="text-foreground">Tu negocio merece </span>
              <span className="text-gradient">ser encontrado</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              Creamos páginas web modernas y accesibles para emprendedores que quieren verse profesionales y conseguir más clientes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.a
                href="#planes"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-all glow-yellow"
              >
                Quiero mi página web
                <ArrowRight className="w-5 h-5" />
              </motion.a>
              
              <motion.a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 glass px-6 py-3 rounded-xl font-semibold text-foreground hover:bg-secondary/50 transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                Hablar por WhatsApp
              </motion.a>
            </div>
          </motion.div>

          {/* Right content - Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            {/* Device mockups */}
            <div className="relative">
              {/* Laptop mockup */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10"
              >
                <div className="bg-secondary rounded-2xl p-3 shadow-2xl">
                  <div className="bg-card rounded-lg overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-2 bg-muted">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-primary/30 rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-full" />
                      <div className="h-3 bg-muted rounded w-2/3" />
                      <div className="grid grid-cols-3 gap-2 mt-4">
                        <div className="h-16 bg-primary/20 rounded" />
                        <div className="h-16 bg-primary/20 rounded" />
                        <div className="h-16 bg-primary/20 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Phone mockup */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -bottom-8 -right-4 z-20 w-32"
              >
                <div className="bg-secondary rounded-2xl p-2 shadow-2xl">
                  <div className="bg-card rounded-xl overflow-hidden">
                    <div className="w-8 h-1 bg-muted mx-auto mt-2 rounded-full" />
                    <div className="p-3 space-y-2">
                      <div className="h-3 bg-primary/30 rounded w-full" />
                      <div className="h-2 bg-muted rounded w-3/4" />
                      <div className="h-8 bg-primary/20 rounded mt-2" />
                      <div className="h-8 bg-primary/20 rounded" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Floating metric cards */}
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -left-4 glass rounded-xl p-3 flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Visibilidad</p>
                <p className="font-bold text-foreground">+120%</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              className="absolute top-1/3 -right-8 glass rounded-xl p-3 flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Clientes</p>
                <p className="font-bold text-foreground">+85%</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
              className="absolute bottom-1/4 -left-8 glass rounded-xl p-3 flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Ventas</p>
                <p className="font-bold text-foreground">+200%</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
