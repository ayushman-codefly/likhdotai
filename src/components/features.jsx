"use client"
import { Badge } from "@/components/ui/badge"
import { Sparkles, CheckCircle } from "lucide-react"
import { useRef, useState, useEffect } from "react"

export const features = [
  {
    title: "Smart Typing Wizard",
    header: "Your AI-Powered Content Assistant",
    description:
      "Experience the future of content creation with our Smart Typing Wizard - an intelligent assistant that learns your writing style and generates content at lightning speed.",
    bullets: [
      "Learns your unique writing style and brand voice",
      "Generates content 5x faster than traditional methods",
      "Creates platform-ready content for blogs, social media, and more",
      "Maintains consistency across all your communications",
    ],
    image: "/images/wizard.gif",
    category: "writing"
  },
  {
    title: "Voice & Brand Learning",
    header: "Content That Sounds Like You",
    description:
      "Upload your existing content or brand guidelines, and our AI learns to write exactly like you or your brand - no more generic, robotic content.",
    bullets: [
      "Analyzes your LinkedIn/Twitter posts for style patterns",
      "Learns from your brand guidelines and past content",
      "Maintains your unique voice across all platforms",
      "Adapts to different content types and audiences",
    ],
    image: "/images/docupload.gif",
    category: "writing"
  },
  {
    title: "Multi-Platform Content Generation",
    header: "One Input, Multiple Outputs",
    description:
      "Generate content for every platform with a single prompt - from professional blogs to engaging social media posts, all optimized for their specific audiences.",
    bullets: [
      "Blog posts, social media captions, product updates",
      "Platform-specific optimization (LinkedIn, Twitter, Instagram)",
      "SEO-friendly content with keyword suggestions",
      "Built-in image generation for visual content",
    ],
    image: "/images/ai-chat.gif",
    category: "writing"
  },
  {
    title: "Speech to Text",
    header: "Speak to Type Instantly",
    description:
      "Convert spoken Hindi, Oriya, or Bangla into written text—fast, accurate, and ideal for multitasking or accessibility.",
    bullets: [
      "Speak instead of typing",
      "Fast dictation for notes or ideas",
      "Useful for users with limited mobility",
      "High accuracy even in regional accents",
    ],
    image: "/images/stt.gif",
    category: "typing"
  },
  {
    title: "Phonetic Typing",
    header: "Type as You Speak",
    description:
      "Easily type in Hindi, Oriya, or Bangla using familiar English spellings with smart phonetic conversion.",
    bullets: [
      "No need to learn native keyboard layouts",
      "Converts English input to native script instantly",
      "Makes typing accessible for all age groups",
    ],
    image: "/images/phonetic.gif",
    category: "typing"
  },
  {
    title: "Inscript Typing",
    header: "Master Native Layouts",
    description:
      "Supports standard Inscript layouts for Hindi, Oriya, and Bangla—perfect for experienced users and formal documentation.",
    bullets: [
      "Follows government-approved typing standards",
      "Ideal for professional and official use",
      "Compatible with existing typing training",
      "Familiar for certified typists and exam aspirants",
    ],
    image: "/images/inscript.gif",
    category: "typing"
  },
  {
    title: "Smart Spell Checker",
    header: "Catch Mistakes Instantly",
    description:
      "Detects and corrects spelling errors in Hindi, Oriya, and Bangla with context-aware suggestions in real-time.",
    bullets: [
      "Real-time correction as you type",
      "Understands phonetic and script-based errors",
      "Boosts accuracy in professional content",
      "Learns from usage to improve suggestions",
    ],
    image: "/images/spellcheck.gif",
    category: "typing"
  },
  {
    title: "Indic Grammar Checker",
    header: "Write with Confidence",
    description:
      "Automatically checks grammar and sentence structure in Indic languages, offering intelligent suggestions for clearer writing.",
    bullets: [
      "Flags grammatical errors as you type",
      "Suggests proper sentence construction",
      "Supports better language learning",
      "Enhances the quality of your writing",
    ],
    image: "/images/spellcheck.gif",
    category: "typing"
  }
]

const FeatureSection = () => {
  const [activeSection, setActiveSection] = useState(0)
  const sectionRefs = useRef([])
  const imageRef = useRef(null)

  useEffect(()=>{
    console.log(imageRef.current)
  },[imageRef.current])

  useEffect(() => {
    const observers = []

    sectionRefs.current.forEach((section, index) => {
      if (section) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setActiveSection(index)
              }
            })
          },
          {
            threshold: 0.5,
            rootMargin: "-20% 0px -20% 0px",
          },
        )

        observer.observe(section)
        observers.push(observer)
      }
    })

    return () => {
      observers.forEach((observer) => observer.disconnect())
    }
  }, [])

  return (
    <div id="features" className="relative min-w-screen flex flex-col gap-0">
      <style>{`
        /* Default styles for all screen sizes */
        #features-image{
            animation: fade-in linear;
            animation-timeline: view();
            animation-range: entry;
        }
        @keyframes fade-in {
                    from {scale: .6; opacity:0;}
                    to {scale: 1; opacity:1;}
        }
      `}</style>
      
      {/* Section Header */}
      <div className="text-center py-20 bg-gradient-to-br from-blue-50 to-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge className="mb-6 bg-gradient-to-r from-blue-100 to-slate-100 text-blue-800 border-blue-300">
            <Sparkles className="w-4 h-4 mr-1" />
            One Platform, Two Powerful Assistants
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Features That Transform How You Create Content
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            From precision typing in Indian languages to AI-powered content generation, discover features designed for both professional accuracy and creative scale.
          </p>
        </div>
      </div>
      
      <div className="flex flex-row gap-0">
        <div className="w-full md:w-1/2">
          {features.map((feature, index) => (
            <section
              key={index}
              ref={(el) => {
                sectionRefs.current[index] = el
              }}
              className={`section w-full ${index === features.length - 1 ? "md:mb-44" : ""}`}
            >
              <div className="content mt-10">
                <div className="relative w-full mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="relative text-left flex flex-col gap-4 items-start justify-center pt-20">
                    <Badge className={`mb-6 bg-gradient-to-r ${
                      feature.category === 'writing' 
                        ? 'from-blue-200 to-slate-200 text-blue-800 border-blue-300' 
                        : 'from-blue-100 to-blue-200 text-blue-800 border-blue-300'
                    }`}>
                      <Sparkles className="w-4 h-4 mr-1" />
                      {feature.category === 'writing' ? 'Writing Assistant' : 'Typing Assistant'} - {feature.title}
                    </Badge>

                    <div className="w-full flex flex-col">
                      <div className="min-w-full p-4 flex flex-col gap-4">
                        <h3 className="text-2xl sm:text-3xl lg:text-4xl leading-[1.5] font-bold mb-6 transition-all duration-1000 transform">
                          <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                            {feature.header}
                          </span>
                        </h3>
                        <p className="text-lg text-slate-600 mb-6">{feature.description}</p>
                        <div>
                          <p className="text-lg text-slate-900 font-semibold mb-8">
                            {feature.category === 'writing' ? (
                              <>How it transforms your <span className="text-blue-700">content creation</span>:</>
                            ) : (
                              <>How it <span className="text-blue-600">helps</span> in typing:</>
                            )}
                          </p>
                          <div className="space-y-4">
                            {feature.bullets.map((point, idx) => (
                              <div key={idx} className="flex items-start space-x-3">
                                <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                                <p className="text-slate-600">{point}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {feature.category === 'writing' && (
                          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-slate-50 rounded-lg border border-blue-200">
                            <p className="text-sm text-blue-800 font-medium">
                              💡 Pro Tip: Import your existing content or brand guidelines to train the AI on your unique style. 
                              Available in web app - chat interface for easy content creation, document import on desktop version.
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="w-full visible md:hidden p-4">
                        <div
                          className={`rounded-2xl p-8 transition-all duration-700`}
                        >
                          <img
                            src={feature.image || "/vercel.svg"}
                            className="w-full rounded-lg shadow-lg"
                            alt={feature.title}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>

        <div className="sticky top-0 min-h-screen max-h-screen h-screen flex-col items-center justify-center w-1/2 hidden md:flex right-0">
          <div
            className={`rounded-2xl p-8 transition-all duration-700 ease-in-out transform`}
          >
            <img
              id="features-image"
              ref={imageRef}
              src={features[activeSection]?.image || "/vercel.svg?height=400&width=600"}
              className="w-full max-w-lg rounded-lg shadow-2xl transition-all duration-500 ease-in-out transform hover:scale-107"
              alt={features[activeSection]?.title || "Feature image"}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeatureSection
