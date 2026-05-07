"use client"

import { motion } from "framer-motion"
import { TrendingUp } from "lucide-react"

export function EmotionalSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative p-12 md:p-24 rounded-[3rem] glass border border-primary/20 text-center overflow-hidden"
        >
          {/* Animated Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 -z-10" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
          >
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Crecé sin límites</span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
            Tu web puede convertirse en <br />
            <span className="text-gradient">tu mejor vendedor.</span>
          </h2>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            No dependas únicamente de Instagram o WhatsApp. Tené un espacio propio donde tus clientes puedan encontrarte, conocerte y comprarte.
          </p>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -z-10" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -z-10" />
        </motion.div>
      </div>
    </section>
  )
}
