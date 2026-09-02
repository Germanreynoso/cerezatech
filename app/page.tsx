import { SiteChrome } from "@/components/site-chrome"
import { HeroSection } from "@/components/hero-section"
import { SocialProofSection } from "@/components/social-proof-section"
import { ProblemSolutionSection } from "@/components/problem-solution-section"
import { ServicesSection } from "@/components/services-section"
import { BenefitsSection } from "@/components/benefits-section"
import { WorkSection } from "@/components/work-section"
import { ProcessSection } from "@/components/process-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { PricingSection } from "@/components/pricing-section"
import { FAQSection } from "@/components/faq-section"
import { FinalCtaSection } from "@/components/final-cta-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <>
      <SiteChrome />
      <main className="min-h-screen">
        <HeroSection />
        <SocialProofSection />
        <ProblemSolutionSection />
        <ServicesSection />
        <BenefitsSection />
        <WorkSection />
        <ProcessSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <FinalCtaSection />
      </main>
      <Footer />
    </>
  )
}
