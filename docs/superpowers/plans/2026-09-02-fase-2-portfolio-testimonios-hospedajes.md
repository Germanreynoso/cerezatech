# Fase 2: páginas por proyecto, testimonios y landing de hospedajes

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dar a cada trabajo del portfolio su propia página indexable, preparar la estructura de testimonios reales y publicar una landing vertical para hospedajes de Tafí del Valle, con todos los enlaces de contacto medidos.

**Architecture:** El sitio pasa de una sola ruta a varias rutas estáticas generadas en build desde `lib/site-config.ts`, que sigue siendo la única fuente de datos. Se introduce una capa mínima de medición (`lib/contact.ts` + `lib/analytics.ts` + `components/contact-link.tsx`) que centraliza todos los enlaces de contacto del sitio y emite un evento por clic con su sección de origen. Se agrega Vitest para la lógica pura de configuración y de armado de enlaces.

**Tech Stack:** Next.js 16 (App Router, Turbopack), React 19, TypeScript 5.7, Tailwind CSS v4, framer-motion, `@next/third-parties` (Google Analytics 4), Vitest 3.

**Spec:** `docs/superpowers/specs/2026-09-02-mejoras-comerciales-design.md` (secciones 5.1, 6.1, 6.2, 6.3, 6.4, 9, 10)

## Global Constraints

- **Idioma:** todo el texto visible, los comentarios de código y los mensajes de commit van en español rioplatense, con acentos correctos. El sitio tutea ("tu negocio", "escribinos").
- **Voz:** el sitio habla en plural ("trabajamos", "publicamos"). La única excepción es la sección "Quién está detrás", que es de la fase 1 y no entra en este plan.
- **Fuente de datos única:** ningún componente hardcodea cifras, precios ni URLs. Todo sale de `lib/site-config.ts`.
- **Cifras sin fuente:** prohibidas. Cualquier número visible sale de los datos del propio portfolio o de una fuente verificable.
- **Hidratación:** el estado inicial de una animación nunca depende de `useReducedMotion`, que devuelve `false` en el servidor. Está documentado en `lib/motion.ts`. La variante sin movimiento se resuelve en CSS.
- **Tailwind v4:** el CSS suelto fuera de un `@layer` se descarta al compilar. Las extensiones de `animate-*` van en `@theme` con los keyframes adentro.
- **Contacto:** WhatsApp `543816789468`, mail `reynosogermangonzalo@gmail.com`, Instagram `germanreynoso16`. Siempre desde `lib/site-config.ts`, nunca escritos a mano.
- **Valores de `source`:** `navbar`, `hero`, `fab`, `pricing-<plan>-<modo>`, `faq`, `final-cta`, `footer`, `project-<slug>`, `audit`, `hospedajes`.
- **Accesibilidad:** contraste AA en todo texto, foco visible, un solo `h1` por página.
- **Commits:** uno por tarea, en español, con el pie de atribución que use la sesión.

---

## File Structure

**Se crean:**

| Archivo | Responsabilidad |
|---------|-----------------|
| `vitest.config.ts` | Configuración de Vitest con el alias `@` |
| `tests/contact.test.ts` | Pruebas del armado de enlaces de contacto |
| `tests/site-config.test.ts` | Pruebas de las consultas sobre proyectos y testimonios |
| `lib/contact.ts` | Función pura que arma el `href` según el canal |
| `lib/analytics.ts` | Emisión del evento `contact_click`, sin lanzar nunca |
| `components/contact-link.tsx` | Enlace de contacto único de todo el sitio |
| `components/anchor-link.tsx` | Ancla que funciona dentro y fuera de la home |
| `components/project-case.tsx` | Cuerpo de la página de un proyecto |
| `components/testimonials.tsx` | Bloque de testimonios, vacío si no hay ninguno |
| `app/trabajos/[slug]/page.tsx` | Ruta estática por proyecto |
| `app/trabajos/[slug]/not-found.tsx` | 404 propia de la sección |
| `app/hospedajes/page.tsx` | Landing vertical para hospedajes |
| `.env.example` | Variables de entorno documentadas |

**Se modifican:**

| Archivo | Cambio |
|---------|--------|
| `package.json` | Quita `@vercel/analytics`, suma `@next/third-parties` y `vitest`, agrega scripts `test` y `typecheck` |
| `next.config.mjs` | Quita `typescript.ignoreBuildErrors` |
| `app/layout.tsx` | Reemplaza Vercel Analytics por Google Analytics 4 condicional |
| `lib/site-config.ts` | Campos de caso por proyecto, tipo `Testimonial`, funciones de consulta |
| `components/navbar.tsx` | Anclas que funcionan desde subrutas, `ContactLink` |
| `components/footer.tsx` | Anclas que funcionan desde subrutas, `ContactLink`, nota de analítica |
| `components/hero-section.tsx` | `ContactLink` |
| `components/whatsapp-fab.tsx` | `ContactLink` |
| `components/pricing-section.tsx` | `ContactLink` |
| `components/faq-section.tsx` | `ContactLink` |
| `components/final-cta-section.tsx` | `ContactLink` |
| `components/work-section.tsx` | Las tarjetas enlazan a la página interna |
| `components/trust-section.tsx` | Inserta el bloque de testimonios, quita el `TODO` |
| `app/sitemap.ts` | Suma las rutas nuevas |

**Por qué esta separación.** `lib/contact.ts` queda libre de React para poder probarse en Node sin jsdom. `components/contact-link.tsx` solo une esa función con la emisión del evento. `components/project-case.tsx` existe para que `app/trabajos/[slug]/page.tsx` se quede solo con metadatos y datos estáticos, y el cuerpo visual se pueda leer y modificar aparte.

---

### Task 1: Base de medición y de pruebas

**Files:**
- Create: `vitest.config.ts`
- Create: `tests/contact.test.ts`
- Create: `lib/contact.ts`
- Create: `lib/analytics.ts`
- Create: `components/contact-link.tsx`
- Create: `.env.example`
- Modify: `package.json`
- Modify: `next.config.mjs`
- Modify: `app/layout.tsx:3` y `app/layout.tsx:124`

**Interfaces:**
- Consumes: `CONTACT`, `waLink`, `mailLink` de `lib/site-config.ts` (ya existen).
- Produces:
  ```ts
  // lib/contact.ts
  export type ContactChannel = "whatsapp" | "email" | "instagram"
  export type ContactOptions = { message?: string; subject?: string; body?: string }
  export function contactHref(channel: ContactChannel, options?: ContactOptions): string

  // lib/analytics.ts
  export function trackContact(channel: ContactChannel, source: string): void

  // components/contact-link.tsx
  export function ContactLink(props: {
    channel: ContactChannel
    source: string
    message?: string
    subject?: string
    body?: string
    className?: string
    children: React.ReactNode
    "aria-label"?: string
  }): JSX.Element
  ```

- [ ] **Step 1: Instalar dependencias y ajustar scripts**

```bash
npm uninstall @vercel/analytics
npm install @next/third-parties
npm install -D vitest
```

En `package.json`, dentro de `"scripts"`, agregar dos entradas junto a las existentes:

```json
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "tsc --noEmit"
```

- [ ] **Step 2: Configurar Vitest**

Crear `vitest.config.ts`:

```ts
import path from "node:path"
import { defineConfig } from "vitest/config"

/**
 * Solo lógica pura: configuración del sitio y armado de enlaces. Los
 * componentes se verifican con Playwright contra el sitio levantado, que es
 * donde importan (hidratación, movimiento reducido, contraste).
 */
export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
})
```

- [ ] **Step 3: Escribir la prueba que falla**

Crear `tests/contact.test.ts`:

```ts
import { describe, expect, it } from "vitest"
import { contactHref } from "@/lib/contact"
import { CONTACT } from "@/lib/site-config"

describe("contactHref", () => {
  it("arma un enlace de WhatsApp con el mensaje codificado", () => {
    expect(contactHref("whatsapp", { message: "Hola! Soy Germán" })).toBe(
      `https://wa.me/${CONTACT.whatsapp}?text=Hola!%20Soy%20Germ%C3%A1n`
    )
  })

  it("arma un enlace de WhatsApp sin mensaje", () => {
    expect(contactHref("whatsapp")).toBe(`https://wa.me/${CONTACT.whatsapp}`)
  })

  it("arma un enlace de correo con asunto y cuerpo", () => {
    const href = contactHref("email", { subject: "Mi consulta", body: "Hola" })
    expect(href).toBe(`mailto:${CONTACT.email}?subject=Mi+consulta&body=Hola`)
  })

  it("arma un enlace de correo sin parámetros", () => {
    expect(contactHref("email")).toBe(`mailto:${CONTACT.email}`)
  })

  it("devuelve el perfil de Instagram", () => {
    expect(contactHref("instagram")).toBe(CONTACT.instagramUrl)
  })
})
```

- [ ] **Step 4: Correr la prueba y verificar que falla**

Run: `npm test`
Expected: FAIL con `Failed to resolve import "@/lib/contact"`.

- [ ] **Step 5: Implementar `lib/contact.ts`**

```ts
import { CONTACT, mailLink, waLink } from "@/lib/site-config"

/**
 * Los tres canales de contacto del sitio.
 *
 * Existe aparte del componente para poder probarse sin React: es la única
 * pieza de la cadena de contacto con lógica propia.
 */
export type ContactChannel = "whatsapp" | "email" | "instagram"

export type ContactOptions = {
  /** Mensaje prellenado. Solo aplica a WhatsApp. */
  message?: string
  /** Asunto del correo. */
  subject?: string
  /** Cuerpo del correo. */
  body?: string
}

export function contactHref(channel: ContactChannel, options: ContactOptions = {}): string {
  switch (channel) {
    case "whatsapp":
      return waLink(options.message)
    case "email":
      return mailLink(options.subject, options.body)
    case "instagram":
      return CONTACT.instagramUrl
  }
}
```

- [ ] **Step 6: Correr la prueba y verificar que pasa**

Run: `npm test`
Expected: PASS, 5 pruebas.

- [ ] **Step 7: Implementar la emisión del evento**

Crear `lib/analytics.ts`:

```ts
"use client"

import { sendGAEvent } from "@next/third-parties/google"
import type { ContactChannel } from "@/lib/contact"

/**
 * Registra un clic de contacto.
 *
 * `source` identifica la sección desde la que se hizo clic, y es lo que
 * después permite saber qué parte de la página convierte. Los valores válidos
 * están enumerados en la spec.
 *
 * Si Google Analytics no está montado —porque no hay NEXT_PUBLIC_GA_ID, como
 * en desarrollo y en las previsualizaciones— no hace nada. Nunca lanza: un
 * error de analítica no puede romper un enlace de contacto.
 */
export function trackContact(channel: ContactChannel, source: string): void {
  if (typeof window === "undefined") return

  const dataLayer = (window as Window & { dataLayer?: unknown[] }).dataLayer
  if (!Array.isArray(dataLayer)) return

  try {
    sendGAEvent("event", "contact_click", { channel, source })
  } catch {
    // Silencio a propósito.
  }
}
```

- [ ] **Step 8: Implementar el componente**

Crear `components/contact-link.tsx`:

```tsx
"use client"

import type { ReactNode } from "react"
import { trackContact } from "@/lib/analytics"
import { contactHref, type ContactChannel } from "@/lib/contact"

/**
 * Único enlace de contacto del sitio.
 *
 * Centralizarlo cumple dos funciones: el `href` se arma en un solo lugar a
 * partir de la configuración, y cada clic queda medido con la sección de la
 * que salió. Antes cada sección armaba su propio enlace a mano.
 */
export function ContactLink({
  channel,
  source,
  message,
  subject,
  body,
  className,
  children,
  ...rest
}: {
  channel: ContactChannel
  /** Sección de origen. Ver los valores permitidos en la spec. */
  source: string
  message?: string
  subject?: string
  body?: string
  className?: string
  children: ReactNode
  "aria-label"?: string
}) {
  const href = contactHref(channel, { message, subject, body })
  // El correo abre el cliente local; los otros dos, una pestaña nueva.
  const external = channel !== "email"

  return (
    <a
      href={href}
      className={className}
      onClick={() => trackContact(channel, source)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      {children}
    </a>
  )
}
```

- [ ] **Step 9: Cambiar la analítica en el layout**

En `app/layout.tsx`, reemplazar la línea 3:

```ts
import { Analytics } from '@vercel/analytics/next'
```

por:

```ts
import { GoogleAnalytics } from '@next/third-parties/google'
```

Y reemplazar la línea 124:

```tsx
        {process.env.NODE_ENV === 'production' && <Analytics />}
```

por:

```tsx
        {/* Sin NEXT_PUBLIC_GA_ID no se carga ningún script: desarrollo y
            previsualizaciones no ensucian los datos. */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
```

- [ ] **Step 10: Documentar las variables de entorno**

Crear `.env.example`:

```bash
# Identificador de Google Analytics 4 (formato G-XXXXXXXXXX).
# Sin esta variable el sitio no carga ningún script de analítica.
NEXT_PUBLIC_GA_ID=

# Clave de la API de PageSpeed Insights, usada por la auditoría (fase 3).
# Lleva el prefijo público porque la consulta la hace el navegador: una
# función de Netlify se corta a los 10 segundos y PageSpeed tarda más.
# Debe estar restringida por referente HTTP al dominio del sitio.
# Sin clave, la auditoría sale sin datos de velocidad.
NEXT_PUBLIC_PSI_API_KEY=
```

- [ ] **Step 11: Endurecer la comprobación de tipos**

En `next.config.mjs`, eliminar el bloque `typescript`, dejando:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
}

export default nextConfig
```

El repositorio compila limpio hoy, así que quitar la excepción no rompe el build y evita que un error de tipos llegue a producción cuando entre el código de servidor de la fase 3.

- [ ] **Step 12: Verificar**

Run: `npm test && npm run typecheck && npm run build`
Expected: 5 pruebas en verde, `tsc` sin salida, build exitoso.

- [ ] **Step 13: Commit**

```bash
git add package.json package-lock.json vitest.config.ts tests/contact.test.ts lib/contact.ts lib/analytics.ts components/contact-link.tsx .env.example next.config.mjs app/layout.tsx
git commit -m "feat: medición de contactos con Google Analytics y base de pruebas"
```

---

### Task 2: Migrar los enlaces de contacto existentes

**Files:**
- Modify: `components/navbar.tsx`
- Modify: `components/hero-section.tsx`
- Modify: `components/whatsapp-fab.tsx`
- Modify: `components/pricing-section.tsx`
- Modify: `components/faq-section.tsx`
- Modify: `components/final-cta-section.tsx`
- Modify: `components/footer.tsx`

**Interfaces:**
- Consumes: `ContactLink` de `components/contact-link.tsx` (Task 1).
- Produces: nada nuevo. Después de esta tarea, ningún componente llama a `waLink` ni a `mailLink` directamente.

**Nota para quien implemente.** `components/footer.tsx` es hoy un componente de servidor. `ContactLink` es de cliente, y un componente de servidor puede renderizar uno de cliente sin problema, así que el footer **no** necesita `"use client"` por este cambio. Sí lo va a necesitar en la Task 4, por otro motivo.

- [ ] **Step 1: Reemplazar en el navbar**

En `components/navbar.tsx` hay dos enlaces de WhatsApp: el botón de escritorio y el del pie del menú móvil. Reemplazar el primero:

```tsx
          <ContactLink
            channel="whatsapp"
            source="navbar"
            message={WA_MESSAGE}
            className="hidden items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:inline-flex"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            Hablar por WhatsApp
          </ContactLink>
```

El del menú móvil necesita además cerrar el panel. Como `ContactLink` no expone `onClick`, envolverlo en un `<span>` que capture el clic en fase de burbujeo:

```tsx
                  <span onClick={() => handleOpenChange(false)}>
                    <ContactLink
                      channel="whatsapp"
                      source="navbar"
                      message={WA_MESSAGE}
                      className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-base font-semibold text-primary-foreground"
                    >
                      <MessageCircle className="h-5 w-5" aria-hidden />
                      Hablar por WhatsApp
                    </ContactLink>
                  </span>
```

Agregar el import `import { ContactLink } from "@/components/contact-link"` y quitar `waLink` de la importación de `site-config` si ya no se usa.

- [ ] **Step 2: Reemplazar en el hero**

En `components/hero-section.tsx`, el enlace `motion.a` de WhatsApp. `ContactLink` no es un componente de framer-motion, así que el `variants={fadeUp}` pasa al envoltorio:

```tsx
          <motion.div variants={fadeUp}>
            <ContactLink
              channel="whatsapp"
              source="hero"
              message={WA_MESSAGE}
              className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              ¿Dudas? Escribinos por WhatsApp, respondemos el mismo día
            </ContactLink>
          </motion.div>
```

- [ ] **Step 3: Reemplazar en el botón flotante**

En `components/whatsapp-fab.tsx` el enlace es un `motion.a` con animación de entrada y salida. Mantener la animación en un `motion.div` y poner el `ContactLink` adentro:

```tsx
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-5 right-5 z-40 md:hidden"
        >
          <ContactLink
            channel="whatsapp"
            source="fab"
            message={WA_MESSAGE}
            aria-label="Hablar por WhatsApp"
            className="glow-gold flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
          >
            <MessageCircle className="h-6 w-6" aria-hidden />
          </ContactLink>
        </motion.div>
```

- [ ] **Step 4: Reemplazar en los planes**

En `components/pricing-section.tsx`, el botón de cada plan usa `source` compuesto con el nombre del plan en minúsculas y la modalidad activa:

```tsx
            source={`pricing-${plan.name.toLowerCase()}-${mode}`}
```

El botón de la banda `CUSTOM_TIER` usa `source="pricing-medida"`.

- [ ] **Step 5: Reemplazar en FAQ y CTA final**

En `components/faq-section.tsx`, el enlace del pie usa `source="faq"`.

En `components/final-cta-section.tsx` hay dos: el de WhatsApp con `source="final-cta"` y el de correo, que pasa a:

```tsx
              <ContactLink
                channel="email"
                source="final-cta"
                subject="Consulta sobre una página web"
                body={"Hola! Te escribo para consultar por una página web.\n\nMi negocio o institución:\n\nQué necesito:\n"}
                className="inline-flex items-center gap-2.5 rounded-xl border border-border px-8 py-4 text-lg font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Mail className="h-5 w-5" aria-hidden />
                Escribinos por mail
              </ContactLink>
```

- [ ] **Step 6: Reemplazar en el footer**

En `components/footer.tsx` hay cuatro enlaces: WhatsApp de la lista, correo, Instagram y el botón "Pedir presupuesto". Los cuatro usan `source="footer"`. El de Instagram:

```tsx
                <ContactLink
                  channel="instagram"
                  source="footer"
                  className="flex items-center gap-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Instagram className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                  @{CONTACT.instagram}
                </ContactLink>
```

Agregar además, en el bloque inferior del footer junto al aviso de derechos, la línea de transparencia que pide la spec:

```tsx
          <p className="text-sm text-muted-foreground">
            Usamos Google Analytics para contar visitas. No vendemos datos.
          </p>
```

- [ ] **Step 7: Verificar que no quedan enlaces sueltos**

Run: `grep -rn "waLink\|mailLink" components/ app/`
Expected: solo `components/contact-link.tsx` no aparece (usa `contactHref`), y las únicas apariciones son en `lib/contact.ts` y `lib/site-config.ts`. Cero resultados en `components/` y `app/`.

- [ ] **Step 8: Verificar el build**

Run: `npm run typecheck && npm run build`
Expected: sin errores.

- [ ] **Step 9: Commit**

```bash
git add components/
git commit -m "refactor: todos los enlaces de contacto pasan por ContactLink"
```

---

### Task 3: Datos de caso y testimonios en la configuración

**Files:**
- Modify: `lib/site-config.ts`
- Create: `tests/site-config.test.ts`

**Interfaces:**
- Consumes: `Project`, `Sector`, `VISIBLE_PROJECTS` (ya existen).
- Produces:
  ```ts
  // Campos nuevos del tipo Project
  challenge: string
  solution: string
  result?: string

  export type Testimonial = {
    name: string
    role: string
    business: string
    projectSlug: string
    quote: string
    photo?: string
  }
  export const TESTIMONIALS: readonly Testimonial[]

  export function projectBySlug(slug: string): Project | undefined
  export function relatedProjects(slug: string, limit?: number): readonly Project[]
  export function testimonialFor(projectSlug: string): Testimonial | undefined
  ```

- [ ] **Step 1: Escribir las pruebas que fallan**

Crear `tests/site-config.test.ts`:

```ts
import { describe, expect, it } from "vitest"
import {
  PROJECTS,
  TESTIMONIALS,
  VISIBLE_PROJECTS,
  projectBySlug,
  relatedProjects,
  testimonialFor,
} from "@/lib/site-config"

describe("projectBySlug", () => {
  it("encuentra un proyecto publicado", () => {
    expect(projectBySlug("importados-tafi")?.name).toBe("Importados Tafí")
  })

  it("devuelve undefined para un slug inexistente", () => {
    expect(projectBySlug("no-existe")).toBeUndefined()
  })
})

describe("relatedProjects", () => {
  it("devuelve proyectos del mismo rubro sin incluir el actual", () => {
    const related = relatedProjects("repasofrances")
    expect(related.length).toBeGreaterThan(0)
    expect(related.every((p) => p.sector === "educacion")).toBe(true)
    expect(related.some((p) => p.slug === "repasofrances")).toBe(false)
  })

  it("respeta el límite", () => {
    expect(relatedProjects("repasofrances", 2).length).toBe(2)
  })

  it("completa con otros rubros cuando el propio no alcanza", () => {
    // "institucional" tiene un solo proyecto, así que no hay hermanos.
    const related = relatedProjects("municipalidad-tafi", 3)
    expect(related.length).toBe(3)
    expect(related.some((p) => p.slug === "municipalidad-tafi")).toBe(false)
  })
})

describe("datos de caso", () => {
  it("todo proyecto publicado tiene punto de partida y solución", () => {
    for (const project of VISIBLE_PROJECTS) {
      expect(project.challenge.length, `${project.slug} sin challenge`).toBeGreaterThan(0)
      expect(project.solution.length, `${project.slug} sin solution`).toBeGreaterThan(0)
    }
  })

  it("los slugs no se repiten", () => {
    const slugs = PROJECTS.map((p) => p.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })
})

describe("testimonialFor", () => {
  it("devuelve undefined cuando no hay testimonios cargados", () => {
    if (TESTIMONIALS.length === 0) {
      expect(testimonialFor("importados-tafi")).toBeUndefined()
    }
  })

  it("todo testimonio apunta a un proyecto que existe", () => {
    for (const t of TESTIMONIALS) {
      expect(projectBySlug(t.projectSlug), `${t.name} apunta a ${t.projectSlug}`).toBeDefined()
    }
  })
})
```

- [ ] **Step 2: Correr y verificar que falla**

Run: `npm test`
Expected: FAIL con `projectBySlug is not a function` o error de importación.

- [ ] **Step 3: Ampliar el tipo `Project`**

En `lib/site-config.ts`, dentro de `export type Project`, agregar tres campos después de `highlights`:

```ts
  /** Con qué venía el cliente antes del sitio. Dos o tres líneas. */
  challenge: string
  /** Qué se construyó y por qué así. */
  solution: string
  /**
   * Solo si el cliente confirmó un dato concreto. Se omite antes que
   * inventarlo: toda la página se apoya en que lo que dice se puede comprobar.
   */
  result?: string
```

- [ ] **Step 4: Completar los diez proyectos**

Agregar `challenge` y `solution` a cada entrada de `PROJECTS`. Textos exactos:

**municipalidad-tafi**
- challenge: `"El municipio comunicaba por redes sociales y por teléfono. Un vecino que necesitaba un trámite tenía que llamar para saber qué papeles llevar, y el turista que llegaba no encontraba información oficial sobre el estado de la ruta."`
- solution: `"Un portal institucional con noticias, trámites y guía turística, en español e inglés. El clima y el estado de la ruta se muestran en vivo, así que la información más consultada está siempre actualizada sin que nadie la cargue a mano."`

**importados-tafi**
- challenge: `"El catálogo vivía en historias de Instagram que se borraban a las 24 horas. Cada consulta de precio empezaba de cero por mensaje privado, y el mismo producto se preguntaba varias veces por día."`
- solution: `"Una tienda con doce categorías, buscador y carrito. El pedido llega armado al WhatsApp del local, con los productos y las cantidades ya escritas. Sin pasarela de pago, así que no hay comisiones por venta."`

**laprohibida**
- challenge: `"La casa se promocionaba en plataformas de alquiler que cobran comisión por cada reserva y no permiten mostrar el lugar como es."`
- solution: `"Un sitio propio con galería por ambiente, comodidades, carta del bar y ubicación. Las consultas de fecha salen por WhatsApp con el mensaje ya armado, sin intermediarios ni comisión."`

**turmalina-negra**
- challenge: `"Los precios y la duración de cada sesión se pedían por mensaje privado, y la conversación se repetía con cada persona nueva."`
- solution: `"Cada servicio con su precio y su duración a la vista, más galería de arte y testimonios. La reserva sale por WhatsApp identificando la sesión elegida."`

**el-grow-de-aixa**
- challenge: `"Un growshop de Concepción que vendía por mensaje y no tenía forma de mostrar el catálogo completo ni de llegar fuera de la ciudad."`
- solution: `"Tienda con seis categorías de producto, carrito, sección de ofertas y envíos a todo el país. El pedido llega al teléfono del local."`

**soscan**
- challenge: `"Un producto físico nuevo, sin ningún lugar donde explicar para qué sirve ni cómo se consigue."`
- solution: `"Una landing de producto con casos de uso concretos, testimonios y formulario de pedido. Todo el argumento en una sola página."`

**repasofrances**
- challenge: `"Los alumnos que preparaban el ingreso a la Escuela Normal en Lenguas Vivas estudiaban con fotocopias y no tenían forma de practicar el formato real del examen."`
- solution: `"Una plataforma con unidades, ejercicios interactivos, juegos y simuladores del examen. Cada alumno ve su progreso y sabe qué le falta repasar."`

**arturovaldezdelasu**
- challenge: `"Enseñar flauta dulce a distancia obligaba a repetir las digitaciones en cada clase y a mandar partituras sueltas por mensaje."`
- solution: `"Un método completo con tabla interactiva de digitaciones, partituras, afinador en el navegador y blog. El alumno practica solo entre clase y clase."`

**estdiotaller**
- challenge: `"Estudiar de apuntes no daba forma de comprobar si el tema quedó entendido, y sostener el hábito de estudio era el problema real."`
- solution: `"Una plataforma con temario, cuestionarios, tarjetas de repaso y un tutor con inteligencia artificial. El sistema de niveles y rachas sostiene la constancia."`

**mineraloteca**
- challenge: `"Consultar propiedades de minerales obligaba a saltar entre manuales, y comparar dos ejemplares se hacía a mano."`
- solution: `"Una base de conocimiento con catálogo filtrable, comparador de propiedades lado a lado, cuestionario de práctica y asistente de consulta."`

Ningún proyecto lleva `result` en esta tarea: no hay datos confirmados por los clientes. Se completan cuando lleguen las respuestas de la fase 0.

- [ ] **Step 5: Agregar el tipo y la lista de testimonios**

Al final de la sección de Trabajos en `lib/site-config.ts`, después de `OTHER_PROJECTS`:

```ts
/* -------------------------------------------------------------------------- */
/* Testimonios                                                                 */
/* -------------------------------------------------------------------------- */

export type Testimonial = {
  name: string
  /** "Dueña", "Director", "Secretario de Turismo". */
  role: string
  business: string
  /** Debe coincidir con el slug de un proyecto publicado. */
  projectSlug: string
  quote: string
  /** Ruta en /public. Sin foto se muestran las iniciales. */
  photo?: string
}

/**
 * Solo entran testimonios con autorización escrita del cliente.
 *
 * La lista arranca vacía a propósito: mientras esté vacía, el sitio se
 * comporta igual que antes. Los testimonios inventados fueron lo único no
 * verificable de una página cuyo argumento entero es que todo se puede
 * comprobar, y no se repite ese error.
 */
export const TESTIMONIALS: readonly Testimonial[] = []
```

- [ ] **Step 6: Agregar las funciones de consulta**

Después de `TESTIMONIALS`:

```ts
export function projectBySlug(slug: string): Project | undefined {
  return VISIBLE_PROJECTS.find((p) => p.slug === slug)
}

/**
 * Otros trabajos para ofrecer al pie de una página de proyecto.
 *
 * Prioriza el mismo rubro, que es lo que le sirve a quien está mirando, y
 * completa con el resto cuando el rubro no tiene suficientes. Así la fila
 * nunca queda a medias.
 */
export function relatedProjects(slug: string, limit = 3): readonly Project[] {
  const current = projectBySlug(slug)
  const others = VISIBLE_PROJECTS.filter((p) => p.slug !== slug)
  if (!current) return others.slice(0, limit)

  const sameSector = others.filter((p) => p.sector === current.sector)
  const rest = others.filter((p) => p.sector !== current.sector)
  return [...sameSector, ...rest].slice(0, limit)
}

export function testimonialFor(projectSlug: string): Testimonial | undefined {
  return TESTIMONIALS.find((t) => t.projectSlug === projectSlug)
}
```

- [ ] **Step 7: Correr las pruebas**

Run: `npm test`
Expected: PASS, 14 pruebas en total entre los dos archivos (5 de contacto y 9 de configuración).

- [ ] **Step 8: Commit**

```bash
git add lib/site-config.ts tests/site-config.test.ts
git commit -m "feat: datos de caso por proyecto y estructura de testimonios"
```

---

### Task 4: Anclas que funcionan desde subrutas

**Files:**
- Create: `components/anchor-link.tsx`
- Modify: `components/navbar.tsx`
- Modify: `components/footer.tsx`

**Interfaces:**
- Consumes: `NAV_LINKS` de `lib/site-config.ts`.
- Produces:
  ```ts
  export function AnchorLink(props: {
    hash: string            // "#planes"
    className?: string
    onNavigate?: () => void
    children: ReactNode
    "aria-current"?: "true" | undefined
  }): JSX.Element
  ```

**Por qué.** Hoy el navbar usa `href="#planes"`, que fuera de la home no lleva a ningún lado. Poner `href="/#planes"` siempre lo arregla en subrutas pero rompe la home: provoca una recarga completa y se pierde el desplazamiento suave. El componente resuelve el `href` según la ruta actual.

- [ ] **Step 1: Crear el componente**

```tsx
"use client"

import type { ReactNode } from "react"
import { usePathname } from "next/navigation"

/**
 * Ancla a una sección de la home.
 *
 * En la home queda como ancla pura, para conservar el desplazamiento suave y
 * no recargar. Desde cualquier otra ruta apunta a la home con el hash, que
 * navega y después baja a la sección.
 */
export function AnchorLink({
  hash,
  className,
  onNavigate,
  children,
  ...rest
}: {
  /** Con el numeral incluido: "#planes". */
  hash: string
  className?: string
  onNavigate?: () => void
  children: ReactNode
  "aria-current"?: "true" | undefined
}) {
  const pathname = usePathname()
  const href = pathname === "/" ? hash : `/${hash}`

  return (
    <a href={href} className={className} onClick={onNavigate} {...rest}>
      {children}
    </a>
  )
}
```

- [ ] **Step 2: Usarlo en el navbar**

En `components/navbar.tsx`, reemplazar los dos mapeos de `NAV_LINKS` (lista de escritorio y lista del menú móvil) para que usen `AnchorLink` con `hash={link.href}`. El de escritorio conserva `aria-current`; el móvil pasa `onNavigate={() => handleOpenChange(false)}`.

El logo también debe funcionar desde subrutas: reemplazar `<a href="#inicio">` por `<AnchorLink hash="#inicio">`.

- [ ] **Step 3: Apagar el scroll-spy fuera de la home**

El indicador de sección activa no tiene sentido en una página de proyecto. En `components/navbar.tsx`:

```tsx
  const pathname = usePathname()
  const isHome = pathname === "/"
  const spied = useScrollSpy(SECTION_IDS)
  const active = isHome ? spied : null
```

`useScrollSpy` sigue ejecutándose fuera de la home pero no encuentra ninguna de las secciones, así que no observa nada y no cuesta nada. Se ignora su resultado para que ningún ítem quede marcado como activo.

- [ ] **Step 4: Usarlo en el footer**

`components/footer.tsx` es un componente de servidor y `AnchorLink` es de cliente, lo cual es válido: un componente de servidor puede renderizar uno de cliente. Reemplazar el mapeo de `NAV_LINKS` para que use `AnchorLink hash={link.href}`. El footer **no** lleva `"use client"`.

- [ ] **Step 5: Verificar**

Run: `npm run typecheck && npm run build`
Expected: sin errores.

- [ ] **Step 6: Commit**

```bash
git add components/anchor-link.tsx components/navbar.tsx components/footer.tsx
git commit -m "feat: las anclas de navegación funcionan desde cualquier ruta"
```

---

### Task 5: Página de cada proyecto

**Files:**
- Create: `components/project-case.tsx`
- Create: `app/trabajos/[slug]/page.tsx`
- Create: `app/trabajos/[slug]/not-found.tsx`

**Interfaces:**
- Consumes: `projectBySlug`, `relatedProjects`, `testimonialFor`, `VISIBLE_PROJECTS`, `projectShot`, `SECTOR_LABELS`, `SITE` de `lib/site-config.ts`; `BrowserFrame`, `PhoneFrame`; `ContactLink`; `SiteChrome`; `Footer`.
- Produces:
  ```tsx
  export function ProjectCase({ project }: { project: Project }): JSX.Element
  ```

- [ ] **Step 1: Crear el cuerpo de la página**

Crear `components/project-case.tsx`. Es un componente de servidor: no tiene estado ni animaciones de scroll, y así el contenido llega completo en el HTML, que es lo que importa para el posicionamiento.

```tsx
import Link from "next/link"
import { ArrowUpRight, ChevronRight } from "lucide-react"
import { BrowserFrame, PhoneFrame } from "@/components/browser-frame"
import { ContactLink } from "@/components/contact-link"
import {
  SECTOR_LABELS,
  projectShot,
  relatedProjects,
  testimonialFor,
  type Project,
} from "@/lib/site-config"

function domainOf(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "")
}

export function ProjectCase({ project }: { project: Project }) {
  const related = relatedProjects(project.slug)
  const testimonial = testimonialFor(project.slug)

  const blocks = [
    { title: "El punto de partida", body: project.challenge },
    { title: "Qué hicimos", body: project.solution },
    ...(project.result ? [{ title: "Resultado", body: project.result }] : []),
  ]

  return (
    <article className="mx-auto max-w-5xl px-4 pb-20 pt-28 sm:px-6 md:pt-32 lg:px-8">
      <nav aria-label="Miga de pan" className="text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="transition-colors hover:text-foreground">
              Inicio
            </Link>
          </li>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          <li>
            <Link href="/#trabajos" className="transition-colors hover:text-foreground">
              Trabajos
            </Link>
          </li>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          <li className="text-foreground" aria-current="page">
            {project.name}
          </li>
        </ol>
      </nav>

      <header className="mt-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-primary/12 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
            {project.category}
          </span>
          <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
            {SECTOR_LABELS[project.sector]}
          </span>
        </div>

        <h1 className="mt-4 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
          {project.name}
        </h1>

        <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
          {project.summary}
        </p>
      </header>

      <div className="relative mt-12">
        <BrowserFrame
          src={projectShot(project.slug, "desktop")}
          alt={`Vista de escritorio del sitio de ${project.name}`}
          label={domainOf(project.url)}
          priority
          sizes="(min-width: 1024px) 64rem, 92vw"
        />
        <PhoneFrame
          src={projectShot(project.slug, "mobile")}
          alt={`Vista en celular del sitio de ${project.name}`}
          sizes="120px"
          className="absolute -bottom-8 right-6 hidden w-20 sm:block lg:w-24"
        />
      </div>

      <div className="mt-20 grid gap-10 md:grid-cols-2 md:gap-12">
        {blocks.map((block) => (
          <section key={block.title}>
            <h2 className="text-xl font-bold text-foreground">{block.title}</h2>
            <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">{block.body}</p>
          </section>
        ))}
      </div>

      <section className="mt-14">
        <h2 className="text-xl font-bold text-foreground">Qué incluye</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {project.highlights.map((h) => (
            <li
              key={h}
              className="rounded-xl border border-border bg-card/40 px-3.5 py-2 text-sm text-muted-foreground"
            >
              {h}
            </li>
          ))}
        </ul>
      </section>

      {testimonial && (
        <figure className="mt-14 rounded-2xl border border-primary/25 bg-card p-8">
          <blockquote className="text-pretty text-lg leading-relaxed text-foreground">
            «{testimonial.quote}»
          </blockquote>
          <figcaption className="mt-4 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{testimonial.name}</span>
            {` · ${testimonial.role} de ${testimonial.business}`}
          </figcaption>
        </figure>
      )}

      <div className="mt-14 flex flex-col gap-3 sm:flex-row">
        <ContactLink
          channel="whatsapp"
          source={`project-${project.slug}`}
          message={`Hola! Vi el sitio de ${project.name} y quiero algo parecido para mi negocio.`}
          className="glow-gold inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Quiero algo así
        </ContactLink>

        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="glass inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-semibold text-foreground transition-colors hover:bg-secondary"
        >
          Visitar el sitio
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </a>
      </div>

      {related.length > 0 && (
        <section className="mt-20 border-t border-border pt-12">
          <h2 className="text-xl font-bold text-foreground">Otros trabajos</h2>
          <ul className="mt-6 grid gap-5 sm:grid-cols-3">
            {related.map((other) => (
              <li key={other.slug}>
                <Link
                  href={`/trabajos/${other.slug}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card/40 transition-colors hover:border-primary/40 hover:bg-card"
                >
                  <div className="relative aspect-[1440/900] overflow-hidden border-b border-border">
                    <BrowserFrame
                      src={projectShot(other.slug, "desktop")}
                      alt={`Sitio de ${other.name}`}
                      label={domainOf(other.url)}
                      sizes="(min-width: 640px) 20rem, 88vw"
                      chromeless
                      className="h-full rounded-none border-0 shadow-none"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-foreground">{other.name}</h3>
                    <p className="mt-0.5 text-xs text-primary">{other.category}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  )
}
```

- [ ] **Step 2: Crear la ruta**

Crear `app/trabajos/[slug]/page.tsx`:

```tsx
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Footer } from "@/components/footer"
import { ProjectCase } from "@/components/project-case"
import { SiteChrome } from "@/components/site-chrome"
import { SECTOR_LABELS, SITE, VISIBLE_PROJECTS, projectBySlug, projectShot } from "@/lib/site-config"

/** Solo existen las rutas de los proyectos publicados. Cualquier otra es 404. */
export const dynamicParams = false

export function generateStaticParams() {
  return VISIBLE_PROJECTS.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = projectBySlug(slug)
  if (!project) return {}

  const title = `${project.name} · ${project.category}`
  const url = `${SITE.url}/trabajos/${project.slug}`
  const image = projectShot(project.slug, "desktop")

  return {
    title,
    description: project.summary,
    alternates: { canonical: `/trabajos/${project.slug}` },
    openGraph: {
      type: "article",
      url,
      title: `${title} | ${SITE.name}`,
      description: project.summary,
      images: [{ url: image, alt: `Sitio web de ${project.name}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE.name}`,
      description: project.summary,
      images: [image],
    },
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = projectBySlug(slug)
  if (!project) notFound()

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: SITE.url },
          { "@type": "ListItem", position: 2, name: "Trabajos", item: `${SITE.url}/#trabajos` },
          {
            "@type": "ListItem",
            position: 3,
            name: project.name,
            item: `${SITE.url}/trabajos/${project.slug}`,
          },
        ],
      },
      {
        "@type": "CreativeWork",
        name: project.name,
        description: project.summary,
        url: project.url,
        genre: SECTOR_LABELS[project.sector],
        image: `${SITE.url}${projectShot(project.slug, "desktop")}`,
        creator: { "@type": "Organization", name: SITE.name, url: SITE.url },
      },
    ],
  }

  return (
    <>
      <SiteChrome />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen">
        <ProjectCase project={project} />
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 3: Crear la página de no encontrado**

Crear `app/trabajos/[slug]/not-found.tsx`:

```tsx
import Link from "next/link"
import { Footer } from "@/components/footer"
import { SiteChrome } from "@/components/site-chrome"

export default function NotFound() {
  return (
    <>
      <SiteChrome />
      <main className="mx-auto flex min-h-[70svh] max-w-3xl flex-col items-center justify-center px-4 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          No encontramos ese trabajo
        </h1>
        <p className="mt-4 text-pretty text-muted-foreground">
          Puede que el enlace esté mal escrito. Todos los sitios que hicimos están en la sección
          de trabajos.
        </p>
        <Link
          href="/#trabajos"
          className="glow-gold mt-8 inline-flex items-center rounded-xl bg-primary px-6 py-3.5 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Ver todos los trabajos
        </Link>
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 4: Verificar que se generan las diez rutas**

Run: `npm run build`
Expected: la salida lista diez rutas bajo `/trabajos/[slug]`, todas marcadas como estáticas (`●` o `SSG`).

- [ ] **Step 5: Verificar en el navegador**

Levantar `npm run dev` y abrir `http://localhost:3000/trabajos/importados-tafi`.
Comprobar: un solo `h1`, la miga de pan lleva a la home, el botón "Quiero algo así" abre WhatsApp con el nombre del proyecto en el mensaje, y al pie hay tres trabajos más, todos de comercio primero.

Abrir `http://localhost:3000/trabajos/no-existe` y comprobar que responde 404.

- [ ] **Step 6: Commit**

```bash
git add components/project-case.tsx app/trabajos/
git commit -m "feat: una página propia por cada trabajo del portfolio"
```

---

### Task 6: Enlazar el portfolio a las páginas internas

**Files:**
- Modify: `components/work-section.tsx`

**Interfaces:**
- Consumes: la ruta `/trabajos/[slug]` de la Task 5.
- Produces: nada nuevo.

**Criterio.** La tarjeta lleva a la página interna, que es donde está el caso completo. El enlace al sitio real queda como acción secundaria dentro de la destacada. La cinta de prueba social (`social-proof-section.tsx`) **no** cambia: su función es demostrar que los sitios están online, así que sigue apuntando afuera.

- [ ] **Step 1: Cambiar la tarjeta destacada**

En `FeaturedCard`, el botón de abajo pasa a ser un `Link` interno y el enlace externo queda como texto secundario al lado:

```tsx
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link
            href={`/trabajos/${project.slug}`}
            className="inline-flex w-fit items-center gap-1.5 rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            Ver el caso
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
          >
            Visitar sitio
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </a>
        </div>
```

Agregar los imports `import Link from "next/link"` y `ArrowRight` de `lucide-react`.

- [ ] **Step 2: Cambiar la tarjeta compacta**

En `CompactCard`, reemplazar el `<a href={project.url} target="_blank">` externo por un `Link` interno a `/trabajos/${project.slug}`, quitando `target` y `rel`. El icono `ArrowUpRight` pasa a `ArrowRight`, porque ya no sale del sitio.

- [ ] **Step 3: Actualizar el texto de la sección**

El párrafo dice "podés abrir ahora mismo y recorrer", que se refería al enlace externo. Cambiarlo a:

```tsx
            No son maquetas. Son {VISIBLE_PROJECTS.length} sitios en producción. Entrá a cada
            caso para ver qué resolvimos, o abrí el sitio y recorrelo.
```

- [ ] **Step 4: Verificar**

Run: `npm run typecheck && npm run build`

Levantar el sitio y comprobar que desde la home, al hacer clic en una tarjeta compacta, se navega a la página interna sin recargar, y que desde ahí el ítem "Planes" del navbar vuelve a la home y baja a la sección.

- [ ] **Step 5: Commit**

```bash
git add components/work-section.tsx
git commit -m "feat: las tarjetas del portfolio llevan al caso completo"
```

---

### Task 7: Testimonios en la sección de confianza

**Files:**
- Create: `components/testimonials.tsx`
- Modify: `components/trust-section.tsx`

**Interfaces:**
- Consumes: `TESTIMONIALS`, `projectBySlug` de `lib/site-config.ts` (Task 3).
- Produces:
  ```tsx
  export function Testimonials(): JSX.Element | null
  ```
  Devuelve `null` cuando no hay ninguno cargado.

- [ ] **Step 1: Crear el componente**

```tsx
"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { useMotionVariants, VIEWPORT } from "@/lib/motion"
import { TESTIMONIALS, projectBySlug } from "@/lib/site-config"
import { cn } from "@/lib/utils"

/** Iniciales para cuando el cliente no dio foto. */
function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
}

/**
 * Testimonios reales, con nombre y autorización.
 *
 * Sin carrusel: dos o tres se leen de un vistazo, y esconderlos detrás de
 * flechas los haría menos visibles, no más.
 */
export function Testimonials() {
  const { fadeUp, stagger } = useMotionVariants()

  if (TESTIMONIALS.length === 0) return null

  return (
    <div className="mt-6">
      <h3 className="text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground">
        Lo que dicen los clientes
      </h3>

      <motion.ul
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        variants={stagger}
        className={cn(
          "mt-6 grid gap-5",
          TESTIMONIALS.length > 1 && "sm:grid-cols-2"
        )}
      >
        {TESTIMONIALS.map((testimonial) => {
          const project = projectBySlug(testimonial.projectSlug)
          return (
            <motion.li
              key={`${testimonial.projectSlug}-${testimonial.name}`}
              variants={fadeUp}
              className="rounded-2xl border border-border bg-card/40 p-6"
            >
              <figure>
                <blockquote className="text-pretty leading-relaxed text-foreground">
                  «{testimonial.quote}»
                </blockquote>

                <figcaption className="mt-5 flex items-center gap-3">
                  {testimonial.photo ? (
                    <Image
                      src={testimonial.photo}
                      alt=""
                      width={44}
                      height={44}
                      className="h-11 w-11 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary"
                    >
                      {initials(testimonial.name)}
                    </span>
                  )}

                  <span className="min-w-0 text-sm">
                    <span className="block font-semibold text-foreground">{testimonial.name}</span>
                    <span className="block text-muted-foreground">
                      {testimonial.role} de {testimonial.business}
                    </span>
                    {project && (
                      <Link
                        href={`/trabajos/${project.slug}`}
                        className="text-primary underline-offset-4 hover:underline"
                      >
                        Ver el trabajo
                      </Link>
                    )}
                  </span>
                </figcaption>
              </figure>
            </motion.li>
          )
        })}
      </motion.ul>
    </div>
  )
}
```

- [ ] **Step 2: Insertarlo en la sección de confianza**

En `components/trust-section.tsx`, agregar `import { Testimonials } from "@/components/testimonials"` y colocar `<Testimonials />` entre el `motion.dl` de las métricas y el `motion.ul` de los compromisos.

- [ ] **Step 3: Quitar el TODO**

Eliminar del comentario de cabecera de `trust-section.tsx` las dos líneas del `TODO`, que ya está resuelto, y dejar en su lugar:

```
 * Los testimonios reales se renderizan acá en cuanto haya al menos uno
 * cargado en TESTIMONIALS, con autorización del cliente.
```

- [ ] **Step 4: Verificar el caso vacío**

Run: `npm run build`

Levantar el sitio y comprobar que, con `TESTIMONIALS` vacío, la sección "Por qué podés confiar" se ve exactamente igual que antes: métricas, y debajo los cuatro compromisos, sin espacio en blanco de más.

- [ ] **Step 5: Verificar el caso con datos**

Agregar temporalmente dos testimonios de prueba a `TESTIMONIALS`, comprobar que se muestran en dos columnas con sus iniciales y el enlace al trabajo, y **quitarlos antes de commitear**.

Run: `npm test`
Expected: PASS. La prueba "todo testimonio apunta a un proyecto que existe" valida los de prueba mientras estén.

- [ ] **Step 6: Commit**

```bash
git add components/testimonials.tsx components/trust-section.tsx
git commit -m "feat: bloque de testimonios reales en la sección de confianza"
```

---

### Task 8: Landing para hospedajes

**Files:**
- Create: `app/hospedajes/page.tsx`
- Modify: `components/footer.tsx`

**Interfaces:**
- Consumes: `PLANS`, `BUYOUT_MONTHS`, `MIN_TERM_MONTHS`, `PRICES_UPDATED`, `billingExtras`, `projectBySlug`, `projectShot`, `SITE`, `CONTACT`; `BrowserFrame`; `ContactLink`; `SiteChrome`; `Footer`.
- Produces: la ruta `/hospedajes`.

**Criterio de precio.** No se crea un plan nuevo en la configuración. Un hospedaje es un plan Profesional con contenido de hospedaje, así que la página muestra ese plan tomándolo de `PLANS`. Si en la práctica los hospedajes piden otra cosa, se ajusta con datos.

- [ ] **Step 1: Crear la página**

```tsx
import type { Metadata } from "next"
import { Check, MessageCircle } from "lucide-react"
import { BrowserFrame } from "@/components/browser-frame"
import { ContactLink } from "@/components/contact-link"
import { Footer } from "@/components/footer"
import { SiteChrome } from "@/components/site-chrome"
import {
  MIN_TERM_MONTHS,
  PLANS,
  PRICES_UPDATED,
  SITE,
  billingExtras,
  projectBySlug,
  projectShot,
} from "@/lib/site-config"

const TITLE = "Páginas web para cabañas y alquileres en Tafí del Valle"
const DESCRIPTION =
  "Tu hospedaje con página propia: galería por ambiente, comodidades, tarifas y consultas de fecha por WhatsApp. Sin comisión por reserva."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/hospedajes" },
  openGraph: {
    type: "website",
    url: `${SITE.url}/hospedajes`,
    title: `${TITLE} | ${SITE.name}`,
    description: DESCRIPTION,
    images: [{ url: projectShot("laprohibida", "desktop"), alt: TITLE }],
  },
}

const INCLUDES = [
  {
    title: "Galería por ambiente",
    description: "Cada espacio con sus fotos, para que el huésped sepa exactamente qué alquila.",
  },
  {
    title: "Comodidades a la vista",
    description: "Wifi, cochera, calefacción, capacidad. Todo lo que preguntan antes de reservar.",
  },
  {
    title: "Tarifas por temporada",
    description: "Precios distintos según la época del año, actualizables cuando los cambies.",
  },
  {
    title: "Consulta de fechas por WhatsApp",
    description: "El huésped elige fechas y te llega el mensaje ya armado, sin ida y vuelta.",
  },
  {
    title: "Mapa y cómo llegar",
    description: "Ubicación exacta e indicaciones desde la ruta, que es lo que más se consulta.",
  },
  {
    title: "Español e inglés",
    description: "Tafí recibe turismo de afuera. La página se adapta al idioma del visitante.",
  },
]

const WHY = [
  {
    title: "Sin comisión por reserva",
    description:
      "Las plataformas se quedan con un porcentaje de cada noche. Tu página no cobra nada por cada huésped que te escribe.",
  },
  {
    title: "No dependés de un algoritmo",
    description:
      "En una plataforma competís con cientos de avisos iguales. Tu página es tuya y muestra el lugar como es.",
  },
  {
    title: "El precio deja de preguntarse por privado",
    description:
      "Tarifas, capacidad y disponibilidad publicadas. El huésped llega sabiendo, y la conversación arranca en la reserva.",
  },
]

const FAQS = [
  {
    question: "¿Se puede reservar y pagar online?",
    answer:
      "En esta página la reserva se cierra por WhatsApp, que es lo que usa la mayoría de los hospedajes de la zona y no cobra comisión. Si querés cobrar la seña online, se puede integrar una pasarela de pago: entra como desarrollo a medida y lo presupuestamos aparte.",
  },
  {
    question: "¿Incluye calendario de disponibilidad?",
    answer:
      "Se puede mostrar un calendario que cargás vos con las fechas ocupadas. Sincronizarlo automáticamente con las plataformas donde ya publicás es posible y también se presupuesta aparte.",
  },
  {
    question: "¿Puedo cargar las fotos y cambiar los precios yo?",
    answer:
      "Sí. Te entregamos un panel para cambiar fotos, textos y tarifas, y te lo explicamos en una videollamada. Si preferís no tocar nada, los cambios los hacemos nosotros.",
  },
]

export default function HospedajesPage() {
  const plan = PLANS.find((p) => p.name === "Profesional")
  if (!plan) throw new Error("Falta el plan Profesional en la configuración")

  const reference = projectBySlug("laprohibida")

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Páginas web para hospedajes",
    description: DESCRIPTION,
    provider: { "@type": "Organization", name: SITE.name, url: SITE.url },
    areaServed: { "@type": "Place", name: "Tafí del Valle, Tucumán" },
    url: `${SITE.url}/hospedajes`,
  }

  const waMessage = "Hola! Tengo un hospedaje en Tafí y quiero una página."

  return (
    <>
      <SiteChrome />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen">
        <section className="mx-auto grid max-w-7xl gap-12 px-4 pb-16 pt-28 sm:px-6 md:pt-32 lg:grid-cols-2 lg:items-center lg:px-8">
          <div>
            <p className="inline-flex rounded-full border border-border bg-card/60 px-4 py-1.5 text-sm text-muted-foreground">
              Para cabañas y alquileres de Tafí del Valle
            </p>
            <h1 className="mt-6 text-balance text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl">
              Tu cabaña, con página propia y consultas de fecha{" "}
              <span className="text-gradient">por WhatsApp</span>
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
              {DESCRIPTION}
            </p>
            <ContactLink
              channel="whatsapp"
              source="hospedajes"
              message={waMessage}
              className="glow-gold mt-9 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <MessageCircle className="h-5 w-5" aria-hidden />
              Quiero la página de mi hospedaje
            </ContactLink>
          </div>

          {reference && (
            <div>
              <BrowserFrame
                src={projectShot(reference.slug, "desktop")}
                alt={`Sitio web de ${reference.name}`}
                label={reference.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                priority
                sizes="(min-width: 1024px) 46vw, 92vw"
              />
              <p className="mt-4 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{reference.name}</span>
                {" · alquiler temporario en Tafí del Valle"}
              </p>
            </div>
          )}
        </section>

        <section
          aria-labelledby="incluye-titulo"
          className="border-y border-border bg-card/40 py-20"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 id="incluye-titulo" className="text-center text-3xl font-bold tracking-tight">
              Qué <span className="text-gradient">incluye</span>
            </h2>
            <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {INCLUDES.map((item) => (
                <li key={item.title} className="rounded-2xl border border-border bg-card/50 p-6">
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="porque-titulo" className="py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h2 id="porque-titulo" className="text-center text-3xl font-bold tracking-tight">
              Por qué no alcanza con las <span className="text-gradient">plataformas</span>
            </h2>
            <ul className="mt-12 grid gap-6 md:grid-cols-3">
              {WHY.map((item) => (
                <li key={item.title}>
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          aria-labelledby="precio-titulo"
          className="border-y border-border bg-card/40 py-20"
        >
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 id="precio-titulo" className="text-center text-3xl font-bold tracking-tight">
              Cuánto <span className="text-gradient">cuesta</span>
            </h2>
            <p className="mt-4 text-center text-pretty text-muted-foreground">
              Un hospedaje entra en el plan {plan.name}. Podés pagarlo de una o mensualmente.
            </p>

            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-7">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                  Pago único
                </h3>
                <p className="mt-3 text-3xl font-bold text-foreground">
                  desde {plan.pricing.oneOff}
                </p>
                <ul className="mt-5 space-y-2.5">
                  {billingExtras(plan, "contado").map((extra) => (
                    <li key={extra} className="flex items-start gap-2.5 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                      <span className="text-muted-foreground">{extra}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-primary/35 bg-card p-7">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-primary">
                  Suscripción
                </h3>
                <p className="mt-3 text-3xl font-bold text-foreground">
                  {plan.pricing.monthly}
                  <span className="text-base font-normal text-muted-foreground"> por mes</span>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  más {plan.pricing.setup} de pago inicial
                </p>
                <ul className="mt-5 space-y-2.5">
                  {billingExtras(plan, "suscripcion").map((extra) => (
                    <li key={extra} className="flex items-start gap-2.5 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                      <span className="text-muted-foreground">{extra}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-xs text-muted-foreground">
                  Permanencia mínima de {MIN_TERM_MONTHS} meses.
                </p>
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              Precios actualizados a {PRICES_UPDATED}. Te pasamos un monto cerrado por escrito
              antes de arrancar.
            </p>
          </div>
        </section>

        <section aria-labelledby="faq-hospedajes-titulo" className="py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2
              id="faq-hospedajes-titulo"
              className="text-center text-3xl font-bold tracking-tight"
            >
              Preguntas <span className="text-gradient">frecuentes</span>
            </h2>
            <dl className="mt-10 space-y-6">
              {FAQS.map((faq) => (
                <div key={faq.question} className="rounded-2xl border border-border bg-card/40 p-6">
                  <dt className="font-semibold text-foreground">{faq.question}</dt>
                  <dd className="mt-2 text-pretty leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-12 text-center">
              <ContactLink
                channel="whatsapp"
                source="hospedajes"
                message={waMessage}
                className="glow-gold inline-flex items-center gap-2.5 rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                <MessageCircle className="h-5 w-5" aria-hidden />
                Escribinos por WhatsApp
              </ContactLink>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
```

- [ ] **Step 2: Enlazarla desde el footer**

En `components/footer.tsx`, dentro de la lista de navegación, agregar un ítem al final del mapeo de `NAV_LINKS`:

```tsx
              <li>
                <Link
                  href="/hospedajes"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Para hospedajes
                </Link>
              </li>
```

Agregar `import Link from "next/link"`.

- [ ] **Step 3: Enlazarla desde la página de La Prohibida**

En `components/project-case.tsx`, después del bloque de botones, agregar un aviso que solo aparece en el proyecto de turismo:

```tsx
      {project.sector === "turismo" && (
        <p className="mt-8 rounded-2xl border border-primary/25 bg-card/40 p-5 text-sm text-muted-foreground">
          ¿Tenés un hospedaje en Tafí del Valle?{" "}
          <Link
            href="/hospedajes"
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            Mirá el plan pensado para cabañas y alquileres
          </Link>
          .
        </p>
      )}
```

- [ ] **Step 4: Verificar**

Run: `npm run typecheck && npm run build`
Expected: la ruta `/hospedajes` aparece en la salida como estática.

Abrir la página y comprobar: un solo `h1`, los precios coinciden con los del plan Profesional de la home, los dos botones de WhatsApp abren el mensaje del hospedaje.

- [ ] **Step 5: Commit**

```bash
git add app/hospedajes/ components/footer.tsx components/project-case.tsx
git commit -m "feat: landing para cabañas y alquileres de Tafí del Valle"
```

---

### Task 9: Sitemap y verificación final

**Files:**
- Modify: `app/sitemap.ts`

**Interfaces:**
- Consumes: `VISIBLE_PROJECTS`, `SITE`.
- Produces: nada nuevo.

- [ ] **Step 1: Sumar las rutas nuevas**

```ts
import type { MetadataRoute } from 'next'
import { SITE, VISIBLE_PROJECTS } from '@/lib/site-config'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  return [
    {
      url: SITE.url,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${SITE.url}/hospedajes`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...VISIBLE_PROJECTS.map((project) => ({
      url: `${SITE.url}/trabajos/${project.slug}`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    })),
  ]
}
```

- [ ] **Step 2: Verificar el sitemap**

Run: `npm run build && npm start`

Abrir `http://localhost:3000/sitemap.xml` y contar las entradas: deben ser doce (home, hospedajes y diez trabajos).

- [ ] **Step 3: Verificación visual completa**

Con el sitio levantado, recorrer con Playwright a 375, 768 y 1440 px las tres plantillas nuevas (`/`, `/trabajos/importados-tafi`, `/hospedajes`) y comprobar:

- Sin desborde horizontal: `document.documentElement.scrollWidth <= window.innerWidth` en los tres anchos.
- Sin errores ni advertencias en consola, en particular ningún aviso de hidratación.
- Contraste AA en todos los nodos de texto.
- Un solo `h1` por página.
- Con `prefers-reduced-motion: reduce`, cero animaciones infinitas y la cinta de clientes envuelta en varias líneas.

- [ ] **Step 4: Verificación de la fase completa**

Run: `npm test && npm run typecheck && npm run build`
Expected: 14 pruebas en verde, sin errores de tipos, build exitoso con doce rutas.

Comprobaciones puntuales de la spec:

```bash
# Ningún componente arma enlaces de contacto a mano.
grep -rn "wa.me\|mailto:" components/ app/ | grep -v "contact-link.tsx"
# Esperado: cero resultados.

# El TODO de testimonios ya no existe.
grep -rn "TODO" components/
# Esperado: cero resultados.
```

- [ ] **Step 5: Commit y subida**

```bash
git add app/sitemap.ts
git commit -m "feat: sitemap con las páginas de trabajos y hospedajes"
git push origin main
```

---

## Verificación de cobertura contra la spec

| Requisito de la spec | Tarea |
|----------------------|-------|
| 5.1 Medición: quitar Vercel Analytics, montar GA4 condicional | Task 1 |
| 5.1 `lib/analytics.ts` con `trackContact` | Task 1 |
| 5.1 `components/contact-link.tsx` en todos los enlaces | Tasks 1 y 2 |
| 5.1 Valores de `source` | Tasks 2, 5, 8 |
| 5.1 Línea de transparencia en el pie | Task 2 |
| 6.1 Ruta `/trabajos/[slug]` estática, `dynamicParams = false` | Task 5 |
| 6.1 Campos `challenge`, `solution`, `result` | Task 3 |
| 6.1 Contenido en orden, con testimonio y trabajos relacionados | Task 5 |
| 6.1 Metadatos, Open Graph, JSON-LD | Task 5 |
| 6.1 Tarjetas de la home enlazan adentro; la cinta sigue afuera | Task 6 |
| 6.1 Navegación desde subrutas | Task 4 |
| 6.2 Tipo `Testimonial` y lista vacía | Task 3 |
| 6.2 Render condicional en Confianza, sin carrusel | Task 7 |
| 6.3 Landing `/hospedajes` con las seis secciones | Task 8 |
| 6.3 Precio tomado del plan Profesional | Task 8 |
| 6.3 Enlaces desde el footer y desde La Prohibida | Task 8 |
| 6.4 Verificación completa | Task 9 |

**Queda fuera de este plan a propósito:** el enlace desde la tarjeta "Web institucional" de la sección fusionada (spec 6.3), porque la fusión de Servicios y Beneficios es de la fase 1, que está diferida. En su lugar la landing se enlaza desde el footer y desde el caso de La Prohibida. Cuando entre la fase 1, agregar el enlace en la tarjeta correspondiente.
