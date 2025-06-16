"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  Sparkles,
  Type,
  User,
  Mail,
  PenTool,
  Globe,
  Megaphone,
  BookOpen,
  FileText,
  Headphones,
  GraduationCap,
  Search,
  ArrowLeft,
  ArrowRight,
} from "lucide-react"
import { setUserInDB } from "@/app/api/handlers/userHandlers"
import { useRouter } from "next/navigation"

export default function OnboardingPage({ userId, email }) {
  const [name, setName] = useState("")
  const [selectedAvatar, setSelectedAvatar] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedUseCase, setSelectedUseCase] = useState(null)
  const router = useRouter()

  // Generate avatar URLs from toon_1.png to toon_10.png
  const avatarOptions = Array.from(
    { length: 10 },
    (_, i) => `https://cdn.jsdelivr.net/gh/alohe/avatars/png/toon_${i + 1}.png`,
  )

  const useCases = [
    {
      id: "content-creation",
      title: "Content Creation",
      description: "Blogs, articles, creative writing",
      icon: PenTool,
    },
    {
      id: "translation",
      title: "Translation & Localization",
      description: "Multi-language content adaptation",
      icon: Globe,
    },
    {
      id: "digital-marketing",
      title: "Digital Marketing & Social Media",
      description: "Social posts, campaigns, ads",
      icon: Megaphone,
    },
    {
      id: "publishing",
      title: "Publishing & Print Media",
      description: "Books, magazines, newspapers",
      icon: BookOpen,
    },
    {
      id: "government",
      title: "Government & Legal Documentation",
      description: "Official documents, legal texts",
      icon: FileText,
    },
    {
      id: "customer-support",
      title: "Customer Support & Communication",
      description: "Help desk, client communication",
      icon: Headphones,
    },
    {
      id: "education",
      title: "Education & E-learning",
      description: "Course content, educational materials",
      icon: GraduationCap,
    },
    {
      id: "research",
      title: "Research & Linguistics",
      description: "Academic research, language studies",
      icon: Search,
    },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name.trim() || !selectedAvatar) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call to save user data
      const userData = {
        id: userId,
        name: name.trim(),
        email,
        emailVerified: true,
        image: selectedAvatar,
        usecase: selectedUseCase,
        onboarded: true,
      }

      // Here you would typically make an API call to save the data
      console.log("Saving user data:", userData)

      // Simulate API delay
      const { dbUser, error } = await setUserInDB({ ...userData })
      console.log({ dbUser, error })
      setIsCompleted(true)
    } catch (error) {
      console.error("Error completing onboarding:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNextStep = () => {
    if (currentStep === 1 && name.trim() && selectedAvatar) {
      setCurrentStep(2)
    }
  }

  const handlePrevStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1)
    }
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lime-50 via-white to-lime-100">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-lg border-b border-lime-200 px-4 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-lime-500 to-lime-600 rounded-lg flex items-center justify-center">
                <Type className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-lime-600 to-lime-700 bg-clip-text text-transparent">
                Likh.AI
              </span>
            </div>
            <Badge className="bg-gradient-to-r from-lime-100 to-lime-200 text-lime-800 border-lime-300">
              <Sparkles className="w-4 h-4 mr-1" />
              Setup Complete
            </Badge>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
          <Card className="w-full max-w-2xl border-0 shadow-2xl bg-white">
            <CardHeader className="text-center pb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-lime-500 to-lime-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-lime-400 to-lime-500 rounded-full flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Welcome to Likh.AI!
              </CardTitle>
              <CardDescription className="text-lg text-slate-600">
                Your profile has been set up successfully
              </CardDescription>
              <div className="flex justify-center space-x-2 mt-4">
                <div className="w-3 h-3 rounded-full bg-lime-500" />
                <div className="w-3 h-3 rounded-full bg-lime-500" />
              </div>
            </CardHeader>

            <CardContent className="px-8 pb-8">
              <div className="space-y-8">
                {/* Profile Summary */}
                <div className="bg-gradient-to-r from-lime-50 to-lime-100 rounded-2xl p-6">
                  <div className="flex items-center justify-center space-x-4">
                    <Image
                      src={selectedAvatar || "/placeholder.svg"}
                      alt="Your avatar"
                      width={60}
                      height={60}
                      className="rounded-full border-4 border-lime-200"
                    />
                    <div className="text-left">
                      <p className="font-semibold text-slate-900">{name}</p>
                      <p className="text-slate-600 text-sm">{email}</p>
                      {selectedUseCase && (
                        <p className="text-lime-600 text-sm font-medium">
                          {useCases.find((uc) => uc.id === selectedUseCase)?.title}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Welcome Message */}
                <div className="text-center space-y-4">
                  <h3 className="text-2xl font-bold text-slate-900">You're all set!</h3>
                  <p className="text-slate-600">
                    Start typing in Indian languages with AI-powered assistance. Your personalized experience awaits in
                    the dashboard.
                  </p>
                </div>

                {/* Navigation Buttons */}
                <div className="pt-4 flex space-x-4">
                  <Button
                    onClick={() => setIsCompleted(false)}
                    variant="outline"
                    size="lg"
                    className="flex-1 border-slate-200 text-slate-600 hover:bg-slate-50 px-8 py-4 text-lg rounded-full"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={() => router.push("/dashboard")}
                    size="lg"
                    className="flex-1 bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Continue to Dashboard
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 via-white to-lime-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-lime-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-lime-500 to-lime-600 rounded-lg flex items-center justify-center">
              <Type className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-lime-600 to-lime-700 bg-clip-text text-transparent">
              Likh.AI
            </span>
          </div>
          <Badge className="bg-gradient-to-r from-lime-100 to-lime-200 text-lime-800 border-lime-300">
            <Sparkles className="w-4 h-4 mr-1" />
            Setup Your Profile
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <Card className="w-full max-w-2xl border-0 shadow-2xl bg-white">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-lime-500 to-lime-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Complete Your Profile
            </CardTitle>
            <CardDescription className="text-lg text-slate-600">
              {currentStep === 1
                ? "Just a few details to get you started with your typing assistant"
                : "Tell us how you plan to use Likh.AI"}
            </CardDescription>
            <div className="flex justify-center space-x-2 mt-4">
              <div
                className={`w-3 h-3 rounded-full transition-colors ${currentStep >= 1 ? "bg-lime-500" : "bg-slate-200"}`}
              />
              <div
                className={`w-3 h-3 rounded-full transition-colors ${currentStep >= 2 ? "bg-lime-500" : "bg-slate-200"}`}
              />
            </div>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <form onSubmit={currentStep === 2 ? handleSubmit : (e) => e.preventDefault()} className="space-y-8">
              {currentStep === 1 && (
                <>
                  {/* Email Field (Disabled) */}
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-slate-700 font-medium flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>Email Address</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="text"
                        placeholder={email}
                        disabled
                        className="placeholder-slate-800 focus:bg-amber-500 bg-gradient-to-r from-lime-50 to-lime-100 border-lime-200 text-slate-700 h-12 text-lg"
                      />
                      <Badge
                        variant="secondary"
                        className="absolute right-3 top-3 bg-green-100 text-green-700 border-green-200"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                  </div>

                  {/* Name Field */}
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-slate-700 font-medium flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Full Name</span>
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      autoComplete="off"
                      className="text-black border-slate-200 focus:border-lime-400 focus:ring-lime-400 h-12 text-lg"
                    />
                  </div>

                  {/* Avatar Selection */}
                  <div className="space-y-4">
                    <Label className="text-slate-700 font-medium">Choose Your Avatar</Label>
                    <div className="grid grid-cols-5 gap-4">
                      {avatarOptions.map((avatarUrl, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setSelectedAvatar(avatarUrl)}
                          className={`relative rounded-full overflow-hidden border-4 transition-all duration-300 hover:scale-110 hover:shadow-lg ${
                            selectedAvatar === avatarUrl
                              ? "border-lime-500 ring-4 ring-lime-200 shadow-lg"
                              : "border-slate-200 hover:border-lime-300"
                          }`}
                        >
                          <Image
                            src={avatarUrl || "/placeholder.svg"}
                            alt={`Avatar option ${index + 1}`}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                    {!selectedAvatar && (
                      <p className="text-sm text-slate-500 text-center">Please select an avatar to continue</p>
                    )}
                  </div>

                  {/* Next Button */}
                  <div className="pt-4">
                    <Button
                      type="button"
                      onClick={handleNextStep}
                      size="lg"
                      className="w-full bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!name.trim() || !selectedAvatar}
                    >
                      Next: Choose Your Use Case
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <>
                  {/* Use Case Selection */}
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">What will you use Likh.AI for?</h3>
                      <p className="text-slate-600">This helps us personalize your experience</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      {useCases.map((useCase) => (
                        <button
                          key={useCase.id}
                          type="button"
                          onClick={() => setSelectedUseCase(useCase.id)}
                          className={`p-4 rounded-xl border-2 text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                            selectedUseCase === useCase.id
                              ? "border-lime-500 bg-gradient-to-r from-lime-50 to-lime-100 ring-2 ring-lime-200"
                              : "border-slate-200 bg-white hover:border-lime-300"
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div
                              className={`p-2 rounded-lg ${
                                selectedUseCase === useCase.id
                                  ? "bg-lime-500 text-white"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              <useCase.icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-slate-900 mb-1">{useCase.title}</h4>
                              <p className="text-sm text-slate-600">{useCase.description}</p>
                            </div>
                            {selectedUseCase === useCase.id && <CheckCircle className="w-5 h-5 text-lime-500 mt-1" />}
                          </div>
                        </button>
                      ))}
                    </div>

                    {!selectedUseCase && (
                      <p className="text-sm text-slate-500 text-center">Please select your primary use case</p>
                    )}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="pt-4 flex space-x-4">
                    <Button
                      type="button"
                      onClick={handlePrevStep}
                      variant="outline"
                      size="lg"
                      className="flex-1 border-slate-200 text-slate-600 hover:bg-slate-50 px-8 py-4 text-lg rounded-full"
                    >
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      Back
                    </Button>
                    <Button
                      type="submit"
                      size="lg"
                      className="flex-1 bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!selectedUseCase || isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Setting up your account...</span>
                        </div>
                      ) : (
                        "Complete Setup"
                      )}
                    </Button>
                  </div>
                </>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
