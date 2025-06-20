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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-300">
            <CardContent className="p-8">
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="h-16 w-16 border-4 border-blue-200">
                  <AvatarImage src={dbUser?.image || "/placeholder.svg"} alt={dbUser?.fullname || "User"} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xl">
                    {dbUser?.fullname?.charAt(0) || user?.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Welcome back, {dbUser?.fullname || "User"}!
                  </h1>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className="bg-gradient-to-r from-blue-200 to-blue-300 text-blue-800 border-blue-400">
                      <UserIcon className="w-3 h-3 mr-1" />
                      {dbUser?.usecase ? useCaseTitles[dbUser.usecase] : "Getting Started"}
                    </Badge>
                    <Badge className="bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-orange-300">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Early Access
                    </Badge>
                  </div>
                </div>
              </div>
              <div className=" rounded-2xl p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">🚀 Likh.AI is Coming Soon!</h3>
                <p className="text-slate-700">
                  We're putting the finishing touches on India's most advanced typing assistant. Get ready to
                  revolutionize how you type in Indian languages on Windows!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Demos */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300">
              <Play className="w-4 h-4 mr-1" />
              Feature Previews
            </Badge>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">
              See Likh.AI in Action
            </h2>
            <p className="text-slate-600 text-lg">Experience the power of AI-driven Indian language typing</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Main Demo */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-300">
              <CardContent className="p-6">
                <div className="aspect-square bg-gradient-to-br from-blue-200 to-blue-300 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-blue-600/20"></div>
                  <div className="relative text-center">
                    <FeatureIcon className="w-16 h-16 text-blue-700 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{FeatureTitle}</h3>
                    <p className="text-slate-700 text-sm">{FeatureDescription}</p>
                  </div>
                </div>
                <div className="flex justify-center space-x-2">
                  {features.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveDemo(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === activeDemo ? "bg-blue-500" : "bg-blue-200"
                      }`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Feature List */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-6 h-6 text-blue-600" />
                  <span className="text-slate-900">Powerful Features for Windows</span>
                </CardTitle>
                <CardDescription className="text-slate-500">Everything you need for professional Indian language typing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all cursor-pointer ${
                      index === activeDemo
                        ? "bg-gradient-to-r from-blue-200 to-blue-300"
                        : "hover:bg-gradient-to-r hover:from-blue-100 hover:to-blue-200"
                    }`}
                    onClick={() => setActiveDemo(index)}
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-300 to-blue-400 rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-4 h-4 text-blue-700" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900">{feature.title}</h4>
                    </div>
                    <Badge className="bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-orange-300 text-xs">
                      {feature.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Supported Languages */}
        <div className="mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-300">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2">
                <Globe className="w-6 h-6 text-blue-600" />
                <span className="text-slate-900">Supported Languages</span>
              </CardTitle>
              <CardDescription className="text-slate-500">Type effortlessly in multiple Indian languages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {languages.map((lang, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 transition-all duration-300 text-center"
                  >
                    <div className="text-2xl font-bold text-slate-900 mb-1">{lang.script}</div>
                    <div className="text-sm font-semibold text-slate-700">{lang.name}</div>
                    <div className="text-xs text-slate-600">{lang.users} speakers</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Section */}
        <div className="mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100  transition-all duration-300">
            <CardHeader className="text-center">
              <Badge className="mb-4 bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-orange-300">
                <Star className="w-4 h-4 mr-1" />
                Early Bird Pricing
              </Badge>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Simple, Transparent Pricing
              </CardTitle>
              <CardDescription className="text-lg text-slate-500">Professional Indian language typing for everyone</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-w-md mx-auto">
                <div className="bg-gradient-to-br from-blue-200 to-blue-300 rounded-2xl p-8 text-center">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <IndianRupee className="w-8 h-8 text-slate-900" />
                    <span className="text-4xl font-bold text-slate-900">5,000</span>
                  </div>
                  <p className="text-slate-700 font-semibold mb-2">per year, per language</p>
                  <p className="text-slate-600 text-sm mb-6">Billed annually • Cancel anytime</p>

                  <div className="space-y-3 mb-6">
                    {[
                      "All typing features included",
                      "AI-powered assistance",
                      "Windows integration",
                      "Regular updates",
                      "Email support",
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-blue-700" />
                        <span className="text-slate-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Get Early Access
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button> */}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Typing?</h3>
            <p className="text-blue-100 mb-6 text-lg">
              Join thousands of professionals who are already signed up for early access to Likh.AI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Beta (Soon)
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg rounded-full"
              >
                View Documentation
              </Button>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  )
}

export default Dashboard
