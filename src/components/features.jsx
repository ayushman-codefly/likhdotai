"use client"
import { Badge } from "@/components/ui/badge"
import { Sparkles, CheckCircle } from "lucide-react"
import { useRef, useState, useEffect } from "react"

export const features = [
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
  },
  {
    title: "Chat Completions",
    header: "Chat with AI for content creation",
    description:
      "Chat with AI for content creation, editing, and more using pre defined wizard or write your own prompt",
    bullets: [
      "Context-aware content output",
      "Avoids stiff, word-for-word results", 
      "Great for social media or creative use",
      "Be more productive in content creation",
    ],
    image: "/images/ai-chat.gif",
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
  },
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
    <div id="features" className="relative min-w-screen flex flex-row gap-0">
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
      <div className="w-full md:w-1/2">
        {features.map((feature, index) => (
          <section
            key={index}
            ref={(el) => {
              sectionRefs.current[index] = el
            }}
            className="section w-full"
          >
            <div className="content mt-10">
              <div className="relative w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative text-left flex flex-col gap-4 items-start justify-center pt-20">
                  <Badge className="mb-6 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300">
                    <Sparkles className="w-4 h-4 mr-1" />
                    {feature.title}
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
                          How it <span className="text-orange-600">helps</span> in typing?
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

        {/* Progress indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {features.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === activeSection ? "bg-slate-800 w-8" : "bg-slate-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default FeatureSection
