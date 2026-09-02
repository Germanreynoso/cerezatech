/**
 * Fuente única de verdad para todo dato editable del sitio.
 * Ningún componente debe hardcodear un número, precio o URL.
 */

export const SITE = {
  name: "Luckywebs",
  tagline: "Páginas web que conectan",
  description:
    "Diseñamos y publicamos páginas web rápidas para negocios y emprendedores. Se ven bien en cualquier celular y convierten visitas en clientes por WhatsApp.",
  // TODO: confirmar dominio definitivo antes del deploy a producción.
  url: "https://luckywebs.com.ar",
  locale: "es_AR",
} as const

export const CONTACT = {
  whatsapp: "543816789468",
  whatsappDisplay: "+54 381 678 9468",
  email: "reynosogermangonzalo@gmail.com",
  instagram: "germanreynoso16",
  instagramUrl: "https://instagram.com/germanreynoso16",
  location: "Tafí del Valle, Tucumán",
  coverage: "Tafí del Valle y Tucumán · Trabajamos con toda Argentina",
  hours: { opens: "09:00", closes: "20:00" },
} as const

/** Construye un enlace de WhatsApp con mensaje prellenado. */
export function waLink(message?: string): string {
  const base = `https://wa.me/${CONTACT.whatsapp}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

/* -------------------------------------------------------------------------- */
/* Navegación                                                                  */
/* -------------------------------------------------------------------------- */

export const NAV_LINKS = [
  { href: "#servicios", label: "Servicios" },
  { href: "#trabajos", label: "Trabajos" },
  { href: "#proceso", label: "Proceso" },
  { href: "#planes", label: "Planes" },
  { href: "#faq", label: "FAQ" },
] as const

/* -------------------------------------------------------------------------- */
/* Trabajos                                                                    */
/* -------------------------------------------------------------------------- */

export type Project = {
  slug: string
  name: string
  category: string
  /** Qué resolvimos, en una línea. */
  summary: string
  highlights: readonly string[]
  /** Si falta o está vacía, el proyecto no se renderiza. */
  url: string
  /**
   * Los destacados van arriba con captura grande y descripción; el resto
   * cae en una grilla compacta. Conviene mantener exactamente tres, para
   * que llenen la fila y cubran rubros distintos.
   */
  featured?: boolean
}

export const PROJECTS: readonly Project[] = [
  /* --- Destacados ------------------------------------------------------- */
  {
    slug: "municipalidad-tafi",
    name: "Municipalidad de Tafí del Valle",
    category: "Organismo público",
    summary:
      "Portal institucional con noticias, trámites y guía turística. Muestra el clima y el estado de la ruta en vivo, y está en español e inglés para el turismo.",
    highlights: ["Institucional", "Clima en vivo", "Buscador", "Español / Inglés"],
    url: "https://www.municipalidadtafidelvalle.com/",
    featured: true,
  },
  {
    slug: "importados-tafi",
    name: "Importados Tafí",
    category: "Tienda online",
    summary:
      "Catálogo de tecnología con 12 categorías, carrito y búsqueda. Cada pedido llega directo al WhatsApp del local, sin pasarela de pago ni comisiones.",
    highlights: ["Carrito", "12 categorías", "Pedidos por WhatsApp", "Ofertas"],
    url: "https://importadostafi.com/",
    featured: true,
  },
  {
    slug: "laprohibida",
    name: "La Prohibida",
    category: "Alquiler temporario",
    summary:
      "Casa de alquiler en Tafí del Valle: galería de ambientes, comodidades, carta del bar y ubicación. Las consultas de fechas salen por WhatsApp.",
    highlights: ["Galería", "Comodidades", "Ubicación", "Reservas"],
    url: "https://laprohibida.netlify.app/",
    featured: true,
  },

  /* --- Resto del portfolio ---------------------------------------------- */
  {
    slug: "turmalina-negra",
    name: "Turmalina Negra",
    category: "Terapias holísticas",
    summary:
      "Servicios con precio y duración a la vista, galería de arte y testimonios. Cada sesión se reserva por WhatsApp con el mensaje ya armado.",
    highlights: ["Servicios con precio", "Reservas por WhatsApp", "Galería"],
    url: "https://turmalina-negra.netlify.app/",
  },
  {
    slug: "el-grow-de-aixa",
    name: "El Grow de Aixa",
    category: "Tienda online",
    summary:
      "Growshop de Concepción con seis categorías de producto, carrito, ofertas y envíos a todo el país.",
    highlights: ["Carrito", "Categorías", "Ofertas"],
    url: "https://el-grow-de-aixa.netlify.app/",
  },
  {
    slug: "soscan",
    name: "SOS QR",
    category: "Producto",
    summary:
      "Landing de una pulsera de identificación con QR para emergencias, con casos de uso, testimonios y formulario de pedido.",
    highlights: ["Landing de producto", "Formulario", "Casos de uso"],
    url: "https://soscan.netlify.app/",
  },
  {
    slug: "repasofrances",
    name: "Repaso de Francés",
    category: "Educación",
    summary:
      "Plataforma de preparación para el examen de ingreso de la Escuela Normal en Lenguas Vivas: unidades, juegos, simuladores y seguimiento de progreso.",
    highlights: ["Ejercicios interactivos", "Simuladores", "Progreso"],
    url: "https://repasofrances.netlify.app/",
  },
  {
    slug: "arturovaldezdelasu",
    name: "Flauta Dulce Yamaha",
    category: "Educación",
    summary:
      "Método para aprender flauta dulce, con tabla interactiva de digitaciones, partituras, afinador online y blog.",
    highlights: ["Tabla interactiva", "Afinador", "Partituras", "Blog"],
    url: "https://arturovaldezdelasu.netlify.app/",
  },
  {
    slug: "estdiotaller",
    name: "Study Terminal",
    category: "Educación",
    summary:
      "Plataforma de estudio con estética de terminal: temario, quizzes, flashcards, tutor con IA y un sistema de niveles y rachas.",
    highlights: ["Quizzes", "Flashcards", "Tutor con IA", "Gamificación"],
    url: "https://estdiotaller.netlify.app/",
  },
  {
    slug: "mineraloteca",
    name: "GeoMineral",
    category: "Herramienta",
    summary:
      "Base de conocimiento de mineralogía con catálogo filtrable, comparador de propiedades, quiz y asistente de consulta.",
    highlights: ["Catálogo filtrable", "Comparador", "Quiz", "Asistente"],
    url: "https://mineraloteca.netlify.app/",
  },
]

/** Rutas de los screenshots generados por scripts/capture-work-screenshots.mjs */
export function projectShot(slug: string, view: "desktop" | "mobile"): string {
  return `/work-${slug}-${view}.webp`
}

/** Solo los proyectos publicables. La UI nunca renderiza tarjetas rotas. */
export const VISIBLE_PROJECTS = PROJECTS.filter((p) => p.url.length > 0)

/** Los tres de arriba, con captura grande. */
export const FEATURED_PROJECTS = VISIBLE_PROJECTS.filter((p) => p.featured)

/** El resto, en grilla compacta. */
export const OTHER_PROJECTS = VISIBLE_PROJECTS.filter((p) => !p.featured)

/* -------------------------------------------------------------------------- */
/* Planes                                                                      */
/* -------------------------------------------------------------------------- */

export type Plan = {
  name: string
  price: string
  audience: string
  description: string
  features: readonly string[]
  featured: boolean
}

const COMMON_FEATURES = [
  "Dominio y hosting el primer año",
  "Diseño adaptado a celular",
  "Integración con WhatsApp",
] as const

export const PLANS: readonly Plan[] = [
  {
    name: "Básico",
    price: "$200.000",
    audience: "Landing de una página",
    description: "Ideal para presentar tu negocio y que te escriban.",
    features: [
      ...COMMON_FEATURES,
      "Una página con todas tus secciones",
      "Formulario de contacto por WhatsApp",
      "Entrega en 7 días",
    ],
    featured: false,
  },
  {
    name: "Profesional",
    price: "$350.000",
    audience: "Web de varias secciones",
    description: "Para negocios que necesitan mostrar productos o servicios.",
    features: [
      ...COMMON_FEATURES,
      "Hasta 5 páginas o secciones",
      "Catálogo con búsqueda y filtros",
      "Optimización para Google (SEO local)",
      "Google Maps y reseñas",
      "1 mes de cambios sin costo",
    ],
    featured: true,
  },
  {
    name: "Premium",
    price: "$500.000",
    audience: "Tienda online completa",
    description: "Cuando querés vender online de punta a punta.",
    features: [
      ...COMMON_FEATURES,
      "Páginas ilimitadas",
      "Carrito y pedidos por WhatsApp",
      "Panel para cargar productos",
      "SEO avanzado y analítica",
      "3 meses de soporte incluido",
    ],
    featured: false,
  },
]

/* -------------------------------------------------------------------------- */
/* Servicios                                                                   */
/* -------------------------------------------------------------------------- */

export const SERVICES = [
  {
    title: "Landing page",
    description: "Una página que presenta tu negocio y lleva a WhatsApp.",
  },
  {
    title: "Tienda online",
    description: "Catálogo con carrito y pedidos que llegan a tu teléfono.",
  },
  {
    title: "Web institucional",
    description: "Varias secciones para empresas y organismos.",
  },
  {
    title: "Catálogo digital",
    description: "Tus productos ordenados, con búsqueda y filtros.",
  },
  {
    title: "SEO local",
    description: "Que te encuentren cuando buscan tu rubro en tu zona.",
  },
  {
    title: "Mantenimiento",
    description: "Cambios, respaldos y soporte después del lanzamiento.",
  },
] as const
