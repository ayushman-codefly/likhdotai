"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Settings,
  User,
  Mail,
  Zap,
  Edit3,
  Save,
  X,
  CheckCircle,
  PenTool,
  Megaphone,
  GraduationCap,
  FileText,
  Search,
  Headphones,
  Globe,
  ArrowLeft,
} from "lucide-react"
import useSession from "@/lib/supabase/use-session"
import { getUserCredits, getUserFromDB, updateUserInDB, setUserInDB } from "@/app/api/handlers/userHandlers"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function SettingsPage() {
  const session = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [userCredits, setUserCredits] = useState(0)
  const [userInfo, setUserInfo] = useState({
    fullname: "",
    email: "",
    image: "",
    usecase: "",
  })
  const [editMode, setEditMode] = useState(false)
  const [editedInfo, setEditedInfo] = useState({
    fullname: "",
    selectedUseCases: [],
    selectedAvatar: "",
  })

  // Avatar options
  const avatarOptions = Array.from(
    { length: 10 },
    (_, i) => `https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_${i + 1}.png`,
  )

  // Use cases
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

  useEffect(() => {
    if (session?.user) {
      fetchUserData()
    }
  }, [session])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      
      // Get user credits
      const creditsResponse = await getUserCredits(session.user.id)
      setUserCredits(creditsResponse.credits || 0)

      // Get user info from database
      const userResponse = await getUserFromDB(session.user.id)
      
      let userData = {
        fullname: "",
        email: session.user.email || "",
        image: "",
        usecase: "",
      }

      if (userResponse.dbUser) {
        // Use database data if available
        userData = {
          fullname: userResponse.dbUser.fullname || "",
          email: userResponse.dbUser.email || session.user.email || "",
          image: userResponse.dbUser.image || "",
          usecase: userResponse.dbUser.usecase || "",
        }
      } else {
        // Fallback to session metadata if no DB user found
        const sessionFullname = session.user.user_metadata?.fullname || 
                               session.user.user_metadata?.full_name || 
                               session.user.user_metadata?.name ||
                               session.user.identities?.[0]?.identity_data?.full_name ||
                               session.user.identities?.[0]?.identity_data?.name ||
                               ""
        
        userData = {
          fullname: sessionFullname,
          email: session.user.email || "",
          image: session.user.user_metadata?.image || 
                 session.user.user_metadata?.avatar_url || 
                 session.user.user_metadata?.picture ||
                 session.user.identities?.[0]?.identity_data?.avatar_url ||
                 session.user.identities?.[0]?.identity_data?.picture ||
                 "",
          usecase: session.user.user_metadata?.usecase || "",
        }
      }
      
      // If fullname is still empty, try to extract from email
      if (!userData.fullname && userData.email) {
        const emailName = userData.email.split('@')[0].replace(/[._]/g, ' ')
        const capitalizedName = emailName.split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ')
        userData.fullname = capitalizedName
      }
      
      setUserInfo(userData)
      setEditedInfo({
        fullname: userData.fullname,
        selectedUseCases: getUseCaseIdsFromTitles(userData.usecase),
        selectedAvatar: userData.image,
      })
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUseCaseToggle = (useCaseId) => {
    setEditedInfo(prev => ({
      ...prev,
      selectedUseCases: prev.selectedUseCases.includes(useCaseId)
        ? prev.selectedUseCases.filter(id => id !== useCaseId)
        : [...prev.selectedUseCases, useCaseId]
    }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      
      const userData = {
        id: session.user.id,
        fullname: editedInfo.fullname,
        email: userInfo.email,
        image: editedInfo.selectedAvatar,
        usecase: getUseCaseTitlesFromIds(editedInfo.selectedUseCases).join(", "),
      }

      // Check if user exists in database
      const userResponse = await getUserFromDB(session.user.id)
      let saveResponse
      
      if (userResponse.dbUser) {
        // User exists, update them
        saveResponse = await updateUserInDB(userData)
      } else {
        // User doesn't exist, create them
        saveResponse = await setUserInDB(userData)
      }
      
      if (saveResponse.error) {
        console.error("Error saving user data:", saveResponse.error)
        throw new Error("Failed to save user data")
      }
      
      // Update local state
      setUserInfo({
        ...userInfo,
        fullname: editedInfo.fullname,
        image: editedInfo.selectedAvatar,
        usecase: getUseCaseTitlesFromIds(editedInfo.selectedUseCases).join(", "),
      })
      
      setEditMode(false)
    } catch (error) {
      console.error("Error saving user data:", error)
      // You might want to show a toast notification or error message to the user here
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditedInfo({
      fullname: userInfo.fullname,
      selectedUseCases: getUseCaseIdsFromTitles(userInfo.usecase),
      selectedAvatar: userInfo.image,
    })
    setEditMode(false)
  }

  const getSelectedUseCaseTitles = (useCaseString) => {
    if (!useCaseString) return []
    return useCaseString.split(", ").map(s => s.trim()).filter(Boolean)
  }

  const getUseCaseIdsFromTitles = (useCaseString) => {
    if (!useCaseString) return []
    const titles = useCaseString.split(", ").map(s => s.trim()).filter(Boolean)
    // Case-insensitive matching to handle minor inconsistencies
    return useCases.filter(useCase => 
      titles.some(title => title.toLowerCase() === useCase.title.toLowerCase())
    ).map(useCase => useCase.id)
  }

  const getUseCaseTitlesFromIds = (useCaseIds) => {
    if (!useCaseIds || useCaseIds.length === 0) return []
    return useCases.filter(useCase => useCaseIds.includes(useCase.id)).map(useCase => useCase.title)
  }

  const getUserInitials = (email) => {
    if (!email) return "U"
    return email.charAt(0).toUpperCase()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4 overflow-x-hidden">
      <div className="max-w-4xl mx-auto space-y-4 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Button>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-blue-600" />
              <h1 className="text-xl font-bold text-slate-900">Settings</h1>
            </div>
            {!editMode && (
              <Button
                onClick={() => {
                  // Ensure edit form is populated with current data
                  setEditedInfo({
                    fullname: userInfo.fullname,
                    selectedUseCases: getUseCaseIdsFromTitles(userInfo.usecase),
                    selectedAvatar: userInfo.image,
                  })
                  setEditMode(true)
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </Button>
            )}
          </div>
        </div>

        {/* Profile Card */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900">Profile Information</CardTitle>
            <CardDescription>Manage your account details and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Profile Overview */}
            <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
              <Avatar className="w-20 h-20">
                <AvatarImage src={userInfo.image} alt={userInfo.fullname} />
                <AvatarFallback className="bg-blue-600 text-white text-lg">
                  {getUserInitials(userInfo.email)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-slate-900">{userInfo.fullname || "User"}</h3>
                <p className="text-slate-600 flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>{userInfo.email}</span>
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <Zap className="w-4 h-4 text-yellow-600" />
                  <span className={`font-medium ${userCredits <= 0 ? 'text-red-600' : userCredits <= 5 ? 'text-orange-600' : 'text-green-600'}`}>
                    {userCredits} Credits Available
                  </span>
                </div>
              </div>
            </div>

            {editMode ? (
              /* Edit Mode */
              <div className="space-y-4">
                {/* Name Edit */}
                <div className="space-y-2">
                  <Label htmlFor="fullname" className="text-sm font-medium text-slate-700">
                    Full Name
                  </Label>
                  <Input
                    id="fullname"
                    value={editedInfo.fullname}
                    onChange={(e) => setEditedInfo(prev => ({ ...prev, fullname: e.target.value }))}
                    placeholder="Enter your full name"
                    className="h-10 border-2 text-black border-slate-200 focus:border-blue-500 rounded-lg"
                  />
                </div>

                {/* Avatar Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-slate-700">Choose Avatar</Label>
                  <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 max-h-32 overflow-y-auto">
                    {avatarOptions.map((avatar, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setEditedInfo(prev => ({ ...prev, selectedAvatar: avatar }))}
                        className={`relative p-1 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                          editedInfo.selectedAvatar === avatar
                            ? "border-blue-500 bg-blue-50 ring-1 ring-blue-200"
                            : "border-slate-200 hover:border-blue-300"
                        }`}
                      >
                        <Image
                          src={avatar}
                          alt={`Avatar ${index + 1}`}
                          width={40}
                          height={40}
                          className="rounded-md"
                        />
                        {editedInfo.selectedAvatar === avatar && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Use Cases Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-slate-700">Use Cases</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                    {useCases.map((useCase) => (
                      <button
                        key={useCase.id}
                        type="button"
                        onClick={() => handleUseCaseToggle(useCase.id)}
                        className={`p-3 rounded-lg border-2 text-left transition-all duration-200 hover:shadow-md ${
                          editedInfo.selectedUseCases.includes(useCase.id)
                            ? "border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 ring-1 ring-blue-200"
                            : "border-slate-200 bg-white hover:border-blue-300"
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          <div
                            className={`p-1.5 rounded-md ${
                              editedInfo.selectedUseCases.includes(useCase.id)
                                ? "bg-blue-500 text-white"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            <useCase.icon className="w-3 h-3" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-slate-900 text-xs truncate">{useCase.title}</h4>
                            <p className="text-xs text-slate-600 leading-tight" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{useCase.description}</p>
                          </div>
                          {editedInfo.selectedUseCases.includes(useCase.id) && (
                            <CheckCircle className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-3">
                  <Button
                    onClick={handleCancel}
                    className="flex-1 h-10 bg-red-300 text-black hover:text-white hover:bg-red-400"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={saving || !editedInfo.fullname.trim() || editedInfo.selectedUseCases.length === 0}
                    className="flex-1 h-10 text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              /* View Mode */
              <div className="space-y-4">
                {/* Current Use Cases */}
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-3">Selected Use Cases</h4>
                  {userInfo.usecase ? (
                    <div className="flex flex-wrap gap-2">
                      {getSelectedUseCaseTitles(userInfo.usecase).map((title, index) => (
                        <Badge key={index} className="bg-blue-100 text-blue-800 border-blue-200">
                          {title}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-sm">No use cases selected</p>
                  )}
                </div>

                {/* Account Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <Zap className="w-8 h-8 text-blue-600" />
                      <div>
                        <p className="text-sm text-blue-600 font-medium">Credits</p>
                        <p className="text-2xl font-bold text-blue-900">{userCredits}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                      <div>
                        <p className="text-sm text-green-600 font-medium">Use Cases</p>
                        <p className="text-2xl font-bold text-green-900">
                          {userInfo.usecase ? getSelectedUseCaseTitles(userInfo.usecase).length : 0}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <User className="w-8 h-8 text-purple-600" />
                      <div>
                        <p className="text-sm text-purple-600 font-medium">Account</p>
                        <p className="text-lg font-bold text-purple-900">Active</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Credits Information */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-slate-900 flex items-center space-x-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              <span>Credits Information</span>
            </CardTitle>
            <CardDescription>Your monthly credits and usage</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-medium text-yellow-900">Current Balance</p>
                  <p className="text-2xl font-bold text-yellow-800">{userCredits} Credits</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-yellow-700">Resets monthly</p>
                  <p className="text-sm text-yellow-600">Free tier: 100 credits/month</p>
                </div>
              </div>
              
              {userCredits <= 0 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 font-medium text-sm">No credits remaining</p>
                  <p className="text-red-600 text-xs">Credits will reset at the beginning of next month</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 