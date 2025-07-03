import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  CheckCircle,
  ArrowRight,
  Sparkles,
  Mail,
  Phone,
  Keyboard,
  PenTool,
  Download,
  ExternalLink,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import FeatureSection from "@/components/features"
import WhoWeServeSection from "@/components/usecase"
import WhySignUpSection from "@/components/whysignup"
import PricingSection from "@/components/pricing"
import Navigation from "@/components/navigation"
import Link from "next/link"
import Image from "next/image"

const CompleteScrollSnapLanding = () => {

  return (
    <>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <main>
          {/* Navigation - Fixed */}
          <Navigation />

          {/* Section 1: Hero */}
          <section className="section">
            <div className="content">
              <div className="relative min-h-[80vh] max-h-[80vh] md:min-h-[90vh] md:max-h-[90vh] lg:min-h-[100vh] lg:max-h-[100vh] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:pt-0 items-center justify-center">
                <div className="relative min-h-full text-center flex flex-col gap-12  md:gap-8 items-center justify-start">
                  <Badge className="mb-6 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300">
                    <Sparkles className="w-4 h-4 mr-1" />
                    India's First Platform for Smart Typing & Intelligent Writing
                  </Badge>

                  <h1
                    className={`text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 transition-all duration-1000 transform`}
                  >
                    <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                      Likho with
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 bg-clip-text text-transparent">
                      Likh.AI
                    </span>
                  </h1>

                  <p
                    className={`text-xl sm:text-2xl text-slate-600 mb-8 max-w-4xl mx-auto transition-all duration-1000 delay-300 transform`}
                  >
                    Type faster in Indian languages with our <span className="text-blue-600 font-semibold">Typing Assistant</span> or create powerful marketing content with <span className="text-blue-700 font-semibold">Writing Assistant</span>.
                  </p>

                  <div
                    className={`flex flex-col gap-4 justify-center items-center transition-all duration-1000 delay-500 transform`}
                  >
                    <Link
                      href={"/signup"}
                      size="lg"
                      className=" flex flex-row items-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 text-lg rounded-md shadow-lg hover:shadow-xl transition-all duration-300 group"
                    >
                      Join Free
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <p className="text-sm text-slate-500">Experience the future of Indian language content creation.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Why We Exist */}
          <section className="section">
            <div className="content">
              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative text-left flex flex-col gap-4 items-start justify-start">
                  <Badge className="mb-6 bg-gradient-to-r from-blue-100 to-slate-100 text-blue-800 border-blue-300">
                    <Sparkles className="w-4 h-4 mr-1" />
                    Why We Exist
                  </Badge>

                  <h3
                    className={`text-3xl sm:text-4xl lg:text-5xl leading-[1.5] font-bold mb-6 transition-all duration-1000 transform`}
                  >
                    <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                      Bridging the Gap in India's Content Ecosystem
                    </span>
                  </h3>
                  <p className="text-lg text-slate-600 mb-6">
                    The Indian content ecosystem is stuck between outdated tools for typing in Indian languages and generic AI writing apps that ignore voice, style, and brand identity. Likh.AI bridges this gap with two focused solutions:
                  </p>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <Keyboard className="w-8 h-8 text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="text-xl font-semibold text-slate-900 mb-2">Typing Assistant</h4>
                        <p className="text-slate-600">Helps Indian language professionals type faster and more accurately using phonetic, voice-based, and grammar-aware tools.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <PenTool className="w-8 h-8 text-blue-700 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="text-xl font-semibold text-slate-900 mb-2">Smart Wizard (Writing Assistant)</h4>
                        <p className="text-slate-600">Learns your unique writing style or brand voice and generates platform-ready content — from blogs to social posts — tailored to your goals.</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8">
                    <p className="text-lg text-slate-900 font-semibold">
                      <span className="text-orange-600">Likh.AI</span> is the modern content platform for both precision and scale, created for Bharat's real linguistic and creative needs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Choose Your Journey */}
          <section className="section">
            <div className="content">
              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-16">
                  <Badge className="mb-6 bg-gradient-to-r from-blue-100 to-slate-100 text-blue-800 border-blue-300">
                    <Sparkles className="w-4 h-4 mr-1" />
                    Choose Your Journey
                  </Badge>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                    Two Powerful Assistants, One Platform
                  </h2>
                  <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                    Whether you need precision typing or creative content generation, we've got you covered.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Left Block: Typing Assistant */}
                  <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl overflow-hidden">
                    <CardContent className="p-8">
                      <div className="text-center mb-6">
                        <div className="w-24 h-24 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Keyboard className="w-12 h-12 text-white" />
                        </div>
                        <Badge className="mb-4 bg-white text-blue-800 border-blue-300">
                          Type Smarter
                        </Badge>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-slate-900 mb-4 text-center">
                        Typing Assistant
                      </h3>
                      
                      <p className="text-slate-600 mb-6 text-center">
                        Boost your typing speed and accuracy with phonetic input, voice typing, grammar correction, and offline tools designed for Indian language professionals.
                      </p>
                      
                      <div className="space-y-3 mb-8">
                        {[
                          "Phonetic + voice input",
                          "Works offline",
                          "Integrates with legacy tools"
                        ].map((feature, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                            <span className="text-slate-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      <button className="w-full bg-blue-50 text-blue-600 px-6 py-3 rounded-lg font-medium cursor-not-allowed">
                        <Download className="w-4 h-4 mr-2 inline" />
                        Coming Soon
                      </button>
                    </CardContent>
                  </Card>

                  {/* Right Block: Writing Assistant */}
                  <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-100 to-blue-100 rounded-3xl overflow-hidden">
                    <CardContent className="p-8">
                      <div className="text-center mb-6">
                        <div className="w-24 h-24 bg-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <PenTool className="w-12 h-12 text-white" />
                        </div>
                        <Badge className="mb-4 bg-white text-blue-800 border-blue-300">
                          Smart Wizard
                        </Badge>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-slate-900 mb-4 text-center">
                        Writing Assistant
                      </h3>
                      
                      <p className="text-slate-600 mb-6 text-center">
                        AI-powered assistant that generates social media posts, blogs, product updates and more in your personal or brand tone at 5x fast speed.
                      </p>
                      
                      <div className="space-y-3 mb-8">
                        {[
                          "AI-powered content generation",
                          "Multi-language",
                          "Personal & Brand voice learning"
                        ].map((feature, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                            <span className="text-slate-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      <Link
                        href="/dashboard"
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Try Smart Wizard
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Features */}
          <FeatureSection  />

          {/* Section 5: Use Cases */}
          <WhoWeServeSection />

          {/* Section 6: Why Sign Up */}
          <WhySignUpSection />

          {/* Pricing Section */}
          <PricingSection />

          {/* Section 7: Team */}
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

          {/* Section 8: Contact */}
          <section className="section">
            <div className="content">
              <div className="my-20 pb-40 bg-white flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="flex flex-col md:flex-row items-center justify-between pt-20 gap-0 md:gap-10">

                    {/* Left Content */}
                    <div className="w-full md:w-1/2 flex flex-col gap-6">
                      <Badge className="bg-blue-100 text-blue-800 w-max mb-2"><Sparkles /> Get in Touch</Badge>

                      <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                        Ready to transform your typing experience?
                      </h2>

                      <p className="text-lg text-slate-600">
                        Have questions? Want to discuss enterprise solutions? We'd love to hear from you.
                      </p>

                      {/* Contact Options */}
                      <div className="space-y-6 mt-4">
                        <div className="flex items-start gap-4">
                          <Mail className="w-8 h-8 text-blue-600 mt-1" />
                          <div>
                            <h3 className="text-xl font-semibold text-slate-900">Email Us</h3>
                            <p className="text-slate-600 text-sm mb-1">For general inquiries and support</p>
                            <a
                              href="mailto:contact@likh.ai"
                              className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
                            >
                              contact@likh.ai
                            </a>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <Phone className="w-8 h-8 text-blue-600 mt-1" />
                          <div>
                            <h3 className="text-xl font-semibold text-slate-900">WhatsApp</h3>
                            <p className="text-slate-600 text-sm mb-1">Quick questions and instant support</p>
                            <a
                              href="https://wa.me/919933972298"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
                            >
                              +91 99339 72298
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Image */}
                    <div className="w-full md:w-1/2 p-4">
                      {/* Enterprise CTA */}
                      <div className="mt-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Enterprise Solutions</h3>
                        <p className="text-slate-600 mb-4">
                          Looking for custom integrations, bulk licenses, or specialized features for your organization?
                          Let's discuss how Likh.AI can be tailored to your specific needs.
                        </p>
                        <Link
                          href="mailto:contact@likh.ai?subject=Enterprise Solutions Inquiry"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-sm transition-all duration-300"
                        >
                          Contact for Enterprise
                        </Link>
                      </div>
                    </div>
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

export default CompleteScrollSnapLanding
