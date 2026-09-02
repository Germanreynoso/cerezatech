/**
 * Genera los assets de marca de Lucky Studio a partir del logo original.
 *
 *   node scripts/generate-brand-assets.mjs
 *
 * Re-ejecutable en cualquier momento. Idempotente.
 */
import { mkdir, access } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { loadSharp } from "./optional-deps.mjs"

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const SOURCE = resolve(ROOT, "assets/brand/logo-original.jpeg")
const PUBLIC = resolve(ROOT, "public")

/** Recorte del isotipo (círculo + perro + bocadillo) dentro del arte de 1254x1254. */
const MARK_CROP = { left: 278, top: 98, width: 734, height: 734 }

/** Fondo crema del logo original, usado para rellenar los lienzos. */
const CREAM = { r: 253, g: 250, b: 243, alpha: 1 }

/** Navy del logo, fondo de la tarjeta Open Graph. */
const NAVY = { r: 19, g: 30, b: 46, alpha: 1 }

async function exists(path) {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

async function main() {
  if (!(await exists(SOURCE))) {
    console.error(`No se encontró el logo original en ${SOURCE}`)
    process.exit(1)
  }

  const sharp = await loadSharp()

  await mkdir(PUBLIC, { recursive: true })

  const mark = sharp(SOURCE).extract(MARK_CROP)

  // Isotipo cuadrado, usado en navbar y footer dentro de un badge circular.
  await mark
    .clone()
    .resize(512, 512, { fit: "cover" })
    .png({ compressionLevel: 9 })
    .toFile(resolve(PUBLIC, "logo-mark.png"))

  // Favicon y apple touch icon.
  await mark
    .clone()
    .resize(512, 512, { fit: "cover" })
    .png({ compressionLevel: 9 })
    .toFile(resolve(PUBLIC, "icon.png"))

  await mark
    .clone()
    .resize(180, 180, { fit: "cover" })
    .flatten({ background: CREAM })
    .png({ compressionLevel: 9 })
    .toFile(resolve(PUBLIC, "apple-icon.png"))

  /*
   * Tarjeta Open Graph.
   *
   * El wordmark se compone acá en vez de reutilizar el arte original: ese
   * archivo dice "LUCKY WEB", el nombre anterior del estudio. El isotipo —lo
   * único que sobrevive del logo original— se recorta y se le agrega el texto
   * de la marca actual.
   */
  const OG = { w: 1200, h: 630 }
  const MARK = 190

  const ogMark = await mark
    .clone()
    .resize(MARK, MARK, { fit: "cover" })
    .composite([
      {
        // Máscara circular, para que el isotipo salga redondo sobre el navy.
        input: Buffer.from(
          `<svg width="${MARK}" height="${MARK}">
             <circle cx="${MARK / 2}" cy="${MARK / 2}" r="${MARK / 2}" fill="#fff"/>
           </svg>`
        ),
        blend: "dest-in",
      },
    ])
    .png()
    .toBuffer()

  const FONTS = "Segoe UI, Inter, Helvetica, Arial, sans-serif"

  const ogText = Buffer.from(
    `<svg width="${OG.w}" height="${OG.h}" xmlns="http://www.w3.org/2000/svg">
       <text x="${OG.w / 2}" y="430" text-anchor="middle"
             font-family="${FONTS}" font-size="92" font-weight="700"
             letter-spacing="-2">
         <tspan fill="#F5F0E6">Lucky</tspan><tspan fill="#D9B23A">Studio</tspan>
       </text>
       <text x="${OG.w / 2}" y="492" text-anchor="middle"
             font-family="${FONTS}" font-size="30" font-weight="500"
             letter-spacing="3" fill="#9AA6B4">
         SITIOS Y PLATAFORMAS QUE CONECTAN
       </text>
       <line x1="${OG.w / 2 - 90}" y1="536" x2="${OG.w / 2 + 90}" y2="536"
             stroke="#D9B23A" stroke-width="3" stroke-linecap="round"/>
     </svg>`
  )

  await sharp({
    create: { width: OG.w, height: OG.h, channels: 4, background: NAVY },
  })
    .composite([
      { input: ogMark, top: 105, left: Math.round((OG.w - MARK) / 2) },
      { input: ogText, top: 0, left: 0 },
    ])
    .png({ compressionLevel: 9 })
    .toFile(resolve(PUBLIC, "og-image.png"))

  console.log("Assets de marca generados en public/:")
  console.log("  logo-mark.png, og-image.png, icon.png, apple-icon.png")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
