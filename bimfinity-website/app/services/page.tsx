"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Building2, Database, Users, Wrench, GraduationCap, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"

export default function ServicesPage() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab')

  // Auto scroll to tabs section when navigating with tab parameter
  useEffect(() => {
    if (tabParam) {
      // Small delay to ensure the page has loaded
      setTimeout(() => {
        const tabsSection = document.querySelector('[data-tabs-section]')
        if (tabsSection) {
          tabsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }
  }, [tabParam])
  const services = [
    {
      id: "digital-delivery",
      icon: <Building2 className="h-8 w-8" />,
      title: "Digital Delivery",
      description:
        "For The Sustainability Of Our Future Built Environment, We Aim to Move Towards a Paperless Industry.",
      image: "/services_images/digital-delivery-service.jpg",
      features: [
        "Seamless connection with various parties involved in project with the use of advanced and secured technology",
        "Making use of digital platform for paper substitution",
        "Ensure information consistency in all circumstances",
        "Information and models available online and offline",
      ],
    },
    {
      id: "i-management",
      icon: <Database className="h-8 w-8" />,
      title: "I-Management",
      description:
        "Information of project are stored at a single common data environment (CDE) for easy tracing and reference regardless of project stages",
      image: "/services_images/information-management-service.jpg",
      features: [
        "Unlimited storage platform for all information",
        "Flexibility to upload various type of files",
        "Online viewer for pdf, dwg, rvt files",
        "Permission and security in folder management",
      ],
    },
    {
      id: "strategic-support",
      icon: <Users className="h-8 w-8" />,
      title: "Strategic Support",
      description: "A linkage between conventional project management and new BIM requirements.",
      image: "/services_images/strategic-support-service.jpg",
      features: [
        "Compliance with standards and requirements: Relevant ISO, BIM ISO 19650, Exchange Information Requirement (EIR), etc",
        "Project specific BIM deliverables like BEP, Models, Clash detection, Timeliner, etc",
        "Coordinate and collaborate with various stakeholders to minimize reworks and increase productivity",
        "Facilitate BIM implementation process",
      ],
    },
    {
      id: "tools",
      icon: <Wrench className="h-8 w-8" />,
      title: "Tools",
      description: "Using a variety of software and hardware to meet each project stages requirements",
      image: "/services_images/bim-tools-service.jpg",
      features: [
        "Recommend hardware specification: desktop and laptop",
        "Project specific software recommendation for different project stages",
        "Understands software integrations",
        "Project specific version upgrading plans",
      ],
      note: "Common software used in project includes Revit, Naviswork, AutoCAD, CostX, cubiCost, OpenBuildings, OpenSpace, OpenRail, Synchro 4D, Fuzor, etc.",
      highlight: "Bimfinity International is the authorized seller for Fuzor",
    },
    {
      id: "training",
      icon: <GraduationCap className="h-8 w-8" />,
      title: "Training",
      description: "To equip the team with knowledge to advance towards the brand new digital built environment.",
      image: "/services_images/bim-training-service.jpg",
      features: [
        "Conduct intensive learning sessions on software related to project requirement",
        "Elaborate on project requirements and BIM deliverables",
        "Provide professional BIM consultancy service for non-BIM personnel",
        "Educate in both virtual and physical classes",
      ],
    },
    {
      id: "auditing",
      icon: <CheckCircle className="h-8 w-8" />,
      title: "Auditing",
      description: "Ensure the produced deliverables are relevant and accurate",
      image: "/services_images/bim-auditing-service.jpg",
      features: [
        "Make use of Fornax platform to customize auditing templates",
        "Provide detailed checks to ensure BIM deliverables are in-line with project requirements",
        "Prepare detailed auditing reports",
        "Scheduled consistent audit checks within project timeframe",
      ],
    },
  ]

  const products = [
    {
      title: "2D - Shop Drawing",
      description:
        "Comprehensive drawing services including tender, design, construction, as-built, and fabrication drawings",
      image: "/bim_cycle_images/2d-technical-drawings-and-blueprints.jpg",
      features: ["Tender drawing", "Design drawing", "Construction drawing", "As Built drawing", "Fabrication drawing"],
    },
    {
      title: "3D - Coordination",
      description: "Advanced 3D modeling and coordination services for seamless project execution",
      image: "/bim_cycle_images/3d-bim-model-coordination.jpg",
      features: ["3D Models", "Clash detection", "Point Clouds", "Mock up", "Virtual Design and Construction (VDC)"],
    },
    {
      title: "4D - Risk Management",
      description: "Time-based project management and scheduling optimization",
      image: "/bim_cycle_images/4d-construction-scheduling-timeline.jpg",
      features: [
        "Scheduling",
        "Overall sequencing",
        "Critical sequencing",
        "Method of Statement (MOS)",
        "Traffic diversion",
      ],
    },
    {
      title: "5D - Cost Management",
      description: "Comprehensive cost analysis and quantity management solutions",
      image: "/bim_cycle_images/5d-cost-management-and-quantity-takeoff.jpg",
      features: ["Quantity for tender", "Bill of Quantity (BOQ)", "Progressive payment"],
    },
    {
      title: "6D - Facility Management",
      description: "Complete facility management and operational support systems",
      image: "/bim_cycle_images/6d-facility-management-and-building-operations.jpg",
      features: [
        "Information storage/exchange",
        "Operational and Manuals (O&M)",
        "Computer-Aid Facility Management (CAFM)",
        "Asset Information Model (AIM)",
      ],
    },
    {
      title: "BIM Integration Platform",
      description: "Unified platform connecting all BIM dimensions for seamless workflow",
      image: "/bim_cycle_images/integrated-bim-platform-dashboard.jpg", 
      features: [
        "Cross-platform integration",
        "Real-time collaboration",
        "Data synchronization",
        "Workflow automation",
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Video Section - Full Width */}
      <section className="w-full">
        <video
          src="/video/service_1.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-64 md:h-80 lg:h-96 object-cover"
        >
          Your browser does not support the video tag.
        </video>
      </section>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">One-Stop Services</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Comprehensive BIM solutions to transform your construction projects with cutting-edge technology and expertise.
          </p>
        </div>
      </section>

      {/* Services Tabs */}
      <section className="py-20 px-4" data-tabs-section>
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue={tabParam || "digital-delivery"} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mb-6 h-auto p-2 bg-muted/50 rounded-xl">
              {services.map((service) => (
                <TabsTrigger
                  key={service.id}
                  value={service.id}
                  className="text-sm font-medium py-3 px-4 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all"
                >
                  {service.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {services.map((service) => (
              <TabsContent key={service.id} value={service.id} className="mt-0">
                <Card className="w-full overflow-hidden border-0 shadow-lg">
                  <div className="grid lg:grid-cols-5 gap-0">
                    {/* Image Section - 占2列，左右保留间距 */}
                    <div className="lg:col-span-2 relative h-80 lg:h-auto min-h-[400px] p-4">
                      <div className="relative w-full h-full rounded-lg overflow-hidden">
                        {service.id === "tools" ? (
                          <ToolsImageCarousel />
                        ) : (
                          <Image
                            src={service.image || "/placeholder.svg"}
                            alt={service.title}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                    </div>

                    {/* Content Section - 占3列 */}
                    <div className="lg:col-span-3 p-8 lg:p-12 flex flex-col justify-center">
                      <CardHeader className="p-0 mb-8">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="p-3 rounded-xl bg-primary/10 text-primary">{service.icon}</div>
                          <CardTitle className="text-2xl lg:text-3xl font-bold text-foreground">
                            {service.title}
                          </CardTitle>
                        </div>
                        <CardDescription className="text-lg leading-relaxed text-muted-foreground">
                          {service.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="p-0">
                        <ul className="space-y-5">
                          {service.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start gap-4">
                              <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                              <span className="text-base text-muted-foreground leading-relaxed">{feature}</span>
                            </li>
                          ))}
                        </ul>

                        {service.id === "tools" ? (
                          <p className="mt-6 text-xs text-muted-foreground/70 italic leading-relaxed">
                            {service.note}
                            {service.highlight && (
                              <span className="block mt-1 not-italic opacity-80">{service.highlight}</span>
                            )}
                          </p>
                        ) : (
                          service.note && (
                            <div className="mt-8 p-6 bg-primary/5 rounded-xl border border-primary/10">
                              <p className="text-base text-muted-foreground mb-4 leading-relaxed">{service.note}</p>
                              {service.highlight && (
                                <Badge
                                  variant="secondary"
                                  className="text-sm font-medium bg-primary/10 text-primary border-primary/20"
                                >
                                  {service.highlight}
                                </Badge>
                              )}
                            </div>
                          )
                        )}
                      </CardContent>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-balance">The D's Cycle in BIM</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
              Discover our comprehensive BIM solutions spanning from 2D to 6D, covering every aspect of your project
              lifecycle.
            </p>
          </div>

          {/* BIM Cycle Diagram */}
          {/* <div className="mb-12 flex justify-center">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-NafnT509atmzpoiIWrs5qs2DJwLbij.png"
              alt="The D's Cycle in BIM - from 2D to 6D"
              width={800}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div> */}

          {/* Replace carousel with BIM cycle diagram image from services_images */}
          <div className="mb-12 flex justify-center">
            <Image
              src="/services_images/bim-cycle-diagram.jpg"
              alt="The D's Cycle in BIM"
              width={800}
              height={400}
              className="rounded-lg shadow-lg w-full max-w-4xl h-auto object-contain bg-muted p-2"
            />
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-balance">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground text-pretty">
              Get answers to common questions about BIM and our services.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="faq-what-is-bim">
              <AccordionTrigger className="text-left">What is BIM?</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    There are many definitions of what BIM is and in many ways it depends on your point of view or what
                    you seek to gain from the approach. Sometimes it's easier to say what BIM isn't!
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      It's not just 3D CAD
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      It's not just a new technology application
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      It's not next generation, it's here and now!
                    </li>
                  </ul>
                  <div className="mt-6">
                    <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                      <iframe
                        width="100%"
                        height="100%"
                        src="https://www.youtube.com/embed/5Qj9pI5us7o"
                        title="What is BIM?"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      ></iframe>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-outside-singapore">
              <AccordionTrigger className="text-left">Do we provide BIM services for country other than Singapore?</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground leading-relaxed">
                  Yes. BIMFINITY is an international consultation firm based in Singapore, with branches in China and
                  Malaysia. We are able to provide BIM services for countries in ASIA.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-what-can-bim-do">
              <AccordionTrigger className="text-left">What can BIM do that conventional methods can't?</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  BIM associate not only with models, it adds on information about asset components with geometry in a
                  structured way. This lets us build project documentation in a much more structured and on line way.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  BIM-enabled work allows information to be shared by different project participants and also between
                  different stages of design, construction and operation. For example, an engineer is able to use
                  information sourced from the architect to prepare energy calculations or a contractor can check the
                  coordination of contributions from different members of the project team. Programme and cost
                  information can also be captured using BIM. Most importantly, BIM has the potential to allow building
                  information to be collated and held in formats useable by the operators of facilities – enabling
                  buildings and other assets to be used and maintained efficiently.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-balance">
            Ready to Transform Your Project?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 text-pretty">
            Let our expert team help you implement cutting-edge BIM solutions tailored to your specific needs.
          </p>
          <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
            Contact Us Today
          </button>
        </div>
      </section>

      <Footer />
    </div>
  )
}

function ProductCarousel({ products }: { products: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + products.length) % products.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  // 自动轮播效果
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length)
    }, 5000) // 每5秒自动切换

    return () => clearInterval(interval)
  }, [products.length])

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-lg">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {products.map((product, index) => (
            <div key={index} className="w-full flex-shrink-0">
              <Card className="mx-4">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Image Section */}
                  <div className="relative h-64 md:h-full">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Content Section */}
                  <CardContent className="p-6">
                    <CardTitle className="text-2xl mb-4 text-primary">{product.title}</CardTitle>
                    <CardDescription className="text-base mb-6 leading-relaxed">{product.description}</CardDescription>
                    <ul className="space-y-2">
                      {product.features.map((feature: string, featureIndex: number) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          <CheckCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-primary p-2 rounded-full shadow-lg transition-colors z-10"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-primary p-2 rounded-full shadow-lg transition-colors z-10"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-6 space-x-2">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? "bg-primary" : "bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    </div>
  )
}

function ToolsImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const toolsImages = [
    "/services_images/bim-tools-service_1.jpg",
    "/services_images/bim-tools-service_2.jpg",
    "/services_images/bim-tools-service_3.jpg",
    "/services_images/bim-tools-service_4.jpg",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % toolsImages.length)
    }, 3000) // 每3秒自动切换

    return () => clearInterval(interval)
  }, [toolsImages.length])

  return (
    <div className="relative w-full h-full bg-muted">
      <Image
        src={toolsImages[currentIndex]}
        alt={`BIM Tools Service ${currentIndex + 1}`}
        fill
        className="object-contain transition-opacity duration-500"
      />
      {/* 圆点指示器 */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {toolsImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
