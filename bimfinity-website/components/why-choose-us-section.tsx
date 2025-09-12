import { Card, CardContent } from "@/components/ui/card"
import { Shield, Clock, Zap, Award } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "RELIABLE",
    points: [
      "A pool of BIM talents who are highly experienced in BIM implementation.",
      "BIMFINITY stays true to our vision, we take great pride in fulfilling our promises to Clients.",
    ],
  },
  {
    icon: Clock,
    title: "TIMELY",
    points: [
      "BIMFINITY has been able to fulfill our clients' schedules with meticulous planning.",
      "We ensure work is completed with high efficiency and, of course, with topmost quality.",
    ],
  },
  {
    icon: Zap,
    title: "EFFICIENT",
    points: [
      "With >100 databases, it acts as a comprehensive guide and reference to address requirements.",
      "We continuously improve skills through training and mentoring schemes.",
    ],
  },
  {
    icon: Award,
    title: "QUALITY",
    points: [
      "At BIMFINITY, we provide quality BIM services as a part of our integral beliefs.",
      "Rigorous standards are set consistently with reviews and feedback to exceed our clients' requirements.",
    ],
  },
]

export function WhyChooseUsSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-balance">
            Why Choose <span className="text-primary">Us?</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <Card key={index} className="text-center group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-8">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                  <div className="space-y-3">
                    {feature.points.map((point, pointIndex) => (
                      <p key={pointIndex} className="text-sm text-muted-foreground leading-relaxed">
                        {point}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
