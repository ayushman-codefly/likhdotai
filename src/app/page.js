"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Mic,
  Zap,
  Globe,
  Users,
  CheckCircle,
  Star,
  ArrowRight,
  Sparkles,
  Brain,
  Type,
  Languages,
  Mail,
  PenTool,
  Megaphone,
  BookOpen,
  FileText,
  Headphones,
  GraduationCap,
  Search,
  Phone,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import useSession from "@/lib/supabase/use-session"

const LikhAILanding = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [currentFeature, setCurrentFeature] = useState(0)

  const user = useSession()?.user

  const router = useRouter()
  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 3)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const features = [
    { icon: Type, title: "Smart Typing", desc: "Any layout, any font" },
    { icon: Mic, title: "Voice Input", desc: "Speak in Indian languages" },
    { icon: Brain, title: "AI Assistant", desc: "Grammar & tone correction" },
  ]

  const mockups = [
    { title: "Clean Interface", gradient: "from-blue-500 to-purple-600" },
    { title: "Voice Input", gradient: "from-green-500 to-blue-500" },
    { title: "Smart Suggestions", gradient: "from-purple-500 to-pink-500" },
  ]

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 via-white to-lime-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-lime-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              {/* <div className="w-8 h-8 bg-gradient-to-r from-lime-500 to-lime-600 rounded-lg flex items-center justify-center">
                <Type className="w-4 h-4 text-white" />
              </div> */}
              <span className="text-xl font-bold bg-gradient-to-r from-lime-600 to-lime-700 bg-clip-text text-transparent">
                Likh.AI
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-slate-900 transition-colors">
                Features
              </a>
              <a href="#team" className="text-slate-600 hover:text-slate-900 transition-colors">
                Team
              </a>
              <Button
                className="bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700"
                onClick={() => router.push(user ? "/dashboard" : "/signup")}
              >
                {user ? "Dashboard" : "Join Free"}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-lime-50 to-lime-100 opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-6 bg-gradient-to-r from-lime-100 to-lime-200 text-lime-800 border-lime-300">
              <Sparkles className="w-4 h-4 mr-1" />
              Get 3 Months FREE – then just ₹5000/year
            </Badge>

            <h1
              className={`text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 transition-all duration-1000 transform ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
            >
              <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                Likho with
              </span>
              <br />
              <span className="bg-gradient-to-r from-lime-500 via-lime-600 to-lime-700 bg-clip-text text-transparent">
                Likh.AI
              </span>
            </h1>

            <p
              className={`text-xl sm:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto transition-all duration-1000 delay-300 transform ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
            >
              Your always-on Indian language typing assistant. Type effortlessly in
              <span className="text-lime-600 font-semibold"> Hindi, Bangla, Odia & more</span> — with voice typing,
              smart suggestions, and instant grammar help.
            </p>

            <div
              className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 transition-all duration-1000 delay-500 transform ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                {user ? "Dashboard" : "Join Free for 3 months"}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <p className="text-sm text-slate-500">No payment. No pressure. Just pure typing magic.</p>
            </div>

            {/* Animated Feature Cards */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br from-lime-100 to-lime-200 rounded-3xl"
                >
                  <CardContent className="p-8 text-center">
                    <feature.icon className="w-24 h-24 mx-auto mb-4 text-lime-600" />
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-slate-600">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-blue-100 text-blue-800">Our Mission</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                India types. A lot. But we're still stuck using tools from the 90s.
              </h2>
              <p className="text-lg text-slate-600 mb-6">
                DTP operators, publishing houses, printing presses, and broadcasters are all using outdated, offline
                software. It's slow, clunky, and built for another era.
              </p>
              <p className="text-lg text-slate-900 font-semibold mb-8">
                <span className="text-orange-600">Likh.AI</span> is here to change that.
              </p>
              <div className="space-y-4">
                {[
                  "Eliminate the hassles of typing in Indian scripts",
                  "Enhance accuracy with smart AI-powered assistance",
                  "Deliver a seamless user experience that works across tools",
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-slate-600">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-lime-100 to-lime-200 rounded-3xl p-8 h-96 flex items-center justify-center">
                <div className="text-center">
                  <Languages className="w-24 h-24 text-lime-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Made for India</h3>
                  <p className="text-slate-600">Proudly built for Indian language professionals</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section id="features" className="py-20 bg-gradient-to-br from-lime-50 to-lime-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-lime-100 text-lime-800 border-lime-300">What We're Building</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">Features that make typing effortless</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-lime-100 to-lime-200 rounded-3xl">
              <CardContent className="p-8 text-center">
                <Zap className="w-24 h-24 text-lime-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Start Smart</h3>
                <div className="space-y-3 text-left">
                  {[
                    "Type in any layout: Inscript, Modular, Phonetic",
                    "Fonts that work: Unicode + Non-Unicode",
                    "Integrates with Word, CorelDRAW, InDesign, Photoshop",
                    "Spelling & word suggestions, real-time help",
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-lime-600 flex-shrink-0" />
                      <p className="text-slate-600">{item}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-lime-100 to-lime-200 rounded-3xl">
              <CardContent className="p-8 text-center">
                <Brain className="w-24 h-24 text-lime-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Get Smarter</h3>
                <div className="space-y-3 text-left">
                  {[
                    "Voice typing that works in Indian languages",
                    "Grammar correction made for print quality",
                    "AI that completes sentences, corrects tone",
                    "Speeds up your work across all platforms",
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-lime-600 flex-shrink-0" />
                      <p className="text-slate-600">{item}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Visual Mockups */}
          {/* <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Sneak Peek</h3>
            <p className="text-slate-600 mb-8">Here's a glimpse at what it'll feel like:</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {mockups.map((mockup, index) => (
              <Card key={index} className="border-0 shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className={`h-48 bg-gradient-to-br ${mockup.gradient} relative flex items-center justify-center`}>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-white text-center">
                    <Play className="w-8 h-8 mx-auto mb-2 opacity-80 group-hover:opacity-100 transition-opacity" />
                    <p className="font-semibold">Preview</p>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h4 className="font-semibold text-slate-900">{mockup.title}</h4>
                  <p className="text-sm text-slate-600">Interactive mockup coming soon</p>
                </CardContent>
              </Card>
            ))}
          </div> */}
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-lime-100 text-lime-800 border-lime-300">Who We Serve</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
              Perfect for every Indian language professional
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              From content creators to government offices, Likh.AI empowers professionals across industries to type
              faster, smarter, and more accurately in Indian languages.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => (
              <Card
                key={useCase.id}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-lime-100 to-lime-200 rounded-3xl group"
              >
                <CardContent className="p-8 text-center">
                  <useCase.icon className="w-16 h-16 text-lime-600 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{useCase.title}</h3>
                  <p className="text-slate-600 text-sm">{useCase.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-slate-600 mb-6">
              "Whether you're typing a single document or managing enterprise-level content, Likh.AI scales with your
              needs."
            </p>
          </div>
        </div>
      </section>

      {/* Why Sign Up */}
      <section className="pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-800">Limited Time Offer</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">Why You Should Sign Up Today</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Star, title: "First 3 Months Free", desc: "Limited time offer for all early users" },
              {
                icon: Users,
                title: "Partner Discounts",
                desc: "Special rates for DTP teams, publishers & media houses",
              },
              {
                icon: Globe,
                title: "Influence Our Roadmap",
                desc: "Your feedback matters — help us build what you need",
              },
              {
                icon: CheckCircle,
                title: "Lock in Early Pricing",
                desc: "₹5000/year regular pricing after free period",
              },
            ].map((benefit, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-lime-100 to-lime-200 rounded-3xl"
              >
                <CardContent className="p-8 text-center">
                  <benefit.icon className="w-24 h-24 text-lime-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{benefit.title}</h3>
                  <p className="text-slate-600">{benefit.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 bg-gradient-to-br from-lime-50 to-lime-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-lime-100 text-lime-800 border-lime-300">Meet the Founder</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">The visionary behind Likh.AI</h2>
            <p className="text-lg text-slate-600">
              Building for the people who power India's language industries — one keystroke at a time.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-lime-100 to-lime-200 rounded-3xl">
              <CardContent className="p-8 text-center">
                <Avatar className="w-32 h-32 mx-auto mb-6 bg-gradient-to-r from-lime-500 to-lime-600">
                <AvatarImage src="./janajit.png" alt={"JB"} />
                  <AvatarFallback className="text-white text-3xl font-bold">JB</AvatarFallback>
                </Avatar>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Janajit Bagchi</h3>
                <p className="text-lime-600 font-semibold mb-4">CEO & Founder</p>
                <p className="text-slate-600">
                  Passionate about empowering Indian language professionals with cutting-edge AI technology that
                  understands our unique linguistic needs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-800">Get in Touch</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
              Ready to transform your typing experience?
            </h2>
            <p className="text-lg text-slate-600">
              Have questions? Want to discuss enterprise solutions? We'd love to hear from you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-lime-100 to-lime-200 rounded-3xl">
              <CardContent className="p-8 text-center">
                <Mail className="w-24 h-24 text-lime-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Email Us</h3>
                <p className="text-slate-600 mb-4">For general inquiries and support</p>
                <a
                  href="mailto:contact@likh.ai"
                  className="text-lime-600 font-semibold hover:text-lime-700 transition-colors text-lg"
                >
                  contact@likh.ai
                </a>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-lime-100 to-lime-200 rounded-3xl">
              <CardContent className="p-8 text-center">
                <Phone className="w-24 h-24 text-lime-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-900 mb-2">WhatsApp</h3>
                <p className="text-slate-600 mb-4">Quick questions and instant support</p>
                <a
                  href="https://wa.me/919933972298"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lime-600 font-semibold hover:text-lime-700 transition-colors text-lg"
                >
                  +91 99339 72298
                </a>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <div className="bg-gradient-to-br from-lime-100 to-lime-200 rounded-3xl p-8 max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Enterprise Solutions</h3>
              <p className="text-slate-600 mb-6">
                Looking for custom integrations, bulk licenses, or specialized features for your organization? Let's
                discuss how Likh.AI can be tailored to your specific needs.
              </p>
              <Button
                className="bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white px-6 py-3 rounded-full"
                onClick={() => window.open("mailto:contact@likh.ai?subject=Enterprise Solutions Inquiry", "_blank")}
              >
                Contact for Enterprise
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="py-20 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">We're going live soon!</h2>
          <p className="text-xl mb-8 opacity-90">
            Be the first to experience India's smartest typing assistant. Join the early access list — and be part of
            the writing revolution.
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
            <p className="text-2xl font-bold mb-2">3 months free</p>
            <p className="opacity-90">then just ₹5000/year per license</p>
          </div>
          <Button
            size="lg"
            className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-4 text-lg rounded-full shadow-lg"
            onClick={() => router.push(user ? "/dashboard" : "/signup")}
          >
            <Mail className="w-5 h-5 mr-2" />
            Sign Up Now
          </Button>
        </div>
      </section> */}
    </div>
  )
}

export default LikhAILanding
