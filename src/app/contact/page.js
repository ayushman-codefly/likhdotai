"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Mail, Phone, Clock, Linkedin, Building, Sparkles, MapPin } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import Link from "next/link"

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
      <style>{`
        /* Default styles for all screen sizes */
        body {
          background-color: #f8fafc;
        }

        main {
          padding-bottom: 80px; /* Space for fixed footer */
        }

        /* Scroll-snap styles only for md screens and larger */
        @media (min-width: 768px) {
          html {
            scroll-snap-type: y mandatory;
            timeline-scope: --section, --main, --site-header;
          }

          main {
            view-timeline: --main;
            padding-bottom: 80px; /* Space for fixed footer */
          }

          .section {
            scroll-snap-align: start;
            scroll-snap-stop: always;
            view-timeline: --section;
            height: 100dvh;
            min-height: 100vh;
          }

          .content {
            overflow: hidden;
            position: fixed;
            inset: 0;
            --contrast: 2;
            --blur: 0.3rem;
            animation: blink ease-in-out both;
            animation-timeline: --section;
            background: linear-gradient(135deg, #dbeafe 0%, #ffffff 50%, #dbeafe 100%);
          }
        }

        @keyframes blink {
          0%,
          100% {
            filter: blur(var(--blur)) contrast(var(--contrast));
            opacity: 0;
            visibility: hidden;
          }

          50% {
            filter: blur(0) contrast(1);
            opacity: 1;
            visibility: visible;
          }
        }
      `}</style>

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
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                      Likh.AI
                    </span>
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
        <section className="section">
            <div className="content">
              <div className="min-h-screen bg-gradient-to-br py-10 from-blue-50 to-blue-100 flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="text-center mb-6 md:mb-16">
                    <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-300"><Sparkles /> Meet the Founder</Badge>
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
                        <p className="text-blue-600 font-semibold mb-4">CEO & Founder</p>
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
          <section className="section">
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
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-20 md:mb-0">
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

                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      {
                        question: "What is Likh.AI?",
                        answer:
                          "Likh.AI is an AI-powered typing assistant designed specifically for Indian languages, helping professionals type faster and more accurately.",
                      },
                      {
                        question: "Which languages do you support?",
                        answer:
                          "We currently support Hindi, Bangla, Odia, and are continuously adding more Indian languages based on user demand.",
                      },
                      {
                        question: "Is there a free trial?",
                        answer:
                          "Yes! We offer 3 months completely free, no payment required. After that, it's just ₹5000/year.",
                      },
                      {
                        question: "Do you offer enterprise solutions?",
                        answer:
                          "We provide custom integrations, bulk licensing, and specialized features for organizations.",
                      },
                    ].map((faq, index) => (
                      <Card key={index} className="border-0 shadow-md bg-gradient-to-r from-blue-50 to-blue-100">
                        <CardContent className="p-6">
                          <h4 className="text-lg font-bold text-slate-900 mb-2">{faq.question}</h4>
                          <p className="text-slate-600">{faq.answer}</p>
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
