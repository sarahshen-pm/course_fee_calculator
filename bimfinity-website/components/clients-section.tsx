export function ClientsSection() {
  const clients = [
    {
      name: "CCDC",
      logo: "/clients_images/CCDCLogo-MZo100.png"
    },
    {
      name: "China Communications Construction",
      logo: "/clients_images/China Communications Construction.png"
    },
    {
      name: "China Railway 11",
      logo: "/clients_images/China Railway 11.png"
    },
    {
      name: "Chip Eng Seng Corporation",
      logo: "/clients_images/Chip-Eng-Seng-Corporation-Ltd-e1731378642471.png"
    },
    {
      name: "DPE",
      logo: "/clients_images/DPE-1-e1732780181293.png"
    },
    {
      name: "Hytech Builders",
      logo: "/clients_images/Hytech-Builders-Pte-Ltd.png"
    },
    {
      name: "Nakano",
      logo: "/clients_images/Nakano.png"
    },
    {
      name: "Qing Feng",
      logo: "/clients_images/QING FENG.png"
    },
    {
      name: "Qing Jian",
      logo: "/clients_images/QING JIAN.png"
    },
    {
      name: "TOA Corporation",
      logo: "/clients_images/TOA CORPORATION.jpg"
    }
  ]

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-balance">
            Our <span className="text-primary">Clients</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Trusted by leading construction and architecture firms across the region
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center">
          {clients.map((client, index) => (
            <div
              key={index}
              className="flex items-center justify-center p-4 hover:scale-105 transition-transform duration-300"
            >
              <img
                src={client.logo}
                alt={client.name}
                className="max-h-12 w-auto"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
