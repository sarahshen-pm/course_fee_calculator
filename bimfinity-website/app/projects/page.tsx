"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import Image from "next/image"

type ProjectStatus = "all" | "ongoing" | "completed"

interface Project {
  id: string
  title: string
  status: "ongoing" | "completed"
  category: string
  description: string
  image: string
  date: string
}

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState<ProjectStatus>("all")

  const projects: Project[] = [
    {
      id: "contract-50-hdb",
      title: "Contract 50_HDB",
      status: "ongoing",
      category: "Residential Development",
      description:
        "HDB residential development project at Geylang featuring comprehensive BIM coordination and digital delivery solutions.",
      image: "/projects_images/Contract 50_HDB.jpeg",
      date: "2024-11-28",
    },
    {
      id: "p102",
      title: "P102_Cross Island Line",
      status: "ongoing",
      category: "Transportation Infrastructure",
      description:
        "Major rail infrastructure project involving comprehensive BIM modeling and coordination for Singapore's Cross Island Line development.",
      image: "/projects_images/P102_Cross Island Line.jpg",
      date: "2024-11-28",
    },
    {
      id: "t235",
      title: "T235_RTS Link",
      status: "ongoing",
      category: "Cross-Border Transportation",
      description:
        "Rapid Transit System Link project connecting Singapore and Malaysia, featuring advanced BIM coordination and digital delivery solutions.",
      image: "/projects_images/T235 RTS LINK.jpg",
      date: "2024-12-09",
    },
    {
      id: "p103",
      title: "P103_Cross Island Line",
      status: "ongoing",
      category: "Transportation Infrastructure",
      description:
        "Continuation of the Cross Island Line project with focus on station development and tunnel construction coordination.",
      image: "/projects_images/P103_Cross Island Line.jpg",
      date: "2024-12-03",
    },
    {
      id: "j101",
      title: "J101_Jurong Region Line",
      status: "ongoing",
      category: "Regional Transportation",
      description:
        "Jurong Region Line development focusing on sustainable transportation solutions and integrated BIM workflows.",
      image: "/projects_images/J101_Jurong Region Line.jpg",
      date: "2024-12-05",
    },
    {
      id: "j105",
      title: "J105_Jurong Region Line",
      status: "ongoing",
      category: "Regional Transportation",
      description:
        "Advanced section of Jurong Region Line with complex station designs and multi-disciplinary coordination.",
      image: "/projects_images/J105_Jurong Region Line.jpg",
      date: "2024-12-09",
    },
    {
      id: "j106",
      title: "J106_Jurong Region Line",
      status: "ongoing",
      category: "Regional Transportation",
      description:
        "Strategic section of Jurong Region Line featuring innovative construction methodologies and BIM implementation.",
      image: "/projects_images/J106_Jurong Region Line.jpg",
      date: "2024-12-05",
    },
    {
      id: "j120",
      title: "J120_Jurong Region Line",
      status: "ongoing",
      category: "Regional Transportation",
      description:
        "Final phase of Jurong Region Line development with comprehensive digital delivery and quality assurance.",
      image: "/projects_images/J120_Jurong Region Line.jpg",
      date: "2024-12-09",
    },
    {
      id: "c3a",
      title: "C3A_TWRP",
      status: "ongoing",
      category: "Water Infrastructure",
      description:
        "Tuas Water Reclamation Plant project involving advanced water treatment facility design and BIM coordination.",
      image: "/projects_images/C3A_TWRP.jpg",
      date: "2025-02-28",
    },
    {
      id: "thcc",
      title: "Thomson Community Club",
      status: "ongoing",
      category: "Community Infrastructure",
      description:
        "Community facility development with focus on sustainable design and integrated building systems coordination.",
      image: "/projects_images/Thomson Community Club.jpg",
      date: "2024-11-28",
    },
    {
      id: "tengah",
      title: "Tengah PA C8",
      status: "ongoing",
      category: "Residential Development",
      description:
        "Tengah residential development project featuring smart city integration and comprehensive BIM workflows.",
      image: "/projects_images/Tengah PA C8.jpg",
      date: "2024-12-03",
    },
    {
      id: "hillview-cc",
      title: "Hillview Community Club",
      status: "completed",
      category: "Community Infrastructure",
      description:
        "Successfully completed community club project featuring modern facilities and sustainable design principles with comprehensive BIM implementation.",
      image: "/projects_images/Hillview Community Club.jpg",
      date: "2024-12-03",
    },
    {
      id: "fengshan-cc",
      title: "FengShan Community Club",
      status: "completed",
      category: "Community Infrastructure",
      description:
        "Completed community club development with focus on accessibility and modern amenities, delivered through advanced BIM coordination.",
      image: "/projects_images/FengShan-Community-Club.jpg",
      date: "2024-11-28",
    },
    {
      id: "hdb-yishun",
      title: "HDB YiShun N4 C18",
      status: "completed",
      category: "Residential Development",
      description:
        "Successfully delivered HDB residential project at YiShun featuring innovative design solutions and comprehensive digital delivery.",
      image: "/projects_images/HDB YiShun N4 C18.jpg",
      date: "2024-12-03",
    },
    {
      id: "enabling-village",
      title: "Enabling Village",
      status: "completed",
      category: "Healthcare Infrastructure",
      description:
        "Specialized healthcare facility project completed with focus on accessibility and inclusive design through advanced BIM methodologies.",
      image: "/projects_images/Enabling Village.jpg",
      date: "2024-11-28",
    },
    {
      id: "ntu-north-spine",
      title: "North Spine Academic Building at NTU",
      status: "completed",
      category: "Educational Infrastructure",
      description:
        "Major academic building project at Nanyang Technological University featuring cutting-edge educational facilities and sustainable design.",
      image: "/projects_images/North Spine Academic Building at NTU.jpg",
      date: "2024-11-28",
    },
    {
      id: "holy-innocent",
      title: "Holy Innocent High School",
      status: "completed",
      category: "Educational Infrastructure",
      description:
        "Completed educational facility project with modern learning environments and comprehensive building systems integration.",
      image: "/projects_images/Holy Innocent High School.jpg",
      date: "2024-11-28",
    },
    {
      id: "safra-punggol",
      title: "Safra Punggol Club",
      status: "completed",
      category: "Recreation Infrastructure",
      description:
        "Successfully delivered recreational facility with comprehensive sports and community amenities through advanced BIM coordination.",
      image: "/projects_images/Safra Punggol Club.jpg",
      date: "2024-11-28",
    },
    {
      id: "ascent",
      title: "Ascent",
      status: "completed",
      category: "Commercial Development",
      description:
        "Completed commercial development at Science Park Singapore featuring innovative office spaces and sustainable building systems.",
      image: "/projects_images/Ascent.jpg",
      date: "2024-11-28",
    },
    {
      id: "scdf",
      title: "SCDF Civil Defense Academy",
      status: "completed",
      category: "Government Infrastructure",
      description:
        "Successfully completed Singapore Civil Defense Force training facility with specialized emergency response infrastructure.",
      image: "/projects_images/SCDF.jpg",
      date: "2024-11-28",
    },
    {
      id: "pasir-ris-hawker",
      title: "Pasir Ris Hawker Centre",
      status: "completed",
      category: "Community Infrastructure",
      description:
        "Modern hawker centre development featuring contemporary design and comprehensive food court facilities with advanced building systems.",
      image: "/projects_images/Pasir Ris Hawker Centre.jpg",
      date: "2024-11-28",
    },
    {
      id: "artyzen-cuscanden",
      title: "Artyzen Cuscanden Singapore",
      status: "completed",
      category: "Hospitality Development",
      description:
        "Luxury hotel development project featuring premium hospitality facilities and sophisticated architectural design with comprehensive BIM coordination.",
      image: "/projects_images/Artyzen Cuscanden Singapore.jpg",
      date: "2024-11-15",
    },
    {
      id: "ikea-tebrau",
      title: "IKEA Tebrau",
      status: "completed",
      category: "Retail Development",
      description:
        "Large-scale retail facility project in Johor Bahru featuring modern retail spaces and comprehensive building systems integration.",
      image: "/projects_images/IKEA Tebrau.jpg",
      date: "2024-11-05",
    },
    {
      id: "equinix-sg2",
      title: "Equinix SG2",
      status: "completed",
      category: "Data Center Infrastructure",
      description:
        "State-of-the-art data center facility featuring advanced cooling systems and critical infrastructure with precision BIM modeling.",
      image: "/projects_images/Equinix SG2.jpg",
      date: "2024-11-28",
    },
    {
      id: "yishun-polyclinic",
      title: "Yishun Polyclinic",
      status: "completed",
      category: "Healthcare Infrastructure",
      description:
        "Comprehensive healthcare facility combining polyclinic and senior care center services with accessible design and modern medical facilities.",
      image: "/projects_images/Yishun Polyclinic.jpeg",
      date: "2024-12-05",
    },
    {
      id: "tuv-sud-ibp",
      title: "TUV SUD @ IBP",
      status: "completed",
      category: "Commercial Development",
      description:
        "Professional office development at International Business Park featuring modern workplace design and comprehensive building systems.",
      image: "/projects_images/TUV SUD @ IBP_1.jpg",
      date: "2024-12-05",
    },
    {
      id: "lusail-city-18-blocks",
      title: "Lusail City Project 18 Blocks",
      status: "completed",
      category: "Mixed-Use Development",
      description:
        "Large-scale mixed-use development project in Qatar featuring 18 residential and commercial blocks with comprehensive urban planning.",
      image: "/projects_images/Lusail City Project 18 Blocks.jpg",
      date: "2024-12-03",
    },
  ]

  const filteredProjects = projects.filter((project) => {
    if (activeFilter === "all") return true
    return project.status === activeFilter
  })

  const getStatusBadge = (status: string) => {
    return status === "ongoing" ? (
      <Badge variant="default" className="bg-blue-100 text-blue-800">
        On-going
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-green-100 text-green-800">
        Completed
      </Badge>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">Our Projects</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Explore our portfolio of successful BIM implementations across various infrastructure and development
            projects.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 px-4 border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              variant={activeFilter === "all" ? "default" : "outline"}
              onClick={() => setActiveFilter("all")}
              className="min-w-[100px]"
            >
              All
            </Button>
            <Button
              variant={activeFilter === "ongoing" ? "default" : "outline"}
              onClick={() => setActiveFilter("ongoing")}
              className="min-w-[100px]"
            >
              Ongoing
            </Button>
            <Button
              variant={activeFilter === "completed" ? "default" : "outline"}
              onClick={() => setActiveFilter("completed")}
              className="min-w-[100px]"
            >
              Completed
            </Button>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="h-full hover:shadow-lg transition-shadow group">
                <div className="relative overflow-hidden rounded-t-lg">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">{getStatusBadge(project.status)}</div>
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-lg leading-tight">{project.title}</CardTitle>
                      <CardDescription className="text-sm text-primary font-medium mt-1">
                        {project.category}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{project.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{new Date(project.date).toLocaleDateString()}</span>
                    {/* <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                      Learn More
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </Button> */} {/* TODO: Add link to project */}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground">No projects found for the selected filter.</p>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-balance">Project Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">{projects.length}</div>
              <div className="text-muted-foreground">Total Projects</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">
                {projects.filter((p) => p.status === "ongoing").length}
              </div>
              <div className="text-muted-foreground">Ongoing Projects</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">
                {projects.filter((p) => p.status === "completed").length}
              </div>
              <div className="text-muted-foreground">Completed Projects</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
