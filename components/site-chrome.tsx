"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { WhatsAppFab } from "@/components/whatsapp-fab"

/**
 * Navbar y botón flotante comparten el estado del menú mobile para que el FAB
 * no quede flotando sobre el panel abierto.
 */
export function SiteChrome() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <Navbar onMenuOpenChange={setMenuOpen} />
      <WhatsAppFab hidden={menuOpen} />
    </>
  )
}
