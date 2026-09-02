import Image from "next/image"
import { cn } from "@/lib/utils"

/**
 * Marco de navegador para presentar un screenshot de un sitio real.
 * El `label` va en la barra de direcciones simulada.
 */
export function BrowserFrame({
  src,
  alt,
  label,
  priority = false,
  sizes,
  className,
}: {
  src: string
  alt: string
  label: string
  priority?: boolean
  sizes: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-secondary shadow-2xl",
        className
      )}
    >
      <div className="flex items-center gap-2 border-b border-border bg-secondary px-3 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 min-w-0 flex-1 truncate rounded-md bg-background/60 px-2.5 py-1 text-[11px] text-muted-foreground">
          {label}
        </span>
      </div>

      <div className="relative aspect-[1440/900] bg-background">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover object-top"
        />
      </div>
    </div>
  )
}

/** Marco de teléfono, usado como superposición sobre el marco de navegador. */
export function PhoneFrame({
  src,
  alt,
  sizes,
  className,
}: {
  src: string
  alt: string
  sizes: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[1.25rem] border-4 border-secondary bg-secondary shadow-2xl",
        className
      )}
    >
      <div className="relative aspect-[390/844] overflow-hidden rounded-[0.9rem] bg-background">
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover object-top" />
      </div>
    </div>
  )
}
