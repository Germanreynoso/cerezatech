import { Instagram, Mail, MapPin, MessageCircle } from "lucide-react"
import { BrandLogo } from "@/components/brand-logo"
import { CONTACT, NAV_LINKS, SITE, waLink } from "@/lib/site-config"

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <BrandLogo size={44} showTagline />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {SITE.description}
            </p>
            <p className="mt-5 flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              {CONTACT.coverage}
            </p>
          </div>

          <nav aria-label="Pie de página">
            <h2 className="text-sm font-semibold text-foreground">Navegación</h2>
            <ul className="mt-4 space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-semibold text-foreground">Contacto</h2>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href={waLink("Hola! Quiero información sobre una página web.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <MessageCircle className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                  {CONTACT.whatsappDisplay}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="flex items-center gap-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Mail className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                  <span className="break-all">{CONTACT.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={CONTACT.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Instagram className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                  @{CONTACT.instagram}
                </a>
              </li>
            </ul>

            <a
              href={waLink("Hola! Quiero un presupuesto para mi página web.")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              Pedir presupuesto
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {year} {SITE.name}. Todos los derechos reservados.
          </p>
          <p className="text-sm text-muted-foreground">{SITE.tagline}</p>
        </div>
      </div>
    </footer>
  )
}
