/**
 * Genera los assets de marca de Luckywebs a partir del logo original.
 *
 *   node scripts/generate-brand-assets.mjs
 *
 * Re-ejecutable en cualquier momento. Idempotente.
 */
import sharp from "sharp"
import { mkdir, access } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

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

  // Logo completo con wordmark, para usos donde haga falta la marca entera.
  await sharp(SOURCE)
    .resize(1200, 1200, { fit: "contain", background: CREAM })
    .png({ compressionLevel: 9 })
    .toFile(resolve(PUBLIC, "logo-full.png"))

  // Tarjeta Open Graph: logo completo centrado sobre navy.
  const ogLogo = await sharp(SOURCE)
    .resize(560, 560, { fit: "contain", background: CREAM })
    .png()
    .toBuffer()

  await sharp({
    create: { width: 1200, height: 630, channels: 4, background: NAVY },
  })
    .composite([{ input: ogLogo, top: 35, left: 320 }])
    .png({ compressionLevel: 9 })
    .toFile(resolve(PUBLIC, "og-image.png"))

  console.log("Assets de marca generados en public/:")
  console.log("  logo-mark.png, logo-full.png, og-image.png, icon.png, apple-icon.png")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
