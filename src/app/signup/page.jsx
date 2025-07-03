import { Type, Sparkles } from "lucide-react"
import { SignupForm } from "@/components/signup-form"
import { Badge } from "@/components/ui/badge"

export default function SignupPage() {
  return (
    <div className="grid h-screen lg:grid-cols-2 overflow-hidden">
      {/* Left side with gradient and pattern */}
      <div className="relative hidden lg:block bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent"></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>

        {/* Content overlay */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-12 text-white">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto">
              <Type className="w-10 h-10 text-white" />
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-bold">Welcome to Likh.AI</h2>
              <p className="text-xl text-blue-100 max-w-md">
                Your AI-powered typing assistant for Indian languages. Start creating content with intelligent
                suggestions and seamless language support.
              </p>
            </div>
          </div>
        </div>

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      {/* Right side with form */}
      <div className="flex flex-col overflow-y-auto">
        {/* Form Container */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md bg-none">
            <SignupForm />
          </div>
        </div>

        {/* Footer */}
        
      </div>
    </div>
  )
}
