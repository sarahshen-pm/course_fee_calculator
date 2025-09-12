import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Database, Settings, Wrench, GraduationCap, CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

const services = [
  {
    icon: FileText,
    title: "Digital Delivery",
    subtitle: "Aim towards a paperless industry for a sustainable built industry",
    description:
      "Tired of bringing so many sets of documents for a Project meeting? Can't find that particular word in that endless sets of documents? It's time for us to think about digital solutions.",
    color: "text-blue-600",
    tabId: "digital-delivery",
  },
  {
    icon: Database,
    title: "Information Management",
    subtitle: "The Common Data Environment (CDE) for everyone to utilise",
    description:
      "Worry that your information is not up to date? Information scattered all over the place? Don't miss out on value-adding resources, set up a common data platform to categorize all your project information.",
    color: "text-green-600",
    tabId: "i-management",
  },
  {
    icon: Settings,
    title: "Strategic Support",
    subtitle: "Linkage between conventional project management and digital BIM management",
    description:
      "Reaching a bottle-neck in traditional PM? Too much VOs, re-works and resources wasted? Introducing BIM Management – the earlier the BIM is implemented in a project, the greater the value generated.",
    color: "text-purple-600",
    tabId: "strategic-support",
  },
  {
    icon: Wrench,
    title: "Tools",
    subtitle: "Varieties of software and hardware to intensify each project stage's requirement",
    description:
      "Can't draw what you want in that software? Software limitation? Models didn't come out as expected? Don't depend on one – implement various software and hardware to suit your project requirement.",
    color: "text-orange-600",
    tabId: "tools",
  },
  {
    icon: GraduationCap,
    title: "Training",
    subtitle: "Produce relevant and accurate deliverables",
    description:
      "Not enough tutorial videos online while working on a project? As part of the BIM project package, we provide trainings needed for management and engineers.",
    color: "text-red-600",
    tabId: "training",
  },
  {
    icon: CheckCircle,
    title: "Audit",
    subtitle: "Produce relevant and accurate deliverables",
    description:
      "Are those information reliable? Can we build based on those? Audit checks can be planned into project timeline to enhance quality of models.",
    color: "text-teal-600",
    tabId: "auditing",
  },
]

export function ServicesSection() {
  return (
    <section id="services" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-balance">
            One-Stop Services for <span className="text-primary">Digital Twin</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            We Build Solutions to Improve Traditional Workflow
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon
            return (
              <Link key={index} href={`/services?tab=${service.tabId}`}>
                <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full flex flex-col relative">
                  <CardHeader className="flex-shrink-0 relative">
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform`}
                      >
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                        More
                      </div>
                    </div>
                    <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                    <p className="text-sm font-medium text-primary">{service.subtitle}</p>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <p className="text-muted-foreground leading-relaxed flex-1">{service.description}</p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
