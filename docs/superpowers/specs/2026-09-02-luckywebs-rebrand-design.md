# Luckywebs — Rebrand y rediseño de la landing comercial

**Fecha:** 2026-09-02
**Estado:** Aprobado para implementación
**Repo:** `cerezatech` (Next.js 16 / React 19 / Tailwind v4 / shadcn-ui / framer-motion)

---

## 1. Objetivo

Convertir la landing actual —hoy dividida entre "diseño web" e "invitaciones digitales para
eventos"— en un sitio comercial de propósito único: **vender páginas web a negocios y
emprendedores**, bajo la marca **Luckywebs**.

El éxito se mide por tres cosas:

1. Un visitante entiende qué se vende en los primeros 5 segundos.
2. Ve trabajo real —sitios en producción, no maquetas— antes de llegar a los precios.
3. Llega a WhatsApp desde cualquier punto del scroll sin fricción, en celular o escritorio.

### Fuera de alcance

- Backend, CMS o base de datos. El sitio sigue siendo estático.
- Formulario de contacto con envío de mails. El canal es WhatsApp.
- Blog, multi-idioma, panel de administración.
- Modo claro conmutable. El sitio tiene un solo tema.

---

## 2. Estado actual y problemas

| Problema | Evidencia | Impacto |
|---|---|---|
| Marca inconsistente | `layout.tsx` dice "Tu web al toque", `navbar.tsx` dice "Al Toque Web", el repo se llama `cerezatech` | El visitante no retiene ningún nombre |
| Propuesta de valor dividida | 5 de 14 secciones son de invitaciones y QR para eventos | Diluye el mensaje comercial |
| Portfolio ficticio | "Urban Style", "Luxury Homes", "La Table Gourmet", "Serenity Spa" no existen | Cero credibilidad; es el argumento de venta más fuerte y está desperdiciado |
| Sin menú mobile | `navbar.tsx` usa `hidden md:flex` sin alternativa | La navegación desaparece en celular, que es el grueso del tráfico |
| Jank de animación | 6 animaciones `repeat: Infinity` simultáneas en el hero | Scroll trabado en gama media |
| Imágenes sin optimizar | `<img>` crudo en `portfolio-section.tsx`; PNGs de 600–860 KB | LCP alto |
| Contactos placeholder | `wa.me/1234567890`, `hola@tuwebaltoque.com` | Los CTAs no funcionan |
| Sin accesibilidad | Sin `prefers-reduced-motion`, sin `aria-label` en enlaces de ícono | Excluye usuarios y penaliza SEO |

---

## 3. Identidad de marca

**Nombre:** Luckywebs
**Wordmark:** "Lucky" en crema + "webs" en dorado, Inter Bold, tracking ajustado.
**Isotipo:** el golden retriever del logo, recortado en círculo, sobre badge crema.
**Tagline:** "Páginas web que conectan" (viene del logo original).

### Paleta

Derivada del JPEG del logo. Se reemplazan los tokens de `app/globals.css`.

| Token | Valor | Uso |
|---|---|---|
| `--background` | `oklch(0.16 0.028 258)` ≈ `#131E2E` | Fondo base, navy del logo |
| `--card` | `oklch(0.21 0.028 258)` | Superficies elevadas |
| `--secondary` | `oklch(0.26 0.026 258)` | Superficies de segundo nivel |
| `--primary` | `oklch(0.76 0.115 85)` ≈ `#C9A227` | Dorado del logo, acento único |
| `--foreground` | `oklch(0.96 0.008 85)` ≈ `#F5F0E6` | Crema del logo |
| `--muted-foreground` | `oklch(0.72 0.012 258)` | Texto secundario |
| `--border` | `oklch(0.30 0.024 258)` | Bordes y separadores |

**Restricción de contraste:** todo texto sobre `--background` cumple WCAG AA (≥ 4.5:1).
El dorado actual (`oklch(0.85 0.15 85)`, `#FFC857`) es demasiado saturado y se aleja del
logo; el nuevo valor mantiene contraste AA sobre navy.

**Regla del acento:** el dorado se usa solo en CTAs primarios, elementos activos y palabras
destacadas de los titulares. Nunca como fondo de sección completo.

### Assets a generar

Script one-off `scripts/generate-brand-assets.mjs` usando `sharp` (devDependency), tomando
como entrada `WhatsApp Image 2026-08-25 at 21.57.31.jpeg`:

| Archivo | Tamaño | Uso |
|---|---|---|
| `public/logo-mark.png` | 512×512 | Isotipo circular (navbar, footer) |
| `public/logo-full.png` | 1200×1200 | Logo completo con wordmark |
| `public/og-image.png` | 1200×630 | Open Graph / Twitter card |
| `public/icon.png` | 512×512 | Favicon |
| `public/apple-icon.png` | 180×180 | Apple touch icon |

El JPEG original se mueve a `assets/brand/logo-original.jpeg` (fuera de `public/`).

---

## 4. Arquitectura de contenido

Una sola página (`app/page.tsx`), 13 secciones, ordenadas como embudo: atención → interés
→ prueba → deseo → acción.

| # | Sección | Componente | Acción |
|---|---|---|---|
| 1 | Navbar | `navbar.tsx` | Reescribir |
| 2 | Hero | `hero-section.tsx` | Reescribir |
| 3 | Prueba social | `social-proof-section.tsx` | **Nuevo** |
| 4 | Problema → Solución | `problem-solution-section.tsx` | **Nuevo** (reemplaza `emotional-section`) |
| 5 | Servicios | `services-section.tsx` | Reescribir |
| 6 | Beneficios | `benefits-section.tsx` | Ajustar copy |
| 7 | Trabajos | `work-section.tsx` | **Nuevo** (reemplaza `portfolio-section`) |
| 8 | Proceso | `process-section.tsx` | **Nuevo** |
| 9 | Antes / Después | `before-after-section.tsx` | Ajustar copy |
| 10 | Testimonios | `testimonials-section.tsx` | Ajustar copy |
| 11 | Planes | `pricing-section.tsx` | Ajustar copy |
| 12 | FAQ | `faq-section.tsx` | Ampliar |
| 13 | CTA final | `final-cta-section.tsx` | **Nuevo** |
| — | Footer | `footer.tsx` | Reescribir |
| — | WhatsApp flotante | `whatsapp-fab.tsx` | **Nuevo** |

### Se elimina

Componentes: `invitations-section.tsx`, `invitation-packs.tsx`, `qr-section.tsx`,
`emotional-section.tsx`, `portfolio-section.tsx`.

Assets (≈ 5,5 MB): `15-demo.png`, `wedding-demo.png`, `birthday-demo.png`,
`dog-birthday-demo.png`, `qr-mockup.png`, `business-qr-mockup.png`, `portfolio-fashion.png`,
`portfolio-real-estate.png`, `portfolio-restaurant.png`, `portfolio-beauty.png`,
`placeholder-*`.

**Criterio de aceptación:** `grep -ri "invitacion\|invitation\|casamiento\|quince\|15 años\|RSVP\|QR" app components lib` no devuelve resultados.

---

## 5. Especificación por sección

### 5.1 Navbar

Sticky, `h-16`. Fondo transparente en el tope del scroll; a partir de 24 px pasa a
`bg-background/80` con `backdrop-blur` y borde inferior — la transición se hace con un
listener `scroll` pasivo.

- **Izquierda:** isotipo (32 px, badge circular crema) + wordmark "Luckywebs".
- **Centro (≥ `md`):** Servicios · Trabajos · Proceso · Planes · FAQ. La sección visible se
  marca en dorado vía `IntersectionObserver` (scroll-spy), un solo observer para todas las
  secciones.
- **Derecha:** botón dorado "Hablar por WhatsApp".
- **Mobile (< `md`):** botón hamburguesa que abre un `Sheet` de shadcn desde la derecha con
  los enlaces en pila y el CTA al pie. Cierra al navegar. Bloquea el scroll del body
  mientras está abierto (lo maneja Radix).

### 5.2 Hero

Grilla de 2 columnas en `lg`, apilada debajo. Alto mínimo `min-h-[92svh]` — `svh`, no `vh`,
para evitar el salto de la barra de direcciones en iOS.

- **Badge:** punto verde pulsante + "Sitios reales, funcionando hoy".
- **H1:** "Tu negocio necesita una web que **venda**, no una que solo exista."
  ("venda" en dorado.)
- **Subtítulo:** "Diseñamos y publicamos páginas web rápidas, que se ven bien en cualquier
  celular y convierten visitas en clientes por WhatsApp."
- **CTAs:** primario dorado "Quiero mi página web" → `#planes`; secundario vidrio "Ver
  trabajos" → `#trabajos`.
- **Tira de confianza:** "Entrega en 7 días · Dominio y hosting incluidos · Soporte
  post-lanzamiento".
- **Visual:** mockup de navegador con el screenshot real de un proyecto, que rota cada 5 s
  con crossfade entre los proyectos disponibles. Un solo `<Image priority>` por vez.

**Presupuesto de animación:** como máximo **una** animación `repeat: Infinity` en toda la
vista del hero (el punto del badge). El resto son transiciones de entrada de una sola vez.
Las tres tarjetas flotantes de métricas actuales (`+120%`, `+85%`, `+200%`) se eliminan: son
cifras inventadas y suman tres loops infinitos.

### 5.3 Prueba social

Banda angosta, fondo `--card`. "Ya trabajamos con" + los nombres/rubros de los clientes
reales en fila (wrap en mobile). Sin logos de terceros que no tengamos derecho a usar: solo
nombre + rubro en texto.

### 5.4 Problema → Solución

Dos columnas contrapuestas.

- **Izquierda — "Sin web":** perfil de Instagram como único canal; clientes que preguntan
  precios por DM; nadie te encuentra en Google; competencia que sí aparece.
- **Derecha — "Con Luckywebs":** catálogo siempre disponible; el cliente llega a WhatsApp
  ya decidido; aparecés cuando te buscan; presencia que da confianza.

La columna izquierda va en gris apagado, la derecha con acento dorado y borde.

### 5.5 Servicios

Grilla de 6 tarjetas (`2×3` en `md`, `3×2` en `lg`):

1. Landing page — Una página que presenta tu negocio y lleva a WhatsApp.
2. Tienda online — Catálogo con carrito y pedidos por WhatsApp.
3. Web institucional — Varias secciones para empresas y organismos.
4. Catálogo digital — Tus productos ordenados, con búsqueda y filtros.
5. SEO local — Que te encuentren cuando buscan tu rubro en tu zona.
6. Mantenimiento — Cambios, respaldos y soporte después del lanzamiento.

Se elimina "Invitaciones virtuales".

### 5.6 Beneficios

Se conservan los 5 ítems actuales. Se reescriben los títulos a mayúscula normal (hoy están
en `UPPERCASE` completo, que penaliza la legibilidad) y se ajusta el copy a venta de webs.

### 5.7 Trabajos — sección núcleo

Tres casos reales. Cada tarjeta:

- Screenshot desktop real dentro de un marco de navegador, con el screenshot mobile
  superpuesto en la esquina inferior derecha.
- Rubro (badge dorado), nombre, una línea de "qué resolvimos", chips de tecnología o
  funcionalidad.
- Botón "Visitar sitio" → abre en pestaña nueva con `rel="noopener noreferrer"`.

**Proyectos:**

| Proyecto | Rubro | Qué resolvimos | URL | Estado |
|---|---|---|---|---|
| Municipalidad de Tafí del Valle | Organismo público | Portal institucional con noticias, trámites e información turística | `https://www.municipalidadtafidelvalle.com/` | Verificado (HTTP 200) |
| Importados Tafí | E-commerce / tecnología | Catálogo de 12 categorías con carrito, búsqueda y pedidos por WhatsApp | `https://importadostafi.com/` | Verificado (HTTP 200) |
| Malina Negra | Indumentaria | Catálogo de temporada con consulta directa por WhatsApp | *(pendiente)* | **URL caída** — `malina-negra.netlify.app` devuelve 404 |

**Manejo del tercer proyecto:** la sección se alimenta de `PROJECTS` en `lib/site-config.ts`
y renderiza solo las entradas con `url` definida. Malina Negra queda en el archivo
comentado, con la URL marcada `TODO`. Con dos proyectos la grilla usa 2 columnas; con tres,
la tercera pasa a ancho completo en `lg`. El sitio no muestra tarjetas rotas ni imágenes
faltantes en ningún caso.

**Screenshots:** capturados con Playwright, viewport desktop 1440×900 y mobile 390×844,
guardados como `public/work-<slug>-desktop.webp` y `public/work-<slug>-mobile.webp`, con
ancho máximo 1440 px y calidad 80.

### 5.8 Proceso

Cuatro pasos en línea horizontal (vertical en mobile), unidos por una línea dorada que se
dibuja al entrar en viewport:

1. **Charlamos** — Nos contás qué hacés y qué necesitás. Sin compromiso.
2. **Diseñamos** — Te mostramos una propuesta antes de escribir una línea de código.
3. **Publicamos** — Dominio, hosting y tu web en vivo en 7 días.
4. **Acompañamos** — Cambios y soporte después del lanzamiento.

Responde a la objeción principal del comprador no técnico: *"no sé cómo es este proceso"*.

### 5.9 Antes / Después

Se conserva el componente. Copy reorientado a "negocio sin web / negocio con web".

### 5.10 Testimonios

Se conservan las tarjetas. El copy se reorienta a clientes de desarrollo web. Los
testimonios sin autor verificable se marcan de forma genérica por rubro y localidad, sin
inventar nombres propios ni fotos de personas.

### 5.11 Planes

Tres niveles, precios sin cambios:

| Plan | Precio | Para quién |
|---|---|---|
| Básico | $200.000 | Landing de una página |
| Profesional | $350.000 | Web de varias secciones o catálogo *(destacado)* |
| Premium | $500.000 | Tienda online completa |

Se quita cualquier feature de invitaciones. Cada plan lleva dominio, hosting el primer año,
diseño responsive e integración con WhatsApp. CTA por plan hacia WhatsApp con mensaje
prellenado indicando el plan.

### 5.12 FAQ

Las 6 preguntas actuales más dos:

- ¿La página es mía? ¿Qué pasa si dejo de trabajar con ustedes?
- ¿Qué pasa con el dominio y el hosting cuando termina el primer año?

Acordeón accesible (`Accordion` de shadcn, ya instalado): navegable por teclado y con
`aria-expanded` correcto.

### 5.13 CTA final

Banda de ancho completo sobre `--card` con glow dorado sutil: titular, una línea de apoyo y
un único botón grande a WhatsApp.

### 5.14 Footer

Isotipo + wordmark + tagline, navegación, contacto (WhatsApp, email, Instagram), zona de
cobertura ("Tafí del Valle y Tucumán · Trabajamos con toda Argentina"), y línea de copyright
con el año calculado en el servidor.

### 5.15 WhatsApp flotante

Botón circular fijo abajo a la derecha, visible solo en `< md` y recién después de 400 px de
scroll (para no tapar el CTA del hero). `aria-label` explícito. Se oculta cuando el menú
mobile está abierto.

---

## 6. Configuración centralizada

`lib/site-config.ts` — fuente única de verdad para todo dato editable:

```ts
export const SITE = {
  name: "Luckywebs",
  tagline: "Páginas web que conectan",
  description: "...",
  url: "https://luckywebs.com.ar", // TODO: confirmar dominio
  locale: "es_AR",
} as const

export const CONTACT = {
  whatsapp: "543816789468",
  whatsappDisplay: "+54 381 678 9468",
  email: "hola@luckywebs.com.ar",      // TODO: confirmar
  instagram: "luckywebs.ar",           // TODO: confirmar
  location: "Tafí del Valle, Tucumán",
} as const

export const PROJECTS = [ /* ver 5.7 */ ] as const
export const PLANS = [ /* ver 5.11 */ ] as const
```

Helper `waLink(message?: string)` que construye
`https://wa.me/<whatsapp>?text=<encodeURIComponent(message)>`. **Ningún componente
hardcodea un número, precio o URL.**

Los tres `TODO` son los únicos datos que quedan pendientes de confirmación. El sitio
funciona con ellos tal cual; son valores presentables, no placeholders rotos.

---

## 7. Rendimiento, accesibilidad y movimiento

### Movimiento

Hook `useReducedMotion` de framer-motion, ya disponible. Se centraliza en
`lib/motion.ts` un conjunto de variants (`fadeUp`, `fadeIn`, `stagger`) que devuelven
transiciones de duración 0 cuando el usuario pide movimiento reducido. Todas las secciones
consumen esas variants en lugar de definir animaciones ad-hoc.

Presupuesto: **como máximo 2 animaciones `repeat: Infinity` en toda la página** (hoy hay al
menos 8).

### Imágenes

Todo pasa a `next/image`. Los screenshots de trabajos llevan `sizes` explícito y
`placeholder="blur"`. Solo el visual del hero lleva `priority`.

### Accesibilidad

- Contraste AA en todo texto e ícono informativo.
- `aria-label` en todo enlace o botón que sea solo ícono.
- Anillo de foco visible (`--ring` dorado) en todo elemento interactivo.
- Landmarks correctos: un `<main>`, secciones con `aria-labelledby` apuntando a su `<h2>`.
- Un solo `<h1>` en la página.
- Enlace "saltar al contenido" antes del navbar.

### Spacing

Escala única entre secciones: `py-20 md:py-28`. Contenedor `max-w-7xl px-4 sm:px-6 lg:px-8`.
Se elimina la mezcla actual de `py-24` / `py-20` / valores sueltos.

---

## 8. SEO y metadata

`app/layout.tsx` se reescribe consumiendo `site-config`:

- `title.default`: "Luckywebs — Páginas web para negocios en Tucumán"
- `title.template`: `"%s | Luckywebs"`
- Keywords orientadas a intención comercial y geografía real (Tafí del Valle, Tucumán),
  no a eventos.
- Open Graph y Twitter card apuntando a `/og-image.png`.
- JSON-LD `ProfessionalService`: nombre, teléfono y dirección reales; `hasOfferCatalog` con
  los servicios de la sección 5.5. Se eliminan las coordenadas de Buenos Aires y la oferta
  de invitaciones.
- `app/sitemap.ts` y `app/robots.ts` nuevos.
- `lang="es-AR"` en `<html>`.

---

## 9. Verificación

| Chequeo | Cómo |
|---|---|
| Build limpio | `npm run build` sin errores ni warnings de tipos |
| Sin residuos de eventos | `grep -ri "invitacion\|invitation\|casamiento\|quince\|RSVP\|QR\|toque\|cereza" app components lib` vacío |
| Sin contactos placeholder | `grep -r "1234567890\|tuwebaltoque" app components lib` vacío |
| Enlaces externos vivos | `curl -sI` a cada URL de `PROJECTS` devuelve 2xx |
| Responsive | Screenshots con Playwright a 375, 768 y 1440 px; sin scroll horizontal en ninguno |
| Menú mobile | Abre, navega, cierra a 375 px |
| Movimiento reducido | Con `prefers-reduced-motion: reduce` forzado, no hay animación perceptible |
| Contraste | Verificación de los pares de color del tema contra AA |

---

## 10. Orden de implementación

Cada etapa deja el sitio en estado compilable.

1. **Fundaciones** — `site-config.ts`, `lib/motion.ts`, tokens de `globals.css`, assets de
   marca desde el JPEG.
2. **Limpieza** — borrar los 5 componentes de eventos y sus assets; recortar `page.tsx` a
   lo que queda. Build verde.
3. **Chasis** — navbar con menú mobile y scroll-spy, footer, FAB de WhatsApp, layout y SEO.
4. **Contenido comercial** — hero, prueba social, problema/solución, servicios, beneficios.
5. **Trabajos** — capturar screenshots y construir `work-section`.
6. **Cierre** — proceso, antes/después, testimonios, planes, FAQ, CTA final.
7. **Pulido** — pasada de accesibilidad, imágenes, movimiento; verificación de la sección 9.

---

## 11. Riesgos

| Riesgo | Mitigación |
|---|---|
| Malina Negra sigue caída | La sección renderiza solo proyectos con `url`; la grilla se adapta a 2. Queda comentado en config, listo para reactivar con una línea |
| Recorte del isotipo desde JPEG queda sucio | El isotipo va dentro de un badge circular crema, que coincide con el fondo del logo original; el borde del recorte no se percibe |
| Los sitios reales cambian y los screenshots quedan viejos | El script de captura queda versionado en `scripts/`, re-ejecutable en cualquier momento |
| Email e Instagram sin confirmar | Marcados `TODO` en un único archivo; cambiarlos es una línea cada uno |
