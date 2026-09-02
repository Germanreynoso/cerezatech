/**
 * Captura los screenshots de la sección Trabajos a partir de los sitios en vivo.
 *
 *   npx --yes playwright@latest install chromium   # solo la primera vez
 *   node scripts/capture-work-screenshots.mjs
 *
 * Playwright no es dependencia del proyecto: se resuelve on-demand para no
 * sumar ~300 MB al árbol de node_modules por una tarea que se corre a mano.
 *
 * Lee las URLs de lib/site-config.ts, así que agregar un proyecto ahí y volver
 * a correr este script es todo lo que hace falta.
 */
import sharp from "sharp"
import { mkdir, readFile, rm } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const PUBLIC = resolve(ROOT, "public")
const TMP = resolve(ROOT, ".screenshots-tmp")

const VIEWS = [
  { key: "desktop", width: 1440, height: 900 },
  { key: "mobile", width: 390, height: 844 },
]

/** Extrae `slug` y `url` de las entradas activas de PROJECTS. */
async function readProjects() {
  const source = await readFile(resolve(ROOT, "lib/site-config.ts"), "utf8")
  const block = source.slice(
    source.indexOf("export const PROJECTS"),
    source.indexOf("/** Rutas de los screenshots")
  )
  const projects = []
  // Las entradas comentadas quedan fuera porque la regex exige el par
  // slug/url sin `//` de por medio en la misma entrada activa.
  for (const entry of block.split(/\n\s*\{/).slice(1)) {
    if (entry.trimStart().startsWith("//")) continue
    const slug = entry.match(/^\s*slug:\s*"([^"]+)"/m)?.[1]
    const url = entry.match(/^\s*url:\s*"([^"]+)"/m)?.[1]
    if (slug && url) projects.push({ slug, url })
  }
  return projects
}

/**
 * Oculta overlays flotantes (popups, banners de cookies) y la barra de scroll,
 * dejando el header intacto para que la captura muestre el sitio como se ve al
 * llegar.
 */
function cleanPage() {
  const style = document.createElement("style")
  style.textContent =
    "::-webkit-scrollbar{display:none!important}html{scrollbar-width:none!important}"
  document.head.appendChild(style)

  for (const el of Array.from(document.querySelectorAll("body *"))) {
    if (getComputedStyle(el).position !== "fixed") continue
    const rect = el.getBoundingClientRect()
    const isHeader = rect.top < 100 && rect.width > window.innerWidth * 0.8
    if (isHeader) continue
    el.style.setProperty("display", "none", "important")
  }
}

async function main() {
  const { chromium } = await import("playwright").catch(() => {
    console.error(
      "Falta Playwright. Instalalo con:\n" +
        "  npx --yes playwright@latest install chromium\n" +
        "  npm i -D playwright"
    )
    process.exit(1)
  })

  const projects = await readProjects()
  if (projects.length === 0) {
    console.error("No hay proyectos con URL en lib/site-config.ts")
    process.exit(1)
  }

  await mkdir(TMP, { recursive: true })
  await mkdir(PUBLIC, { recursive: true })

  const browser = await chromium.launch()

  try {
    for (const project of projects) {
      for (const view of VIEWS) {
        const page = await browser.newPage({
          viewport: { width: view.width, height: view.height },
          deviceScaleFactor: 2,
        })

        try {
          await page.goto(project.url, {
            waitUntil: "networkidle",
            timeout: 45_000,
          })
          await page.waitForTimeout(2500)
          await page.evaluate(cleanPage)
          await page.evaluate(() => window.scrollTo(0, 0))
          await page.waitForTimeout(800)

          const raw = resolve(TMP, `${project.slug}-${view.key}.png`)
          await page.screenshot({ path: raw, scale: "css" })

          const out = resolve(PUBLIC, `work-${project.slug}-${view.key}.webp`)
          await sharp(raw).resize({ width: view.width }).webp({ quality: 82 }).toFile(out)

          console.log(`  ✓ work-${project.slug}-${view.key}.webp`)
        } catch (err) {
          console.error(`  ✗ ${project.slug} (${view.key}): ${err.message}`)
        } finally {
          await page.close()
        }
      }
    }
  } finally {
    await browser.close()
    await rm(TMP, { recursive: true, force: true })
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
