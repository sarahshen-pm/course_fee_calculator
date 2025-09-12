import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Users, Award, Mail } from "lucide-react"
import Image from "next/image"

export default function CareersPage() {
  const jobPositions = [
    {
      title: "BIM Coordinator",
      department: "Engineering",
      location: "Singapore",
      type: "Full-time",
      experience: "2-3 years",
      description:
        "Lead project coordination in BIM workflow and ensure model compatibility across all project participants.",
      responsibilities: [
        "Lead or assist for the various project co-ordination in BIM workflow",
        "Involve in Structure/Architecture/MEP coordinations between consultants, main contractors, and subcontractors",
        "Ensure all models are compatible and BIM data is available to all project participants",
        "Checking models and shop drawings prepared by BIM Modellers",
        "Good knowledge in BIM software like AutoCAD 2D/3D, Bentley Open Roads, Revit, Navisworks & MicroStation",
      ],
      requirements: [
        "At least Diploma/Advance/Higher/Graduate Diploma/Degree/Professional Degree in Engineering",
        "At Least 2-3 years of working experience in related field",
        "Able to work well independently and in a team",
        "Experienced in AutoCAD 2D/3D, Bentley Open Roads, Revit, Navisworks & MicroStation",
        "Experience in BIM model development & coordination",
      ],
    },
    {
      title: "BIM Modeler",
      department: "Design",
      location: "Singapore",
      type: "Full-time",
      experience: "1+ years",
      description:
        "Prepare detailed design documents and perform modeling & drafting works using BIM authoring software.",
      responsibilities: [
        "Prepare drawings and detailed design documents for preliminary, construction and as-built status",
        "Report and assist the BIM Manager/Coordinator/Engineer in charge",
        "Use Building Information Modelling (BIM) to perform modeling & drafting works",
        "Familiar with BIM documentations and shop drawings production from the models",
        "Create and update BIM models based on BIM guidelines and requirements",
      ],
      requirements: [
        "Certificate from BCA, BIM Modelling course or equivalent",
        "Diploma or Degree in Engineering",
        "Minimally 1 year experience in BIM Modeling work in building construction",
        "Experienced in AutoCAD 2D/3D, Bentley Open Roads, Revit, Navisworks & MicroStation",
        "Must be proficient in BIM modelling & draft operational level",
      ],
    },
    {
      title: "Trainee/Internship Program",
      department: "Training",
      location: "Singapore",
      type: "Internship",
      experience: "Entry Level",
      description: "On-job training program for fresh graduates and students interested in BIM technology.",
      responsibilities: [
        "Participate in project meetings",
        "Basic modelling based on project requirement",
        "Drawing production using BIM",
        "Able to communicate and exchange information with required stakeholders",
      ],
      requirements: [
        "Currently pursuing or recently completed Diploma/Degree in Engineering",
        "Interest in BIM technology and construction industry",
        "Basic knowledge of CAD software is preferred",
        "Good communication and learning attitude",
      ],
    },
  ]

  const benefits = [
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      title: "Professional Development",
      description: "Continuous learning opportunities and BIM certification support",
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Collaborative Environment",
      description: "Work with industry experts and innovative project teams",
    },
    {
      icon: <MapPin className="h-8 w-8 text-primary" />,
      title: "Prime Location",
      description: "Modern office space in Singapore's business district",
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "Work-Life Balance",
      description: "Flexible working arrangements and comprehensive benefits",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Join Us to Build Your Digital Future
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty mb-8">
            Be part of our innovative team and help shape the future of Building Information Modeling technology
          </p>
          <div className="relative w-full max-w-4xl mx-auto rounded-lg overflow-hidden shadow-lg">
            <video
              src="/video/career_1.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-64 md:h-80 object-cover"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose Bimfinity?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join a leading BIM consultancy that values innovation, growth, and excellence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">{benefit.icon}</div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{benefit.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Open Positions</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore exciting career opportunities in BIM technology and digital construction
            </p>
          </div>

          <div className="space-y-8">
            {jobPositions.map((job, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <CardTitle className="text-2xl text-primary mb-2">{job.title}</CardTitle>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">{job.department}</Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {job.location}
                        </Badge>
                        <Badge variant="outline">{job.type}</Badge>
                        <Badge variant="outline">{job.experience}</Badge>
                      </div>
                    </div>
                    {/* <Button className="md:w-auto">Apply Now</Button> */} {/* TODO: Add link to apply */}
                  </div>
                  <CardDescription className="text-base mt-4">{job.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Key Responsibilities:</h4>
                      <ul className="space-y-2 text-muted-foreground">
                        {job.responsibilities.map((responsibility, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                            <span className="text-sm">{responsibility}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Requirements:</h4>
                      <ul className="space-y-2 text-muted-foreground">
                        {job.requirements.map((requirement, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                            <span className="text-sm">{requirement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Ready to Start Your Journey?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Don't see a position that matches your skills? We're always looking for talented individuals to join our
            team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              enquiry@bimfinity.sg
            </Button>
            <p className="text-muted-foreground">Send us your resume and we'll get in touch!</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
