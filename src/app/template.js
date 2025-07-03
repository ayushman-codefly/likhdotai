"use client"

import * as React from "react"
import { Heart, Moon, Sun, Type } from "lucide-react"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import Image from "next/image"

function ModeToggle() {
  const { setTheme } = useTheme()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function Template({ children }) {
  const pathname = usePathname()
  return (
    <div className="h-screen w-screen bg-white">
        <div className="fixed left-4 bottom-4">
            {/* <ModeToggle /> */}
        </div>
      {children}
      {/* Fixed Footer */}
      {(pathname !== "/onboarding" && pathname!== "/dashboard") && (
        <>
      <div className="py-20 md:py-10 lg:py-0 bg-white"></div>
      <footer className="relative bottom-0 left-0 right-0 bg-white border-t border-blue-200 z-40 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Image
                    src="/Likh.png"
                    alt="Likh.AI"
                    width={100}
                    height={30}
                    className="h-6 w-auto"
                  />
                </div>
                <div className="flex items-center space-x-6 text-sm text-slate-600">
                  <a href="/privacy" className="hover:text-slate-900 transition-colors">Privacy</a>
                  <a href="/eula" className="hover:text-slate-900 transition-colors">EULA</a>
                  <a href="/careers" className="hover:text-slate-900 transition-colors">Careers</a>
                  <a href="/contact" className="hover:text-slate-900 transition-colors">Contact</a>
                </div>
                <div className="text-xs text-slate-500">
                  © 2024 Likh.AI. All rights reserved.
                </div>
              </div>
            </div>
          </footer>
          </>
      )}
    </div>
  )
}