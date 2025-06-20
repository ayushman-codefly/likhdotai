import { Type, Sparkles } from "lucide-react"
import { LoginForm } from "@/components/login-form"
import { Badge } from "@/components/ui/badge"


export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2 bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        {/* Header with Likh.AI branding */}
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white flex size-8 items-center justify-center rounded-lg">
              <Type className="size-4" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              Likh.AI
            </span>
          </a>
          <Badge className="ml-auto bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300">
            <Sparkles className="w-3 h-3 mr-1" />
            Sign In
          </Badge>
        </div>

        {/* Form Container */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-slate-500">
          Secure login powered by{" "}
          <a href="#" className="text-blue-600 hover:text-blue-700 underline underline-offset-4">
            Supabase
          </a>
        </div>
      </div>

      {/* Right side with gradient and pattern */}
      <div className="relative hidden lg:block bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent"></div>
        <div className="absolute top-1/3 left-1/3 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-56 h-56 bg-white/5 rounded-full blur-2xl"></div>

        {/* Content overlay */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-12 text-white">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto">
              <Type className="w-10 h-10 text-white" />
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-bold">Welcome Back!</h2>
              <p className="text-xl text-blue-100 max-w-md">
                Continue your journey with Likh.AI. Access your personalized typing assistant and create amazing content
                in Indian languages.
              </p>
            </div>
          </div>
        </div>

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="login-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#login-grid)" />
          </svg>
        </div>
      </div>
    </div>
  )
}
