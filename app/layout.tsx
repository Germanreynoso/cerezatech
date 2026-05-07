import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: {
    default: 'Tu web al toque - Diseño Web y Tarjetas Digitales para Emprendedores',
    template: '%s | Tu web al toque'
  },
  description: 'Potenciá tu negocio con páginas web modernas y tarjetas de invitación digitales interactivas. Diseño profesional, RSVP online y visibilidad garantizada.',
  keywords: [
    'diseño web', 
    'páginas web emprendedores', 
    'tarjetas digitales', 
    'invitaciones de casamiento digitales', 
    'invitaciones 15 años digitales', 
    'marketing digital', 
    'Tu web al toque'
  ],
  authors: [{ name: 'Tu web al toque' }],
  creator: 'Tu web al toque',
  publisher: 'Tu web al toque',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: 'https://tuwebaltoque.com', // Cambiar por la URL real cuando esté deployed
    siteName: 'Tu web al toque',
    title: 'Tu web al toque - Tu negocio merece ser encontrado',
    description: 'Expertos en diseño web y experiencias digitales interactivas para tus eventos más importantes.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Tu web al toque - Diseño Web y Tarjetas Digitales',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tu web al toque - Diseño Web y Tarjetas Digitales',
    description: 'Páginas web profesionales e invitaciones digitales interactivas.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Tu web al toque",
    "image": "https://tuwebaltoque.com/og-image.png",
    "description": "Diseño de páginas web modernas y tarjetas de invitación digitales interactivas para eventos.",
    "url": "https://tuwebaltoque.com",
    "telephone": "+5491123456789",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Buenos Aires",
      "addressCountry": "AR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -34.603722,
      "longitude": -58.381592
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "20:00"
    },
    "sameAs": [
      "https://instagram.com/tuwebaltoque",
      "https://wa.me/5491123456789"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Servicios Digitales",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Diseño Web Profesional"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Invitaciones Digitales Interactivas"
          }
        }
      ]
    }
  }

  return (
    <html lang="es" className="bg-background">
      <body className={`${inter.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
