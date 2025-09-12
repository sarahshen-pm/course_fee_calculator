import { Card, CardContent } from "@/components/ui/card"
import { Target, Eye } from "lucide-react"

export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-balance">
            About <span className="text-primary">BIMFINITY</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            Founded in 2014, BIMFINITY INTERNATIONAL is a leading consultancy firm headquartered in Singapore, with
            branches in China and Malaysia, specializing in Building Information Modelling solutions.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
              <img 
                src="/general_images/professional-bim-team-working-on-construction-proj.jpg" 
                alt="BIMFINITY Team" 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">WHO ARE WE?</h3>
            <p className="text-muted-foreground leading-relaxed">
              BIMFINITY INTERNATIONAL focuses on Building Information Modelling (BIM) Project Management Consultant, BIM
              Application and BIM Competency Training. We provide one-stop BIM services throughout the entire building
              construction cycle.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We have a vibrant team of professionals which is constantly innovating and looking for opportunities to
              create great values for our clients.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 pt-6">
              <Card className="border-l-4 border-l-primary">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-2">Our Mission</h4>
                      <p className="text-muted-foreground leading-relaxed text-sm">
                        The preferred BIM Consultant in the region using technology and people.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-accent">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <div className="bg-accent/10 p-2 rounded-lg">
                      <Eye className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-2">Our Vision</h4>
                      <p className="text-muted-foreground leading-relaxed text-sm">
                        With integrity and professionalism, we aim to create and maximize values for our Clients.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
