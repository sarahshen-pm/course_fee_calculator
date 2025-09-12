import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"

export function HeroSection() {
  return (
    <section id="home" className="relative py-20 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-balance leading-tight">
                Building the Future with <span className="text-primary">BIM Technology</span>
              </h1>
              <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
                BIMFINITY INTERNATIONAL provides comprehensive Building Information Modelling (BIM) services throughout
                the entire construction lifecycle. Transform your projects with our innovative digital solutions.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="group">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline" className="group bg-transparent">
                <Play className="mr-2 h-4 w-4" />
                Watch Demo
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">10+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">100+</div>
                <div className="text-sm text-muted-foreground">Projects Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">3</div>
                <div className="text-sm text-muted-foreground">Countries</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 p-8">
              <img
                src="/general_images/modern-bim-3d-building-model-visualization.jpg"
                alt="BIM 3D Model Visualization"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-card border rounded-xl p-4 shadow-lg">
              <div className="text-sm font-medium">Digital Twin Ready</div>
              <div className="text-xs text-muted-foreground">Real-time collaboration</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
