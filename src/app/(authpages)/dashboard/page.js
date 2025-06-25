"use client"

import { useState, useEffect } from "react"
import { getUserFromDB } from "@/app/api/handlers/userHandlers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Type,
  Mic,
  Brain,
  Zap,
  Globe,
  BookOpen,
  CheckCircle,
  Sparkles,
  LogOut,
  Settings,
  User,
  PenTool,
  Megaphone,
  FileText,
  Headphones,
  GraduationCap,
  Search,
  Play,
  Download,
  Star,
  ArrowRight,
  Keyboard,
  Languages,
  ToggleLeft,
  IndianRupee,
} from "lucide-react"
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client"
import useSession from "@/lib/supabase/use-session"
import { useRouter } from "next/navigation"
import OnboardingPage from "@/components/onboarding-page"
import dynamic from "next/dynamic"

const EditorPage = dynamic(() => import('@/app/_reusable/Editor'), {
  ssr: false,
});

function Dashboard() {
  const session = useSession()
  const user = session?.user
  const [dbUser, setDbUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeDemo, setActiveDemo] = useState(0);
  const [showOnboard,setShowOnboard] = useState(false);

  const supabase = createSupabaseBrowserClient()
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    sessionStorage.clear()
    router.push("/")
  }

  const checkUserOnboarded = async () => {
    if (!user?.email) return

    try {
      const { dbUser: userData, error } = await getUserFromDB(user.id)
      if (!error && !userData) {
        setShowOnboard(true);
      } else if (!error && userData) {
        setDbUser(userData)
        setShowOnboard(false);
      }
    } catch (error) {
      console.log("Error fetching user:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!user) {
      // router.push('/login')
      return
    }
    checkUserOnboarded()
  }, [user])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDemo((prev) => (prev + 1) % 7)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const useCaseIcons = {
    "content-creation": PenTool,
    translation: Globe,
    "digital-marketing": Megaphone,
    publishing: BookOpen,
    government: FileText,
    "customer-support": Headphones,
    education: GraduationCap,
    research: Search,
  }

  const useCaseTitles = {
    "content-creation": "Content Creation",
    translation: "Translation & Localization",
    "digital-marketing": "Digital Marketing & Social Media",
    publishing: "Publishing & Print Media",
    government: "Government & Legal Documentation",
    "customer-support": "Customer Support & Communication",
    education: "Education & E-learning",
    research: "Research & Linguistics",
  }

  const features = [
    {
      icon: Type,
      title: "Phonetic Typing",
      description: "Type Hindi using English keyboard with intelligent phonetic conversion",
      demoGif: "/placeholder.svg?height=300&width=400",
      status: "Coming Soon",
    },
    {
      icon: Keyboard,
      title: "Indic Keyboard Support",
      description: "Native support for all major Indic keyboard layouts and scripts",
      demoGif: "/placeholder.svg?height=300&width=400",
      status: "Coming Soon",
    },
    {
      icon: CheckCircle,
      title: "Smart Spell Checker",
      description: "Advanced spell checking for Hindi, Bengali, Odia and more languages",
      demoGif: "/placeholder.svg?height=300&width=400",
      status: "Coming Soon",
    },
    {
      icon: Brain,
      title: "Grammar Checker",
      description: "AI-powered grammar correction for professional Indian language content",
      demoGif: "/placeholder.svg?height=300&width=400",
      status: "Coming Soon",
    },
    {
      icon: ToggleLeft,
      title: "Hotkey Toggle",
      description: "Instantly enable/disable Likh.AI with customizable hotkeys",
      demoGif: "/placeholder.svg?height=300&width=400",
      status: "Coming Soon",
    },
    {
      icon: Languages,
      title: "Smart Translation",
      description: "Seamless translation between English and Indian languages",
      demoGif: "/placeholder.svg?height=300&width=400",
      status: "Coming Soon",
    },
    {
      icon: Mic,
      title: "Speech to Text",
      description: "Convert your voice to text in multiple Indian languages",
      demoGif: "/placeholder.svg?height=300&width=400",
      status: "Coming Soon",
    },
  ]

  const languages = [
    { name: "Hindi", script: "हिंदी", users: "500M+" },
    { name: "Bengali", script: "বাংলা", users: "300M+" },
    { name: "Odia", script: "ଓଡ଼ିଆ", users: "50M+" },
  ]

  const FeatureIcon = features[activeDemo].icon
  const FeatureTitle = features[activeDemo].title
  const FeatureDescription = features[activeDemo].description

  if(showOnboard){
    return (
        <OnboardingPage userId={user?.id} email={user?.email} checkUserOnboarded={checkUserOnboarded} />
    )
  }

  if (isLoading && !showOnboard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
        <Card className="w-full max-w-md border-0 shadow-2xl bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-300">
          <CardContent className="pt-6 text-center">
            <p className="text-slate-600 mb-4">Please sign in to access your dashboard</p>
            <Button
              onClick={() => router.push("/")}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const UserIcon = dbUser?.usecase ? useCaseIcons[dbUser.usecase] : User

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Type className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                Likh.AI
              </span>
            </div>

            {/* User Avatar Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border-2 border-blue-200 hover:border-blue-400 transition-colors">
                    <AvatarImage src={dbUser?.image || "/placeholder.svg"} alt={dbUser?.fullname || "User"} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                      {dbUser?.fullname?.charAt(0) || user?.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{dbUser?.fullname || "User"}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span onClick={()=>router.push('/profile')}>Profile</span>
                </DropdownMenuItem> */}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
      <EditorPage />
    </div>
  )
}

export default Dashboard
