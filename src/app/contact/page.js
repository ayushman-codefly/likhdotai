"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Mail, Phone, Clock, Linkedin, Building, Sparkles, MapPin } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

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
    role: "CEO & Co-Founder",
    initials: "JB",
    image: "/janajit.png",
    linkedin: "https://www.linkedin.com/in/janajit-bagchi-20a085174/",
    bio: "Passionate about empowering Indian language professionals with cutting-edge AI technology that understands our unique linguistic needs.",
  },
}

const ContactPage = () => {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(true)

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <main>
          {/* Navigation - Fixed */}
          <nav className="fixed max-h-20 top-0 left-0 right-0 z-50 bg-white backdrop-blur-lg border-b border-blue-200">
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
                    <Image
                      src="/Likh.png"
                      alt="Likh.AI"
                      width={120}
                      height={40}
                      className="h-8 w-auto"
                    />
                  </div>
                </div>
                <div className="hidden md:flex items-center space-x-8">
                  <Link href="/careers" className="text-slate-600 hover:text-slate-900 transition-colors">
                    Careers
                  </Link>
                  <a href="#team" className="text-slate-600 hover:text-slate-900 transition-colors">
                    Team
                  </a>
                  <a href="#enterprise" className="text-slate-600 hover:text-slate-900 transition-colors">
                    Enterprise
                  </a>
                </div>
              </div>
            </div>
          </nav>

          {/* Section 1: Hero */}
          <section className="section">
            <div className="content mt-15">
              <div className="relative min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative min-h-screen text-center flex flex-col gap-10 items-center justify-center">
                  <Badge className="absolute top-40 mb-6 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300">
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
            </div>
          </section>

          {/* Section 2: Contact Methods */}
          <section className="section">
            <div className="content">
              <div className="min-h-screen bg-white flex items-center">
                <div className="max-w-7xl flex flex-col items-center mx-auto px-4 sm:px-6 lg:px-8 w-full mb-8 md:mb-8">
                  <div className="text-center my-8">
                    <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-300">
                      <Sparkles className="w-4 h-4 mr-1" />
                      Multiple Ways to Reach Us
                    </Badge>
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">Choose Your Preferred Method</h2>
                    <p className="text-lg text-slate-600">We're here to help and answer any questions you might have</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 w-4/5 md:w-full">
                    {/* Email Card */}
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-100 to-blue-200 rounded-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
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
                        <p className="text-sm text-slate-500 mt-2">We respond within 24 hours</p>
                      </CardContent>
                    </Card>

                    {/* WhatsApp Card */}
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-100 to-blue-200 rounded-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
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
                        <p className="text-sm text-slate-500 mt-2">Usually online 9 AM - 6 PM IST</p>
                      </CardContent>
                    </Card>

                    {/* Business Hours Card */}
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-100 to-blue-200 rounded-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="p-8 text-center">
                        <Clock className="w-14 h-14 text-blue-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Business Hours</h3>
                        <p className="text-slate-600 mb-4">When you can reach us</p>
                        <div className="space-y-1 text-blue-600 font-medium">
                          <p className="text-sm">Mon-Fri: 9 AM - 6 PM IST</p>
                          <p className="text-sm">Sat: 10 AM - 2 PM IST</p>
                          <p className="text-sm text-slate-500">Sunday: Closed</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Office Location */}
          <section className="section">
            <div className="content">
              <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <Card className="border-0 shadow-lg bg-white rounded-3xl">
                    <CardContent className="p-8 text-center">
                      <MapPin className="w-14 h-14 text-blue-600 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-slate-900 mb-6">Our Office</h3>
                      <div className="space-y-2 text-slate-600 text-lg">
                        <p className="font-semibold text-slate-900">{CONTACT_INFO.address.line1}</p>
                        <p>{CONTACT_INFO.address.line2}</p>
                        <p>{CONTACT_INFO.address.line3}</p>
                        <p>
                          {CONTACT_INFO.address.pincode}, {CONTACT_INFO.address.country}
                        </p>
                      </div>
                      <p className="text-sm text-slate-500 mt-4">
                        Currently operating remotely. Office visits by appointment only.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>

        {/* Section 6: Team */}
        <section id="team" className="section">
            <div className="content">
              <div className="min-h-screen bg-gradient-to-br py-10 from-blue-50 to-blue-100 flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="text-center mb-6 md:mb-16">
                    <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-300"><Sparkles /> Meet the Co-Founder</Badge>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 md:mb-6">The visionary behind Likh.AI</h2>
                    <p className="text-lg text-slate-600">
                      Building for the people who power India's language industries — one keystroke at a time.
                    </p>
                  </div>

                  <div className="max-w-md mx-auto">
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl">
                      <CardContent className="p-8 text-center">
                        <Avatar className="w-32 h-32 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-blue-600">
                          <AvatarImage src="/janajit.png?height=128&width=128" alt="JB" />
                          <AvatarFallback className="text-white text-3xl font-bold">JB</AvatarFallback>
                        </Avatar>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Janajit Bagchi</h3>
                        <p className="text-blue-600 font-semibold mb-4">CEO & Co-Founder</p>
                        <p className="text-slate-600">
                          Passionate about empowering Indian language professionals with cutting-edge AI technology that
                          understands our unique linguistic needs.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Enterprise Solutions */}
          <section id="enterprise" className="section">
            <div className="content">
              <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl">
                    <CardContent className="p-8 text-center">
                      <Building className="w-14 h-14 text-blue-600 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-slate-900 mb-4">Enterprise Solutions</h3>
                      <p className="text-slate-600 mb-6 text-lg">
                        Looking for custom integrations, bulk licenses, or specialized features for your organization?
                        Let's discuss how Likh.AI can be tailored to your specific needs.
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
                          className="border-blue-600 text-blue-600 hover:bg-blue-50 bg-white px-6 py-3 rounded-full"
                          onClick={() => window.open(CONTACT_INFO.whatsappLink, "_blank")}
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          WhatsApp Us
                        </Button>
                      </div>
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600">
                        <div className="flex items-center justify-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                          Custom Integrations
                        </div>
                        <div className="flex items-center justify-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                          Bulk Licensing
                        </div>
                        <div className="flex items-center justify-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                          Priority Support
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* Section 6: FAQ */}
          <section className="section">
            <div className="content">
              <div className="min-h-screen bg-white flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-20">
                  <div className="text-center mt-4 my-4">
                    <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-300">
                      <Sparkles className="w-4 h-4 mr-1" />
                      Quick Answers
                    </Badge>
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
                    <p className="text-lg text-slate-600">
                      Can't find what you're looking for? Feel free to reach out directly.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      {
                        question: "What is Likh.AI?",
                        answer:
                          "Likh.AI is India's first platform for smart typing and intelligent writing, featuring both a Typing Assistant for Windows and a Writing Assistant for content creation.",
                      },
                      {
                        question: "Which languages do you support?",
                        answer:
                          "We currently support Hindi, Bangla, Odia, and are continuously adding more Indian languages based on user demand.",
                      },
                      {
                        question: "Is there a free trial?",
                        answer:
                          "Yes! Both our Typing Assistant and Writing Assistant offer free tiers. The Typing Assistant includes 3 months free, while the Writing Assistant offers limited free usage.",
                      },
                      {
                        question: "Do you offer enterprise solutions?",
                        answer:
                          "We provide custom integrations, bulk licensing, and specialized features for organizations of all sizes.",
                      },
                      {
                        question: "How does the Typing Assistant work?",
                        answer:
                          "Our Typing Assistant uses advanced AI to provide real-time suggestions, autocomplete, and error corrections specifically designed for Indian languages.",
                      },
                      {
                        question: "What is the Writing Assistant?",
                        answer:
                          "The Writing Assistant is a smart content generation tool that helps create blog posts, articles, social media content, and more in Indian languages.",
                      },
                      {
                        question: "Can I use it offline?",
                        answer:
                          "The Typing Assistant works offline for basic features. However, advanced AI features require internet connectivity for optimal performance.",
                      },
                      {
                        question: "What platforms do you support?",
                        answer:
                          "Our Typing Assistant is available for Windows (with other platforms coming soon). The Writing Assistant is available as a web application.",
                      },
                      {
                        question: "How accurate is the AI?",
                        answer:
                          "Our AI is specifically trained on Indian languages and contexts, providing high accuracy for regional expressions, cultural references, and linguistic nuances.",
                      },
                      {
                        question: "Can I customize the suggestions?",
                        answer:
                          "Yes! Both assistants learn from your writing style and preferences to provide increasingly personalized suggestions over time.",
                      },
                      {
                        question: "What about data privacy?",
                        answer:
                          "We prioritize your privacy. Your data is encrypted and never shared with third parties. You can review our privacy policy for complete details.",
                      },
                      {
                        question: "Do you provide customer support?",
                        answer:
                          "Yes! We offer email support, WhatsApp assistance, and priority support for enterprise customers with dedicated account managers.",
                      },
                      {
                        question: "How do I get started?",
                        answer:
                          "Simply sign up for free on our website. You can immediately start using the Writing Assistant and download the Typing Assistant for Windows.",
                      },
                      {
                        question: "Can I cancel my subscription anytime?",
                        answer:
                          "Absolutely! You can cancel your subscription at any time. No long-term commitments or cancellation fees.",
                      },
                      {
                        question: "Do you offer training sessions?",
                        answer:
                          "Yes! We provide onboarding sessions and training workshops for teams and enterprises to maximize productivity with our tools.",
                      },
                    ].map((faq, index) => (
                      <Card key={index} className="border-0 shadow-md bg-gradient-to-r from-blue-50 to-blue-100 hover:shadow-lg transition-shadow duration-300">
                        <CardContent className="p-6">
                          <h4 className="text-lg font-bold text-slate-900 mb-3">{faq.question}</h4>
                          <p className="text-slate-600 text-sm leading-relaxed">{faq.answer}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}

export default ContactPage
