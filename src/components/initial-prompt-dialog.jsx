"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Wand2, PenTool, Sparkles } from "lucide-react"

export default function InitialPromptDialog({ isOpen, onClose, onUseWizard, onWriteOwn }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose} className="bg-white text-black">
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-center flex items-center justify-center gap-2 text-black">
            <Sparkles className="w-6 h-6 text-blue-600" />
            Let's Create Something Amazing!
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <p className="text-center text-gray-600 text-sm">
            How would you like to get started with your content?
          </p>
          
          <div className="space-y-3">
            <Card 
              className="cursor-pointer transition-all border-blue-100 hover:border-blue-300 bg-blue-50 hover:bg-blue-100"
              onClick={onUseWizard}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Wand2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-black">Use Smart Wizard</h3>
                    <p className="text-xs text-gray-600">
                      Answer a few questions to generate tailored content
                    </p>
                  </div>
                  <div className="text-blue-600 text-2xl">✨</div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer transition-all border-green-100 hover:border-green-300 bg-green-50 hover:bg-green-100"
              onClick={onWriteOwn}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <PenTool className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-black">Write My Own Prompt</h3>
                    <p className="text-xs text-gray-600">
                      I know exactly what I want to create
                    </p>
                  </div>
                  <div className="text-green-600 text-2xl">🎯</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 