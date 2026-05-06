import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { BenefitsSection } from "@/components/benefits-section"
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
      <BeforeAfterSection />
      <PortfolioSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <Footer />
    </main>
  )
}
