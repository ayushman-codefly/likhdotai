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

export default function OnboardingPage({ userId, email,checkUserOnboarded }) {
  const [name, setName] = useState("")
  const [selectedAvatar, setSelectedAvatar] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedUseCases, setSelectedUseCases] = useState([])
  const router = useRouter()

  // Generate avatar URLs from toon_1.png to toon_10.png
  const avatarOptions = Array.from(
    { length: 10 },
    (_, i) => `https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_${i + 1}.png`,
  )

  const useCases = [
    {
      id: "content-creation",
      title: "Content Creation",
      description: "Blogs, articles, creative writing",
      icon: PenTool,
    },
    {
      id: "marketing",
      title: "Marketing & Sales",
      description: "Email campaigns, social media, ads",
      icon: Megaphone,
    },
    {
      id: "education",
      title: "Education & Training",
      description: "Course materials, presentations, guides",
      icon: GraduationCap,
    },
    {
      id: "business",
      title: "Business Communication",
      description: "Reports, proposals, documentation",
      icon: FileText,
    },
    {
      id: "research",
      title: "Research & Analysis",
      description: "Data analysis, research papers, summaries",
      icon: Search,
    },
    {
      id: "entertainment",
      title: "Entertainment & Media",
      description: "Scripts, stories, podcasts, videos",
      icon: Headphones,
    },
    {
      id: "translation",
      title: "Translation & Localization",
      description: "Multi-language content, cultural adaptation",
      icon: Globe,
    },
    {
      id: "personal",
      title: "Personal Projects",
      description: "Personal writing, journaling, creative projects",
      icon: User,
    },
  ]

  const handleUseCaseToggle = (useCaseId) => {
    setSelectedUseCases(prev => {
      if (prev.includes(useCaseId)) {
        return prev.filter(id => id !== useCaseId)
      } else {
        return [...prev, useCaseId]
      }
    })
  }

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !selectedAvatar || selectedUseCases.length === 0) return

    setIsSubmitting(true)
    try {
      const userData = {
        id: userId,
        fullname: name.trim(),
        email,
        image: selectedAvatar,
        usecase: selectedUseCases.join(", "), // Store as comma-separated string
      }

      // Here you would typically make an API call to save the data
      // Simulate API delay
      const { dbUser, error } = await setUserInDB({ ...userData })
      setIsCompleted(true)
    } catch (error) {
      console.error("Error completing onboarding:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getSelectedUseCaseTitles = () => {
    return selectedUseCases.map(id => 
      useCases.find(uc => uc.id === id)?.title
    ).filter(Boolean).join(", ")
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="text-center space-y-8">
              {/* Success Animation */}
              <div className="relative">
                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <div className="absolute inset-0 w-20 h-20 mx-auto bg-gradient-to-r from-green-400 to-green-500 rounded-full animate-ping opacity-20"></div>
              </div>

              {/* User Preview */}
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-4">
                  <div className="relative">
                    <Image
                      src={selectedAvatar}
                      alt="Selected avatar"
                      width={80}
                      height={80}
                      className="rounded-full border-4 border-blue-200"
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-left">
                      <p className="font-semibold text-slate-900">{name}</p>
                      <p className="text-slate-600 text-sm">{email}</p>
                      {selectedUseCases.length > 0 && (
                        <p className="text-blue-600 text-sm font-medium">
                          {getSelectedUseCaseTitles()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Welcome Message */}
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold text-slate-900">You're all set!</h3>
                <p className="text-slate-600">
                  Welcome to Likh.AI! Your account has been created successfully. 
                  You can now start creating amazing content with our AI-powered tools.
                </p>
              </div>

              {/* CTA Button */}
              <Button
                onClick={() => {
                  checkUserOnboarded()
                  router.push('/dashboard')
                }}
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Creating
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
            Welcome to Likh.AI
          </CardTitle>
          <CardDescription className="text-lg text-slate-600 mt-2">
            Let's set up your account in just a few steps
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8 pt-4">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600">Step {currentStep} of 3</span>
              <span className="text-sm text-slate-500">{Math.round((currentStep / 3) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Name */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-slate-900">What's your name?</h3>
                  <p className="text-slate-600">This helps us personalize your experience</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      autoComplete="off"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-12 text-black text-lg border-2 border-slate-200 focus:border-blue-500 rounded-xl"
                      required
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">Email Address</p>
                        <p className="text-sm text-blue-700">{email}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="pt-4 flex justify-end">
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    disabled={!name.trim()}
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Avatar Selection */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-slate-900">Choose your avatar</h3>
                  <p className="text-slate-600">Pick an avatar that represents you</p>
                </div>

                <div className="grid grid-cols-5 gap-4">
                  {avatarOptions.map((avatar, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedAvatar(avatar)}
                      className={`relative p-2 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                        selectedAvatar === avatar
                          ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                          : "border-slate-200 hover:border-blue-300"
                      }`}
                    >
                      <Image
                        src={avatar}
                        alt={`Avatar ${index + 1}`}
                        width={60}
                        height={60}
                        className="rounded-lg"
                      />
                      {selectedAvatar === avatar && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {!selectedAvatar && (
                  <p className="text-sm text-slate-500 text-center">Please select an avatar</p>
                )}

                {/* Navigation Buttons */}
                <div className="pt-4 flex space-x-4">
                  <Button
                    type="button"
                    onClick={handlePrevStep}
                    variant="outline"
                    size="lg"
                    className="flex-1 border-2 border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-4 text-lg rounded-full transition-all duration-300"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    disabled={!selectedAvatar}
                    size="lg"
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Use Case Selection (Multi-select) */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Type className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-slate-900">What will you use Likh.AI for?</h3>
                  <p className="text-slate-600">Select all that apply to personalize your experience</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {useCases.map((useCase) => (
                      <button
                        key={useCase.id}
                        type="button"
                        onClick={() => handleUseCaseToggle(useCase.id)}
                        className={`p-4 rounded-xl border-2 text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                          selectedUseCases.includes(useCase.id)
                            ? "border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 ring-2 ring-blue-200"
                            : "border-slate-200 bg-white hover:border-blue-300"
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div
                            className={`p-2 rounded-lg ${
                              selectedUseCases.includes(useCase.id)
                                ? "bg-blue-500 text-white"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            <useCase.icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-900 mb-1">{useCase.title}</h4>
                            <p className="text-sm text-slate-600">{useCase.description}</p>
                          </div>
                          {selectedUseCases.includes(useCase.id) && <CheckCircle className="w-5 h-5 text-blue-500 mt-1" />}
                        </div>
                      </button>
                    ))}
                  </div>

                  {selectedUseCases.length === 0 && (
                    <p className="text-sm text-slate-500 text-center">Please select at least one use case</p>
                  )}

                  {selectedUseCases.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <p className="text-sm font-medium text-blue-900 mb-2">Selected use cases:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedUseCases.map(id => {
                          const useCase = useCases.find(uc => uc.id === id)
                          return (
                            <Badge key={id} className="bg-blue-100 text-blue-800 border-blue-200">
                              {useCase?.title}
                            </Badge>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation Buttons */}
                <div className="pt-4 flex space-x-4">
                  <Button
                    type="button"
                    onClick={handlePrevStep}
                    variant="outline"
                    size="lg"
                    className="flex-1 border-2 border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-4 text-lg rounded-full transition-all duration-300"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back
                  </Button>
                  <Button
                    type="submit"
                    size="lg"
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={selectedUseCases.length === 0 || isSubmitting}
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
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
