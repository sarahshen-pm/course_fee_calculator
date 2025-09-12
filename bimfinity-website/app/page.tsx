import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { ServicesSection } from "@/components/services-section"
import { WhyChooseUsSection } from "@/components/why-choose-us-section"
import { ClientsSection } from "@/components/clients-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="w-full">
        <video
          src="/video/home_1.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-[70vh] md:h-[80vh] lg:h-[90vh] object-cover"
        >
          Your browser does not support the video tag.
        </video>
      </section>
      <main>
        <AboutSection />
        <ServicesSection />
        <WhyChooseUsSection />
        <ClientsSection />
      </main>
      <Footer />
    </div>
  )
}
