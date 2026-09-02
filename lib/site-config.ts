/**
 * Fuente única de verdad para todo dato editable del sitio.
 * Ningún componente debe hardcodear un número, precio o URL.
 */

export const SITE = {
  name: "Lucky Studio",
  /** Las dos mitades del wordmark: "Lucky" en crema, "Studio" en dorado. */
  nameParts: { first: "Lucky", second: "Studio" },
  /**
   * Amplía el "páginas web que conectan" del logo original: el estudio hace
   * también plataformas, y el nombre ya no se limita a la web.
   */
  tagline: "Sitios y plataformas que conectan",
  description:
    "Diseñamos y publicamos sitios web y plataformas interactivas para negocios, organismos e instituciones educativas. Rápidos, pensados para el celular y con el contacto a un clic.",
  // TODO: confirmar tras registrar el dominio. Al 2026-09-02, luckystudio.com
  // figuraba sin DNS activo.
  url: "https://luckystudio.com",
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

/** Construye un enlace de correo con asunto y cuerpo prellenados. */
export function mailLink(subject?: string, body?: string): string {
  const params = new URLSearchParams()
  if (subject) params.set("subject", subject)
  if (body) params.set("body", body)
  const qs = params.toString()
  return `mailto:${CONTACT.email}${qs ? `?${qs}` : ""}`
}

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

/**
 * Agrupación para el filtro de la sección Trabajos.
 *
 * Es más ancha que `category`: el visitante busca "algo como lo mío", no la
 * etiqueta exacta. Con una categoría por proyecto habría siete filtros de un
 * elemento cada uno, que no filtran nada.
 */
export type Sector = "comercio" | "educacion" | "institucional" | "turismo" | "servicios"

export const SECTOR_LABELS: Record<Sector, string> = {
  comercio: "Tiendas online",
  educacion: "Educación",
  institucional: "Institucional",
  turismo: "Turismo",
  servicios: "Servicios",
}

export type Project = {
  slug: string
  name: string
  category: string
  sector: Sector
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
    sector: "institucional",
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
    sector: "comercio",
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
    sector: "turismo",
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
    sector: "servicios",
    summary:
      "Servicios con precio y duración a la vista, galería de arte y testimonios. Cada sesión se reserva por WhatsApp con el mensaje ya armado.",
    highlights: ["Servicios con precio", "Reservas por WhatsApp", "Galería"],
    url: "https://turmalina-negra.netlify.app/",
  },
  {
    slug: "el-grow-de-aixa",
    name: "El Grow de Aixa",
    category: "Tienda online",
    sector: "comercio",
    summary:
      "Growshop de Concepción con seis categorías de producto, carrito, ofertas y envíos a todo el país.",
    highlights: ["Carrito", "Categorías", "Ofertas"],
    url: "https://el-grow-de-aixa.netlify.app/",
  },
  {
    slug: "soscan",
    name: "SOS QR",
    category: "Producto",
    sector: "servicios",
    summary:
      "Landing de una pulsera de identificación con QR para emergencias, con casos de uso, testimonios y formulario de pedido.",
    highlights: ["Landing de producto", "Formulario", "Casos de uso"],
    url: "https://soscan.netlify.app/",
  },
  {
    slug: "repasofrances",
    name: "Repaso de Francés",
    category: "Educación",
    sector: "educacion",
    summary:
      "Plataforma de preparación para el examen de ingreso de la Escuela Normal en Lenguas Vivas: unidades, juegos, simuladores y seguimiento de progreso.",
    highlights: ["Ejercicios interactivos", "Simuladores", "Progreso"],
    url: "https://repasofrances.netlify.app/",
  },
  {
    slug: "arturovaldezdelasu",
    name: "Flauta Dulce Yamaha",
    category: "Educación",
    sector: "educacion",
    summary:
      "Método para aprender flauta dulce, con tabla interactiva de digitaciones, partituras, afinador online y blog.",
    highlights: ["Tabla interactiva", "Afinador", "Partituras", "Blog"],
    url: "https://arturovaldezdelasu.netlify.app/",
  },
  {
    slug: "estdiotaller",
    name: "Study Terminal",
    category: "Educación",
    sector: "educacion",
    summary:
      "Plataforma de estudio con estética de terminal: temario, quizzes, flashcards, tutor con IA y un sistema de niveles y rachas.",
    highlights: ["Quizzes", "Flashcards", "Tutor con IA", "Gamificación"],
    url: "https://estdiotaller.netlify.app/",
  },
  {
    slug: "mineraloteca",
    name: "GeoMineral",
    category: "Herramienta",
    sector: "educacion",
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

/** Las dos formas de contratar. El sitio ofrece ambas, no una en lugar de la otra. */
export type BillingMode = "contado" | "suscripcion"

export type Plan = {
  name: string
  audience: string
  description: string
  /** Lo que el sitio incluye, igual en las dos modalidades. */
  features: readonly string[]
  /** Cambios de contenido incluidos por mes. Solo aplica a la suscripción. */
  monthlyEdits: number
  featured: boolean
  pricing: {
    /** Pago único. */
    oneOff: string
    /** Pago inicial de la suscripción: en torno al 30% del contado. */
    setup: string
    /** Cuota mensual: en torno al 9% del contado. */
    monthly: string
    /** Doce meses por adelantado, con dos bonificados. */
    annual: string
  }
}

/** Meses de permanencia mínima de la suscripción. */
export const MIN_TERM_MONTHS = 12

/** Mensualidades que cuesta quedarse con el sitio al dar de baja. */
export const BUYOUT_MONTHS = 3

/**
 * Mes y año de la última revisión de precios. Se muestra junto a los planes:
 * en un contexto inflacionario, un precio sin fecha envejece mal y obliga a
 * discutirlo con cada consulta.
 */
export const PRICES_UPDATED = "septiembre de 2026"

const COMMON_FEATURES = [
  "Diseño adaptado a celular",
  "Contacto directo por WhatsApp",
] as const

export const PLANS: readonly Plan[] = [
  {
    name: "Básico",
    audience: "Landing de una página",
    description: "Para presentar tu negocio y que te escriban.",
    features: [
      ...COMMON_FEATURES,
      "Una página con todas tus secciones",
      "Entrega en 7 días",
    ],
    monthlyEdits: 2,
    featured: false,
    pricing: {
      oneOff: "$200.000",
      setup: "$60.000",
      monthly: "$18.000",
      annual: "$180.000",
    },
  },
  {
    name: "Profesional",
    audience: "Web de varias secciones",
    description: "Para negocios que necesitan mostrar productos o servicios.",
    features: [
      ...COMMON_FEATURES,
      "Hasta 5 páginas o secciones",
      "Catálogo con búsqueda y filtros",
      "Optimización para Google (SEO local)",
      "Google Maps y reseñas",
    ],
    monthlyEdits: 4,
    featured: true,
    pricing: {
      oneOff: "$350.000",
      setup: "$100.000",
      monthly: "$30.000",
      annual: "$300.000",
    },
  },
  {
    name: "Premium",
    audience: "Tienda online completa",
    description: "Cuando querés vender online de punta a punta.",
    features: [
      ...COMMON_FEATURES,
      "Páginas ilimitadas",
      "Carrito y pedidos por WhatsApp",
      "Panel para cargar productos",
      "SEO avanzado y analítica",
    ],
    monthlyEdits: 8,
    featured: false,
    pricing: {
      oneOff: "$500.000",
      setup: "$150.000",
      monthly: "$42.000",
      annual: "$420.000",
    },
  },
]

/** Lo propio de cada modalidad, que se suma a `features` del plan. */
export function billingExtras(plan: Plan, mode: BillingMode): readonly string[] {
  if (mode === "contado") {
    return [
      "Dominio y hosting el primer año",
      "El código y el dominio quedan a tu nombre",
      "1 mes de cambios sin costo",
    ]
  }
  return [
    "Dominio y hosting siempre incluidos",
    `${plan.monthlyEdits} cambios de contenido por mes`,
    "Actualizaciones de seguridad y backups",
    "Soporte por WhatsApp",
    "Reporte mensual de visitas y consultas",
  ]
}

/**
 * Cuarta opción, fuera de la grilla de planes.
 *
 * Los planes con precio marcan un piso, no un techo: cuatro de los diez
 * proyectos del portfolio son plataformas interactivas que no entran en
 * ninguno de los tres, y sin esta opción el precio más alto visible las
 * subvaluaba.
 */
export const CUSTOM_TIER = {
  name: "Plataformas y desarrollos a medida",
  description:
    "Plataformas educativas, herramientas interactivas, portales institucionales y sistemas que no entran en un plan cerrado. Tienen su propio alcance y su propio presupuesto.",
  examples: [
    "Plataformas de estudio con ejercicios y seguimiento de progreso",
    "Portales institucionales con datos en vivo y varios idiomas",
    "Herramientas de consulta con buscador y comparador",
    "Integraciones con inteligencia artificial",
  ],
} as const

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
    title: "Plataformas interactivas",
    description: "Ejercicios, quizzes, buscadores y seguimiento de progreso.",
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
