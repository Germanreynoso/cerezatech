# Fase 3: auditoría automática de presencia digital

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Que un visitante pegue la dirección de su web o de su Instagram y reciba en segundos un diagnóstico con puntaje, donde cada hallazgo apunta a algo que el estudio resuelve.

**Architecture:** Una ruta de API en Node que orquesta cuatro módulos puros y probables por separado: validación de la URL (con defensa contra peticiones a la red interna), análisis del HTML descargado, consulta a PageSpeed Insights y cálculo del puntaje. Un adaptador de almacenamiento sobre Netlify Blobs, con reserva en memoria, resuelve la caché y el límite por IP. La página de resultados es un componente de cliente que consume esa ruta.

**Tech Stack:** Next.js 16 (route handlers, runtime Node), TypeScript 5.7, Vitest 3, `node-html-parser`, `@netlify/blobs`, API de PageSpeed Insights v5.

**Spec:** `docs/superpowers/specs/2026-09-02-mejoras-comerciales-design.md` (sección 7)

**Requisito previo:** el plan `2026-09-02-fase-2-portfolio-testimonios-hospedajes.md` debe estar completo. De ahí vienen Vitest, `ContactLink`, `AnchorLink` y `.env.example`.

## Global Constraints

- **Idioma:** todo el texto visible, los comentarios de código y los mensajes de commit van en español rioplatense, con acentos correctos.
- **Fuente de datos única:** ningún componente hardcodea cifras, precios ni URLs. Todo sale de `lib/site-config.ts`.
- **Este es el primer código de servidor del proyecto.** Toda la lógica vive en `lib/audit/`, en módulos puros y probados. La ruta de API solo orquesta.
- **Defensa contra peticiones a la red interna:** la función descarga una URL que elige un desconocido. Se validan el esquema y el destino resuelto antes de cada petición y después de cada redirección. Es el requisito de seguridad central de esta fase.
- **La auditoría no guarda prospectos.** Solo caché de resultados por 24 horas. No hay lista de URLs auditadas ni de contactos.
- **La clave de PageSpeed es obligatoria en la práctica.** Se verificó que la cuota anónima compartida de Google está agotada: sin clave, PageSpeed responde 429. Sin clave el informe sale igual, con los chequeos propios y una nota.
- **Presupuesto de tiempo, y por qué la auditoría se parte en dos.** Netlify corta una función sincrónica a los 10 segundos. PageSpeed Insights tarda habitualmente entre 15 y 40, así que una sola ruta que hiciera las dos cosas se cortaría siempre en producción. La ruta de API hace únicamente los chequeos propios y responde en menos de 8 segundos. La consulta a PageSpeed la hace el navegador, que no tiene ese límite, con una clave restringida por dominio de origen. El informe se muestra apenas llega lo primero y se completa cuando llega lo segundo.
- **La clave de PageSpeed viaja al navegador.** Va en `NEXT_PUBLIC_PSI_API_KEY` y **debe** crearse en Google Cloud con restricción por referente HTTP al dominio del sitio. Es una clave de solo lectura sobre datos públicos y con cuota propia: la restricción por dominio es la mitigación que Google documenta para este uso. Ninguna otra credencial del proyecto puede llegar al cliente.
- **Accesibilidad:** el formulario se opera por teclado, y los estados de carga y error se anuncian con `aria-live`.
- **Nunca lanzar hacia el usuario:** cualquier fallo interno se convierte en un mensaje en español.
- **Commits:** uno por tarea, en español, con el pie de atribución que use la sesión.

---

## File Structure

**Se crean:**

| Archivo | Responsabilidad |
|---------|-----------------|
| `lib/audit/types.ts` | Tipos compartidos por toda la auditoría |
| `lib/audit/validate-url.ts` | Normalización, clasificación y bloqueo de destinos internos |
| `lib/audit/analyze-html.ts` | Los ocho chequeos sobre el HTML descargado |
| `lib/audit/pagespeed.ts` | Consulta a PageSpeed Insights desde el navegador, tolerante a fallos |
| `lib/audit/score.ts` | Puntaje ponderado y armado del informe |
| `lib/audit/social-report.ts` | Informe fijo para cuentas de Instagram y Facebook |
| `lib/audit/store.ts` | Caché y límite por IP sobre Netlify Blobs, con reserva en memoria |
| `lib/audit/fetch-site.ts` | Descarga del HTML con límites y validación en cada redirección |
| `app/api/auditoria/route.ts` | Orquestación y respuesta |
| `app/auditoria/page.tsx` | Página con el formulario |
| `components/audit-form.tsx` | Formulario y render del informe |
| `tests/audit/validate-url.test.ts` | Pruebas de la validación |
| `tests/audit/analyze-html.test.ts` | Pruebas de los chequeos |
| `tests/audit/score.test.ts` | Pruebas del puntaje |
| `tests/audit/fixtures/*.html` | HTML de ejemplo para las pruebas |

**Se modifican:**

| Archivo | Cambio |
|---------|--------|
| `package.json` | Suma `node-html-parser` y `@netlify/blobs` |
| `lib/site-config.ts` | Suma el ítem de auditoría a la navegación |
| `components/navbar.tsx` | Enlace destacado a la auditoría |
| `components/problem-solution-section.tsx` | Enlace al pie de la sección |
| `app/sitemap.ts` | Suma `/auditoria` |

**Por qué esta separación.** Cada módulo de `lib/audit/` tiene una responsabilidad y se prueba solo, sin red ni servidor. `fetch-site.ts` es el único que hace peticiones salientes, así que la superficie de riesgo queda en un archivo. La ruta de API no contiene lógica: si algo falla, se sabe en qué módulo mirar.

---

### Task 1: Tipos y validación de URLs

**Files:**
- Create: `lib/audit/types.ts`
- Create: `lib/audit/validate-url.ts`
- Create: `tests/audit/validate-url.test.ts`

**Interfaces:**
- Consumes: nada del proyecto. Solo `node:dns/promises` y `node:net`.
- Produces:
  ```ts
  // lib/audit/types.ts
  export type Severity = "alta" | "media" | "baja"
  export type CheckId =
    // Chequeos sobre el HTML de un sitio real.
    | "https" | "viewport" | "title" | "description"
    | "single-h1" | "direct-contact" | "image-alt" | "social-only"
    // Hallazgos del informe para cuentas sin sitio propio. Van aparte para
    // que un identificador nunca signifique dos cosas distintas.
    | "no-domain" | "invisible-google" | "price-in-dm"
    | "content-expires" | "low-trust"
  export type Check = {
    id: CheckId
    passed: boolean
    severity: Severity
    label: string
    detail: string
    /** Qué plan o servicio lo resuelve. */
    fixedBy: string
  }
  export type PsiResult = {
    performance: number   // 0-100
    seo: number           // 0-100
    lcpMs: number | null
    lcpDisplay: string | null
  }
  export type AuditKind = "full" | "social"
  export type AuditReport = {
    kind: AuditKind
    url: string
    total: number
    performance: number | null
    seo: number | null
    lcpDisplay: string | null
    checks: Check[]
    notes: string[]
  }

  // lib/audit/validate-url.ts
  export type UrlKind = "social" | "web"
  export type ValidationResult =
    | { ok: true; url: URL; kind: UrlKind }
    | { ok: false; reason: string }
  export function validateAuditUrl(raw: string): ValidationResult
  export function isPrivateAddress(ip: string): boolean
  export function isBlockedHostname(hostname: string): boolean
  export async function assertPublicHost(hostname: string): Promise<void>
  ```

- [ ] **Step 1: Escribir las pruebas que fallan**

Crear `tests/audit/validate-url.test.ts`:

```ts
import { describe, expect, it } from "vitest"
import {
  isBlockedHostname,
  isPrivateAddress,
  validateAuditUrl,
} from "@/lib/audit/validate-url"

describe("validateAuditUrl", () => {
  it("acepta un dominio común y le agrega https", () => {
    const result = validateAuditUrl("importadostafi.com")
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.url.protocol).toBe("https:")
      expect(result.url.hostname).toBe("importadostafi.com")
      expect(result.kind).toBe("web")
    }
  })

  it("conserva http cuando viene explícito", () => {
    const result = validateAuditUrl("http://ejemplo.com.ar/pagina")
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.url.protocol).toBe("http:")
  })

  it("clasifica Instagram como red social", () => {
    const result = validateAuditUrl("https://www.instagram.com/germanreynoso16")
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.kind).toBe("social")
  })

  it("clasifica Facebook como red social", () => {
    const result = validateAuditUrl("facebook.com/algunapagina")
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.kind).toBe("social")
  })

  it("rechaza esquemas que no son http ni https", () => {
    expect(validateAuditUrl("file:///etc/passwd").ok).toBe(false)
    expect(validateAuditUrl("javascript:alert(1)").ok).toBe(false)
    expect(validateAuditUrl("ftp://ejemplo.com").ok).toBe(false)
  })

  it("rechaza texto vacío o sin punto en el dominio", () => {
    expect(validateAuditUrl("").ok).toBe(false)
    expect(validateAuditUrl("   ").ok).toBe(false)
    expect(validateAuditUrl("noesundominio").ok).toBe(false)
  })

  it("rechaza destinos internos por nombre", () => {
    expect(validateAuditUrl("http://localhost:3000").ok).toBe(false)
    expect(validateAuditUrl("http://algo.local").ok).toBe(false)
    expect(validateAuditUrl("http://127.0.0.1").ok).toBe(false)
    expect(validateAuditUrl("http://10.0.0.5").ok).toBe(false)
    expect(validateAuditUrl("http://169.254.169.254").ok).toBe(false)
  })

  it("recorta espacios alrededor", () => {
    const result = validateAuditUrl("  https://ejemplo.com  ")
    expect(result.ok).toBe(true)
  })
})

describe("isPrivateAddress", () => {
  it("reconoce rangos IPv4 privados y reservados", () => {
    for (const ip of [
      "127.0.0.1",
      "10.1.2.3",
      "172.16.0.1",
      "172.31.255.255",
      "192.168.1.1",
      "169.254.169.254",
      "0.0.0.0",
      "100.64.0.1",
    ]) {
      expect(isPrivateAddress(ip), ip).toBe(true)
    }
  })

  it("acepta direcciones IPv4 públicas", () => {
    for (const ip of ["8.8.8.8", "172.32.0.1", "192.169.0.1", "1.1.1.1"]) {
      expect(isPrivateAddress(ip), ip).toBe(false)
    }
  })

  it("reconoce direcciones IPv6 internas", () => {
    for (const ip of ["::1", "fc00::1", "fd12:3456::1", "fe80::1", "::ffff:127.0.0.1"]) {
      expect(isPrivateAddress(ip), ip).toBe(true)
    }
  })

  it("acepta IPv6 públicas", () => {
    expect(isPrivateAddress("2606:4700:4700::1111")).toBe(false)
  })
})

describe("isBlockedHostname", () => {
  it("bloquea nombres internos", () => {
    for (const host of ["localhost", "algo.localhost", "servidor.local", "api.internal"]) {
      expect(isBlockedHostname(host), host).toBe(true)
    }
  })

  it("no bloquea dominios comunes", () => {
    expect(isBlockedHostname("importadostafi.com")).toBe(false)
  })
})
```

- [ ] **Step 2: Correr y verificar que falla**

Run: `npx vitest run tests/audit/validate-url.test.ts`
Expected: FAIL con `Failed to resolve import "@/lib/audit/validate-url"`.

- [ ] **Step 3: Crear los tipos compartidos**

Crear `lib/audit/types.ts` con las definiciones del bloque **Produces** de esta tarea, cada una con un comentario de una línea. Sin lógica.

- [ ] **Step 4: Implementar la validación**

Crear `lib/audit/validate-url.ts`:

```ts
import { lookup } from "node:dns/promises"
import { isIP } from "node:net"

/** Hosts de redes sociales que reciben el informe fijo en vez del completo. */
const SOCIAL_HOSTS = ["instagram.com", "facebook.com", "fb.com"]

/** Sufijos de nombre que nunca apuntan a internet. */
const BLOCKED_SUFFIXES = [".local", ".internal", ".localhost", ".home", ".lan"]

export type UrlKind = "social" | "web"

export type ValidationResult =
  | { ok: true; url: URL; kind: UrlKind }
  | { ok: false; reason: string }

/**
 * Direcciones a las que la función nunca debe pedir.
 *
 * Sin este filtro, cualquiera podría usar la auditoría como puente hacia la
 * red interna del servidor: pedirle que "audite" la dirección de metadatos de
 * la nube y leer la respuesta.
 */
export function isPrivateAddress(ip: string): boolean {
  const version = isIP(ip)

  if (version === 4) {
    const parts = ip.split(".").map(Number)
    const [a, b] = parts
    if (a === 0 || a === 127) return true          // actual y loopback
    if (a === 10) return true                       // privada clase A
    if (a === 172 && b >= 16 && b <= 31) return true // privada clase B
    if (a === 192 && b === 168) return true         // privada clase C
    if (a === 169 && b === 254) return true         // enlace local y metadatos
    if (a === 100 && b >= 64 && b <= 127) return true // CGNAT
    if (a >= 224) return true                       // multicast y reservadas
    return false
  }

  if (version === 6) {
    const lower = ip.toLowerCase()
    if (lower === "::" || lower === "::1") return true
    // IPv4 embebida en IPv6: se evalúa con las reglas de IPv4.
    const mapped = lower.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/)
    if (mapped) return isPrivateAddress(mapped[1])
    // fc00::/7 (únicas locales) y fe80::/10 (enlace local).
    if (/^f[cd]/.test(lower)) return true
    if (/^fe[89ab]/.test(lower)) return true
    return false
  }

  // No es una IP: la decisión la toma isBlockedHostname.
  return false
}

export function isBlockedHostname(hostname: string): boolean {
  const host = hostname.toLowerCase()
  if (host === "localhost") return true
  if (BLOCKED_SUFFIXES.some((suffix) => host.endsWith(suffix))) return true
  if (isIP(host) && isPrivateAddress(host)) return true
  return false
}

/**
 * Comprueba que el nombre resuelva a direcciones públicas.
 *
 * Se llama antes de cada petición y después de cada redirección: un dominio
 * público puede resolver a una dirección interna, y una redirección puede
 * llevar de un host permitido a uno que no lo es.
 */
export async function assertPublicHost(hostname: string): Promise<void> {
  if (isBlockedHostname(hostname)) {
    throw new Error("destino no permitido")
  }
  if (isIP(hostname)) return

  const addresses = await lookup(hostname, { all: true })
  if (addresses.length === 0) throw new Error("no se pudo resolver el dominio")
  if (addresses.some((entry) => isPrivateAddress(entry.address))) {
    throw new Error("destino no permitido")
  }
}

export function validateAuditUrl(raw: string): ValidationResult {
  const trimmed = raw.trim()
  if (trimmed.length === 0) {
    return { ok: false, reason: "Escribí la dirección de tu web o de tu Instagram." }
  }
  if (trimmed.length > 2000) {
    return { ok: false, reason: "Esa dirección es demasiado larga." }
  }

  // Sin esquema se asume https, que es lo que escribe la mayoría.
  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`

  let url: URL
  try {
    url = new URL(candidate)
  } catch {
    return { ok: false, reason: "No pudimos entender esa dirección. Revisá que esté completa." }
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return { ok: false, reason: "Solo podemos revisar direcciones que empiecen con http o https." }
  }

  if (!url.hostname.includes(".")) {
    return { ok: false, reason: "Esa dirección no parece un dominio. Por ejemplo: minegocio.com" }
  }

  if (isBlockedHostname(url.hostname)) {
    return { ok: false, reason: "Esa dirección no es pública, así que no podemos revisarla." }
  }

  const host = url.hostname.toLowerCase().replace(/^www\./, "")
  const kind: UrlKind = SOCIAL_HOSTS.includes(host) ? "social" : "web"

  return { ok: true, url, kind }
}
```

- [ ] **Step 5: Correr las pruebas**

Run: `npx vitest run tests/audit/validate-url.test.ts`
Expected: PASS, 14 pruebas.

- [ ] **Step 6: Commit**

```bash
git add lib/audit/types.ts lib/audit/validate-url.ts tests/audit/validate-url.test.ts
git commit -m "feat: validación de URLs de auditoría con bloqueo de destinos internos"
```

---

### Task 2: Chequeos sobre el HTML

**Files:**
- Create: `lib/audit/analyze-html.ts`
- Create: `tests/audit/analyze-html.test.ts`
- Create: `tests/audit/fixtures/completa.html`
- Create: `tests/audit/fixtures/minima.html`
- Create: `tests/audit/fixtures/solo-redes.html`
- Modify: `package.json`

**Interfaces:**
- Consumes: `Check`, `CheckId` de `lib/audit/types.ts` (Task 1).
- Produces:
  ```ts
  export function analyzeHtml(html: string, finalUrl: string): Check[]
  ```
  Devuelve siempre los ocho chequeos, pasados o no, en orden fijo.

- [ ] **Step 1: Instalar el analizador de HTML**

```bash
npm install node-html-parser
```

Se elige sobre expresiones regulares porque contar `<h1>` o leer atributos con regex se rompe con comentarios y atributos en varias líneas, y el informe pierde credibilidad si marca un error que no existe.

- [ ] **Step 2: Crear los fixtures**

`tests/audit/fixtures/completa.html`:

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Importados Tafí — Tecnología en Tafí del Valle</title>
    <meta name="description" content="Catálogo de tecnología con envíos a todo el país. Hacé tu pedido por WhatsApp y te lo despachamos el mismo día." />
  </head>
  <body>
    <h1>Importados Tafí</h1>
    <img src="/producto.jpg" alt="Auricular inalámbrico" />
    <img src="/logo.png" alt="Logo de la tienda" />
    <a href="https://wa.me/543816789468">Escribinos</a>
    <a href="https://instagram.com/importadostafi">Instagram</a>
  </body>
</html>
```

`tests/audit/fixtures/minima.html`:

```html
<!doctype html>
<html>
  <head>
    <title>Inicio</title>
  </head>
  <body>
    <h1>Bienvenidos</h1>
    <h1>Nuestros productos</h1>
    <img src="/a.jpg" />
    <img src="/b.jpg" alt="" />
  </body>
</html>
```

`tests/audit/fixtures/solo-redes.html`:

```html
<!doctype html>
<html lang="es">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Mi negocio en Tafí del Valle, Tucumán</title>
    <meta name="description" content="Seguinos en nuestras redes sociales para ver todas las novedades y los productos que tenemos disponibles." />
  </head>
  <body>
    <h1>Mi negocio</h1>
    <a href="https://instagram.com/minegocio">Instagram</a>
    <a href="https://facebook.com/minegocio">Facebook</a>
  </body>
</html>
```

- [ ] **Step 3: Escribir las pruebas que fallan**

Crear `tests/audit/analyze-html.test.ts`:

```ts
import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"
import { analyzeHtml } from "@/lib/audit/analyze-html"
import type { Check, CheckId } from "@/lib/audit/types"

function fixture(name: string): string {
  return readFileSync(path.join(__dirname, "fixtures", name), "utf8")
}

function byId(checks: Check[], id: CheckId): Check {
  const check = checks.find((c) => c.id === id)
  if (!check) throw new Error(`falta el chequeo ${id}`)
  return check
}

describe("analyzeHtml", () => {
  it("devuelve siempre los ocho chequeos", () => {
    const checks = analyzeHtml(fixture("minima.html"), "https://ejemplo.com")
    expect(checks).toHaveLength(8)
    expect(new Set(checks.map((c) => c.id)).size).toBe(8)
  })

  it("aprueba todo en una página completa servida por https", () => {
    const checks = analyzeHtml(fixture("completa.html"), "https://importadostafi.com/")
    expect(checks.every((c) => c.passed)).toBe(true)
  })

  it("marca http como no seguro", () => {
    const checks = analyzeHtml(fixture("completa.html"), "http://importadostafi.com/")
    expect(byId(checks, "https").passed).toBe(false)
  })

  it("detecta la falta de viewport", () => {
    const checks = analyzeHtml(fixture("minima.html"), "https://ejemplo.com")
    expect(byId(checks, "viewport").passed).toBe(false)
  })

  it("detecta un título demasiado corto", () => {
    const checks = analyzeHtml(fixture("minima.html"), "https://ejemplo.com")
    expect(byId(checks, "title").passed).toBe(false)
  })

  it("detecta la falta de descripción", () => {
    const checks = analyzeHtml(fixture("minima.html"), "https://ejemplo.com")
    expect(byId(checks, "description").passed).toBe(false)
  })

  it("detecta más de un h1", () => {
    const checks = analyzeHtml(fixture("minima.html"), "https://ejemplo.com")
    expect(byId(checks, "single-h1").passed).toBe(false)
  })

  it("detecta la falta de contacto directo", () => {
    const checks = analyzeHtml(fixture("minima.html"), "https://ejemplo.com")
    expect(byId(checks, "direct-contact").passed).toBe(false)
  })

  it("acepta un teléfono como contacto directo", () => {
    const html = `<html><body><a href="tel:+543816789468">Llamanos</a></body></html>`
    expect(byId(analyzeHtml(html, "https://ejemplo.com"), "direct-contact").passed).toBe(true)
  })

  it("detecta imágenes sin texto alternativo", () => {
    const checks = analyzeHtml(fixture("minima.html"), "https://ejemplo.com")
    expect(byId(checks, "image-alt").passed).toBe(false)
  })

  it("aprueba el texto alternativo cuando no hay imágenes", () => {
    const html = `<html><body><h1>Hola</h1></body></html>`
    expect(byId(analyzeHtml(html, "https://ejemplo.com"), "image-alt").passed).toBe(true)
  })

  it("marca una página que solo enlaza a redes", () => {
    const checks = analyzeHtml(fixture("solo-redes.html"), "https://ejemplo.com")
    expect(byId(checks, "social-only").passed).toBe(false)
  })

  it("no marca solo-redes cuando además hay contacto directo", () => {
    const checks = analyzeHtml(fixture("completa.html"), "https://ejemplo.com")
    expect(byId(checks, "social-only").passed).toBe(true)
  })

  it("no se rompe con HTML vacío", () => {
    expect(() => analyzeHtml("", "https://ejemplo.com")).not.toThrow()
    expect(analyzeHtml("", "https://ejemplo.com")).toHaveLength(8)
  })

  it("cada chequeo trae etiqueta, detalle y qué lo resuelve", () => {
    for (const check of analyzeHtml(fixture("minima.html"), "https://ejemplo.com")) {
      expect(check.label.length).toBeGreaterThan(0)
      expect(check.detail.length).toBeGreaterThan(0)
      expect(check.fixedBy.length).toBeGreaterThan(0)
    }
  })
})
```

- [ ] **Step 4: Correr y verificar que falla**

Run: `npx vitest run tests/audit/analyze-html.test.ts`
Expected: FAIL con `Failed to resolve import "@/lib/audit/analyze-html"`.

- [ ] **Step 5: Implementar los chequeos**

Crear `lib/audit/analyze-html.ts`:

```ts
import { parse } from "node-html-parser"
import type { Check, Severity } from "@/lib/audit/types"

/** Hosts que cuentan como red social a la hora de detectar dependencia. */
const SOCIAL_HOSTS = ["instagram.com", "facebook.com", "fb.com", "tiktok.com"]

/** Esquemas y dominios que cuentan como contacto directo. */
const DIRECT_CONTACT = ["wa.me", "api.whatsapp.com", "web.whatsapp.com", "tel:", "mailto:"]

function check(
  id: Check["id"],
  passed: boolean,
  severity: Severity,
  label: string,
  detail: string,
  fixedBy: string
): Check {
  return { id, passed, severity, label, detail, fixedBy }
}

/**
 * Los ocho chequeos que se hacen sobre el HTML descargado.
 *
 * Son heurísticas deliberadamente conservadoras: es peor marcar un problema
 * que no existe que pasar uno por alto. El informe es un argumento de venta y
 * pierde todo su valor si el visitante detecta que exagera.
 *
 * `finalUrl` es la dirección después de seguir las redirecciones, que es la
 * que importa para saber si el sitio termina en https.
 */
export function analyzeHtml(html: string, finalUrl: string): Check[] {
  const root = parse(html || "", { comment: false })

  const isHttps = finalUrl.startsWith("https://")

  const viewport = root.querySelector('meta[name="viewport"]')?.getAttribute("content") ?? ""

  const title = root.querySelector("title")?.text.trim() ?? ""
  const titleOk = title.length >= 20 && title.length <= 70

  const description =
    root.querySelector('meta[name="description"]')?.getAttribute("content")?.trim() ?? ""
  const descriptionOk = description.length >= 50 && description.length <= 160

  const h1Count = root.querySelectorAll("h1").length

  const hrefs = root
    .querySelectorAll("a[href]")
    .map((a) => a.getAttribute("href") ?? "")
    .filter((href) => href.length > 0)

  const hasDirectContact = hrefs.some((href) => {
    const lower = href.toLowerCase()
    return DIRECT_CONTACT.some((needle) => lower.includes(needle))
  })

  const hasSocialLink = hrefs.some((href) => {
    const lower = href.toLowerCase()
    return SOCIAL_HOSTS.some((host) => lower.includes(host))
  })

  const images = root.querySelectorAll("img")
  // Una imagen decorativa lleva alt vacío a propósito, así que solo se cuenta
  // como falta la que no tiene el atributo.
  const withoutAlt = images.filter((img) => img.getAttribute("alt") === undefined).length
  const altOk = images.length === 0 || withoutAlt / images.length <= 0.2

  return [
    check(
      "https",
      isHttps,
      "alta",
      "Conexión segura",
      isHttps
        ? "Tu sitio usa https. El navegador no muestra advertencias."
        : "Tu sitio no usa https. Chrome muestra un aviso de «no seguro» que espanta visitas.",
      "Incluido en todos los planes"
    ),
    check(
      "viewport",
      viewport.length > 0,
      "alta",
      "Adaptado al celular",
      viewport.length > 0
        ? "La página se adapta al ancho del teléfono."
        : "La página no declara adaptación a pantallas chicas. En un celular se ve minúscula.",
      "Incluido en todos los planes"
    ),
    check(
      "title",
      titleOk,
      "media",
      "Título de la página",
      titleOk
        ? "El título tiene un largo adecuado para Google."
        : title.length === 0
          ? "La página no tiene título. Google no sabe cómo listarla."
          : `El título tiene ${title.length} caracteres. Lo aconsejable está entre 20 y 70.`,
      "SEO local"
    ),
    check(
      "description",
      descriptionOk,
      "media",
      "Descripción para Google",
      descriptionOk
        ? "La descripción tiene un largo adecuado."
        : description.length === 0
          ? "No hay descripción. Google inventa una con texto suelto de la página."
          : `La descripción tiene ${description.length} caracteres. Lo aconsejable está entre 50 y 160.`,
      "SEO local"
    ),
    check(
      "single-h1",
      h1Count === 1,
      "baja",
      "Un solo título principal",
      h1Count === 1
        ? "La página tiene un único título principal."
        : h1Count === 0
          ? "La página no tiene título principal, así que Google no sabe de qué trata."
          : `La página tiene ${h1Count} títulos principales. Debería tener uno solo.`,
      "SEO local"
    ),
    check(
      "direct-contact",
      hasDirectContact,
      "alta",
      "Contacto a un clic",
      hasDirectContact
        ? "Hay un enlace directo a WhatsApp, teléfono o correo."
        : "No encontramos forma de contactarte en un clic. El visitante interesado tiene que buscarte.",
      "Incluido en todos los planes"
    ),
    check(
      "image-alt",
      altOk,
      "baja",
      "Imágenes descritas",
      altOk
        ? "Las imágenes tienen texto alternativo."
        : `${withoutAlt} de ${images.length} imágenes no tienen texto alternativo. Google no puede leerlas.`,
      "SEO local"
    ),
    check(
      "social-only",
      !(hasSocialLink && !hasDirectContact),
      "media",
      "Independencia de las redes",
      hasSocialLink && !hasDirectContact
        ? "Tu única salida son las redes sociales. Si cambian de reglas o te bloquean la cuenta, perdés el canal."
        : "No dependés exclusivamente de las redes para que te contacten.",
      "Incluido en todos los planes"
    ),
  ]
}
```

- [ ] **Step 6: Correr las pruebas**

Run: `npx vitest run tests/audit/analyze-html.test.ts`
Expected: PASS, 15 pruebas.

- [ ] **Step 7: Commit**

```bash
git add lib/audit/analyze-html.ts tests/audit/ package.json package-lock.json
git commit -m "feat: chequeos de presencia digital sobre el HTML del sitio"
```

---

### Task 3: Puntaje e informe

**Files:**
- Create: `lib/audit/score.ts`
- Create: `lib/audit/social-report.ts`
- Create: `tests/audit/score.test.ts`

**Interfaces:**
- Consumes: `Check`, `PsiResult`, `AuditReport` de `lib/audit/types.ts`; `analyzeHtml` no se usa acá.
- Produces:
  ```ts
  export function scoreAudit(checks: Check[], psi: PsiResult | null): number
  export function buildReport(input: {
    url: string
    checks: Check[]
    psi: PsiResult | null
    notes?: string[]
  }): AuditReport
  export function mergePsi(report: AuditReport, psi: PsiResult | null): AuditReport

  // lib/audit/social-report.ts
  export function socialReport(url: string): AuditReport
  ```

**Fórmula.** Rendimiento 35 %, SEO 25 %, chequeos propios 40 %, cada chequeo con el mismo peso. Cuando PageSpeed no responde, los chequeos propios se renormalizan al 100 % y se agrega una nota. Se redondea a entero.

- [ ] **Step 1: Escribir las pruebas que fallan**

Crear `tests/audit/score.test.ts`:

```ts
import { describe, expect, it } from "vitest"
import { buildReport, mergePsi, scoreAudit } from "@/lib/audit/score"
import { socialReport } from "@/lib/audit/social-report"
import type { Check, PsiResult } from "@/lib/audit/types"

function checks(passedCount: number, total = 7): Check[] {
  return Array.from({ length: total }, (_, i) => ({
    id: "https" as const,
    passed: i < passedCount,
    severity: "media" as const,
    label: "x",
    detail: "y",
    fixedBy: "z",
  }))
}

const perfectPsi: PsiResult = {
  performance: 100,
  seo: 100,
  lcpMs: 900,
  lcpDisplay: "0,9 s",
}

describe("scoreAudit", () => {
  it("da 100 con todo aprobado y PageSpeed perfecto", () => {
    expect(scoreAudit(checks(7), perfectPsi)).toBe(100)
  })

  it("da 0 con todo desaprobado y PageSpeed en cero", () => {
    const zero: PsiResult = { performance: 0, seo: 0, lcpMs: null, lcpDisplay: null }
    expect(scoreAudit(checks(0), zero)).toBe(0)
  })

  it("pondera rendimiento 35, SEO 25 y chequeos 40", () => {
    // Rendimiento 100, SEO 0, chequeos todos aprobados: 35 + 0 + 40 = 75.
    const psi: PsiResult = { performance: 100, seo: 0, lcpMs: null, lcpDisplay: null }
    expect(scoreAudit(checks(7), psi)).toBe(75)
  })

  it("renormaliza a 100 cuando no hay PageSpeed", () => {
    expect(scoreAudit(checks(7), null)).toBe(100)
    expect(scoreAudit(checks(0), null)).toBe(0)
    // Cuatro de siete aprobados, sin PageSpeed: 4/7 * 100 = 57.
    expect(scoreAudit(checks(4), null)).toBe(57)
  })

  it("nunca sale del rango 0 a 100", () => {
    for (let passed = 0; passed <= 7; passed++) {
      const score = scoreAudit(checks(passed), perfectPsi)
      expect(score).toBeGreaterThanOrEqual(0)
      expect(score).toBeLessThanOrEqual(100)
    }
  })

  it("da 0 si no hay chequeos ni PageSpeed", () => {
    expect(scoreAudit([], null)).toBe(0)
  })
})

describe("buildReport", () => {
  it("arma un informe completo", () => {
    const report = buildReport({ url: "https://ejemplo.com", checks: checks(7), psi: perfectPsi })
    expect(report.kind).toBe("full")
    expect(report.total).toBe(100)
    expect(report.performance).toBe(100)
    expect(report.lcpDisplay).toBe("0,9 s")
    expect(report.notes).toHaveLength(0)
  })

  it("avisa cuando no pudo medir la velocidad", () => {
    const report = buildReport({ url: "https://ejemplo.com", checks: checks(7), psi: null })
    expect(report.performance).toBeNull()
    expect(report.notes.some((n) => n.includes("velocidad"))).toBe(true)
  })
})

describe("mergePsi", () => {
  it("suma los datos de velocidad y recalcula el puntaje", () => {
    const base = buildReport({ url: "https://ejemplo.com", checks: checks(7), psi: null })
    expect(base.total).toBe(100)

    const merged = mergePsi(base, { performance: 100, seo: 0, lcpMs: null, lcpDisplay: null })
    expect(merged.performance).toBe(100)
    expect(merged.seo).toBe(0)
    // 35 de rendimiento + 0 de SEO + 40 de chequeos.
    expect(merged.total).toBe(75)
  })

  it("quita la nota sobre la velocidad al llegar los datos", () => {
    const base = buildReport({ url: "https://ejemplo.com", checks: checks(7), psi: null })
    const merged = mergePsi(base, perfectPsi)
    expect(merged.notes.some((n) => n.includes("velocidad"))).toBe(false)
  })

  it("devuelve el informe intacto cuando PageSpeed no respondió", () => {
    const base = buildReport({ url: "https://ejemplo.com", checks: checks(7), psi: null })
    expect(mergePsi(base, null)).toEqual(base)
  })
})

describe("socialReport", () => {
  it("devuelve un informe de tipo social con puntaje bajo", () => {
    const report = socialReport("https://instagram.com/minegocio")
    expect(report.kind).toBe("social")
    expect(report.total).toBeLessThan(40)
    expect(report.checks.length).toBeGreaterThan(0)
    expect(report.checks.every((c) => !c.passed)).toBe(true)
  })

  it("no consulta rendimiento ni SEO", () => {
    const report = socialReport("https://instagram.com/minegocio")
    expect(report.performance).toBeNull()
    expect(report.seo).toBeNull()
  })
})
```

- [ ] **Step 2: Correr y verificar que falla**

Run: `npx vitest run tests/audit/score.test.ts`
Expected: FAIL por importaciones sin resolver.

- [ ] **Step 3: Implementar el puntaje**

Crear `lib/audit/score.ts`:

```ts
import type { AuditReport, Check, PsiResult } from "@/lib/audit/types"

const WEIGHT_PERFORMANCE = 35
const WEIGHT_SEO = 25
const WEIGHT_CHECKS = 40

/**
 * Puntaje general de 0 a 100.
 *
 * Cuando PageSpeed no responde, los chequeos propios se estiran para cubrir
 * el total: es preferible un puntaje calculado sobre menos información que
 * uno artificialmente bajo por una falla nuestra.
 */
export function scoreAudit(checks: Check[], psi: PsiResult | null): number {
  const checksRatio = checks.length === 0 ? 0 : checks.filter((c) => c.passed).length / checks.length

  if (!psi) {
    return Math.round(checksRatio * 100)
  }

  const total =
    (psi.performance / 100) * WEIGHT_PERFORMANCE +
    (psi.seo / 100) * WEIGHT_SEO +
    checksRatio * WEIGHT_CHECKS

  return Math.max(0, Math.min(100, Math.round(total)))
}

export function buildReport({
  url,
  checks,
  psi,
  notes = [],
}: {
  url: string
  checks: Check[]
  psi: PsiResult | null
  notes?: string[]
}): AuditReport {
  const allNotes = [...notes]
  if (!psi) {
    allNotes.push(
      "No pudimos medir la velocidad esta vez. El resto del informe está completo."
    )
  }

  return {
    kind: "full",
    url,
    total: scoreAudit(checks, psi),
    performance: psi?.performance ?? null,
    seo: psi?.seo ?? null,
    lcpDisplay: psi?.lcpDisplay ?? null,
    checks,
    notes: allNotes,
  }
}

/**
 * Completa un informe con los datos de velocidad que llegaron después.
 *
 * La ruta de API responde solo con los chequeos propios, porque PageSpeed
 * tarda más que el límite de una función de Netlify. El navegador consulta la
 * velocidad por su cuenta y llama a esto para recalcular el puntaje. Es una
 * función pura, así que corre igual en el servidor y en el cliente.
 */
export function mergePsi(report: AuditReport, psi: PsiResult | null): AuditReport {
  if (!psi) return report

  return {
    ...report,
    total: scoreAudit(report.checks, psi),
    performance: psi.performance,
    seo: psi.seo,
    lcpDisplay: psi.lcpDisplay,
    notes: report.notes.filter((note) => !note.includes("velocidad")),
  }
}
```

- [ ] **Step 4: Implementar el informe de redes**

Crear `lib/audit/social-report.ts`:

```ts
import type { AuditReport, Check } from "@/lib/audit/types"

/**
 * Informe para quien solo tiene redes sociales.
 *
 * No hace ninguna petición: las redes bloquean la lectura automática, y de
 * todas formas el diagnóstico no depende del contenido de la cuenta sino de
 * la ausencia de sitio propio. Es el caso más común entre los interesados.
 */
const SOCIAL_CHECKS: Check[] = [
  {
    id: "no-domain",
    passed: false,
    severity: "alta",
    label: "No tenés dirección propia",
    detail:
      "Tu negocio vive en una cuenta que no es tuya. Si cambian las reglas o te bloquean el acceso, perdés el canal y los contactos.",
    fixedBy: "Incluido en todos los planes",
  },
  {
    id: "invisible-google",
    passed: false,
    severity: "alta",
    label: "No aparecés en Google",
    detail:
      "Cuando alguien busca tu rubro en tu zona, tu perfil casi no aparece. Los que sí tienen sitio se quedan con esa consulta.",
    fixedBy: "SEO local",
  },
  {
    id: "price-in-dm",
    passed: false,
    severity: "alta",
    label: "El precio se pregunta por privado",
    detail:
      "Cada consulta arranca de cero por mensaje. Un catálogo con precios responde eso solo, las 24 horas.",
    fixedBy: "Tienda online o catálogo digital",
  },
  {
    id: "content-expires",
    passed: false,
    severity: "media",
    label: "Tu catálogo caduca",
    detail:
      "Las historias duran un día y las publicaciones quedan enterradas. Un producto que subiste hace un mes ya no lo encuentra nadie.",
    fixedBy: "Tienda online o catálogo digital",
  },
  {
    id: "low-trust",
    passed: false,
    severity: "media",
    label: "Cuesta más generar confianza",
    detail:
      "Sin ubicación, horarios ni una presentación formal, el cliente nuevo no sabe si sos un negocio establecido.",
    fixedBy: "Landing page o web institucional",
  },
]

export function socialReport(url: string): AuditReport {
  return {
    kind: "social",
    url,
    // Puntaje fijo: no se mide nada, y el número refleja la ausencia de sitio
    // propio, no una medición de la cuenta.
    total: 25,
    performance: null,
    seo: null,
    lcpDisplay: null,
    checks: SOCIAL_CHECKS,
    notes: [
      "Analizamos tu presencia en redes. Para medir velocidad y posicionamiento hace falta un sitio propio.",
    ],
  }
}
```

- [ ] **Step 5: Correr las pruebas**

Run: `npx vitest run tests/audit/score.test.ts`
Expected: PASS, 13 pruebas.

- [ ] **Step 6: Commit**

```bash
git add lib/audit/score.ts lib/audit/social-report.ts tests/audit/score.test.ts
git commit -m "feat: puntaje ponderado e informe para cuentas sin sitio propio"
```

---

### Task 4: Descarga del sitio y consulta a PageSpeed

**Files:**
- Create: `lib/audit/fetch-site.ts`
- Create: `lib/audit/pagespeed.ts`

**Interfaces:**
- Consumes: `assertPublicHost` de `lib/audit/validate-url.ts`; `PsiResult` de `lib/audit/types.ts`.
- Produces:
  ```ts
  // lib/audit/fetch-site.ts
  export type FetchedSite = { html: string; finalUrl: string }
  export async function fetchSite(url: URL, timeoutMs?: number): Promise<FetchedSite>

  // lib/audit/pagespeed.ts
  export async function fetchPageSpeed(url: string, timeoutMs?: number): Promise<PsiResult | null>
  ```
  `fetchSite` lanza con un mensaje en español si no puede completar. `fetchPageSpeed` nunca lanza: devuelve `null`.

**Dónde corre cada uno.** `fetchSite` es de servidor: hace la petición al sitio auditado y no puede exponerse al navegador, que además no podría leer la respuesta de otro dominio. `fetchPageSpeed` es lo contrario: corre en el navegador, porque PageSpeed tarda más que el límite de 10 segundos de una función de Netlify. Por eso lee `NEXT_PUBLIC_PSI_API_KEY` y no una variable de servidor.

**Nota sobre las pruebas.** Estos dos módulos hacen peticiones de red, así que no llevan pruebas unitarias: se verifican con la prueba de integración de la Task 6 contra sitios del propio portfolio. La lógica que sí se puede probar sin red ya vive en `validate-url.ts` y `score.ts`.

- [ ] **Step 1: Implementar la descarga**

Crear `lib/audit/fetch-site.ts`:

```ts
import { assertPublicHost } from "@/lib/audit/validate-url"

/** Límite de cuerpo. Un HTML honesto nunca pesa más que esto. */
const MAX_BYTES = 1_000_000

const MAX_REDIRECTS = 3

const USER_AGENT =
  "LuckyStudioAudit/1.0 (+https://luckystudio.com/auditoria; auditoría solicitada por el visitante)"

export type FetchedSite = { html: string; finalUrl: string }

/**
 * Descarga el HTML de un sitio para analizarlo.
 *
 * Es el único punto del proyecto que pide a una dirección elegida por un
 * desconocido, así que concentra las tres defensas: se validan los destinos
 * en cada salto, se siguen las redirecciones a mano para poder validarlas, y
 * se corta la lectura al llegar al límite de bytes.
 */
export async function fetchSite(url: URL, timeoutMs = 8000): Promise<FetchedSite> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    let current = url

    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
      await assertPublicHost(current.hostname)

      const response = await fetch(current, {
        redirect: "manual",
        signal: controller.signal,
        headers: {
          "User-Agent": USER_AGENT,
          Accept: "text/html,application/xhtml+xml",
          "Accept-Language": "es-AR,es;q=0.9",
        },
      })

      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get("location")
        if (!location) throw new Error("El sitio redirige a un lugar que no pudimos seguir.")
        // Se resuelve contra la actual para admitir rutas relativas, y se
        // vuelve a validar en la próxima vuelta del bucle.
        current = new URL(location, current)
        if (current.protocol !== "http:" && current.protocol !== "https:") {
          throw new Error("El sitio redirige a una dirección que no podemos revisar.")
        }
        continue
      }

      if (!response.ok) {
        throw new Error(`El sitio respondió con un error (${response.status}).`)
      }

      const contentType = response.headers.get("content-type") ?? ""
      if (!contentType.includes("html")) {
        throw new Error("Esa dirección no devuelve una página web.")
      }

      const html = await readLimited(response, MAX_BYTES)
      return { html, finalUrl: current.toString() }
    }

    throw new Error("El sitio tiene demasiadas redirecciones.")
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error("El sitio tardó demasiado en responder.")
      }
      if (error.message === "destino no permitido") {
        throw new Error("Esa dirección no es pública, así que no podemos revisarla.")
      }
      if (error.message === "no se pudo resolver el dominio") {
        throw new Error("No encontramos ese dominio. Revisá que esté bien escrito.")
      }
      throw error
    }
    throw new Error("No pudimos abrir ese sitio.")
  } finally {
    clearTimeout(timer)
  }
}

/** Lee el cuerpo hasta el límite y descarta el resto. */
async function readLimited(response: Response, maxBytes: number): Promise<string> {
  const reader = response.body?.getReader()
  if (!reader) return ""

  const chunks: Uint8Array[] = []
  let received = 0

  while (received < maxBytes) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value)
    received += value.length
  }
  await reader.cancel().catch(() => {})

  const buffer = new Uint8Array(received)
  let offset = 0
  for (const chunk of chunks) {
    const remaining = received - offset
    const slice = chunk.length > remaining ? chunk.subarray(0, remaining) : chunk
    buffer.set(slice, offset)
    offset += slice.length
  }

  return new TextDecoder("utf-8", { fatal: false }).decode(buffer)
}
```

- [ ] **Step 2: Implementar la consulta a PageSpeed**

Crear `lib/audit/pagespeed.ts`:

```ts
import type { PsiResult } from "@/lib/audit/types"

const ENDPOINT = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed"

/**
 * Consulta PageSpeed Insights para la vista de celular.
 *
 * Corre en el navegador. PageSpeed tarda habitualmente entre 15 y 40 segundos
 * y una función de Netlify se corta a los 10, así que desde el servidor esta
 * consulta fallaría siempre. El navegador no tiene ese límite.
 *
 * La clave viaja al cliente y por eso debe estar restringida por referente
 * HTTP al dominio del sitio en Google Cloud. Es de solo lectura sobre datos
 * públicos y con cuota propia.
 *
 * Nunca lanza: si Google falla, tarda de más o rechaza la petición, devuelve
 * null y el informe se queda con los chequeos propios y una nota. Un problema
 * de Google no puede dejar al visitante sin diagnóstico.
 */
export async function fetchPageSpeed(url: string, timeoutMs = 45000): Promise<PsiResult | null> {
  const key = process.env.NEXT_PUBLIC_PSI_API_KEY
  if (!key) return null

  const params = new URLSearchParams({ url, strategy: "mobile", key })
  params.append("category", "performance")
  params.append("category", "seo")

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(`${ENDPOINT}?${params.toString()}`, {
      signal: controller.signal,
    })
    if (!response.ok) return null

    const data = (await response.json()) as {
      lighthouseResult?: {
        categories?: {
          performance?: { score?: number | null }
          seo?: { score?: number | null }
        }
        audits?: {
          "largest-contentful-paint"?: { numericValue?: number; displayValue?: string }
        }
        runtimeError?: { code?: string }
      }
    }

    const result = data.lighthouseResult
    if (!result || result.runtimeError?.code) return null

    const performance = result.categories?.performance?.score
    const seo = result.categories?.seo?.score
    if (typeof performance !== "number" || typeof seo !== "number") return null

    const lcp = result.audits?.["largest-contentful-paint"]

    return {
      // Lighthouse devuelve de 0 a 1.
      performance: Math.round(performance * 100),
      seo: Math.round(seo * 100),
      lcpMs: typeof lcp?.numericValue === "number" ? Math.round(lcp.numericValue) : null,
      lcpDisplay: lcp?.displayValue ?? null,
    }
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}
```

- [ ] **Step 3: Verificar tipos**

Run: `npm run typecheck`
Expected: sin errores.

- [ ] **Step 4: Commit**

```bash
git add lib/audit/fetch-site.ts lib/audit/pagespeed.ts
git commit -m "feat: descarga defensiva del sitio y consulta a PageSpeed Insights"
```

---

### Task 5: Caché y límite por dirección IP

**Files:**
- Create: `lib/audit/store.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: `AuditReport` de `lib/audit/types.ts`.
- Produces:
  ```ts
  export async function readCachedReport(key: string): Promise<AuditReport | null>
  export async function writeCachedReport(key: string, report: AuditReport): Promise<void>
  export async function consumeQuota(ip: string): Promise<boolean>
  export function cacheKey(url: URL): string
  ```
  `consumeQuota` devuelve `false` cuando la IP superó el límite.

**Diseño.** Netlify Blobs es el almacenamiento del entorno donde corre el sitio. Pero en `next dev`, en las pruebas y en cualquier build local no está configurado. El adaptador intenta usarlo y, si no está disponible, cae a un mapa en memoria. En producción hay persistencia real; en desarrollo el módulo funciona igual sin ceremonia.

- [ ] **Step 1: Instalar la dependencia**

```bash
npm install @netlify/blobs
```

- [ ] **Step 2: Implementar el adaptador**

Crear `lib/audit/store.ts`:

```ts
import type { AuditReport } from "@/lib/audit/types"

const CACHE_TTL_MS = 24 * 60 * 60 * 1000
const QUOTA_WINDOW_MS = 60 * 60 * 1000
const QUOTA_LIMIT = 10

type Entry<T> = { value: T; expiresAt: number }

/**
 * Reserva en memoria.
 *
 * En Netlify las funciones se reutilizan entre peticiones, así que el mapa
 * sobrevive a varias llamadas seguidas, pero no entre instancias. Es una
 * degradación aceptable: el freno real contra el abuso es la cuota de la
 * clave de PageSpeed, y esto solo evita la ráfaga obvia.
 */
const memory = new Map<string, Entry<unknown>>()

function memoryGet<T>(key: string): T | null {
  const entry = memory.get(key)
  if (!entry) return null
  if (entry.expiresAt < Date.now()) {
    memory.delete(key)
    return null
  }
  return entry.value as T
}

function memorySet<T>(key: string, value: T, ttlMs: number): void {
  memory.set(key, { value, expiresAt: Date.now() + ttlMs })
}

/**
 * Devuelve el almacén de Netlify si el entorno lo tiene configurado.
 *
 * La importación es dinámica para que un entorno sin blobs no arrastre el
 * módulo, y el error se traga a propósito: la falta de almacenamiento nunca
 * puede impedir una auditoría.
 */
async function blobStore() {
  try {
    const { getStore } = await import("@netlify/blobs")
    return getStore({ name: "auditoria", consistency: "eventual" })
  } catch {
    return null
  }
}

/** Clave estable para la caché: host y ruta, sin parámetros ni ancla. */
export function cacheKey(url: URL): string {
  const host = url.hostname.toLowerCase().replace(/^www\./, "")
  const path = url.pathname.replace(/\/$/, "")
  return `report:${host}${path}`.slice(0, 300)
}

export async function readCachedReport(key: string): Promise<AuditReport | null> {
  const store = await blobStore()
  if (store) {
    try {
      const entry = (await store.get(key, { type: "json" })) as Entry<AuditReport> | null
      if (entry && entry.expiresAt > Date.now()) return entry.value
      return null
    } catch {
      return null
    }
  }
  return memoryGet<AuditReport>(key)
}

export async function writeCachedReport(key: string, report: AuditReport): Promise<void> {
  const entry: Entry<AuditReport> = { value: report, expiresAt: Date.now() + CACHE_TTL_MS }
  const store = await blobStore()
  if (store) {
    try {
      await store.setJSON(key, entry)
      return
    } catch {
      // Cae a memoria.
    }
  }
  memorySet(key, report, CACHE_TTL_MS)
}

/**
 * Descuenta una auditoría del cupo de la IP.
 *
 * Devuelve false cuando ya gastó las diez de la hora. La ventana es fija, no
 * deslizante: es más simple y para este caso alcanza.
 */
export async function consumeQuota(ip: string): Promise<boolean> {
  const windowStart = Math.floor(Date.now() / QUOTA_WINDOW_MS) * QUOTA_WINDOW_MS
  const key = `quota:${ip}:${windowStart}`

  const store = await blobStore()
  if (store) {
    try {
      const current = ((await store.get(key, { type: "json" })) as { count?: number } | null) ?? {}
      const count = typeof current.count === "number" ? current.count : 0
      if (count >= QUOTA_LIMIT) return false
      await store.setJSON(key, { count: count + 1 })
      return true
    } catch {
      // Cae a memoria.
    }
  }

  const count = memoryGet<number>(key) ?? 0
  if (count >= QUOTA_LIMIT) return false
  memorySet(key, count + 1, QUOTA_WINDOW_MS)
  return true
}
```

- [ ] **Step 3: Verificar tipos**

Run: `npm run typecheck`
Expected: sin errores.

- [ ] **Step 4: Commit**

```bash
git add lib/audit/store.ts package.json package-lock.json
git commit -m "feat: caché de informes y límite por IP con reserva en memoria"
```

---

### Task 6: Ruta de API

**Files:**
- Create: `app/api/auditoria/route.ts`

**Interfaces:**
- Consumes: todo lo anterior de `lib/audit/`.
- Produces: `POST /api/auditoria` que recibe `{ url: string, website?: string }` y responde `AuditReport` o `{ error: string }`.

**Contrato.**

| Situación | Código | Cuerpo |
|-----------|--------|--------|
| Informe listo | 200 | `AuditReport` |
| Campo trampa con valor | 200 | Informe de redes vacío, sin trabajo real |
| URL inválida | 400 | `{ error }` con el motivo en español |
| Cupo agotado | 429 | `{ error }` |
| Fallo al abrir el sitio | 502 | `{ error }` |
| Cualquier otro fallo | 500 | `{ error }` genérico |

- [ ] **Step 1: Implementar la ruta**

```ts
import { NextResponse } from "next/server"
import { analyzeHtml } from "@/lib/audit/analyze-html"
import { fetchSite } from "@/lib/audit/fetch-site"
import { buildReport } from "@/lib/audit/score"
import { socialReport } from "@/lib/audit/social-report"
import { cacheKey, consumeQuota, readCachedReport, writeCachedReport } from "@/lib/audit/store"
import { validateAuditUrl } from "@/lib/audit/validate-url"

/** Hace peticiones salientes y depende de la IP: nunca se cachea la respuesta. */
export const dynamic = "force-dynamic"
export const runtime = "nodejs"

/**
 * Techo de la ruta, por debajo del límite de 10 segundos de una función de
 * Netlify. La velocidad la mide el navegador aparte, así que acá solo hay que
 * darle margen a la descarga del HTML.
 */
const TOTAL_TIMEOUT_MS = 9_000

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-nf-client-connection-ip")
  if (forwarded) return forwarded
  const xff = request.headers.get("x-forwarded-for")
  if (xff) return xff.split(",")[0].trim()
  return "desconocida"
}

export async function POST(request: Request) {
  let body: { url?: unknown; website?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "No pudimos leer la solicitud." }, { status: 400 })
  }

  // Campo trampa: un formulario real lo deja vacío porque está oculto.
  // Se responde 200 con un informe vacío para no darle señal al bot.
  if (typeof body.website === "string" && body.website.length > 0) {
    return NextResponse.json(socialReport(""))
  }

  if (typeof body.url !== "string") {
    return NextResponse.json({ error: "Falta la dirección a revisar." }, { status: 400 })
  }

  const validation = validateAuditUrl(body.url)
  if (!validation.ok) {
    return NextResponse.json({ error: validation.reason }, { status: 400 })
  }

  const { url, kind } = validation

  // El informe de redes no consume cupo ni caché: no hace ningún trabajo.
  if (kind === "social") {
    return NextResponse.json(socialReport(url.toString()))
  }

  const key = cacheKey(url)
  const cached = await readCachedReport(key)
  if (cached) return NextResponse.json(cached)

  const allowed = await consumeQuota(clientIp(request))
  if (!allowed) {
    return NextResponse.json(
      {
        error:
          "Hiciste varias auditorías seguidas. Probá de nuevo en un rato, o escribinos por WhatsApp y lo vemos juntos.",
      },
      { status: 429 }
    )
  }

  try {
    const report = await withTimeout(runAudit(url), TOTAL_TIMEOUT_MS)
    await writeCachedReport(key, report)
    return NextResponse.json(report)
  } catch (error) {
    const message =
      error instanceof Error && error.message.length > 0
        ? error.message
        : "No pudimos revisar ese sitio."
    // 502 porque el fallo es del sitio de destino, no de esta función.
    return NextResponse.json({ error: message }, { status: 502 })
  }
}

async function runAudit(url: URL) {
  const site = await fetchSite(url)
  const checks = analyzeHtml(site.html, site.finalUrl)
  // Sin datos de velocidad: los pide el navegador y los suma después.
  return buildReport({ url: site.finalUrl, checks, psi: null })
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("La revisión tardó demasiado. Probá de nuevo.")), ms)
    ),
  ])
}
```

- [ ] **Step 2: Probar contra un sitio del portfolio**

Levantar `npm run dev` y en otra terminal:

```bash
curl -s -X POST http://localhost:3000/api/auditoria \
  -H "Content-Type: application/json" \
  -d '{"url":"importadostafi.com"}' | node -e "
let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{
  const r=JSON.parse(s);
  console.log('kind:',r.kind,'total:',r.total);
  console.log('performance:',r.performance,'seo:',r.seo);
  for(const c of r.checks||[]) console.log(c.passed?'OK ':'-- ',c.id,'|',c.label);
  console.log('notas:',r.notes);
});"
```

Expected: `kind: full`, puntaje calculado sobre los chequeos propios, los ocho chequeos listados, `direct-contact` aprobado. `performance` y `seo` en `null`: esta ruta nunca los devuelve, los suma el navegador.

Comprobar además que la respuesta llega en menos de 9 segundos, que es el techo de la ruta.

- [ ] **Step 3: Probar el caso de redes**

```bash
curl -s -X POST http://localhost:3000/api/auditoria \
  -H "Content-Type: application/json" \
  -d '{"url":"instagram.com/germanreynoso16"}'
```

Expected: `"kind":"social"`, `"total":25`, cinco chequeos, ninguna petición saliente.

- [ ] **Step 4: Probar los rechazos**

```bash
# Destino interno.
curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:3000/api/auditoria \
  -H "Content-Type: application/json" -d '{"url":"http://127.0.0.1:3000"}'
# Esperado: 400

# Esquema no permitido.
curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:3000/api/auditoria \
  -H "Content-Type: application/json" -d '{"url":"file:///etc/passwd"}'
# Esperado: 400

# Campo trampa.
curl -s -X POST http://localhost:3000/api/auditoria \
  -H "Content-Type: application/json" -d '{"url":"importadostafi.com","website":"bot"}'
# Esperado: 200 con kind social y url vacía, sin tocar el sitio.
```

- [ ] **Step 5: Probar el límite de cupo**

Hacer once peticiones seguidas con URLs distintas (para que la caché no las absorba) y comprobar que la undécima responde 429.

```bash
for i in $(seq 1 11); do
  curl -s -o /dev/null -w "$i: %{http_code}\n" -X POST http://localhost:3000/api/auditoria \
    -H "Content-Type: application/json" -d "{\"url\":\"ejemplo$i.com\"}"
done
```

Expected: las primeras diez devuelven 400 o 502 (los dominios no existen, pero consumen cupo), la undécima devuelve 429.

**Atención:** si el cupo se consume antes de validar, un dominio inválido gasta cupo. Comprobar en el código que `consumeQuota` se llama **después** de `validateAuditUrl` y de la caché, como está escrito arriba. Si la prueba muestra 429 antes de la undécima, el orden está mal.

- [ ] **Step 6: Commit**

```bash
git add app/api/auditoria/route.ts
git commit -m "feat: ruta de API de la auditoría con caché y cupo por IP"
```

---

### Task 7: Página de la auditoría

**Files:**
- Create: `components/audit-form.tsx`
- Create: `app/auditoria/page.tsx`

**Interfaces:**
- Consumes: `AuditReport`, `PsiResult` de `lib/audit/types.ts`; `mergePsi` de `lib/audit/score.ts`; `fetchPageSpeed` de `lib/audit/pagespeed.ts`; `ContactLink`; `CountUp`; `SiteChrome`; `Footer`.
- Produces: la ruta `/auditoria`.

**El informe llega en dos etapas.** Primero la ruta de API devuelve los chequeos propios, en menos de nueve segundos, y el informe se muestra enseguida. En paralelo el navegador consulta PageSpeed, que puede tardar bastante más, y cuando responde se recalcula el puntaje con `mergePsi`. El visitante nunca se queda mirando una pantalla vacía esperando a Google, y si Google no responde el informe ya está completo salvo por la velocidad.

- [ ] **Step 1: Crear el formulario y el informe**

Crear `components/audit-form.tsx`:

```tsx
"use client"

import { useState } from "react"
import { AlertTriangle, Check, Loader2, Search } from "lucide-react"
import { ContactLink } from "@/components/contact-link"
import { CountUp } from "@/components/count-up"
import { fetchPageSpeed } from "@/lib/audit/pagespeed"
import { mergePsi } from "@/lib/audit/score"
import type { AuditReport, Severity } from "@/lib/audit/types"
import { cn } from "@/lib/utils"

const SEVERITY_LABEL: Record<Severity, string> = {
  alta: "Importante",
  media: "Conviene arreglarlo",
  baja: "Detalle",
}

function scoreTone(total: number): string {
  if (total >= 80) return "text-green-400"
  if (total >= 50) return "text-primary"
  return "text-destructive"
}

export function AuditForm() {
  const [value, setValue] = useState("")
  const [honeypot, setHoneypot] = useState("")
  const [loading, setLoading] = useState(false)
  /** Segunda etapa: los chequeos ya están, falta la velocidad. */
  const [measuringSpeed, setMeasuringSpeed] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [report, setReport] = useState<AuditReport | null>(null)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setReport(null)

    let base: AuditReport
    try {
      const response = await fetch("/api/auditoria", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: value, website: honeypot }),
      })
      const data = await response.json()

      if (!response.ok) {
        setError(typeof data.error === "string" ? data.error : "No pudimos revisar ese sitio.")
        return
      }
      base = data as AuditReport
      setReport(base)
    } catch {
      setError("Se cortó la conexión. Probá de nuevo en un momento.")
      return
    } finally {
      setLoading(false)
    }

    // Las cuentas sin sitio propio no tienen velocidad que medir.
    if (base.kind === "social") return

    // Segunda etapa. Que falle no invalida nada de lo ya mostrado.
    setMeasuringSpeed(true)
    const psi = await fetchPageSpeed(base.url)
    setReport((current) => (current ? mergePsi(current, psi) : current))
    setMeasuringSpeed(false)
  }

  const failed = report?.checks.filter((c) => !c.passed) ?? []
  const passed = report?.checks.filter((c) => c.passed) ?? []

  return (
    <div>
      <form onSubmit={handleSubmit} className="mx-auto flex max-w-xl flex-col gap-3 sm:flex-row">
        <label htmlFor="audit-url" className="sr-only">
          Dirección de tu web o de tu Instagram
        </label>
        <input
          id="audit-url"
          type="text"
          inputMode="url"
          autoComplete="url"
          required
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="minegocio.com o instagram.com/minegocio"
          className="flex-1 rounded-xl border border-border bg-card px-4 py-3.5 text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        />

        {/* Trampa para bots. Un visitante nunca la ve ni la puede tabular. */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          className="pointer-events-none absolute h-0 w-0 opacity-0"
        />

        <button
          type="submit"
          disabled={loading}
          className="glow-gold inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
          ) : (
            <Search className="h-5 w-5" aria-hidden />
          )}
          {loading ? "Revisando..." : "Auditar gratis"}
        </button>
      </form>

      <p aria-live="polite" className="mt-4 text-center text-sm text-muted-foreground">
        {loading && "Estamos revisando el sitio."}
        {measuringSpeed && "Midiendo la velocidad en celular. Esto puede tardar un poco más."}
        {error && (
          <span className="inline-flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-4 w-4" aria-hidden />
            {error}
          </span>
        )}
      </p>

      {report && (
        <section aria-label="Resultado de la auditoría" className="mt-14">
          <div className="rounded-2xl border border-border bg-card/40 p-8 text-center">
            <p className="text-sm uppercase tracking-widest text-muted-foreground">
              Puntaje general
            </p>
            <p className={cn("mt-2 text-6xl font-bold tracking-tight", scoreTone(report.total))}>
              <CountUp value={report.total} suffix="/100" />
            </p>

            {(report.performance !== null || report.seo !== null) && (
              <dl className="mt-8 grid gap-6 sm:grid-cols-3">
                {report.performance !== null && (
                  <div>
                    <dt className="text-sm text-muted-foreground">Velocidad en celular</dt>
                    <dd className="mt-1 text-2xl font-bold text-foreground">
                      <CountUp value={report.performance} suffix="/100" />
                    </dd>
                  </div>
                )}
                {report.seo !== null && (
                  <div>
                    <dt className="text-sm text-muted-foreground">Posicionamiento</dt>
                    <dd className="mt-1 text-2xl font-bold text-foreground">
                      <CountUp value={report.seo} suffix="/100" />
                    </dd>
                  </div>
                )}
                {report.lcpDisplay && (
                  <div>
                    <dt className="text-sm text-muted-foreground">Tarda en mostrarse</dt>
                    <dd className="mt-1 text-2xl font-bold text-foreground">{report.lcpDisplay}</dd>
                  </div>
                )}
              </dl>
            )}

            {measuringSpeed && (
              <p className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Midiendo la velocidad en celular...
              </p>
            )}

            {!measuringSpeed &&
              report.notes.map((note) => (
                <p key={note} className="mt-4 text-sm text-muted-foreground">
                  {note}
                </p>
              ))}
          </div>

          {failed.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-foreground">
                Qué conviene resolver ({failed.length})
              </h2>
              <ul className="mt-4 space-y-3">
                {failed.map((item) => (
                  <li
                    key={`${item.id}-${item.label}`}
                    className="rounded-2xl border border-border bg-card/40 p-5"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-foreground">{item.label}</h3>
                      <span className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
                        {SEVERITY_LABEL[item.severity]}
                      </span>
                    </div>
                    <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
                      {item.detail}
                    </p>
                    <p className="mt-2 text-sm text-primary">Lo resolvemos con: {item.fixedBy}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {passed.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-foreground">Lo que ya está bien</h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {passed.map((item) => (
                  <li
                    key={`${item.id}-${item.label}`}
                    className="flex items-start gap-2.5 rounded-xl border border-border px-4 py-3 text-sm"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                    <span className="text-muted-foreground">{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-10 rounded-2xl border border-primary/25 bg-card p-8 text-center">
            <p className="text-pretty text-lg text-foreground">
              {failed.length === 0
                ? "Tu sitio está en buena forma. Si querés llevarlo un paso más, charlemos."
                : `Encontramos ${failed.length} ${failed.length === 1 ? "punto" : "puntos"} para mejorar. Los resolvemos todos.`}
            </p>
            <ContactLink
              channel="whatsapp"
              source="audit"
              message={`Hola! Audité ${report.url} y saqué ${report.total}/100. Quiero mejorar estos puntos.`}
              className="glow-gold mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Quiero resolverlo
            </ContactLink>
          </div>
        </section>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Crear la página**

Crear `app/auditoria/page.tsx`:

```tsx
import type { Metadata } from "next"
import { AuditForm } from "@/components/audit-form"
import { Footer } from "@/components/footer"
import { SiteChrome } from "@/components/site-chrome"
import { SITE } from "@/lib/site-config"

const TITLE = "Auditá gratis la presencia digital de tu negocio"
const DESCRIPTION =
  "Pegá la dirección de tu web o de tu Instagram y te decimos en segundos qué está bien y qué conviene resolver. Sin registro y sin costo."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/auditoria" },
  openGraph: {
    type: "website",
    url: `${SITE.url}/auditoria`,
    title: `${TITLE} | ${SITE.name}`,
    description: DESCRIPTION,
  },
}

export default function AuditoriaPage() {
  return (
    <>
      <SiteChrome />
      <main className="min-h-screen">
        <section className="mx-auto max-w-4xl px-4 pb-24 pt-28 sm:px-6 md:pt-32 lg:px-8">
          <div className="text-center">
            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
              Auditá gratis la presencia digital de{" "}
              <span className="text-gradient">tu negocio</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
              {DESCRIPTION}
            </p>
          </div>

          <div className="mt-12">
            <AuditForm />
          </div>

          <p className="mt-12 text-center text-sm text-muted-foreground">
            No guardamos la dirección que analizás ni te pedimos datos. El informe se calcula en el
            momento y se muestra acá.
          </p>
        </section>
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 3: Verificar**

Run: `npm run typecheck && npm run build`

Abrir `http://localhost:3000/auditoria` y comprobar con un sitio del portfolio, en este orden:

1. El botón muestra el estado de carga.
2. En menos de nueve segundos aparece el informe con los ocho chequeos, separados en "qué conviene resolver" y "lo que ya está bien".
3. Si hay `NEXT_PUBLIC_PSI_API_KEY` configurada, debajo del puntaje aparece "Midiendo la velocidad en celular" y al rato se suman las tres métricas y el puntaje se recalcula.
4. Sin clave configurada, la segunda etapa termina enseguida sin cambiar nada y queda la nota sobre la velocidad.
5. El botón final abre WhatsApp con la dirección y el puntaje en el mensaje.

Probar con `instagram.com/germanreynoso16` y comprobar que devuelve el informe de redes al instante.

Probar con `sitioquenoexiste-12345.com` y comprobar que aparece el mensaje de error en rojo, no una pantalla rota.

- [ ] **Step 4: Verificar la accesibilidad**

Con el teclado solamente: tabular hasta el campo, escribir, enviar con Enter. Comprobar que el foco es visible en el campo y en el botón, y que el campo trampa **no** recibe foco al tabular.

Comprobar con un lector de pantalla o con el inspector que el párrafo de estado tiene `aria-live="polite"` y anuncia tanto "Estamos revisando el sitio" como el mensaje de error.

- [ ] **Step 5: Commit**

```bash
git add components/audit-form.tsx app/auditoria/
git commit -m "feat: página de auditoría gratuita de presencia digital"
```

---

### Task 8: Enlaces de entrada y verificación final

**Files:**
- Modify: `lib/site-config.ts`
- Modify: `components/navbar.tsx`
- Modify: `components/problem-solution-section.tsx`
- Modify: `app/sitemap.ts`

- [ ] **Step 1: Agregar el enlace destacado al navbar**

`NAV_LINKS` contiene anclas a secciones de la home y lo consume también el footer, así que la auditoría **no** entra ahí: es una ruta, no una sección. En `components/navbar.tsx`, agregar un enlace propio junto al botón de WhatsApp, con estilo distinto para que se lea como acción:

```tsx
          <Link
            href="/auditoria"
            className="hidden items-center gap-2 rounded-xl border border-primary/40 px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 lg:inline-flex"
          >
            <Search className="h-4 w-4" aria-hidden />
            Auditoría gratis
          </Link>
```

Y otro en el menú móvil, arriba del botón de WhatsApp, con `onClick={() => handleOpenChange(false)}`.

Agregar los imports de `Link` y del icono `Search`.

- [ ] **Step 2: Agregar el enlace en Problema y solución**

Al final de `components/problem-solution-section.tsx`, después de la grilla de dos columnas:

```tsx
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          variants={fadeUp}
          className="mt-10 text-center text-muted-foreground"
        >
          ¿No sabés en qué punto estás?{" "}
          <Link
            href="/auditoria"
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            Auditá tu web o tu Instagram gratis
          </Link>
          .
        </motion.p>
```

- [ ] **Step 3: Sumar la ruta al sitemap**

En `app/sitemap.ts`, agregar después de la entrada de hospedajes:

```ts
    {
      url: `${SITE.url}/auditoria`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
```

- [ ] **Step 4: Verificación completa de la fase**

Run: `npm test && npm run typecheck && npm run build`
Expected: 56 pruebas en verde entre los cinco archivos (5 + 9 + 14 + 15 + 13), sin errores de tipos, build exitoso con trece rutas más la de API.

Comprobaciones de la spec:

```bash
# La lógica de auditoría no toca componentes.
grep -rn "from \"@/components" lib/audit/
# Esperado: cero resultados.

# El único módulo que hace peticiones salientes al sitio auditado.
grep -rln "fetch(" lib/audit/
# Esperado: solo fetch-site.ts y pagespeed.ts.
```

- [ ] **Step 5: Verificación visual**

Con Playwright a 375, 768 y 1440 px sobre `/auditoria`, antes y después de correr una auditoría:

- Sin desborde horizontal.
- Sin errores de consola ni avisos de hidratación.
- Contraste AA en todos los nodos de texto, incluidos los colores del puntaje.
- Con `prefers-reduced-motion: reduce`, el puntaje muestra el número final sin contar y el ícono de carga no gira.

- [ ] **Step 6: Configurar la clave en producción**

En Google Cloud, crear una clave de la API de PageSpeed Insights y **restringirla por referente HTTP** al dominio del sitio. La clave llega al navegador, así que sin esa restricción cualquiera puede gastar la cuota.

En el panel de Netlify, agregar la variable `NEXT_PUBLIC_PSI_API_KEY` con esa clave. Sin ella el informe sale sin datos de velocidad, que es una degradación aceptable pero visible.

Verificar después del despliegue que una auditoría real completa las tres métricas de velocidad, y que la petición a `googleapis.com` sale desde el navegador y no desde la función.

- [ ] **Step 7: Commit y subida**

```bash
git add lib/site-config.ts components/navbar.tsx components/problem-solution-section.tsx app/sitemap.ts
git commit -m "feat: enlaces de entrada a la auditoría desde el navbar y la home"
git push origin main
```

---

## Verificación de cobertura contra la spec

| Requisito de la spec | Tarea |
|----------------------|-------|
| 7.2 Página con campo, botón y campo trampa | Task 7 |
| 7.2 `POST /api/auditoria` con despacho por tipo de host | Task 6 |
| 7.2 Informe con puntaje, áreas, hallazgos y CTA con la URL | Task 7 |
| 7.3 Descarga con agente identificado, 8 s, 1 MB, 3 redirecciones | Task 4 |
| 7.3 Los ocho chequeos sobre el HTML | Task 2 |
| 7.3 PageSpeed móvil con rendimiento, SEO y LCP | Tasks 4 y 7 |
| 7.3 Tolerancia al fallo de PageSpeed con nota | Tasks 3, 4 y 7 |
| 7.3 Puntaje 35 / 25 / 40 | Task 3 |
| 7.4 Informe fijo para redes, sin peticiones | Task 3 |
| 7.5 Solo http y https, bloqueo de direcciones internas | Task 1 |
| 7.5 Revalidación después de cada redirección | Task 4 |
| 7.5 Límite de 10 por hora por IP | Tasks 5 y 6 |
| 7.5 Caché por URL normalizada, 24 horas | Tasks 5 y 6 |
| 7.5 Campo trampa que responde 200 sin trabajar | Tasks 6 y 7 |
| 7.5 No se guardan prospectos | Task 5 |
| 7.7 Enlaces desde el navbar y desde Problema y solución | Task 8 |
| 7.8 Pruebas unitarias y de integración | Tasks 1, 2, 3, 6 |

**Desviación consciente respecto de la spec.** La spec (7.3) describe una única llamada que hace los chequeos y consulta PageSpeed dentro de un techo de 20 segundos. No es viable: Netlify corta las funciones sincrónicas a los 10 segundos y PageSpeed tarda habitualmente entre 15 y 40, así que esa ruta se cortaría siempre en producción. La auditoría se parte en dos etapas, con los chequeos en el servidor y la velocidad en el navegador. El resultado que ve el visitante es el mismo, y además aparece antes.

**Segunda desviación.** El punto 7.6 pide un evento `audit_run` con el tipo y el puntaje. No entra en este plan: `trackContact` cubre el clic de contacto con `source="audit"`, que es la conversión que importa, y agregar un segundo evento exige generalizar `lib/analytics.ts` más allá de los contactos. Se hace cuando haya un mes de datos y se sepa si el dato del puntaje agrega algo.

**Otra desviación.** El punto 7.7 propone reemplazar el CTA secundario del hero. Se mantiene "Ver trabajos": el portfolio sigue siendo la prueba más fuerte del sitio, y la auditoría ya tiene dos puntos de entrada visibles.
