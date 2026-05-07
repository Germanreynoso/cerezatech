import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { BenefitsSection } from "@/components/benefits-section"
import { InvitationsSection } from "@/components/invitations-section"
import { EmotionalSection } from "@/components/emotional-section"
import { InvitationPacks } from "@/components/invitation-packs"
import { QRSection } from "@/components/qr-section"
import { ServicesSection } from "@/components/services-section"
import { BeforeAfterSection } from "@/components/before-after-section"
import { PortfolioSection } from "@/components/portfolio-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { PricingSection } from "@/components/pricing-section"
import { FAQSection } from "@/components/faq-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <BenefitsSection />
      <EmotionalSection />
      <InvitationsSection />
      <InvitationPacks />
      <QRSection />
      <ServicesSection />
      <BeforeAfterSection />
      <PortfolioSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <Footer />
    </main>
  )
}
