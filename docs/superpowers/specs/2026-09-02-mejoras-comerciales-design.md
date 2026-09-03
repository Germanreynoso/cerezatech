# Lucky Studio: mejoras comerciales, de marketing y diseño

Fecha: 2026-09-02
Estado: borrador para revisión
Depende de: `2026-09-02-luckywebs-rebrand-design.md` (sitio actual en producción)

## 1. Contexto y objetivo

El sitio actual es una única página de once secciones, técnicamente sólida, con
un portfolio de diez sitios reales. Lo que le falta no está en el código: no
mide nada, no tiene un rostro, el dominio sigue sin registrar y depende de que
el visitante llegue solo.

Objetivo de este trabajo: convertir la página en una máquina de captación
medible. Cada fase debe poder publicarse por separado y dejar el sitio mejor
que antes, sin esperar a las siguientes.

Métrica de éxito: en 60 días desde la fase 1, saber cuántas visitas llegan,
desde dónde, y cuántas terminan en un clic a WhatsApp o mail. Hoy ese número
no existe.

## 2. Alcance

Entra:

- Medición de visitas y de cada clic de contacto, con origen.
- Corrección de inconsistencias de copy.
- Sección "quién está detrás" con foto.
- Fusión de Servicios y Beneficios, y reordenamiento de secciones.
- Vista móvil en el hero.
- Una página por proyecto del portfolio.
- Testimonios reales, como estructura de datos que se llena cuando existan.
- Landing vertical para hospedajes de Tafí del Valle.
- Auditoría automática de presencia digital como imán de contactos.
- Lista de acciones fuera del código, con los textos listos para enviar.

No entra (ver sección 11): blog, panel de clientes, cobro recurrente
automatizado, bot de WhatsApp, demo interactiva del flujo de pedido.

## 3. Fases y dependencias

| Fase | Contenido | Depende de | Publicable sola |
|------|-----------|------------|-----------------|
| 0 | Acciones fuera del código | Nada | Sí |
| 1 | Medición, copy, "quién está detrás", fusión de secciones, hero móvil | Foto de Lucky | Sí |
| 2 | Páginas por proyecto, testimonios, landing hospedajes | Fase 1 (medición y orden de secciones) | Sí |
| 3 | Auditoría automática | Fase 1 (medición) | Sí |
| 4 | Demo interactiva del flujo WhatsApp | Fase 1 | Diferida |

Cada fase tiene su propio plan de implementación. Este documento es la fuente
de verdad del diseño para todas.

## 4. Fase 0: acciones fuera del código

Ninguna requiere programar. Todas destraban algo de las fases siguientes.

### 4.1 Dominio

Registrar `luckystudio.com` o, si no está disponible, `luckystudio.com.ar`.
Al confirmarlo, actualizar `SITE.url` en `lib/site-config.ts` y quitar el
`TODO`. Sin dominio propio no se puede verificar Google Business Profile ni
Search Console, y el pixel de Meta queda a medias.

### 4.2 Google Business Profile

Crear el perfil como "Diseñador de sitios web" en Tafí del Valle, con
área de servicio Tucumán. Cargar las mismas fotos que la sección "quién está
detrás", el WhatsApp y el sitio. Es el canal que aparece primero para
"diseño web Tucumán".

### 4.3 Google Search Console

Verificar el dominio por DNS y enviar `sitemap.xml`. Es el único lugar donde
se ve por qué búsquedas aparece el sitio.

### 4.4 Mensaje a los diez clientes

Un solo mensaje por WhatsApp a cada cliente, en este orden de pedidos: reseña
en Google Business Profile, referidos, mantenimiento mensual. Texto base:

> Hola [nombre]. Te escribo por tres cosas cortas.
> 1) Estoy armando el perfil de Lucky Studio en Google. Si te sirvió el sitio,
> una reseña de dos líneas me ayuda mucho: [enlace].
> 2) Si conocés a alguien que necesite una web, por cada persona que me
> recomiendes y contrate te bonifico un mes de mantenimiento o un cambio grande
> sin cargo.
> 3) Estoy ofreciendo mantenimiento mensual: hosting, cambios de contenido,
> respaldos y soporte, desde $18.000 por mes. Si te interesa, te paso el
> detalle.

Registrar respuestas en una planilla simple: cliente, reseña sí/no, referidos,
mantenimiento sí/no. Esa planilla alimenta los testimonios de la fase 2.

### 4.5 Autorización para testimonios

A cada cliente que responda bien, pedirle una frase y autorización explícita
para publicarla con nombre y negocio. Sin autorización escrita, no se publica.

### 4.6 Contenido para Instagram

Diez publicaciones, una por proyecto: captura del sitio, una línea sobre qué
resolvió, enlace. Se generan a partir de las capturas que ya existen en
`public/`. Una por semana durante diez semanas.

## 5. Fase 1: base

### 5.1 Medición

**Problema.** `app/layout.tsx` monta `@vercel/analytics`, que solo funciona en
despliegues de Vercel. El sitio está en Netlify, así que el script responde
404 y no se registra nada.

**Decisión.** Google Analytics 4 mediante `@next/third-parties/google`. Razón:
es gratis, se integra con Search Console y Google Business Profile, y es lo
que va a pedir cualquier campaña futura. Se descarta Vercel Analytics por
incompatible, y Plausible o Umami porque agregan un proveedor más sin
resolver la integración con el ecosistema de Google.

**Implementación.**

- Quitar `@vercel/analytics` de `package.json` y de `app/layout.tsx`.
- Agregar `@next/third-parties`. Montar `<GoogleAnalytics gaId={...} />` en el
  layout solo si `NEXT_PUBLIC_GA_ID` está definida. Sin la variable, el sitio
  no carga ningún script: local y previews no ensucian los datos.
- Crear `lib/analytics.ts` con una única función:

  ```ts
  export type ContactChannel = "whatsapp" | "email" | "instagram"
  export function trackContact(channel: ContactChannel, source: string): void
  ```

  Llama a `sendGAEvent("event", "contact_click", { channel, source })` si
  `window.gtag` existe. Nunca lanza.
- Crear `components/contact-link.tsx`: un `<a>` que recibe `channel` y
  `source`, arma el `href` con `waLink`, `mailLink` o la URL de Instagram, y
  emite `trackContact` en `onClick`. Todos los enlaces de contacto del sitio
  pasan a usarlo. Hoy hay enlaces a WhatsApp en navbar, hero, FAB, planes,
  FAQ, CTA final y footer, cada uno con su propio `href` armado a mano.
- Valores de `source`: `navbar`, `hero`, `fab`, `pricing-<plan>-<modo>`,
  `faq`, `final-cta`, `footer`, `project-<slug>`, `audit`, `hospedajes`.
- En GA4 marcar `contact_click` como conversión.

**Privacidad.** GA4 no usa cookies de terceros y anonimiza IP por defecto. La
Ley 25.326 no exige aviso de cookies. No se agrega banner. Se incluye una
línea en el pie: "Usamos Google Analytics para contar visitas. No vendemos
datos."

**Verificación.** Con `NEXT_PUBLIC_GA_ID` de prueba, abrir el sitio con la
extensión GA Debugger y comprobar que cada clic de contacto emite
`contact_click` con `channel` y `source` correctos. Sin la variable, comprobar
que no se solicita ningún recurso de `googletagmanager.com`.

### 5.2 Correcciones de copy

Cambios exactos, sin interpretación:

| Dónde | Hoy | Queda |
|-------|-----|-------|
| Hero, `TRUST_POINTS` | "Entrega en 7 días" | "Landing en 7 días" |
| Hero, `TRUST_POINTS` | "Dominio y hosting incluidos" | "Dominio y hosting incluidos el primer año" |
| Proceso, paso "Publicamos" | "tu web en vivo en 7 días" | "tu web en vivo en 7 a 15 días según el plan" |
| FAQ, "¿Puedo actualizar el contenido después?" | "El plan Profesional incluye un mes de cambios sin costo." | "En pago único, todos los planes incluyen un mes de cambios sin costo. En suscripción, los cambios mensuales están incluidos siempre." |
| Beneficios, "Se ve bien en cualquier celular" | "8 de cada 10 visitas llegan desde el teléfono." | "La mayoría de tus visitas van a llegar desde el teléfono." |
| Beneficios, "Carga en menos de 2 segundos" | "Una web lenta pierde la mitad de las visitas." | "Una web lenta pierde visitas antes de que terminen de cargar." |

Regla que queda escrita en `site-config.ts`: ninguna cifra en el sitio sin
fuente verificable o sin que salga de los datos del propio portfolio.

### 5.3 Sección "Quién está detrás"

**Propósito.** Es lo único humano que le falta a una página que se apoya en
la confianza. Para un negocio local, una cara y una historia corta convierten
más que cualquier grilla.

**Ubicación.** Después de Trabajos y antes de Proceso: el visitante ve los
sitios y enseguida ve quién los hizo.

**Contenido.** Nuevo bloque `ABOUT` en `lib/site-config.ts`:

```ts
export const ABOUT = {
  founderName: "Germán Reynoso",
  founderPhoto: "/about-german.webp",   // opcional: si es cadena vacía, no se muestra
  dogName: "Lucky",
  dogPhoto: "/about-lucky.webp",
  paragraphs: [/* tres párrafos, ver abajo */],
  facts: [
    { label: "Base", value: "Tafí del Valle, Tucumán" },
    { label: "Sitios publicados", value: "10" },   // se calcula de VISIBLE_PROJECTS
    { label: "Cómo trabajo", value: "Solo, de punta a punta" },
  ],
} as const
```

Párrafos, en primera persona porque es una persona:

1. Quién soy y desde dónde: desarrollador en Tafí del Valle, hago cada sitio
   de punta a punta, desde la primera charla hasta el soporte.
2. Por qué el nombre: Lucky es mi perro. Está en el logo y en el nombre
   porque el estudio empezó en casa, con él al lado.
3. Qué me importa: que el cliente pueda comprobar todo lo que le digo. Por eso
   cada trabajo de esta página está online.

**Diseño.** Dos columnas en escritorio: foto grande a la izquierda, texto a la
derecha. La foto principal es la de Lucky; si hay foto de Germán, se muestra
como segunda imagen superpuesta en la esquina, al estilo del `PhoneFrame` de
las tarjetas destacadas. En móvil, foto arriba y texto abajo. Sin tarjetas.

**Fotos.** Se procesan con `sharp` mediante `scripts/prepare-about-photos.mjs`
a partir de los originales en `assets/about/`: recorte al cuadrado, 800 px,
WebP calidad 82. El script usa `loadSharp()` de `scripts/optional-deps.mjs`.
Los originales no se suben al repo.

**Voz.** La sección es la única en primera persona del singular. El resto del
sitio sigue en plural ("trabajamos") porque describe el servicio, no a la
persona. Se deja explicado en un comentario del componente.

### 5.4 Fusión de Servicios y Beneficios, y nuevo orden

**Problema.** Servicios (siete tarjetas) y Beneficios (seis tarjetas) dicen lo
mismo con otras palabras y tienen el mismo formato. Con Compromisos y Proceso,
son cuatro grillas de tarjeta con ícono seguidas.

**Decisión.** Una sola sección "Qué hacemos" con seis ítems, cada uno con qué
es y para qué sirve. Se elimina `benefits-section.tsx`. `SERVICES` en la
config pasa a tener `title`, `description` y `benefit`:

| Título | Qué es | Para qué sirve |
|--------|--------|----------------|
| Landing page | Una página que presenta tu negocio | Te escriben por WhatsApp con el mensaje ya armado |
| Tienda online | Catálogo con carrito y pedidos al teléfono | Mostrás todo lo que vendés sin depender de una historia que caduca |
| Web institucional | Varias secciones para empresas y organismos | Ubicación, horarios y trámites a la vista, en varios idiomas si hace falta |
| Plataformas interactivas | Ejercicios, buscadores, seguimiento de progreso | Lo que no entra en una web común y necesita lógica propia |
| SEO local | Títulos, textos y velocidad afinados | Aparecés cuando buscan tu rubro en tu zona |
| Mantenimiento | Cambios, respaldos y soporte | No desaparecemos al publicar |

"Catálogo digital" se absorbe en Tienda online. El JSON-LD del layout, que
itera `SERVICES`, sigue funcionando sin cambios.

**Nuevo orden de secciones en `app/page.tsx`:**

1. Hero
2. Prueba social (cinta)
3. Problema y solución
4. Qué hacemos (fusionada)
5. Trabajos
6. Quién está detrás (nueva)
7. Proceso
8. Planes
9. Confianza (métricas, compromisos, testimonios cuando existan)
10. FAQ
11. CTA final

Confianza pasa a ir después de Planes: las objeciones aparecen al ver el
precio, y ahí es donde hay que responderlas. La cantidad de secciones se
mantiene en once, pero dos grillas de tarjetas (siete y seis ítems) se
convierten en una de seis, y la sección que entra en su lugar es una foto con
texto. El largo total baja y se rompe la sucesión de cuatro grillas iguales.

### 5.5 Vista móvil en el hero

El argumento central es "pensado para el celular", pero el hero solo muestra
la captura de escritorio. Se agrega el `PhoneFrame` superpuesto en la esquina
inferior derecha del `BrowserFrame`, con la captura móvil del mismo proyecto,
igual que en `FeaturedCard`. Ambas imágenes comparten el `key` del proyecto
para que roten juntas. En pantallas menores a 640 px el teléfono se oculta:
no hay espacio y la captura de escritorio ya es pequeña.

### 5.6 Verificación de la fase

- `npm run build` sin errores.
- Playwright a 375, 768 y 1440 px: sin desborde horizontal, sin errores de
  consola, contraste AA en todos los nodos de texto.
- Con `prefers-reduced-motion`, la sección nueva no anima.
- Cada enlace de contacto del sitio emite `contact_click` con su `source`.
- Grep de las seis cadenas viejas de copy: cero resultados.

## 6. Fase 2: páginas por proyecto, testimonios, landing hospedajes

### 6.1 Páginas por proyecto

**Propósito.** Hoy todo vive en una URL. Una página por trabajo posiciona
búsquedas largas ("página web para municipalidad", "tienda online growshop")
y le da al visitante un lugar para leer el caso completo.

**Ruta.** `app/trabajos/[slug]/page.tsx`, generada en build con
`generateStaticParams` a partir de `VISIBLE_PROJECTS`. `dynamicParams = false`.

**Datos.** `Project` gana tres campos:

```ts
challenge: string   // qué tenía el cliente antes, en dos o tres líneas
solution: string    // qué se construyó y por qué así
result?: string     // solo si es verificable; si no, se omite
```

Los diez proyectos se completan en la config a partir de lo que ya se sabe de
cada sitio. `result` queda vacío salvo que el cliente confirme un dato.

**Contenido de la página, en orden:**

1. Migas: Inicio / Trabajos / Nombre.
2. Título, categoría y sector.
3. `BrowserFrame` con captura de escritorio y `PhoneFrame` con la móvil.
4. Tres bloques: El punto de partida, Qué hicimos, Resultado (si existe).
5. Destacados (`highlights`) como lista.
6. Botón externo "Visitar sitio" y `ContactLink` "Quiero algo así" con mensaje
   de WhatsApp que nombra el proyecto: "Hola! Vi el sitio de [nombre] y quiero
   algo parecido para mi negocio."
7. Testimonio del cliente, si existe uno con ese `projectSlug`.
8. Otros trabajos del mismo sector, en tarjetas compactas.

**SEO.** `generateMetadata` por proyecto: título "[Nombre] · [categoría] |
Lucky Studio", descripción a partir de `summary`, imagen Open Graph la captura
de escritorio. JSON-LD `BreadcrumbList` y `CreativeWork`. `app/sitemap.ts`
incluye las diez rutas.

**Cambios en la home.** Las tarjetas de Trabajos enlazan a la página interna;
el enlace externo queda como acción secundaria dentro de la tarjeta destacada
y desaparece de la compacta. La cinta de prueba social sigue enlazando al
sitio externo, porque su función es demostrar que están online.

**Navegación interna.** `SiteChrome` funciona en subrutas: los enlaces del
navbar pasan a `/#servicios`, `/#trabajos`, etc., para que desde una página de
proyecto vuelvan a la home. El scroll-spy se desactiva fuera de la home.

### 6.2 Testimonios

**Datos.** En `lib/site-config.ts`:

```ts
export type Testimonial = {
  name: string
  role: string          // "Dueña", "Director", "Secretario de Turismo"
  business: string
  projectSlug: string
  quote: string
  photo?: string
}
export const TESTIMONIALS: readonly Testimonial[] = []
```

**Regla.** Solo entran testimonios con autorización escrita del cliente
(fase 0, punto 4.5). La lista arranca vacía y el sitio se comporta igual que
hoy hasta que haya al menos uno.

**Render.** Dentro de la sección Confianza, entre las métricas y los
compromisos, aparece un bloque "Lo que dicen los clientes" solo si
`TESTIMONIALS.length > 0`. Cada testimonio muestra cita, nombre, rol, negocio
y un enlace a la página del proyecto. Con uno solo, ocupa el ancho completo;
con dos o más, grilla de dos columnas. Sin carrusel: tres testimonios se leen
de un vistazo.

El `TODO` de `trust-section.tsx` se elimina al implementar esto.

### 6.3 Landing para hospedajes

**Propósito.** Tafí del Valle vive del turismo. Un producto con nombre propio
para cabañas y alquileres temporarios se vende solo en la zona, y La Prohibida
ya es la prueba.

**Ruta.** `app/hospedajes/page.tsx`, estática. No se agrega al navbar: se
enlaza desde la tarjeta "Web institucional" de Qué hacemos con la línea
"¿Tenés un hospedaje? Mirá el plan pensado para vos", desde el pie de página
y desde la página de proyecto de La Prohibida.

**Contenido, en orden:**

1. Hero: "Tu cabaña, con página propia y consultas de fecha por WhatsApp".
   Captura de La Prohibida.
2. Qué incluye, seis puntos: galería por ambiente, comodidades, tarifas por
   temporada, consulta de fechas con mensaje armado, mapa y cómo llegar,
   español e inglés.
3. Por qué no alcanza con Booking o Instagram: comisión, dependencia, precio
   por mensaje privado.
4. Precio: el plan Profesional, en las dos modalidades. Reutiliza los datos de
   `PLANS` y el selector de modalidad, filtrado a ese único plan. No se crea un
   plan nuevo en la config: un hospedaje es un Profesional con contenido de
   hospedaje.
5. Tres preguntas frecuentes propias: reservas online con pago, calendario de
   disponibilidad, varios idiomas.
6. CTA con `source="hospedajes"` y mensaje "Hola! Tengo un hospedaje en Tafí y
   quiero una página."

**SEO.** Título "Páginas web para cabañas y alquileres en Tafí del Valle".
JSON-LD `Service` con `areaServed` Tafí del Valle. Se agrega al sitemap.

### 6.4 Verificación de la fase

- Build genera exactamente `VISIBLE_PROJECTS.length + 2` rutas nuevas.
- Cada página de proyecto responde 200, tiene un único `h1`, título y
  descripción propios, y su captura como imagen Open Graph.
- Un slug inexistente responde 404.
- Con `TESTIMONIALS` vacío, la sección Confianza es idéntica a la actual.
- Desde `/trabajos/importados-tafi`, el enlace "Planes" del navbar lleva a la
  home y hace scroll a la sección.
- Playwright: sin desborde, sin errores de consola, contraste AA en las tres
  plantillas nuevas.

## 7. Fase 3: auditoría automática

### 7.1 Propósito

El visitante pega la dirección de su web o de su Instagram y recibe un
diagnóstico en segundos. Cada hallazgo apunta a algo que el estudio resuelve.
Es el único imán de contactos del sitio que da valor antes de pedir nada, y
ningún freelancer de la zona lo tiene.

### 7.2 Flujo

1. Página `app/auditoria/page.tsx` con un campo, un botón y un campo trampa
   oculto para bots.
2. `POST /api/auditoria` recibe `{ url }`. Valida, normaliza y despacha:
   - Host de `instagram.com` o `facebook.com`: informe fijo "solo redes",
     sin ninguna petición externa. Es el caso más común entre los prospectos
     y las redes bloquean el scraping.
   - Cualquier otro host: informe completo.
3. La respuesta se muestra en la misma página: puntaje general, puntajes por
   área con `CountUp`, lista de hallazgos con severidad y qué plan lo resuelve,
   y un `ContactLink` con `source="audit"` cuyo mensaje incluye la URL y el
   puntaje: "Hola! Audité [url] y saqué [n]/100. Quiero mejorar estos puntos."

### 7.3 Informe completo

Dos fuentes, en paralelo, con tiempo máximo de 20 segundos en total:

**Análisis del HTML propio.** Petición `GET` con `User-Agent` identificado,
tiempo máximo 8 segundos, cuerpo limitado a 1 MB, sin seguir más de tres
redirecciones. Comprueba:

| Chequeo | Cómo | Resuelve |
|---------|------|----------|
| HTTPS | Esquema de la URL final | Todos los planes |
| Adaptado a celular | `<meta name="viewport">` presente | Todos |
| Título y descripción | Presentes, 20 a 70 y 50 a 160 caracteres | SEO local |
| Un solo `h1` | Conteo | SEO local |
| Contacto a un clic | Enlace a `wa.me`, `api.whatsapp.com` o `tel:` | Todos |
| Imágenes con texto alternativo | Proporción de `<img alt>` no vacío | SEO local |
| Redes como único canal | Solo enlaces a instagram/facebook y ningún contacto directo | Todos |

**PageSpeed Insights.** `strategy=mobile`, categorías `performance` y `seo`.
Se toman el puntaje de rendimiento, el puntaje de SEO y LCP. La clave de API
vive en `PSI_API_KEY`, solo en el servidor. Si PSI falla o excede el tiempo, el
informe sale con los chequeos del HTML y una nota "no pudimos medir la
velocidad esta vez".

**Puntaje.** Promedio ponderado: rendimiento 35 %, SEO 25 %, chequeos propios
40 %. Cada chequeo propio vale lo mismo. Se redondea a entero.

### 7.4 Informe "solo redes"

Sin peticiones externas. Devuelve puntaje fijo bajo y los hallazgos que ya
aparecen en la sección Problema y solución: no aparecés en Google, el precio
se pregunta por mensaje privado, el catálogo depende de historias que caducan,
no hay contacto directo. Cada uno con el plan que lo resuelve. Es la mitad del
argumento de venta del sitio, ahora personalizado con el nombre de la cuenta.

### 7.5 Seguridad y abuso

- Solo `http` y `https`. Se resuelve el host y se rechazan direcciones
  privadas, de loopback y de enlace local, antes y después de cada
  redirección. Evita usar la función como proxy hacia la red interna.
- Límite por IP: 10 auditorías por hora, contador en Netlify Blobs con
  vencimiento. Excedido, responde 429 con mensaje amable.
- Caché de resultados por URL normalizada durante 24 horas, también en
  Netlify Blobs: protege la cuota de PSI y hace instantánea la segunda
  consulta de la misma web.
- Campo trampa: si viene con valor, se responde 200 con un informe vacío sin
  hacer nada.
- No se guarda ningún dato más allá de la caché. No hay lista de URLs
  auditadas. Si más adelante se quiere una lista de prospectos, es otra spec.

### 7.6 Medición

Evento `audit_run` con `kind` (`full` o `social`) y `score` en decenas. El clic
de contacto posterior lleva `source="audit"`. Así se sabe cuántas auditorías
terminan en conversación.

### 7.7 Dónde se enlaza

- Ítem "Auditoría gratis" en el navbar, a la derecha de FAQ, con estilo
  distinto al resto para que se lea como acción.
- Línea al pie de Problema y solución: "¿No sabés en qué punto estás? Auditá
  tu web o tu Instagram gratis."
- Se mantiene "Ver trabajos" como CTA secundario del hero: el portfolio sigue
  siendo la prueba más fuerte.

### 7.8 Verificación de la fase

- Pruebas unitarias del analizador de HTML con fixtures: página completa,
  página sin viewport, página solo con enlaces a Instagram, página sin `h1`.
- Prueba del validador de URLs: rechaza `localhost`, `127.0.0.1`, `10.x`,
  `169.254.x`, `file:`, y una redirección desde un host público a uno privado.
- Prueba de integración contra dos sitios del propio portfolio: puntaje alto
  y sin hallazgos de contacto.
- Prueba de `instagram.com/loquesea`: informe "solo redes" sin ninguna
  petición saliente.
- Undécima petición desde la misma IP en una hora: 429.
- Playwright: formulario accesible por teclado, estados de carga y error
  anunciados con `aria-live`.

## 8. Fase 4, diferida: demo interactiva del flujo WhatsApp

Un bloque donde el visitante toca un producto de ejemplo y ve aparecer el
mensaje de WhatsApp ya armado, tal como le pasaría a su cliente. Muestra el
beneficio en lugar de describirlo. Se difiere porque la auditoría y las
páginas por proyecto tienen más retorno y porque conviene diseñarla con los
datos de la fase 1: si el `source` del hero convierte bien, la demo va ahí; si
no, va en Qué hacemos.

## 9. Arquitectura y convenciones que se mantienen

- `lib/site-config.ts` sigue siendo la única fuente de datos. Ningún
  componente hardcodea cifras, precios ni URLs. Los campos nuevos (`ABOUT`,
  `TESTIMONIALS`, `challenge`, `solution`, `result`, `benefit`) viven ahí.
- Todo lo que anima respeta la restricción de hidratación documentada en
  `lib/motion.ts`: el estado inicial nunca depende de `useReducedMotion`.
- Las nuevas rutas usan el mismo `SiteChrome`, el mismo pie y las mismas
  variantes de movimiento.
- La función de auditoría es el primer código de servidor del proyecto. Vive
  en `app/api/auditoria/route.ts` con la lógica separada en
  `lib/audit/` (`validate-url.ts`, `analyze-html.ts`, `pagespeed.ts`,
  `score.ts`) para que cada pieza se pruebe sola.
- Variables de entorno nuevas: `NEXT_PUBLIC_GA_ID` (fase 1) y `PSI_API_KEY`
  (fase 3). Ambas se documentan en `.env.example`. El sitio funciona sin ellas:
  sin GA no mide, sin PSI la auditoría sale parcial.

## 10. Decisiones tomadas y supuestos a confirmar

Decisiones que se tomaron para no frenar el diseño. Cualquiera se puede
revertir antes de implementar la fase correspondiente.

1. **Analítica: Google Analytics 4.** Alternativa descartada: Umami o
   Plausible, más livianos pero fuera del ecosistema de Google.
2. **Foto de Germán: recomendada, no obligatoria.** La sección funciona solo
   con Lucky, pero una cara humana convierte más que un perro solo. Si hay
   foto, va como imagen secundaria superpuesta.
3. **Precio del plan de hospedajes: el Profesional.** No se crea un plan
   nuevo. Si en la práctica los hospedajes piden algo distinto, se ajusta con
   datos.
4. **La auditoría no guarda prospectos.** Solo caché de 24 horas. Guardar
   URLs y contactos es una funcionalidad aparte con implicancias de datos
   personales.
5. **Sin banner de cookies.** GA4 sin cookies de terceros y la ley argentina
   no lo exige. Si se agrega el pixel de Meta más adelante, se revisa.

## 11. Fuera de alcance

- Blog o sección de artículos.
- Panel de clientes o área privada.
- Cobro recurrente automatizado de la suscripción.
- Bot de WhatsApp con IA.
- Pixel de Meta y campañas pagas: cuando el dominio y GA4 tengan un mes de
  datos.
- Migración de hosting: el sitio sigue en Netlify.

## 12. Orden de ejecución recomendado

Semana 1: fase 0 completa (dominio, perfil de Google, mensaje a clientes) y
fase 1 en código. Publicar.
Semanas 2 y 3: fase 2. Publicar con testimonios si ya llegaron; si no,
publicar igual con la lista vacía.
Semanas 4 y 5: fase 3. Publicar y empezar a compartir el enlace de la
auditoría en Instagram.
Después: leer los datos de GA4 y decidir la fase 4.
