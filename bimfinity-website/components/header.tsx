"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname?.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <Image
                src="/bimfinity-logo.png"
                alt="Bimfinity Logo"
                width={180}
                height={40}
                className="h-8 w-auto cursor-pointer"
                priority
              />
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className={`transition-colors ${isActive("/") ? "text-primary" : "text-foreground hover:text-primary"}`} aria-current={isActive("/") ? "page" : undefined}>
              Home
            </Link>
            <Link href="/services" className={`transition-colors ${isActive("/services") ? "text-primary" : "text-foreground hover:text-primary"}`} aria-current={isActive("/services") ? "page" : undefined}>
              Service
            </Link>
            <Link href="/projects" className={`transition-colors ${isActive("/projects") ? "text-primary" : "text-foreground hover:text-primary"}`} aria-current={isActive("/projects") ? "page" : undefined}>
              Projects
            </Link>
            <Link href="/careers" className={`transition-colors ${isActive("/careers") ? "text-primary" : "text-foreground hover:text-primary"}`} aria-current={isActive("/careers") ? "page" : undefined}>
              Careers
            </Link>
          </nav>


          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              <Link
                href="/"
                className="block px-3 py-2 text-foreground hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/services"
                className="block px-3 py-2 text-foreground hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Service
              </Link>
              <Link
                href="/projects"
                className="block px-3 py-2 text-foreground hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Projects
              </Link>
              <Link
                href="/careers"
                className="block px-3 py-2 text-foreground hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Careers
              </Link>

            </div>
          </div>
        )}
      </div>
    </header>
  )
}
