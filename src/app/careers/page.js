"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
    Users,
    Heart,
    Lightbulb,
    Target,
    Coffee,
    Code,
    Palette,
    ArrowLeft,
    Bell,
    Rocket,
    Building,
    Globe,
    CheckCircle,
    Sparkles,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"
import Image from "next/image"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const CareersPage = () => {
    const [isVisible, setIsVisible] = useState(false)
    const [email, setEmail] = useState("")
    const router = useRouter();
    const [activeTab, setActiveTab] = useState(0);


    useEffect(() => {
        setIsVisible(true)
    }, [])

    const values = [
        {
            icon: Heart,
            title: "Build for Bharat",
            description: "We're passionate about empowering Indian language professionals with cutting-edge technology.",
        },
        {
            icon: Lightbulb,
            title: "Innovation First",
            description: "We challenge the status quo and build solutions that didn't exist before.",
        },
        {
            icon: Users,
            title: "Team Spirit",
            description: "We believe in collaboration, mutual respect, and growing together as a team.",
        },
        {
            icon: Target,
            title: "Impact Driven",
            description: "Every line of code, every design decision, every feature is built to make a real difference.",
        },
    ]

    const futureRoles = [
        {
            category: "Engineering",
            icon: Code,
            roles: ["C# .NET Developer", "AI/ML Engineer", "Backend Developer", "Frontend Developer"],
        },
        {
            category: "Design",
            icon: Palette,
            roles: ["UI/UX Designer", "Product Designer", "Graphics Designer", "Brand Designer"],
        },
        {
            category: "Product",
            icon: Target,
            roles: ["Product Manager", "Technical Writer", "QA Engineer", "Data Analyst"],
        },
        {
            category: "Growth",
            icon: Rocket,
            roles: ["Marketing Manager", "Community Manager", "Sales Associate", "Content Creator"],
        },
    ]

    const handleNotifySubmit = () => {
        if (email && email.includes("@")) {
            toast.success("Thank you for your interest!", {
                description: "We'll notify you when positions open up. Keep an eye on your inbox!",
            })
            setEmail("")
        } else {
            toast.error("Please enter a valid email address", {
                description: "We need a valid email to notify you about job openings.",
            })
        }
    }

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 min-w-screen">
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
                                    <a href="#culture" className="text-slate-600 hover:text-slate-900 transition-colors">
                                        Culture
                                    </a>
                                    <a href="#future-roles" className="text-slate-600 hover:text-slate-900 transition-colors">
                                        Future Roles
                                    </a>
                                    <Link href="/contact" className="text-slate-600 hover:text-slate-900 transition-colors">
                                        Contact
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </nav>

                    {/* Section 1: Hero */}
                    <section className="section">
                        <div className="content mt-15">
                            <div className="relative min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="relative min-h-screen text-center flex flex-col gap-10 items-center justify-start pt-20">
                                    <Badge className="mb-6 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300">
                                        <Building className="w-4 h-4 mr-1" />
                                        Join Our Mission
                                    </Badge>

                                    <h1
                                        className={`text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 transition-all duration-1000 transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                                            }`}
                                    >
                                        <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                                            Build the Future of
                                        </span>
                                        <br />
                                        <span className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 bg-clip-text text-transparent">
                                            Indian Language Tech
                                        </span>
                                    </h1>

                                    <p
                                        className={`text-xl sm:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto transition-all duration-1000 delay-300 transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                                            }`}
                                    >
                                        We're building the smartest typing assistant for India's language professionals.
                                        <span className="text-blue-600 font-semibold"> Join us in revolutionizing</span> how Bharat writes,
                                        types, and creates.
                                    </p>


                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="section">
                        <div className="content">
                            <div className="min-h-screen bg-white flex items-center">
                                <div
                                    className={`bg-white border flex flex-col items-center border-blue-200 rounded-2xl p-8 max-w-2xl mx-auto mb-12 transition-all duration-1000 delay-500 transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                                        }`}
                                >
                                    <div className="flex items-center justify-center mb-4">
                                        <Coffee className="w-8 h-8 text-blue-500 mr-3" />
                                        <h2 className="text-2xl font-bold text-slate-900">We're Still Building</h2>
                                    </div>
                                    <p className="text-lg text-slate-600 mb-6">
                                        No current positions are open, but we're growing fast. We'll be hiring soon for exciting roles
                                        across engineering, design, product, and growth.
                                    </p>
                                    <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-base">
                                        <Bell className="w-4 h-4 mr-2" />
                                        Get notified when we start hiring
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Our Values */}
                    <section id="culture" className="section">
                        <div className="content">
                            <div className="min-h-screen bg-white flex items-center">
                                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                                    <div className="text-center mb-16">
                                        <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-300">
                                            <Sparkles className="w-4 h-4 mr-1" />
                                            Our Culture
                                        </Badge>
                                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">What Drives Us Every Day</h2>
                                        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                                            At Likh.AI, we're not just building software — we're crafting the future of how India communicates
                                            in its native languages.
                                        </p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        {values.map((value, index) => (
                                            <Card
                                                key={index}
                                                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-b from-blue-50 to-blue-100"
                                            >
                                                <CardContent className="px-4 py-2">
                                                    <div className="flex flex-row gap-4">
                                                        <value.icon className="w-8 h-8 text-blue-500 mb-4" />
                                                        <h3 className="text-xl font-bold text-slate-900 mb-3">{value.title}</h3>
                                                    </div>
                                                    <p className="text-slate-600">{value.description}</p>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Future Roles */}
                    <section id="future-roles" className="section">
                        <div className="content">
                            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center">
                                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                                    <div className="text-center mb-16">
                                        <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-300">
                                            <Rocket className="w-4 h-4 mr-1" />
                                            Coming Soon
                                        </Badge>
                                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">Roles We'll Be Hiring For</h2>
                                        <p className="text-lg text-slate-600">
                                            As we grow, we'll be looking for talented individuals across multiple disciplines
                                        </p>
                                    </div>
                                    <div className="w-full mx-auto">
                                        {/* Tab List */}
                                        <div className="grid grid-cols-3 md:grid-cols-4 border-b mb-6">
                                            {futureRoles.map((role, idx) => (
                                                <button
                                                    key={role.category}
                                                    className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors border-b-2 -mb-px
              ${activeTab === idx
                                                            ? "border-blue-600 text-blue-600"
                                                            : "border-transparent text-slate-500 hover:text-blue-600"}
            `}
                                                    onClick={() => setActiveTab(idx)}
                                                    type="button"
                                                >
                                                    <role.icon className="w-5 h-5" />
                                                    {role.category}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Tab Panel */}
                                        <div className="bg-white rounded-lg shadow p-6">
                                            <h3 className="text-lg font-semibold mb-4 text-blue-700 flex items-center gap-2">
                                            {/* <futureRoles[activeTab].icon className="w-6 h-6" /> */}
                                                {futureRoles[activeTab].category}
                                            </h3>
                                            <ul className="list-disc pl-6 space-y-2">
                                                {futureRoles[activeTab].roles.map((r) => (
                                                    <li key={r} className="text-slate-700">{r}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 4: Why Work With Us */}
                    <section className="section">
                        <div className="content">
                            <div className="min-h-screen bg-white flex items-center">
                                <div className="max-w-7xl mx-auto px-4 mb-12 md:mb-0 sm:px-6 lg:px-8 w-full">
                                    <div className="text-center mt-12 md:mt-0 mb-16">
                                        <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-300">
                                            <Heart className="w-4 h-4 mr-1" />
                                            Why Likh.AI?
                                        </Badge>
                                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">Why Join Our Mission?</h2>
                                        <p className="text-lg text-slate-600">Be part of something bigger than just another tech company</p>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-8">
                                        {[
                                            {
                                                icon: Globe,
                                                title: "Massive Impact",
                                                description:
                                                    "Your work will directly impact millions of Indian language users across industries.",
                                            },
                                            {
                                                icon: Rocket,
                                                title: "Ground Floor Opportunity",
                                                description: "Join us early and help shape the product, culture, and future of the company.",
                                            },
                                            {
                                                icon: Heart,
                                                title: "Purpose-Driven Mission",
                                                description:
                                                    "Work on something meaningful that preserves and promotes India's linguistic diversity.",
                                            },
                                        ].map((reason, index) => (
                                            <Card
                                                key={index}
                                                className="border-0 shadow-lg text-center hover:shadow-xl transition-all duration-300 bg-gradient-to-b from-blue-50 to-blue-100"
                                            >
                                                <CardContent className="p-8">
                                                    <reason.icon className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                                                    <h3 className="text-xl font-bold text-slate-900 mb-3">{reason.title}</h3>
                                                    <p className="text-slate-600">{reason.description}</p>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 5: Notify Me */}
                    <section className="section">
                        <div className="content">
                            <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-200 flex items-center">
                                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
                                    <Rocket className="w-16 h-16 mx-auto mb-6 text-blue-500" />
                                    <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-slate-900">Be the First to Know</h2>
                                    <p className="text-xl mb-8 text-slate-700">
                                        Get notified when we start hiring. Be part of the team that's revolutionizing Indian language
                                        technology.
                                    </p>

                                    <div className="max-w-md mx-auto">
                                        <div className="flex gap-3 items-center">
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="Enter your email"
                                                className="flex-1 px-4 py-3 rounded-lg text-slate-900 ring-1 ring-blue-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <Button
                                                onClick={handleNotifySubmit}
                                                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
                                            >
                                                <Bell className="w-4 h-4 mr-2" />
                                                Notify Me
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-slate-600">
                                        <div className="flex items-center">
                                            <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                                            No spam, ever
                                        </div>
                                        <div className="flex items-center">
                                            <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                                            Unsubscribe anytime
                                        </div>
                                        <div className="flex items-center">
                                            <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                                            Early access opportunities
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

export default CareersPage
