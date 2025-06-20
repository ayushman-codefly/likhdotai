"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Mail, Phone, MapPin, Linkedin, Building, Clock } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"

// Configurable constants - easy to modify
const CONTACT_INFO = {
  email: "contact@likh.ai",
  phone: "+91 99339 72298",
  whatsappLink: "https://wa.me/919933972298",
  address: {
    line1: "Likh.AI Technologies Pvt. Ltd.",
    line2: "Block A, 3rd Floor, Tech Hub",
    line3: "Sector 62, Noida, Uttar Pradesh",
    pincode: "201309",
    country: "India",
  },
  businessHours: {
    weekdays: "Monday - Friday: 9:00 AM - 6:00 PM IST",
    weekends: "Saturday: 10:00 AM - 2:00 PM IST",
    closed: "Sunday: Closed",
  },
}

const TEAM_INFO = {
  founder: {
    name: "Janajit Bagchi",
    role: "CEO & Founder",
    initials: "JB",
    image: "./janajit.png",
    linkedin: "https://www.linkedin.com/in/janajit-bagchi-20a085174/",
    bio: "Passionate about empowering Indian language professionals with cutting-edge AI technology that understands our unique linguistic needs.",
  },
}

const ContactPage = () => {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(true)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-600 hover:text-slate-900"
                onClick={() => router.push("/")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <div className="w-px h-6 bg-slate-300" />
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  Likh.AI
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-blue-100 opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-6 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300">
              <Mail className="w-4 h-4 mr-1" />
              Get in Touch
            </Badge>

            <h1
              className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 transition-all duration-1000 transform ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
            >
              <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                Contact
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 bg-clip-text text-transparent">
                Likh.AI
              </span>
            </h1>

            <p
              className={`text-xl sm:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto transition-all duration-1000 delay-300 transform ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
            >
              Ready to transform your typing experience? Have questions about enterprise solutions?
              <span className="text-blue-600 font-semibold"> We'd love to hear from you.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">Multiple ways to reach us</h2>
            <p className="text-lg text-slate-600">Choose the method that works best for you</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Email Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8 text-center">
                <Mail className="w-14 h-14 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Email Us</h3>
                <p className="text-slate-600 mb-4">For general inquiries and support</p>
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="text-blue-600 font-semibold hover:text-blue-700 transition-colors text-lg"
                >
                  {CONTACT_INFO.email}
                </a>
              </CardContent>
            </Card>

            {/* WhatsApp Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8 text-center">
                <Phone className="w-14 h-14 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">WhatsApp</h3>
                <p className="text-slate-600 mb-4">Quick questions and instant support</p>
                <a
                  href={CONTACT_INFO.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-semibold hover:text-blue-700 transition-colors text-lg"
                >
                  {CONTACT_INFO.phone}
                </a>
              </CardContent>
            </Card>

            {/* Address Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 md:col-span-2 lg:col-span-1">
              
            <CardContent className="p-8 text-center">
                <Clock className="w-14 h-14 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Business Hours</h3>
                <p className="text-slate-600 mb-4">Quick questions and instant support</p>
                <span
                  href={CONTACT_INFO.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-semibold hover:text-blue-700 transition-colors text-lg"
                >
                  {CONTACT_INFO.businessHours.weekdays}
                </span>
                <p className="text-sm text-slate-500 mt-4">
                We typically respond to emails within 24 hours during business days
              </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Business Hours */}
      {/* <section className="py-20 bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl">
            <CardContent className="p-8 text-center">
              <Clock className="w-14 h-14 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Business Hours</h3>
              <div className="space-y-3 text-slate-600">
                <p className="text-lg">{CONTACT_INFO.businessHours.weekdays}</p>
                <p className="text-lg">{CONTACT_INFO.businessHours.weekends}</p>
                <p className="text-lg font-semibold text-slate-700">{CONTACT_INFO.businessHours.closed}</p>
              </div>
              <p className="text-sm text-slate-500 mt-4">
                We typically respond to emails within 24 hours during business days
              </p>
            </CardContent>
          </Card>
        </div>
      </section> */}

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-300">Meet the Founder</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">The visionary behind Likh.AI</h2>
            <p className="text-lg text-slate-600">
              Building for the people who power India's language industries — one keystroke at a time.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl">
              <CardContent className="p-8 text-center">
                <Avatar className="w-32 h-32 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-blue-600">
                  <AvatarImage src={TEAM_INFO.founder.image || "/placeholder.svg"} alt={TEAM_INFO.founder.initials} />
                  <AvatarFallback className="text-white text-3xl font-bold">
                    {TEAM_INFO.founder.initials}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{TEAM_INFO.founder.name}</h3>
                <p className="text-blue-600 font-semibold mb-4">{TEAM_INFO.founder.role}</p>
                <p className="text-slate-600 mb-6">{TEAM_INFO.founder.bio}</p>
                <a
                  href={TEAM_INFO.founder.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors font-semibold"
                >
                  <Linkedin className="w-5 h-5" />
                  <span>Connect on LinkedIn</span>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enterprise Solutions */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl">
            <CardContent className="p-8 text-center">
              <Building className="w-14 h-14 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Enterprise Solutions</h3>
              <p className="text-slate-600 mb-6 text-lg">
                Looking for custom integrations, bulk licenses, or specialized features for your organization? Let's
                discuss how Likh.AI can be tailored to your specific needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-full"
                  onClick={() =>
                    window.open(`mailto:${CONTACT_INFO.email}?subject=Enterprise Solutions Inquiry`, "_blank")
                  }
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email for Enterprise
                </Button>
                <Button
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-full"
                  onClick={() => window.open(CONTACT_INFO.whatsappLink, "_blank")}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  WhatsApp Us
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

    </div>
  )
}

export default ContactPage
