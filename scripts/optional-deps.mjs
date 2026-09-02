/**
 * Dependencias que solo usan los scripts de mantenimiento, no la aplicación.
 *
 * Se resuelven en tiempo de ejecución en lugar de declararse en package.json:
 * el build de producción no las necesita, y sharp y playwright arrastran
 * binarios nativos pesados que alargarían cada deploy sin motivo.
 */

async function loadOptional(name, installHint) {
  try {
    return await import(name)
  } catch {
    console.error(
      `\nFalta "${name}", que este script necesita.\n` +
        `Instalalo con:\n\n  ${installHint}\n`
    )
    process.exit(1)
  }
}

export async function loadSharp() {
  const mod = await loadOptional("sharp", "npm i -D sharp")
  return mod.default
}

export async function loadPlaywright() {
  const mod = await loadOptional(
    "playwright",
    "npm i -D playwright && npx playwright install chromium"
  )
  return mod.chromium
}
