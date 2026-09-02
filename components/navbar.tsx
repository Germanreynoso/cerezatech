"use client"

import { useState } from "react"
import { Menu, MessageCircle } from "lucide-react"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { BrandLogo, BrandWordmark } from "@/components/brand-logo"
import { useScrollSpy, useScrolled } from "@/hooks/use-scroll-spy"
import { NAV_LINKS, waLink } from "@/lib/site-config"
import { cn } from "@/lib/utils"

const SECTION_IDS = NAV_LINKS.map((l) => l.href.slice(1))

const WA_MESSAGE = "Hola! Quiero información sobre una página web para mi negocio."

export function Navbar({ onMenuOpenChange }: { onMenuOpenChange?: (open: boolean) => void }) {
  const [open, setOpen] = useState(false)
  const scrolled = useScrolled()
  const active = useScrollSpy(SECTION_IDS)

  function handleOpenChange(next: boolean) {
    setOpen(next)
    onMenuOpenChange?.(next)
  }

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b border-border bg-background/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav
        aria-label="Principal"
        className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <a href="#inicio" className="rounded-lg" aria-label="Luckywebs, ir al inicio">
          <BrandLogo markClassName="size-12 sm:size-14" />
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = active === link.href.slice(1)
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.label}
                </a>
              </li>
            )
          })}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={waLink(WA_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:inline-flex"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            Hablar por WhatsApp
          </a>

          <Sheet open={open} onOpenChange={handleOpenChange}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Abrir menú"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-secondary md:hidden"
              >
                <Menu className="h-5 w-5" aria-hidden />
              </button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[min(20rem,85vw)] border-border bg-background p-0">
              <SheetTitle className="sr-only">Menú de navegación</SheetTitle>

              <div className="flex h-full flex-col">
                <div className="border-b border-border px-6 py-5">
                  <BrandLogo markClassName="size-14" />
                </div>

                <ul className="flex flex-1 flex-col gap-1 px-4 py-6">
                  {NAV_LINKS.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        onClick={() => handleOpenChange(false)}
                        className="block rounded-xl px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-secondary"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-border p-4">
                  <a
                    href={waLink(WA_MESSAGE)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleOpenChange(false)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-base font-semibold text-primary-foreground"
                  >
                    <MessageCircle className="h-5 w-5" aria-hidden />
                    Hablar por WhatsApp
                  </a>
                  <p className="mt-3 text-center text-xs text-muted-foreground">
                    <BrandWordmark /> · Respondemos el mismo día
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}
