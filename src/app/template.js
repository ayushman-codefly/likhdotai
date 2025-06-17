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
  return (
    <div className="h-screen w-screen">
        <div className="fixed left-4 bottom-4">
            {/* <ModeToggle /> */}
        </div>
      {children}
      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-600 rounded-lg flex items-center justify-center">
                <Type className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold">Likh.AI</span>
            </div>
            <div className="flex space-x-6 mb-4 md:mb-0">
              <a href="/" className="text-slate-400 hover:text-white transition-colors">Home</a>
              <a href="/contact" className="text-slate-400 hover:text-white transition-colors">Contact</a>
              <a href="/careers" className="text-slate-400 hover:text-white transition-colors">Careers</a>
              <a href="/privacy" className="text-slate-400 hover:text-white transition-colors">Privacy</a>
              <a href="/eula" className="text-slate-400 hover:text-white transition-colors">Terms and Conditions</a>
            </div>
            <div className="flex items-center space-x-2 text-slate-400">
              <p>© 2025 Likh.AI — Made with</p>
              <Heart className="w-4 h-4 text-red-500" />
              <p>for Indian languages</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}