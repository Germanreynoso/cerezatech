import Image from "next/image"
import { SITE } from "@/lib/site-config"
import { cn } from "@/lib/utils"

/**
 * Isotipo de Lucky Studio dentro de un badge circular crema.
 *
 * El arte original tiene fondo crema, así que el badge coincide con él y el
 * borde del recorte no se percibe.
 *
 * El tamaño se controla con clases (`className`), no con un número: así puede
 * ser responsive. El `<Image>` se pide siempre a 160 px —suficiente para
 * cualquier tamaño mostrado, incluso en pantallas retina— y el contenedor lo
 * recorta.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-cream",
        className
      )}
    >
      <Image
        src="/logo-mark.png"
        alt=""
        width={160}
        height={160}
        className="h-full w-full object-cover"
        priority
      />
    </span>
  )
}

/**
 * Wordmark tipográfico: la primera mitad en crema, la segunda en dorado.
 * Las dos partes salen de la config para que renombrar la marca sea un solo
 * cambio y no una búsqueda por todo el código.
 */
export function BrandWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-bold tracking-tight", className)}>
      {SITE.nameParts.first}
      <span className="text-primary">{SITE.nameParts.second}</span>
    </span>
  )
}

export function BrandLogo({
  className,
  markClassName,
  wordmarkClassName,
  showTagline = false,
}: {
  className?: string
  markClassName?: string
  wordmarkClassName?: string
  showTagline?: boolean
}) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <BrandMark className={markClassName} />
      <span className="flex flex-col leading-none">
        <BrandWordmark className={cn("text-xl sm:text-2xl", wordmarkClassName)} />
        {showTagline && (
          <span className="mt-1.5 text-xs font-medium tracking-wide text-muted-foreground">
            {SITE.tagline}
          </span>
        )}
      </span>
    </span>
  )
}
