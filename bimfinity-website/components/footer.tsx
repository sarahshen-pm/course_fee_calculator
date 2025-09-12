import { MapPin, Phone, Mail } from "lucide-react"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <div className="mb-4">
              <Image src="/bimfinity-logo.png" alt="BIMFINITY" width={120} height={30} className="h-8 w-auto" />
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Leading BIM consultancy firm providing comprehensive Building Information Modelling services across
              Singapore, China, and Malaysia since 2014.
            </p>
          </div>

          <div className="lg:col-span-4">
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3 text-muted-foreground">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 mt-1 text-primary" />
                <div className="text-sm">
                  <div>Singapore Headquarters</div>
                  <div>Branches in China & Malaysia</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-sm">+65 1234 5678</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-sm">info@bimfinity.sg</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-end">
            <div className="flex flex-col items-center">
              <Image 
                src="/WhatsApp.png" 
                alt="WhatsApp QR Code" 
                width={120} 
                height={120} 
                className="rounded-lg shadow-sm"
              />
              <p className="text-sm text-muted-foreground mt-2 text-center">
                Scan to contact us
              </p>
            </div>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">© 2025 BIMFINITY INTERNATIONAL. All rights reserved.</p>
          {/* <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">
              Terms of Service
            </a>
          </div> */}
        </div>
      </div>
    </footer>
  )
}
