import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CONTACT, SERVICES, SITE } from '@/lib/site-config'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Páginas web para negocios en Tucumán`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    'diseño web Tucumán',
    'páginas web Tafí del Valle',
    'desarrollo web para negocios',
    'tienda online Argentina',
    'landing page para emprendedores',
    'SEO local Tucumán',
    'Luckywebs',
  ],
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  publisher: SITE.name,
  formatDetection: { email: false, address: false, telephone: false },
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: SITE.locale,
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `${SITE.name} — ${SITE.tagline}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: ['/og-image.png'],
  },
  icons: {
    icon: [{ url: '/icon.png', type: 'image/png', sizes: '512x512' }],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#131E2E',
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: SITE.name,
    image: `${SITE.url}/og-image.png`,
    description: SITE.description,
    url: SITE.url,
    telephone: `+${CONTACT.whatsapp}`,
    email: CONTACT.email,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Tafí del Valle',
      addressRegion: 'Tucumán',
      addressCountry: 'AR',
    },
    areaServed: { '@type': 'Country', name: 'Argentina' },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: CONTACT.hours.opens,
      closes: CONTACT.hours.closes,
    },
    sameAs: [CONTACT.instagramUrl, `https://wa.me/${CONTACT.whatsapp}`],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Servicios de desarrollo web',
      itemListElement: SERVICES.map((service) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.title,
          description: service.description,
        },
      })),
    },
  }

  return (
    <html lang="es-AR" className="dark bg-background">
      <body className={`${inter.variable} font-sans antialiased`}>
        <a
          href="#inicio"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:font-semibold focus:text-primary-foreground"
        >
          Saltar al contenido
        </a>
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
