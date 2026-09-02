import Image from "next/image"
import { SITE } from "@/lib/site-config"
import { cn } from "@/lib/utils"

/**
 * Isotipo de Luckywebs dentro de un badge circular crema.
 *
 * El arte original tiene fondo crema, así que el badge coincide con él y el
 * borde del recorte no se percibe.
 */
export function BrandMark({
  size = 36,
  className,
}: {
  size?: number
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-cream",
        className
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src="/logo-mark.png"
        alt=""
        width={size * 2}
        height={size * 2}
        className="h-full w-full object-cover"
        priority
      />
    </span>
  )
}

/** Wordmark tipográfico: "Lucky" en crema, "webs" en dorado. */
export function BrandWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-bold tracking-tight", className)}>
      Lucky<span className="text-primary">webs</span>
    </span>
  )
}

export function BrandLogo({
  size = 36,
  className,
  showTagline = false,
}: {
  size?: number
  className?: string
  showTagline?: boolean
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <BrandMark size={size} />
      <span className="flex flex-col leading-none">
        <BrandWordmark className="text-lg sm:text-xl" />
        {showTagline && (
          <span className="mt-1 text-[11px] font-medium tracking-wide text-muted-foreground">
            {SITE.tagline}
          </span>
        )}
      </span>
    </span>
  )
}
